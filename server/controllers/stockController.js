const Product = require("../models/Product");
const StockHistory = require("../models/StockHistory");
const { inngest } = require("../inngest/client");

const updateStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { newStock, reason } = req.body;

    const parsedStock = Number(newStock);
    if (Number.isNaN(parsedStock) || parsedStock < 0) {
      return res.status(400).json({
        success: false,
        message: "newStock must be a non-negative number.",
        code: "INVALID_STOCK_VALUE",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
        code: "PRODUCT_NOT_FOUND",
      });
    }

    const previousStock = product.stock;
    product.stock = parsedStock;
    product.isAvailable = parsedStock > 0;
    await product.save();

    const stockHistory = await StockHistory.create({
      product: product._id,
      previousStock,
      newStock: parsedStock,
      updatedBy: req.user.id,
      reason: reason || "Manual update",
    });

    await inngest.send({
      name: "stock/updated",
      data: {
        productId: product._id.toString(),
        newStock: parsedStock,
        threshold: 5,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        product,
        stockHistory,
      },
      message: "Stock updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update stock.",
      code: "UPDATE_STOCK_FAILED",
    });
  }
};

const getStockHistory = async (req, res) => {
  try {
    const { productId } = req.params;

    const history = await StockHistory.find({ product: productId })
      .populate("updatedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: history,
      message: "Stock history fetched successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch stock history.",
      code: "FETCH_STOCK_HISTORY_FAILED",
    });
  }
};

module.exports = {
  updateStock,
  getStockHistory,
};
