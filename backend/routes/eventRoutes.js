const express = require("express");
const router = express.Router();
const { getEvents, getStats } = require("../controllers/eventController");
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/", isAuthenticated, getEvents);
router.get("/stats", isAuthenticated, getStats);

module.exports = router;