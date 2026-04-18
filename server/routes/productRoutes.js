const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { verifyAccessToken } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

const router = express.Router();

/**
 * Validates request body and returns standardized validation errors.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      code: "VALIDATION_ERROR",
      data: errors.array(),
    });
  }

  next();
};

/**
 * @route   GET /api/products
 * @desc    Returns products with optional filtering, search, and pagination.
 * @access  Public
 */
router.get("/", getProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Returns one product with populated category and combos.
 * @access  Public
 */
router.get("/:id", getProductById);

/**
 * @route   POST /api/products
 * @desc    Creates a product with image, pricing, add-ons, and combos.
 * @access  Private (Admin only)
 */
router.post(
  "/",
  verifyAccessToken,
  requireAdmin,
  upload.single("image"),
  [
    body("title").trim().notEmpty().withMessage("Product title is required."),
    body("description").trim().notEmpty().withMessage("Product description is required."),
    body("cost").isNumeric().withMessage("Product cost must be numeric."),
    body("category").notEmpty().withMessage("Product category is required."),
    handleValidationErrors,
  ],
  createProduct
);

/**
 * @route   PUT /api/products/:id
 * @desc    Updates any editable product field and optional image.
 * @access  Private (Admin only)
 */
router.put("/:id", verifyAccessToken, requireAdmin, upload.single("image"), updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Deletes a product by ID.
 * @access  Private (Admin only)
 */
router.delete("/:id", verifyAccessToken, requireAdmin, deleteProduct);

module.exports = router;
