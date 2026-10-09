const express = require("express");
const verifyWebhook = require("../middleware/verifyWebhook");
const { handleGitHubWebhook } = require("../controllers/webhookController");

const router = express.Router();

// POST /webhook/github
// verifyWebhook runs first — rejects any request with invalid/missing signature
router.post("/github", verifyWebhook, handleGitHubWebhook);

module.exports = router;
