const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register User
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const user = await User.create({ name, email, password, role });
  if (user) {
    res.status(201).json({ token: generateToken(user._id) });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({ token: generateToken(user._id) });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
