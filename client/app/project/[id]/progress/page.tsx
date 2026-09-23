"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Activity } from "lucide-react";
import BarChart, { DailyProgressData } from "@/components/Progress/BarChart";
import ProgressBar from "@/components/Projects/ProgressBar";

export default function ProjectProgressPage() {
  const params = useParams();

  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId || "";

  const { user } = useUser();

  const [project, setProject] = useState<any>(null);
  const [dailyProgress, setDailyProgress] = useState<DailyProgressData[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  useEffect(() => {
    if (!id || !user?.projects) return;

    const found = user.projects.find((p: any) => p._id === id || p.id === id);

    if (found) {
      setProject(found);
    }
  }, [id, user]);

  useEffect(() => {
    if (!id) return;

    const getCookie = (name: string): string | null => {
      if (typeof window === "undefined") return null;

      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);

      return parts.length === 2
        ? parts.pop()?.split(";").shift() || null
        : null;
    };

    const fetchProgress = async () => {
      setIsLoadingProgress(true);

      try {
        const token =
          getCookie("token") || getCookie("auth_token") || getCookie("jwt");

        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

        const url = `${backendUrl.replace(/\/$/, "")}/progress/${id}`;

        console.log("Progress API:", url);

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        });

        const json = await res.json();

        console.log("Progress API response:", json);

        if (!res.ok) {
          throw new Error(
            json?.message || `Request failed with status ${res.status}`,
          );
        }

        if (json.success && json.data) {
          setDailyProgress(json.data.dailyProgress ?? []);
          setSummary(json.data.summary ?? null);

          if (json.data.project) {
            setProject((prev: any) => ({
              ...prev,
              ...json.data.project,
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch progress metrics:", error);
        setDailyProgress([]);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    fetchProgress();
  }, [id]);

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
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-fit rounded border border-zinc-200 bg-zinc-50 px-2 py-1 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Total tasks:{" "}
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {summary?.totalTasksCount ?? 0}
            </span>
          </p>
        </div>

        <div className="w-fit rounded border border-zinc-200 bg-zinc-50 px-2 py-1 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Completed:{" "}
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {summary?.completedTasksCount ?? 0}
            </span>
          </p>
        </div>

        <div className="w-fit rounded border border-zinc-200 bg-zinc-50 px-2 py-1 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Work time:{" "}
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {summary?.totalTimeTakenHours ?? 0}h
            </span>
          </p>
        </div>
      </div>

      <BarChart data={dailyProgress} isLoading={isLoadingProgress} />
      {/* Labels */}
      <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs text-zinc-500 dark:text-zinc-300">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 shrink-0 rounded border border-zinc-300/70 bg-zinc-200" />
          <p className="">Estimated time for task to be on that day</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-5 w-5 shrink-0 rounded bg-blue-500" />
          <p className=" ">Actual time taken to complete that task</p>
        </div>
      </div>
    </div>
  );
}
