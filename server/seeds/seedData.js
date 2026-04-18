const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const connectDB = require("../config/db");
const Category = require("../models/Category");
const Product = require("../models/Product");
const User = require("../models/User");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const categorySeeds = [
  {
    name: "Burgers",
    description: "Juicy burgers made fresh with bold flavors.",
    logo: "https://picsum.photos/seed/category-burgers/300/300",
  },
  {
    name: "Beverages",
    description: "Refreshing drinks for every meal.",
    logo: "https://picsum.photos/seed/category-beverages/300/300",
  },
  {
    name: "Sides",
    description: "Crispy and tasty side bites.",
    logo: "https://picsum.photos/seed/category-sides/300/300",
  },
  {
    name: "Desserts",
    description: "Sweet treats to complete your order.",
    logo: "https://picsum.photos/seed/category-desserts/300/300",
  },
];

const productSeeds = [
  {
    title: "Spicy Chicken Burger",
    description:
      "A crispy chicken patty layered with spicy mayo, fresh lettuce, and toasted buns. Perfect for spice lovers.",
    image: "https://picsum.photos/seed/product-spicy-chicken-burger/900/700",
    cost: 229,
    taxPercent: 18,
    categoryName: "Burgers",
    stock: 35,
    addOns: [
      { name: "Extra Cheese", price: 30 },
      { name: "Jalapeno Sauce", price: 20 },
      { name: "Crispy Onion", price: 25 },
    ],
    combos: [
      { productTitle: "Classic Fries", discountPercent: 10 },
      { productTitle: "Coke Float", discountPercent: 8 },
    ],
  },
  {
    title: "Classic Veg Burger",
    description:
      "A wholesome veg patty burger with fresh tomatoes, crunchy lettuce, and creamy dressing for a satisfying bite.",
    image: "https://picsum.photos/seed/product-classic-veg-burger/900/700",
    cost: 179,
    taxPercent: 12,
    categoryName: "Burgers",
    stock: 42,
    addOns: [
      { name: "Cheese Slice", price: 25 },
      { name: "Mint Mayo", price: 15 },
    ],
    combos: [{ productTitle: "Classic Fries", discountPercent: 7 }],
  },
  {
    title: "Double Crunch Burger",
    description:
      "Two crunchy patties stacked with smoky sauce and onions. Built for big hunger and bigger taste.",
    image: "https://picsum.photos/seed/product-double-crunch-burger/900/700",
    cost: 289,
    taxPercent: 18,
    categoryName: "Burgers",
    stock: 28,
    addOns: [
      { name: "Cheese Burst", price: 40 },
      { name: "Peri Peri Sprinkle", price: 18 },
    ],
    combos: [{ productTitle: "Iced Lemon Soda", discountPercent: 10 }],
  },
  {
    title: "Coke Float",
    description:
      "Classic cola served chilled with a smooth vanilla scoop for a fizzy and creamy refreshment.",
    image: "https://picsum.photos/seed/product-coke-float/900/700",
    cost: 99,
    taxPercent: 5,
    categoryName: "Beverages",
    stock: 60,
    addOns: [
      { name: "Extra Vanilla Scoop", price: 35 },
      { name: "Chocolate Drizzle", price: 20 },
    ],
    combos: [],
  },
  {
    title: "Iced Lemon Soda",
    description:
      "A zesty sparkling lemon cooler with crushed ice. Crisp, light, and perfect with spicy meals.",
    image: "https://picsum.photos/seed/product-iced-lemon-soda/900/700",
    cost: 89,
    taxPercent: 5,
    categoryName: "Beverages",
    stock: 55,
    addOns: [{ name: "Mint Boost", price: 10 }],
    combos: [],
  },
  {
    title: "Chocolate Shake",
    description:
      "Rich chocolate milkshake blended until creamy and topped with chocolate chips for extra indulgence.",
    image: "https://picsum.photos/seed/product-chocolate-shake/900/700",
    cost: 149,
    taxPercent: 5,
    categoryName: "Beverages",
    stock: 30,
    addOns: [
      { name: "Whipped Cream", price: 20 },
      { name: "Choco Chips", price: 18 },
    ],
    combos: [],
  },
  {
    title: "Classic Fries",
    description:
      "Golden, crispy potato fries with a fluffy center. A timeless side for every combo.",
    image: "https://picsum.photos/seed/product-classic-fries/900/700",
    cost: 109,
    taxPercent: 12,
    categoryName: "Sides",
    stock: 70,
    addOns: [
      { name: "Peri Peri Seasoning", price: 15 },
      { name: "Cheese Dip", price: 25 },
    ],
    combos: [],
  },
  {
    title: "Loaded Nachos",
    description:
      "Crunchy nachos layered with tangy salsa, creamy dip, and melted cheese for a share-worthy side.",
    image: "https://picsum.photos/seed/product-loaded-nachos/900/700",
    cost: 169,
    taxPercent: 12,
    categoryName: "Sides",
    stock: 32,
    addOns: [
      { name: "Extra Salsa", price: 20 },
      { name: "Cheese Sauce", price: 30 },
    ],
    combos: [],
  },
  {
    title: "Garlic Bread Bites",
    description:
      "Toasted garlic bread bites brushed with herbed butter and served warm for the perfect side snack.",
    image: "https://picsum.photos/seed/product-garlic-bread-bites/900/700",
    cost: 129,
    taxPercent: 12,
    categoryName: "Sides",
    stock: 26,
    addOns: [{ name: "Cheesy Dip", price: 28 }],
    combos: [],
  },
  {
    title: "Chocolate Brownie",
    description:
      "Dense, fudgy chocolate brownie with a rich cocoa flavor and soft center for dessert cravings.",
    image: "https://picsum.photos/seed/product-chocolate-brownie/900/700",
    cost: 119,
    taxPercent: 5,
    categoryName: "Desserts",
    stock: 24,
    addOns: [
      { name: "Hot Chocolate Sauce", price: 22 },
      { name: "Vanilla Scoop", price: 35 },
    ],
    combos: [],
  },
  {
    title: "Strawberry Sundae",
    description:
      "Creamy vanilla sundae layered with strawberry syrup and crunchy toppings for a cool sweet finish.",
    image: "https://picsum.photos/seed/product-strawberry-sundae/900/700",
    cost: 139,
    taxPercent: 5,
    categoryName: "Desserts",
    stock: 20,
    addOns: [{ name: "Rainbow Sprinkles", price: 15 }],
    combos: [],
  },
  {
    title: "Caramel Custard Cup",
    description:
      "Smooth baked custard topped with glossy caramel. Light, elegant, and perfectly sweet.",
    image: "https://picsum.photos/seed/product-caramel-custard-cup/900/700",
    cost: 129,
    taxPercent: 5,
    categoryName: "Desserts",
    stock: 18,
    addOns: [{ name: "Salted Caramel Drizzle", price: 20 }],
    combos: [],
  },
];

