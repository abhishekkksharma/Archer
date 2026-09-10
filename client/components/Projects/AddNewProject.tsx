"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { usePopup } from "@/components/Popup/PopupContext";
import {
  ChevronRight,
  Plus,
  Trash2,
  Check,
  Code2,
  Database,
  Server,
  Wrench,
  ArrowLeft,
  ArrowRight,
  Rocket,
  Bot,
  AlertCircle,
} from "lucide-react";

// Enums matching server/models/project.model.ts
export type ExperienceLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Expert";

export type ProjectStatus =
  | "Planning"
  | "In Progress"
  | "Completed"
  | "On Hold";

export interface TechItemInput {
  name: string;
  description: string;
  reason: string;
  alternatives: string;
}

export type TechCategory =
  | "frontend"
  | "backend"
  | "database"
  | "otherServices";

const PROJECT_TYPES = [
  "Web Application",
  "Full Stack Application",
  "Mobile Application",
  "Desktop Application",
  "API / Backend Service",
  "AI / ML Application",
  "CLI Tool",
  "Chrome Extension",
  "Game Development",
];

const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
];

// Preset suggestions for quick adding
export const PRESETS: Record<TechCategory, string[]> = {
  frontend: [
    "Next.js",
    "React",
    "Vue.js",
    "Svelte",
    "Tailwind CSS",
    "TypeScript",
    "Redux",
  ],
  backend: [
    "Node.js",
    "Express.js",
    "Python FastAPI",
    "Django",
    "Go (Golang)",
    "Java Spring Boot",
    "NestJS",
  ],
  database: [
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "Supabase",
    "Firebase Firestore",
    "SQLite",
  ],
  otherServices: [
    "Docker",
    "AWS S3",
    "Vercel",
    "Stripe",
    "Auth0",
    "Cloudflare",
    "GitHub Actions",
  ],
};

function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }

  return null;
}

