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
import { Pen, ArrowUpRight } from "lucide-react";
import ChangeAvatar from "./ChangeAvatar";

const avatarMap = {
    avatar1: Avatar1,
    avatar2: Avatar2,
    avatar3: Avatar3,
    avatar4: Avatar4,
    avatar5: Avatar5,
} as const;

type AvatarName = keyof typeof avatarMap;

function UserInfo() {
    const { user, loading } = useUser();
    const [changeAvatar, setChangeAvatar] = useState(false);

    if (loading) {
        return (
            <div className="flex w-full items-center justify-center py-20 text-sm text-zinc-500">
                Loading...
            </div>
        );
    }

    const currentAvatar: AvatarName =
        user?.avatar && user.avatar in avatarMap
            ? (user.avatar as AvatarName)
            : "avatar3";

    const avatar = avatarMap[currentAvatar];

    return (
        <>
            <div className="w-full px-2 pt-10">
                {/* Profile */}
                <div className="flex items-center gap-5">
                    <div className="group relative w-fit shrink-0 rounded-full border-2 border-black dark:border-zinc-50">
                        <Image
                            className="h-20 w-20 rounded-full object-cover lg:h-30 lg:w-30"
                            src={avatar}
                            alt={user?.name || "User"}
                            onClick={() => setChangeAvatar(true)}
                        />

                        <button
                            type="button"
                            onClick={() => setChangeAvatar(true)}
                            className="absolute inset-0 hidden items-center justify-center rounded-full bg-black/40 group-hover:flex"
                        >
                            <Pen className="h-6 w-6 text-white" />
                        </button>
                    </div>

                    <div className="flex min-w-0 flex-col gap-2">
                        <p className="truncate text-2xl font-semibold text-zinc-900 dark:text-white lg:text-3xl">
                            {user?.name}
                        </p>

                        <p className="w-fit max-w-full truncate rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                            {user?.email}
                        </p>
                    </div>
                </div>
            </div>

            <ChangeAvatar
                visible={changeAvatar}
                currentAvatar={currentAvatar}
                onClose={() => setChangeAvatar(false)}
            />

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 border-y border-zinc-200 dark:border-zinc-800 lg:mt-10 lg:grid-cols-4">
                {/* Projects */}
                <div className="border-b border-zinc-200 px-5 py-5 dark:border-zinc-800 lg:border-b-0 lg:border-r">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Projects
                    </p>

                    <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-white">
                        {user?.projects?.length ?? 0}
                    </p>
                </div>

                {/* Account Created */}
                <div className="border-b border-zinc-200 px-5 py-5 dark:border-zinc-800 lg:border-b-0 lg:border-r">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Account created
                    </p>

                    <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                  }
                              )
                            : "—"}
                    </p>
                </div>

                {/* Last Login */}
                <div className="border-b border-zinc-200 px-5 py-5 dark:border-zinc-800 lg:border-b-0 lg:border-r">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Last login
                    </p>

                    <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {user?.updatedAt
                            ? new Date(user.updatedAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                  }
                              )
                            : "—"}
                    </p>
                </div>

                {/* Google Verification */}
                <div className="px-5 py-5">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Google verified
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                        <span
                            className={`h-2 w-2 rounded-full ${
                                user?.googleId
                                    ? "bg-green-500"
                                    : "bg-zinc-400"
                            }`}
                        />

                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {user?.googleId
                                ? "Verified"
                                : "Not verified"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Projects */}
            <div className="mt-10 w-full">
                <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        Projects
                    </p>

                    <p className="text-xs text-zinc-400">
                        {user?.projects?.length ?? 0} total
                    </p>
                </div>

                <div className="w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 mb-12">
                    {user?.projects?.length ? (
                        user.projects.map((project, index) => (
                            <a
                                key={project._id}
                                href={`/project/${project._id}`}
                                className="group flex items-center justify-between border-b border-zinc-200 px-4 py-3 transition-colors last:border-b-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/60"
                            >
                                <div className="flex min-w-0 items-center gap-4">
                                    <span className="w-6 shrink-0 text-xs text-zinc-400">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <span className="truncate text-sm font-medium text-zinc-800 transition-colors group-hover:text-blue-500 dark:text-zinc-200">
                                        {project.name}
                                    </span>
                                </div>

                                <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-400 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-500" />
                            </a>
                        ))
                    ) : (
                        <div className="px-4 py-10 text-center">
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                No projects yet
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default UserInfo;