import React from "react";
import { Lightbulb, LineSquiggle, Target, Rocket } from "lucide-react";

function HowWeWork() {
  const steps = [
    {
      step: "Step 1",
      title: "Describe Your Idea",
      description:
        "Enter your project concept in plain language.",
      icon: Lightbulb,
    },
    {
      step: "Step 2",
      title: "Archer Generates the Plan",
      description:
        "Get a tech stack, roadmap, tasks, and architecture generated automatically.",
      icon: LineSquiggle,
    },
    {
      step: "Step 3",
      title: "Track Your Progress",
      description:
        "Complete tasks and watch your project progress update in real-time.",
      icon: Target,
    },
    {
      step: "Step 4",
      title: "Ship Faster",
      description:
        "Follow the plan, ask the Archer assistant for guidance, and build with confidence.",
      icon: Rocket,
    },
  ];
  return (
    <section className="bg-white px-5 py-20 dark:bg-black sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-20 ">
      {/* Top Navigation / Heading */}
      <div className="mx-auto max-w-7xl">
        <div className="px-1 sm:px-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-3xl sm:gap-x-5 sm:text-4xl md:gap-x-6 md:text-5xl">
            <span className="font-serif italic dark:text-white">Imagine</span>

            <span className="font-bold dark:text-zinc-600 text-zinc-300">
              Build
            </span>

            <span className="font-bold dark:text-zinc-600 text-zinc-300">
              Launch
            </span>
          </div>

          <hr className="my-3 border-zinc-300 dark:border-zinc-700 sm:my-4" />
        </div>

        {/* Main Content */}
        <div className="mt-10 flex flex-col gap-8 px-1 sm:mt-12 sm:gap-10 sm:px-2 md:mt-16 md:gap-12 lg:mt-20 lg:flex-row lg:items-center lg:px-10">
          {/* Left */}
          <div className="w-full lg:w-1/2">
            <h2 className="p-0 text-4xl font-bold leading-tight text-zinc-900 dark:text-white sm:text-5xl md:text-6xl lg:p-4 lg:text-6xl xl:text-7xl">
              How we help people
            </h2>
          </div>

          {/* Right */}
          <div className="flex w-full flex-col gap-5 sm:gap-6 lg:w-1/2 lg:p-4">
            <p className="px-0 text-sm font-semibold leading-7 text-zinc-900 dark:text-zinc-100 sm:text-base sm:leading-8 lg:px-4">
              You have an idea in your head but can't figure out where to start
              or how to build it with a proper plan and architecture? We've got
              you covered. Archer helps you design complex software and organize
              your entire development journey in one place.
            </p>

            <p className="px-0 text-sm font-semibold leading-7 text-zinc-400 dark:text-zinc-400 sm:text-base sm:leading-8 lg:px-4">
              Archer helps you imagine beyond your limits without worrying about
              the execution plan. Just sit back, nurture new innovations in your
              head, and let us handle the hassle of designing and planning
              everything for you.
            </p>
          </div>
        </div>

        <section className="w-full bg-white px-4 py-12 my-16 dark:bg-black sm:px-6 sm:py-16 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {steps.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.step}
                    className="flex flex-col items-center text-center"
                  >
                    {/* Icon */}
                    <div
                      className="
                flex
                h-18
                w-18
                items-center
                justify-center
                rounded-xl
                text-zinc-900
                shadow-sm
                dark:text-white
              "
                    >
                      <Icon className="h-9 w-9" strokeWidth={2} />
                    </div>

                    {/* Step */}
                    <p className="mt-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {item.step}
                    </p>

                    {/* Title */}
                    <h3 className="mt-2 text-lg font-bold text-zinc-950 dark:text-white sm:text-xl">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default HowWeWork;
