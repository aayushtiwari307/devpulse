// GET /auth/me — return the currently logged-in user
const getMe = (req, res) => {
  res.json({
    id: req.user._id,
    githubId: req.user.githubId,
    username: req.user.username,
    displayName: req.user.displayName,
    avatarUrl: req.user.avatarUrl,
  });
};

// GET /auth/logout — destroy session and redirect to client
const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });
};

module.exports = { getMe, logout };
