"use client";
import React, { ReactElement } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartTooltip } from "recharts";
import { Challenge } from "./ChallengeForm";
import { generateChallengeDates, computeChallengeCompletion } from "../utils/aggregator";

interface CompletionPieChartProps {
  challenge: Challenge;
}

export default function CompletionPieChart({ challenge }: CompletionPieChartProps): ReactElement {
  const { totalDays, completedDays } = computeChallengeCompletion(challenge);

  const data = [
    { name: "Completed", value: completedDays },
    { name: "Remaining", value: totalDays - completedDays },
  ];

  const COLORS = [challenge.color, "#d684e3"];

  return (
    <div style={{ width: "25%", minWidth: "200px", height: "250px", margin: "0 auto" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={80} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <RechartTooltip formatter={(value: any) => `${value} days`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}