// Middleware to protect routes that require a logged-in user
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // user is logged in, proceed
  }
  res.status(401).json({ error: "Unauthorized. Please log in." });
};

module.exports = isAuthenticated;
