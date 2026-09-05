"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ITask {
  _id?: string;
  title: string;
  description?: string;
  order: number;
  estimatedHours?: number;
  priority?: "low" | "medium" | "high";
  status: "not_started" | "in_progress" | "completed" | "blocked";
}

export interface IPhase {
  _id?: string;
  phaseNumber: number;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  order: number;
  tasks: ITask[];
}

interface PhaseCardProps {
  phase: IPhase;
  phaseIndex: number;
  onToggleTaskStatus: (phaseIndex: number, taskIndex: number) => void;
}

export const PhaseCard: React.FC<PhaseCardProps> = ({
  phase,
  phaseIndex,
  onToggleTaskStatus,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const tasks = phase.tasks || [];
  const visibleTasks = isExpanded ? tasks : tasks.slice(0, 3);
  const hiddenCount = tasks.length - 3;

  const phaseCompletedCount = tasks.filter((t) => t.status === "completed").length;
  const phaseProgressPct =
    tasks.length > 0 ? Math.round((phaseCompletedCount / tasks.length) * 100) : 0;

  // Determine Phase Status
  const phaseStatus =
    phaseCompletedCount === tasks.length && tasks.length > 0
      ? "Completed"
      : tasks.some((t) => t.status === "in_progress" || t.status === "completed")
      ? "In Progress"
      : "Not Started";

  const difficulty = phase.difficulty || "medium";

  // Difficulty badge styling helper
  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "easy":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "hard":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default:
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    }
  };

  return (
    <div
      className={`
        rounded-2xl border transition-all duration-300 p-5 sm:p-6 space-y-4 shadow-sm hover:shadow-md
        ${
          phaseStatus === "Completed"
            ? "border-blue-500/30 bg-blue-50/20 dark:bg-blue-950/10 dark:border-blue-900/40"
            : phaseStatus === "In Progress"
            ? "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#0d0d10]"
            : "border-zinc-200 dark:border-zinc-800/70 bg-white dark:bg-[#0c0c0e]"
        }
      `}
    >
      {/* Header Row: Phase Label + Status Badge (Left), Difficulty Badge (Right) */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
            Phase {phase.phaseNumber || phaseIndex + 1}
          </span>

          <span
            className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border transition-colors ${
              phaseStatus === "Completed"
                ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
                : phaseStatus === "In Progress"
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700/60"
            }`}
          >
            {phaseStatus}
          </span>
        </div>

        {/* Difficulty Badge */}
        <span
          className={`px-3 py-0.5 text-xs font-medium rounded-full border ${getDifficultyBadge(
            difficulty
          )}`}
        >
          {difficulty}
        </span>
      </div>

      {/* Phase Title & Description */}
      <div>
        <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
          {phase.title}
        </h3>
        {phase.description && (
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
            {phase.description}
          </p>
        )}
      </div>

      {/* Task Progress Section */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <span>
            {phaseCompletedCount} / {tasks.length} tasks completed
          </span>
          <span className="font-bold text-zinc-900 dark:text-white">
            {phaseProgressPct}%
          </span>
        </div>

        {/* Progress Bar (Minimal Blue Accent) */}
        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800/80 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              phaseStatus === "Completed"
                ? "bg-blue-500"
                : "bg-blue-500/80 dark:bg-blue-400/80"
            }`}
            style={{ width: `${phaseProgressPct}%` }}
          />
        </div>
      </div>

      {/* Tasks List */}
      {tasks.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
          <AnimatePresence initial={false}>
            {visibleTasks.map((task, tIndex) => {
              const isCompleted = task.status === "completed";
              const isInProgress = task.status === "in_progress";

              return (
                <motion.div
                  key={task._id || `task-${tIndex}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onClick={() => onToggleTaskStatus(phaseIndex, tIndex)}
                  className="flex items-start gap-3 text-xs sm:text-sm cursor-pointer group transition-colors py-1"
                >
                  {/* Blue Task Check Icon */}
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    ) : isInProgress ? (
                      <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors" />
                    )}
                  </div>

                  <span
                    className={`transition-all leading-snug ${
                      isCompleted
                        ? "line-through text-zinc-400 dark:text-zinc-500"
                        : "text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium"
                    }`}
                  >
                    {task.title}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* "+N more tasks" Expand/Collapse Button */}
          {hiddenCount > 0 && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium pt-1 cursor-pointer flex items-center gap-1 transition-colors"
            >
              <span>+{hiddenCount} more tasks</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}

          {isExpanded && hiddenCount > 0 && (
            <button
              onClick={() => setIsExpanded(false)}
              className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium pt-1 cursor-pointer flex items-center gap-1 transition-colors"
            >
              <span>Show less</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
