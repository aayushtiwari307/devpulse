const express = require("express");
const passport = require("passport");
const { getMe, logout } = require("../controllers/authController");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

const frontendBaseUrl = process.env.CLIENT_URL || "http://localhost:5173";

const resolveRedirectTarget = (redirectTarget) => {
  if (!redirectTarget) return `${frontendBaseUrl}/dashboard`;

  try {
    const parsedUrl = new URL(redirectTarget);
    const allowedOrigin = new URL(frontendBaseUrl).origin;

    if (parsedUrl.origin === allowedOrigin) {
      return parsedUrl.toString();
    }
  } catch {
    // fall back to the dashboard if the redirect is invalid
  }

  return `${frontendBaseUrl}/dashboard`;
};

// Step 1: Redirect user to GitHub for authorization
router.get("/github", (req, res, next) => {
  req.session.oauthRedirect = resolveRedirectTarget(req.query.redirect);
  passport.authenticate("github", { scope: ["user:email", "read:user"] })(req, res, next);
});

// Step 2: GitHub redirects back here after user approves
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${frontendBaseUrl}/?error=auth_failed`,
  }),
  (req, res) => {
    const redirectTarget = req.session.oauthRedirect || `${frontendBaseUrl}/dashboard`;
    delete req.session.oauthRedirect;
    res.redirect(redirectTarget);
  }
);

// GET /auth/me — who am I? (protected)
router.get("/me", isAuthenticated, getMe);

// GET /auth/logout
router.get("/logout", isAuthenticated, logout);

module.exports = router;
