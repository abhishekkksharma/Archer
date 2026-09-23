"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import Logo from "@/public/logoSVG.png";
import GithubSVG from "@/assets/github.svg";

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
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

import ProgressBar from "./ProgressBar";

const GithubIcon = ({
  size = 16,
  className = "",
}: {
  size?: number;
  strokeWidth?: number;
  className?: string;
}) => (
  <Image
    src={GithubSVG}
    alt="GitHub"
    width={size}
    height={size}
    className={`dark:invert ${className}`}
  />
);

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
    name: "github-stats",
    href: "/githubstats",
    icon: GithubIcon,
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

  const [isOpen, setIsOpen] = useState(false);

  const checkIsActive = (itemName: string, itemHref: string) => {
    if (activeItem) {
      return activeItem === itemName;
    }

    if (!pathname) {
      return false;
    }

    // Overview
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
    if (!projectId) {
      return "#";
    }

    if (itemName === "overview") {
      return `/project/${projectId}`;
    }

    return `/project/${projectId}${itemHref}`;
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* =========================================================
          MOBILE OPEN BUTTON
          Hidden on md and larger
      ========================================================= */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open sidebar"
        aria-expanded={isOpen}
        className="
          fixed
          left-2
          top-2
          z-[100]
          flex
          h-10
          w-10
          items-center
          justify-center
          text-zinc-700
          dark:text-zinc-300
          transition-colors
          hover:bg-zinc-50
          md:hidden
        "
      >
        <ChevronRight className={` ${isOpen ?  "invisible opacity-0":"visible opacity-100"}`} size={25} strokeWidth={3} />
      </button>

      {/* =========================================================
          MOBILE BACKDROP
          Only visible when sidebar is open
      ========================================================= */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeSidebar}
          className={`
            fixed
            inset-0
            z-[90]
            
            cursor-default
            bg-black/40
            backdrop-blur-[1px]
            md:hidden
          `}
        />
      )}

      {/* =========================================================
          SIDEBAR
      ========================================================= */}
      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-[95]

          flex
          h-screen
          w-60
          shrink-0
          flex-col

          border-r
          border-zinc-200
          bg-white
          text-zinc-900

          dark:border-zinc-800
          dark:bg-black
          dark:text-zinc-100

          transform
          transition-transform
          duration-200
          ease-in-out

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          md:relative
          md:translate-x-0
          md:transition-none
        `}
      >
        {/* =====================================================
            LOGO HEADER
        ===================================================== */}
        <div
          className="
            flex
            h-14
            shrink-0
            items-center
            justify-between

            border-b
            border-zinc-200
            px-4

            dark:border-zinc-800
          "
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={closeSidebar}
            className="flex items-center gap-2"
          >
            <Image
              className="
                h-7
                w-7
                transition-all
                duration-500
                dark:invert
              "
              src={Logo}
              alt="Archer logo"
            />

            <span
              className="
                text-base
                font-semibold
                tracking-wide
                text-zinc-900
                dark:text-white
              "
            >
              Archer
            </span>
          </Link>

          {/* =================================================
              MOBILE CLOSE BUTTON
          ================================================= */}
          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close sidebar"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center

              rounded-md

              text-zinc-500

              transition-colors
              hover:bg-zinc-100
              hover:text-zinc-900

              dark:hover:bg-zinc-900
              dark:hover:text-white

              md:hidden
            "
          >
            <X size={19} strokeWidth={2} />
          </button>
        </div>

        {/* =====================================================
            PROJECT DETAILS
        ===================================================== */}
        <div
          className="
            shrink-0

            border-b
            border-zinc-200
            px-4
            pb-4
            pt-3

            dark:border-zinc-800
          "
        >
          {/* Back to projects */}
          <Link
            href="/dashboard"
            onClick={closeSidebar}
            className="
              mb-3
              inline-flex
              items-center
              gap-1.5

              text-xs
              font-medium

              text-zinc-500
              transition-colors

              hover:text-zinc-900

              dark:text-zinc-400
              dark:hover:text-zinc-100
            "
          >
            <ArrowLeft
              size={14}
              strokeWidth={1.7}
            />

            <span>All Projects</span>
          </Link>

          {/* Project name */}
          <h1
            className="
              line-clamp-1

              text-base
              font-semibold
              tracking-tight

              text-zinc-900
              dark:text-white
            "
          >
            {projectName}
          </h1>

          {/* Description */}
          <p
            className="
              mt-1
              line-clamp-2

              text-xs
              leading-snug

              text-zinc-500
              dark:text-zinc-400
            "
          >
            {projectDescription}
          </p>

          {/* Progress */}
          <div className="mt-3">
            <ProgressBar progress={progress} />
          </div>
        </div>

        {/* =====================================================
            NAVIGATION
        ===================================================== */}
        <nav
          className="
            flex-1
            overflow-y-auto
            px-2
            py-3
          "
        >
          <div className="space-y-0.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;

              const isActive = checkIsActive(
                item.name,
                item.href
              );

              return (
                <Link
                  key={item.name}
                  href={getItemLink(
                    item.name,
                    item.href
                  )}
                  onClick={closeSidebar}
                  className={`
                    group

                    flex
                    h-9
                    items-center
                    gap-3

                    rounded-md
                    px-2.5

                    text-xs
                    font-medium
                    capitalize

                    transition-colors

                    ${
                      isActive
                        ? `
                          bg-zinc-100
                          font-semibold
                          text-zinc-900

                          dark:bg-zinc-900
                          dark:text-zinc-100
                        `
                        : `
                          text-zinc-600

                          hover:bg-zinc-100/70
                          hover:text-zinc-900

                          dark:text-zinc-400
                          dark:hover:bg-zinc-900/60
                          dark:hover:text-zinc-200
                        `
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
                          ? `
                            text-blue-600
                            dark:text-blue-400
                          `
                          : `
                            text-zinc-500

                            group-hover:text-zinc-700

                            dark:text-zinc-500
                            dark:group-hover:text-zinc-300
                          `
                      }
                    `}
                  />

                  <span>
                    {item.name.replace("-", " ")}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;