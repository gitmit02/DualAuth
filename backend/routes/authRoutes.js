const express = require("express");
const router = express.Router();
const { signup, login, refresh, logout } = require("../controllers/authController");
const verifyAccessToken = require("../middleware/verifyAccessToken");
const User = require("../models/User");

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// Protected dummy dashboard route -- proves the access token flow works end-to-end.
router.get("/dashboard", verifyAccessToken, async (req, res) => {
  const user = await User.findById(req.userId).select("-password -refreshTokens");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({
    message: `Welcome, ${user.name}. This is protected dashboard data.`,
    user,
  });
});

module.exports = router;
