const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  register,
  login,
  logout,
  refreshToken,
  me,
} = require("../controllers/authController");
const { verifyAccessToken } = require("../middleware/authMiddleware");

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
 * @route   POST /api/auth/register
 * @desc    Registers a new customer account and sets auth cookies.
 * @access  Public
 */
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("email").isEmail().withMessage("Valid email is required."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
    handleValidationErrors,
  ],
  register
);

/**
 * @route   POST /api/auth/login
 * @desc    Logs in a user and sets access + refresh token cookies.
 * @access  Public
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required."),
    body("password").notEmpty().withMessage("Password is required."),
    handleValidationErrors,
  ],
  login
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logs out current user and clears auth cookies.
 * @access  Private (Any logged-in user)
 */
router.post("/logout", verifyAccessToken, logout);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refreshes access token using refresh token cookie.
 * @access  Public (requires refresh token cookie)
 */
router.post("/refresh-token", refreshToken);

/**
 * @route   GET /api/auth/me
 * @desc    Returns current authenticated user profile.
 * @access  Private (Any logged-in user)
 */
router.get("/me", verifyAccessToken, me);

module.exports = router;
