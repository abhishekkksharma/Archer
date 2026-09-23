import React from "react";
import Image from "next/image";
import DashBoardIMG from "@/assets/dashboard.png";
import DAshBoardDarkImg from "@/assets/DashBoardDark.png";

function StartBuilding() {
  return (
    <section className="w-full px-6 sm:px-10 lg:px-20 py-14 flex justify-center">
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
    </section>
  );
}

export default StartBuilding;