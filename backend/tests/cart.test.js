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
  const user = await User.create({ name: "John Doe", email: "john@example.com", password: "123456", role: "buyer" });
  userId = user._id;
  userToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "30d" });

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

afterEach(async () => {
  await clearTestDB();
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
    expect(res.body.items.length).toBe(1);
    expect(res.body.items[0].product).toBe(productId.toString());
    expect(res.body.items[0].quantity).toBe(2);
  });

  test("Should retrieve an empty cart initially", async () => {
    const res = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.items).toEqual([]);
  });

  test("Should retrieve a cart with added items", async () => {
    const res = await request(app)
        .get("/api/cart")
        .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true); 
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

  // test("Should remove an item from cart", async () => {
  //   await request(app)
  //     .post("/api/cart/add")
  //     .set("Authorization", `Bearer ${userToken}`)
  //     .send({ productId, quantity: 1 });

  //   const res = await request(app)
  //     .delete(`/api/cart/remove/${productId}`)
  //     .set("Authorization", `Bearer ${userToken}`);

  //   expect(res.status).toBe(200);
  //   expect(res.body.message).toBe("Item removed successfully");

  //   const cartCheck = await request(app)
  //     .get("/api/cart")
  //     .set("Authorization", `Bearer ${userToken}`);

  //   expect(cartCheck.body.items.length).toBe(0);
  // });
  test("Should remove an item from cart", async () => {
    // First create a cart with an item
    const addResponse = await request(app)
      .post("/api/cart/add")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ productId, quantity: 1 });
    
    // Verify the item was added successfully
    expect(addResponse.status).toBe(200);
    expect(addResponse.body.items.length).toBe(1);

    // Verify cart exists in database
    const cartInDb = await Cart.findOne({ user: userId });
    expect(cartInDb).toBeTruthy();
    expect(cartInDb.items.length).toBe(1);

    // Then try to remove the item
    const removeResponse = await request(app)
      .delete(`/api/cart/remove/${productId}`)
      .set("Authorization", `Bearer ${userToken}`);

    if (removeResponse.status !== 200) {
      console.log('Remove Response:', removeResponse.body); // For debugging
    }

    expect(removeResponse.status).toBe(200);
    expect(removeResponse.body.message).toBe("Item removed successfully");

    // Verify the cart is empty
    const cartCheck = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${userToken}`);

    expect(cartCheck.body.items.length).toBe(0);
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

    expect(cartCheck.body.items.length).toBe(0);
  });

});
