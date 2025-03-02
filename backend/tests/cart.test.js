const request = require("supertest");
const app = require("../server");
const { connectTestDB, closeTestDB, clearTestDB } = require("./setupTestDB");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

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

describe("🛒 Shopping Cart API Tests", () => {
  
  test("Should add a product to cart", async () => {
    const res = await request(app)
      .post("/api/cart/add")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ productId, quantity: 2 });

    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].product.toString()).toBe(productId.toString());
    expect(res.body.items[0].quantity).toBe(2);
  });

  test("Should retrieve an empty cart initially", async () => {
    const res = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.items).toEqual([]);
    expect(res.body.message).toBe("Cart is empty");
  });

  test("Should retrieve a cart with added items", async () => {
    await request(app)
      .post("/api/cart/add")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ productId, quantity: 3 });

    const res = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].product._id.toString()).toBe(productId.toString());
  expect(res.body.items[0].quantity).toBe(3);
  });

  test("Should update product quantity in cart", async () => {
    await request(app)
      .post("/api/cart/add")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ productId, quantity: 1 });

    const res = await request(app)
      .put(`/api/cart/update/${productId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(200);
    expect(res.body.items[0].quantity).toBe(5);
  });

  test("Should remove an item from cart", async () => {
    // Add product first
    await request(app)
      .post("/api/cart/add")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ productId, quantity: 1 });

    // Remove the product
    const removeRes = await request(app)
      .delete(`/api/cart/remove/${productId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(removeRes.status).toBe(200);
    expect(removeRes.body.message).toBe("Item removed successfully");

    // Ensure cart is empty
    const cartCheck = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${userToken}`);

    expect(cartCheck.body.items).toHaveLength(0);
  });

  test("Should return 404 if removing an item that is not in cart", async () => {
    const res = await request(app)
      .delete(`/api/cart/remove/${productId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Cart not found");
  });

  test("Should return 404 if updating an item that is not in cart", async () => {
    const res = await request(app)
      .put(`/api/cart/update/${productId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 3 });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Cart not found");
  });

  test("Should clear the cart", async () => {
    await request(app)
      .post("/api/cart/add")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ productId, quantity: 1 });

    const res = await request(app)
      .delete("/api/cart/clear")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Cart cleared successfully");

    const cartCheck = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${userToken}`);

    expect(cartCheck.body.items).toHaveLength(0);
  });

  test("Should not add a product with invalid quantity", async () => {
    const res = await request(app)
      .post("/api/cart/add")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ productId, quantity: 0 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid input parameters");
  });

  test("Should not update product quantity with invalid number", async () => {
    await request(app)
      .post("/api/cart/add")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ productId, quantity: 2 });

    const res = await request(app)
      .put(`/api/cart/update/${productId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: -5 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Quantity must be at least 1");
  });

});
