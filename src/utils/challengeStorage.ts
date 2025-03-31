import { Challenge } from "./../components/ChallengeForm";

const CHALLENGE_STORAGE_KEY = "challenges";

export const getChallenges = (): Challenge[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(CHALLENGE_STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing challenges from localStorage:", error);
      return [];
    }
  }
  return [];
};

export const saveChallenges = (challenges: Challenge[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHALLENGE_STORAGE_KEY, JSON.stringify(challenges));
};