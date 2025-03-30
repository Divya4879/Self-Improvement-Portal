import { LogEntry } from "./localStorage";

export interface AggregatedResult {
  totalLogs: number;
  averageDuration: number;
  averagePreMood: number;
  averagePostMood: number;
}

export function filterTodayLogs(logs: LogEntry[]): LogEntry[] {
  const today = new Date().toISOString().split("T")[0];
  return logs.filter((entry) => entry.date.startsWith(today));
}

export function aggregateByWeek(logs: LogEntry[]): Record<string, LogEntry[]> {
  const weeklyMap: Record<string, LogEntry[]> = {};
  logs.forEach((entry) => {
    const date = new Date(entry.date);
    const year = date.getUTCFullYear();
    const firstJan = new Date(Date.UTC(year, 0, 1));
    const days = Math.floor((date.getTime() - firstJan.getTime()) / (24 * 3600 * 1000));
    const weekNum = Math.ceil((days + firstJan.getUTCDay() + 1) / 7);
    const weekKey = `${year}-W${String(weekNum).padStart(2, "0")}`;
    if (!weeklyMap[weekKey]) weeklyMap[weekKey] = [];
    weeklyMap[weekKey].push(entry);
  });
  return weeklyMap;
}

export function aggregateByMonth(logs: LogEntry[]): Record<string, LogEntry[]> {
  const monthlyMap: Record<string, LogEntry[]> = {};
  logs.forEach((entry) => {
    const date = new Date(entry.date);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const monthKey = `${year}-${String(month).padStart(2, "0")}`;
    if (!monthlyMap[monthKey]) monthlyMap[monthKey] = [];
    monthlyMap[monthKey].push(entry);
  });
  return monthlyMap;
}

export function aggregateByHour(logs: LogEntry[]): Record<number, LogEntry[]> {
  const hourlyMap: Record<number, LogEntry[]> = {};
  logs.forEach((entry) => {
    const date = new Date(entry.date);
    const hour = date.getHours();
    if (!hourlyMap[hour]) {
      hourlyMap[hour] = [];
    }
    hourlyMap[hour].push(entry);
  });
  return hourlyMap;
}

export function aggregateDaily(logs: LogEntry[]): Record<string, AggregatedResult> {
  const daily: Record<string, AggregatedResult> = {};
  logs.forEach((entry) => {
    const day = entry.date.split("T")[0];
    if (!daily[day]) {
      daily[day] = { totalLogs: 0, averageDuration: 0, averagePreMood: 0, averagePostMood: 0 };
    }
    daily[day].totalLogs += 1;
    daily[day].averageDuration += entry.duration;
    daily[day].averagePreMood += entry.preMood;
    daily[day].averagePostMood += entry.postMood;
  });
  return daily;
}

export function aggregateActivityDurations(logs: LogEntry[]): Record<string, number> {
  const activityMap: Record<string, number> = {};
  logs.forEach((entry) => {
    const type = entry.activityType || entry.activity;
    if (!activityMap[type]) {
      activityMap[type] = 0;
    }
    activityMap[type] += entry.duration;
  });
  return activityMap;
}

export function generateChallengeDates(start: string, end: string): { dayNum: number; date: string }[] {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const dates: { dayNum: number; date: string }[] = [];
  let dayNum = 1;
  for (let dt = new Date(startDate); dt <= endDate; dt.setDate(dt.getDate() + 1), dayNum++) {
    dates.push({ dayNum, date: dt.toISOString().slice(0, 10) });
  }
  return dates;
}

export function computeChallengeCompletion(challenge: { startDate: string; endDate: string; progress: { [date: string]: { completed: boolean } } }): { totalDays: number; completedDays: number } {
  const dates = generateChallengeDates(challenge.startDate, challenge.endDate);
  const totalDays = dates.length;
  const completedDays = dates.filter(({ date }) => challenge.progress[date]?.completed).length;
  return { totalDays, completedDays };
}