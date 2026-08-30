"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What is Archer?",
    answer:
      "Archer is an AI-powered system designer and project planning assistant that helps you turn ideas into well-structured software projects. Describe your idea, and Archer can help you plan the project, design its architecture, choose technologies, create development roadmaps, and guide you through the building process.",
  },
  {
    question: "What can I do with Archer?",
    answer:
      "Archer helps you plan and design software projects from the ground up. You can define your project requirements, design system architecture, plan your technology stack, generate development roadmaps, break projects into actionable tasks, and get AI assistance throughout the development process.",
  },
  {
    question: "Can Archer design the architecture of my project?",
    answer:
      "Yes. Archer is designed to help with system and software architecture. Based on your project's requirements, it can help you structure the system, identify major components, define how they interact, and make architectural decisions that fit your project's goals and scale.",
  },
  {
    question: "Can Archer create a roadmap for my project?",
    answer:
      "Yes. Archer can turn your project idea and architecture into a structured development roadmap. The roadmap helps break a large project into smaller phases, milestones, and actionable development steps so you have a clear path from idea to implementation.",
  },
  {
    question: "Do I need to be an expert in system design?",
    answer:
      "No. Archer is designed to be useful for developers at different experience levels. Whether you are a beginner planning your first serious project or an experienced developer working on a complex system, Archer can help explain architectural decisions, organize your ideas, and provide a structured starting point.",
  },
  {
    question: "Can I collaborate with others on a project?",
    answer:
      "Projects are currently designed around individual users. Collaboration and multi-user project access may be introduced in a future version of Archer to allow teams to work together on the same project and its architecture.",
  },
  {
    question: "Is Archer free to use?",
    answer:
      "Archer currently offers a free experience for planning and designing projects. As the platform evolves, additional advanced AI capabilities and features may be introduced through optional paid plans.",
  },
];

export default function FaqSection() {
  const [active, setActive] = useState<number | null>(0);

  return (
    <section className="bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl rounded-3xl p-8 md:p-14">
        <div className="grid gap-12 md:grid-cols-2">

          {/* Left */}
          <div className="max-w-sm">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-zinc-200">
              Frequently Asked Questions
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-500 dark:text-zinc-300">
              Find quick answers to common questions about our services and
              how to start your work.
            </p>
          </div>

          {/* Right */}
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = active === index;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 transition-colors dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setActive(isOpen ? null : index)
                    }
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="font-medium text-gray-900 dark:text-zinc-100">
                      {faq.question}
                    </span>

                    {isOpen ? (
                      <Minus className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                    ) : (
                      <Plus className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                    )}
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? "grid-rows-[1fr]"
                        : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-6 text-gray-600 dark:text-zinc-400">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}