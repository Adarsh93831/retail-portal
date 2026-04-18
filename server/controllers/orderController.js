const Order = require("../models/Order");
const Product = require("../models/Product");


const calculateLineTotal = (product, quantity, selectedAddOns) => {
  const addOnTotalPerUnit = selectedAddOns.reduce((sum, addOn) => {
    return sum + Number(addOn.price || 0);
  }, 0);

  const subtotal = (product.cost + addOnTotalPerUnit) * quantity;
  const taxAmount = subtotal * (Number(product.taxPercent) / 100);

  return subtotal + taxAmount;
};

const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required.",
        code: "ORDER_ITEMS_REQUIRED",
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "One or more products were not found.",
          code: "ORDER_PRODUCT_NOT_FOUND",
        });
      }

      const quantity = Number(item.quantity || 1);
      if (quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be at least 1.",
          code: "INVALID_QUANTITY",
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title}.`,
          code: "INSUFFICIENT_STOCK",
        });
      }

      const selectedAddOns = Array.isArray(item.selectedAddOns) ? item.selectedAddOns : [];
      const normalizedAddOns = selectedAddOns.map((addOn) => ({
        name: addOn.name,
        price: Number(addOn.price || 0),
      }));

      const lineTotal = calculateLineTotal(product, quantity, normalizedAddOns);
      totalAmount += lineTotal;

      orderItems.push({
        product: product._id,
        title: product.title,
        image: product.image,
        quantity,
        priceAtOrder: product.cost,
        selectedAddOns: normalizedAddOns,
      });

      product.stock -= quantity;
      product.isAvailable = product.stock > 0;
      await product.save();
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount: Number(totalAmount.toFixed(2)),
      status: "pending",
    });

    const populatedOrder = await Order.findById(order._id).populate("items.product", "title image");

    return res.status(201).json({
      success: true,
      data: populatedOrder,
      message: "Order placed successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create order.",
      code: "CREATE_ORDER_FAILED",
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "title image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
      message: "User orders fetched successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user orders.",
      code: "FETCH_MY_ORDERS_FAILED",
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "title image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
      message: "All orders fetched successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch all orders.",
      code: "FETCH_ALL_ORDERS_FAILED",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["pending", "confirmed", "delivered", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
        code: "INVALID_ORDER_STATUS",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
        code: "ORDER_NOT_FOUND",
      });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      data: order,
      message: "Order status updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update order status.",
      code: "UPDATE_ORDER_STATUS_FAILED",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
