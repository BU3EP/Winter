// tests/order.test.js
const request = require("supertest");
const app = require("../server");
const { connectTestDB, closeTestDB, clearTestDB } = require("./setupTestDB");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

let userToken, userId, productId;

beforeAll(async () => {
    await connectTestDB();

    // Create a user (buyer)
    const user = await User.create({
        name: "John Doe",
        email: "john@example.com",
        password: "123456",
        role: "buyer"
    });

    userId = user._id;
    userToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );

    // Create a test product
    const product = await Product.create({
        name: "Laptop",
        description: "Gaming Laptop",
        price: 1500,
        stock: 10,
        category: "Electronics",
        seller: userId,
    });

    productId = product._id;
});

beforeEach(async () => {
    await clearTestDB(); // Ensure a fresh DB state

    // Recreate user and generate JWT
    const user = await User.create({
        name: "John Doe",
        email: "john@example.com",
        password: "123456",
        role: "buyer",
    });

    userId = user._id;
    userToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );

    // Recreate product
    const product = await Product.create({
        name: "Laptop",
        description: "Gaming Laptop",
        price: 1500,
        stock: 10,
        category: "Electronics",
        seller: userId,
    });

    productId = product._id;
});

afterAll(async () => {
    await closeTestDB();
});

describe("Order API", () => {
    test("Should create an order", async () => {
        const response = await request(app)
            .post("/api/orders")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ products: [{ product: productId, quantity: 2 }] });

        expect(response.status).toBe(201);
        expect(response.body.order).toHaveProperty("_id");
        expect(response.body.order.totalPrice).toBe(3000);
    });

    test("Should fetch user orders", async () => {
        await request(app)
            .post("/api/orders")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ products: [{ product: productId, quantity: 1 }] });

        const response = await request(app)
            .get("/api/orders")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test("Should return 404 for non-existent order", async () => {
        const response = await request(app)
            .get(`/api/orders/${new mongoose.Types.ObjectId()}`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(404);
    });

    test("Should cancel an order", async () => {
        const order = await request(app)
            .post("/api/orders")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ products: [{ product: productId, quantity: 1 }] });

        const response = await request(app)
            .put(`/api/orders/${order.body.order._id}/cancel`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.order.status).toBe("cancelled");
    });
});
