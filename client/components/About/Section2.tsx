"use client";

import React from "react";
import FolderFloat from "./FloatFolder";
import PlanIMG from "@/assets/plan.png";
import PlanDarkIMG from "@/assets/planDark.png";
import Image from "next/image";

function Section2() {
  return (
    <section className="w-full px-6 sm:px-10 lg:px-16 py-12 lg:py-20">
      <div className="max-w-5xl mx-auto min-h-[45vh] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

        {/* Left */}
        <div className="flex flex-col items-center lg:items-start">
          <div className="flex justify-center items-center w-full">
            <Image
              src={PlanIMG}
              alt="Planning with Archer"
              className="w-52 sm:w-60 lg:w-64 h-auto object-contain rounded-2xl dark:hidden"
              priority
            />

            <Image
              src={PlanDarkIMG}
              alt="Planning with Archer"
              className="hidden w-52 sm:w-60 lg:w-64 h-auto object-contain rounded-2xl dark:block"
              priority
            />
          </div>

          <div className="mt-5 flex items-center gap-3 sm:gap-6 text-2xl lg:text-4xl font-semibold tracking-tight">
            <p className="text-zinc-400">Imagine</p>

            {/* <span className="text-zinc-300 dark:text-zinc-700">/</span> */}

            <p className="text-zinc-500">Build</p>

            {/* <span className="text-zinc-300 dark:text-zinc-700">/</span> */}

            <p className="text-zinc-800 dark:text-zinc-200">Launch</p>
          </div>

          <p className="mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-zinc-500 dark:text-zinc-400 lg:text-left text-center">
            Turn your ideas into a structured development journey. Plan,
            build, track, and bring your vision to life with Archer.
          </p>
        </div>

        {/* Right */}
        <div className="flex justify-center items-center">
          <div className="flex flex-col items-center">
            <FolderFloat
              items={[
                "Create plan",
                "Check your progress",
                "Imagine and describe",
                "Create roadmaps",
              ]}
              label="Archer"
              sublabel="project"
              trigger="hover"
              closeOnSelect
              physics
              drift={0.5}
              onSelect={(value, index) => console.log(value, index)}
              folderColor="#2020d9"
              frontColor="#3d3d96"
              paperColor="#f5f5f5"
              itemColor="#f5f5f5"
              itemTextColor="#18181b"
              labelColor="#f5f5f5"
              width={280}
              height={220}
              radius={14}
              spread={180}
              lift={26}
              tilt={8}
              flapAngle={34}
              restAngle={16}
              openDuration={520}
              stagger={45}
              bounce={0.3}
            />

            <p className="mt-5 text-[11px] uppercase tracking-[0.25em] text-zinc-400">
              Your project, organized
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Section2;