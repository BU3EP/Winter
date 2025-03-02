const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server"); // Adjust based on your server file path
const User = require("../models/User");
const jwt = require("jsonwebtoken");

require("dotenv").config();

let token;
let userId;

beforeAll(async () => {
  await User.deleteMany(); // Clear the test database before running tests

  // Create a test user
  const user = await User.create({
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    role: "buyer",
  });

  userId = user._id;
  token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User API Tests", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: "New User",
      email: "newuser@example.com",
      password: "password123",
      role: "seller",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should not register a user with an existing email", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: "Duplicate User",
      email: "test@example.com", // Using existing email
      password: "password123",
      role: "buyer",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  it("should login an existing user", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should not login with invalid credentials", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("should get user profile with valid token", async () => {
    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("email", "test@example.com");
  });

  it("should not get user profile without token", async () => {
    const res = await request(app).get("/api/users/profile");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("No token, authorization denied");
  });

  it("should not get user profile with invalid token", async () => {
    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", "Bearer invalidtoken");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid token");
  });
});
