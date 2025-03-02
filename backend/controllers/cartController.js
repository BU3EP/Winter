const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ➤ Add item to cart
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [{ product: productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
};

// ➤ Remove item from cart
// const removeFromCart = async (req, res) => {
//     try {
//         const cart = await Cart.findOne({ user: req.user.id });
//         if (!cart) {
//             return res.status(404).json({ message: "Cart not found" });
//         }

//         const itemIndex = cart.items.findIndex(
//             (item) => item.product.toString() === req.params.id
//         );

//         if (itemIndex === -1) {
//             return res.status(404).json({ message: "Item not found in cart" });
//         }

//         cart.items.splice(itemIndex, 1);
//         await cart.save();
        
//         res.status(200).json({ message: "Item removed successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Error removing item" });
//     }
// };

const removeFromCart = async (req, res) => {
  try {
      const cart = await Cart.findOne({ user: req.user.id });
      
      // Debug logging
      console.log('Cart found:', cart);
      console.log('User ID:', req.user.id);
      console.log('Product ID to remove:', req.params.id);

      if (!cart) {
          return res.status(404).json({ message: "Cart not found" });
      }

      const itemIndex = cart.items.findIndex(
          (item) => item.product.toString() === req.params.id
      );

      console.log('Item index:', itemIndex);

      if (itemIndex === -1) {
          return res.status(404).json({ message: "Item not found in cart" });
      }

      cart.items.splice(itemIndex, 1);
      await cart.save();
      
      res.status(200).json({ message: "Item removed successfully" });
  } catch (error) {
      console.error('Error in removeFromCart:', error);
      res.status(500).json({ message: "Error removing item", error: error.message });
  }
};

// ➤ Get user cart
const getUserCart = async (req, res) => {
    try {
      let cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
      if (!cart) return res.status(200).json({ items: [], message: "Cart is empty" });
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: "Error fetching cart" });
    }
};

const updateCartQuantity = async (req, res) => {
    const { quantity } = req.body;
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === req.params.id
        );
        
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        
        const updatedCart = await cart.populate('items.product');
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: "Error updating quantity" });
    }
};

// ➤ Clear the entire cart
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error: error.message });
  }
};

module.exports = { addToCart, removeFromCart, getUserCart, updateCartQuantity, clearCart };
