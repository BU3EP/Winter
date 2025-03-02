const express = require("express");
const {
  addToCart,
  removeFromCart,
  getUserCart,
  updateCartQuantity,
  clearCart,
} = require("../controllers/cartController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getUserCart);
router.post("/add", protect, addToCart);
router.put("/update/:id", protect, updateCartQuantity);
router.delete("/remove/:id", protect, removeFromCart);
router.delete("/clear", protect, clearCart);

module.exports = router;