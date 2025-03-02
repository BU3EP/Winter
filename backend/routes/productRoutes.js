const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { protect } = require("../middleware/authMiddleware");
const Product = require("../models/Product");

const router = express.Router();

// Set up Multer storage
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Get all products (Public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "name email");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get product by ID (Public)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller", "name email");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create a new product (Protected - Seller)
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Only sellers can add products" });
    }

    const { name, description, price, stock, category } = req.body;
    
    if (!req.file) return res.status(400).json({ message: "Product image is required" });

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      category,
      image: `/uploads/${req.file.filename}`, // Store image path directly
      seller: req.user.id
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, `../public/uploads/${req.file.filename}`)); // Cleanup orphaned images
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update product details (Protected - Seller)
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    const { name, description, price, stock, category } = req.body;

    // Delete the old image only if a new one is uploaded
    if (req.file) {
      if (product.image) {
        const oldImagePath = path.join(__dirname, `../public${product.image}`);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Delete old image safely
        }
      }
      product.image = `/uploads/${req.file.filename}`;
    }

    // Only update provided fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();
    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Delete product (Protected - Seller)
router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    // Safely delete the associated image if it exists
    if (product.image) {
      const imagePath = path.join(__dirname, `../public${product.image}`);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await product.deleteOne();
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
