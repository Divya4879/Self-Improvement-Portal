"use client";
import React, { ReactElement } from 'react';
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

interface DayLogChartProps {
  logs: LogEntry[];
}

export default function DayLogChart({ logs }: DayLogChartProps): ReactElement {
  const todayLogs = filterTodayLogs(logs);

  const containerBg = "#2D0F53";   
  const labelColor = "#D6BBFB";    
  const gridColor = "#D6BBFB33";   

  const datasets = todayLogs.map((entry, index) => {
    const date = new Date(entry.date);
    const endHour = date.getHours() + date.getMinutes() / 60;
    const startHour = endHour - (entry.duration / 60);
    return {
      label: entry.activity,  
      data: [{ x: startHour, y: entry.duration, logDetails: entry }],
      backgroundColor: barPalette[index % barPalette.length],
      barThickness: 20,
    };
  });

  const data = { datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "linear" as const,
        position: "bottom" as const,
        title: { display: true, text: "Hour of Day", color: labelColor },
        min: 0,
        max: 24,
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
            const idx = tooltipItems[0].datasetIndex;
            if (idx < todayLogs.length - 1) {
              const nextEntry = todayLogs[idx + 1];
              return `${nextEntry.activity} (${nextEntry.duration} min)`;
            }
            return "";
          },
          label: (context: any) => {
            const entry: LogEntry = context.raw.logDetails || {};
            const tooltipLines = [
              `Activity: ${entry.activity}`,
              `Duration: ${entry.duration} min`,
              `Pre Mood: ${entry.preMood}`,
              `Post Mood: ${entry.postMood}`,
            ];
            if (entry.notes) {
              tooltipLines.push(`Notes: ${entry.notes}`);
            }
            return tooltipLines;
          },
        },
      },
      title: {
        display: true,
        text: "Today's Log Entries (24 Hours)",
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
      ctx.fillRect(chartArea.left, chartArea.top, chartArea.width, chartArea.height);
      ctx.restore();
    },
  };

  return (
    <div className="w-full h-96 bg-[#2D0F53] p-4">
      <Bar data={data} options={options} plugins={[chartBackgroundPlugin]} />
    </div>
  );
}