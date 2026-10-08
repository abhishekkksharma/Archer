"use client";

import React, { useEffect, useState } from "react";
import ProjectPreview, { IProject } from "./ProjectPreview";
import CanvasReadOnly from "./CanvasReadOnly";
import { getToken } from "@/utils/cookie";
import TechStackPreview from "./TechStackPreview";

interface IPublishedProject {
  id: string;
}

function PublishedProject({ id }: IPublishedProject) {
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const token = getToken();

      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

      const res = await fetch(`${backendUrl}/published/project/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch project");
      }

      const data = await res.json();

      if (data.success && data.project) {
        setProject(data.project);
      }
    } catch (err) {
      console.error("Failed to fetch project:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchProject();
  }, [id]);

  return (
    <section className="px-6 lg:px-[20%] pt-18">
      <ProjectPreview project={project} loading={loading} />
      <TechStackPreview project={project} loading={loading} />

      <div className="py- flex flex-col gap-2">
        <div className="flex flex-col lg:px-6 gap-2">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            System Architecture
          </h2>
          <p className="text-sm text-zinc-700 dark:text-zinc-100">
            Understand the project better with it's Architecture
          </p>
        </div>

        <div className="lg:p-4 w-full">
          <CanvasReadOnly
            projectId={id}
            architectureData={project?.projectId?.architectureId}
            parentLoading={loading}
            className="relative w-full h-120 rounded-xl border border-zinc-200 shadow-sm dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
          />
        </div>
      </div>
    </section>
  );
}

export default PublishedProject;