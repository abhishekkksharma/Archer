"use client";

import React, { useEffect, useState } from "react";
import { getToken } from "@/utils/cookie";
import Link from "next/link";
import Image from "next/image";
import {
  Avatar1,
  Avatar2,
  Avatar3,
  Avatar4,
  Avatar5,
} from "@/assets/Icons/avatars";
import { avatarMap } from "../Header/ProfileButton";

export interface Project {
  _id: string;
  projectId: string;
  publishedBy: {
    avatar: string;
    name: string;
    _id: string;
  };
  projectName: string;
  projectType: string;
  projectLiveLink?: string;
  projectGithubLink?: string;
  projectDescription: string;
}

interface MappedProjectsProps {
  projectType?: string;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

function MappedProjects({ projectType }: MappedProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedType, setSelectedType] = useState(projectType || "");
  const token = getToken();

  const getProjects = async () => {
    try {
      const url = new URL(`${BASE_URL}/published/project`);

      if (selectedType) {
        url.searchParams.set("projectType", selectedType);
      }

      const response = await fetch(url.toString(), {
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

      const data = await response.json();

      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    getProjects();
  }, [selectedType]);

  return (
    <section className="flex flex-col">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Published projects
        </p>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="
            w-full sm:w-auto
            rounded-lg
            border border-zinc-200
            bg-white
            px-3 py-2
            text-xs text-zinc-700
            shadow-sm
            outline-none
            transition
            hover:border-zinc-300
            focus:border-zinc-400
            focus:ring-2
            focus:ring-zinc-200
            dark:border-zinc-800
            dark:bg-zinc-950
            dark:text-zinc-300
            dark:hover:border-zinc-700
            dark:focus:border-zinc-700
            dark:focus:ring-zinc-800
          "
        >
          <option value="">All</option>
          <option value="Web Application">Web Application</option>
          <option value="Mobile Application">Mobile Application</option>
        </select>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project._id}
              className="
                group
                flex
                min-h-40
                flex-col
                gap-4
                rounded
                bg-zinc-50
                p-4
                transition-all
                duration-200
                sm:flex-row
                sm:gap-5
                dark:bg-zinc-900/50
                dark:hover:border-zinc-700
              "
            >
              <div
                className="
                  relative
                  h-36
                  w-full
                  shrink-0
                  overflow-hidden
                  rounded-lg
                  border
                  border-zinc-200
                  bg-zinc-100
                  sm:h-auto
                  sm:w-1/3
                  dark:border-zinc-800
                  dark:bg-zinc-900
                "
              >
                <Link
                    href={`/profile`}
                  className="
                    absolute
                    bottom-2
                    left-2
                    z-10
                    flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-zinc-200/80
                    bg-white/90
                    py-1
                    pl-1
                    pr-3
                    shadow-sm
                    backdrop-blur-md
                    dark:border-zinc-700/80
                    dark:bg-zinc-950/90
                  "
                >
                  <Image
                    className="h-6 w-6 rounded-full object-cover"
                    src={avatarMap[project.publishedBy.avatar] || Avatar2}
                    alt={`${project.publishedBy.name}'s avatar`}
                    width={24}
                    height={24}
                  />

                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    {project.publishedBy.name.split(" ")[0]}
                  </p>
                </Link>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2 py-1">
                <div>
                  <Link href={`/publishes/${project.projectId}`} className="truncate text-lg hover:underline font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {project.projectName}
                  </Link>

                  <p className="mt-0.5 text-xs font-medium text-zinc-500 dark:text-zinc-500">
                    {project.projectType}
                  </p>
                </div>

                <p className="line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {project.projectDescription}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div
            className="
              flex
              min-h-32
              items-center
              justify-center
              rounded-xl
              border
              border-dashed
              border-zinc-300
              bg-zinc-50
              dark:border-zinc-800
              dark:bg-zinc-950
            "
          >
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              No published projects found.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default MappedProjects;