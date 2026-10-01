"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tooltipStyle = {
  borderRadius: 6,
  border: "1px solid #D8D2C6",
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
        <CartesianGrid strokeDasharray="3 3" stroke="#EDE9E0" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#7A807B" }} />
        <YAxis tick={{ fontSize: 11, fill: "#7A807B" }} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend iconType="plainline" wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="newLeads"
          name="New leads"
          stroke="#4D5B4B"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="wins"
          name="Wins"
          stroke="#A65B43"
          strokeWidth={2}
          strokeDasharray="6 3"
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
        <CartesianGrid strokeDasharray="3 3" stroke="#EDE9E0" />
        <XAxis
          type="number"
          allowDecimals={false}
          tick={{ fontSize: 11, fill: "#7A807B" }}
        />
        <YAxis
          type="category"
          dataKey="reason"
          width={105}
          tick={{ fontSize: 11, fill: "#7A807B" }}
        />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar
          dataKey="count"
          name="Lost deals"
          fill="#4D5B4B"
          radius={[0, 4, 4, 0]}
          maxBarSize={22}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
