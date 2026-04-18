const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { verifyAccessToken } = require("../middleware/authMiddleware");
const { requireAdmin, requireCustomer } = require("../middleware/roleMiddleware");

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
 * @route   POST /api/orders
 * @desc    Creates a new order from customer cart items.
 * @access  Private (Customer only)
 */
router.post(
  "/",
  verifyAccessToken,
  requireCustomer,
  [body("items").isArray({ min: 1 }).withMessage("items must be a non-empty array."), handleValidationErrors],
  createOrder
);

/**
 * @route   GET /api/orders/my-orders
 * @desc    Returns order history for the logged-in customer.
 * @access  Private (Customer only)
 */
router.get("/my-orders", verifyAccessToken, requireCustomer, getMyOrders);

/**
 * @route   GET /api/orders
 * @desc    Returns all customer orders for admin management.
 * @access  Private (Admin only)
 */
router.get("/", verifyAccessToken, requireAdmin, getAllOrders);

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Updates order status from admin panel.
 * @access  Private (Admin only)
 */
router.put(
  "/:id/status",
  verifyAccessToken,
  requireAdmin,
  [body("status").notEmpty().withMessage("status is required."), handleValidationErrors],
  updateOrderStatus
);

module.exports = router;
