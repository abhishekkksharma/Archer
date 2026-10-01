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
import { Pen } from "lucide-react";
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
        return <div>Loading...</div>;
    }

    const currentAvatar: AvatarName =
        user?.avatar && user.avatar in avatarMap
            ? (user.avatar as AvatarName)
            : "avatar3";

    const avatar = avatarMap[currentAvatar];

    return (
        <>
            <div className="flex w-full flex-col justify-center gap-2 px-2 py-4 pt-10">
                <div className="group relative w-fit rounded-full border-2 border-black dark:border-zinc-50">
                    <Image
                        className="h-20 w-20 lg:h-30 lg:w-30 rounded-full"
                        src={avatar}
                        alt={user?.name || "User"}
                        onClick={() => setChangeAvatar(true)}
                    />

                    <button
                        type="button"
                        onClick={() => setChangeAvatar(true)}
                        className="absolute inset-0 hidden items-center justify-center rounded-full bg-black/40 group-hover:flex"
                    >
                        <Pen className="h-6 w-6 fill-white text-white" />
                    </button>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-3xl font-semibold">
                        {user?.name}
                    </p>

                    <p className="w-fit rounded-2xl bg-zinc-100 px-2 text-[13px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                        {user?.email}
                    </p>
                </div>
            </div>

            <ChangeAvatar
                visible={changeAvatar}
                currentAvatar={currentAvatar}
                onClose={() => setChangeAvatar(false)}
            />
        </>
    );
}

export default UserInfo;