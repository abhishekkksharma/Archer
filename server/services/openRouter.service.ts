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
   * Helper to extract JSON substring from markdown code blocks or conversational text preambles
   */
  private extractJsonString(rawContent: string): string {
    let str = rawContent.trim();

    // 1. Extract content from ```json ... ``` codeblock if present
    const codeBlockMatch = str.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (codeBlockMatch && codeBlockMatch[1]) {
      str = codeBlockMatch[1].trim();
    }

    // 2. Find outermost '{' and '}' bounds if text exists before or after
    const firstBrace = str.indexOf('{');
    const lastBrace = str.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      str = str.substring(firstBrace, lastBrace + 1).trim();
    } else if (firstBrace !== -1 && lastBrace === -1) {
      // Truncated JSON starting at firstBrace
      str = str.substring(firstBrace).trim();
    }

    return str;
  }

  /**
   * Defensive helper to parse JSON, attempting repair if string was truncated by max_tokens limit or contains conversational preambles
   */
  private parseOrRepairJson(rawContent: string): any {
    const cleaned = this.extractJsonString(rawContent);

    try {
      return JSON.parse(cleaned);
    } catch (firstError) {
      console.warn(
        "Standard JSON parse failed, attempting truncation repair...",
      );

      let str = cleaned;

      // 1. If inside an unclosed string, close the quote
      const quoteCount = (str.match(/"/g) || []).length;
      if (quoteCount % 2 !== 0) {
        str += '"';
      }

      // 2. Remove any trailing dangling commas or key fragments
      str = str.replace(/,\s*$/, "").replace(/,\s*"[^"]*"?\s*:?\s*$/, "");

      // 3. Balance missing closing brackets & braces
      const openBrackets =
        (str.match(/\[/g) || []).length - (str.match(/\]/g) || []).length;
      const openBraces =
        (str.match(/\{/g) || []).length - (str.match(/\}/g) || []).length;

      for (let i = 0; i < openBraces; i++) str += "}";
      for (let i = 0; i < openBrackets; i++) str += "]";

      try {
        return JSON.parse(str);
      } catch (repairError) {
        // Fallback 1: extract any fully closed phase objects using regex
        const phaseMatches = cleaned.match(
          /\{\s*"phaseNumber"[\s\S]*?\}(?=\s*,\s*\{|\s*\])/g,
        );
        if (phaseMatches && phaseMatches.length > 0) {
          const fallbackJson = `{"phases": [${phaseMatches.join(",")}]}`;
          try {
            return JSON.parse(fallbackJson);
          } catch (regexErr) {
            // ignore
          }
        }

        // Fallback 2: extract any fully closed node objects using regex
        const nodeMatches = cleaned.match(
          /\{\s*"id"[\s\S]*?"type"[\s\S]*?\}(?=\s*,\s*\{|\s*\])/g,
        );
        if (nodeMatches && nodeMatches.length > 0) {
          const fallbackJson = `{"nodes": [${nodeMatches.join(",")}], "edges": []}`;
          try {
            return JSON.parse(fallbackJson);
          } catch (regexErr) {
            // ignore
          }
        }

        throw firstError;
      }
    }
  }

  public async generateRoadMap(
    info: GenerateRoadmapInput | string,
  ): Promise<IRoadmapPhase[]> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is not set in environment variables");
    }

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
    const model = process.env.OPENROUTER_MODEL || "openrouter/free";

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://archer.app",
        "X-Title": "Archer Project Management",
      },
      body: JSON.stringify({
        model: model,
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
      console.error("OpenRouter API Error:", response.status, errorText);
      throw new Error(
        `OpenRouter API error (${response.status}): ${errorText}`,
      );
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    let content = choice?.message?.content || choice?.text || choice?.message?.reasoning;

    if (Array.isArray(content)) {
      content = content.map((part: any) => part.text || String(part)).join("");
    }

    if (!content) {
      console.error("OpenRouter raw response payload:", JSON.stringify(data, null, 2));
      throw new Error("No content received from OpenRouter API");
    }

    try {
      const parsed = this.parseOrRepairJson(content);
      const phases = Array.isArray(parsed.phases)
        ? parsed.phases
        : Array.isArray(parsed)
          ? parsed
          : [];

      if (!phases || phases.length === 0) {
        throw new Error("AI returned empty phases array");
      }

      // Sanitize and validate phases and tasks
      return phases.map((phase: any, pIndex: number) => ({
        phaseNumber: Number(phase.phaseNumber) || pIndex + 1,
        title: String(phase.title || `Phase ${pIndex + 1}`),
        description: String(phase.description || ""),
        difficulty: ["easy", "medium", "hard"].includes(phase.difficulty)
          ? phase.difficulty
          : "medium",
        order: Number(phase.order) || pIndex + 1,
        tasks: Array.isArray(phase.tasks)
          ? phase.tasks.map((task: any, tIndex: number) => ({
              title: String(task.title || `Task ${tIndex + 1}`),
              description: String(task.description || ""),
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
            }))
          : [],
      }));
    } catch (err: any) {
      console.error("Failed to parse AI JSON response:", content);
      throw new Error(
        `Failed to parse AI response into roadmap format: ${err.message}`,
      );
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

  public async generateArchitecture(
    input: GenerateArchitectureInput | string
  ): Promise<{ nodes: IArchitectureNode[]; edges: IArchitectureEdge[] }> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is not set in environment variables");
    }

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
    const model = process.env.OPENROUTER_MODEL || "openrouter/free";

    const requestBody: any = {
      model: model,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    };

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://archer.app",
        "X-Title": "Archer Project Management",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter Architecture API Error:", response.status, errorText);
      throw new Error(
        `OpenRouter API error (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    let content = choice?.message?.content || choice?.text || choice?.message?.reasoning;

    if (Array.isArray(content)) {
      content = content.map((part: any) => part.text || String(part)).join("");
    }

    if (!content) {
      console.error("OpenRouter raw response payload:", JSON.stringify(data, null, 2));
      throw new Error("No content received from OpenRouter API");
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

