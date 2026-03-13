import OpenAI from "openai";

const deepseek = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function generateCompletion(
  prompt: string,
  options?: { maxTokens?: number; temperature?: number }
): Promise<string> {
  const response = await deepseek.chat.completions.create({
    model: "deepseek-chat",
    messages: [{ role: "user", content: prompt }],
    max_tokens: options?.maxTokens ?? 4096,
    temperature: options?.temperature ?? 0.3,
  });

  return response.choices[0]?.message?.content || "";
}

export default deepseek;
