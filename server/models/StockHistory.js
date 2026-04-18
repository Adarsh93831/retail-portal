const mongoose = require("mongoose");

const stockHistorySchema = new mongoose.Schema(
  {
    /** Product whose stock was modified. */
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    /** Stock value before the admin update. */
    previousStock: {
      type: Number,
      required: true,
      min: 0,
    },
    /** Stock value after the admin update. */
    newStock: {
      type: Number,
      required: true,
      min: 0,
    },
    /** Admin user who changed the stock value. */
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    /** Human-readable reason for this stock update. */
    reason: {
      type: String,
      default: "Manual update",
      trim: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("StockHistory", stockHistorySchema);
