"use client";

import React from "react";
import { BarChart3, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";

export default function ProjectAnalysisPage() {
  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-cyan-500">
          <BarChart3 className="w-5 h-5" />
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Project Analysis & Insights
          </h1>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Automated code quality, complexity and stack analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Code Health</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">94 / 100</p>
          <p className="text-xs text-emerald-500">Clean architecture & type safety</p>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span>Stack Efficiency</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">Optimal</p>
          <p className="text-xs text-blue-500">Modern Next.js + Express setup</p>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Risks Identified</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">0 Critical</p>
          <p className="text-xs text-zinc-400">All dependencies up to date</p>
        </div>
      </div>
    </div>
  );
}