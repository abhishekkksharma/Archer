"use client";

import React from "react";

export const RoadmapSkeleton: React.FC = () => {
  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
          <div className="h-4 w-72 bg-zinc-200/70 dark:bg-zinc-800/50 rounded-md" />
        </div>
      </div>

      {/* Overview Stats Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 space-y-2"
          >
            <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-6 w-12 bg-zinc-300 dark:bg-zinc-700 rounded" />
          </div>
        ))}
      </div>

      {/* Timeline Skeletons */}
      <div className="relative pl-6 sm:pl-9 space-y-8 border-l-2 border-zinc-200 dark:border-zinc-800 ml-3 sm:ml-4">
        {[1, 2, 3].map((idx) => (
          <div key={idx} className="relative">
            {/* Timeline Node Marker Skeleton */}
            <div className="absolute -left-7.75 sm:-left-11.75 w-6 h-6 rounded-full border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            </div>

            {/* Skeleton Card */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#121215] p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-5 w-20 bg-zinc-200/70 dark:bg-zinc-800/60 rounded-full" />
                </div>
                <div className="h-5 w-14 bg-zinc-200/70 dark:bg-zinc-800/60 rounded-full" />
              </div>

              <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-full bg-zinc-200/60 dark:bg-zinc-800/50 rounded" />

              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-3 w-8 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>
                <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full" />
              </div>

              <div className="space-y-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/40">
                {[1, 2, 3].map((t) => (
                  <div key={t} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                    <div className="h-4 w-2/3 bg-zinc-200/70 dark:bg-zinc-800/60 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
