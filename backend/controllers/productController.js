const Product = require("../models/Product");

// ➤ Create a new product (only sellers can add products)
const createProduct = async (req, res) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({ message: "Only sellers can add products" });
  }

  try {
    const product = new Product({ ...req.body, seller: req.user.id });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "Failed to add product", error: error.message });
  }
};

// ➤ Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "name email");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// ➤ Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller", "name email");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product", error: error.message });
  }
};

// ➤ Update a product (only the seller who created it can update)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    Object.assign(product, req.body);
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

// ➤ Delete a product (only the seller who created it can delete)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    await Product.findByIdAndDelete(req.params.id); 
    res.status(200).json({ message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

const uploadImage = async (req, res) => {
  const { name, description, price, sellerId, imageUrl } = req.body;
  const product = new Product({ name, description, price, sellerId, imageUrl });

  await product.save();
  res.json(product);
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
