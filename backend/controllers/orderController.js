const Order = require('../models/Order');
const Product = require('../models/Product');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { products } = req.body;
        const buyerId = req.user.id; // Extracted from JWT authentication middleware

        // Validate products
        let totalPrice = 0;
        const orderItems = await Promise.all(products.map(async (item) => {
            const product = await Product.findById(item.product);
            if (!product) throw new Error(`Product ${item.product} not found`);
            if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);
            
            product.stock -= item.quantity; // Deduct stock
            await product.save();
            
            totalPrice += product.price * item.quantity;
            return { product: product._id, quantity: item.quantity };
        }));

        const order = new Order({ buyer: buyerId, products: orderItems, totalPrice });
        await order.save();

        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all orders for a buyer
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user.id }).populate('products.product');
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('products.product');
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        if (order.status !== 'pending') return res.status(400).json({ error: 'Only pending orders can be cancelled' });
        
        // Restore product stock
        await Promise.all(order.products.map(async (item) => {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }));

        order.status = 'cancelled';
        await order.save();
        res.status(200).json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
