const Event = require("../models/Event");

// GET /api/events
// Returns paginated events for the logged-in user
const getEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const events = await Event.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Event.countDocuments({ userId: req.user._id });

    res.json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("getEvents error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/events/stats
// Returns commit count by day, PR count, language breakdown
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Commits per day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const commitsByDay = await Event.aggregate([
      {
        $match: {
          userId,
          eventType: "push",
          timestamp: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // PR count total
    const prCount = await Event.countDocuments({
      userId,
      eventType: "pull_request",
    });

    // Events by type (for breakdown chart)
    const eventsByType = await Event.aggregate([
      { $match: { userId } },
      { $group: { _id: "$eventType", count: { $sum: 1 } } },
    ]);

    res.json({ commitsByDay, prCount, eventsByType });
  } catch (err) {
    console.error("getStats error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getEvents, getStats };