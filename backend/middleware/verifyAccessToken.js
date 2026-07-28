const jwt = require("jsonwebtoken");

// Protects routes like /dashboard. Expects:
// Authorization: Bearer <accessToken>
const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No access token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    // Frontend should catch this 401/403, call /api/auth/refresh, then retry
    return res.status(403).json({ message: "Access token invalid or expired" });
  }
};

module.exports = verifyAccessToken;
