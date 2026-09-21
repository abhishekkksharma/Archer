"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Calendar,
  Clock,
  CheckCircle2,
} from "lucide-react";

export interface DailyProgressData {
  date: string;
  hoursWorked: number;
  estimatedHours?: number;
  completedTasksCount?: number;
}

export interface BarChartProps {
  data?: DailyProgressData[];
  isLoading?: boolean;
  title?: string;
}

export type FilterOption = "week" | "month" | "all";

const generateMockData = (): DailyProgressData[] => {
  const result: DailyProgressData[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);

    const date = d.toISOString().split("T")[0];
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const hoursWorked = isWeekend
      ? Math.round(Math.random() * 2 * 10) / 10
      : Math.round((4 + Math.random() * 5) * 10) / 10;

    const estimatedHours = Math.max(
      Math.round(
        (hoursWorked + (Math.random() * 2.5 - 0.5)) * 10
      ) / 10,
      hoursWorked > 0 ? hoursWorked + 0.5 : 0
    );

    result.push({
      date,
      hoursWorked,
      estimatedHours,
      completedTasksCount:
        hoursWorked > 0
          ? Math.floor(Math.random() * 3) + 1
          : 0,
    });
  }

  return result;
};

export default function BarChart({
  data,
  isLoading = false,
  title = "Time Tracking & Effort",
}: BarChartProps) {
  const [filter, setFilter] = useState<FilterOption>("week");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const rawData = useMemo(() => {
    if (data && data.length > 0) {
      return data;
    }

    return generateMockData();
  }, [data]);

  const filteredData = useMemo(() => {
    const today = new Date();

    const targetDays =
      filter === "week"
        ? 7
        : filter === "month"
          ? 30
          : Math.max(rawData.length, 7);

    const dataMap = new Map<string, DailyProgressData>();

    rawData.forEach((item) => {
      dataMap.set(item.date, item);
    });

    const result: DailyProgressData[] = [];

    for (let i = targetDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);

      const date = [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0"),
      ].join("-");

      result.push(
        dataMap.get(date) ?? {
          date,
          hoursWorked: 0,
          estimatedHours: 0,
          completedTasksCount: 0,
        }
      );
    }

    return result;
  }, [rawData, filter]);

  const maxVal = useMemo(() => {
    const max = Math.max(
      ...filteredData.map((item) =>
        Math.max(
          item.hoursWorked,
          item.estimatedHours ?? 0
        )
      ),
      0
    );

    if (max === 0) {
      return 4;
    }

    return Math.max(Math.ceil(max * 1.25), 4);
  }, [filteredData]);

  const yTicks = useMemo(() => {
    const step = maxVal / 4;

    return [
      maxVal,
      Math.round(step * 3 * 10) / 10,
      Math.round(step * 2 * 10) / 10,
      Math.round(step * 10) / 10,
      0,
    ];
  }, [maxVal]);

  const filterLabels: Record<FilterOption, string> = {
    week: "7 days",
    month: "30 days",
    all: "All time",
  };

  const formatDateLabel = (dateStr: string) => {
    const [year, month, day] = dateStr
      .split("-")
      .map(Number);

    return new Date(
      year,
      month - 1,
      day
    ).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatFullDate = (dateStr: string) => {
    const [year, month, day] = dateStr
      .split("-")
      .map(Number);

    return new Date(
      year,
      month - 1,
      day
    ).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-950 rounded-xl p-5 transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            {title}
          </h3>

          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
            Actual vs estimated hours
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() =>
              setIsDropdownOpen((prev) => !prev)
            }
            className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />

            <span>{filterLabels[filter]}</span>

            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                isDropdownOpen
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() =>
                    setIsDropdownOpen(false)
                  }
                />

                <motion.div
                  initial={{
                    opacity: 0,
                    y: -4,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -4,
                  }}
                  className="absolute right-0 mt-2 w-28 z-20 bg-white dark:bg-zinc-900 rounded-lg shadow-lg py-1"
                >
                  {(
                    ["week", "month", "all"] as FilterOption[]
                  ).map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setFilter(option);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                        filter === option
                          ? "text-blue-500 bg-blue-500/5"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {filterLabels[option]}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-5 text-[11px] text-zinc-400 dark:text-zinc-500 mb-5">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-blue-500" />
          <span>Actual</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-zinc-300 dark:bg-zinc-800" />
          <span>Estimated</span>
        </div>
      </div>

      <div className="relative w-full h-64">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="relative w-full h-full">
            <div className="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none">
              {yTicks.map((value, index) => (
                <div
                  key={index}
                  className="relative w-full"
                >
                  <div className="w-full border-b border-zinc-100 dark:border-zinc-900/80" />

                  <span className="absolute right-0 -translate-y-1/2 text-[9px] text-zinc-400 dark:text-zinc-600 font-mono">
                    {value}h
                  </span>
                </div>
              ))}
            </div>

            <div className="absolute inset-0 pt-3 pb-8 pr-7 flex items-end justify-between gap-1">
              {filteredData.map((item, index) => {
                const actual = item.hoursWorked;

                const estimated = Math.max(
                  item.estimatedHours ?? actual,
                  actual
                );

                const estimatedHeight =
                  estimated > 0
                    ? (estimated / maxVal) * 100
                    : 0;

                const isHovered =
                  hoveredIndex === index;

                return (
                  <div
                    key={`${item.date}-${index}`}
                    className="relative flex-1 h-full flex items-end justify-center"
                    onMouseEnter={() =>
                      setHoveredIndex(index)
                    }
                    onMouseLeave={() =>
                      setHoveredIndex(null)
                    }
                  >
                    {estimated > 0 && (
                      <div
                        className="absolute bottom-0 w-full max-w-8 bg-zinc-100 dark:bg-zinc-900 rounded-t-md transition-all duration-200"
                        style={{
                          height: `${estimatedHeight}%`,
                        }}
                      >
                        {actual > 0 && (
                          <motion.div
                            initial={{
                              height: 0,
                            }}
                            animate={{
                              height: `${
                                (actual / estimated) * 100
                              }%`,
                            }}
                            transition={{
                              duration: 0.45,
                              delay: index * 0.03,
                              ease: "easeOut",
                            }}
                            className="absolute bottom-0 left-0 w-full bg-blue-500 dark:bg-blue-400 rounded-t-md"
                          />
                        )}
                      </div>
                    )}

                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: 5,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                            y: 3,
                          }}
                          className="absolute bottom-full mb-2 z-30 pointer-events-none"
                        >
                          <div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
                            <div className="font-medium mb-1">
                              {formatFullDate(
                                item.date
                              )}
                            </div>

                            <div className="flex justify-between gap-4">
                              <span className="text-blue-400 dark:text-blue-600">
                                Actual
                              </span>

                              <span>
                                {actual}h
                              </span>
                            </div>

                            <div className="flex justify-between gap-4">
                              <span className="text-zinc-400 dark:text-zinc-500">
                                Estimated
                              </span>

                              <span>
                                {estimated}h
                              </span>
                            </div>

                            {item.completedTasksCount !==
                              undefined && (
                              <div className="flex justify-between gap-4 mt-1">
                                <span className="flex items-center gap-1 text-emerald-400 dark:text-emerald-600">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Tasks
                                </span>

                                <span>
                                  {
                                    item.completedTasksCount
                                  }
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div
                      className={`absolute -bottom-6 text-[10px] whitespace-nowrap transition-colors ${
                        isHovered
                          ? "text-blue-500"
                          : "text-zinc-400 dark:text-zinc-600"
                      }`}
                    >
                      {formatDateLabel(item.date)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}