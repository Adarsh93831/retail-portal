const jwt = require("jsonwebtoken");


const verifyAccessToken = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token missing. Please login again.",
        code: "ACCESS_TOKEN_MISSING",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token.",
      code: "INVALID_ACCESS_TOKEN",
    });
  }
};

module.exports = { verifyAccessToken };
