const Category = require("../models/Category");
const { cloudinary } = require("../config/cloudinary");


const uploadImageToCloudinary = async (file, folderName) => {
  const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const uploaded = await cloudinary.uploader.upload(base64Image, { folder: folderName });
  return uploaded.secure_url;
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: categories,
      message: "Categories fetched successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories.",
      code: "FETCH_CATEGORIES_FAILED",
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
        code: "CATEGORY_NOT_FOUND",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
      message: "Category fetched successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch category.",
      code: "FETCH_CATEGORY_FAILED",
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists.",
        code: "CATEGORY_EXISTS",
      });
    }

    let logoUrl = "";
    if (req.file) {
      logoUrl = await uploadImageToCloudinary(req.file, "retail-portal/categories");
    }

    const category = await Category.create({
      name: name.trim(),
      description: description || "",
      logo: logoUrl,
    });

    return res.status(201).json({
      success: true,
      data: category,
      message: "Category created successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create category.",
      code: "CREATE_CATEGORY_FAILED",
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
        code: "CATEGORY_NOT_FOUND",
      });
    }

    if (req.body.name) {
      category.name = req.body.name.trim();
    }

    if (req.body.description !== undefined) {
      category.description = req.body.description;
    }

    if (req.file) {
      category.logo = await uploadImageToCloudinary(req.file, "retail-portal/categories");
    }

    const updatedCategory = await category.save();

    return res.status(200).json({
      success: true,
      data: updatedCategory,
      message: "Category updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update category.",
      code: "UPDATE_CATEGORY_FAILED",
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
        code: "CATEGORY_NOT_FOUND",
      });
    }

    await category.deleteOne();

    return res.status(200).json({
      success: true,
      data: null,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete category.",
      code: "DELETE_CATEGORY_FAILED",
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
