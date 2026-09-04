"use client";

import React from "react";
import { motion } from "framer-motion";

interface IProgress {
  progress: number;
}

function ProgressBar({ progress }: IProgress) {
  const value = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="mb-2.5">
      <div className="flex justify-between items-center text-sm mb-1.5">
        <span className="text-zinc-500 dark:text-zinc-500">
          Progress
        </span>

        <span className="text-slate-800 dark:text-zinc-200 font-medium">
          {value}%
        </span>
      </div>

      <div className="h-1 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: `${value}%`,
          }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="h-full rounded-full bg-blue-600 dark:bg-blue-500"
        />
      </div>
    </div>
  );
}

export default ProgressBar;