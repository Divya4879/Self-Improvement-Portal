"use client";
import React, { ReactElement, useEffect, useState } from 'react';
import Link from "next/link";
import { getLogEntries, LogEntry } from "../utils/localStorage";
import { getChallenges, saveChallenges } from "../utils/challengeStorage";
import LogEntryForm from "../components/LogEntryForm";
import DayLogChart from "../components/DayLogChart";
import ActivityPieChart from "../components/ActivityPieChart";
import MoodChart from "../components/MoodChart";
import ChallengeForm, { Challenge } from "../components/ChallengeForm";
import ChallengeList from "../components/ChallengeList";
import ChallengeProgressForm from "../components/ChallengeProgressForm";
import StreakChart from "../components/StreakChart";
import CompletionPieChart from "../components/CompletionPieChart";
import { v4 as uuidv4 } from "uuid";

const motivationalTips = [
  "Keep pushing forward!",
  "Believe in yourself!",
  "Every step counts!",
  "You can do it!",
  "Stay focused, stay strong!",
];

export default function HomePage(): ReactElement {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [tip, setTip] = useState<string>("");

  useEffect(() => {
    setLogEntries(getLogEntries());
    const storedChallenges = getChallenges();
    if (storedChallenges && storedChallenges.length > 0) {
      setChallenges(storedChallenges);
    }
    setTip(motivationalTips[Math.floor(Math.random() * motivationalTips.length)]);
  }, []);

  useEffect(() => {
    saveChallenges(challenges);
  }, [challenges]);

  const handleLogEntrySaved = () => {
    setLogEntries(getLogEntries());
  };

  const addChallenge = (challengeData: Omit<Challenge, "id" | "progress" | "hasEdited" | "color">) => {
    if (challenges.length >= 5) {
      alert("Maximum of 5 challenges allowed.");
      return;
    }
    const newChallenge: Challenge = {
      ...challengeData,
      id: uuidv4(),
      progress: {},
      hasEdited: false,
      color: getRandomColor(),
    };
    setChallenges([...challenges, newChallenge]);
  };

  const deleteChallenge = (id: string) => {
    setChallenges(challenges.filter((c) => c.id !== id));
    if (selectedChallengeId === id) setSelectedChallengeId(null);
  };

  const editChallenge = (id: string, updatedData: Partial<Challenge>) => {
    setChallenges(challenges.map((c) => {
      if (c.id === id) {
        if (c.hasEdited) {
          alert("This challenge can only be edited once.");
          return c;
        }
        return { ...c, ...updatedData, hasEdited: true };
      }
      return c;
    }));
  };

  const updateChallengeProgress = (updatedChallenge: Challenge) => {
    setChallenges(challenges.map(ch => (ch.id === updatedChallenge.id ? updatedChallenge : ch)));
  };

  const selectedChallenge = challenges.find(c => c.id === selectedChallengeId) || null;

  return (
    <div className="container mx-auto p-8 w-3/4 space-y-12">

      <section id="home" className="scroll-mt-[52rem] space-y-4">
        <div className="w-full px-8">
          <h2 className="text-3xl font-semibold italic">
            This portal helps you track your daily habits, monitor progress, and challenge yourself with new goals.
            Log your activities, view detailed analytics, and explore challenges to keep you motivated.
          </h2>
        </div>
      </section>

      <section id="dashboard" className="scroll-mt-24 space-y-8 border-t pt-8">
        <h2 className="text-4xl font-bold text-center">Dashboard</h2>
        <h3 className="text-xl font-bold text-center">
          Log your daily activities and view detailed analytics.
        </h3>
        <div>
          <h3 className="text-xl font-semibold mb-4">Add a New Log Entry</h3>
          <LogEntryForm onEntrySaved={handleLogEntrySaved} />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Today's Log Entries (24-Hour View)
          </h3>
          <DayLogChart logs={logEntries} />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Activity Breakdown</h3>
          <ActivityPieChart logs={logEntries} />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Mood Overview</h3>
          <MoodChart logs={logEntries} />
        </div>
      </section>

      <section id="challenges" className="scroll-mt-24 space-y-8 border-t pt-8">
      <h2 className="text-4xl font-bold text-center">Challenges</h2>
        <ChallengeForm onSubmit={addChallenge} />
        <ChallengeList
          challenges={challenges}
          onSelect={setSelectedChallengeId}
          onDelete={deleteChallenge}
          onEdit={editChallenge}
        />
        {selectedChallenge && (
          <div className="space-y-6 mt-8 text-center">
            <h2 className="text-2xl font-bold">Progress for: {selectedChallenge.activity}</h2>
            <ChallengeProgressForm challenge={selectedChallenge} updateChallenge={updateChallengeProgress} />
            <div className="flex flex-wrap gap-8 mt-8 justify-center">
              <div className="w-full md:w-1/2 h-72 my-4">
                <h3 className="text-xl font-semibold mb-2">Streak Chart</h3>
                <StreakChart challenge={selectedChallenge} />
              </div>
              <div className="w-full md:w-1/2 h-72 my-4">
                <h3 className="text-xl font-semibold mb-2">Completion Chart</h3>
                <CompletionPieChart challenge={selectedChallenge} />
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function getRandomColor(): string {
  const colors = [
    "#EF4444", "#10B981", "#3B82F6", "#EC4899", "#F59E0B",
    "#8B5CF6", "#FBBF24", "#14B8A6", "#0EA5E9", "#F472B6",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
