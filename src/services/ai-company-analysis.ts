import { generateCompletion } from "@/lib/deepseek";

export interface CompanyAnalysisResult {
  companyName: string;
  founded: string;
  industry: string;
  size: string;
  headquarters: string;
  otherLocations: string[];
  website: string;
  phone: string;
  email: string;
  linkedin: string;
  overview: string;
  history: string;
  culture: string;
  employeeReviews: {
    positive: string[];
    negative: string[];
    overallRating: number;
  };
  salaryInfo: {
    position: string;
    average: string;
    range: string;
    benefits: string[];
  };
  interviewProcess: string;
  interviewTips: string[];
}

export async function analyzeCompany(
  companyName: string,
  position: string
): Promise<string> {
  const prompt = `Você é um especialista em análise empresarial e mercado de trabalho brasileiro.

Faça uma análise completa da empresa "${companyName}" para um candidato que está se candidatando à vaga de "${position}".

Retorne APENAS um JSON válido (sem markdown, sem explicações):

{
  "companyName": "<nome oficial da empresa>",
  "founded": "<ano de fundação ou vazio>",
  "industry": "<setor/segmento de atuação>",
  "size": "<porte: ex: 1.000-5.000 funcionários>",
  "headquarters": "<sede principal: cidade, estado, país>",
  "otherLocations": ["<outra cidade/país se houver>"],
  "website": "<site oficial ou vazio>",
  "phone": "<telefone central ou vazio>",
  "email": "<e-mail de contato ou vazio>",
  "linkedin": "<URL do LinkedIn corporativo ou vazio>",
  "overview": "<visão geral completa: o que a empresa faz, missão, posição no mercado — 2 a 3 parágrafos>",
  "history": "<história: como foi fundada, principais marcos, crescimento e expansão>",
  "culture": "<cultura organizacional: ambiente de trabalho, valores praticados, diversidade, inovação, gestão>",
  "employeeReviews": {
    "positive": ["<ponto positivo relatado por funcionários 1>", "<ponto positivo 2>", "<ponto positivo 3>", "<ponto positivo 4>"],
    "negative": ["<ponto negativo relatado por funcionários 1>", "<ponto negativo 2>", "<ponto negativo 3>"],
    "overallRating": <nota geral de 1.0 a 5.0 baseada em avaliações públicas como Glassdoor/Indeed>
  },
  "salaryInfo": {
    "position": "${position}",
    "average": "<salário médio estimado: ex: R$ 8.500/mês>",
    "range": "<faixa salarial: ex: R$ 6.000 – R$ 12.000/mês>",
    "benefits": ["<benefício 1>", "<benefício 2>", "<benefício 3>", "<benefício 4>", "<benefício 5>"]
  },
  "interviewProcess": "<descrição detalhada do processo seletivo: etapas, testes técnicos, dinâmicas, entrevistas, duração média>",
  "interviewTips": ["<dica prática para se sair bem na entrevista 1>", "<dica 2>", "<dica 3>", "<dica 4>"]
}

Baseie-se em informações publicamente disponíveis. Use o mercado brasileiro como referência para salários. Se não souber dados específicos como telefone ou e-mail, deixe string vazia. Seja detalhado e útil para o candidato.`;

  return generateCompletion(prompt, { temperature: 0.3, maxTokens: 3000 });
}
