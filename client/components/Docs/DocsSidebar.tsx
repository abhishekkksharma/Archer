
"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";

const docs = {
  getting_started: {
    path: "/data/getting_started.md",
    children: {
      introduction: "/data/getting_started/introduction.md",
      contributing: "/data/contibution.md",
    },
  },
  projects: {
    path: "/data/projects.md",
    children: {
      overview: "/data/projects/overview.md",
      project_structure: "/data/projects/project_structure.md",
      creating_projects: "/data/projects/creating_projects.md",
    },
  },
  architecture: {
    path: "/data/architecture.md",
    children: {
      overview: "/data/architecture/overview.md",
      frontend: "/data/architecture/frontend.md",
      backend: "/data/architecture/backend.md",
    },
  },
  roadmaps: {
    path: "/data/roadmaps.md",
    children: {
      current_roadmap: "/data/roadmaps/current_roadmap.md",
      upcoming_features: "/data/roadmaps/upcoming_features.md",
    },
  },
  github_stats: {
    path: "/data/github_stats.md",
    children: {
      contributors: "/data/github_stats/contributors.md",
      commits: "/data/github_stats/commits.md",
      pull_requests: "/data/github_stats/pull_requests.md",
    },
  },
};

function formatLabel(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) =>
    char.toUpperCase()
  );
}

type DocsSidebarProps = {
  onSelect?: (path: string) => void;
};

function DocsSidebar({ onSelect }: DocsSidebarProps) {
  // Expand every parent when the sidebar first loads.
  const [expanded, setExpanded] = useState<string[]>(
    Object.keys(docs)
  );

  const [selected, setSelected] = useState(
    "/data/getting_started.md"
  );

  const toggle = (key: string) => {
    setExpanded((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    );
  };

  const handleSelect = (path: string) => {
    setSelected(path);
    onSelect?.(path);
  };

  const itemClass = (path: string) =>
    `flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs transition ${selected === path
      ? "bg-blue-50 text-blue-600 dark:bg-zinc-800/50 dark:text-zinc-100"
      : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
    }`;

  return (
    <aside className=" w-52 shrink-0  p-3 ">

      <nav className="flex flex-col gap-1">
        {Object.entries(docs).map(([key, doc]) => {
          const isExpanded = expanded.includes(key);

          return (
            <div key={key}>
              <button
                type="button"
                onClick={() => toggle(key)}
                aria-expanded={isExpanded}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                <span>{formatLabel(key)}</span>

                {isExpanded ? (
                  <ChevronDown size={15} className="shrink-0" />
                ) : (
                  <ChevronRight size={15} className="shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="ml-3 mt-1 flex flex-col gap-1  pl-2 ">
                  {/* <button
                    type="button"
                    onClick={() => handleSelect(doc.path)}
                    className={itemClass(doc.path)}
                  >
                    <FileText size={14} className="shrink-0" />
                    <span>Overview</span>
                  </button> */}

                  {Object.entries(doc.children).map(
                    ([childKey, path]) => (
                      <button
                        key={childKey}
                        type="button"
                        onClick={() => handleSelect(path)}
                        className={itemClass(path)}
                      >
                        {/* <FileText size={14} className="shrink-0" /> */}
                        <span>{formatLabel(childKey)}</span>
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default DocsSidebar;
