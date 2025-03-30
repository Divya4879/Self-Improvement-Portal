export interface LogEntry {
  id: string;
  date: string;         
  activity: string;
  activityType?: string; 
  duration: number;     
  notes?: string;
  preMood: number;
  postMood: number;
}

const LOG_ENTRIES_KEY = "logEntries";

export const getLogEntries = (): LogEntry[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(LOG_ENTRIES_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error parsing log entries:", error);
      return [];
    }
  }
  return [];
};

export const addLogEntry = (entry: LogEntry): void => {
  if (typeof window === "undefined") return;
  const entries = getLogEntries();
  entries.push(entry);
  localStorage.setItem(LOG_ENTRIES_KEY, JSON.stringify(entries));
};

export const updateLogEntry = (updatedEntry: LogEntry): void => {
  if (typeof window === "undefined") return;
  const entries = getLogEntries().map((entry) =>
    entry.id === updatedEntry.id ? updatedEntry : entry
  );
  localStorage.setItem(LOG_ENTRIES_KEY, JSON.stringify(entries));
};