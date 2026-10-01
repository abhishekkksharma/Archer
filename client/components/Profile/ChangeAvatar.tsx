"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import {
    Avatar1,
    Avatar2,
    Avatar3,
    Avatar4,
    Avatar5,
} from "@/assets/Icons/avatars";
import { getToken } from "@/utils/cookie";
import { useUser } from "@/context/UserContext";
import { usePopup } from "../Popup/PopupContext";

const avatarMap = {
    avatar1: Avatar1,
    avatar2: Avatar2,
    avatar3: Avatar3,
    avatar4: Avatar4,
    avatar5: Avatar5,
} as const;

type AvatarName = keyof typeof avatarMap;

interface ChangeAvatarProps {
    visible: boolean;
    currentAvatar: AvatarName;
    onClose: () => void;
}

function ChangeAvatar({
    visible,
    currentAvatar,
    onClose,
}: ChangeAvatarProps) {
    const { user } = useUser();
    const { showPopup } = usePopup();

    const [selectedAvatar, setSelectedAvatar] =
        useState<AvatarName>(currentAvatar);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (visible) {
            setSelectedAvatar(currentAvatar);
            setError("");
        }
    }, [visible, currentAvatar]);

    if (!visible) return null;

    const handleSave = async () => {
        if (!user?.id) {
            setError("User not found");
            return;
        }

        const token = getToken();

        if (!token) {
            setError("Authentication token not found");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${user.id}/avatar`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        avatar: selectedAvatar,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update avatar"
                );
            }

            onClose();
            showPopup("Avatar changed successfully!", "success");

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error("Avatar update error:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to update avatar"
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 dark:bg-zinc-900">
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                            Change Avatar
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            Choose your new profile avatar
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="text-zinc-500 transition hover:text-zinc-900 disabled:opacity-50 dark:hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="grid grid-cols-5 gap-4">
                    {Object.entries(avatarMap).map(
                        ([name, avatar]) => {
                            const avatarName = name as AvatarName;
                            const isSelected =
                                selectedAvatar === avatarName;

                            return (
                                <button
                                    key={avatarName}
                                    type="button"
                                    disabled={saving}
                                    onClick={() =>
                                        setSelectedAvatar(avatarName)
                                    }
                                    className={`rounded-full border-2 p-1 transition hover:scale-105 disabled:cursor-not-allowed ${isSelected
                                            ? "border-black dark:border-white"
                                            : "border-transparent"
                                        }`}
                                >
                                    <Image
                                        src={avatar}
                                        alt={avatarName}
                                        className="h-14 w-14 rounded-full"
                                    />
                                </button>
                            );
                        }
                    )}
                </div>

                {error && (
                    <p className="mt-4 text-sm text-red-500">
                        {error}
                    </p>
                )}

                <button
                    type="button"
                    disabled={
                        saving ||
                        selectedAvatar === currentAvatar
                    }
                    onClick={handleSave}
                    className="mt-6 w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                    {saving ? "Saving..." : "Save Avatar"}
                </button>
            </div>
        </div>
    );
}

export default ChangeAvatar;