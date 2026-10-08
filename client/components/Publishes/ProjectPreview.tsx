"use client";

import React from "react";
import { Globe, ExternalLink } from "lucide-react";

export interface IPublishedBy {
  _id: string;
  name: string;
  avatar: string;
}

export interface IProjectDetails {
  _id: string;
  userId: string;
  name: string;
  description: string;
  type: string;
  experienceLevel: string;
  status: string;
  progress: number;
  projectLiveLink: string;
  githubLink: string;
  createdAt: string;
  updatedAt: string;
  techStackId?: any;
  roadmapId?: any;
  architectureId?: any;
}

export interface IProject {
  _id: string;
  projectId: IProjectDetails;
  publishedBy: IPublishedBy;
  projectName: string;
  projectType: string;
  projectGithubLink: string;
  projectLiveLink: string;
  projectDescription: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface IProjectPreview {
  project: IProject | null;
  loading?: boolean;
}

function ProjectPreview({ project, loading }: IProjectPreview) {

  if (loading) {
    return (
      <div className="w-full h-[250px] flex items-center justify-center text-zinc-500">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="w-full h-[250px] flex items-center justify-center text-zinc-500">
        Project not found
      </div>
    );
  }

  const projectLink = project.projectLiveLink;
  const githubLink = project.projectGithubLink;

  return (
    <div className="relative flex flex-col md:flex-row gap-6 w-full items-start overflow-hidden rounded-2xl text-zinc-900 dark:text-zinc-100 bg-white/40 dark:bg-zinc-900/20">
      
      {/* Project Preview */}
      <div className="w-full md:w-7/12 lg:w-1/2 shrink-0">
        <div className="relative w-full h-[250px] sm:h-[300px] overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 flex flex-col shadow-sm">

          {/* Browser Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shrink-0 z-10">
            
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80 shrink-0" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shrink-0" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shrink-0" />

              <span className="ml-2 text-[10px] text-zinc-400 font-mono truncate">
                {projectLink
                  ? projectLink.replace(/^https?:\/\//, "")
                  : "offline"}
              </span>
            </div>

            {projectLink && (
              <a
                href={projectLink}
                target="_blank"
                rel="noopener noreferrer"
                title="Open website in new tab"
                className="text-zinc-400 hover:text-zinc-200 transition-colors p-0.5"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Website Preview */}
          {projectLink ? (
            <div className="relative flex-1 w-full overflow-hidden bg-white">
              <iframe
                src={projectLink}
                title={`${project.projectName} Preview`}
                className="border-0"
                style={{
                  width: "250%",
                  height: "250%",
                  transform: "scale(0.4)",
                  transformOrigin: "top left",
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 h-full p-6 text-center bg-white dark:bg-zinc-900/60 text-zinc-400">
              <Globe className="w-8 h-8 mb-2 text-zinc-500" />

              <p className="text-sm font-medium text-zinc-300">
                The website is not live yet
              </p>

              <p className="text-xs text-zinc-500 mt-1">
                No preview link available
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Project Information */}
      <div className="relative z-10 flex-1 space-y-3 py-4">

        {/* Tags / Links */}
        <div className="flex items-center gap-2 flex-wrap">

          {/* Project Type */}
          <span
            className="
              rounded-full
              border
              px-2.5 py-1
              text-xs font-semibold
              border-blue-200
              text-blue-600
              dark:border-blue-500/30
              dark:text-blue-400
            "
          >
            {project.projectType}
          </span>

          {/* Website */}
          {projectLink ? (
            <a
              href={projectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-1.5
                rounded-full
                bg-blue-500/10 hover:bg-blue-500/20
                border border-blue-500/20
                px-2.5 py-1
                text-xs font-semibold
                text-blue-600 dark:text-blue-400
                transition-colors
              "
            >
              <span>Visit Website</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-xs text-zinc-400 dark:text-zinc-500 italic">
              The website is not live yet
            </span>
          )}

          {/* GitHub */}
          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-1.5
                rounded-full
                bg-zinc-500/10 hover:bg-zinc-500/20
                border border-zinc-500/20
                px-2.5 py-1
                text-xs font-semibold
                text-zinc-700 dark:text-zinc-300
                transition-colors
              "
            >
              <span>Repository</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Project Name */}
        <h1
          className="
            text-2xl
            sm:text-3xl
            font-bold
            tracking-tight
            text-zinc-900
            dark:text-white
          "
        >
          {project.projectName}
        </h1>

        {/* Description */}
        <p
          className="
            max-w-2xl
            text-sm
            leading-relaxed
            text-zinc-600
            dark:text-zinc-400
          "
        >
          {project.projectDescription}
        </p>

      </div>
    </div>
  );
}

export default ProjectPreview;