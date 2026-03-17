import OpenAI from "openai";

const deepseek = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export interface CacheMetrics {
  promptTokens: number;
  completionTokens: number;
  cacheHitTokens: number;
  cacheMissTokens: number;
  cacheHitRate: number;
}

export interface CompletionWithCache {
  content: string;
  cache: CacheMetrics;
}

/**
 * Gera uma completion otimizada para cache hit do DeepSeek.
 *
 * Como funciona o cache do DeepSeek:
 * - Prefixos idênticos desde o token 0 são cacheados automaticamente
 * - Mínimo de 64 tokens no prefixo para ativar cache
 * - Tokens cacheados custam ~10x menos ($0.014/M vs $0.14/M)
 * - O system message é ideal para cache: é estático e vem primeiro
 *
 * Separar system (instruções estáticas) de user (dados dinâmicos)
 * maximiza o cache hit em chamadas repetidas da mesma feature.
 */
export async function generateWithCache(
  systemPrompt: string,
  userMessage: string,
  options?: { maxTokens?: number; temperature?: number }
): Promise<CompletionWithCache> {
  const response = await deepseek.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    max_tokens: options?.maxTokens ?? 4096,
    temperature: options?.temperature ?? 0.3,
  });

  const usage = response.usage as {
    prompt_tokens?: number;
    completion_tokens?: number;
    prompt_cache_hit_tokens?: number;
    prompt_cache_miss_tokens?: number;
  } | undefined;

  const promptTokens = usage?.prompt_tokens ?? 0;
  const completionTokens = usage?.completion_tokens ?? 0;
  const cacheHitTokens = usage?.prompt_cache_hit_tokens ?? 0;
  const cacheMissTokens = usage?.prompt_cache_miss_tokens ?? 0;

  const cacheHitRate = promptTokens > 0
    ? Math.round((cacheHitTokens / promptTokens) * 100)
    : 0;

  console.log(
    `[DeepSeek Cache] prompt=${promptTokens} | hit=${cacheHitTokens} | miss=${cacheMissTokens} | rate=${cacheHitRate}%`
  );

  return {
    content: response.choices[0]?.message?.content || "",
    cache: {
      promptTokens,
      completionTokens,
      cacheHitTokens,
      cacheMissTokens,
      cacheHitRate,
    },
  };
}

/**
 * Gera uma completion simples (sem separação system/user).
 * Para features que não precisam de otimização de cache.
 */
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
