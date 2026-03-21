import { generateCompletion } from "@/lib/deepseek";

export interface CoverLetterResult {
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  jobTitle: string;
  companyName: string;
  subject: string;
  coverLetter: string;
}

export async function generateCoverLetter(
  resumeText: string,
  companyName: string,
  jobDescription: string
): Promise<string> {
  const prompt = `Você é um especialista em redação profissional e recrutamento no mercado brasileiro.

Com base no currículo, nome da empresa e descrição da vaga fornecidos, gere uma carta de apresentação profissional, personalizada e convincente em português brasileiro.

A carta deve:
- Ser natural, autêntica e não genérica
- Destacar as experiências e habilidades do candidato que são mais relevantes para a vaga
- Demonstrar conhecimento sobre a empresa e entusiasmo genuíno
- Ter tom profissional mas humano
- Ter entre 3 e 5 parágrafos bem desenvolvidos
- Terminar com uma chamada para ação (solicitar entrevista)

Retorne APENAS um JSON válido (sem markdown, sem explicações):

{
  "candidateName": "<nome completo extraído do currículo>",
  "candidateEmail": "<email extraído do currículo ou vazio>",
  "candidatePhone": "<telefone extraído do currículo ou vazio>",
  "jobTitle": "<cargo/título da vaga extraído da descrição>",
  "companyName": "<nome da empresa>",
  "subject": "<assunto para email: ex: Candidatura para Desenvolvedor Backend - João Silva>",
  "coverLetter": "<texto completo da carta, com parágrafos separados por \\n\\n>"
}

Currículo do candidato:
${resumeText}

Empresa: ${companyName}

Descrição da vaga:
${jobDescription}`;

  return generateCompletion(prompt, { temperature: 0.4, maxTokens: 2000 });
}
