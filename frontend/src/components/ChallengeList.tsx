"use client";

import { useState } from "react";
import { Challenge } from "./ChallengeForm";

interface ChallengeListProps {
  challenges: Challenge[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updatedData: Partial<Challenge>) => void;
}

const ChallengeList: React.FC<ChallengeListProps> = ({ challenges, onSelect, onDelete, onEdit }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedActivity, setEditedActivity] = useState("");
  
  const startEditing = (challenge: Challenge) => {
    setEditingId(challenge.id);
    setEditedActivity(challenge.activity);
  };

  const submitEdit = (id: string) => {
    onEdit(id, { activity: editedActivity });
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Challenges</h2>
      {challenges.length === 0 && <p>No challenges created yet.</p>}
      <ul className="space-y-4">
        {challenges.map((challenge) => (
          <li key={challenge.id} className="border p-4 rounded">
            {editingId === challenge.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editedActivity}
                  onChange={(e) => setEditedActivity(e.target.value)}
                  className="p-2 border rounded w-full"
                />
                <button onClick={() => submitEdit(challenge.id)} className="px-3 py-1 bg-green-500 text-white rounded">
                  Save (only 1 edit allowed)
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center">
                  <strong style={{ color: challenge.color }} className="text-xl">
                    {challenge.activity}
                  </strong>
                  <div className="space-x-2">
                    <button onClick={() => onSelect(challenge.id)} className="px-3 py-1 bg-blue-500 text-white rounded">
                      Select
                    </button>
                    
                    <button onClick={() => onDelete(challenge.id)} className="px-3 py-1 bg-red-500 text-white rounded">
                      Delete
                    </button>
                  </div>
                </div>
                <div className="text-sm">
                  <span>{challenge.startDate} to {challenge.endDate}</span>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChallengeList;

