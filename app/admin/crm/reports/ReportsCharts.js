"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tooltipStyle = {
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  boxShadow: "0 8px 24px rgba(15,23,42,.08)",
  fontSize: 12,
};

export function TrendChart({ data }) {
  const formatted = data.map((item) => ({
    ...item,
    label: new Date(item.date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),
  }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart
        data={formatted}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
        <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line
          type="monotone"
          dataKey="newLeads"
          name="New leads"
          stroke="#2563eb"
          strokeWidth={2.5}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="wins"
          name="Wins"
          stroke="#059669"
          strokeWidth={2.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function LossChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 10, left: 15, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          type="number"
          allowDecimals={false}
          tick={{ fontSize: 11, fill: "#64748b" }}
        />
        <YAxis
          type="category"
          dataKey="reason"
          width={105}
          tick={{ fontSize: 11, fill: "#64748b" }}
        />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar
          dataKey="count"
          name="Lost deals"
          fill="#e11d48"
          radius={[0, 5, 5, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
