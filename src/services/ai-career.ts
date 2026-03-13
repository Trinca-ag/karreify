import { generateCompletion } from "@/lib/deepseek";

export async function generateCareerRoadmap(data: {
  currentRole: string;
  currentArea: string;
  experienceLevel: string;
  targetRole: string;
  timeline: string;
}): Promise<string> {
  const prompt = `Você é um especialista em planejamento de carreira e desenvolvimento profissional.
Crie um roadmap detalhado de carreira com base nas informações:

Cargo atual: ${data.currentRole}
Área: ${data.currentArea}
Nível de experiência: ${data.experienceLevel}
Cargo desejado: ${data.targetRole}
Prazo: ${data.timeline}

Retorne um JSON válido:
{
  "roadmap": [
    {
      "level": 1,
      "title": "título da fase",
      "description": "descrição da fase",
      "duration": "duração estimada",
      "tasks": [
        {
          "id": "task-1",
          "title": "título da tarefa",
          "description": "descrição detalhada",
          "completed": false,
          "points": 10
        }
      ],
      "courses": ["curso 1", "curso 2"],
      "certifications": ["certificação 1"],
      "skills": ["habilidade 1", "habilidade 2"],
      "projects": ["projeto prático 1"],
      "networking": ["ação de networking 1"]
    }
  ],
  "totalPoints": 0,
  "gamification": {
    "badges": [
      { "name": "nome do badge", "description": "como conquistar", "pointsRequired": 0 }
    ],
    "levels": [
      { "name": "nome do nível", "pointsRequired": 0 }
    ]
  },
  "summary": "resumo geral do roadmap"
}

Crie pelo menos 4 fases com tarefas específicas e mensuráveis.
Responda APENAS com o JSON, sem markdown.`;

  return generateCompletion(prompt, { temperature: 0.4 });
}
