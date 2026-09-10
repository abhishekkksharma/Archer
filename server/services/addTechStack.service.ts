import { TechStack, ITechStack } from "../models/techStack.model";
import { Project } from "../models/project.model";

export type TechCategory =
  | "frontend"
  | "backend"
  | "database"
  | "authentication"
  | "otherServices";
  
export interface ITechPreset {
  name: string;
  description: string;
  reason: string;
  alternatives: string[];
}

export const PRESETS: Record<TechCategory, ITechPreset[]> = {
  frontend: [
    {
      name: "Next.js",
      description:
        "A React framework for building fast, scalable web applications with server-side rendering, static generation, routing, and full-stack capabilities.",
      reason:
        "Chosen for its excellent performance, SEO support, file-based routing, and ability to build both frontend and full-stack applications in a single framework.",
      alternatives: ["React", "Remix", "Nuxt.js", "SvelteKit"],
    },
    {
      name: "React",
      description:
        "A JavaScript library for building interactive and reusable user interfaces using component-based architecture.",
      reason:
        "Chosen for its flexible component model, large ecosystem, strong community support, and wide availability of libraries and tools.",
      alternatives: ["Vue.js", "Svelte", "Angular"],
    },
    {
      name: "Vue.js",
      description:
        "A progressive JavaScript framework for building user interfaces and single-page applications.",
      reason:
        "Chosen for its simple learning curve, reactive architecture, excellent documentation, and balanced approach to application development.",
      alternatives: ["React", "Svelte", "Angular"],
    },
    {
      name: "Svelte",
      description:
        "A frontend framework that compiles components into optimized JavaScript during the build process.",
      reason:
        "Chosen for its minimal runtime overhead, simple syntax, excellent performance, and reduced amount of client-side code.",
      alternatives: ["React", "Vue.js", "SolidJS"],
    },
    {
      name: "Tailwind CSS",
      description:
        "A utility-first CSS framework that provides low-level utility classes for quickly building custom user interfaces.",
      reason:
        "Chosen for its rapid development workflow, consistent design system, responsive utilities, and easy customization.",
      alternatives: ["Bootstrap", "CSS Modules", "Material UI", "Styled Components"],
    },
    {
      name: "TypeScript",
      description:
        "A strongly typed superset of JavaScript that adds static type checking and modern development features.",
      reason:
        "Chosen to improve code reliability, developer productivity, maintainability, and error detection during development.",
      alternatives: ["JavaScript", "Flow"],
    },
    {
      name: "Redux",
      description:
        "A predictable state management library commonly used to manage and share application state across React applications.",
      reason:
        "Chosen when an application has complex global state that needs predictable updates, centralized management, and debugging support.",
      alternatives: ["Zustand", "MobX", "Recoil", "Jotai"],
    },
  ],

  backend: [
    {
      name: "Node.js",
      description:
        "A JavaScript runtime that allows developers to build scalable server-side applications using JavaScript.",
      reason:
        "Chosen for its non-blocking architecture, strong ecosystem, fast development workflow, and ability to use JavaScript across the entire stack.",
      alternatives: ["Deno", "Bun", "Python"],
    },
    {
      name: "Express.js",
      description:
        "A lightweight Node.js web framework for building APIs, web servers, and backend applications.",
      reason:
        "Chosen for its simplicity, flexibility, mature ecosystem, middleware support, and ease of building REST APIs.",
      alternatives: ["Fastify", "NestJS", "Koa.js"],
    },
    {
      name: "Python FastAPI",
      description:
        "A modern Python framework for building high-performance APIs with automatic validation and interactive API documentation.",
      reason:
        "Chosen for its performance, type-hint support, automatic OpenAPI documentation, and efficient API development experience.",
      alternatives: ["Django REST Framework", "Flask", "Django"],
    },
    {
      name: "Django",
      description:
        "A high-level Python web framework that provides built-in tools for developing secure and scalable web applications.",
      reason:
        "Chosen for its batteries-included approach, built-in authentication, ORM, admin interface, security features, and rapid development capabilities.",
      alternatives: ["FastAPI", "Flask", "Laravel", "Ruby on Rails"],
    },
    {
      name: "Go (Golang)",
      description:
        "A statically typed compiled programming language designed for efficient, reliable, and concurrent backend systems.",
      reason:
        "Chosen for its high performance, lightweight concurrency model, fast compilation, and suitability for scalable backend services.",
      alternatives: ["Rust", "Java", "Node.js", "C#"],
    },
    {
      name: "Java Spring Boot",
      description:
        "A Java framework for building production-ready backend applications and REST APIs with minimal configuration.",
      reason:
        "Chosen for its enterprise-grade capabilities, strong ecosystem, security support, scalability, and mature development tools.",
      alternatives: ["Quarkus", "Micronaut", "Jakarta EE", "NestJS"],
    },
    {
      name: "NestJS",
      description:
        "A progressive Node.js framework for building scalable server-side applications using TypeScript and modular architecture.",
      reason:
        "Chosen for its structured architecture, dependency injection, TypeScript support, scalability, and strong conventions for large applications.",
      alternatives: ["Express.js", "Fastify", "AdonisJS"],
    },
  ],

  database: [
    {
      name: "MongoDB",
      description:
        "A document-oriented NoSQL database that stores data in flexible JSON-like documents.",
      reason:
        "Chosen for its flexible schema, easy horizontal scaling, developer-friendly document model, and suitability for rapidly changing data structures.",
      alternatives: ["PostgreSQL", "CouchDB", "Firebase Firestore"],
    },
    {
      name: "PostgreSQL",
      description:
        "A powerful open-source relational database known for reliability, advanced SQL features, and strong data integrity.",
      reason:
        "Chosen for its reliability, ACID compliance, powerful querying capabilities, extensibility, and support for complex relational data.",
      alternatives: ["MySQL", "MariaDB", "SQLite"],
    },
    {
      name: "MySQL",
      description:
        "A widely used open-source relational database management system based on SQL.",
      reason:
        "Chosen for its reliability, performance, mature ecosystem, ease of use, and widespread support across hosting platforms.",
      alternatives: ["PostgreSQL", "MariaDB", "SQLite"],
    },
    {
      name: "Redis",
      description:
        "An in-memory data store commonly used for caching, sessions, queues, real-time data, and fast key-value operations.",
      reason:
        "Chosen when extremely fast data access, caching, session management, or temporary application state is required.",
      alternatives: ["Memcached", "KeyDB", "Dragonfly"],
    },
    {
      name: "Supabase",
      description:
        "An open-source backend platform built around PostgreSQL that provides database, authentication, storage, and real-time features.",
      reason:
        "Chosen for quickly building applications with PostgreSQL while getting authentication, storage, APIs, and real-time functionality with minimal backend setup.",
      alternatives: ["Firebase", "Appwrite", "Neon"],
    },
    {
      name: "Firebase Firestore",
      description:
        "A cloud-hosted NoSQL document database provided by Firebase for storing and synchronizing application data.",
      reason:
        "Chosen for its real-time synchronization, easy integration with frontend applications, serverless architecture, and seamless Firebase ecosystem.",
      alternatives: ["MongoDB", "Supabase", "Realtime Database"],
    },
    {
      name: "SQLite",
      description:
        "A lightweight embedded relational database that stores the complete database in a single file.",
      reason:
        "Chosen for applications that need a simple, portable, zero-configuration relational database without a separate database server.",
      alternatives: ["PostgreSQL", "MySQL", "DuckDB"],
    },
  ],

  otherServices: [
    {
      name: "Docker",
      description:
        "A containerization platform used to package applications and their dependencies into portable and isolated environments.",
      reason:
        "Chosen to ensure consistent development and deployment environments, simplify dependency management, and improve application portability.",
      alternatives: ["Podman", "containerd", "Kubernetes"],
    },
    {
      name: "AWS S3",
      description:
        "A scalable cloud object storage service used to store files, media, backups, documents, and other unstructured data.",
      reason:
        "Chosen for its scalability, durability, security controls, storage flexibility, and integration with other AWS services.",
      alternatives: ["Google Cloud Storage", "Azure Blob Storage", "Cloudflare R2"],
    },
    {
      name: "Vercel",
      description:
        "A cloud platform optimized for deploying and hosting modern frontend and full-stack web applications.",
      reason:
        "Chosen for its seamless Git integration, global deployment infrastructure, preview environments, serverless capabilities, and strong Next.js support.",
      alternatives: ["Netlify", "AWS Amplify", "Cloudflare Pages"],
    },
    {
      name: "Stripe",
      description:
        "A payment processing platform that provides APIs and tools for accepting online payments and managing financial transactions.",
      reason:
        "Chosen for its developer-friendly APIs, broad payment support, subscription capabilities, and strong documentation.",
      alternatives: ["PayPal", "Razorpay", "Adyen"],
    },
    {
      name: "Auth0",
      description:
        "An identity and access management platform that provides authentication, authorization, and user identity services.",
      reason:
        "Chosen to implement secure authentication without building and maintaining a complete identity system from scratch.",
      alternatives: ["Clerk", "Firebase Authentication", "Supabase Auth", "Amazon Cognito"],
    },
    {
      name: "Cloudflare",
      description:
        "A global cloud platform providing CDN, DNS, security, edge computing, networking, and application performance services.",
      reason:
        "Chosen for its global network, DDoS protection, CDN capabilities, DNS management, and edge-based application services.",
      alternatives: ["AWS CloudFront", "Fastly", "Akamai"],
    },
    {
      name: "GitHub Actions",
      description:
        "A CI/CD automation platform integrated with GitHub for automatically building, testing, and deploying applications.",
      reason:
        "Chosen for its direct GitHub integration, flexible workflow automation, reusable actions, and support for automated software delivery.",
      alternatives: ["GitLab CI/CD", "Jenkins", "CircleCI", "Azure Pipelines"],
    },
  ],
  authentication: [],
};

