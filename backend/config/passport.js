const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in DB
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          // Update access token in case it changed
          user.accessToken = accessToken;
          await user.save();
          return done(null, user);
        }

        // First time login — create new user
        user = await User.create({
          githubId: profile.id,
          username: profile.username,
          displayName: profile.displayName || profile.username,
          avatarUrl: profile.photos?.[0]?.value || "",
          accessToken,
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Store only user ID in session (keeps session small)
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// On each request, fetch full user from DB using session ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
