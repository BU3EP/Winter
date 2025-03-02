const express = require('express');
const { createOrder, 
        getOrders, 
        getOrderById, 
        cancelOrder } = require('../controllers/orderController');
const {protect} = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new order
router.post('/', protect, createOrder);

// Get all orders for a logged-in user
router.get('/', protect, getOrders);

// Get a specific order by ID
router.get('/:id', protect, getOrderById);

// Cancel an order
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;