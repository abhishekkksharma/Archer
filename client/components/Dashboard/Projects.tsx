"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useUser } from "@/context/UserContext";
import { Clock, Layers3, ChevronDown, Filter } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import AuthWarning from "../AuthWarning";

interface IProject {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  type: string;
  experienceLevel: string;
  status: string;
  progress: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

const STATUS_OPTIONS = [
  "All",
  "Planning",
  "In Progress",
  "Completed",
  "On Hold",
] as const;

function Projects() {
  const { user, loading } = useUser();
  const projects = user?.projects as IProject[] | undefined;
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getTimeAgo = (date: string | Date) => {
    if (!date) return "";
    const diff = Date.now() - new Date(date).getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;

    return `${Math.floor(days / 30)}mo ago`;
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "planning":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "in progress":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
      case "completed":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
      case "on hold":
        return "bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border-zinc-500/20";
      default:
        return "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700/50";
    }
  };

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { All: projects?.length || 0 };
    projects?.forEach((p) => {
      const statusKey = p.status || "Other";
      counts[statusKey] = (counts[statusKey] || 0) + 1;
    });
    return counts;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (activeFilter === "All") return projects;
    return projects.filter(
      (p) => p.status?.toLowerCase() === activeFilter.toLowerCase(),
    );
  }, [projects, activeFilter]);

  if (loading) {
    return (
      <p className="px-6 sm:px-8 md:px-[8%] lg:px-[10%] py-6 text-zinc-500 dark:text-zinc-400">
        Loading...
      </p>
    );
  }

  if (!user) {
    return "";
  }

  return (
    <div className="px-6 sm:px-8 md:px-[8%] lg:px-[10%] py-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-row items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white tracking-wide">
            Recent Projects
          </h2>
          {/* <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Filter and manage your ongoing work
          </p> */}
        </div>

        {/* Filter Dropdown */}
        <div className="relative flex gap-6 items-center" ref={dropdownRef}>
          <Link href={"/project/new"}>
            <button
              className="
                group
                flex
                items-center
                gap-2
                rounded-lg
                border
                border-zinc-200
                bg-white
                px-3
                py-1.5
                text-sm
                font-medium
                text-blue-500
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-blue-300
                hover:bg-blue-50
                hover:text-blue-600
                hover:shadow-md
                active:translate-y-0
                dark:border-zinc-700
                dark:bg-zinc-900
                dark:text-blue-400
                dark:hover:border-blue-500/50
                dark:hover:bg-blue-500/10
                dark:hover:text-blue-300
              "
            >
              <span
                className="
                  flex
                  h-5
                  w-5
                  items-center
                  justify-center
                  rounded-md
                  bg-blue-500/10
                  text-base
                  transition-transform
                  duration-200
                  group-hover:rotate-90
                "
              >
                +
              </span>
              New Project
            </button>
          </Link>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 text-slate-800 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700 transition-all cursor-pointer shadow-sm"
          >
            <Filter className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>{activeFilter}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
              {statusCounts[activeFilter] || 0}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 shadow-xl backdrop-blur-xl z-50 p-1">
              {STATUS_OPTIONS.map((status) => {
                const count = statusCounts[status] || 0;
                const isActive = activeFilter === status;
                return (
                  <button
                    key={status}
                    onClick={() => {
                      setActiveFilter(status);
                      setIsDropdownOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer
                      ${
                        isActive
                          ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white font-medium"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-zinc-200"
                      }
                    `}
                  >
                    <span>{status}</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Compact Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProjects.map((project, index) => {
          const projectKey =
            project._id || project.id || `${project.name}-${index}`;
          const projectId = project._id || project.id || "";
          return (
            <Link
              key={projectKey}
              href={`/project/${projectId}`}
              className="w-full rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-black hover:bg-slate-50 dark:hover:bg-zinc-950 hover:border-slate-300 dark:hover:border-zinc-700 transition-all p-4 flex flex-col justify-between min-h-[175px] shadow-sm hover:shadow-lg cursor-pointer group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.name}
                  </h3>

                  <span
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-full border shrink-0 ${getStatusBadgeStyle(
                      project.status,
                    )}`}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Bottom Content */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800">
                {/* Progress Bar */}
                <div className="mb-2.5">
                  <div className="flex justify-between items-center text-[11px] mb-1.5">
                    <span className="text-zinc-500 dark:text-zinc-500">
                      Progress
                    </span>

                    <span className="text-slate-800 dark:text-zinc-200 font-medium">
                      {project.progress}%
                    </span>
                  </div>

                  <div className="h-1 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(Math.max(project.progress, 0), 100)}%`,
                      }}
                      transition={{
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                        delay: index * 0.05,
                      }}
                      className="h-full rounded-full bg-blue-600 dark:bg-blue-500"
                    />
                  </div>
                </div>

                {/* Footer Details */}
                <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Layers3 className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" />

                    <span className="truncate max-w-[110px]">
                      {project.type || "Web App"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" />

                    <span>{getTimeAgo(project.createdAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="py-10 border border-dashed border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/20 rounded-xl text-center">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {activeFilter === "All"
              ? "No projects found."
              : `No projects with status "${activeFilter}".`}
          </p>
        </div>
      )}
    </div>
  );
}

export default Projects;