const userSeeds = [
  {
    name: "Demo Admin",
    email: "admin@retailportal.dev",
    password: "Admin@123",
    role: "admin",
  },
  {
    name: "Demo Customer",
    email: "customer@retailportal.dev",
    password: "Customer@123",
    role: "customer",
  },
];

const upsertCategories = async () => {
  const categoryMap = new Map();

  for (const seed of categorySeeds) {
    const category = await Category.findOneAndUpdate(
      { name: seed.name },
      {
        $set: {
          description: seed.description,
          logo: seed.logo,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    categoryMap.set(seed.name, category);
  }

  return categoryMap;
};

const upsertProducts = async (categoryMap) => {
  const productMap = new Map();

  for (const seed of productSeeds) {
    const category = categoryMap.get(seed.categoryName);
    if (!category) {
      continue;
    }

    const product = await Product.findOneAndUpdate(
      { title: seed.title },
      {
        $set: {
          description: seed.description,
          image: seed.image,
          cost: seed.cost,
          taxPercent: seed.taxPercent,
          category: category._id,
          stock: seed.stock,
          isAvailable: seed.stock > 0,
          addOns: seed.addOns,
          combos: [],
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    productMap.set(seed.title, product);
  }

  for (const seed of productSeeds) {
    const currentProduct = productMap.get(seed.title);

    if (!currentProduct || !Array.isArray(seed.combos) || seed.combos.length === 0) {
      continue;
    }

    const combos = seed.combos
      .map((comboItem) => {
        const comboProduct = productMap.get(comboItem.productTitle);

        if (!comboProduct) {
          return null;
        }

        return {
          product: comboProduct._id,
          discountPercent: comboItem.discountPercent,
        };
      })
      .filter(Boolean);

    currentProduct.combos = combos;
    await currentProduct.save();
  }

  return productMap;
};

const upsertUsers = async () => {
  for (const seed of userSeeds) {
    const existingUser = await User.findOne({ email: seed.email });

    if (!existingUser) {
      await User.create(seed);
      continue;
    }

    if (existingUser.role !== seed.role) {
      existingUser.role = seed.role;
      await existingUser.save();
    }
  }
};

const runSeed = async () => {
  try {
    await connectDB();

    const categoryMap = await upsertCategories();
    await upsertProducts(categoryMap);
    await upsertUsers();

    const [categoryCount, productCount, userCount] = await Promise.all([
      Category.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
    ]);

    console.log("Seed completed successfully.");
    console.log(`Categories in DB: ${categoryCount}`);
    console.log(`Products in DB: ${productCount}`);
    console.log(`Users in DB: ${userCount}`);
    console.log("Demo login credentials:");
    console.log("Admin    -> admin@retailportal.dev / Admin@123");
    console.log("Customer -> customer@retailportal.dev / Customer@123");
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

runSeed();
