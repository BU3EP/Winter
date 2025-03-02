const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log("User not found in DB");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check if user is approved
        if (user.role !== "admin" && user.status !== "approved") {
            console.log(`User status: ${user.status} - Access denied`);
            return res.status(403).json({ message: "Account not approved by admin" });
        }
        
        console.log(`Password Check: User = ${user.name}, Password = ${password}, Hash = ${user.password}`);
        // Compare password using model method
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password match: ${isMatch}`);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate Token
        const token = generateToken(user._id, user.role);

        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Logout (Client-Side: Token Should Be Cleared)
router.post("/logout", protect, (req, res) => {
    res.json({ message: "Logged out successfully" });
});

// Check Session (Token Validation)
router.get("/session", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
