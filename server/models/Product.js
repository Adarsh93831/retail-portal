const mongoose = require("mongoose");

const addOnSchema = new mongoose.Schema(
  {
    /** Add-on display name such as Extra Cheese. */
    name: {
      type: String,
      required: true,
      trim: true,
    },
    /** Additional price for selecting this add-on. */
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const comboSchema = new mongoose.Schema(
  {
    /** Product reference included in combo bundle. */
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    /** Discount percentage for this combo product. */
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    /** Primary product title shown in cards and details pages. */
    title: {
      type: String,
      required: true,
      trim: true,
    },
    /** Detailed marketing description for this product. */
    description: {
      type: String,
      required: true,
      trim: true,
    },
    /** Cloudinary URL for product image. */
    image: {
      type: String,
      default: "",
    },
    /** Base product price before tax and add-ons. */
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
    /** Percentage tax applied to this product. */
    taxPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    /** Category reference used for grouping and filtering. */
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    /** Current stock count that admin can update. */
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    /** Availability toggle controlled by admin. */
    isAvailable: {
      type: Boolean,
      default: true,
    },
    /** Optional add-ons for this product. */
    addOns: {
      type: [addOnSchema],
      default: [],
    },
    /** Optional combo product recommendations. */
    combos: {
      type: [comboSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
