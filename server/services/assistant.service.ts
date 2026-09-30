import "dotenv/config";

const system_prompt = `You are a concise, expert System Designer & Software Architect consultant.

CRITICAL RESPONSE RULES:
1. KEEP ALL RESPONSES SHORT, CONCISE, AND TO THE POINT. Avoid walls of text, fluff, or exhaustive preambles.
2. Limit lists to 3-5 key points max. Be direct and punchy.
3. DO NOT output internal safety assessment lines (such as "User Safety: safe" or "Response Safety: safe").
4. DO NOT output internal reasoning tags (<think>...</think>) or tool call markers (<|tool_call_start|>...).
5. Use clean markdown formatting (bullet points, bold text, code snippets).`;

export interface IChatMessagePayload {
  role: string;
  content: string;
}

export class ChatService {
  private baseUrl: string = "https://openrouter.ai/api/v1/chat/completions";

  /**
   * Helper to clean AI response string from thinking tags, tool call blocks, and safety headers
   */
  private cleanAiResponse(rawContent: string): string {
    if (!rawContent) return "";
    let str = rawContent.trim();

    // 1. Remove reasoning / thinking tags <think>...</think>
    str = str.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
    str = str.replace(/<think>[\s\S]*/gi, "").trim();

    // 2. Remove tool call blocks <|tool_call_start|>...<|tool_call_end|>
    str = str.replace(/<\|tool_call_start\|>[\s\S]*?<\|tool_call_end\|>/gi, "").trim();
    str = str.replace(/<\|tool_call_start\|>[\s\S]*/gi, "").trim();

    // 3. Remove safety assessment lines (e.g. "User Safety: safe", "Response Safety: safe")
    str = str.replace(/^(?:User Safety|Response Safety|Safety Assessment|Content Safety):.*$\n?/gim, "").trim();

    return str;
  }

  public async getResponse(
    conversations: IChatMessagePayload[],
    customSystemPrompt?: string
  ): Promise<string> {
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const model = process.env.OPENROUTER_MODEL || "openrouter/free";

    const promptToUse = customSystemPrompt || system_prompt;

    // Normalize and clean incoming conversation history to avoid passing corrupted history
    const formattedConversations = (conversations || []).map((msg) => ({
      role: msg.role === "assistant" || msg.role === "system" ? "assistant" : "user",
      content: this.cleanAiResponse(String(msg.content || "")),
    }));

    // Prepend system prompt
    const messages = [
      { role: "system", content: promptToUse },
      ...formattedConversations,
    ];

    // 1. Try OpenRouter API if key is available
    if (openRouterKey && openRouterKey.trim().length > 0) {
      try {
        const response = await fetch(this.baseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openRouterKey.trim()}`,
            "HTTP-Referer": "https://archer.app",
            "X-Title": "Archer System Designer Assistant",
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.6,
            max_tokens: 1000,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`OpenRouter API error status ${response.status}: ${errorText}`);
          throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        const choice = data.choices?.[0];
        let rawContent = choice?.message?.content || choice?.text;

        if (Array.isArray(rawContent)) {
          rawContent = rawContent.map((part: any) => part.text || String(part)).join("");
        }

        const cleanedContent = this.cleanAiResponse(String(rawContent || ""));

        if (cleanedContent && cleanedContent.length > 0) {
          return cleanedContent;
        }

        console.warn("OpenRouter content empty after cleaning safety/tool headers. Attempting fallback...");
      } catch (err: any) {
        console.warn("OpenRouter request failed:", err.message);
        if (!geminiKey) {
          throw err;
        }
      }
    }

    // 2. Fallback to Direct Google Gemini API if GEMINI_API_KEY is available
    if (geminiKey && geminiKey.trim().length > 0) {
      try {
        const geminiModel = process.env.GEMINI_MODEL || "gemini-1.5-flash";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey.trim()}`;

        // Format for Gemini contents API
        const contents = formattedConversations.map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        }));

        const geminiResponse = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: promptToUse }],
            },
            contents,
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 1000,
            },
          }),
        });

        if (geminiResponse.ok) {
          const data = await geminiResponse.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          const cleanedGemini = this.cleanAiResponse(String(candidateText || ""));
          if (cleanedGemini && cleanedGemini.length > 0) {
            return cleanedGemini;
          }
        } else {
          const errText = await geminiResponse.text();
          console.warn(`Gemini API returned error (${geminiResponse.status}): ${errText}`);
        }
      } catch (geminiErr: any) {
        console.warn("Gemini API fallback failed:", geminiErr.message);
      }
    }

    if (!openRouterKey && !geminiKey) {
      throw new Error(
        "Neither OPENROUTER_API_KEY nor GEMINI_API_KEY is configured in server environment."
      );
    }

    throw new Error("Failed to generate AI response from AI provider.");
  }
}

export const chatService = new ChatService();