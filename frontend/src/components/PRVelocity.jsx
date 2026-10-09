import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

const COLORS = {
  push: "#5b9cff",
  pull_request: "#9b8afb",
  issues: "#ff6b7a",
  star: "#f5b942",
  create: "#35d07f",
  delete: "#ff6b7a",
  fork: "#38c9e8",
  release: "#35d09a",
};

const LABELS = {
  push: "Push",
  pull_request: "Pull Request",
  issues: "Issues",
  star: "Star",
  create: "Create",
  delete: "Delete",
  fork: "Fork",
  release: "Release",
};

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
        }}
      >
        {LABELS[label] || label}
      </div>

      <div>
        <strong>{value}</strong>{" "}
        event{value !== 1 ? "s" : ""}
      </div>
    </div>
  );
};

const PRVelocity = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <span
          className="empty-icon"
          aria-hidden="true"
        >
          🔀
        </span>

        <p>No event data yet</p>

        <small>
          Open a PR or push code to see activity
          here.
        </small>
      </div>
    );
  }

  return (
    <ResponsiveContainer
      width="100%"
      height={220}
    >
      <BarChart
        data={data}
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
          dataKey="_id"
          tick={{
            fill: "#596476",
            fontSize: 10,
          }}
          tickFormatter={(value) =>
            LABELS[value] || value
          }
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
            fill: "rgba(255,255,255,0.035)",
          }}
        />

        <Bar
          dataKey="count"
          radius={[5, 5, 0, 0]}
          maxBarSize={42}
        >
          {data.map((entry) => (
            <Cell
              key={entry._id}
              fill={
                COLORS[entry._id] ||
                "#5b9cff"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PRVelocity;