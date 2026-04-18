const express = require("express");
const { body, validationResult } = require("express-validator");
const { generateProductDetails } = require("../controllers/aiController");
const { verifyAccessToken } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");

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
 * @route   POST /api/ai/generate-product-details
 * @desc    Generates product description, tax, and suggested add-ons using Gemini.
 * @access  Private (Admin only)
 */
router.post(
  "/generate-product-details",
  verifyAccessToken,
  requireAdmin,
  [body("title").trim().notEmpty().withMessage("title is required."), handleValidationErrors],
  generateProductDetails
);

module.exports = router;