class TechServices {
  public async addNewTechStack(
    projectId: string,
    category: string,
    tech: Partial<ITechPreset> & { name: string }
  ) {
    if (!projectId || !tech || !tech.name) {
      throw new Error("Project ID and tech name are required");
    }

    const catLower = (category || "").toLowerCase().trim();
    let targetCat: "frontend" | "backend" | "database" | "authentication" | "otherServices" = "otherServices";

    if (catLower.includes("front")) targetCat = "frontend";
    else if (catLower.includes("back") || catLower.includes("server") || catLower.includes("api")) targetCat = "backend";
    else if (catLower.includes("data") || catLower.includes("db") || catLower.includes("storage")) targetCat = "database";
    else if (catLower.includes("auth") || catLower.includes("security")) targetCat = "authentication";

    // Find preset if available
    const presetsForCategory = (PRESETS as any)[targetCat] as ITechPreset[] | undefined;
    const presetMatch = presetsForCategory?.find(
      (p) => p.name.toLowerCase() === tech.name.toLowerCase()
    );

    const description =
      tech.description && tech.description.trim() !== ""
        ? tech.description.trim()
        : presetMatch?.description || `${tech.name} technology component.`;

    const reason =
      tech.reason && tech.reason.trim() !== ""
        ? tech.reason.trim()
        : presetMatch?.reason || "Selected for application stack";

    const alternatives =
      Array.isArray(tech.alternatives) && tech.alternatives.length > 0
        ? tech.alternatives
        : presetMatch?.alternatives || [];

    const finalTechItem: ITechPreset = {
      name: tech.name.trim(),
      description,
      reason,
      alternatives,
    };

    let techStackDoc = await TechStack.findOne({ projectId });

    if (!techStackDoc) {
      techStackDoc = await TechStack.create({
        projectId,
        frontend: [],
        backend: [],
        database: [],
        authentication: [],
        otherServices: [],
      });
    }

    const currentList = [...(techStackDoc[targetCat] || [])];
    const existingIndex = currentList.findIndex(
      (item) => item.name.toLowerCase() === finalTechItem.name.toLowerCase()
    );

    if (existingIndex >= 0) {
      currentList[existingIndex] = finalTechItem;
    } else {
      currentList.push(finalTechItem);
    }

    techStackDoc[targetCat] = currentList;
    await techStackDoc.save();

    await Project.findByIdAndUpdate(projectId, {
      techStackId: techStackDoc._id,
    });

    return techStackDoc;
  }

  public async removeTechStack(
    projectId: string,
    category: string,
    techName: string
  ) {
    if (!projectId || !techName) {
      throw new Error("Project ID and tech name are required");
    }

    const catLower = (category || "").toLowerCase().trim();
    let targetCat: "frontend" | "backend" | "database" | "authentication" | "otherServices" = "otherServices";

    if (catLower.includes("front")) targetCat = "frontend";
    else if (catLower.includes("back") || catLower.includes("server") || catLower.includes("api")) targetCat = "backend";
    else if (catLower.includes("data") || catLower.includes("db") || catLower.includes("storage")) targetCat = "database";
    else if (catLower.includes("auth") || catLower.includes("security")) targetCat = "authentication";

    const techStackDoc = await TechStack.findOne({ projectId });

    if (techStackDoc && techStackDoc[targetCat]) {
      techStackDoc[targetCat] = techStackDoc[targetCat].filter(
        (item) => item.name.toLowerCase() !== techName.toLowerCase()
      );
      await techStackDoc.save();
    }

    return techStackDoc;
  }
}

export const techServices = new TechServices();