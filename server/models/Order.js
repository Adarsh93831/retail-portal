const mongoose = require("mongoose");

const selectedAddOnSchema = new mongoose.Schema(
  {
    /** Snapshot name of add-on selected at order time. */
    name: {
      type: String,
      required: true,
      trim: true,
    },
    /** Snapshot price of add-on selected at order time. */
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    /** Product reference at the time of ordering. */
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    /** Snapshot title to preserve historical order data. */
    title: {
      type: String,
      required: true,
    },
    /** Snapshot image URL to preserve historical order data. */
    image: {
      type: String,
      default: "",
    },
    /** Number of units purchased for this line item. */
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    /** Snapshot base price at the moment of order placement. */
    priceAtOrder: {
      type: Number,
      required: true,
      min: 0,
    },
    /** Add-ons selected by user for this line item. */
    selectedAddOns: {
      type: [selectedAddOnSchema],
      default: [],
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    /** User who placed the order. */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    /** Full list of ordered items with snapshots. */
    items: {
      type: [orderItemSchema],
      required: true,
      default: [],
    },
    /** Final order amount including tax and add-ons. */
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    /** Current order status for admin tracking. */
    status: {
      type: String,
      enum: ["pending", "confirmed", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
