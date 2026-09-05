"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  ListTodo,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  X,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ITaskItem {
  _id?: string;
  title: string;
  description?: string;
  order?: number;
  estimatedHours?: number;
  priority?: "low" | "medium" | "high";
  status: "not_started" | "in_progress" | "completed" | "blocked";
  dependencies?: string[];
}

export interface IRoadmapPhaseData {
  _id?: string;
  phaseNumber: number;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  order: number;
  tasks: ITaskItem[];
}

export interface IRoadmapFull {
  _id: string;
  projectId: string;
  phases: IRoadmapPhaseData[];
  statistics: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    notStartedTasks: number;
    blockedTasks: number;
    progress: number;
  };
}

interface TasksComponentProps {
  projectId: string;
}

function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }

  return null;
}

export default function TasksComponent({
  projectId,
}: TasksComponentProps) {
  const [roadmap, setRoadmap] = useState<IRoadmapFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add Task Modal
  const [activePhaseForModal, setActivePhaseForModal] =
    useState<IRoadmapPhaseData | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newHours, setNewHours] = useState(4);

  const [newPriority, setNewPriority] = useState<
    "low" | "medium" | "high"
  >("high");

  const [newStatus, setNewStatus] = useState<
    "not_started" | "in_progress" | "completed" | "blocked"
  >("not_started");

  const [submittingTask, setSubmittingTask] = useState(false);

  // Fetch Roadmap
  const fetchTasksData = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);

    try {
      const token =
        getCookie("token") ||
        getCookie("auth_token") ||
        getCookie("jwt");

      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "http://localhost:5000/api";

      const res = await fetch(
        `${backendUrl}/roadmaps/${projectId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? { Authorization: `Bearer ${token}` }
              : {}),
          },
        }
      );

      const json = await res.json();

      if (res.ok && json.success && json.data) {
        setRoadmap(json.data);
      } else {
        setError(json.message || "Failed to load tasks.");
      }
    } catch (err: any) {
      console.error("Tasks fetch error:", err);
      setError("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTasksData();
  }, [fetchTasksData]);

  // Cycle:
  // not_started -> in_progress -> completed -> blocked -> not_started
  const toggleTaskStatus = async (
    phaseIndex: number,
    taskIndex: number
  ) => {
    if (!roadmap) return;

    const updatedPhases = [...roadmap.phases];
    const targetTask =
      updatedPhases[phaseIndex].tasks[taskIndex];

    const nextStatus =
      targetTask.status === "not_started"
        ? "in_progress"
        : targetTask.status === "in_progress"
        ? "completed"
        : targetTask.status === "completed"
        ? "blocked"
        : "not_started";

    targetTask.status = nextStatus;

    // Recalculate statistics
    const allTasks = updatedPhases.flatMap(
      (phase) => phase.tasks || []
    );

    const totalTasks = allTasks.length;

    const completedTasks = allTasks.filter(
      (task) => task.status === "completed"
    ).length;

    const inProgressTasks = allTasks.filter(
      (task) => task.status === "in_progress"
    ).length;

    const blockedTasks = allTasks.filter(
      (task) => task.status === "blocked"
    ).length;

    const notStartedTasks =
      totalTasks -
      completedTasks -
      inProgressTasks -
      blockedTasks;

    const progress =
      totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

    const updatedRoadmap = {
      ...roadmap,
      phases: updatedPhases,
      statistics: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        notStartedTasks,
        blockedTasks,
        progress,
      },
    };

    setRoadmap(updatedRoadmap);

    // Sync with backend
    try {
      const token =
        getCookie("token") ||
        getCookie("auth_token") ||
        getCookie("jwt");

      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "http://localhost:5000/api";

      await fetch(`${backendUrl}/roadmaps/${roadmap._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
        body: JSON.stringify({
          phases: updatedPhases,
        }),
      });
    } catch (err) {
      console.error("Failed to sync task status:", err);
    }
  };

  // Add Task
  const handleAddTaskSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !newTitle.trim() ||
      !activePhaseForModal ||
      !roadmap
    ) {
      return;
    }

    setSubmittingTask(true);

    try {
      const token =
        getCookie("token") ||
        getCookie("auth_token") ||
        getCookie("jwt");

      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "http://localhost:5000/api";

      const res = await fetch(
        `${backendUrl}/tasks/roadmap/${roadmap._id}/phase/${activePhaseForModal.phaseNumber}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? { Authorization: `Bearer ${token}` }
              : {}),
          },
          body: JSON.stringify({
            title: newTitle.trim(),
            description: newDescription.trim(),
            estimatedHours: Number(newHours) || 4,
            priority: newPriority,
            status: newStatus,
          }),
        }
      );

      const json = await res.json();

      if (res.ok && json.success && json.roadmap) {
        setRoadmap(json.roadmap);
        setActivePhaseForModal(null);

        setNewTitle("");
        setNewDescription("");
        setNewHours(4);
        setNewPriority("high");
        setNewStatus("not_started");
      } else {
        alert(json.message || "Failed to add task.");
      }
    } catch (err) {
      console.error("Add task error:", err);
      alert("Error submitting new task.");
    } finally {
      setSubmittingTask(false);
    }
  };

  // Delete Task
  const handleDeleteTask = async (
    phaseNumber: number,
    taskIdOrTitle: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    if (!roadmap) return;

    try {
      const token =
        getCookie("token") ||
        getCookie("auth_token") ||
        getCookie("jwt");

      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "http://localhost:5000/api";

      const res = await fetch(
        `${backendUrl}/tasks/roadmap/${roadmap._id}/phase/${phaseNumber}/task/${encodeURIComponent(
          taskIdOrTitle
        )}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? { Authorization: `Bearer ${token}` }
              : {}),
          },
        }
      );

      const json = await res.json();

      if (res.ok && json.success && json.roadmap) {
        setRoadmap(json.roadmap);
      }
    } catch (err) {
      console.error("Delete task error:", err);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="p-4 max-w-4xl mx-auto space-y-5 animate-pulse">
        <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />

        <div className="space-y-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-3 w-64 bg-zinc-100 dark:bg-zinc-900 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error
  if (error || !roadmap) {
    return (
      <div className="p-6 max-w-md mx-auto text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />

        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
          Failed to load tasks
        </h2>

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {error}
        </p>

        <button
          onClick={fetchTasksData}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const phases = roadmap.phases || [];

  return (
    <div className="p-3 sm:p-5 max-w-4xl mx-auto mt-6 space-y-6 text-zinc-900 dark:text-zinc-100">
      {/* Page Header */}
      <div className="flex items-center gap-2">
        <ListTodo className="w-5 h-5 text-blue-500" />

        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Tasks
        </h1>
      </div>

      {/* Phases */}
      <div className="space-y-8">
        {phases.map((phase, pIndex) => {
          const tasks = phase.tasks || [];

          const completedCount = tasks.filter(
            (task) => task.status === "completed"
          ).length;

          const phasePct =
            tasks.length > 0
              ? Math.round(
                  (completedCount / tasks.length) * 100
                )
              : 0;

          return (
            <section
              key={
                phase._id ||
                `phase-${pIndex}`
              }
              className="space-y-3"
            >
              {/* Phase Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 shrink-0">
                    {phase.phaseNumber ||
                      pIndex + 1}
                  </span>

                  <h2 className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                    {phase.title}
                  </h2>

                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                    {phasePct}%
                  </span>
                </div>

                <button
                  onClick={() =>
                    setActivePhaseForModal(phase)
                  }
                  className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-blue-500 transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>

              {/* Tasks */}
              {tasks.length === 0 ? (
                <div className="ml-7 py-2 text-[11px] text-zinc-400">
                  No tasks in this phase yet.
                </div>
              ) : (
                <div className="relative ml-2">
                  {tasks.map((task, tIndex) => {
                    const isCompleted =
                      task.status === "completed";

                    const isInProgress =
                      task.status === "in_progress";

                    const isBlocked =
                      task.status === "blocked";

                    const priority =
                      task.priority || "high";

                    const complexity =
                      phase.difficulty || "easy";

                    const hours =
                      task.estimatedHours || 4;

                    const isLast =
                      tIndex === tasks.length - 1;

                    const statusLabel =
                      isCompleted
                        ? "Completed"
                        : isBlocked
                        ? "Blocked"
                        : isInProgress
                        ? "In Progress"
                        : "Not Started";

                    const priorityLabel =
                      priority.charAt(0).toUpperCase() +
                      priority.slice(1);

                    const difficultyLabel =
                      complexity
                        .charAt(0)
                        .toUpperCase() +
                      complexity.slice(1);

                    return (
                      <motion.div
                        key={
                          task._id ||
                          `task-${pIndex}-${tIndex}`
                        }
                        initial={{
                          opacity: 0,
                          y: 5,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className="relative flex gap-3"
                      >
                        {/* Timeline Line */}
                        {!isLast && (
                          <div className="absolute left-[9px] top-5 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800" />
                        )}

                        {/* Status Icon */}
                        <button
                          onClick={() =>
                            toggleTaskStatus(
                              pIndex,
                              tIndex
                            )
                          }
                          className="relative z-10 flex items-center justify-center w-5 h-5 shrink-0 mt-0.5 rounded-full bg-white dark:bg-zinc-950"
                          title="Change status"
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                          ) : isBlocked ? (
                            <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400" />
                          ) : isInProgress ? (
                            <Clock className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-zinc-300 dark:text-zinc-600 hover:text-blue-500 transition-colors" />
                          )}
                        </button>

                        {/* Task Content */}
                        <div
                          className={`
                            group flex-1 min-w-0
                            ${
                              isLast
                                ? "pb-1"
                                : "pb-6"
                            }
                          `}
                        >
                          {/* Task Metadata */}
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                              Task {tIndex + 1}
                            </span>

                            <span className="text-zinc-300 dark:text-zinc-700">
                              ·
                            </span>

                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                              {hours}h
                            </span>
                          </div>

                          {/* Title + Delete */}
                          <div className="flex items-start gap-2">
                            <h3
                              className={`
                                flex-1 text-sm font-medium leading-snug
                                ${
                                  isCompleted
                                    ? "line-through text-zinc-400 dark:text-zinc-500"
                                    : "text-zinc-900 dark:text-white"
                                }
                              `}
                            >
                              {task.title}
                            </h3>

                            <button
                              onClick={(e) =>
                                handleDeleteTask(
                                  phase.phaseNumber,
                                  task._id ||
                                    task.title,
                                  e
                                )
                              }
                              className="
                                opacity-0
                                group-hover:opacity-100
                                p-1 -mt-1
                                text-zinc-400
                                hover:text-rose-500
                                rounded
                                hover:bg-rose-500/10
                                transition-all
                                shrink-0
                              "
                              title="Delete task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Description */}
                          {task.description && (
                            <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-2xl">
                              {task.description}
                            </p>
                          )}

                          {/* Attributes + Hover Tooltips */}
                          <div className="flex items-center gap-1.5 flex-wrap mt-2">

                            {/* Status */}
                            <div className="group/badge relative inline-flex">
                              <span
                                className={`
                                  px-1.5 py-0.5
                                  text-[10px]
                                  font-medium
                                  rounded
                                  cursor-default
                                  ${
                                    isCompleted
                                      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                                      : isBlocked
                                      ? "text-rose-600 dark:text-rose-400 bg-rose-500/10"
                                      : isInProgress
                                      ? "text-amber-600 dark:text-amber-400 bg-amber-500/10"
                                      : "text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800"
                                  }
                                `}
                              >
                                {statusLabel}
                              </span>

                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 text-[10px] font-medium text-white bg-zinc-900 dark:bg-zinc-800 rounded-md shadow-lg opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 border border-zinc-700/60">
                                Status: {statusLabel}
                              </div>
                            </div>

                            {/* Priority */}
                            <div className="group/badge relative inline-flex">
                              <span
                                className={`
                                  px-1.5 py-0.5
                                  text-[10px]
                                  font-medium
                                  rounded
                                  cursor-default
                                  ${
                                    priority === "high"
                                      ? "text-blue-600 dark:text-blue-400 bg-blue-500/10"
                                      : priority ===
                                        "medium"
                                      ? "text-amber-600 dark:text-amber-400 bg-amber-500/10"
                                      : "text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800"
                                  }
                                `}
                              >
                                {priorityLabel}
                              </span>

                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 text-[10px] font-medium text-white bg-zinc-900 dark:bg-zinc-800 rounded-md shadow-lg opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 border border-zinc-700/60">
                                Priority: {priorityLabel}
                              </div>
                            </div>

                            {/* Difficulty */}
                            <div className="group/badge relative inline-flex">
                              <span
                                className={`
                                  px-1.5 py-0.5
                                  text-[10px]
                                  font-medium
                                  rounded
                                  cursor-default
                                  ${
                                    complexity ===
                                    "easy"
                                      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                                      : complexity ===
                                        "medium"
                                      ? "text-amber-600 dark:text-amber-400 bg-amber-500/10"
                                      : "text-rose-600 dark:text-rose-400 bg-rose-500/10"
                                  }
                                `}
                              >
                                {difficultyLabel}
                              </span>

                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 text-[10px] font-medium text-white bg-zinc-900 dark:bg-zinc-800 rounded-md shadow-lg opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 border border-zinc-700/60">
                                Difficulty:{" "}
                                {difficultyLabel}
                              </div>
                            </div>

                            {/* Hours */}
                            <div className="group/badge relative inline-flex">
                              <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 cursor-default">
                                {hours}h
                              </span>

                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 text-[10px] font-medium text-white bg-zinc-900 dark:bg-zinc-800 rounded-md shadow-lg opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 border border-zinc-700/60">
                                Estimated Time:{" "}
                                {hours} hours
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {activePhaseForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.97,
              }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl max-w-md w-full p-4 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Add Task
                  </h3>

                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                    Phase{" "}
                    {activePhaseForModal.phaseNumber}
                    {" · "}
                    {activePhaseForModal.title}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setActivePhaseForModal(null)
                  }
                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleAddTaskSubmit}
                className="space-y-3 pt-3"
              >
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                    Task Title *
                  </label>

                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) =>
                      setNewTitle(e.target.value)
                    }
                    placeholder="e.g. Initialize Express and Prisma schema"
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-xs text-zinc-900 dark:text-white outline-none focus:border-blue-500"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                    Description
                  </label>

                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) =>
                      setNewDescription(e.target.value)
                    }
                    placeholder="What needs to be implemented?"
                    className="w-full resize-none rounded-lg border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-xs text-zinc-900 dark:text-white outline-none focus:border-blue-500"
                  />
                </div>

                {/* Hours / Priority / Status */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Hours */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                      Hours
                    </label>

                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={newHours}
                      onChange={(e) =>
                        setNewHours(
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-xs text-zinc-900 dark:text-white outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Priority */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                      Priority
                    </label>

                    <select
                      value={newPriority}
                      onChange={(e) =>
                        setNewPriority(
                          e.target.value as
                            | "low"
                            | "medium"
                            | "high"
                        )
                      }
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-xs text-zinc-900 dark:text-white outline-none focus:border-blue-500"
                    >
                      <option value="high">
                        High
                      </option>
                      <option value="medium">
                        Medium
                      </option>
                      <option value="low">
                        Low
                      </option>
                    </select>
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                      Status
                    </label>

                    <select
                      value={newStatus}
                      onChange={(e) =>
                        setNewStatus(
                          e.target.value as
                            | "not_started"
                            | "in_progress"
                            | "completed"
                            | "blocked"
                        )
                      }
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-xs text-zinc-900 dark:text-white outline-none focus:border-blue-500"
                    >
                      <option value="not_started">
                        Not Started
                      </option>
                      <option value="in_progress">
                        In Progress
                      </option>
                      <option value="completed">
                        Completed
                      </option>
                      <option value="blocked">
                        Blocked
                      </option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() =>
                      setActivePhaseForModal(null)
                    }
                    className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submittingTask}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50"
                  >
                    {submittingTask
                      ? "Adding..."
                      : "Add Task"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}