import "dotenv/config";
import { IRoadmapPhase } from "../models/roadmap.model";
import { IArchitectureNode, IArchitectureEdge } from "../models/architecture.model";
import { OPENROUTER_PROMPTS } from "../prompts/openRouter.prompts";

export interface GenerateRoadmapInput {
  name: string;
  description: string;
  type?: string;
  experienceLevel?: string;
  techStack?: any;
}

export interface GenerateArchitectureInput {
  prompt?: string | undefined;
  projectName?: string | undefined;
  projectDescription?: string | undefined;
  projectType?: string | undefined;
  techStack?: any;
}

class OpenRouterService {
  private baseUrl: string = "https://openrouter.ai/api/v1/chat/completions";
  /**
   * Universal AI completion caller prioritizing direct Google Gemini API (with native JSON response format)
   * if GEMINI_API_KEY is provided, and falling back to OpenRouter API.
   */
  private async callAiModel(
    systemPrompt: string,
    userPrompt: string,
    maxTokens: number = 4000
  ): Promise<string> {
    const geminiKey = process.env.GEMINI_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    // 1. Try Direct Google Gemini API
    // if (geminiKey && geminiKey.trim().length > 0) {
    //   const candidateModels = Array.from(
    //     new Set(
    //       [
    //         process.env.GEMINI_MODEL,
    //         "gemini-1.5-flash-latest",
    //         "gemini-1.5-flash",
    //         "gemini-1.5-flash-002",
    //         "gemini-1.5-flash-001",
    //         "gemini-1.5-pro-latest",
    //         "gemini-1.5-pro",
    //         "gemini-2.0-flash-exp",
    //         "gemini-2.5-flash",
    //       ].filter(Boolean)
    //     )
    //   ) as string[];

    //   for (const geminiModel of candidateModels) {
    //     const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey.trim()}`;

    //     try {
    //       const response = await fetch(url, {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //           systemInstruction: {
    //             parts: [{ text: systemPrompt }],
    //           },
    //           contents: [
    //             {
    //               role: "user",
    //               parts: [{ text: userPrompt }],
    //             },
    //           ],
    //           generationConfig: {
    //             temperature: 0.7,
    //             maxOutputTokens: maxTokens,
    //             responseMimeType: "application/json",
    //           },
    //         }),
    //       });

    //       if (response.ok) {
    //         const data = await response.json();
    //         const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    //         if (candidateText && candidateText.trim().length > 0) {
    //           console.log(`Successfully generated content via Direct Gemini API (${geminiModel}) with native JSON output.`);
    //           return candidateText;
    //         }
    //       } else {
    //         const errText = await response.text();
    //         console.warn(`Gemini API model ${geminiModel} returned status ${response.status}: ${errText.substring(0, 150)}`);
    //       }
    //     } catch (err: any) {
    //       console.warn(`Direct Gemini API call failed for model ${geminiModel}:`, err.message);
    //     }
    //   }

    //   // Auto-discover models directly from Gemini API if static list fails
    //   try {
    //     const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey.trim()}`;
    //     const listRes = await fetch(listUrl);
    //     if (listRes.ok) {
    //       const listData = await listRes.json();
    //       const discoveredModels = (listData.models || [])
    //         .filter((m: any) =>
    //           m.name &&
    //           Array.isArray(m.supportedGenerationMethods) &&
    //           m.supportedGenerationMethods.includes("generateContent") &&
    //           m.name.includes("gemini")
    //         )
    //         .map((m: any) => m.name.replace(/^models\//, ""));

    //       for (const discoveredModel of discoveredModels) {
    //         const url = `https://generativelanguage.googleapis.com/v1beta/models/${discoveredModel}:generateContent?key=${geminiKey.trim()}`;
    //         const response = await fetch(url, {
    //           method: "POST",
    //           headers: { "Content-Type": "application/json" },
    //           body: JSON.stringify({
    //             systemInstruction: { parts: [{ text: systemPrompt }] },
    //             contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    //             generationConfig: {
    //               temperature: 0.7,
    //               maxOutputTokens: maxTokens,
    //               responseMimeType: "application/json",
    //             },
    //           }),
    //         });

    //         if (response.ok) {
    //           const data = await response.json();
    //           const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    //           if (candidateText && candidateText.trim().length > 0) {
    //             console.log(`Successfully generated content via Discovered Gemini Model (${discoveredModel}).`);
    //             return candidateText;
    //           }
    //         }
    //       }
    //     }
    //   } catch (discErr: any) {
    //     console.warn("Gemini model auto-discovery failed:", discErr.message);
    //   }

    //   console.warn("Direct Gemini API attempts failed. Falling back to OpenRouter API...");
    // }

    // 2. Try OpenRouter API
    if (openRouterKey && openRouterKey.trim().length > 0) {
      const openRouterModel = process.env.OPENROUTER_MODEL || "openrouter/free";
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openRouterKey.trim()}`,
          "HTTP-Referer": "https://archer.app",
          "X-Title": "Archer Project Management",
        },
        body: JSON.stringify({
          model: openRouterModel,
          max_tokens: maxTokens,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const choice = data.choices?.[0];
      let content = choice?.message?.content || choice?.text || choice?.message?.reasoning;

      if (Array.isArray(content)) {
        content = content.map((part: any) => part.text || String(part)).join("");
      }

      if (!content) {
        throw new Error("No content received from OpenRouter API");
      }

      return content;
    }

    throw new Error("Neither GEMINI_API_KEY nor OPENROUTER_API_KEY is configured in environment variables.");
  }

  /**
   * Helper to extract JSON substring from markdown code blocks, reasoning tags, or conversational text preambles
   */
  private extractJsonString(rawContent: string): string {
    if (!rawContent) return "";
    let str = rawContent.trim();

    // 0. Remove reasoning tags <think>...</think> and safety headers
    str = str.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
    str = str.replace(/<think>[\s\S]*/gi, "").trim(); // unclosed <think>
    str = str.replace(/^(?:User Safety|Safety Assessment|Content Safety):.*$/gim, "").trim();

    // 1. Extract content from ```json ... ``` codeblock if present
    const codeBlockMatch = str.match(/```(?:json)?\s*([\s\S]*?)(?:```|$)/i);
    if (codeBlockMatch && codeBlockMatch[1] && codeBlockMatch[1].trim().length > 0) {
      str = codeBlockMatch[1].trim();
    }

    // 2. Find starting '{' or '['
    const firstBrace = str.indexOf('{');
    const firstBracket = str.indexOf('[');

    let startIdx = -1;
    if (firstBrace !== -1 && firstBracket !== -1) {
      startIdx = Math.min(firstBrace, firstBracket);
    } else if (firstBrace !== -1) {
      startIdx = firstBrace;
    } else if (firstBracket !== -1) {
      startIdx = firstBracket;
    }

    if (startIdx !== -1) {
      str = str.substring(startIdx).trim();
    }

    return str;
  }

  /**
   * Clean dangling trailing tokens from truncated JSON
   */
  private cleanTrailingFragments(str: string): string {
    let s = str.trim();

    // Remove trailing comma
    s = s.replace(/,\s*$/, "");

    // If it ends with key: (e.g. `"description":`)
    s = s.replace(/,\s*"[^"]*"\s*:\s*$/, "");
    s = s.replace(/\{\s*"[^"]*"\s*:\s*$/, "{");

    // If it ends with dangling key without colon (e.g. `,"id"` or `{"id"`)
    s = s.replace(/,\s*"[^"]*"$/, "");
    s = s.replace(/\{\s*"[^"]*"$/, "{");

    // Remove trailing comma again if created
    s = s.replace(/,\s*$/, "");

    return s;
  }

  /**
   * Balance quotes, brackets, and braces to close incomplete JSON structures cleanly
   */
  private balanceAndCloseJson(jsonStr: string): string {
    let str = jsonStr.trim();

    // 1. Close unclosed string literal if odd number of unescaped quotes
    let inString = false;
    let isEscaped = false;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (isEscaped) {
        isEscaped = false;
        continue;
      }
      if (char === '\\') {
        isEscaped = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
      }
    }

    if (inString) {
      str += '"';
    }

    // 2. Clean dangling trailing key/comma fragments
    str = this.cleanTrailingFragments(str);

    // 3. Scan bracket/brace stack
    const stack: string[] = [];
    inString = false;
    isEscaped = false;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (isEscaped) {
        isEscaped = false;
        continue;
      }
      if (char === '\\') {
        isEscaped = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        continue;
      }
      if (!inString) {
        if (char === '{') {
          stack.push('}');
        } else if (char === '[') {
          stack.push(']');
        } else if (char === '}' || char === ']') {
          if (stack.length > 0 && stack[stack.length - 1] === char) {
            stack.pop();
          }
        }
      }
    }

    // Close remaining open containers in reverse order
    while (stack.length > 0) {
      str += stack.pop();
    }

    return str;
  }

  /**
   * Defensive helper to parse JSON, attempting repair if string was truncated by max_tokens limit or contains conversational preambles
   */
  private parseOrRepairJson(rawContent: string): any {
    const cleaned = this.extractJsonString(rawContent);
    if (!cleaned) {
      throw new Error("Empty content after JSON extraction");
    }

    // Attempt 1: Direct JSON parse
    try {
      return JSON.parse(cleaned);
    } catch (err1) {
      // Continue
    }

    // Attempt 2: Clean comments, single-quotes, and trailing commas
    let sanitized = cleaned
      .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "") // remove JS comments
      .replace(/,\s*([\}\]])/g, "$1"); // remove trailing commas before } or ]

    try {
      return JSON.parse(sanitized);
    } catch (err2) {
      // Continue
    }

    // Attempt 3: Replace single-quoted properties/values with double-quotes
    const doubleQuoted = sanitized.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, '"$1"');
    try {
      return JSON.parse(doubleQuoted);
    } catch (err3) {
      // Continue
    }

    // Attempt 4: Repair truncated JSON by balancing quotes & braces
    try {
      const repaired = this.balanceAndCloseJson(sanitized);
      return JSON.parse(repaired);
    } catch (err4) {
      // Continue
    }

    // Attempt 5: Truncate to last complete brace/bracket, then repair
    const lastBrace = sanitized.lastIndexOf('}');
    const lastBracket = sanitized.lastIndexOf(']');
    const endIdx = Math.max(lastBrace, lastBracket);
    if (endIdx > 0) {
      try {
        const truncatedSlice = sanitized.substring(0, endIdx + 1);
        const repairedSlice = this.balanceAndCloseJson(truncatedSlice);
        return JSON.parse(repairedSlice);
      } catch (err5) {
        // Continue
      }
    }

    // Fallback 1: Extract closed phase objects using regex
    const phaseMatches = cleaned.match(
      /\{\s*"phaseNumber"[\s\S]*?\}(?=\s*,\s*\{|\s*\])/g,
    );
    if (phaseMatches && phaseMatches.length > 0) {
      try {
        return JSON.parse(`{"phases": [${phaseMatches.join(",")}]}`);
      } catch (regexErr) {
        // ignore
      }
    }

    // Fallback 2: Extract closed node objects using regex
    const nodeMatches = cleaned.match(
      /\{\s*"id"[\s\S]*?"type"[\s\S]*?\}(?=\s*,\s*\{|\s*\])/g,
    );
    if (nodeMatches && nodeMatches.length > 0) {
      try {
        return JSON.parse(`{"nodes": [${nodeMatches.join(",")}], "edges": []}`);
      } catch (regexErr) {
        // ignore
      }
    }

    throw new Error(`Invalid JSON output from AI: ${cleaned.substring(0, 100)}...`);
  }

  private getDefaultRoadmapPhases(info: GenerateRoadmapInput | string): IRoadmapPhase[] {
    const projName = typeof info === "string" ? "Project" : info.name || "Project";
    const projType = typeof info === "string" ? "Web Application" : info.type || "Web Application";

    return [
      {
        phaseNumber: 1,
        title: "Phase 1: Environment Setup & Architecture",
        description: `Configure project repository, setup development environment, and establish foundational architecture for ${projName}.`,
        difficulty: "easy",
        order: 1,
        tasks: [
          {
            title: "Initialize Repository & Project Scaffold",
            description: `Set up source control repository, directory structure, and foundational configuration for ${projType}.`,
            order: 1,
            estimatedHours: 4,
            priority: "high",
            status: "not_started",
            dependencies: [],
          },
          {
            title: "Configure Database & Environment Schema",
            description: "Set up database connections, environment variable configurations, and data models.",
            order: 2,
            estimatedHours: 6,
            priority: "high",
            status: "not_started",
            dependencies: ["Initialize Repository & Project Scaffold"],
          },
          {
            title: "Setup Base Routing & Application Structure",
            description: "Establish initial application routing, layout structure, and base API endpoints.",
            order: 3,
            estimatedHours: 6,
            priority: "medium",
            status: "not_started",
            dependencies: ["Configure Database & Environment Schema"],
          },
        ],
      },
      {
        phaseNumber: 2,
        title: "Phase 2: Core Feature Implementation",
        description: `Develop main functionality and core features according to ${projName} specifications.`,
        difficulty: "medium",
        order: 2,
        tasks: [
          {
            title: "Build Authentication & Authorization Flow",
            description: "Implement user registration, login authentication, JWT / session management, and route protection.",
            order: 1,
            estimatedHours: 8,
            priority: "high",
            status: "not_started",
            dependencies: [],
          },
          {
            title: "Implement Primary Domain Services & Data APIs",
            description: "Develop primary CRUD operations, business logic controllers, and database query handlers.",
            order: 2,
            estimatedHours: 12,
            priority: "high",
            status: "not_started",
            dependencies: ["Build Authentication & Authorization Flow"],
          },
          {
            title: "Integrate User Interface & Data Binding",
            description: "Connect frontend UI components with backend API services and state management.",
            order: 3,
            estimatedHours: 10,
            priority: "medium",
            status: "not_started",
            dependencies: ["Implement Primary Domain Services & Data APIs"],
          },
        ],
      },
      {
        phaseNumber: 3,
        title: "Phase 3: Integration & System Testing",
        description: "Perform end-to-end integration, performance optimization, and quality assurance testing.",
        difficulty: "medium",
        order: 3,
        tasks: [
          {
            title: "API & Unit Testing Coverage",
            description: "Write unit and integration tests for critical business endpoints and user flows.",
            order: 1,
            estimatedHours: 6,
            priority: "medium",
            status: "not_started",
            dependencies: [],
          },
          {
            title: "Error Handling & Performance Optimization",
            description: "Implement global exception handling, database indexing, and query optimization.",
            order: 2,
            estimatedHours: 8,
            priority: "medium",
            status: "not_started",
            dependencies: ["API & Unit Testing Coverage"],
          },
        ],
      },
      {
        phaseNumber: 4,
        title: "Phase 4: Deployment & Launch",
        description: "Prepare production build artifacts, CI/CD pipeline deployment, and system monitoring.",
        difficulty: "hard",
        order: 4,
        tasks: [
          {
            title: "Configure Production Environment & CI/CD",
            description: "Set up production deployment pipeline, SSL certificates, and cloud hosting infrastructure.",
            order: 1,
            estimatedHours: 8,
            priority: "high",
            status: "not_started",
            dependencies: [],
          },
          {
            title: "Final Audit & System Go-Live",
            description: "Perform security audit, verify production environment variables, and launch application.",
            order: 2,
            estimatedHours: 4,
            priority: "high",
            status: "not_started",
            dependencies: ["Configure Production Environment & CI/CD"],
          },
        ],
      },
    ];
  }

  public async generateRoadMap(
    info: GenerateRoadmapInput | string,
  ): Promise<IRoadmapPhase[]> {
    try {
      const projectDetails =
        typeof info === "string"
          ? info
          : `
Project Name: ${info.name}
Description: ${info.description}
Type: ${info.type || "Web Application"}
Target Experience Level: ${info.experienceLevel || "Beginner"}
Tech Stack Context: ${info.techStack ? JSON.stringify(info.techStack) : "Not specified"}
`;

      const systemPrompt = OPENROUTER_PROMPTS.generateRoadmapSystemPrompt;
      const userPrompt =
        OPENROUTER_PROMPTS.generateRoadmapUserPrompt(projectDetails);

      const maxTokens = Number(process.env.OPENROUTER_MAX_TOKENS) || 3000;
      const content = await this.callAiModel(systemPrompt, userPrompt, maxTokens);

      const parsed = this.parseOrRepairJson(content);
      const phases = Array.isArray(parsed.phases)
        ? parsed.phases
        : Array.isArray(parsed)
          ? parsed
          : [];

      if (!phases || phases.length === 0) {
        return this.getDefaultRoadmapPhases(info);
      }

      // Sanitize and validate phases and tasks
      return phases.map((phase: any, pIndex: number) => {
        const phaseTitle = String(phase.title || `Phase ${pIndex + 1}`);
        const phaseDesc = String(phase.description || "").trim() || `${phaseTitle} objectives and setup.`;

        return {
          phaseNumber: Number(phase.phaseNumber) || pIndex + 1,
          title: phaseTitle,
          description: phaseDesc,
          difficulty: ["easy", "medium", "hard"].includes(phase.difficulty)
            ? phase.difficulty
            : "medium",
          order: Number(phase.order) || pIndex + 1,
          tasks: Array.isArray(phase.tasks)
            ? phase.tasks.map((task: any, tIndex: number) => {
                const taskTitle = String(task.title || `Task ${tIndex + 1}`);
                const taskDesc = String(task.description || "").trim() || `Implement and execute ${taskTitle}.`;

                return {
                  title: taskTitle,
                  description: taskDesc,
                  order: Number(task.order) || tIndex + 1,
                  estimatedHours: Number(task.estimatedHours) || 2,
                  priority: ["low", "medium", "high"].includes(task.priority)
                    ? task.priority
                    : "medium",
                  status: [
                    "not_started",
                    "in_progress",
                    "completed",
                    "blocked",
                  ].includes(task.status)
                    ? task.status
                    : "not_started",
                  dependencies: Array.isArray(task.dependencies)
                    ? task.dependencies.map(String)
                    : [],
                };
              })
            : [],
        };
      });
    } catch (err: any) {
      console.warn("Failed to generate or parse AI roadmap, returning default fallback roadmap:", err.message);
      return this.getDefaultRoadmapPhases(info);
    }
  }

  private getEdgeColor(edgeType: string, protocol?: string, label?: string): string {
    const str = `${edgeType || ''} ${protocol || ''} ${label || ''}`.toLowerCase();

    if (str.includes('auth') || str.includes('jwt') || str.includes('login') || str.includes('security')) {
      return '#ef4444'; // Red for Auth/Security
    }
    if (str.includes('database') || str.includes('sql') || str.includes('query') || str.includes('crud') || str.includes('postgres') || str.includes('mongo')) {
      return '#f59e0b'; // Amber for Database
    }
    if (str.includes('cache') || str.includes('redis') || str.includes('memcached')) {
      return '#ec4899'; // Pink/Magenta for Cache
    }
    if (str.includes('queue') || str.includes('event') || str.includes('pubsub') || str.includes('kafka') || str.includes('mq')) {
      return '#8b5cf6'; // Purple for Message Queue/Events
    }
    if (str.includes('websocket') || str.includes('wss') || str.includes('socket') || str.includes('realtime')) {
      return '#10b981'; // Emerald Green for Realtime/Sockets
    }
    if (str.includes('ai') || str.includes('llm') || str.includes('external') || str.includes('github') || str.includes('openai') || str.includes('youtube')) {
      return '#06b6d4'; // Cyan/Teal for AI / External Services
    }
    if (str.includes('http') || str.includes('https') || str.includes('rest') || str.includes('api')) {
      return '#3b82f6'; // Electric Blue for HTTP/REST
    }

    return '#64748b'; // Slate Gray default
  }

  private autoLayoutNodes(rawNodes: IArchitectureNode[]): IArchitectureNode[] {
    const getTier = (node: IArchitectureNode): number => {
      const t = node.type?.toLowerCase() || '';
      const cat = node.data?.category?.toLowerCase() || '';
      const label = node.data?.label?.toLowerCase() || '';

      if (t.includes('cdn') || t.includes('load-balancer') || cat.includes('cdn') || cat.includes('client')) return 0;
      if (t === 'frontend' || label.includes('frontend') || label.includes('ui') || label.includes('web')) return 0;
      if (t === 'api' || t === 'auth' || cat.includes('gateway') || cat.includes('security') || label.includes('gateway')) return 1;
      if (t === 'backend' || t === 'service' || t === 'microservice') return 2;
      if (t === 'queue' || t === 'worker' || t === 'cache' || t === 'storage') return 3;
      if (t === 'database' || t === 'external-service' || t === 'ai-service') return 4;
      return 2;
    };

    const tierGroups: Record<number, IArchitectureNode[]> = { 0: [], 1: [], 2: [], 3: [], 4: [] };
    rawNodes.forEach((n) => {
      const tier = getTier(n);
      if (!tierGroups[tier]) tierGroups[tier] = [];
      tierGroups[tier]!.push(n);
    });

    const startX = 100;
    const colSpacing = 450;
    const startY = 100;
    const rowSpacing = 220;

    return rawNodes.map((node) => {
      const tier = getTier(node);
      const group = tierGroups[tier] || [];
      const index = group.findIndex((n) => n.id === node.id);

      return {
        ...node,
        position: {
          x: startX + tier * colSpacing,
          y: startY + Math.max(0, index) * rowSpacing,
        },
      };
    });
  }

  private getDefaultArchitecture(): { nodes: IArchitectureNode[]; edges: IArchitectureEdge[] } {
    const nodes: IArchitectureNode[] = [
      {
        id: "frontend_app",
        type: "frontend",
        position: { x: 100, y: 100 },
        data: {
          label: "Web Client Application",
          description: "Single Page Application UI",
          category: "Frontend",
          technology: "React / Next.js",
          technologies: ["React", "TypeScript", "Tailwind CSS"],
          color: "#3b82f6",
        },
        width: 220,
        height: 120,
      },
      {
        id: "api_gateway",
        type: "api",
        position: { x: 550, y: 100 },
        data: {
          label: "API Gateway & Router",
          description: "API routing, security middleware, and authentication",
          category: "Security",
          technology: "Node.js / Express",
          technologies: ["Express", "JWT"],
          color: "#ef4444",
        },
        width: 220,
        height: 120,
      },
      {
        id: "backend_core",
        type: "backend",
        position: { x: 1000, y: 100 },
        data: {
          label: "Core Backend Service",
          description: "Primary backend application business logic engine",
          category: "Backend",
          technology: "Node.js / TypeScript",
          technologies: ["Node.js", "TypeScript", "REST API"],
          color: "#3b82f6",
        },
        width: 220,
        height: 120,
      },
      {
        id: "main_database",
        type: "database",
        position: { x: 1450, y: 100 },
        data: {
          label: "Primary Database",
          description: "Persistent database storage for application data",
          category: "Database",
          technology: "PostgreSQL / MongoDB",
          technologies: ["MongoDB", "Mongoose"],
          color: "#f59e0b",
        },
        width: 220,
        height: 120,
      },
    ];

    const edges: IArchitectureEdge[] = [
      {
        id: "edge_frontend_gateway",
        source: "frontend_app",
        target: "api_gateway",
        label: "HTTPS REST API",
        type: "http",
        animated: true,
        data: {
          protocol: "HTTPS",
          method: "REST",
          dataType: "JSON",
          description: "Client web API requests",
          direction: "request",
          color: "#3b82f6",
        },
      },
      {
        id: "edge_gateway_backend",
        source: "api_gateway",
        target: "backend_core",
        label: "Internal REST",
        type: "http",
        animated: true,
        data: {
          protocol: "HTTP",
          method: "POST/GET",
          dataType: "JSON",
          description: "Authenticated request routing",
          direction: "request",
          color: "#3b82f6",
        },
      },
      {
        id: "edge_backend_database",
        source: "backend_core",
        target: "main_database",
        label: "Database Query",
        type: "database-query",
        animated: true,
        data: {
          protocol: "TCP",
          method: "CRUD Query",
          dataType: "JSON / BSON",
          description: "Data persistence and retrieval queries",
          direction: "bidirectional",
          color: "#f59e0b",
        },
      },
    ];

    return { nodes, edges };
  }

  public async generateArchitecture(
    input: GenerateArchitectureInput | string
  ): Promise<{ nodes: IArchitectureNode[]; edges: IArchitectureEdge[] }> {

    let techStackStr = "";
    if (typeof input !== "string" && input.techStack) {
      if (typeof input.techStack === "object") {
        const formatCategory = (items: any[]) =>
          Array.isArray(items)
            ? items.map((i) => i.name || i).join(", ")
            : "";
        const fe = formatCategory(input.techStack.frontend);
        const be = formatCategory(input.techStack.backend);
        const db = formatCategory(input.techStack.database);
        const auth = formatCategory(input.techStack.authentication);
        const other = formatCategory(input.techStack.otherServices);

        techStackStr = [
          fe ? `Frontend Technologies: ${fe}` : "",
          be ? `Backend Technologies: ${be}` : "",
          db ? `Database Technologies: ${db}` : "",
          auth ? `Authentication Technologies: ${auth}` : "",
          other ? `Other Services: ${other}` : "",
        ]
          .filter(Boolean)
          .join("\n");
      }
      if (!techStackStr) {
        techStackStr = `Tech Stack: ${JSON.stringify(input.techStack)}`;
      }
    }

    const details =
      typeof input === "string"
        ? input
        : [
            input.prompt ? `User Prompt / Requirement: ${input.prompt}` : "",
            input.projectName ? `Project Name: ${input.projectName}` : "",
            input.projectDescription ? `Description: ${input.projectDescription}` : "",
            input.projectType ? `Project Type: ${input.projectType}` : "",
            techStackStr,
          ]
            .filter(Boolean)
            .join("\n") || "Generate standard modern full-stack web application system architecture.";

    const systemPrompt = OPENROUTER_PROMPTS.generateArchitectureSystemPrompt;
    const userPrompt = OPENROUTER_PROMPTS.generateSystemArchiecture(details);
    const maxTokens = Number(process.env.OPENROUTER_MAX_TOKENS) || 4000;

    let content = "";
    try {
      content = await this.callAiModel(systemPrompt, userPrompt, maxTokens);
    } catch (err: any) {
      console.warn("AI generation failed for architecture, returning default architecture:", err.message);
      return this.getDefaultArchitecture();
    }

    try {
      const parsed = this.parseOrRepairJson(content);
      const rawNodes = Array.isArray(parsed?.nodes) ? parsed.nodes : [];
      const rawEdges = Array.isArray(parsed?.edges) ? parsed.edges : [];

      const validNodeTypes = [
        "frontend",
        "backend",
        "api",
        "database",
        "cache",
        "queue",
        "storage",
        "service",
        "microservice",
        "auth",
        "load-balancer",
        "cdn",
        "worker",
        "container",
        "external-service",
        "ai-service",
        "custom",
      ];

      const validEdgeTypes = [
        "data-flow",
        "http",
        "websocket",
        "event",
        "message-queue",
        "database-query",
        "dependency",
        "async",
        "custom",
      ];

      // Validate & sanitize nodes
      const parsedNodes: IArchitectureNode[] = rawNodes.map((n: any, idx: number) => ({
        id: String(n.id || `node_${idx + 1}`),
        type: validNodeTypes.includes(n.type) ? n.type : "service",
        position: {
          x: typeof n.position?.x === "number" ? n.position.x : 100 + (idx % 4) * 350,
          y: typeof n.position?.y === "number" ? n.position.y : 100 + Math.floor(idx / 4) * 180,
        },
        data: {
          label: String(n.data?.label || `Component ${idx + 1}`),
          description: String(n.data?.description || ""),
          category: String(n.data?.category || "Service"),
          technology: String(n.data?.technology || ""),
          technologies: Array.isArray(n.data?.technologies)
            ? n.data.technologies.map(String)
            : [],
          icon: String(n.data?.icon || ""),
          color: String(n.data?.color || "#3b82f6"),
          properties: typeof n.data?.properties === "object" ? n.data.properties : {},
        },
        width: typeof n.width === "number" ? n.width : 220,
        height: typeof n.height === "number" ? n.height : 120,
        parentId: n.parentId ? String(n.parentId) : undefined,
      }));

      // Apply clean column layout to avoid node overlaps
      const nodes = this.autoLayoutNodes(parsedNodes);

      // Validate & sanitize edges with distinct colors
      const edges: IArchitectureEdge[] = rawEdges.map((e: any, idx: number) => {
        const edgeType = validEdgeTypes.includes(e.type) ? e.type : "http";
        const protocol = String(e.data?.protocol || "");
        const label = String(e.label || "");
        const edgeColor = this.getEdgeColor(edgeType, protocol, label);

        return {
          id: String(e.id || `edge_${idx + 1}`),
          source: String(e.source || ""),
          target: String(e.target || ""),
          sourceHandle: e.sourceHandle ? String(e.sourceHandle) : undefined,
          targetHandle: e.targetHandle ? String(e.targetHandle) : undefined,
          label: label,
          type: edgeType,
          animated: typeof e.animated === "boolean" ? e.animated : true,
          data: {
            protocol: protocol,
            method: String(e.data?.method || ""),
            dataType: String(e.data?.dataType || ""),
            description: String(e.data?.description || ""),
            direction: ["request", "response", "bidirectional"].includes(e.data?.direction)
              ? e.data.direction
              : "request",
            color: edgeColor,
            properties: typeof e.data?.properties === "object" ? e.data.properties : {},
          },
        };
      });

      return { nodes, edges };
    } catch (err: any) {
      console.error("Failed to parse architecture AI JSON response:", content);
      throw new Error(
        `Failed to parse AI response into architecture format: ${err.message}`
      );
    }
  }
}

export const openRouterService = new OpenRouterService();

