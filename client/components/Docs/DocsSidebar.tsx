"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { docs, getDocKeyFromPath, getDocPath } from "@/utils/docConfig";

function DocsSidebar() {
  const [activeParent, setActiveParent] = useState("getting_started");
  const [activeChild, setActiveChild] = useState<string | undefined>(undefined);
  const [expanded, setExpanded] = useState<string[]>(["getting_started"]);

  useEffect(() => {
    const syncSelection = () => {
      const hash = window.location.hash || "#getting_started";
      const path = getDocPath(hash);
      const { parentKey, childKey } = getDocKeyFromPath(path);

      setActiveParent(parentKey);
      setActiveChild(childKey);

      setExpanded((current) =>
        current.includes(parentKey) ? current : [...current, parentKey]
      );
    };

    syncSelection();
    window.addEventListener("hashchange", syncSelection);

    return () => {
      window.removeEventListener("hashchange", syncSelection);
    };
  }, []);

  const toggle = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    );
  };

  const selectParent = (key: string) => {
    window.location.hash = key;
    if (!expanded.includes(key)) {
      setExpanded((current) => [...current, key]);
    }
  };

  const selectChild = (parentKey: string, childKey: string) => {
    window.location.hash = `${parentKey}/${childKey}`;
  };

  return (
    <nav className="flex w-full flex-col gap-1 pb-10">
      {Object.entries(docs).map(([key, doc]) => {
        const isExpanded = expanded.includes(key);
        const isParentActive = activeParent === key && !activeChild;

        return (
          <div key={key} className="flex flex-col">
            <div
              onClick={() => selectParent(key)}
              className={`group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isParentActive
                  ? "bg-zinc-200/80 text-zinc-950 font-semibold dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
              }`}
            >
              <span className="truncate">{doc.label}</span>

              <button
                type="button"
                onClick={(e) => toggle(key, e)}
                aria-label={`Toggle ${doc.label}`}
                aria-expanded={isExpanded}
                className="ml-2 rounded p-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                {isExpanded ? (
                  <ChevronDown size={14} className="shrink-0" />
                ) : (
                  <ChevronRight size={14} className="shrink-0" />
                )}
              </button>
            </div>

            {isExpanded && (
              <div className="ml-3 mt-1 flex flex-col gap-0.5 border-l border-zinc-200 pl-3 dark:border-zinc-800">
                {Object.entries(doc.children).map(([childKey, child]) => {
                  const isChildActive =
                    activeParent === key && activeChild === childKey;

                  return (
                    <button
                      key={childKey}
                      type="button"
                      onClick={() => selectChild(key, childKey)}
                      className={`flex w-full items-center rounded-md px-2.5 py-1.5 text-left text-xs transition-colors ${
                        isChildActive
                          ? "bg-zinc-200/80 text-zinc-950 font-medium dark:bg-zinc-800 dark:text-zinc-100"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200"
                      }`}
                    >
                      <span className="truncate">{child.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default DocsSidebar;