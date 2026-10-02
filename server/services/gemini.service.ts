import "dotenv/config";

export class GeminiService {
  public async generateJson(systemPrompt: string, userPrompt: string, maxTokens = 4000): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: maxTokens, responseMimeType: "application/json" },
      }),
    });

    if (!response.ok) throw new Error("Gemini API error (" + response.status + "): " + (await response.text()).slice(0, 300));
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("").trim();
    if (!text) throw new Error("Gemini returned no content (" + (data.candidates?.[0]?.finishReason || "unknown reason") + ")");
    return text;
  }
}

export const geminiService = new GeminiService();
