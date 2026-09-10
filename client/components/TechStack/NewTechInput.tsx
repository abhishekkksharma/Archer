import React, { useEffect, useState } from "react";
import { X, Plus, Sparkles, Layers3, FileText, Lightbulb } from "lucide-react";
import { PRESETS } from "../Projects/AddNewProject";

export interface ITechItem {
  name: string;
  description: string;
  reason: string;
  alternatives: string[];
}

type TechCategory = keyof typeof PRESETS;

interface NewTechInputProps {
  projectId: string;
  onClose?: () => void;
  onAdd?: (tech: ITechItem & { category: TechCategory }) => void;
}

function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export const TECH_PRESET_DETAILS: Record<
  string,
  { description: string; reason: string; alternatives: string[] }
> = {
  "Next.js": {
    description:
      "A React framework for building fast, scalable web applications with server-side rendering, static generation, routing, and full-stack capabilities.",
    reason:
      "Chosen for its excellent performance, SEO support, file-based routing, and ability to build both frontend and full-stack applications in a single framework.",
    alternatives: ["React", "Remix", "Nuxt.js", "SvelteKit"],
  },
  React: {
    description:
      "A JavaScript library for building interactive and reusable user interfaces using component-based architecture.",
    reason:
      "Chosen for its flexible component model, large ecosystem, strong community support, and wide availability of libraries and tools.",
    alternatives: ["Vue.js", "Svelte", "Angular"],
  },
  "Vue.js": {
    description:
      "A progressive JavaScript framework for building user interfaces and single-page applications.",
    reason:
      "Chosen for its simple learning curve, reactive architecture, excellent documentation, and balanced approach to application development.",
    alternatives: ["React", "Svelte", "Angular"],
  },
  Svelte: {
    description:
      "A frontend framework that compiles components into optimized JavaScript during the build process.",
    reason:
      "Chosen for its minimal runtime overhead, simple syntax, excellent performance, and reduced amount of client-side code.",
    alternatives: ["React", "Vue.js", "SolidJS"],
  },
  "Tailwind CSS": {
    description:
      "A utility-first CSS framework that provides low-level utility classes for quickly building custom user interfaces.",
    reason:
      "Chosen for its rapid development workflow, consistent design system, responsive utilities, and easy customization.",
    alternatives: ["Bootstrap", "CSS Modules", "Material UI", "Styled Components"],
  },
  TypeScript: {
    description:
      "A strongly typed superset of JavaScript that adds static type checking and modern development features.",
    reason:
      "Chosen to improve code reliability, developer productivity, maintainability, and error detection during development.",
    alternatives: ["JavaScript", "Flow"],
  },
  Redux: {
    description:
      "A predictable state management library commonly used to manage and share application state across React applications.",
    reason:
      "Chosen when an application has complex global state that needs predictable updates, centralized management, and debugging support.",
    alternatives: ["Zustand", "MobX", "Recoil", "Jotai"],
  },
  "Node.js": {
    description:
      "A JavaScript runtime that allows developers to build scalable server-side applications using JavaScript.",
    reason:
      "Chosen for its non-blocking architecture, strong ecosystem, fast development workflow, and ability to use JavaScript across the entire stack.",
    alternatives: ["Deno", "Bun", "Python"],
  },
  "Express.js": {
    description:
      "A lightweight Node.js web framework for building APIs, web servers, and backend applications.",
    reason:
      "Chosen for its simplicity, flexibility, mature ecosystem, middleware support, and ease of building REST APIs.",
    alternatives: ["Fastify", "NestJS", "Koa.js"],
  },
  "Python FastAPI": {
    description:
      "A modern Python framework for building high-performance APIs with automatic validation and interactive API documentation.",
    reason:
      "Chosen for its performance, type-hint support, automatic OpenAPI documentation, and efficient API development experience.",
    alternatives: ["Django REST Framework", "Flask", "Django"],
  },
  Django: {
    description:
      "A high-level Python web framework that provides built-in tools for developing secure and scalable web applications.",
    reason:
      "Chosen for its batteries-included approach, built-in authentication, ORM, admin interface, security features, and rapid development capabilities.",
    alternatives: ["FastAPI", "Flask", "Laravel", "Ruby on Rails"],
  },
  "Go (Golang)": {
    description:
      "A statically typed compiled programming language designed for efficient, reliable, and concurrent backend systems.",
    reason:
      "Chosen for its high performance, lightweight concurrency model, fast compilation, and suitability for scalable backend services.",
    alternatives: ["Rust", "Java", "Node.js", "C#"],
  },
  "Java Spring Boot": {
    description:
      "A Java framework for building production-ready backend applications and REST APIs with minimal configuration.",
    reason:
      "Chosen for its enterprise-grade capabilities, strong ecosystem, security support, scalability, and mature development tools.",
    alternatives: ["Quarkus", "Micronaut", "Jakarta EE", "NestJS"],
  },
  NestJS: {
    description:
      "A progressive Node.js framework for building scalable server-side applications using TypeScript and modular architecture.",
    reason:
      "Chosen for its structured architecture, dependency injection, TypeScript support, scalability, and strong conventions for large applications.",
    alternatives: ["Express.js", "Fastify", "AdonisJS"],
  },
  MongoDB: {
    description:
      "A document-oriented NoSQL database that stores data in flexible JSON-like documents.",
    reason:
      "Chosen for its flexible schema, easy horizontal scaling, developer-friendly document model, and suitability for rapidly changing data structures.",
    alternatives: ["PostgreSQL", "CouchDB", "Firebase Firestore"],
  },
  PostgreSQL: {
    description:
      "A powerful open-source relational database known for reliability, advanced SQL features, and strong data integrity.",
    reason:
      "Chosen for its reliability, ACID compliance, powerful querying capabilities, extensibility, and support for complex relational data.",
    alternatives: ["MySQL", "MariaDB", "SQLite"],
  },
  MySQL: {
    description:
      "A widely used open-source relational database management system based on SQL.",
    reason:
      "Chosen for its reliability, performance, mature ecosystem, ease of use, and widespread support across hosting platforms.",
    alternatives: ["PostgreSQL", "MariaDB", "SQLite"],
  },
  Redis: {
    description:
      "An in-memory data store commonly used for caching, sessions, queues, real-time data, and fast key-value operations.",
    reason:
      "Chosen when extremely fast data access, caching, session management, or temporary application state is required.",
    alternatives: ["Memcached", "KeyDB", "Dragonfly"],
  },
  Supabase: {
    description:
      "An open-source backend platform built around PostgreSQL that provides database, authentication, storage, and real-time features.",
    reason:
      "Chosen for quickly building applications with PostgreSQL while getting authentication, storage, APIs, and real-time functionality with minimal backend setup.",
    alternatives: ["Firebase", "Appwrite", "Neon"],
  },
  "Firebase Firestore": {
    description:
      "A cloud-hosted NoSQL document database provided by Firebase for storing and synchronizing application data.",
    reason:
      "Chosen for its real-time synchronization, easy integration with frontend applications, serverless architecture, and seamless Firebase ecosystem.",
    alternatives: ["MongoDB", "Supabase", "Realtime Database"],
  },
  SQLite: {
    description:
      "A lightweight embedded relational database that stores the complete database in a single file.",
    reason:
      "Chosen for applications that need a simple, portable, zero-configuration relational database without a separate database server.",
    alternatives: ["PostgreSQL", "MySQL", "DuckDB"],
  },
  Docker: {
    description:
      "A containerization platform used to package applications and their dependencies into portable and isolated environments.",
    reason:
      "Chosen to ensure consistent development and deployment environments, simplify dependency management, and improve application portability.",
    alternatives: ["Podman", "containerd", "Kubernetes"],
  },
  "AWS S3": {
    description:
      "A scalable cloud object storage service used to store files, media, backups, documents, and other unstructured data.",
    reason:
      "Chosen for its scalability, durability, security controls, storage flexibility, and integration with other AWS services.",
    alternatives: ["Google Cloud Storage", "Azure Blob Storage", "Cloudflare R2"],
  },
  Vercel: {
    description:
      "A cloud platform optimized for deploying and hosting modern frontend and full-stack web applications.",
    reason:
      "Chosen for its seamless Git integration, global deployment infrastructure, preview environments, serverless capabilities, and strong Next.js support.",
    alternatives: ["Netlify", "AWS Amplify", "Cloudflare Pages"],
  },
  Stripe: {
    description:
      "A payment processing platform that provides APIs and tools for accepting online payments and managing financial transactions.",
    reason:
      "Chosen for its developer-friendly APIs, broad payment support, subscription capabilities, and strong documentation.",
    alternatives: ["PayPal", "Razorpay", "Adyen"],
  },
  Auth0: {
    description:
      "An identity and access management platform that provides authentication, authorization, and user identity services.",
    reason:
      "Chosen to implement secure authentication without building and maintaining a complete identity system from scratch.",
    alternatives: ["Clerk", "Firebase Authentication", "Supabase Auth", "Amazon Cognito"],
  },
  Cloudflare: {
    description:
      "A global cloud platform providing CDN, DNS, security, edge computing, networking, and application performance services.",
    reason:
      "Chosen for its global network, DDoS protection, CDN capabilities, DNS management, and edge-based application services.",
    alternatives: ["AWS CloudFront", "Fastly", "Akamai"],
  },
  "GitHub Actions": {
    description:
      "A CI/CD automation platform integrated with GitHub for automatically building, testing, and deploying applications.",
    reason:
      "Chosen for its direct GitHub integration, flexible workflow automation, reusable actions, and support for automated software delivery.",
    alternatives: ["GitLab CI/CD", "Jenkins", "CircleCI", "Azure Pipelines"],
  },
};

