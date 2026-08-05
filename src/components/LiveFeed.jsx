const EVENT_META = {
  push: {
    emoji: "📦",
    label: "Push",
  },

  pull_request: {
    emoji: "🔀",
    label: "Pull Request",
  },

  issues: {
    emoji: "🐛",
    label: "Issue",
  },

  star: {
    emoji: "⭐",
    label: "Star",
  },

  create: {
    emoji: "🌿",
    label: "Branch / Tag",
  },

  delete: {
    emoji: "🗑️",
    label: "Delete",
  },

  fork: {
    emoji: "🍴",
    label: "Fork",
  },

  release: {
    emoji: "🚀",
    label: "Release",
  },
};

const timeAgo = (timestamp) => {
  const diff = Math.floor(
    (Date.now() - new Date(timestamp)) / 1000
  );

  if (diff < 60) {
    return `${diff}s ago`;
  }

  if (diff < 3600) {
    return `${Math.floor(diff / 60)}m ago`;
  }

  if (diff < 86400) {
    return `${Math.floor(diff / 3600)}h ago`;
  }

  return new Date(timestamp).toLocaleDateString();
};

const LiveFeed = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="empty-state">
        <span
          className="empty-icon"
          aria-hidden="true"
        >
          📭
        </span>

        <p>No events yet</p>

        <small>
          Push to a GitHub repo with your webhook
          configured and activity will appear here
          instantly.
        </small>
      </div>
    );
  }

  return (
    <ul className="live-feed">
      {events.map((event) => {
        const meta =
          EVENT_META[event.eventType] || {
            emoji: "🔔",
            label: event.eventType,
          };

        return (
          <li
            key={event._id}
            className="feed-item"
          >
            <span
              className="feed-emoji"
              title={meta.label}
              aria-label={meta.label}
            >
              {meta.emoji}
            </span>

            <div className="feed-info">
              <span className="feed-repo">
                {event.repoFullName}
              </span>

              <span className="feed-type">
                {meta.label}
              </span>
            </div>

            <span className="feed-time">
              {timeAgo(event.timestamp)}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default LiveFeed;