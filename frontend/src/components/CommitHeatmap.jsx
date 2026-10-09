import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CustomTooltip = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload?.length) {
    return null;
  }

  const value = payload[0].value;

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
          color: "#737d8d",
          marginBottom: 4,
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        {label}
      </div>

      <div>
        <strong>{value}</strong>{" "}
        commit{value !== 1 ? "s" : ""}
      </div>
    </div>
  );
};

const CommitHeatmap = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <span
          className="empty-icon"
          aria-hidden="true"
        >
          📊
        </span>

        <p>No commit data yet</p>

        <small>
          Push commits to a webhook-enabled repository
          to see activity here.
        </small>
      </div>
    );
  }

  const formatted = data.map((item) => ({
    date: item._id,
    commits: item.count,
  }));

  return (
    <ResponsiveContainer
      width="100%"
      height={220}
    >
      <BarChart
        data={formatted}
        margin={{
          top: 8,
          right: 5,
          left: -20,
          bottom: 0,
        }}
      >
        <CartesianGrid
          vertical={false}
          stroke="rgba(255,255,255,0.055)"
        />

        <XAxis
          dataKey="date"
          tick={{
            fill: "#596476",
            fontSize: 10,
          }}
          tickLine={false}
          axisLine={false}
        />

        <YAxis
          allowDecimals={false}
          tick={{
            fill: "#596476",
            fontSize: 10,
          }}
          tickLine={false}
          axisLine={false}
        />

        <Tooltip
          content={<CustomTooltip />}
          cursor={{
            fill: "rgba(91,156,255,0.05)",
          }}
        />

        <Bar
          dataKey="commits"
          fill="#5b9cff"
          radius={[5, 5, 0, 0]}
          maxBarSize={34}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CommitHeatmap;