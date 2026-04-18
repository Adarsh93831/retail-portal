const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { serve } = require("inngest/express");

const connectDB = require("./config/db");
const { configureCloudinary } = require("./config/cloudinary");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const stockRoutes = require("./routes/stockRoutes");
const orderRoutes = require("./routes/orderRoutes");
const aiRoutes = require("./routes/aiRoutes");
const { inngest } = require("./inngest/client");
const { lowStockAlertFunction } = require("./inngest/functions/lowStockAlert");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    data: { status: "ok" },
    message: "Retail Portal API is running.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ai", aiRoutes);

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: [lowStockAlertFunction],
  })
);

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Requested route was not found.",
    code: "ROUTE_NOT_FOUND",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  configureCloudinary();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();

module.exports = app;
