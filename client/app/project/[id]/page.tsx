"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import {
  Map,
  CheckSquare,
  BarChart3,
  Boxes,
  Bot,
  Code2,
  Settings,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Award,
  ExternalLink,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";

interface IProject {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  type?: string;
  experienceLevel?: string;
  status?: string;
  progress?: number;
  techStack?: any;
  techStackId?: any;
  createdAt?: string;
  link?: string;
  demoUrl?: string;
  liveUrl?: string;
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

export default function ProjectDashboardPage() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId || "";

  const { user } = useUser();

  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    if (user?.projects && Array.isArray(user.projects)) {
      const found = user.projects.find(
        (p: any) => p._id === id || p.id === id
      );

      if (found) {
        setProject(found);
      }
    }

    const fetchProject = async () => {
      try {
        const token =
          getCookie("token") ||
          getCookie("auth_token") ||
          getCookie("jwt");

        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL ||
          "http://localhost:5000/api";

        const res = await fetch(`${backendUrl}/project/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (res.ok) {
          const data = await res.json();

          if (data.success && data.project) {
            setProject(data.project);
          }
        }
      } catch (err) {
        console.error("Failed to fetch project dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, user]);

  const quickNavCards = [
    {
      title: "Roadmap",
      desc: "View and structure project milestones and development schedule.",
      href: `/project/${id}/roadmap`,
      icon: Map,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Tasks",
      desc: "Track pending todo items, features in progress, and completions.",
      href: `/project/${id}/tasks`,
      icon: CheckSquare,
      color:
        "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Tech Stack",
      desc: "Manage frontend, backend, database and service choices.",
      href: `/project/${id}/tech-stack`,
      icon: Code2,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Architecture",
      desc: "Explore application architecture, system design and data flow.",
      href: `/project/${id}/architecture`,
      icon: Boxes,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "AI Assistant",
      desc: "Leverage AI guidance to assist with coding and project planning.",
      href: `/project/${id}/assistant`,
      icon: Bot,
      color:
        "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Analysis",
      desc: "Review code quality, stack recommendations and metrics.",
      href: `/project/${id}/analysis`,
      icon: BarChart3,
      color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      title: "Progress Tracker",
      desc: "Monitor sprint completion, burndown and phase completion.",
      href: `/project/${id}/progress`,
      icon: Activity,
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    },
    {
      title: "Settings",
      desc: "Configure project details, status and integrations.",
      href: `/project/${id}/settings`,
      icon: Settings,
      color: "text-zinc-500 bg-zinc-500/10 border-zinc-500/20",
    },
  ];

  if (loading && !project) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />

        <div className="h-4 w-96 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const projectName = project?.name || "Project Overview";
  const projectDescription =
    project?.description || "No description provided.";

  const status = project?.status || "Planning";
  const progress = project?.progress ?? 0;
  const projectType = project?.type || "Web Application";
  const experienceLevel = project?.experienceLevel || "Beginner";
  const projectLink = project?.link || project?.demoUrl || project?.liveUrl || "https://knowmo.vercel.app/";

  // Keep progress between 0 and 100
  const clampedProgress = Math.min(
    Math.max(progress, 0),
    100
  );

  // Circular progress configuration
  const radius = 27;
  const circumference = 2 * Math.PI * radius;

  const progressOffset =
    circumference -
    (clampedProgress / 100) * circumference;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">

      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="relative flex flex-col md:flex-row gap-6 w-full items-start overflow-hidden rounded-2xl text-zinc-900 dark:text-zinc-100  bg-white/40 dark:bg-zinc-900/20">

        {/* Project Preview - Landscape Desktop Frame */}
        <div className="w-full md:w-1/2 lg:w-5/12 shrink-0">
          <div className="relative w-full h-[220px] sm:h-[260px] overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 flex flex-col shadow-sm">
            {/* Mini Browser Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shrink-0 z-10">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80 shrink-0" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shrink-0" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shrink-0" />
                <span className="ml-2 text-[10px] text-zinc-400 font-mono truncate">
                  {projectLink ? projectLink.replace(/^https?:\/\//, "") : "offline"}
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

            {/* Viewport iFrame or Not Live Fallback */}
            {projectLink ? (
              <div className="relative flex-1 w-full overflow-hidden bg-white">
                <iframe
                  src={projectLink}
                  title="Project Preview"
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
                <p className="text-sm font-medium text-zinc-300">The website is not live yet</p>
                <p className="text-xs text-zinc-500 mt-1">No preview link available</p>
              </div>
            )}
          </div>
        </div>

        {/* Project Information */}
        <div className="relative z-10 flex-1 space-y-3 py-4">

          <div className="flex items-center gap-2 flex-wrap">
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
              {projectType}
            </span>

            <span
              className="
                rounded-full
                border
                px-2.5 py-1
                text-xs font-semibold
                border-zinc-200
                text-zinc-600
                dark:border-zinc-700
                dark:text-zinc-400
              "
            >
              {status}
            </span>

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
          </div>

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
            {projectName}
          </h1>

          <p
            className="
              max-w-2xl
              text-sm
              leading-relaxed
              text-zinc-600
              dark:text-zinc-400
            "
          >
            {projectDescription}
          </p>

        </div>
      </div>


    
      {/* =========================================================
          OVERVIEW CARDS
      ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* -------------------------------------------------------
            OVERALL PROGRESS
        ------------------------------------------------------- */}
        <div
          className="
            lg:col-span-5
            rounded
            border border-zinc-200 dark:border-zinc-800
            bg-white/50 dark:bg-zinc-900/30
            p-5
            flex flex-col justify-between
          "
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Overall Progress
            </span>

            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>

          <div className="flex items-center justify-center my-4">
            {/* Large Circular Progress */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32">

              <svg
                viewBox="0 0 120 120"
                className="w-full h-full -rotate-90"
              >
                {/* Background Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="9"
                  className="text-zinc-100 dark:text-zinc-800"
                />

                {/* Progress Ring */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="9"
                  strokeLinecap="round"
                  className="text-blue-500"
                  strokeDasharray={2 * Math.PI * 50}
                  initial={{
                    strokeDashoffset: 2 * Math.PI * 50,
                  }}
                  animate={{
                    strokeDashoffset:
                      2 *
                      Math.PI *
                      50 *
                      (1 - clampedProgress / 100),
                  }}
                  transition={{
                    duration: 1,
                    ease: "easeOut",
                  }}
                />
              </svg>

              {/* Percentage */}
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: 0.3,
                  duration: 0.3,
                }}
                className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  flex-col
                "
              >
                <span
                  className="
                    text-2xl
                    sm:text-3xl
                    font-bold
                    tracking-tight
                    text-zinc-900
                    dark:text-white
                  "
                >
                  {Math.round(clampedProgress)}%
                </span>

                <span
                  className="
                    text-[10px]
                    text-zinc-400
                    dark:text-zinc-500
                  "
                >
                  complete
                </span>
              </motion.div>

            </div>
          </div>

          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
            Project completion
          </p>
        </div>


        {/* -------------------------------------------------------
            PROJECT METADATA STACK
        ------------------------------------------------------- */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-3">

          {/* PROJECT TYPE */}
          <div className="flex items-center justify-between p-4 rounded bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-500">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium block">
                  Project Type
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                  Application Architecture
                </span>
              </div>
            </div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">
              {projectType}
            </span>
          </div>

          {/* EXPERIENCE LEVEL */}
          <div className="flex items-center justify-between p-4 rounded bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium block">
                  Experience Level
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                  Target Skill Level
                </span>
              </div>
            </div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">
              {experienceLevel}
            </span>
          </div>

          {/* CURRENT STATUS */}
          <div className="flex items-center justify-between p-4 rounded bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium block">
                  Current Status
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                  Active Workflow State
                </span>
              </div>
            </div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">
              {status}
            </span>
          </div>

        </div>

      </div>
        
        
      {/* =========================================================
                QUICK ACCESS
      ========================================================= */}
      <div className="space-y-4">

        <h2
          className="
            text-lg
            font-semibold
            tracking-tight
            text-zinc-900
            dark:text-white
          "
        >
          Quick Access
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickNavCards.map((card) => {
            const Icon = card.icon;
          
            return (
              <Link
                key={card.title}
                href={card.href}
                className="
                  group
                  flex
                  items-center
                  gap-3
                  rounded-
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  bg-transparent
                  px-4
                  py-3
                  transition-colors
                  hover:border-zinc-400
                  dark:hover:border-zinc-600
                "
              >
                {/* Icon */}
                <div
                  className="
                    shrink-0
                    flex
                    items-center
                    justify-center
                    w-9
                    h-9
                    text-zinc-700
                    dark:text-zinc-300
                    group-hover:border-zinc-400
                    group-hover:text-black
                    dark:group-hover:border-zinc-600
                    dark:group-hover:text-white
                    transition-colors
                  "
                >
                  <Icon className="w-4 h-4" />
                </div>
            
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3
                    className="
                      text-sm
                      font-medium
                      text-zinc-900
                      dark:text-zinc-100
                      truncate
                    "
                  >
                    {card.title}
                  </h3>
                </div>
            
                {/* Arrow */}
                <ArrowRight
                  className="
                    shrink-0
                    w-4
                    h-4
                    text-zinc-400
                    dark:text-zinc-500
                    group-hover:text-black
                    dark:group-hover:text-white
                    group-hover:translate-x-0.5
                    transition-all
                  "
                />
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}