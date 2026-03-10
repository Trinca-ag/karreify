import { geminiModel } from "@/lib/gemini";

export async function analyzeResume(resumeText: string): Promise<string> {
  const prompt = `Você é um especialista em recursos humanos e análise de currículos profissionais.
Analise o seguinte currículo e retorne um JSON válido com a seguinte estrutura:

{
  "extractedData": {
    "personalInfo": {
      "name": "",
      "email": "",
      "phone": "",
      "location": "",
      "linkedin": "",
      "portfolio": ""
    },
    "objective": "",
    "experience": [
      {
        "company": "",
        "position": "",
        "startDate": "",
        "endDate": "",
        "current": false,
        "description": "",
        "achievements": []
      }
    ],
    "education": [
      {
        "institution": "",
        "degree": "",
        "field": "",
        "startDate": "",
        "endDate": "",
        "description": ""
      }
    ],
    "skills": [],
    "languages": [{ "name": "", "level": "" }],
    "courses": [{ "name": "", "institution": "", "completionDate": "", "certificate": false }],
    "projects": [{ "name": "", "description": "", "technologies": [], "url": "" }]
  },
  "analysis": {
    "overallScore": 0,
    "structure": {
      "score": 0,
      "organization": "",
      "clarity": "",
      "hierarchy": "",
      "size": "",
      "scanability": ""
    },
    "content": {
      "score": 0,
      "missingInfo": [],
      "vagueDescriptions": [],
      "missingMetrics": [],
      "poorExplanations": [],
      "repeatedSkills": []
    },
    "language": {
      "score": 0,
      "spellingErrors": [],
      "grammarErrors": [],
      "poorStructure": [],
      "unprofessionalLanguage": []
    },
    "strengths": [],
    "weaknesses": [],
    "suggestions": [],
    "rewriteSuggestions": [
      {
        "original": "",
        "suggested": "",
        "reason": ""
      }
    ]
  }
}

Seja detalhado e específico nas análises. A pontuação geral deve ser de 0 a 100.
Responda APENAS com o JSON, sem markdown ou texto adicional.

Currículo:
${resumeText}`;

  const result = await geminiModel.generateContent(prompt);
  const response = result.response;
  return response.text();
}

export async function createResumeFromData(formData: string): Promise<string> {
  const prompt = `Você é um especialista em criação de currículos profissionais otimizados para ATS.
Com base nos dados fornecidos, crie um currículo completo, profissional e otimizado.

Retorne um JSON válido com a seguinte estrutura:
{
  "resumeData": {
    "personalInfo": { "name": "", "email": "", "phone": "", "location": "", "linkedin": "", "portfolio": "" },
    "objective": "",
    "experience": [{ "company": "", "position": "", "startDate": "", "endDate": "", "current": false, "description": "", "achievements": [] }],
    "education": [{ "institution": "", "degree": "", "field": "", "startDate": "", "endDate": "" }],
    "skills": [],
    "languages": [{ "name": "", "level": "" }],
    "courses": [],
    "projects": []
  },
  "formattedText": "Texto formatado do currículo completo"
}

Otimize as descrições de experiência com verbos de ação e métricas quando possível.
Responda APENAS com o JSON, sem markdown.

Dados do usuário:
${formData}`;

  const result = await geminiModel.generateContent(prompt);
  return result.response.text();
}

export async function adaptResumeForJob(
  resumeText: string,
  jobDescription: string
): Promise<string> {
  const prompt = `Você é um especialista em adequação de currículos para vagas específicas.
Analise o currículo e a descrição da vaga abaixo, e adapte o currículo para maximizar a compatibilidade.

Retorne um JSON válido:
{
  "compatibilityScore": 0,
  "keywords": [],
  "adaptedResume": {
    "personalInfo": { "name": "", "email": "", "phone": "", "location": "" },
    "objective": "",
    "experience": [{ "company": "", "position": "", "startDate": "", "endDate": "", "current": false, "description": "", "achievements": [] }],
    "education": [{ "institution": "", "degree": "", "field": "", "startDate": "", "endDate": "" }],
    "skills": [],
    "languages": [],
    "courses": [],
    "projects": []
  },
  "suggestions": [],
  "changes": [
    { "section": "", "original": "", "adapted": "", "reason": "" }
  ]
}

A pontuação de compatibilidade é de 0 a 100.
Responda APENAS com o JSON, sem markdown.

Currículo:
${resumeText}

Descrição da vaga:
${jobDescription}`;

  const result = await geminiModel.generateContent(prompt);
  return result.response.text();
}

export async function improveResumeSection(
  section: string,
  content: string,
  context: string
): Promise<string> {
  const prompt = `Você é um especialista em currículos. Melhore a seguinte seção do currículo.
Seção: ${section}
Contexto: ${context}
Conteúdo atual:
${content}

Retorne um JSON:
{
  "improved": "texto melhorado",
  "changes": ["lista de mudanças feitas"],
  "tips": ["dicas adicionais"]
}

Responda APENAS com o JSON.`;

  const result = await geminiModel.generateContent(prompt);
  return result.response.text();
}
