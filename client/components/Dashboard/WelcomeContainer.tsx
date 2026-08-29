"use client";

import { useUser } from "@/context/UserContext";
import { Folder, CircleCheckBig, TrafficCone } from "lucide-react";

function WelcomeContainer() {
  const { user, loading } = useUser();
  const projects = user?.projects;

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in</p>;

  return (
    <div className="px-6 sm:px-8 md:px-[8%] lg:px-[10%] mt-18 flex flex-col gap-4 py-8 pb-2 border-t border-zinc-200 dark:border-zinc-800">
      
      {/* Welcome */}
      <div className="flex flex-col gap-2">
        <p className="text-slate-900 dark:text-zinc-100 text-2xl sm:text-3xl font-semibold">
          Welcome, {user.name.split(" ")[0]}!
        </p>

        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
          What's the agenda today
        </p>
      </div>

      {/* Stats */}
      <div className="text-slate-900 dark:text-zinc-200 grid grid-cols-2 gap-x-4 gap-y-8 py-6 sm:flex sm:flex-wrap sm:gap-10 lg:flex-nowrap lg:gap-16 lg:py-8">

  {/* Total Projects */}
  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
    <div className="group relative h-9 w-9 sm:h-12 sm:w-12 shrink-0">
      <Folder
        className="
          absolute left-1 top-0
          h-8 w-8 sm:h-10 sm:w-10
          fill-blue-300 text-blue-300
          transition-all duration-300
          group-hover:-translate-y-2
        "
      />

      <Folder
        className="
          absolute bottom-0 left-0
          h-8 w-8 sm:h-10 sm:w-10
          fill-blue-500 text-blue-500
          transition-all duration-300
          group-hover:translate-x-1
        "
      />
    </div>

    <div className="min-w-0 flex flex-col">
      <p className="font-semibold text-base sm:text-lg leading-tight">
        Total Projects
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base mt-1">
        {projects?.length ?? 0}
      </p>
    </div>
  </div>

  {/* Undergoing Projects */}
  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
    <TrafficCone className="w-8 h-8 sm:w-10 sm:h-10 shrink-0" />

    <div className="min-w-0 flex flex-col">
      <p className="font-semibold text-base sm:text-xl leading-tight">
        Undergoing Projects
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base mt-1">
        {projects?.length ?? 0}
      </p>
    </div>
  </div>

  {/* Completed Projects */}
  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
    <CircleCheckBig className="w-8 h-8 sm:w-10 sm:h-10 shrink-0" />

    <div className="min-w-0 flex flex-col">
      <p className="font-semibold text-base sm:text-lg leading-tight">
        Completed Projects
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base mt-1">
        0
      </p>
    </div>
  </div>

</div>
    </div>
  );
}

export default WelcomeContainer;