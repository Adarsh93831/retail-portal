const Product = require("../../models/Product");
const { inngest } = require("../client");


const lowStockAlertFunction = inngest.createFunction(
  { id: "low-stock-alert" },
  { event: "stock/updated" },
  async ({ event, step }) => {
    const { productId, newStock, threshold = 5 } = event.data;

    if (typeof newStock !== "number" || newStock >= threshold) {
      return {
        success: true,
        message: "Stock is not low. Alert skipped.",
      };
    }

    const product = await Product.findById(productId).select("title");

   
    await step.sleep("wait-before-alert", "10s");

    console.log(
      `[LOW STOCK ALERT] Product \"${product ? product.title : "Unknown Product"}\" is at stock ${newStock}. Please restock soon.`
    );

    return {
      success: true,
      message: "Low stock alert logged.",
    };
  }
);

module.exports = { lowStockAlertFunction };
