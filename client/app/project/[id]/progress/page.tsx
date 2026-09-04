"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Activity, Target, Flag, CheckSquare } from "lucide-react";
import ProgressBar from "@/components/Projects/ProgressBar";

export default function ProjectProgressPage() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId || "";

  const { user } = useUser();
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    if (!id || !user?.projects) return;
    const found = user.projects.find((p: any) => p._id === id || p.id === id);
    if (found) setProject(found);
  }, [id, user]);

  const progress = project?.progress ?? 75;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-rose-500">
          <Activity className="w-5 h-5" />
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Progress Tracking
          </h1>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Monitor overall progress metrics and milestone completion.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 space-y-4">
        <div className="flex justify-between items-center text-sm font-semibold">
          <span className="text-zinc-900 dark:text-white">Completion Rate</span>
          <span className="text-blue-500 font-bold">{progress}%</span>
        </div>
        <ProgressBar progress={progress} />
      </div>
    </div>
  );
}