function NewTechInput({
  projectId,
  onClose,
  onAdd,
}: NewTechInputProps) {
  const [category, setCategory] = useState<TechCategory>("frontend");
  const [selectedTech, setSelectedTech] = useState("");
  const [customTech, setCustomTech] = useState("");

  const [description, setDescription] = useState("");
  const [reason, setReason] = useState("");
  const [alternatives, setAlternatives] = useState("");
  const [loading, setLoading] = useState(false);

  const isCustom = selectedTech === "custom";
  const techName = isCustom ? customTech.trim() : selectedTech;

  /* Close modal with Escape */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCategory(e.target.value as TechCategory);
    setSelectedTech("");
    setCustomTech("");
    setDescription("");
    setReason("");
    setAlternatives("");
  };

  const handleTechSelectChange = (val: string) => {
    setSelectedTech(val);
    if (val && val !== "custom" && TECH_PRESET_DETAILS[val]) {
      const preset = TECH_PRESET_DETAILS[val];
      setDescription(preset.description);
      setReason(preset.reason);
      setAlternatives(preset.alternatives.join(", "));
    } else if (val === "custom") {
      setDescription("");
      setReason("");
      setAlternatives("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!techName) return;

    setLoading(true);

    const presetInfo = TECH_PRESET_DETAILS[techName];
    const finalDescription =
      description.trim() ||
      presetInfo?.description ||
      `${techName} technology component.`;
    const finalReason =
      reason.trim() || presetInfo?.reason || "Selected for application stack";
    const finalAlternatives = alternatives.trim()
      ? alternatives
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : presetInfo?.alternatives || [];

    const tech: ITechItem & { category: TechCategory } = {
      name: techName,
      description: finalDescription,
      reason: finalReason,
      alternatives: finalAlternatives,
      category,
    };

    try {
      if (projectId) {
        const token =
          getCookie("token") ||
          getCookie("auth_token") ||
          getCookie("jwt") ||
          (typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null);

        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

        const res = await fetch(`${backendUrl}/project/${projectId}/tech-stack`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            category,
            name: tech.name,
            description: tech.description,
            reason: tech.reason,
            alternatives: tech.alternatives,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          console.warn("Backend tech stack append warning:", errData.message);
        }
      }
    } catch (err) {
      console.error("Failed to append tech stack to backend:", err);
    } finally {
      setLoading(false);
      onAdd?.(tech);
    }
  };

  const alternativeList = alternatives
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="
          absolute inset-0
          bg-zinc-950/40
          backdrop-blur-[6px]
          transition-opacity
          dark:bg-black/65
        "
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="
          relative z-10
          flex w-full max-w-2xl
          max-h-[90vh]
          flex-col
          overflow-hidden
          rounded-2xl
          border border-zinc-200/80
          bg-white
          shadow-[0_24px_80px_-20px_rgba(0,0,0,0.25)]
          animate-in fade-in zoom-in-[0.98] duration-200

          dark:border-zinc-800
          dark:bg-zinc-950
          dark:shadow-[0_24px_80px_-20px_rgba(0,0,0,0.7)]
        "
      >
        {/* Top accent */}
        <div className="h-[2px] w-full bg-gradient-to-r from-zinc-300 via-zinc-700 to-zinc-300 dark:from-zinc-800 dark:via-zinc-400 dark:to-zinc-800" />

        {/* Header */}
        <div
          className="
            flex shrink-0 items-start justify-between
            border-b border-zinc-200/80
            px-6 py-5
            dark:border-zinc-800
          "
        >
          <div className="flex items-start gap-3.5">
            <div
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-xl
                border border-zinc-200
                bg-zinc-50
                text-zinc-700
                shadow-sm
                dark:border-zinc-800
                dark:bg-zinc-900
                dark:text-zinc-200
              "
            >
              <Layers3 className="h-[18px] w-[18px]" />
            </div>

            <div>
              <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-zinc-950 dark:text-white">
                Add Technology
              </h2>

              <p className="mt-1 text-[12px] leading-5 text-zinc-500 dark:text-zinc-400">
                Add a technology and describe its role in your project stack.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="
              flex h-8 w-8 items-center justify-center
              rounded-lg
              text-zinc-400
              transition-all
              hover:bg-zinc-100
              hover:text-zinc-900
              active:scale-95
              dark:hover:bg-zinc-900
              dark:hover:text-white
            "
          >
            <X className="h-[17px] w-[17px]" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto"
        >
          <div className="space-y-6 px-6 py-6">

            {/* Technology selection */}
            <section>
              <div className="mb-3">

                <h3 className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">
                  Technology
                </h3>
                <p className="mt-1 ml- text-[11px] text-zinc-500 dark:text-zinc-500">
                  Choose where this technology belongs in your stack.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="
                      mb-1.5 block
                      text-[11px] font-medium
                      uppercase tracking-wide
                      text-zinc-500
                      dark:text-zinc-500
                    "
                  >
                    Category
                  </label>

                  <select
                    id="category"
                    value={category}
                    onChange={handleCategoryChange}
                    className="
                      h-10 w-full
                      appearance-none
                      rounded-lg
                      border border-zinc-200
                      bg-zinc-50
                      px-3
                      text-[13px]
                      text-zinc-900
                      outline-none
                      transition-all
                      hover:border-zinc-300
                      focus:border-zinc-500
                      focus:bg-white
                      focus:ring-2
                      focus:ring-zinc-200/70

                      dark:border-zinc-800
                      dark:bg-zinc-900/70
                      dark:text-zinc-100
                      dark:hover:border-zinc-700
                      dark:focus:border-zinc-600
                      dark:focus:bg-zinc-900
                      dark:focus:ring-zinc-800
                    "
                  >
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="database">Database</option>
                    <option value="otherServices">Other Services</option>
                  </select>
                </div>

                {/* Technology */}
                <div>
                  <label
                    htmlFor="technology"
                    className="
                      mb-1.5 block
                      text-[11px] font-medium
                      uppercase tracking-wide
                      text-zinc-500
                      dark:text-zinc-500
                    "
                  >
                    Technology
                  </label>

                  <select
                    id="technology"
                    value={selectedTech}
                    onChange={(e) => handleTechSelectChange(e.target.value)}
                    className="
                      h-10 w-full
                      appearance-none
                      rounded-lg
                      border border-zinc-200
                      bg-zinc-50
                      px-3
                      text-[13px]
                      text-zinc-900
                      outline-none
                      transition-all
                      hover:border-zinc-300
                      focus:border-zinc-500
                      focus:bg-white
                      focus:ring-2
                      focus:ring-zinc-200/70

                      dark:border-zinc-800
                      dark:bg-zinc-900/70
                      dark:text-zinc-100
                      dark:hover:border-zinc-700
                      dark:focus:border-zinc-600
                      dark:focus:bg-zinc-900
                      dark:focus:ring-zinc-800
                    "
                  >
                    <option value="">Select a technology</option>

                    {PRESETS[category].map((tech) => (
                      <option key={tech} value={tech}>
                        {tech}
                      </option>
                    ))}

                    <option value="custom">Custom Technology</option>
                  </select>
                </div>
              </div>

              {/* Custom technology */}
              {isCustom && (
                <div className="mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
                  <label
                    htmlFor="customTechnology"
                    className="
                      mb-1.5 block
                      text-[11px] font-medium
                      uppercase tracking-wide
                      text-zinc-500
                    "
                  >
                    Custom Technology
                  </label>

                  <input
                    id="customTechnology"
                    type="text"
                    value={customTech}
                    onChange={(e) => setCustomTech(e.target.value)}
                    placeholder="e.g. Astro"
                    autoFocus
                    className="
                      h-10 w-full
                      rounded-lg
                      border border-zinc-200
                      bg-zinc-50
                      px-3
                      text-[13px]
                      text-zinc-900
                      placeholder:text-zinc-400
                      outline-none
                      transition-all
                      hover:border-zinc-300
                      focus:border-zinc-500
                      focus:bg-white
                      focus:ring-2
                      focus:ring-zinc-200/70

                      dark:border-zinc-800
                      dark:bg-zinc-900/70
                      dark:text-zinc-100
                      dark:placeholder:text-zinc-600
                      dark:focus:border-zinc-600
                      dark:focus:bg-zinc-900
                      dark:focus:ring-zinc-800
                    "
                  />
                </div>
              )}
            </section>

            {/* Divider */}
            <div className="h-px bg-zinc-100 dark:bg-zinc-900" />

            {/* Details */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <span
                  className="
                    flex h-6 w-6 items-center justify-center
                    rounded-md
                    bg-zinc-100
                    text-zinc-600
                    dark:bg-zinc-900
                    dark:text-zinc-300
                  "
                >
                  <FileText className="h-3.5 w-3.5" />
                </span>

                <div>
                  <h3 className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">
                    Technology Details
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="
                      mb-1.5 block
                      text-[11px] font-medium
                      uppercase tracking-wide
                      text-zinc-500
                    "
                  >
                    Description
                  </label>

                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is this technology used for?"
                    rows={3}
                    className="
                      w-full resize-none
                      rounded-lg
                      border border-zinc-200
                      bg-zinc-50
                      px-3 py-2.5
                      text-[13px]
                      leading-5
                      text-zinc-900
                      placeholder:text-zinc-400
                      outline-none
                      transition-all
                      hover:border-zinc-300
                      focus:border-zinc-500
                      focus:bg-white
                      focus:ring-2
                      focus:ring-zinc-200/70

                      dark:border-zinc-800
                      dark:bg-zinc-900/70
                      dark:text-zinc-100
                      dark:placeholder:text-zinc-600
                      dark:focus:border-zinc-600
                      dark:focus:bg-zinc-900
                      dark:focus:ring-zinc-800
                    "
                  />

                  <p className="mt-1.5 text-[10px] text-zinc-400 dark:text-zinc-600">
                    Keep it short and focused on the technology's role.
                  </p>
                </div>

                {/* Reason */}
                <div>
                  <label
                    htmlFor="reason"
                    className="
                      mb-1.5 flex items-center gap-1.5
                      text-[11px] font-medium
                      uppercase tracking-wide
                      text-zinc-500
                    "
                  >
                    <Lightbulb className="h-3 w-3" />
                    Reason for Choosing
                  </label>

                  <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Why are you using this technology?"
                    rows={3}
                    className="
                      w-full resize-none
                      rounded-lg
                      border border-zinc-200
                      bg-zinc-50
                      px-3 py-2.5
                      text-[13px]
                      leading-5
                      text-zinc-900
                      placeholder:text-zinc-400
                      outline-none
                      transition-all
                      hover:border-zinc-300
                      focus:border-zinc-500
                      focus:bg-white
                      focus:ring-2
                      focus:ring-zinc-200/70

                      dark:border-zinc-800
                      dark:bg-zinc-900/70
                      dark:text-zinc-100
                      dark:placeholder:text-zinc-600
                      dark:focus:border-zinc-600
                      dark:focus:bg-zinc-900
                      dark:focus:ring-zinc-800
                    "
                  />
                </div>

                {/* Alternatives */}
                <div>
                  <label
                    htmlFor="alternatives"
                    className="
                      mb-1.5 block
                      text-[11px] font-medium
                      uppercase tracking-wide
                      text-zinc-500
                    "
                  >
                    Alternatives
                  </label>

                  <input
                    id="alternatives"
                    type="text"
                    value={alternatives}
                    onChange={(e) => setAlternatives(e.target.value)}
                    placeholder="React, Vue.js, Svelte"
                    className="
                      h-10 w-full
                      rounded-lg
                      border border-zinc-200
                      bg-zinc-50
                      px-3
                      text-[13px]
                      text-zinc-900
                      placeholder:text-zinc-400
                      outline-none
                      transition-all
                      hover:border-zinc-300
                      focus:border-zinc-500
                      focus:bg-white
                      focus:ring-2
                      focus:ring-zinc-200/70

                      dark:border-zinc-800
                      dark:bg-zinc-900/70
                      dark:text-zinc-100
                      dark:placeholder:text-zinc-600
                      dark:focus:border-zinc-600
                      dark:focus:bg-zinc-900
                      dark:focus:ring-zinc-800
                    "
                  />

                  {/* Alternative chips */}
                  {alternativeList.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {alternativeList.map((item, index) => (
                        <span
                          key={`${item}-${index}`}
                          className="
                            rounded-md
                            border border-zinc-200
                            bg-zinc-50
                            px-2 py-1
                            text-[10px]
                            font-medium
                            text-zinc-600

                            dark:border-zinc-800
                            dark:bg-zinc-900
                            dark:text-zinc-400
                          "
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div
            className="
              flex shrink-0 items-center justify-between
              border-t border-zinc-200/80
              bg-zinc-50/70
              px-6 py-4

              dark:border-zinc-800
              dark:bg-zinc-950
            "
          >
            <p className="hidden text-[10px] text-zinc-400 sm:block">
              Press <kbd className="font-medium">Esc</kbd> to close
            </p>

            <div className="flex w-full justify-end gap-2 sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="
                  h-9
                  rounded-lg
                  border border-zinc-200
                  bg-white
                  px-4
                  text-[12px]
                  font-medium
                  text-zinc-600
                  transition-all
                  hover:border-zinc-300
                  hover:bg-zinc-50
                  hover:text-zinc-900
                  active:scale-[0.98]

                  dark:border-zinc-800
                  dark:bg-zinc-900
                  dark:text-zinc-400
                  dark:hover:border-zinc-700
                  dark:hover:bg-zinc-800
                  dark:hover:text-zinc-100
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!techName || loading}
                className="
                  inline-flex h-9
                  items-center justify-center
                  gap-1.5
                  rounded-lg
                  bg-zinc-950
                  px-4
                  text-[12px]
                  font-medium
                  text-white
                  shadow-sm
                  transition-all
                  hover:bg-zinc-800
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-40

                  dark:bg-white
                  dark:text-zinc-950
                  dark:hover:bg-zinc-200
                "
              >
                <Plus className="h-3.5 w-3.5" />
                {loading ? "Adding..." : "Add Technology"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewTechInput;