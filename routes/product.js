const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Add Default Products
router.post("/add-default", async (req, res) => {
  try {
    const defaultProducts = [
      { name: "Product A", price: 100 },
      { name: "Product B", price: 200 },
      { name: "Product C", price: 300 },
    ];

    await Product.insertMany(defaultProducts);

    res.status(201).json({ message: "Default products created", products: defaultProducts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
