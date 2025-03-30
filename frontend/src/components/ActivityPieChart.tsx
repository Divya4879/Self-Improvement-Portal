"use client";
import React, { ReactElement, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartTooltip } from "recharts";
import { LogEntry } from "../utils/localStorage";
import { filterTodayLogs, aggregateByWeek, aggregateByMonth } from "../utils/aggregator";

const palette = [
  "#EF4444", "#10B981", "#3B82F6", "#EC4899", "#F59E0B",
  "#8B5CF6", "#FBBF24", "#14B8A6", "#0EA5E9", "#F472B6"
];

interface ActivityPieChartProps {
  logs: LogEntry[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: "10px",
          whiteSpace: "pre-line",
          borderRadius: "12px",
          color: "purple"
        }}
      >
        <>
          <p style={{ fontWeight: "bold", textDecoration: "underline" }}>{data.name}</p>
          <p>Total Time: {data.value} mins</p>
          {Object.entries(data.details).map(([activity, mins]) => (
            <p key={activity}>{activity}: {mins} mins</p>
          ))}
        </>
      </div>
    );
  }
  return null;
};

export default function ActivityPieChart({ logs }: ActivityPieChartProps): ReactElement {
  const [period, setPeriod] = React.useState<"day" | "week" | "month">("day");

  let relevantLogs: LogEntry[] = [];
  if (period === "day") {
    relevantLogs = filterTodayLogs(logs);
  } else if (period === "week") {
    const weekly = aggregateByWeek(logs);
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentWeekKey = Object.keys(weekly).find(key => key.startsWith(String(currentYear)));
    if (currentWeekKey) {
      relevantLogs = weekly[currentWeekKey] || [];
    }
  } else if (period === "month") {
    const monthly = aggregateByMonth(logs);
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const monthKey = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;
    relevantLogs = monthly[monthKey] || [];
  }

  const activityAggregation = useMemo(() => {
    const map: Record<string, { total: number; details: Record<string, number> }> = {};
    relevantLogs.forEach((entry) => {
      const type = entry.activityType || entry.activity;
      if (!map[type]) {
        map[type] = { total: 0, details: {} };
      }
      map[type].total += entry.duration;
      const name = entry.activity;
      if (!map[type].details[name]) {
        map[type].details[name] = 0;
      }
      map[type].details[name] += entry.duration;
    });
    return map;
  }, [relevantLogs]);

  const labels = Object.keys(activityAggregation);
  const pieData = labels.map(label => ({
    name: label,
    value: activityAggregation[label].total,
    details: activityAggregation[label].details,
  }));

  const backgroundColors = labels.map((_, index) => palette[index % palette.length]);

  return (
    <div>
      <div className="mb-4">
        <label className="font-semibold mr-2">Select Period:</label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as "day" | "week" | "month")}
          className="p-2 border rounded"
        >
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>
      
      <div style={{ width: "50%", minWidth: "400px", height: "400px", margin: "0 auto" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
           
            <Pie data={pieData} dataKey="value" outerRadius={180} label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={backgroundColors[index % backgroundColors.length]} />
              ))}
            </Pie>
            <RechartTooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}