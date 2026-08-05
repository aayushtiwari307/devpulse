import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = {
  push: "#5b9cff",
  pull_request: "#9b8afb",
  issues: "#ff6b7a",
  star: "#f5b942",
  create: "#35d07f",
  delete: "#ef5c6d",
  fork: "#38c9e8",
  release: "#35d09a",
};

const FALLBACK_COLORS = [
  "#5b9cff",
  "#9b8afb",
  "#ff6b7a",
  "#f5b942",
  "#35d07f",
  "#38c9e8",
];

const LABELS = {
  push: "Push",
  pull_request: "Pull Request",
  issues: "Issues",
  star: "Stars",
  create: "Create",
  delete: "Delete",
  fork: "Fork",
  release: "Release",
};

const CustomTooltip = ({
  active,
  payload,
}) => {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];

  return (
    <div
      style={{
        background: "#151a22",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 10,
        padding: "9px 12px",
        fontSize: "0.72rem",
        color: "#f4f7fb",
        boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
      }}
    >
      <div
        style={{
          color: item.payload.fill,
          fontWeight: 700,
          marginBottom: 4,
        }}
      >
        {LABELS[item.name] || item.name}
      </div>

      <div>
        <strong>{item.value}</strong>{" "}
        event{item.value !== 1 ? "s" : ""}
      </div>
    </div>
  );
};

const CustomLegend = ({ payload }) => {
  if (!payload) return null;

  return (
    <ul
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px 15px",
        listStyle: "none",
        justifyContent: "center",
        marginTop: 8,
        padding: 0,
      }}
    >
      {payload.map((entry, index) => (
        <li
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#737d8d",
            fontSize: "0.68rem",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: entry.color,
              flexShrink: 0,
              boxShadow: `0 0 8px ${entry.color}55`,
            }}
          />

          {LABELS[entry.value] ||
            entry.value}
        </li>
      ))}
    </ul>
  );
};

const LanguageBreakdown = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <span
          className="empty-icon"
          aria-hidden="true"
        >
          🥧
        </span>

        <p>No breakdown yet</p>

        <small>
          Events will appear here as they arrive
          through your webhook.
        </small>
      </div>
    );
  }

  const formatted = data.map(
    (item, index) => ({
      name: item._id,
      value: item.count,
      fill:
        COLORS[item._id] ||
        FALLBACK_COLORS[
          index %
            FALLBACK_COLORS.length
        ],
    })
  );

  return (
    <ResponsiveContainer
      width="100%"
      height={235}
    >
      <PieChart>
        <Pie
          data={formatted}
          cx="50%"
          cy="43%"
          innerRadius={55}
          outerRadius={83}
          paddingAngle={3}
          dataKey="value"
          nameKey="name"
          stroke="none"
        >
          {formatted.map(
            (entry, index) => (
              <Cell
                key={index}
                fill={entry.fill}
              />
            )
          )}
        </Pie>

        <Tooltip
          content={<CustomTooltip />}
        />

        <Legend
          content={<CustomLegend />}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default LanguageBreakdown;