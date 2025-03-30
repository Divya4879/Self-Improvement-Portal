"use client";
import React, { ReactElement } from 'react';
import { useEffect, useState } from "react";

export default function ThemeToggle(): ReactElement {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as "light" | "dark") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-4 text-4xl py-2 text-purpleTheme rounded focus:outline-none"
      aria-label="Toggle dark/light theme"
    >
      {theme === "light" ? "🌚" : "🌝"}
    </button>
  );
}