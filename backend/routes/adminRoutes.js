const express = require("express");
const { approveSeller, rejectSeller, getAnalytics } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin actions
router.put("/approve-seller/:id", protect, adminOnly, approveSeller);
router.put("/reject-seller/:id", protect, adminOnly, rejectSeller);
router.get("/analytics", protect, adminOnly, getAnalytics);

module.exports = router;
