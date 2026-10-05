"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import {
    Avatar1,
    Avatar2,
    Avatar3,
    Avatar4,
    Avatar5,
} from "@/assets/Icons/avatars";
import Link from "next/link";

const avatarMap = {
    avatar1: Avatar1,
    avatar2: Avatar2,
    avatar3: Avatar3,
    avatar4: Avatar4,
    avatar5: Avatar5,
};

function UserAvatarInfo() {
    const { user, logout } = useUser();
    const [isOpen, setIsOpen] = useState(false);

    if (!user) {
        return null;
    }

    const avatarSrc =
        avatarMap[user.avatar as keyof typeof avatarMap] || Avatar3;

    return (
        <div className="relative border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            {isOpen && (
                <div className="border-t border-zinc-200 px-3 py-2 dark:border-zinc-800">
                    <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                    >
                        Profile
                    </Link>

                    <button
                        onClick={logout}
                        className="w-full px-3 py-2 text-left text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                        Logout
                    </button>
                </div>
            )}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
            >
                <div className="shrink-0">
                    <Image
                        className="h-10 w-10 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-700"
                        src={avatarSrc}
                        alt={`${user.name}'s avatar`}
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {user.name}
                    </p>
                </div>

                <svg
                    className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${
                        isOpen ? "" : "rotate-180"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            
        </div>
    );
}

export default UserAvatarInfo;