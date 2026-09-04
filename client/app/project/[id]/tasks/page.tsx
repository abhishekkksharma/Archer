"use client";

import React, { useState } from "react";
import { CheckSquare, Plus, Trash2, CheckCircle2, Circle } from "lucide-react";

export default function ProjectTasksPage() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Set up project layout and navigation sidebar", completed: true },
    { id: 2, text: "Verify dark mode theme persistence on page refresh", completed: true },
    { id: 3, text: "Connect frontend project details with backend API", completed: false },
    { id: 4, text: "Implement custom tech stack configuration", completed: false },
  ]);
  const [newTask, setNewTask] = useState("");

  const toggleTask = (taskId: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), text: newTask.trim(), completed: false },
    ]);
    setNewTask("");
  };

  const deleteTask = (taskId: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-emerald-500">
          <CheckSquare className="w-5 h-5" />
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Project Tasks
          </h1>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Manage checklist items and track progress.
        </p>
      </div>

      {/* Add Task Input */}
      <form onSubmit={handleAddTask} className="flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task item..."
          className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-xs text-zinc-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </form>

      {/* Tasks List */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm"
          >
            <div
              onClick={() => toggleTask(task.id)}
              className="flex items-center gap-3 cursor-pointer flex-1"
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-zinc-400 shrink-0" />
              )}
              <span
                className={`text-xs font-medium ${
                  task.completed
                    ? "line-through text-zinc-400 dark:text-zinc-500"
                    : "text-zinc-800 dark:text-zinc-200"
                }`}
              >
                {task.text}
              </span>
            </div>

            <button
              onClick={() => deleteTask(task.id)}
              className="p-1.5 text-zinc-400 hover:text-rose-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
