const crypto = require("crypto");

// GitHub signs every webhook payload with HMAC-SHA256 using your WEBHOOK_SECRET.
// The signature is sent in the X-Hub-Signature-256 header.
// We recompute it ourselves and compare — if they match, the request is genuine.

const verifyWebhook = (req, res, next) => {
  const signature = req.headers["x-hub-signature-256"];

  if (!signature) {
    return res.status(401).json({ error: "Missing webhook signature" });
  }

  // req.body is a raw Buffer here because we used express.raw() in server.js
  const hmac = crypto.createHmac("sha256", process.env.WEBHOOK_SECRET);
  const digest = "sha256=" + hmac.update(req.body).digest("hex");

  // Use timingSafeEqual to prevent timing attacks
  const sigBuffer = Buffer.from(signature);
  const digestBuffer = Buffer.from(digest);

  if (
    sigBuffer.length !== digestBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, digestBuffer)
  ) {
    return res.status(401).json({ error: "Invalid webhook signature" });
  }

  // Signature verified — parse raw body to JSON for next handler
  try {
    req.body = JSON.parse(req.body.toString());
  } catch {
    return res.status(400).json({ error: "Invalid JSON payload" });
  }

  next();
};

module.exports = verifyWebhook;
