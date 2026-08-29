"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { googleLogout } from "@react-oauth/google";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";

import {
  Avatar1,
  Avatar2,
  Avatar3,
  Avatar4,
  Avatar5,
} from "@/assets/ProfileIcons/avatars";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: "avatar1" | "avatar2" | "avatar3" | "avatar4" | "avatar5";
}

const avatarMap = {
  avatar1: Avatar1,
  avatar2: Avatar2,
  avatar3: Avatar3,
  avatar4: Avatar4,
  avatar5: Avatar5,
};

interface ProfileButtonProps {
  scrolled?: boolean;
}

function ProfileButton({ scrolled }: ProfileButtonProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const getCookie = (name: string): string | null => {
    if (typeof window === "undefined") return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }

    return null;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token =
          getCookie("token") ||
          getCookie("auth_token") ||
          getCookie("jwt");

        if (!token) return;

        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL ||
          "http://localhost:5000/api";

        const response = await fetch(`${backendUrl}/auth/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          if (data.success && data.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".profile-dropdown-container")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    try {
      googleLogout();
    } catch (e) {
      console.error(e);
    }
    
    setUser(null);
    setIsOpen(false);
    window.location.href = "/";
  };

  // Loading state
  if (loading) {
    return (
      <div className={`h-10 w-24 animate-pulse rounded-full ${scrolled ? "bg-black/5" : "bg-white/5"} backdrop-blur-md`} />
    );
  }

  // Logged-in user
  if (user) {
    const firstName = user.name
      ? user.name.split(" ")[0]
      : "User";

    const avatarSrc = avatarMap[user.avatar] || Avatar3;

    return (
      <div className="relative profile-dropdown-container">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            group
            flex items-center gap-2.5
            rounded-full
            border border-transparent
            px-2 py-1.5
            transition-all duration-300 ease-out
            hover:backdrop-blur-xl
            hover:shadow-lg
            cursor-pointer
            ${scrolled 
              ? "text-black hover:border-black/[0.12] hover:bg-black/[0.05] hover:shadow-black/5" 
              : "text-white hover:border-white/[0.12] hover:bg-white/[0.08] hover:shadow-black/20"
            }
          `}
        >
          <div className="relative">
            <Image
              src={avatarSrc}
              alt={`${user.name}'s avatar`}
              width={32}
              height={32}
              className="
                h-8 w-8
                shrink-0
                rounded-full
                object-cover
                transition-transform duration-300
                group-hover:scale-105
              "
            />

            {/* Subtle avatar glow */}
            <div className={`absolute inset-0 -z-10 rounded-full blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${scrolled ? "bg-black/5" : "bg-white/10"}`} />
          </div>

          <span className={`text-md font-medium tracking-wide transition-colors duration-300 ${scrolled ? "text-zinc-800 group-hover:text-black dark:text-white dark:hover:text-white" : "text-zinc-100 group-hover:text-white"}`}>
            {firstName}
          </span>
          <ChevronDown size={14} className={`mr-1 transition-transform duration-300 ${isOpen ? "rotate-180" : ""} ${scrolled ? "text-zinc-600 group-hover:text-zinc-800" : "text-zinc-300 group-hover:text-zinc-100"}`} />
        </button>

        {isOpen && (
          <div className={`
            absolute right-0 mt-2.5 w-48 rounded-xl border p-1.5 shadow-xl backdrop-blur-xl transition-all duration-200 z-50
            ${scrolled 
              ? "border-black/[0.08] bg-white/95 text-slate-800 shadow-black/5" 
              : "border-white/[0.12] bg-zinc-900/95 text-zinc-200 shadow-black/40"
            }
          `}>
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className={`
                flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
                ${scrolled 
                  ? "hover:bg-black/[0.04] hover:text-black" 
                  : "hover:bg-white/[0.08] hover:text-white"
                }
              `}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            <div className={`my-1 h-px w-full ${scrolled ? "bg-black/[0.06]" : "bg-white/[0.08]"}`} />
            <button
              onClick={handleLogout}
              className="
                flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 cursor-pointer
              "
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    );
  }

  // Not logged in
  return (
    <Link
      href="/login"
      className={`
        rounded-full
        border
        px-4 py-2
        text-sm
        backdrop-blur-md
        transition-all duration-300 ease-out
        hover:shadow-lg
        ${scrolled 
          ? "border-black/10 bg-black/[0.02] text-black hover:border-black/[0.18] hover:bg-black/[0.05] hover:shadow-black/5" 
          : "border-white/10 bg-white/[0.03] text-white hover:border-white/[0.18] hover:bg-white/[0.08] hover:shadow-black/20"
        }
      `}
    >
      Login
    </Link>
  );
}

export default ProfileButton;