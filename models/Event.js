const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    githubUserId: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      enum: ["push", "pull_request", "issues", "star"],
      required: true,
    },
    repoName: {
      type: String, // e.g. "devpulse-backend"
    },
    repoFullName: {
      type: String, // e.g. "aayushtiwari307/devpulse-backend"
    },
    actor: {
      type: String, // GitHub username who triggered the event
    },
    payload: {
      type: mongoose.Schema.Types.Mixed, // raw GitHub webhook payload
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast queries: fetch all events for a user sorted by time
eventSchema.index({ userId: 1, timestamp: -1 });
// Index for stats aggregation by githubUserId
eventSchema.index({ githubUserId: 1, eventType: 1 });

module.exports = mongoose.model("Event", eventSchema);
