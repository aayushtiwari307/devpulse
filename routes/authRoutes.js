const express = require("express");
const passport = require("passport");
const { getMe, logout } = require("../controllers/authController");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

// Step 1: Redirect user to GitHub for authorization
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email", "read:user"] })
);

// Step 2: GitHub redirects back here after user approves
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
  }),
  (req, res) => {
    // Auth successful — redirect to frontend dashboard
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);

// GET /auth/me — who am I? (protected)
router.get("/me", isAuthenticated, getMe);

// GET /auth/logout
router.get("/logout", isAuthenticated, logout);

module.exports = router;
