"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/public/logoSVG.png";
import {
  ArrowLeft,
  BarChart3,
  Boxes,
  Bot,
  CheckSquare,
  Code2,
  LayoutDashboard,
  Map,
  Settings,
} from "lucide-react";
import ProgressBar from "./ProgressBar";
import Image from "next/image";

const sidebarItems = [
  {
    name: "overview",
    href: "/overview",
    icon: LayoutDashboard,
  },
  {
    name: "roadmap",
    href: "/roadmap",
    icon: Map,
  },
  {
    name: "tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "analysis",
    href: "/analysis",
    icon: BarChart3,
  },
  {
    name: "architecture",
    href: "/architecture",
    icon: Boxes,
  },
  {
    name: "assistant",
    href: "/assistant",
    icon: Bot,
  },
  {
    name: "progress",
    href: "/progress",
    icon: BarChart3,
  },
  {
    name: "tech-stack",
    href: "/tech-stack",
    icon: Code2,
  },
  {
    name: "settings",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  projectId?: string;
  activeItem?: string;
  projectName?: string;
  projectDescription?: string;
  progress?: number;
}

function Sidebar({
  projectId = "",
  activeItem,
  projectName = "Project",
  projectDescription = "Project details and overview",
  progress = 0,
}: SidebarProps) {
  const pathname = usePathname();

  const checkIsActive = (itemName: string, itemHref: string) => {
    if (activeItem) return activeItem === itemName;
    if (!pathname) return false;

    if (itemName === "overview") {
      return (
        pathname === `/project/${projectId}` ||
        pathname === `/project/${projectId}/overview`
      );
    }

    return (
      pathname === `/project/${projectId}${itemHref}` ||
      pathname.startsWith(`/project/${projectId}${itemHref}/`)
    );
  };

  const getItemLink = (itemName: string, itemHref: string) => {
    if (!projectId) return "#";
    if (itemName === "overview") {
      return `/project/${projectId}`;
    }
    return `/project/${projectId}${itemHref}`;
  };

  return (
    <aside
      className="
        w-60 h-screen shrink-0
        border-r
        bg-white dark:bg-black
        border-zinc-200 dark:border-zinc-800
        text-zinc-900 dark:text-zinc-100
        flex flex-col
      "
    >
      {/* Logo Header */}
      <div className="px-4 flex items-center justify-between h-14 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <Image
            className="h-7 w-7 transition-all duration-500 dark:invert"
            src={Logo}
            alt="Archer logo"
          />
          <span className="text-base font-semibold tracking-wide text-zinc-900 dark:text-white">
            Archer
          </span>
        </Link>
      </div>

      {/* Project Details Section */}
      <div className="px-4 pt-3 pb-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="
            inline-flex items-center gap-1.5
            mb-3
            text-xs font-medium
            text-zinc-500 dark:text-zinc-400
            hover:text-zinc-900 dark:hover:text-zinc-100
            transition-colors
          "
        >
          <ArrowLeft size={14} strokeWidth={1.7} />
          <span>All Projects</span>
        </Link>

        {/* Project Name */}
        <h1 className="text-base font-semibold tracking-tight line-clamp-1 text-zinc-900 dark:text-white">
          {projectName}
        </h1>

        {/* Description */}
        <p className="mt-1 text-xs leading-snug text-zinc-500 dark:text-zinc-400 line-clamp-2">
          {projectDescription}
        </p>

        {/* Progress */}
        <div className="mt-3">
          <ProgressBar progress={progress} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <div className="space-y-0.5">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = checkIsActive(item.name, item.href);

            return (
              <Link
                key={item.name}
                href={getItemLink(item.name, item.href)}
                className={`
                  group
                  flex items-center gap-3
                  h-9 px-2.5
                  rounded-md
                  text-xs font-medium
                  capitalize
                  transition-colors
                  ${
                    isActive
                      ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/70 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }
                `}
              >
                <Icon
                  size={16}
                  strokeWidth={1.8}
                  className={`
                    shrink-0
                    transition-colors
                    ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-zinc-500 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"
                    }
                  `}
                />
                <span>{item.name.replace("-", " ")}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Theme Toggle Footer */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-50/50 dark:bg-zinc-950/50">
        {/* <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Theme</span>
        <ThemeToggle scrolled /> */}
      </div>
    </aside>
  );
}

export default Sidebar;

