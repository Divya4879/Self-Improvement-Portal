"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { LogEntry } from "../utils/localStorage";
import { aggregateDaily } from "../utils/aggregator";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AggregatedResult {
  totalLogs: number;
  averageDuration: number;
  averagePreMood: number;
  averagePostMood: number;
}

interface AnalyticsChartProps {
  logs: LogEntry[];
}

export default function AnalyticsChart({ logs }: AnalyticsChartProps) {
  const dailyResults = aggregateDaily(logs) as Record<string, AggregatedResult>;
  const labels = Object.keys(dailyResults).sort();
  const totalLogsData = labels.map((day) => dailyResults[day].totalLogs);

  const data = {
    labels,
    datasets: [
      {
        label: "Total Logs",
        data: totalLogsData,
        backgroundColor: "#8B5CF6", 
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Daily Log Count",
      },
    },
  };

  return <Bar data={data} options={options} />;
}