function AddNewProject() {
  const { user } = useUser();
  const router = useRouter();
  const { showPopup } = usePopup();


  // Wizard Step state
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State - Project Details
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState<string>("Web Application");
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel>("Beginner");
  const [status, setStatus] = useState<ProjectStatus>("Planning");

  // Form State - Tech Stack Mode
  const [techStackMode, setTechStackMode] = useState<"manual" | "ai">("manual");

  // Tech Stack items state
  const [techStack, setTechStack] = useState<
    Record<TechCategory, TechItemInput[]>
  >({
    frontend: [
      {
        name: "Next.js",
        description: "React Framework",
        reason: "Server side rendering and modern routing",
        alternatives: "Remix",
      },
      {
        name: "Tailwind CSS",
        description: "Utility-first CSS",
        reason: "Rapid custom styling",
        alternatives: "Chakra UI",
      },
    ],
    backend: [
      {
        name: "Node.js",
        description: "JavaScript Runtime",
        reason: "High performance non-blocking I/O",
        alternatives: "Python",
      },
      {
        name: "Express.js",
        description: "Web Framework",
        reason: "Minimalist and flexible server setup",
        alternatives: "NestJS",
      },
    ],
    database: [
      {
        name: "MongoDB",
        description: "NoSQL Database",
        reason: "Flexible document-based schema",
        alternatives: "PostgreSQL",
      },
    ],
    otherServices: [
      {
        name: "Docker",
        description: "Containerization",
        reason: "Consistent development and deployment environment",
        alternatives: "Podman",
      },
    ],
  });

  // Active Category tab in Step 2
  const [activeCategory, setActiveCategory] =
    useState<TechCategory>("frontend");

  // New Tech Item Form inputs
  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemReason, setNewItemReason] = useState("");
  const [newItemAlternatives, setNewItemAlternatives] = useState("");

  // Loading & Error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add tech item handler
  const handleAddTechItem = (category: TechCategory, nameOverride?: string) => {
    const nameToAdd = nameOverride || newItemName.trim();

    if (!nameToAdd) return;

    // Avoid duplicates
    if (
      techStack[category].some(
        (item) => item.name.toLowerCase() === nameToAdd.toLowerCase(),
      )
    ) {
      return;
    }

    const newItem: TechItemInput = {
      name: nameToAdd,
      description: newItemDescription.trim() || nameToAdd,
      reason: newItemReason.trim() || "Chosen for application architecture",
      alternatives: newItemAlternatives.trim(),
    };

    setTechStack((prev) => ({
      ...prev,
      [category]: [...prev[category], newItem],
    }));

    if (!nameOverride) {
      setNewItemName("");
      setNewItemDescription("");
      setNewItemReason("");
      setNewItemAlternatives("");
    }
  };

  // Remove tech item handler
  const handleRemoveTechItem = (category: TechCategory, index: number) => {
    setTechStack((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  // Step Validation
  const validateStep1 = () => {
    if (!projectName.trim()) {
      setError("Please enter a project name.");
      return false;
    }

    if (!description.trim()) {
      setError("Please provide a project description.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setError(null);
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setError(null);

    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Final Form Submission
  const handleSubmitProject = async () => {
    setError(null);
    setLoading(true);

    try {
      const token =
        getCookie("token") || getCookie("auth_token") || getCookie("jwt");

      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

      // Prepare payload
      const formattedTechStack = {
        frontend: techStack.frontend.map((item) => ({
          name: item.name,
          description: item.description || item.name,
          reason: item.reason || "Selected for application stack",
          alternatives: item.alternatives
            ? item.alternatives.split(",").map((s) => s.trim())
            : [],
        })),

        backend: techStack.backend.map((item) => ({
          name: item.name,
          description: item.description || item.name,
          reason: item.reason || "Selected for application stack",
          alternatives: item.alternatives
            ? item.alternatives.split(",").map((s) => s.trim())
            : [],
        })),

        database: techStack.database.map((item) => ({
          name: item.name,
          description: item.description || item.name,
          reason: item.reason || "Selected for application stack",
          alternatives: item.alternatives
            ? item.alternatives.split(",").map((s) => s.trim())
            : [],
        })),

        authentication: [],

        otherServices: techStack.otherServices.map((item) => ({
          name: item.name,
          description: item.description || item.name,
          reason: item.reason || "Selected for application stack",
          alternatives: item.alternatives
            ? item.alternatives.split(",").map((s) => s.trim())
            : [],
        })),
      };

      const payload = {
        name: projectName.trim(),
        description: description.trim(),
        type: projectType,
        experienceLevel,
        status,
        techStackMode,
        techStack: formattedTechStack,
      };

      const response = await fetch(`${backendUrl}/project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const newId = data.project?._id || data.project?.id;

        if (newId) {
          showPopup("Project created successfully!", "success");
          router.push(`/project/${newId}`);
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(data.message || "Failed to create project. Please try again.");
      }
    } catch (err: any) {
      console.error("Create project error:", err);
      setError("An unexpected error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      number: 1,
      label: "Project details",
    },
    {
      number: 2,
      label: "Tech Stack",
    },
    {
      number: 3,
      label: "Review & Create",
    },
  ];

  const categories = [
    {
      key: "frontend" as TechCategory,
      label: "Frontend",
      icon: Code2,
    },
    {
      key: "backend" as TechCategory,
      label: "Backend",
      icon: Server,
    },
    {
      key: "database" as TechCategory,
      label: "Database",
      icon: Database,
    },
    {
      key: "otherServices" as TechCategory,
      label: "Other Services",
      icon: Wrench,
    },
  ];

  return (
    <div className="bg-zinc-50 dark:bg-black px-4 py-10 sm:px-6 lg:px-8 border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex w-full max-w-3xl flex-col justify-center">
        {/* STEP INDICATOR */}
        <div className="mb-7 flex items-center justify-center">
          <div className="flex items-center border rounded-lg border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-black">
            {steps.map((step, idx) => (
              <React.Fragment key={step.number}>
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-semibold transition-colors ${
                      currentStep === step.number
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : currentStep > step.number
                          ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-500"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      step.number
                    )}
                  </span>

                  <span
                    className={`hidden text-xs font-medium sm:block ${
                      currentStep === step.number
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-500 dark:text-zinc-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {idx < steps.length - 1 && (
                  <ChevronRight className="mx-2 h-3.5 w-3.5 text-zinc-300 dark:text-zinc-700" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="w-full border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-9">
          {/* ERROR */}
          {error && (
            <div className="mb-6 flex items-start gap-3 border border-zinc-200 bg-zinc-50 p-3.5 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-black dark:text-zinc-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>{error}</div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 1 */}
          {/* ========================================================= */}

          {currentStep === 1 && (
            <div className="space-y-7">
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-600">
                  Step 01
                </p>

                <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
                  Project details
                </h2>

                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
                  Provide the essential information about your project.
                </p>
              </div>

              <div className="space-y-5">
                {/* PROJECT NAME */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Project Name
                    <span className="ml-1 text-zinc-400">*</span>
                  </label>

                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. AI-Powered Portfolio Builder"
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-800 dark:bg-black dark:text-white dark:placeholder:text-zinc-700 dark:focus:border-zinc-400"
                    required
                  />
                </div>

                {/* DESCRIPTION */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Detailed Description
                    <span className="ml-1 text-zinc-400">*</span>
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your project idea, key goals, target audience, and primary features..."
                    rows={4}
                    className="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-800 dark:bg-black dark:text-white dark:placeholder:text-zinc-700 dark:focus:border-zinc-400"
                    required
                  />
                </div>

                {/* PROJECT TYPE + EXPERIENCE */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Project Type
                    </label>

                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full cursor-pointer rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none transition-colors focus:border-zinc-500 dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-zinc-400"
                    >
                      {PROJECT_TYPES.map((type) => (
                        <option
                          key={type}
                          value={type}
                          className="dark:bg-black"
                        >
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Experience Level
                    </label>

                    <select
                      value={experienceLevel}
                      onChange={(e) =>
                        setExperienceLevel(e.target.value as ExperienceLevel)
                      }
                      className="w-full cursor-pointer rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none transition-colors focus:border-zinc-500 dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-zinc-400"
                    >
                      {EXPERIENCE_LEVELS.map((level) => (
                        <option
                          key={level}
                          value={level}
                          className="dark:bg-black"
                        >
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 2 */}
          {/* ========================================================= */}

          {currentStep === 2 && (
            <div className="space-y-7">
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-600">
                  Step 02
                </p>

                <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
                  Choose your tech stack
                </h2>

                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
                  Configure the technologies used in your application.
                </p>
              </div>

              {/* MODE SELECTOR */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* MANUAL */}
                <button
                  type="button"
                  onClick={() => setTechStackMode("manual")}
                  className={`border p-4 text-left transition-colors ${
                    techStackMode === "manual"
                      ? "border-zinc-950 bg-zinc-50 dark:border-white dark:bg-black"
                      : "border-zinc-200 bg-white hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600"
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-white">
                      <Code2 className="h-4 w-4" />
                    </div>

                    {techStackMode === "manual" && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-black text-white dark:bg-white dark:text-black">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                    Manual Tech Stack
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-500">
                    Define your frontend, backend, database and services.
                  </p>
                </button>

                {/* AI */}
                <button
                  type="button"
                  onClick={() => setTechStackMode("ai")}
                  className={`border p-4 text-left transition-colors ${
                    techStackMode === "ai"
                      ? "border-zinc-950 bg-zinc-50 dark:border-white dark:bg-black"
                      : "border-zinc-200 bg-white hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600"
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-white">
                      <Bot className="h-4 w-4" />
                    </div>

                    <span className="border border-zinc-200 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
                      AI
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                    Let AI Choose
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-500">
                    Generate a recommended stack based on your project.
                  </p>
                </button>
              </div>

              {/* MANUAL TECH STACK */}
              {techStackMode === "manual" ? (
                <div className="space-y-5">
                  {/* CATEGORY TABS */}
                  <div className="flex overflow-x-auto border-b border-zinc-200 dark:border-zinc-800">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      const count = techStack[category.key].length;

                      return (
                        <button
                          key={category.key}
                          type="button"
                          onClick={() => setActiveCategory(category.key)}
                          className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-medium transition-colors ${
                            activeCategory === category.key
                              ? "border-black text-zinc-950 dark:border-white dark:text-white"
                              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />

                          <span>{category.label}</span>

                          {count > 0 && (
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-600">
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* CATEGORY CONTENT */}
                  <div className="space-y-4">
                    {/* POPULAR */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-600">
                        Popular
                      </span>

                      {PRESETS[activeCategory].map((preset) => {
                        const isAdded = techStack[activeCategory].some(
                          (item) =>
                            item.name.toLowerCase() === preset.toLowerCase(),
                        );

                        return (
                          <button
                            key={preset}
                            type="button"
                            disabled={isAdded}
                            onClick={() =>
                              handleAddTechItem(activeCategory, preset)
                            }
                            className={`flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                              isAdded
                                ? "cursor-default border-zinc-200 bg-zinc-100 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600"
                                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:bg-black dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white"
                            }`}
                          >
                            <Plus className="h-3 w-3" />
                            <span>{preset}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* CURRENT ITEMS */}
                    <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
                      {techStack[activeCategory].length === 0 ? (
                        <div className="border border-dashed border-zinc-200 py-8 text-center text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-600">
                          No {activeCategory} items added yet.
                        </div>
                      ) : (
                        techStack[activeCategory].map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-start justify-between gap-4 border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-black"
                          >
                            <div className="min-w-0 space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-semibold text-zinc-950 dark:text-white">
                                  {item.name}
                                </span>

                                {item.description &&
                                  item.description !== item.name && (
                                    <span className="text-xs text-zinc-400 dark:text-zinc-600">
                                      {item.description}
                                    </span>
                                  )}
                              </div>

                              {item.reason && (
                                <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-500">
                                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                    Why:
                                  </span>{" "}
                                  {item.reason}
                                </p>
                              )}

                              {item.alternatives && (
                                <p className="text-[11px] text-zinc-400 dark:text-zinc-600">
                                  Alternatives: {item.alternatives}
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveTechItem(activeCategory, idx)
                              }
                              className="shrink-0 p-1.5 text-zinc-400 transition-colors hover:text-zinc-950 dark:text-zinc-600 dark:hover:text-white"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* ADD CUSTOM TECHNOLOGY */}
                    <div className="border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-black">
                      <p className="mb-3 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        Add custom technology
                      </p>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <input
                          type="text"
                          placeholder="Technology name *"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          className="rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-xs text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-700 dark:focus:border-zinc-400"
                        />

                        <input
                          type="text"
                          placeholder="Role / Description"
                          value={newItemDescription}
                          onChange={(e) =>
                            setNewItemDescription(e.target.value)
                          }
                          className="rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-xs text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-700 dark:focus:border-zinc-400"
                        />

                        <input
                          type="text"
                          placeholder="Reason for choice"
                          value={newItemReason}
                          onChange={(e) => setNewItemReason(e.target.value)}
                          className="rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-xs text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-700 dark:focus:border-zinc-400"
                        />

                        <input
                          type="text"
                          placeholder="Alternatives, comma separated"
                          value={newItemAlternatives}
                          onChange={(e) =>
                            setNewItemAlternatives(e.target.value)
                          }
                          className="rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-xs text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-700 dark:focus:border-zinc-400"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddTechItem(activeCategory)}
                        disabled={!newItemName.trim()}
                        className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-md bg-black py-2.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Technology</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* AI MODE */
                <div className="border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-800 dark:bg-black">
                  <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-white">
                    <Bot className="h-5 w-5" />
                  </div>

                  <h4 className="text-sm font-semibold text-zinc-950 dark:text-white">
                    AI Tech Stack Generation
                  </h4>

                  <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-zinc-500 dark:text-zinc-500">
                    AI will analyze your project description and select suitable
                    technologies for the frontend, backend, database and
                    services.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3 */}
          {/* ========================================================= */}

          {currentStep === 3 && (
            <div className="space-y-7">
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-600">
                  Step 03
                </p>

                <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
                  Review & Create
                </h2>

                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
                  Confirm your details before creating the project.
                </p>
              </div>

              <div className="space-y-4">
                {/* PROJECT SUMMARY */}
                <div className="border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-black">
                  <div className="flex flex-col gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-600">
                        Project Name
                      </span>

                      <h3 className="mt-1 text-lg font-semibold text-zinc-950 dark:text-white">
                        {projectName}
                      </h3>
                    </div>

                    <span className="w-fit border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                      {experienceLevel}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 py-4 text-xs sm:grid-cols-2">
                    <div>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        Type
                      </span>

                      <p className="mt-1 text-zinc-500 dark:text-zinc-500">
                        {projectType}
                      </p>
                    </div>

                    <div>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        Status
                      </span>

                      <p className="mt-1 text-zinc-500 dark:text-zinc-500">
                        {status}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Description
                    </span>

                    <p className="mt-2 border border-zinc-200 bg-white p-3 text-xs leading-5 text-zinc-600 whitespace-pre-wrap dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                      {description}
                    </p>
                  </div>
                </div>

                {/* TECH STACK SUMMARY */}
                <div className="border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-black">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
                    <h4 className="text-sm font-semibold text-zinc-950 dark:text-white">
                      Configured Tech Stack
                    </h4>

                    <span className="text-[10px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-600">
                      {techStackMode === "ai" ? "AI Selection" : "Manual"}
                    </span>
                  </div>

                  {techStackMode === "ai" ? (
                    <p className="pt-4 text-xs leading-5 text-zinc-500 dark:text-zinc-500">
                      AI will automatically choose and populate tech stack items
                      after project creation.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-2.5 pt-4 sm:grid-cols-2">
                      {categories.map((category) => (
                        <div
                          key={category.key}
                          className="border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950"
                        >
                          <span className="block text-[10px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-600">
                            {category.label}
                          </span>

                          {techStack[category.key].length > 0 ? (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {techStack[category.key].map((item, i) => (
                                <span
                                  key={i}
                                  className="border border-zinc-200 bg-zinc-50 px-2 py-1 text-[10px] font-medium text-zinc-700 dark:border-zinc-800 dark:bg-black dark:text-zinc-300"
                                >
                                  {item.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="mt-2 block text-[11px] italic text-zinc-400 dark:text-zinc-700">
                              None specified
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* FOOTER */}
          {/* ========================================================= */}

          <div className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-5 dark:border-zinc-800">
            {/* BACK */}
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={loading}
                className="flex items-center gap-1.5 rounded-md border border-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {/* NEXT */}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="ml-auto flex items-center gap-1.5 rounded-md bg-black px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                <span>Next Step</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitProject}
                disabled={loading}
                className="ml-auto flex items-center gap-1.5 rounded-md bg-black px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                {loading ? (
                  <span>Creating Project...</span>
                ) : (
                  <>
                    <span>Create Project</span>
                    <Rocket className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddNewProject;
