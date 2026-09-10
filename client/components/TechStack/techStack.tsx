import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { getTechIcon } from "@/assets/tech-icons/tech-icons";

interface TechStackProps {
  name: string;
  description: string;
  onDelete?: () => void;
}

function TechStack({ name, description, onDelete }: TechStackProps) {
  const icon = getTechIcon(name);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete?.();
  };

  return (
    <div className="group relative w-fit">
      {/* Small card */}
      <div
        className="
          relative flex h-10 w-36 items-center gap-3
          rounded-md
          border border-zinc-200
          bg-white px-3 pr-6
          dark:border-zinc-800
          dark:bg-zinc-950
        "
      >
        {icon ? (
          <Image
            src={icon}
            alt={name}
            className="h-6 w-6 object-contain"
          />
        ) : (
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-purple-500/10 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">
            {name ? name.charAt(0) : "T"}
          </div>
        )}

        <p className="truncate text-xs font-medium text-zinc-900 dark:text-white capitalize">
          {name}
        </p>
      </div>

      {/* Hover overlay */}
      <div
        className="
          pointer-events-none
          absolute left-0 top-0 z-50
          w-64
          rounded-md
          border border-zinc-200
          bg-white p-4
          opacity-0
          shadow-lg
          transition-all duration-200
          group-hover:pointer-events-auto
          group-hover:opacity-100
          dark:border-zinc-700
          dark:bg-zinc-900
        "
      >
        {onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            title={`Delete ${name}`}
            aria-label={`Delete ${name}`}
            className="
              absolute right-1.5 top-1.5
              flex h-4 w-4 items-center justify-center
              rounded-full
              text-zinc-400
              opacity-0
              transition-all duration-150
              hover:bg-zinc-500 hover:text-white
              group-hover:opacity-100
              dark:text-zinc-500
              dark:hover:bg-zinc-600 dark:hover:text-white
            "
          >
            <X className="h-3 w-3" />
          </button>
        )}
        {/* Logo + title */}
        <div className="flex items-start gap-3">
          {icon ? (
            <Image
              src={icon}
              alt={name}
              className="h-8 w-8 shrink-0 object-contain"
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-purple-500/10 text-sm font-bold text-purple-600 dark:text-purple-400 uppercase">
              {name ? name.charAt(0) : "T"}
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white capitalize">
              {name}
            </p>

            <p className="mt-1 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechStack;