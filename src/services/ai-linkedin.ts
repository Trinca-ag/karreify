import { generateCompletion } from "@/lib/deepseek";

export async function analyzeLinkedInProfile(profileData: string): Promise<string> {
  const prompt = `Você é um especialista sênior em otimização de perfis do LinkedIn e personal branding.

Analise as informações do perfil do LinkedIn fornecidas. Os dados podem ser completos ou parciais (apenas dados públicos visíveis sem login). Em qualquer caso, forneça a análise mais detalhada e útil possível, inferindo padrões e dando recomendações específicas com base no que está disponível.

Retorne APENAS um JSON válido com esta estrutura (sem markdown, sem explicações):

{
  "overallScore": <número 0-100>,
  "profileStructure": {
    "clarity": "<análise da clareza e objetividade do perfil>",
    "organization": "<análise da organização e fluxo das informações>",
    "professionalConsistency": "<análise da consistência da narrativa profissional>"
  },
  "seo": {
    "score": <número 0-100>,
    "relevantKeywords": ["<palavra-chave>"],
    "headlineOptimization": "<análise detalhada do headline atual e como otimizá-lo>",
    "aboutOptimization": "<análise da seção Sobre e como melhorá-la para SEO>"
  },
  "sections": {
    "photo": "<recomendação sobre foto profissional>",
    "headline": "<análise e dicas específicas para o headline>",
    "about": "<análise e dicas para a seção Sobre>",
    "experience": "<análise das experiências e como descrevê-las melhor>",
    "education": "<análise da formação>",
    "skills": "<análise das habilidades e quais adicionar>",
    "certifications": "<análise de certificações relevantes para a área>"
  },
  "suggestedHeadline": "<headline otimizado, específico e atrativo, máximo 220 caracteres>",
  "suggestedAbout": "<seção Sobre completa e otimizada, entre 200-300 palavras, na primeira pessoa, com call-to-action>",
  "recommendedKeywords": ["<keyword relevante para a área>"],
  "improvements": ["<melhoria específica e acionável>"],
  "strengths": ["<ponto forte identificado>"]
}

Dados do perfil:
${profileData}`;

  return generateCompletion(prompt, { temperature: 0.2 });
}
