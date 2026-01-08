"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions to avoid layout shift
    return (
      <div className="w-12 h-6 rounded-full bg-gray-200 border-2 border-gray-300 relative">
        <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5"></div>
      </div>
    );
  }

  const isDark = theme === "dark";

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    setTheme(nextTheme);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("theme", nextTheme);
    }
  };

  return (
    <button 
      onClick={toggleTheme}
      className={`w-12 h-6 rounded-full relative transition-all duration-300 border-2 ${
        isDark 
          ? 'bg-[var(--main-color)] border-[var(--main-color)]' 
          : 'bg-gray-200 border-gray-300'
      }`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
    >
      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform duration-300 flex items-center justify-center text-xs ${
        isDark ? 'transform translate-x-6' : 'translate-x-0.5'
      }`}>
        {isDark ? '🌙' : '☀️'}
      </div>
    </button>
  );
}
