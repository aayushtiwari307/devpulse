const User = require("../models/User");
const Event = require("../models/Event");
const { getIO } = require("../socket/socketManager");

const handleGitHubWebhook = async (req, res) => {
  const eventType = req.headers["x-github-event"];
  const payload = req.body;

  const supportedEvents = ["push", "pull_request", "issues", "star"];
  if (!supportedEvents.includes(eventType)) {
    return res.status(200).json({ message: `Event '${eventType}' ignored` });
  }

  try {
    const senderGithubId = String(payload.sender?.id);

    if (!senderGithubId) {
      return res.status(400).json({ error: "Could not identify sender" });
    }

    const user = await User.findOne({ githubId: senderGithubId });

    if (!user) {
      return res.status(200).json({ message: "User not registered in DevPulse" });
    }

    const newEvent = await Event.create({
      userId: user._id,
      githubUserId: senderGithubId,
      eventType,
      repoName: payload.repository?.name || "",
      repoFullName: payload.repository?.full_name || "",
      actor: payload.sender?.login || "",
      payload,
      timestamp: new Date(),
    });

    console.log(`[Webhook] ${eventType} event saved for user: ${user.username}`);

    // Emit directly to the user's Socket.io room
    getIO().to(senderGithubId).emit("new_event", newEvent);
    console.log(`[Socket] Emitted new_event to room: ${senderGithubId}`);

    res.status(200).json({ message: "Event received and saved", eventId: newEvent._id });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { handleGitHubWebhook };