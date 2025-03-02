const request = require("supertest");
const app = require("../server");
const { connectTestDB, closeTestDB, clearTestDB } = require("./setupTestDB");
const User = require("../models/User");
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");

let adminToken, adminId, sellerToken, sellerId;

beforeAll(async () => {
    await connectTestDB();

    // Create an admin user
    const adminUser = await User.create({
        name: "Admin User",
        email: "admin@example.com",
        password: "123456",
        role: "admin",
    });

    adminId = adminUser._id;
    adminToken = jwt.sign(
        { id: adminUser._id, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );

    // Create a seller user
    const sellerUser = await User.create({
        name: "Seller User",
        email: "seller@example.com",
        password: "123456",
        role: "seller",
        status: "pending",
    });

    sellerId = sellerUser._id;
    sellerToken = jwt.sign(
        { id: sellerUser._id, role: "seller" },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );

    // Create a buyer user
    const buyerUser = await User.create({
        name: "Buyer User",
        email: "buyer@example.com",
        password: "123456",
        role: "buyer",
    });

    buyerId = buyerUser._id;
});

beforeEach(async () => {
    await clearTestDB();

    // Recreate admin user and generate JWT
    const adminUser = await User.create({
        name: "Admin User",
        email: "admin@example.com",
        password: "123456",
        role: "admin",
    });

    adminId = adminUser._id;
    adminToken = jwt.sign(
        { id: adminUser._id, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );

    const sellerUser = await User.create({
        name: "Seller User",
        email: "seller@example.com",
        password: "123456",
        role: "seller",
        status: "pending", // Ensure status exists
    });

    sellerId = sellerUser._id;
    sellerToken = jwt.sign(
        { id: sellerUser._id, role: "seller" },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );

    await Order.create({
        buyer: buyerId, // Required field
        sellerId: sellerId,
        totalPrice: 2000,
        status: "pending",
    });
});


afterAll(async () => {
    await closeTestDB();
});

describe("Admin API Tests", () => {
    test("Approve a seller", async () => {
        const res = await request(app)
            .put(`/api/admin/approve-seller/${sellerId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Seller approved successfully");

        const updatedSeller = await User.findById(sellerId);
        expect(updatedSeller.status).toBe("approved");
    });

    test("Reject a seller", async () => {
        const res = await request(app)
            .put(`/api/admin/reject-seller/${sellerId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Seller rejected successfully");

        const updatedSeller = await User.findById(sellerId);
        expect(updatedSeller.status).toBe("rejected");
    });

    test("Get analytics", async () => {
        const res = await request(app)
            .get("/api/admin/analytics")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.totalOrders).toBe(1);
        expect(res.body.totalRevenue).toBe(2000);
    });

    test("Unauthorized access to admin routes", async () => {
        const res = await request(app)
            .get("/api/admin/analytics");
    
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("No token, authorization denied"); // Fix
    })

    test("Non-admin trying to approve seller", async () => {
        const res = await request(app)
            .put(`/api/admin/approve-seller/${sellerId}`)
            .set("Authorization", `Bearer ${sellerToken}`);

        expect(res.statusCode).toBe(403);
        expect(res.body.message).toBe("Forbidden: Admins only");
    });

    test("Invalid seller ID", async () => {
        const res = await request(app)
            .put(`/api/admin/approve-seller/invalidID`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(400);
    });
});
