const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    githubId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
    },
    avatarUrl: {
      type: String,
    },
    accessToken: {
      type: String, // GitHub OAuth access token — used to call GitHub API on user's behalf
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt automatically
  }
);

module.exports = mongoose.model("User", userSchema);
