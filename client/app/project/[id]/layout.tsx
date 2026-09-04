"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/Projects/Sidebar";
import { useUser } from "@/context/UserContext";

interface IProject {
  _id?: string;
  id?: string;
  name?: string;
  description?: string;
  progress?: number;
  status?: string;
  type?: string;
}

function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const rawId = params?.id;
  const projectId = Array.isArray(rawId) ? rawId[0] : rawId || "";

  const { user } = useUser();
  const [projectData, setProjectData] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    // First check user projects array from context
    if (user?.projects && Array.isArray(user.projects)) {
      const found = user.projects.find(
        (p: any) => p._id === projectId || p.id === projectId
      );
      if (found) {
        setProjectData(found);
      }
    }

    // Fetch single project details from backend API to ensure fresh data
    const fetchProjectDetails = async () => {
      try {
        const token =
          getCookie("token") || getCookie("auth_token") || getCookie("jwt");
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

        const res = await fetch(`${backendUrl}/project/${projectId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.project) {
            setProjectData(data.project);
          }
        }
      } catch (err) {
        console.error("Failed to fetch project details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, user]);

  const projectName = projectData?.name || "Project Overview";
  const projectDescription =
    projectData?.description || "Manage project tasks, roadmap and architecture.";
  const progress =
    typeof projectData?.progress === "number" ? projectData.progress : 0;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-black text-zinc-900 dark:text-zinc-100">
      <Sidebar
        projectId={projectId}
        projectName={projectName}
        projectDescription={projectDescription}
        progress={progress}
      />
      <main className="flex-1 overflow-y-auto h-screen bg-zinc-50/50 dark:bg-black/50">
        {children}
      </main>
    </div>
  );
}
