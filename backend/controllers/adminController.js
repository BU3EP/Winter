const mongoose = require("mongoose");
const User = require("../models/User");
const Order = require("../models/Order");
const asyncHandler = require("express-async-handler");

/**
 * Validate ObjectId before querying database
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Approve a seller
 */
const approveSeller = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid seller ID format" });
    }

    const user = await User.findById(id);

    if (!user || user.role !== "seller") {
        return res.status(404).json({ message: "Seller not found" });
    }

    user.status = "approved";
    await user.save();

    res.json({ message: "Seller approved successfully" });
});

/**
 * Reject a seller
 */
const rejectSeller = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid seller ID format" });
    }

    const user = await User.findById(id);

    if (!user || user.role !== "seller") {
        return res.status(404).json({ message: "Seller not found" });
    }

    user.status = "rejected";
    await user.save();

    res.json({ message: "Seller rejected successfully" });
});

/**
 * Get platform analytics
 */
const getAnalytics = asyncHandler(async (req, res) => {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
        { $group: { _id: null, revenue: { $sum: "$totalPrice" } } }
    ]);

    const topSellers = await Order.aggregate([
        { $group: { _id: "$sellerId", totalSales: { $sum: "$totalPrice" } } },
        { $sort: { totalSales: -1 } },
        { $limit: 5 }
    ]);

    res.json({
        totalOrders,
        totalRevenue: totalRevenue.length ? totalRevenue[0].revenue : 0,
        topSellers
    });
});
module.exports = { approveSeller, rejectSeller, getAnalytics };
