"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Layers, Calendar, CheckCircle2, Clock, Info } from "lucide-react";

export default function ProjectOverviewSubPage() {
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

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Project Overview
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Detailed breakdown of requirements, goals and configuration.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
              {project?.name || "Project Details"}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {project?.type || "Web Application"}
            </p>
          </div>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed pt-2 border-t border-zinc-100 dark:border-zinc-800">
          {project?.description || "No detailed description available for this project."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Development Status</span>
          </div>
          <p className="text-base font-semibold text-zinc-900 dark:text-white">
            {project?.status || "Planning Phase"}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Target Experience</span>
          </div>
          <p className="text-base font-semibold text-zinc-900 dark:text-white">
            {project?.experienceLevel || "Beginner"}
          </p>
        </div>
      </div>
    </div>
  );
}
