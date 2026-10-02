import "dotenv/config";

export class GroqService {
  private readonly baseUrl = "https://api.groq.com/openai/v1/chat/completions";

  public async generateJson(systemPrompt: string, userPrompt: string, maxTokens = 4000): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY?.trim();
    if (!apiKey) throw new Error("GROQ_API_KEY is not configured");

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) throw new Error("Groq API error (" + response.status + "): " + (await response.text()).slice(0, 300));
    const content = (await response.json()).choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) throw new Error("Groq returned no content");
    return content.trim();
  }
}

export const groqService = new GroqService();
