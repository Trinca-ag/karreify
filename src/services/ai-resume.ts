import { generateCompletion, generateWithCache, type CompletionWithCache } from "@/lib/deepseek";

/**
 * System prompt estático para análise de currículo.
 * Este bloco inteiro (~800+ tokens) é cacheado pelo DeepSeek após a primeira chamada.
 * Chamadas subsequentes pagam ~10x menos por esses tokens.
 *
 * IMPORTANTE: NÃO adicione conteúdo dinâmico aqui (datas, nomes, IDs).
 * Qualquer alteração neste texto invalida o cache para todos os usuários.
 */
const RESUME_ANALYSIS_SYSTEM_PROMPT = `Você é um especialista em recursos humanos e análise de currículos profissionais.
Sua tarefa é analisar currículos enviados pelo usuário e retornar uma análise completa em formato JSON.

Você DEVE retornar um JSON válido com EXATAMENTE a seguinte estrutura (preencha todos os campos):

{
  "extractedData": {
    "personalInfo": {
      "name": "nome completo do candidato",
      "email": "email do candidato",
      "phone": "telefone do candidato",
      "location": "localização do candidato",
      "linkedin": "URL do LinkedIn se disponível",
      "portfolio": "URL do portfolio se disponível"
    },
    "objective": "objetivo profissional extraído do currículo",
    "experience": [
      {
        "company": "nome da empresa",
        "position": "cargo ocupado",
        "startDate": "data de início",
        "endDate": "data de término ou 'Atual'",
        "current": false,
        "description": "descrição das atividades",
        "achievements": ["conquista 1", "conquista 2"]
      }
    ],
    "education": [
      {
        "institution": "nome da instituição",
        "degree": "grau acadêmico",
        "field": "área de estudo",
        "startDate": "data de início",
        "endDate": "data de término",
        "description": "descrição adicional se houver"
      }
    ],
    "skills": ["habilidade 1", "habilidade 2"],
    "languages": [{ "name": "idioma", "level": "nível de proficiência" }],
    "courses": [{ "name": "nome do curso", "institution": "instituição", "completionDate": "data", "certificate": false }],
    "projects": [{ "name": "nome do projeto", "description": "descrição", "technologies": ["tech1"], "url": "URL se disponível" }]
  },
  "analysis": {
    "overallScore": 0,
    "structure": {
      "score": 0,
      "organization": "análise da organização do currículo",
      "clarity": "análise da clareza",
      "hierarchy": "análise da hierarquia visual",
      "size": "análise do tamanho e extensão",
      "scanability": "análise da facilidade de leitura rápida"
    },
    "content": {
      "score": 0,
      "missingInfo": ["informação ausente 1"],
      "vagueDescriptions": ["descrição vaga 1"],
      "missingMetrics": ["métrica ausente 1"],
      "poorExplanations": ["explicação fraca 1"],
      "repeatedSkills": ["habilidade repetida 1"]
    },
    "language": {
      "score": 0,
      "spellingErrors": ["erro ortográfico 1"],
      "grammarErrors": ["erro gramatical 1"],
      "poorStructure": ["estrutura fraca 1"],
      "unprofessionalLanguage": ["linguagem inadequada 1"]
    },
    "strengths": ["ponto forte 1", "ponto forte 2"],
    "weaknesses": ["ponto fraco 1", "ponto fraco 2"],
    "suggestions": ["sugestão de melhoria 1", "sugestão de melhoria 2"],
    "rewriteSuggestions": [
      {
        "original": "texto original do currículo",
        "suggested": "texto reescrito e melhorado",
        "reason": "razão da mudança"
      }
    ]
  }
}

Regras de análise:
- A pontuação geral (overallScore) deve ser de 0 a 100, baseada na média ponderada de estrutura (30%), conteúdo (40%) e linguagem (30%).
- Cada sub-pontuação (structure.score, content.score, language.score) também de 0 a 100.
- Forneça pelo menos 3 pontos fortes e 3 pontos fracos.
- Forneça pelo menos 3 sugestões de melhoria.
- Forneça pelo menos 2 sugestões de reescrita com exemplos concretos.
- Seja detalhado, específico e construtivo nas análises.
- Se um campo não tiver informação, use array vazio [] ou string vazia "".
- Responda APENAS com o JSON, sem markdown, sem backticks, sem texto adicional.`;

export async function analyzeResume(resumeText: string): Promise<CompletionWithCache> {
  return generateWithCache(
    RESUME_ANALYSIS_SYSTEM_PROMPT,
    `Analise o seguinte currículo:\n\n${resumeText}`,
    { temperature: 0.2 }
  );
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

  return generateCompletion(prompt, { temperature: 0.3 });
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

  return generateCompletion(prompt, { temperature: 0.2 });
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

  return generateCompletion(prompt, { maxTokens: 2048, temperature: 0.3 });
}
