import React from "react";
import Image from "next/image";
import DashBoardIMG from "@/assets/dashboard.png";
import DAshBoardDarkImg from "@/assets/DashBoardDark.png";
import { ArrowRight } from "lucide-react"
import Link from "next/link";

function StartBuilding() {
  return (
    <section className="w-full px-6 sm:px-10 lg:px-20 py-14 flex flex-col justify-center gap-10 items-center">
      <div
        className="
          group
          w-full max-w-4xl
          overflow-hidden
          rounded-xl
          border border-zinc-200
          bg-white
          shadow-[0_20px_55px_rgba(8,110,200,0.20)]
          transition-all
          duration-700
          ease-[cubic-bezier(0.22,1,0.36,1)]
          hover:-translate-y-1
          hover:scale-[1.01]
          hover:shadow-[0_25px_70px_rgba(8,110,200,0.32)]
          dark:border-zinc-800
          dark:bg-zinc-950
          dark:shadow-[0_20px_55px_rgba(8,22,200,0.35)]
          dark:hover:shadow-[0_25px_75px_rgba(8,22,200,0.38)]
        "
      >
        {/* Window Header */}
        <div className="flex h-9 items-center border-b border-zinc-200 px-3 dark:border-zinc-800">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full border border-[#e0443e] bg-[#ff5f57] transition-transform duration-200 group-hover:scale-110" />
            <div className="h-2.5 w-2.5 rounded-full border border-[#e0a320] bg-[#febc2e] transition-transform duration-200 group-hover:scale-110" />
            <div className="h-2.5 w-2.5 rounded-full border border-[#1fa837] bg-[#28c840] transition-transform duration-200 group-hover:scale-110" />
          </div>
        </div>

        {/* Light Dashboard */}
        <div className="w-full overflow-hidden dark:hidden">
          <Image
            src={DashBoardIMG}
            alt="Archer dashboard"
            className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            priority
          />
        </div>

        {/* Dark Dashboard */}
        <div className="hidden w-full overflow-hidden dark:block">
          <Image
            src={DAshBoardDarkImg}
            alt="Archer dashboard dark mode"
            className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            priority
          />
        </div>
      </div>

      <div className="py-22">
        <Link
          href={'/dashboard'}
          className="
          group flex items-center gap-3
          rounded-full
          border border-blue-400/30
          bg-blue-600
          px-5 py-2.5
          text-sm font-medium text-white
          shadow-lg shadow-blue-950/30
          backdrop-blur-xl
          transition-all duration-300
          hover:bg-blue-700
          hover:border-blue-400
          hover:shadow-xl hover:shadow-blue-600/40
          active:scale-95
        "
        >
          <span>Start building now</span>

          <span
            className="
            flex h-7 w-7 items-center justify-center
            rounded-full bg-white
            transition-all duration-300
            group-hover:translate-x-1
          "
          >
            <ArrowRight
              size={16}
              className="
          text-blue-900
          transition-transform duration-300
          group-hover:translate-x-0.5
        "
            />
          </span>
        </Link>
      </div>
    </section>
  );
}

export default StartBuilding;