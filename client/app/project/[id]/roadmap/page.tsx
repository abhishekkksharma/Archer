"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Map,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  TrendingUp,
  ListTodo,
  Layers,
} from "lucide-react";
import { motion } from "framer-motion";
import { PhaseCard, IPhase } from "@/components/Roadmap/PhaseCard";
import { RoadmapSkeleton } from "@/components/Roadmap/RoadmapSkeleton";

interface IRoadmapData {
  _id: string;
  projectId: string;
  phases: IPhase[];
  statistics: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    notStartedTasks: number;
    blockedTasks: number;
    progress: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export default function ProjectRoadmapPage() {
  const params = useParams();
  const rawId = params?.id;
  const projectId = Array.isArray(rawId) ? rawId[0] : rawId || "";

  const [roadmap, setRoadmap] = useState<IRoadmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to fetch or trigger roadmap generation
  const fetchRoadmap = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);

    try {
      const token =
        getCookie("token") || getCookie("auth_token") || getCookie("jwt");
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

      const res = await fetch(`${backendUrl}/roadmaps/${projectId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const json = await res.json();

      if (res.ok && json.success && json.data) {
        setRoadmap(json.data);
      } else {
        setError(json.message || "Failed to load roadmap.");
      }
    } catch (err: any) {
      console.error("Roadmap fetch error:", err);
      setError("Network error connecting to backend API.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  // Handle explicit AI regeneration request
  const handleRegenerate = async () => {
    if (!projectId || generating) return;

    setGenerating(true);
    setError(null);

    try {
      const token =
        getCookie("token") || getCookie("auth_token") || getCookie("jwt");
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

      const res = await fetch(
        `${backendUrl}/roadmaps/project/${projectId}/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ projectId }),
        },
      );

      const json = await res.json();

      if (res.ok && json.success && json.data) {
        setRoadmap(json.data);
      } else {
        setError(json.message || "Failed to regenerate roadmap with AI.");
      }
    } catch (err: any) {
      console.error("Regenerate error:", err);
      setError("Failed to connect to backend AI service.");
    } finally {
      setGenerating(false);
    }
  };

  // Handle task status toggle
  const handleToggleTaskStatus = async (
    phaseIndex: number,
    taskIndex: number,
  ) => {
    if (!roadmap) return;

    const updatedPhases = [...roadmap.phases];
    const targetTask = updatedPhases[phaseIndex].tasks[taskIndex];

    const nextStatus =
      targetTask.status === "completed"
        ? "not_started"
        : targetTask.status === "not_started"
          ? "in_progress"
          : "completed";

    targetTask.status = nextStatus;

    // Recalculate local statistics instantly
    const allTasks = updatedPhases.flatMap((p) => p.tasks || []);
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(
      (t) => t.status === "completed",
    ).length;
    const inProgressTasks = allTasks.filter(
      (t) => t.status === "in_progress",
    ).length;
    const blockedTasks = allTasks.filter((t) => t.status === "blocked").length;
    const notStartedTasks =
      totalTasks - completedTasks - inProgressTasks - blockedTasks;
    const progress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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

    // Sync with backend API asynchronously
    try {
      const token =
        getCookie("token") || getCookie("auth_token") || getCookie("jwt");
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

      await fetch(`${backendUrl}/roadmaps/${roadmap._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ phases: updatedPhases }),
      });
    } catch (err) {
      console.error("Failed to sync task status update:", err);
    }
  };

  if (loading || generating) {
    return (
      <div className="space-y-4">
        {generating && (
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-xl max-w-5xl mx-auto flex items-center justify-between text-xs sm:text-sm animate-pulse">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500 animate-spin" />
              <span>AI is generating project roadmap... Please wait.</span>
            </div>
          </div>
        )}
        <RoadmapSkeleton />
      </div>
    );
  }

  if (error && !roadmap) {
    return (
      <div className="p-6 sm:p-8 max-w-2xl mx-auto text-center space-y-4 mt-12">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/20">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          Roadmap Error
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{error}</p>
        <button
          onClick={handleRegenerate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm transition-colors shadow-md shadow-blue-500/20"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate with AI</span>
        </button>
      </div>
    );
  }

  const phases = roadmap?.phases || [];
  const stats = roadmap?.statistics || {
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    notStartedTasks: 0,
    blockedTasks: 0,
    progress: 0,
  };

  // Calculate timeline graph progress down
  const completedPhasesCount = phases.filter((phase) => {
    const pTasks = phase.tasks || [];
    return pTasks.length > 0 && pTasks.every((t) => t.status === "completed");
  }).length;

  // Percentage of line completed
  const lineProgressPct =
    phases.length > 1
      ? Math.min(
          100,
          Math.max(0, (completedPhasesCount / (phases.length - 1)) * 100),
        )
      : completedPhasesCount > 0
        ? 100
        : 0;

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6 text-zinc-900 dark:text-zinc-100">
      {/* ==========================================
          HEADER SECTION (Minimalist Layout)
      ========================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Map className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Project Roadmap
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
            Structured development phases, milestones, and step-by-step task
            breakdown.
          </p>
        </div>

        {/* <button
          onClick={handleRegenerate}
          disabled={generating}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white text-xs sm:text-sm font-medium transition-all shadow-sm shrink-0 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          <span>Regenerate with AI</span>
        </button> */}
      </div>

      {/* ==========================================
          MINIMAL OVERVIEW STATS CARDS
      ========================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Phases */}
        <div className="px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span>Phases</span>
          </div>
          <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-white">
            {phases.length}
          </p>
        </div>

        {/* Total Tasks */}
        <div className="px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            <ListTodo className="w-3.5 h-3.5 text-blue-500" />
            <span>Total Tasks</span>
          </div>
          <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-white">
            {stats.totalTasks}
          </p>
        </div>

        {/* Completed */}
        <div className="px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
            <span>Completed</span>
          </div>
          <p className="mt-1 text-lg font-semibold text-blue-600 dark:text-blue-400">
            {stats.completedTasks}
          </p>
        </div>

        {/* Progress */}
        <div className="px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            <span>Progress</span>
          </div>
          <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-white">
            {stats.progress}%
          </p>
        </div>
      </div>

      {/* ==========================================
          VERTICAL TIMELINE GRAPH (BLUE THEME)
          Features progressive line fill as phases are completed
      ========================================== */}
      <div className="relative pl-6 sm:pl-9 space-y-8 ml-3 sm:ml-4">
        {/* Background Muted Timeline Line */}
        <div className="absolute left-1 sm:left-0.75 top-6 bottom-6 w-0.5 bg-zinc-200 dark:bg-zinc-800 rounded-full" />

        {/* Dynamic Progressive Active Blue Line Fill */}
        <div
          className="absolute left-0.75 sm:left-0.75 top-6 w-0.5 bg-blue-500 dark:bg-blue-400 transition-all duration-700 ease-out rounded-full shadow-sm shadow-blue-500/30"
          style={{ height: `calc(${lineProgressPct}% * (100% - 48px) / 100)` }}
        />

        {phases.map((phase, pIndex) => {
          const phaseKey = phase._id || `phase-${pIndex}`;
          const tasks = phase.tasks || [];
          const phaseCompletedCount = tasks.filter(
            (t) => t.status === "completed",
          ).length;

          const isPhaseCompleted =
            phaseCompletedCount === tasks.length && tasks.length > 0;

          const isPhaseInProgress =
            !isPhaseCompleted &&
            tasks.some(
              (t) => t.status === "in_progress" || t.status === "completed",
            );

          return (
            <motion.div
              key={phaseKey}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: pIndex * 0.08 }}
              className="relative"
            >
              {/* Timeline Circular Node Icon Marker (Minimal Blue Theme) */}
              <div
                className={`
                  absolute -left-[32px] sm:-left-[48px] top-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-sm z-10 transition-all duration-300
                  ${
                    isPhaseCompleted
                      ? "bg-blue-500 text-white ring-4 ring-blue-500/20"
                      : isPhaseInProgress
                        ? "bg-white dark:bg-zinc-950 border-2 border-blue-500 text-blue-500 ring-4 ring-blue-500/10 animate-pulse"
                        : "bg-white dark:bg-zinc-950 border-2 border-zinc-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600"
                  }
                `}
              >
                {isPhaseCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                ) : isPhaseInProgress ? (
                  <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 shrink-0" />
                )}
              </div>

              {/* Render Modular PhaseCard Component */}
              <PhaseCard
                phase={phase}
                phaseIndex={pIndex}
                onToggleTaskStatus={handleToggleTaskStatus}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
