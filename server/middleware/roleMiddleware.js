
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required for this action.",
      code: "ADMIN_ONLY",
    });
  }

  next();
};


const requireCustomer = (req, res, next) => {
  if (!req.user || req.user.role !== "customer") {
    return res.status(403).json({
      success: false,
      message: "Customer access required for this action.",
      code: "CUSTOMER_ONLY",
    });
  }

  next();
};

module.exports = { requireAdmin, requireCustomer };
