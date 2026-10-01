"use client";

import React, { useState } from "react";
import { User, FolderKanban, Coins } from "lucide-react";

function ProfileSidebar() {
  const [active, setActive] = useState("General");

  const items = [
    {
      name: "General",
      icon: User,
    },
    {
      name: "Projects",
      icon: FolderKanban,
    },
    {
      name: "Credits",
      icon: Coins,
    },
  ];

  return (
    <aside className="w-56">

      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.name;

          return (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-medium transition ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default ProfileSidebar;