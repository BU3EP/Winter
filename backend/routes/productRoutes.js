const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Protected routes (seller-only)
router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
