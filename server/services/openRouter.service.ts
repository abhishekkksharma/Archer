import "dotenv/config";
import { IRoadmapPhase } from "../models/roadmap.model";
import { OPENROUTER_PROMPTS } from "../prompts/openRouter.prompts";

export interface GenerateRoadmapInput {
  name: string;
  description: string;
  type?: string;
  experienceLevel?: string;
  techStack?: any;
}

class OpenRouterService {
  private baseUrl: string = "https://openrouter.ai/api/v1/chat/completions";

  /**
   * Defensive helper to parse JSON, attempting repair if string was truncated by max_tokens limit
   */
  private parseOrRepairJson(rawContent: string): any {
    const cleaned = rawContent
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch (firstError) {
      console.warn("Standard JSON parse failed, attempting truncation repair...");

      let str = cleaned;

      // 1. If inside an unclosed string, close the quote
      const quoteCount = (str.match(/"/g) || []).length;
      if (quoteCount % 2 !== 0) {
        str += '"';
      }

      // 2. Remove any trailing dangling commas or key fragments
      str = str.replace(/,\s*$/, "").replace(/,\s*"[^"]*"?\s*:?\s*$/, "");

      // 3. Balance missing closing brackets & braces
      const openBrackets = (str.match(/\[/g) || []).length - (str.match(/\]/g) || []).length;
      const openBraces = (str.match(/\{/g) || []).length - (str.match(/\}/g) || []).length;

      for (let i = 0; i < openBraces; i++) str += "}";
      for (let i = 0; i < openBrackets; i++) str += "]";

      try {
        return JSON.parse(str);
      } catch (repairError) {
        // Fallback: extract any fully closed phase objects using regex
        const phaseMatches = cleaned.match(/\{\s*"phaseNumber"[\s\S]*?\}(?=\s*,\s*\{|\s*\])/g);
        if (phaseMatches && phaseMatches.length > 0) {
          const fallbackJson = `{"phases": [${phaseMatches.join(",")}]}`;
          try {
            return JSON.parse(fallbackJson);
          } catch (regexErr) {
            // throw original error if recovery fails
          }
        }
        throw firstError;
      }
    }
  }

  public async generateRoadMap(
    info: GenerateRoadmapInput | string
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
    const userPrompt = OPENROUTER_PROMPTS.generateRoadmapUserPrompt(projectDetails);

    const maxTokens = Number(process.env.OPENROUTER_MAX_TOKENS) || 2500;
    const model = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";

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
        response_format: { type: "json_object" },
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
      throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
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
      throw new Error(`Failed to parse AI response into roadmap format: ${err.message}`);
    }
  }
}

export const openRouterService = new OpenRouterService();
