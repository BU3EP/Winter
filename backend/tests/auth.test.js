const request = require("supertest");
const app = require("../server"); // Import the Express app
const { connectTestDB, closeTestDB, clearTestDB } = require("./setupTestDB");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

let agent;
let userId;
let token;

beforeAll(async () => {
    console.log("Connecting to Test Database...");
    await connectTestDB();
    agent = request.agent(app); // Maintain session between requests
    console.log("Test Database Connected");
});

beforeEach(async () => {
    console.log("Clearing test database...");
    await clearTestDB();

    console.log("Creating test user...");
    const user = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "buyer",
        status: "approved",
    });

    userId = user._id;
    token = jwt.sign({ id: user._id, role: "buyer" }, process.env.JWT_SECRET, { expiresIn: "30d" });

    console.log("Test user created with ID:", userId);
});

afterAll(async () => {
    await closeTestDB();
});

describe("Auth API Tests", () => {
    it("should login with valid credentials", async () => {
        const res = await request(app).post("/api/auth/login").send({
            email: "test@example.com",
            password: "password123",
        });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(res.body.user.email).toBe("test@example.com");
    });

    it("should not login with wrong password", async () => {
        const res = await request(app).post("/api/auth/login").send({
            email: "test@example.com",
            password: "wrongpassword",
        });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Invalid credentials");
    });

    it("should not login an unapproved seller", async () => {
        const unapprovedSeller = await User.create({
            name: "Pending Seller",
            email: "seller@example.com",
            password: "password123",
            role: "seller",
            status: "pending",
        });

        const res = await request(app).post("/api/auth/login").send({
            email: "seller@example.com",
            password: "password123",
        });

        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Account not approved by admin");
    });

    it("should not login with non-existent email", async () => {
        const res = await request(app).post("/api/auth/login").send({
            email: "nonexistent@example.com",
            password: "password123",
        });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Invalid credentials");
    });

    it("should get user session with valid token", async () => {
        const res = await request(app)
            .get("/api/auth/session")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.user.email).toBe("test@example.com");
    });

    test("Should not get session without token", async () => {
        const res = await agent.get("/api/auth/session");
    
        console.log("Session check response:", res.body);
    
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("No token, authorization denied");
    });

    it("should not get session with invalid token", async () => {
        const res = await request(app)
            .get("/api/auth/session")
            .set("Authorization", "Bearer invalidtoken");

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Invalid token");
    });

    it("should logout user", async () => {
        const res = await request(app)
            .post("/api/auth/logout")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Logged out successfully");
    });
});