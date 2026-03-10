import { geminiModel } from "@/lib/gemini";

export async function analyzeLinkedInProfile(profileData: string): Promise<string> {
  const prompt = `Você é um especialista em otimização de perfis do LinkedIn e personal branding.
Analise as informações do perfil do LinkedIn fornecidas e retorne um JSON válido com a seguinte estrutura:

{
  "overallScore": 0,
  "profileStructure": {
    "clarity": "análise da clareza do perfil",
    "organization": "análise da organização",
    "professionalConsistency": "análise da consistência profissional"
  },
  "seo": {
    "score": 0,
    "relevantKeywords": [],
    "headlineOptimization": "análise do headline atual",
    "aboutOptimization": "análise da seção sobre"
  },
  "sections": {
    "photo": "análise/recomendação sobre foto",
    "headline": "análise do headline",
    "about": "análise da seção sobre",
    "experience": "análise das experiências",
    "education": "análise da formação",
    "skills": "análise das habilidades",
    "certifications": "análise das certificações"
  },
  "suggestedHeadline": "sugestão de headline otimizado",
  "suggestedAbout": "sugestão de seção sobre otimizada",
  "recommendedKeywords": [],
  "improvements": [],
  "strengths": []
}

Seja detalhado e específico. Pontuações de 0 a 100.
Responda APENAS com o JSON, sem markdown.

Informações do perfil:
${profileData}`;

  const result = await geminiModel.generateContent(prompt);
  return result.response.text();
}
