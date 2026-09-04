"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Code2, Server, Database, Wrench, Shield } from "lucide-react";

export default function ProjectTechStackPage() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId || "";

  const { user } = useUser();
  const [techStack, setTechStack] = useState<any>(null);

  useEffect(() => {
    if (!id || !user?.projects) return;
    const found = user.projects.find((p: any) => p._id === id || p.id === id);
    if (found?.techStackId) {
      setTechStack(found.techStackId);
    }
  }, [id, user]);

  const categories = [
    { title: "Frontend", icon: Code2, items: techStack?.frontend || [{ name: "Next.js" }, { name: "Tailwind CSS" }, { name: "TypeScript" }] },
    { title: "Backend", icon: Server, items: techStack?.backend || [{ name: "Node.js" }, { name: "Express.js" }] },
    { title: "Database", icon: Database, items: techStack?.database || [{ name: "MongoDB" }] },
    { title: "Other Services", icon: Wrench, items: techStack?.otherServices || [{ name: "Docker" }] },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-purple-500">
          <Code2 className="w-5 h-5" />
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Tech Stack
          </h1>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Technologies and tools powering this project.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.title}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 space-y-4 shadow-sm"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <Icon className="w-4 h-4 text-purple-500" />
                <span>{cat.title}</span>
              </div>

              <div className="space-y-2">
                {cat.items.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/80"
                  >
                    <p className="text-xs font-semibold text-zinc-900 dark:text-white">
                      {typeof item === "string" ? item : item.name}
                    </p>
                    {item.reason && (
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {item.reason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
