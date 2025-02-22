const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json()); // Allow JSON payloads
app.use(cors()); // Enable CORS

// Connect to database
connectDB();

// Import Routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
// const orderRoutes = require("./routes/orderRoutes");

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
  
module.exports = app;

