"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  scrolled?: boolean;
}

function ThemeToggle({ scrolled }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const hasDarkClass = document.documentElement.classList.contains("dark");

    if (savedTheme === "dark" || (!savedTheme && hasDarkClass)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }

    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;

    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) {
    return <div className="h-10 w-10" />;
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`
        flex h-10 w-10 items-center justify-center
        rounded-full
        transition-all duration-300
        hover:scale-105
        active:scale-95
        ${scrolled ? "text-slate-800 dark:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800" : "text-white hover:bg-white/10"}
      `}
    >
      {isDark ? (
        <Sun size={18} className="transition-transform duration-300" />
      ) : (
        <Moon size={18} className="transition-transform duration-300" />
      )}
    </button>
  );
}

export default ThemeToggle;
