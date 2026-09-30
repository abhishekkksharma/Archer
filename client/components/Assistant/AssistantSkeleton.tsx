"use client";

import React from "react";

export default function AssistantSkeleton() {
  return (
    <div className="w-full py-2 animate-fadeIn">
      <div className="flex w-full justify-start">
        <div className="w-full max-w-[85%] sm:max-w-[75%] lg:max-w-[80%] space-y-3">
          <div className="h-3.5 w-32 rounded bg-zinc-200/80 animate-pulse dark:bg-zinc-800/80" />

          <div className="space-y-2">
            <div className="h-3 w-[90%] rounded bg-zinc-200/70 animate-pulse dark:bg-zinc-800/70" />
            <div className="h-3 w-[75%] rounded bg-zinc-200/70 animate-pulse dark:bg-zinc-800/70" />
            <div className="h-3 w-[45%] rounded bg-zinc-200/70 animate-pulse dark:bg-zinc-800/70" />
          </div>
        </div>
      </div>
    </div>
  );
}