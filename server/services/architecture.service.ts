import { IArchitectureEdge, IArchitectureNode } from "../models/architecture.model";
import { OPENROUTER_PROMPTS } from "../prompts/openRouter.prompts";
import { GenerateArchitectureInput, openRouterService } from "./openRouter.service";
import { geminiService } from "./gemini.service";
import { groqService } from "./groq.service";

type ArchitectureResult = { nodes: IArchitectureNode[]; edges: IArchitectureEdge[] };

export class ArchitectureService {
  private readonly nodeTypes = new Set([
    "frontend", "backend", "api", "database", "cache", "queue", "storage", "service",
    "microservice", "auth", "load-balancer", "cdn", "worker", "container",
    "external-service", "ai-service", "custom",
  ]);
  private readonly edgeTypes = new Set([
    "data-flow", "http", "websocket", "event", "message-queue", "database-query",
    "dependency", "async", "custom",
  ]);

  public async generate(input: GenerateArchitectureInput | string): Promise<ArchitectureResult> {
    const details = this.formatProjectDetails(input);
    const systemPrompt = OPENROUTER_PROMPTS.generateArchitectureSystemPrompt;
    const userPrompt = OPENROUTER_PROMPTS.generateSystemArchiecture(details);
    const maxTokens = Number(process.env.OPENROUTER_MAX_TOKENS) || 4000;
    const failures: string[] = [];
    const providers = [
      { name: "Gemini", generate: () => geminiService.generateJson(systemPrompt, userPrompt, maxTokens) },
      { name: "Groq", generate: () => groqService.generateJson(systemPrompt, userPrompt, maxTokens) },
      { name: "OpenRouter", generate: () => openRouterService.generateJson(systemPrompt, userPrompt, maxTokens) },
    ];

    for (const provider of providers) {
      try {
        const architecture = this.normalize(this.parseJson(await provider.generate()));
        console.log("Architecture generated with " + provider.name);
        return architecture;
      } catch (error: any) {
        const message = error?.message || "Unknown provider error";
        failures.push(provider.name + ": " + message);
        console.warn("Architecture generation failed with " + provider.name + ": " + message);
      }
    }
    throw new Error("All architecture providers failed. " + failures.join(" | "));
  }

  private formatProjectDetails(input: GenerateArchitectureInput | string): string {
    if (typeof input === "string") return input;
    const stack = input.techStack;
    const category = (value: unknown) => Array.isArray(value)
      ? value.map((item: any) => item?.name || String(item)).join(", ")
      : "";
    const stackDetails = stack && typeof stack === "object"
      ? [
          category(stack.frontend) && "Frontend: " + category(stack.frontend),
          category(stack.backend) && "Backend: " + category(stack.backend),
          category(stack.database) && "Database: " + category(stack.database),
          category(stack.authentication) && "Authentication: " + category(stack.authentication),
          category(stack.otherServices) && "Other Services: " + category(stack.otherServices),
        ].filter(Boolean).join("\n")
      : "";
    return [
      input.prompt && "User Prompt / Requirement: " + input.prompt,
      input.projectName && "Project Name: " + input.projectName,
      input.projectDescription && "Description: " + input.projectDescription,
      input.projectType && "Project Type: " + input.projectType,
      stackDetails || (stack ? "Tech Stack: " + JSON.stringify(stack) : ""),
    ].filter(Boolean).join("\n") || "Generate a modern full-stack web application architecture.";
  }

  private parseJson(content: string): any {
    const cleaned = content.replace(/<think>[\s\S]*?<\/think>/gi, "").replace(new RegExp("\\x60\\x60\\x60(?:json)?", "gi"), "").trim();
    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed?.nodes)) return parsed;
    } catch { }
    for (let start = 0; start < cleaned.length; start++) {
      if (cleaned[start] !== "{") continue;
      let depth = 0;
      let inString = false;
      let escaped = false;
      for (let end = start; end < cleaned.length; end++) {
        const char = cleaned[end];
        if (escaped) { escaped = false; continue; }
        if (char === "\\") { escaped = true; continue; }
        if (char === '"') { inString = !inString; continue; }
        if (inString) continue;
        if (char === "{") depth++;
        if (char === "}") depth--;
        if (depth === 0) {
          try {
            const parsed = JSON.parse(cleaned.slice(start, end + 1));
            if (Array.isArray(parsed?.nodes)) return parsed;
          } catch { }
          break;
        }
      }
    }
    throw new Error("Provider response did not contain valid JSON");
  }

  private normalize(value: any): ArchitectureResult {
    if (!Array.isArray(value?.nodes) || value.nodes.length === 0) {
      throw new Error("Architecture JSON has no nodes");
    }
    const ids = new Set<string>();
    const nodes = value.nodes.filter((node: any) => node && typeof node === "object").map((node: any, index: number) => {
      const baseId = String(node.id || "node_" + (index + 1)).trim() || "node_" + (index + 1);
      const id = ids.has(baseId) ? baseId + "_" + (index + 1) : baseId;
      ids.add(id);
      const type = this.nodeTypes.has(String(node.type)) ? node.type : "service";
      return {
        id,
        type,
        position: {
          x: typeof node.position?.x === "number" ? node.position.x : 100 + (index % 5) * 450,
          y: typeof node.position?.y === "number" ? node.position.y : 100 + Math.floor(index / 5) * 220,
        },
        data: {
          label: String(node.data?.label || "Component " + (index + 1)),
          description: String(node.data?.description || ""),
          category: String(node.data?.category || "Service"),
          technology: String(node.data?.technology || ""),
          technologies: Array.isArray(node.data?.technologies) ? node.data.technologies.map(String) : [],
          color: String(node.data?.color || "#3b82f6"),
        },
        width: typeof node.width === "number" ? node.width : 220,
        height: typeof node.height === "number" ? node.height : 120,
      } as IArchitectureNode;
    });

    if (nodes.length === 0) throw new Error("Architecture JSON has no usable nodes");
    const edges = (Array.isArray(value.edges) ? value.edges : [])
      .filter((edge: any) => edge && ids.has(String(edge.source)) && ids.has(String(edge.target)))
      .map((edge: any, index: number) => ({
        id: String(edge.id || "edge_" + (index + 1)),
        source: String(edge.source),
        target: String(edge.target),
        type: this.edgeTypes.has(String(edge.type)) ? edge.type : "http",
        label: String(edge.label || ""),
        animated: typeof edge.animated === "boolean" ? edge.animated : true,
        data: {
          protocol: String(edge.data?.protocol || ""),
          method: String(edge.data?.method || ""),
          dataType: String(edge.data?.dataType || ""),
          description: String(edge.data?.description || ""),
          direction: ["request", "response", "bidirectional"].includes(edge.data?.direction) ? edge.data.direction : "request",
        },
      } as IArchitectureEdge));
    return { nodes, edges };
  }
}

export const architectureService = new ArchitectureService();
