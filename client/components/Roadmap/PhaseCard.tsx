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
  const hiddenCount = Math.max(tasks.length - 3, 0);

  const completed = tasks.filter((t) => t.status === "completed").length;
  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const status =
    completed === tasks.length && tasks.length
      ? "Completed"
      : tasks.some((t) => ["in_progress", "completed"].includes(t.status))
        ? "In Progress"
        : "Not Started";

  const difficultyStyles = {
    easy: "text-blue-600 dark:text-blue-400",
    medium: "text-amber-600 dark:text-amber-400",
    hard: "text-rose-600 dark:text-rose-400",
  };

  const statusStyles = {
    Completed:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    "In Progress":
      "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    "Not Started":
      "bg-zinc-100 text-zinc-500 dark:bg-zinc-800/70 dark:text-zinc-400",
  };

  return (
    <div
      className={`rounded-xl border p-4 sm:p-5 space-y-3 transition-colors ${
        status === "Completed"
          ? "border-blue-500/25 bg-blue-500/[0.02]"
          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0d0d10]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
            Phase {phase.phaseNumber || phaseIndex + 1}
          </span>

          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${statusStyles[status]}`}
          >
            {status}
          </span>
        </div>

        <span
          className={`text-[11px] font-medium capitalize ${
            difficultyStyles[phase.difficulty || "medium"]
          }`}
        >
          {phase.difficulty || "medium"}
        </span>
      </div>

      {/* Title */}
      <div>
        <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-white">
          {phase.title}
        </h3>

        {phase.description && (
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {phase.description}
          </p>
        )}
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
          <span>
            {completed}/{tasks.length} completed
          </span>
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            {progress}%
          </span>
        </div>

        <div className="h-1 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Tasks */}
      {tasks.length > 0 && (
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/70">
          <AnimatePresence initial={false}>
            <div className="space-y-1">
              {visibleTasks.map((task, index) => {
                const completed = task.status === "completed";
                const inProgress = task.status === "in_progress";

                return (
                  <motion.div
                    key={task._id || `task-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() =>
                      onToggleTaskStatus(phaseIndex, index)
                    }
                    className="flex items-center gap-2.5 py-1 cursor-pointer group"
                  >
                    {completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-blue-500" />
                    ) : inProgress ? (
                      <Clock className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 shrink-0 text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-600 dark:group-hover:text-zinc-400" />
                    )}

                    <span
                      className={`text-sm leading-snug ${
                        completed
                          ? "text-zinc-400 line-through"
                          : "text-zinc-700 dark:text-zinc-300 group-hover:text-blue-500"
                      }`}
                    >
                      {task.title}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>

          {/* Expand */}
          {hiddenCount > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1 flex items-center gap-1 text-[11px] font-medium text-zinc-400 hover:text-blue-500 transition-colors"
            >
              {isExpanded ? "Show less" : `+${hiddenCount} more`}
              {isExpanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
