"use client";
import React, { ReactElement, FormEvent, useEffect, useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import { addLogEntry, LogEntry, getLogEntries } from "../utils/localStorage";
import StarRating from "./StarRating";

const ACTIVITY_TYPES_KEY = "activityTypes";

const defaultActivityTypes = [
  "Physical Activity",
  "Skill Development",
  "Meetings/Connections/Events",
  "Self Care",
];

function getActivityTypes(): string[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(ACTIVITY_TYPES_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error parsing activity types:", error);
      return defaultActivityTypes;
    }
  }
  return defaultActivityTypes;
}

function saveActivityTypes(types: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVITY_TYPES_KEY, JSON.stringify(types));
}

function toTitleCase(str: string): string {
  return str
    .split(' ')
    .filter(word => word)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default function LogEntryForm({ onEntrySaved }: { onEntrySaved?: () => void }): ReactElement {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const [time, setTime] = useState<string>(""); 
  const [activity, setActivity] = useState<string>("");
  const [activityType, setActivityType] = useState<string>(defaultActivityTypes[0]);
  const [customActivityType, setCustomActivityType] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [preMood, setPreMood] = useState<number>(0);
  const [postMood, setPostMood] = useState<number>(0);
  const [activityTypes, setActivityTypes] = useState<string[]>(getActivityTypes());

  useEffect(() => {
    saveActivityTypes(activityTypes);
  }, [activityTypes]);

  const hasOverlap = (newStart: number, newEnd: number): boolean => {
    const logs = getLogEntries();
    const today = new Date().toISOString().split("T")[0];
    const todayLogs = logs.filter(entry => entry.date.startsWith(today));
    for (const entry of todayLogs) {
      const entryDate = new Date(entry.date);
      const entryStart = entryDate.getHours() * 60 + entryDate.getMinutes();
      const entryEnd = entryStart + entry.duration;
      if (!(newEnd <= entryStart - 1 || newStart >= entryEnd + 1)) {
        return true;
      }
    }
    return false;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const todayDate = new Date();
    const [hours, minutes] = time.split(":").map(Number);
    todayDate.setHours(hours, minutes, 0, 0);
    const isoDate = todayDate.toISOString();
    const newStart = hours * 60 + minutes;
    const newEnd = newStart + duration;

    if (hasOverlap(newStart, newEnd)) {
      alert("This log entry overlaps with an existing entry. Please choose a non-overlapping time (at least 1 minute gap).");
      return;
    }

    const formattedActivity = toTitleCase(activity);
    let finalActivityType = activityType;
    if (activityType === "Other") {
      finalActivityType = toTitleCase(customActivityType);
      if (!activityTypes.includes(finalActivityType) && activityTypes.length < 10) {
        const updatedTypes = [...activityTypes, finalActivityType];
        setActivityTypes(updatedTypes);
      }
    } else {
      finalActivityType = toTitleCase(activityType);
    }

    const newEntry: LogEntry = {
      id: uuidv4(),
      date: isoDate,
      activity: formattedActivity,
      activityType: finalActivityType,
      duration,
      notes,
      preMood,
      postMood,
    };

    addLogEntry(newEntry);
    onEntrySaved && onEntrySaved();
    setTime("");
    setActivity("");
    setActivityType(activityTypes[0]);
    setCustomActivityType("");
    setDuration(0);
    setNotes("");
    setPreMood(0);
    setPostMood(0);
    alert("Log entry saved!");
  };

  const dropdownOptions = activityTypes.slice();
  if (activityTypes.length < 10) {
    dropdownOptions.push("Other");
  }

  return (
    <>
      {hasMounted && (
        <form onSubmit={handleSubmit} className="w-3/4 mx-auto space-y-4 border p-4 rounded">
          <div>
            <label className="block font-semibold mb-1">
              Time (HH:MM):
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="block w-full mt-1 p-2 border rounded"
              />
            </label>
          </div>
          <div>
            <label className="block font-semibold mb-1">
              Activity:
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
              Activity Type:
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                className="block w-full mt-1 p-2 border rounded"
              >
                {dropdownOptions.map((type, idx) => (
                  <option key={idx} value={type}>{type}</option>
                ))}
              </select>
            </label>
            {activityType === "Other" && (
              <label className="block font-semibold mb-1">
                Custom Activity Type:
                <input
                  type="text"
                  value={customActivityType}
                  onChange={(e) => setCustomActivityType(e.target.value)}
                  required
                  className="block w-full mt-1 p-2 border rounded"
                />
              </label>
            )}
          </div>
          <div>
            <label className="block font-semibold mb-1">
              Duration (minutes):
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                required
                className="block w-full mt-1 p-2 border rounded"
              />
            </label>
          </div>
          <div>
            <label className="block font-semibold mb-1">
              Notes:
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="block w-full mt-1 p-2 border rounded"
              />
            </label>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <h3 className="font-semibold text-left">Mood Before Activity:</h3>
            <StarRating
              totalStars={5}
              initialRating={preMood}
              onRatingChange={(rating) => setPreMood(rating)}
            />
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <h3 className="font-semibold text-left">Mood After Activity:</h3>
            <StarRating
              totalStars={5}
              initialRating={postMood}
              onRatingChange={(rating) => setPostMood(rating)}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-purpleTheme text-white rounded hover:opacity-90"
          >
            Save Entry
          </button>
        </form>
      )}
    </>
  );
}