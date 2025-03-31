"use client";

import { useState, FormEvent } from "react";
import { Challenge } from "./ChallengeForm";

interface ChallengeProgressFormProps {
  challenge: Challenge;
  updateChallenge: (updated: Challenge) => void;
}

const ChallengeProgressForm: React.FC<ChallengeProgressFormProps> = ({ challenge, updateChallenge }) => {
  const today = new Date().toISOString().slice(0, 10);
  const [completed, setCompleted] = useState(false);
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (challenge.progress[today]) {
      alert("Today's progress has already been recorded.");
      return;
    }
    const updatedProgress = {
      ...challenge.progress,
      [today]: { completed, duration, notes },
    };
    updateChallenge({ ...challenge, progress: updatedProgress });
    setCompleted(false);
    setDuration(undefined);
    setNotes("");
    alert("Progress recorded!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
      <h3 className="text-xl font-bold">Enter Today's Progress ({today})</h3>
      <div>
        <label className="block font-semibold text-left">
          Completed Challenge?
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="ml-2"
          />
        </label>
      </div>
      <div>
        <label className="block font-semibold text-left">
          Duration/Time (optional, minutes):
          <input
            type="number"
            value={duration || ""}
            onChange={(e) => setDuration(e.target.value ? parseInt(e.target.value) : undefined)}
            className="block w-full mt-1 p-2 border rounded"
          />
        </label>
      </div>
      <div>
        <label className="block font-semibold text-left">
          Notes (optional):
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="block w-full mt-1 p-2 border rounded"
          />
        </label>
      </div>
      <button type="submit" className="px-4 py-2 bg-purpleTheme text-white rounded hover:opacity-90">
        Log Progress
      </button>
    </form>
  );
};

export default ChallengeProgressForm;