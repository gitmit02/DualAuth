const jwt = require("jsonwebtoken");

// Short-lived token used to access protected routes.
// Kept in memory on the frontend (never localStorage) so it's not
// readable by an XSS payload sitting around long-term.
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

// Long-lived token used ONLY to fetch a new access token.
// Sent as an httpOnly cookie so client-side JS (and therefore XSS)
// can never read it directly.
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
