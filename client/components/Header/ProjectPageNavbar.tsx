"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronDown, Check, Plus, Folder } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import { useUser } from "@/context/UserContext";

interface Props {
  userEmail?: string;
  userFirstName?: string;
  projectName?: string;
}

function ProjectPageNavbar({ userEmail, userFirstName, projectName }: Props) {
  const { user } = useUser();
  const params = useParams();
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const rawId = params?.id;
  const currentProjectId = Array.isArray(rawId) ? rawId[0] : rawId || "";

  const displayName =
    userFirstName ||
    (user?.name ? user.name.split(" ")[0] : userEmail ? userEmail.split("@")[0] : "User");

  const displayProjectName = projectName || "Project Overview";

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const projects = user?.projects || [];

  return (
    <header className="sticky top-0 z-40 w-full justify-between h-14 flex px-6 sm:px-9 items-center border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-black/95 backdrop-blur-md text-zinc-900 dark:text-zinc-100">
      {/* Left: Breadcrumbs & Project Selector */}
      <div className="flex items-center gap-2 font-medium text-sm min-w-0">
        <span className="font-normal text-zinc-500 dark:text-zinc-400 shrink-0">
          {displayName}
        </span>
        <span className="text-zinc-300 dark:text-zinc-700 shrink-0">/</span>

        {/* Project Selector Pill with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
            aria-label="Switch project"
            className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-md px-2.5 py-1 transition-colors text-xs font-semibold max-w-[200px] sm:max-w-[300px] truncate"
          >
            <span className="truncate">{displayProjectName}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0 transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 py-1.5 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Projects
              </div>

              <div className="max-h-56 overflow-y-auto space-y-0.5">
                {projects.length === 0 ? (
                  <div className="px-2 py-2 text-xs text-zinc-500 dark:text-zinc-400">
                    Current: <span className="font-medium text-zinc-800 dark:text-zinc-200">{displayProjectName}</span>
                  </div>
                ) : (
                  projects.map((proj: any) => {
                    const projId = proj._id || proj.id;
                    const isActive = projId === currentProjectId;

                    return (
                      <button
                        key={projId || proj.name}
                        onClick={() => {
                          setDropdownOpen(false);
                          if (projId) {
                            router.push(`/project/${projId}`);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg text-left transition-colors ${
                          isActive
                            ? "bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-white"
                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Folder className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span className="truncate">{proj.name}</span>
                        </div>
                        {isActive && (
                          <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />

              <Link
                href="/dashboard"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>All Projects / New</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Right: Theme Toggle */}
      <ThemeToggle scrolled={true} />
    </header>
  );
}

export default ProjectPageNavbar;
