const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
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
 * @route   GET /api/categories
 * @desc    Returns all categories for storefront and admin listings.
 * @access  Public
 */
router.get("/", getAllCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Returns a single category by ID.
 * @access  Public
 */
router.get("/:id", getCategoryById);

/**
 * @route   POST /api/categories
 * @desc    Creates a new category with optional logo upload.
 * @access  Private (Admin only)
 */
router.post(
  "/",
  verifyAccessToken,
  requireAdmin,
  upload.single("logo"),
  [body("name").trim().notEmpty().withMessage("Category name is required."), handleValidationErrors],
  createCategory
);

/**
 * @route   PUT /api/categories/:id
 * @desc    Updates category details and optional logo.
 * @access  Private (Admin only)
 */
router.put(
  "/:id",
  verifyAccessToken,
  requireAdmin,
  upload.single("logo"),
  updateCategory
);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Deletes a category by ID.
 * @access  Private (Admin only)
 */
router.delete("/:id", verifyAccessToken, requireAdmin, deleteCategory);

module.exports = router;
