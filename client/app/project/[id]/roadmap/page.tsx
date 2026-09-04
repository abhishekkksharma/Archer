"use client";

import React from "react";
import { Map, Flag, CheckCircle, Circle } from "lucide-react";

export default function ProjectRoadmapPage() {
  const milestones = [
    {
      phase: "Phase 1: Planning & Architecture",
      status: "Completed",
      tasks: ["Define project requirements", "Choose Tech Stack", "Initial database schema setup"],
    },
    {
      phase: "Phase 2: Core Development",
      status: "In Progress",
      tasks: ["Implement Auth & User Management", "Build Main Dashboard & Navigation", "Integrate API Endpoints"],
    },
    {
      phase: "Phase 3: AI Capabilities & Polish",
      status: "Upcoming",
      tasks: ["Integrate AI assistance tools", "UI fine-tuning & micro-interactions", "Performance optimization"],
    },
    {
      phase: "Phase 4: Deployment & Release",
      status: "Upcoming",
      tasks: ["CI/CD Pipeline setup", "Production build verification", "Final launch"],
    },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-blue-500">
          <Map className="w-5 h-5" />
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Project Roadmap
          </h1>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Development milestones and execution timeline.
        </p>
      </div>

      <div className="space-y-4">
        {milestones.map((m, idx) => (
          <div
            key={m.phase}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 space-y-3 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                {m.phase}
              </h2>
              <span
                className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                  m.status === "Completed"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : m.status === "In Progress"
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                }`}
              >
                {m.status}
              </span>
            </div>

            <ul className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              {m.tasks.map((task) => (
                <li key={task} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                  {m.status === "Completed" ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-zinc-400 shrink-0" />
                  )}
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
