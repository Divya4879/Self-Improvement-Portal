"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export interface Challenge {
  id: string;
  activity: string;
  startDate: string;  
  endDate: string;    
  minDailyTime?: number;
  progress: {
    [date: string]: {
      completed: boolean;
      duration?: number;
      notes?: string;
    };
  };
  hasEdited: boolean;
  color: string;
}

interface ChallengeFormProps {
  onSubmit: (challenge: Omit<Challenge, "id" | "progress" | "hasEdited" | "color">) => void;
}

const ChallengeForm: React.FC<ChallengeFormProps> = ({ onSubmit }) => {
  const [activity, setActivity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [durationDays, setDurationDays] = useState<number | undefined>(undefined);
  const [minDailyTime, setMinDailyTime] = useState<number | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity || !startDate || durationDays === undefined) {
      alert("Please fill in all required fields.");
      return;
    }
    if (durationDays < 5 || durationDays > 100) {
      alert("Duration must be between 5 and 100 days.");
      return;
    }
    
    const start = new Date(startDate);
    start.setDate(start.getDate() + durationDays);
    const endDate = start.toISOString().split("T")[0];

    onSubmit({ activity, startDate, endDate, minDailyTime });
    setActivity("");
    setStartDate("");
    setDurationDays(undefined);
    setMinDailyTime(undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
      <h2 className="text-2xl font-bold">Create a New Challenge</h2>
      <div>
        <label className="block font-semibold mb-1">
          Challenge Activity:
          <input
            type="text"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            required
            className="block w-full mt-1 p-2 border rounded"
          />
        </label>
      </div>
      <div>
        <label className="block font-semibold mb-1">
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="block w-full mt-1 p-2 border rounded"
          />
        </label>
      </div>
      <div>
        <label className="block font-semibold mb-1">
          Time Duration (days, 5-100):
          <input
            type="number"
            value={durationDays !== undefined ? durationDays : ""}
            onChange={(e) =>
              setDurationDays(e.target.value ? parseInt(e.target.value) : undefined)
            }
            required
            min={5}
            max={100}
            className="block w-full mt-1 p-2 border rounded"
          />
        </label>
      </div>
      <div>
        <label className="block font-semibold mb-1">
          Minimum Daily Time (optional, minutes):
          <input
            type="number"
            value={minDailyTime || ""}
            onChange={(e) =>
              setMinDailyTime(e.target.value ? parseInt(e.target.value) : undefined)
            }
            className="block w-full mt-1 p-2 border rounded"
          />
        </label>
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-purpleTheme text-white rounded hover:opacity-90"
      >
        Add Challenge
      </button>
    </form>
  );
};

export default ChallengeForm;