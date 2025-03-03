const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const morgan = require("morgan");
const winston = require("winston");
const connectDB = require("./config/db");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const PORT = process.env.PORT || 5000;

dotenv.config(); // Load environment variables
// Connect to database
connectDB();


const app = express();
app.use(express.json()); // Allow JSON payloads
// app.use(cors()); // Enable CORS
app.use(cors({ credentials: true, //origin:  }));
    origin: process.env.FRONTEND_URL, // Allow all origins (for testing, restrict in production)
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));
app.use(helmet(
    {
        crossOriginResourcePolicy: false,
    }
));
app.use(xss());
app.use(mongoSanitize());
app.use(morgan("combined"));
app.use(cookieParser());


// // Session Middleware
// app.use(
//     session({
//         secret: process.env.SESSION_SECRET, // Use a strong secret
//         resave: false,
//         saveUninitialized: false,
//         store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), // Persist sessions in MongoDB
//         cookie: {
//             httpOnly: true, // Prevent client-side JS access
//             secure: process.env.NODE_ENV === "production", // Secure in production
//             sameSite: "Strict", // Prevent CSRF attacks
//             maxAge: 1000 * 60 * 60 * 1, // 1 hr expiration
//         },
//     })
// );

// Rate limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/api/", limiter);

// Import Routes
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");

// Use Routes
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/uploads", express.static("public/uploads"));
app.use((req, res) => {
    res.status(404).json({ message: "Route Not Found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});


if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
  
module.exports = app;

