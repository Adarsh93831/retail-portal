const express = require("express");
const { body, validationResult } = require("express-validator");
const { updateStock, getStockHistory } = require("../controllers/stockController");
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
 * @route   PUT /api/stock/:productId
 * @desc    Updates product stock and writes a stock history record.
 * @access  Private (Admin only)
 */
router.put(
  "/:productId",
  verifyAccessToken,
  requireAdmin,
  [
    body("newStock").isNumeric().withMessage("newStock must be numeric."),
    body("reason").optional().isString().withMessage("reason must be text."),
    handleValidationErrors,
  ],
  updateStock
);

/**
 * @route   GET /api/stock/:productId/history
 * @desc    Returns stock history entries for a product.
 * @access  Private (Admin only)
 */
router.get("/:productId/history", verifyAccessToken, requireAdmin, getStockHistory);

module.exports = router;
