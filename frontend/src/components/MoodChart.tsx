"use client";
import React, { ReactElement, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { LogEntry } from "../utils/localStorage";
import { filterTodayLogs } from "../utils/aggregator";

ChartJS.register(LinearScale, BarElement, Title, Tooltip, Legend);

const barPalette = [
  "#EF4444", 
  "#10B981", 
  "#3B82F6", 
  "#EC4899", 
  "#F59E0B", 
  "#8B5CF6", 
  "#FBBF24", 
  "#14B8A6", 
  "#0EA5E9", 
  "#F472B6", 
];

interface MoodChartProps {
  logs: LogEntry[];
}

export default function MoodChart({ logs }: MoodChartProps): ReactElement {
  const today = new Date();
  const pastWeekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - i);
    return d.toISOString().split("T")[0];
  }).reverse();

  const [selectedDate, setSelectedDate] = useState<string>(today.toISOString().split("T")[0]);

  const filteredLogs = logs.filter((entry) =>
    entry.date.startsWith(selectedDate)
  );

  const logsByHour: Record<number, LogEntry[]> = {};
  filteredLogs.forEach((entry) => {
    const hr = new Date(entry.date).getHours();
    if (!logsByHour[hr]) logsByHour[hr] = [];
    logsByHour[hr].push(entry);
  });

  const moodByHour: Record<number, { pre: number[]; post: number[] }> = {};
  filteredLogs.forEach((entry) => {
    const hour = new Date(entry.date).getHours();
    if (!moodByHour[hour]) {
      moodByHour[hour] = { pre: [], post: [] };
    }
    moodByHour[hour].pre.push(entry.preMood);
    moodByHour[hour].post.push(entry.postMood);
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const avgPreMood = hours.map((hour) => {
    const moods = moodByHour[hour]?.pre || [];
    return moods.length ? moods.reduce((a, b) => a + b, 0) / moods.length : 0;
  });
  const avgPostMood = hours.map((hour) => {
    const moods = moodByHour[hour]?.post || [];
    return moods.length ? moods.reduce((a, b) => a + b, 0) / moods.length : 0;
  });

  const containerBg = "#2D0F53"; 
  const labelColor = "#D6BBFB";  
  const gridColor = "#D6BBFB33"; 

  const data = {
    labels: hours,
    datasets: [
      {
        label: "Pre Mood",
        data: avgPreMood,
        backgroundColor: "#8B5CF6", 
        barThickness: 20,
      },
      {
        label: "Post Mood",
        data: avgPostMood,
        backgroundColor: "#3B82F6", 
        barThickness: 20,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "linear" as const,
        position: "bottom" as const,
        ticks: { stepSize: 1, color: labelColor },
        grid: { color: gridColor },
      },
      y: {
        ticks: { color: labelColor },
        grid: { color: gridColor },
      },
    },
    plugins: {
      tooltip: {
        bodyColor: labelColor,
        titleColor: labelColor,
        callbacks: {
          title: (tooltipItems: any) => {
            const hour = Math.floor(tooltipItems[0].parsed.x);
            const entries = logsByHour[hour] || [];
            if (entries.length === 0) return "";
            return entries
              .map(
                (entry) =>
                  `Activity: ${entry.activity}\nDuration: ${entry.duration} min\nPre/Post Activity Mood: ${entry.preMood} / ${entry.postMood}`
              )
              .join("\n");
          },
          label: (context: any) => {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}`;
          },
        },
      },
      title: {
        display: true,
        text: `Mood Overview for ${selectedDate}`,
        color: labelColor,
      },
      legend: {
        labels: { color: labelColor },
        position: "top" as const,
      },
    },
  };

  const chartBackgroundPlugin = {
    id: "chartBackground",
    beforeDraw: (chart: any) => {
      const { ctx, chartArea } = chart;
      ctx.save();
      ctx.fillStyle = containerBg;
      ctx.fillRect(chartArea.left, chartArea.top, chartArea.width, chartArea.height + 32);
      ctx.restore();
    },
  };

  return (
    
    <div className="w-full bg-[#2D0F53] p-8">
      <div className="mb-4">
        <label className="font-semibold mr-2 text-[#D6BBFB]">Select Date:</label>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border rounded"
        >
          {pastWeekDates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full h-96">
        <Bar data={data} options={options} plugins={[chartBackgroundPlugin]} />
      </div>
      
      <div className="text-center mt-2 text-[#D6BBFB] font-semibold">
        Hour of Day
      </div>
    </div>
  );
}