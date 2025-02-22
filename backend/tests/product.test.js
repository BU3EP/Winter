const request = require("supertest");
const app = require("../server");
const { connectTestDB, closeTestDB, clearTestDB } = require("./setupTestDB");
const Product = require("../models/Product");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

let sellerToken, buyerToken, sellerId, buyerId;

// Mock users
const mockUsers = [
  { name: "Seller", email: "seller@example.com", password: "123456", role: "seller" },
  { name: "Buyer", email: "buyer@example.com", password: "123456", role: "buyer" },
];

// Mock product
const mockProduct = {
  name: "Test Laptop",
  description: "A high-end laptop",
  price: 1000,
  stock: 5,
  category: "Electronics",
  image: "image_url",
};

beforeAll(async () => {
  await connectTestDB();
  
  // Create test users
  const seller = await User.create(mockUsers[0]);
  const buyer = await User.create(mockUsers[1]);
  sellerId = seller._id;
  buyerId = buyer._id;

  // Generate tokens
  sellerToken = jwt.sign({ id: seller._id, role: seller.role }, process.env.JWT_SECRET, { expiresIn: "30d" });
  buyerToken = jwt.sign({ id: buyer._id, role: buyer.role }, process.env.JWT_SECRET, { expiresIn: "30d" });
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe("Product API", () => {
  test("Should create a product (Seller only)", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${sellerToken}`)
      .send(mockProduct);
    
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(mockProduct.name);
  });

  test("Should not allow a buyer to create a product", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${buyerToken}`)
      .send(mockProduct);
    
    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Only sellers can add products");
  });

  test("Should retrieve all products", async () => {
    await Product.create({ ...mockProduct, seller: sellerId });

    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  test("Should retrieve a single product by ID", async () => {
    const product = await Product.create({ ...mockProduct, seller: sellerId });

    const res = await request(app).get(`/api/products/${product._id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(mockProduct.name);
  });

  test("Should update a product (Only seller)", async () => {
    const product = await Product.create({ ...mockProduct, seller: sellerId });

    const res = await request(app)
      .put(`/api/products/${product._id}`)
      .set("Authorization", `Bearer ${sellerToken}`)
      .send({ price: 1200 });

    expect(res.status).toBe(200);
    expect(res.body.price).toBe(1200);
  });

  test("Should not allow a buyer to update a product", async () => {
    const product = await Product.create({ ...mockProduct, seller: sellerId });

    const res = await request(app)
      .put(`/api/products/${product._id}`)
      .set("Authorization", `Bearer ${buyerToken}`)
      .send({ price: 1200 });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Unauthorized action");
  });

  test("Should delete a product (Only seller)", async () => {
    const product = await Product.create({ ...mockProduct, seller: sellerId });

    const res = await request(app)
      .delete(`/api/products/${product._id}`)
      .set("Authorization", `Bearer ${sellerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Product removed successfully");
  });

  test("Should not allow a buyer to delete a product", async () => {
    const product = await Product.create({ ...mockProduct, seller: sellerId });

    const res = await request(app)
      .delete(`/api/products/${product._id}`)
      .set("Authorization", `Bearer ${buyerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Unauthorized action");
  });
});
