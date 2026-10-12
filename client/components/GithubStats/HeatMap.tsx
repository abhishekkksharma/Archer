"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { GitCommit, Calendar, RefreshCw } from "lucide-react";
import { getToken } from "@/utils/cookie";

export interface CommitValue {
  date: string;
  count: number;
}

export interface HeatMapProps {
  projectId?: string;
  githubLink?: string;
  values?: CommitValue[];
  totalCommits?: number;
  commits?: {
    date?: string;
    message?: string;
    committer?: any;
  }[];
  className?: string;
}

export function HeatMap({
  projectId: propProjectId,
  githubLink,
  values: propValues,
  totalCommits: propTotalCommits,
  commits: propCommits,
  className = "",
}: HeatMapProps) {
  const params = useParams();

  const routeProjectId = params?.id
    ? Array.isArray(params.id)
      ? params.id[0]
      : params.id
    : undefined;

  const effectiveProjectId = propProjectId || routeProjectId;

  const [heatmapValues, setHeatmapValues] = useState<CommitValue[]>(
    propValues || []
  );

  const [totalCommitsCount, setTotalCommitsCount] = useState<number>(
    propTotalCommits || 0
  );

  const [loading, setLoading] = useState<boolean>(!propValues?.length);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------------------------------------
  // Date range
  // ---------------------------------------------------------

  const { startDateStr, endDateStr } = useMemo(() => {
    const end = new Date();
    const start = new Date();

    start.setFullYear(end.getFullYear() - 1);

    const toYMD = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    return {
      startDateStr: toYMD(start),
      endDateStr: toYMD(end),
    };
  }, []);

  // ---------------------------------------------------------
  // Fetch GitHub stats
  // ---------------------------------------------------------

  const fetchStats = async () => {
    if (propValues && propValues.length > 0) {
      setHeatmapValues(propValues);

      setTotalCommitsCount(
        propTotalCommits ||
        propValues.reduce(
          (acc, curr) => acc + curr.count,
          0
        )
      );

      setLoading(false);
      return;
    }

    if (propCommits && propCommits.length > 0) {
      const counts: Record<string, number> = {};

      propCommits.forEach((c) => {
        const rawDate = c.date;

        if (rawDate) {
          const d = rawDate.split("T")[0];
          counts[d] = (counts[d] || 0) + 1;
        }
      });

      const computed = Object.entries(counts).map(
        ([date, count]) => ({
          date,
          count,
        })
      );

      setHeatmapValues(computed);

      setTotalCommitsCount(
        propTotalCommits || propCommits.length
      );

      setLoading(false);
      return;
    }

    if (!effectiveProjectId && !githubLink) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = getToken();

      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "http://localhost:5000/api";

      const url = effectiveProjectId
        ? `${backendUrl}/project/${effectiveProjectId}/githubstats`
        : `${backendUrl}/project/githubstats?githubLink=${encodeURIComponent(
          githubLink || ""
        )}`;

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

      const data = await res.json();

      if (res.ok && data.success && data.data) {
        const activity = data.data.activity;

        let values: CommitValue[] = [];

        if (
          Array.isArray(activity?.daily_commits) &&
          activity.daily_commits.length > 0
        ) {
          values = activity.daily_commits;
        } else if (
          Array.isArray(activity?.commits) &&
          activity.commits.length > 0
        ) {
          const counts: Record<string, number> = {};

          activity.commits.forEach((c: any) => {
            const rawDate =
              c.date ||
              c.commit?.author?.date ||
              c.commit?.committer?.date;

            if (rawDate) {
              const d = rawDate.split("T")[0];

              counts[d] =
                (counts[d] || 0) + 1;
            }
          });

          values = Object.entries(counts).map(
            ([date, count]) => ({
              date,
              count,
            })
          );
        }

        setHeatmapValues(values);

        setTotalCommitsCount(
          activity?.total_commits ||
          values.reduce(
            (acc, curr) => acc + curr.count,
            0
          )
        );
      } else {
        setError(
          data.message ||
          "Failed to load GitHub commit stats"
        );
      }
    } catch (err: any) {
      setError(
        err?.message ||
        "Error fetching GitHub stats"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [
    effectiveProjectId,
    githubLink,
    propValues,
    propCommits,
  ]);

  // ---------------------------------------------------------
  // Statistics
  // ---------------------------------------------------------

  const statsSummary = useMemo(() => {
    let yearCommits = 0;
    let activeDays = 0;
    let maxDayCommits = 0;

    heatmapValues.forEach((v) => {
      if (
        v.date >= startDateStr &&
        v.date <= endDateStr
      ) {
        yearCommits += v.count;

        if (v.count > 0) {
          activeDays += 1;
        }

        if (v.count > maxDayCommits) {
          maxDayCommits = v.count;
        }
      }
    });

    return {
      yearCommits,
      activeDays,
      maxDayCommits,
      totalCount:
        totalCommitsCount || yearCommits,
    };
  }, [
    heatmapValues,
    startDateStr,
    endDateStr,
    totalCommitsCount,
  ]);

  // ---------------------------------------------------------
  // Loading
  // ---------------------------------------------------------

  if (loading) {
    return (
      <div
        className={`w-full bg-transparent p-0 space-y-3 animate-pulse ${className}`}
      >
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div className="space-y-1.5">
            <div className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-3 w-56 bg-zinc-100 dark:bg-zinc-800/60 rounded" />
          </div>

          <div className="h-3.5 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>

        <div className="h-28 w-full bg-zinc-100/60 dark:bg-zinc-800/30 rounded-lg" />
      </div>
    );
  }

  // ---------------------------------------------------------
  // Error
  // ---------------------------------------------------------

  if (error && heatmapValues.length === 0) {
    return (
      <div
        className={`w-full bg-transparent py-4 text-center space-y-2.5 ${className}`}
      >
        <div className="flex items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400">
          <GitCommit className="w-4 h-4 text-zinc-400" />

          <p className="text-xs font-medium">
            Commit Stats Unavailable
          </p>
        </div>

        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 max-w-md mx-auto">
          {error}
        </p>

        <button
          onClick={fetchStats}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          Retry
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------
  // Main
  // ---------------------------------------------------------

  return (
    <div
      className={`
                w-full
                bg-transparent
                py-3

                [&_.color-empty]:!fill-zinc-100
                dark:[&_.color-empty]:!fill-zinc-800

                /* Same density colors in BOTH themes */
                [&_.color-scale-1]:!fill-[#90caf9]
                [&_.color-scale-2]:!fill-[#42a5f5]
                [&_.color-scale-3]:!fill-[#1e88e5]
                [&_.color-scale-4]:!fill-[#0d47a1]

                /* Calendar text */
                [&_text]:!fill-zinc-400
                dark:[&_text]:!fill-zinc-500
                [&_text]:text-[9px]

                /* Smaller rounded tiles */
                [&_rect]:[rx:2]
                [&_rect]:[ry:2]
                [&_rect]:transition-all
                [&_rect]:duration-150
                hover:[&_rect]:opacity-75

                ${className}
            `}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 px-10">
        <div>
          <div className="flex items-center gap-2 ">
            <GitCommit className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />

            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              Commit Activity
            </h3>

            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {statsSummary.yearCommits.toLocaleString()} in past year
            </span>
          </div>

          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />

            <span>
              {new Date(
                startDateStr
              ).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              )}{" "}
              –{" "}
              {new Date(
                endDateStr
              ).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              )}
            </span>
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto text-[11px] text-zinc-400 dark:text-zinc-500">
          <span>Less</span>

          <div className="flex gap-1 items-center">
            <div className="w-2.5 h-2.5 rounded-[2px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60" />

            <div className="w-2.5 h-2.5 rounded-[2px] bg-[#90caf9]" />

            <div className="w-2.5 h-2.5 rounded-[2px] bg-[#42a5f5]" />

            <div className="w-2.5 h-2.5 rounded-[2px] bg-[#1e88e5]" />

            <div className="w-2.5 h-2.5 rounded-[2px] bg-[#0d47a1]" />
          </div>

          <span>More</span>
        </div>
      </div>

      {/* -------------------------------------------------
                Compact Heatmap
            ------------------------------------------------- */}
      <div className="w-full overflow-x-auto">
        <div className="flex justify-center">
          <div
            className="
                            w-[82%]
                            min-w-[760px]
                            max-w-[1100px]
                        "
          >
            <CalendarHeatmap
              startDate={startDateStr}
              endDate={endDateStr}
              values={heatmapValues}
              classForValue={(value) => {
                if (!value || !value.count || value.count === 0) {
                  return "color-empty";
                }

                if (value.count <= 2) {
                  return "color-scale-1";
                }

                if (value.count <= 5) {
                  return "color-scale-2";
                }

                if (value.count <= 9) {
                  return "color-scale-3";
                }

                return "color-scale-4";
              }}
              titleForValue={(value) => {
                if (!value || !value.date) {
                  return "No commits";
                }

                try {
                  const [year, month, day] = value.date
                    .split("-")
                    .map(Number);

                  const dateObj = new Date(
                    year,
                    month - 1,
                    day
                  );

                  const formatted = dateObj.toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  );

                  const count = value.count || 0;

                  return `${count} commit${count === 1 ? "" : "s"
                    } on ${formatted}`;
                } catch {
                  return `${value.count || 0} commits on ${value.date
                    }`;
                }
              }}
              showWeekdayLabels
              gutterSize={1}
            />
          </div>
        </div>
      </div>

      {/* -------------------------------------------------
                Summary
            ------------------------------------------------- */}
      <div className="mt-0 border-t border-zinc-200/60 px-10 dark:border-zinc-800/60 pt-1.5 flex flex-wrap items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span>
            Active Days:{" "}
            <strong className="text-zinc-800 dark:text-zinc-200">
              {statsSummary.activeDays}
            </strong>
          </span>

          <span>
            Busiest Day:{" "}
            <strong className="text-zinc-800 dark:text-zinc-200">
              {statsSummary.maxDayCommits} commits
            </strong>
          </span>

          <span>
            Total Commits:{" "}
            <strong className="text-zinc-800 dark:text-zinc-200">
              {statsSummary.totalCount.toLocaleString()}
            </strong>
          </span>
        </div>

        <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
          Live GitHub Commit Feed
        </p>
      </div>
    </div>
  );
}

export default HeatMap;