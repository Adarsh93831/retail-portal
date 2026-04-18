const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  setAuthCookies,
  clearAuthCookies,
  createAccessToken,
} = require("../utils/generateTokens");

const sanitizeUser = (userDoc) => {
  return {
    _id: userDoc._id,
    name: userDoc.name,
    email: userDoc.email,
    role: userDoc.role,
    createdAt: userDoc.createdAt,
    updatedAt: userDoc.updatedAt,
  };
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered.",
        code: "EMAIL_ALREADY_EXISTS",
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: "customer",
    });

    const tokenData = setAuthCookies(res, user);
    user.refreshToken = tokenData.refreshToken;
    await user.save();

    return res.status(201).json({
      success: true,
      data: { user: sanitizeUser(user) },
      message: "User registered successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to register user.",
      code: "REGISTER_FAILED",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        code: "INVALID_CREDENTIALS",
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        code: "INVALID_CREDENTIALS",
      });
    }

    const tokenData = setAuthCookies(res, user);
    user.refreshToken = tokenData.refreshToken;
    await user.save();

    return res.status(200).json({
      success: true,
      data: { user: sanitizeUser(user) },
      message: "Login successful.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to login user.",
      code: "LOGIN_FAILED",
    });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
    }

    clearAuthCookies(res);

    return res.status(200).json({
      success: true,
      data: null,
      message: "Logout successful.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to logout user.",
      code: "LOGOUT_FAILED",
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing.",
        code: "REFRESH_TOKEN_MISSING",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token.",
        code: "INVALID_REFRESH_TOKEN",
      });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== incomingRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is not valid for this user.",
        code: "REFRESH_TOKEN_MISMATCH",
      });
    }

    const tokenData = setAuthCookies(res, user);
    user.refreshToken = tokenData.refreshToken;
    await user.save();

    return res.status(200).json({
      success: true,
      data: {
        accessToken: createAccessToken(user),
      },
      message: "Access token refreshed successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to refresh token.",
      code: "REFRESH_TOKEN_FAILED",
    });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
        code: "USER_NOT_FOUND",
      });
    }

    return res.status(200).json({
      success: true,
      data: { user },
      message: "Current user profile fetched successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch current user.",
      code: "FETCH_ME_FAILED",
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  me,
};
