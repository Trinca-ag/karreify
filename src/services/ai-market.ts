import { generateCompletion } from "@/lib/deepseek";

export interface TrendingCareer {
  title: string;
  area: string;
  demandLevel: string;
  growth: string;
  avgSalary: string;
  description: string;
  skills: string[];
}

export interface TopSalaryCareer {
  title: string;
  area: string;
  avgSalary: string;
  seniorSalary: string;
  growth: string;
}

export interface MarketInsight {
  title: string;
  description: string;
  type: "oportunidade" | "tendencia" | "alerta";
}

export interface MarketData {
  updatedAt?: unknown;
  trendingCareers: TrendingCareer[];
  highestPaid: TopSalaryCareer[];
  hotSkills: string[];
  emergingAreas: string[];
  insights: MarketInsight[];
}

export async function generateMarketData(): Promise<string> {
  const currentYear = new Date().getFullYear();

  const prompt = `Você é um especialista em mercado de trabalho brasileiro e tendências de carreira.

Gere um relatório completo e atualizado sobre o mercado de trabalho no Brasil em ${currentYear}.

Retorne APENAS um JSON válido (sem markdown, sem explicações):

{
  "trendingCareers": [
    {
      "title": "<nome da carreira>",
      "area": "<área: ex: Tecnologia, Saúde, Finanças>",
      "demandLevel": "<Alta | Muito Alta | Explosiva>",
      "growth": "<crescimento ex: ↑ 42%>",
      "avgSalary": "<salário médio ex: R$ 9.500/mês>",
      "description": "<breve descrição do que faz e por que está em alta (2 frases)>",
      "skills": ["<skill 1>", "<skill 2>", "<skill 3>", "<skill 4>"]
    }
  ],
  "highestPaid": [
    {
      "title": "<cargo>",
      "area": "<área>",
      "avgSalary": "<salário médio>",
      "seniorSalary": "<salário sênior/especialista>",
      "growth": "<crescimento da demanda ex: ↑ 28%>"
    }
  ],
  "hotSkills": ["<habilidade 1>", "<habilidade 2>", "<habilidade 3>"],
  "emergingAreas": ["<área emergente 1>", "<área emergente 2>"],
  "insights": [
    {
      "title": "<título do insight>",
      "description": "<descrição detalhada (2-3 frases)>",
      "type": "<oportunidade | tendencia | alerta>"
    }
  ]
}

Requisitos:
- trendingCareers: exatamente 6 carreiras diferentes e variadas (não só TI)
- highestPaid: exatamente 6 carreiras com maiores remunerações no Brasil
- hotSkills: exatamente 16 habilidades mais demandadas pelo mercado
- emergingAreas: exatamente 5 áreas emergentes com alto potencial
- insights: exatamente 5 insights estratégicos (mix de oportunidade, tendencia e alerta)
- Use valores reais e atuais do mercado brasileiro em BRL
- Seja específico e útil para quem está planejando a carreira`;

  return generateCompletion(prompt, { temperature: 0.3, maxTokens: 3500 });
}
