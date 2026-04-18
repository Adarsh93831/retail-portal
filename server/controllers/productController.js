const Product = require("../models/Product");
const Category = require("../models/Category");
const { cloudinary } = require("../config/cloudinary");


const uploadImageToCloudinary = async (file, folderName) => {
  const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const uploaded = await cloudinary.uploader.upload(base64Image, { folder: folderName });
  return uploaded.secure_url;
};


const parseArrayField = (rawValue, fieldName) => {
  if (rawValue === undefined || rawValue === null || rawValue === "") {
    return [];
  }

  if (Array.isArray(rawValue)) {
    return rawValue;
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      throw new Error();
    }
    return parsed;
  } catch (error) {
    throw new Error(`${fieldName} must be a valid JSON array.`);
  }
};

const getProducts = async (req, res) => {
  try {
    const { category, search = "" } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      const matchedCategories = await Category.find({ name: searchRegex }).select("_id");
      const categoryIds = matchedCategories.map((item) => item._id);

      filter.$or = [{ title: searchRegex }];
      if (categoryIds.length > 0) {
        filter.$or.push({ category: { $in: categoryIds } });
      }
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category")
        .populate("combos.product", "title image cost")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        products,
        total,
        page,
      },
      message: "Products fetched successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products.",
      code: "FETCH_PRODUCTS_FAILED",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("combos.product", "title image cost category");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
        code: "PRODUCT_NOT_FOUND",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
      message: "Product fetched successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product.",
      code: "FETCH_PRODUCT_FAILED",
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      cost,
      taxPercent,
      category,
      stock,
      isAvailable,
      addOns,
      combos,
    } = req.body;

    const parsedAddOns = parseArrayField(addOns, "addOns");
    const parsedCombos = parseArrayField(combos, "combos");

    let imageUrl = "";
    if (req.file) {
      imageUrl = await uploadImageToCloudinary(req.file, "retail-portal/products");
    }

    const product = await Product.create({
      title: title.trim(),
      description: description.trim(),
      image: imageUrl,
      cost: Number(cost),
      taxPercent: Number(taxPercent || 0),
      category,
      stock: Number(stock || 0),
      isAvailable: isAvailable === undefined ? true : isAvailable === "true",
      addOns: parsedAddOns,
      combos: parsedCombos,
    });

    const populatedProduct = await Product.findById(product._id)
      .populate("category")
      .populate("combos.product", "title image cost");

    return res.status(201).json({
      success: true,
      data: populatedProduct,
      message: "Product created successfully.",
    });
  } catch (error) {
    const isValidationError = error.message.includes("must be a valid JSON array");

    return res.status(isValidationError ? 400 : 500).json({
      success: false,
      message: isValidationError ? error.message : "Failed to create product.",
      code: isValidationError ? "INVALID_PRODUCT_FIELD" : "CREATE_PRODUCT_FAILED",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
        code: "PRODUCT_NOT_FOUND",
      });
    }

    const updatableFields = [
      "title",
      "description",
      "cost",
      "taxPercent",
      "category",
      "stock",
      "isAvailable",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (["cost", "taxPercent", "stock"].includes(field)) {
          product[field] = Number(req.body[field]);
        } else if (field === "isAvailable") {
          product[field] = req.body[field] === "true" || req.body[field] === true;
        } else {
          product[field] = req.body[field];
        }
      }
    });

    if (req.body.addOns !== undefined) {
      product.addOns = parseArrayField(req.body.addOns, "addOns");
    }

    if (req.body.combos !== undefined) {
      product.combos = parseArrayField(req.body.combos, "combos");
    }

    if (req.file) {
      product.image = await uploadImageToCloudinary(req.file, "retail-portal/products");
    }

    const updatedProduct = await product.save();

    const populatedProduct = await Product.findById(updatedProduct._id)
      .populate("category")
      .populate("combos.product", "title image cost");

    return res.status(200).json({
      success: true,
      data: populatedProduct,
      message: "Product updated successfully.",
    });
  } catch (error) {
    const isValidationError = error.message.includes("must be a valid JSON array");

    return res.status(isValidationError ? 400 : 500).json({
      success: false,
      message: isValidationError ? error.message : "Failed to update product.",
      code: isValidationError ? "INVALID_PRODUCT_FIELD" : "UPDATE_PRODUCT_FAILED",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
        code: "PRODUCT_NOT_FOUND",
      });
    }

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      data: null,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete product.",
      code: "DELETE_PRODUCT_FAILED",
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
