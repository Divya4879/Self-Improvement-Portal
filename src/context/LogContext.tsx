"use client"; 
import React, { ReactElement } from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LogEntry, getLogEntries } from "./../utils/localStorage";

interface LogContextProps {
  logEntries: LogEntry[];
  setLogEntries: React.Dispatch<React.SetStateAction<LogEntry[]>>;
  preMood: number;
  setPreMood: React.Dispatch<React.SetStateAction<number>>;
  postMood: number;
  setPostMood: React.Dispatch<React.SetStateAction<number>>;
  theme: "light" | "dark";
  setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
}

const LogContext = createContext<LogContextProps | undefined>(undefined);

export const LogProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [preMood, setPreMood] = useState<number>(0);
  const [postMood, setPostMood] = useState<number>(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const entries = getLogEntries();
    setLogEntries(entries);
  }, []);

  return (
    <LogContext.Provider
      value={{
        logEntries,
        setLogEntries,
        preMood,
        setPreMood,
        postMood,
        setPostMood,
        theme,
        setTheme,
      }}
    >
      {children}
    </LogContext.Provider>
  );
};

export const useLogContext = (): LogContextProps => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error("useLogContext must be used within a LogProvider");
  }
  return context;
};