"use client";
import React, { ReactElement } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as RechartTooltip,
} from "recharts";
import { Challenge } from "./ChallengeForm";
import { generateChallengeDates } from "../utils/aggregator";

interface StreakChartProps {
  challenge: Challenge;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div style={{ backgroundColor: "#fff", border: "1px solid #ccc", padding: 10 }}>
        <p style={{ color: "purple", fontWeight:"bold" }}>{`Date: ${dataPoint.date}`}</p>
        <p  style={{ color: "purple", fontWeight:"bold" }}>{`Duration: ${dataPoint.duration} min`}</p>
        {dataPoint.notes && (
          <p style={{ color: "purple", fontWeight:"bold" }}>{`Notes: ${dataPoint.notes}`}</p>
        )}
      </div>
    );
  }
  return null;
};

export default function StreakChart({ challenge }: StreakChartProps): ReactElement {
  const dates = generateChallengeDates(challenge.startDate, challenge.endDate);

  const data = dates.map(({ dayNum, date }) => {
    const progress = challenge.progress[date];
    return {
      day: dayNum,
      duration: progress && progress.completed ? (progress.duration || 0) : 0,
      date, 
      notes: progress?.notes || "",
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis
          dataKey="day"
          tick={{ fontSize: 10 }}
          label={{ value: "Day", position: "insideBottom", offset: -5 }}
          domain={["dataMin", "dataMax"]}
        />
        <YAxis label={{ value: "Duration (min)", angle: -90, position: "insideLeft" }} />
        <RechartTooltip content={CustomTooltip} />
        <Bar dataKey="duration" fill={challenge.color} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}