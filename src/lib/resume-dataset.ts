// ── Dataset de currículos profissionais de referência ────
// Usados como few-shot examples no prompt para a IA.
// Cobrem 3 níveis: iniciante, intermediário, experiente.
// Área-agnóstico: exemplos de áreas distintas.

export const RESUME_EXAMPLES = [
  // ── INICIANTE ──────────────────────────────────────
  {
    level: "iniciante",
    resume: {
      basics: {
        name: "Ana Carolina Mendes",
        label: "Assistente Administrativa",
        email: "ana.mendes@email.com",
        phone: "(11) 98765-4321",
        location: "São Paulo - SP",
        summary: "Profissional em início de carreira com formação em Administração e experiência em rotinas administrativas, atendimento ao cliente e organização de documentos. Proativa, com facilidade para aprender novas ferramentas e processos.",
        linkedin: "linkedin.com/in/ana-mendes",
        github: "",
        website: ""
      },
      work: [
        {
          company: "Escritório Contábil Silva & Associados",
          position: "Estagiária Administrativa",
          startDate: "2024-03",
          endDate: "2025-02",
          location: "São Paulo - SP",
          highlights: [
            "Organizei e digitalizei mais de 2.000 documentos fiscais, reduzindo o tempo de busca em 40%",
            "Realizei atendimento telefônico a mais de 30 clientes por dia, mantendo índice de satisfação de 95%",
            "Auxiliei no controle de contas a pagar e receber utilizando Excel com tabelas dinâmicas",
            "Implementei sistema de arquivamento digital que eliminou o uso de 3 armários físicos"
          ]
        }
      ],
      education: [
        {
          institution: "Universidade Paulista (UNIP)",
          area: "Administração de Empresas",
          studyType: "Bacharelado",
          startDate: "2022-02",
          endDate: "2025-12",
          status: "Em andamento"
        }
      ],
      skills: [
        { category: "Produtividade", name: "Pacote Office (Word, Excel, PowerPoint)", level: "Intermediário" },
        { category: "Atendimento", name: "Atendimento ao Cliente", level: "Intermediário" },
        { category: "Organização", name: "Organização de Documentos", level: "Avançado" },
        { category: "Produtividade", name: "Google Workspace", level: "Intermediário" }
      ],
      projects: [],
      languages: [
        { language: "Português", fluency: "Nativo" },
        { language: "Inglês", fluency: "Básico" }
      ],
      certifications: [],
      volunteer: []
    }
  },

  // ── INTERMEDIÁRIO ──────────────────────────────────
  {
    level: "intermediário",
    resume: {
      basics: {
        name: "Rafael Oliveira Santos",
        label: "Analista de Marketing Digital",
        email: "rafael.santos@email.com",
        phone: "(21) 97654-3210",
        location: "Rio de Janeiro - RJ",
        summary: "Analista de Marketing Digital com 4 anos de experiência em gestão de campanhas, SEO e performance. Especializado em estratégias de aquisição e retenção que geraram aumento médio de 35% no ROI das campanhas gerenciadas. Certificado Google Ads e Meta Blueprint.",
        linkedin: "linkedin.com/in/rafael-santos",
        github: "",
        website: ""
      },
      work: [
        {
          company: "Agência Digital Impulse",
          position: "Analista de Marketing Digital Pleno",
          startDate: "2023-06",
          endDate: "Atual",
          location: "Rio de Janeiro - RJ",
          highlights: [
            "Gerencio portfólio de 12 clientes com investimento mensal total de R$ 180.000 em mídia paga",
            "Implementei estratégia de remarketing que aumentou a taxa de conversão em 28% em 3 meses",
            "Reduzi o custo por lead (CPL) médio em 22% através de otimização de segmentação e criativos",
            "Criei dashboards automatizados no Google Data Studio para reporting semanal de 8 contas"
          ]
        },
        {
          company: "Startup TechBrasil",
          position: "Assistente de Marketing",
          startDate: "2021-08",
          endDate: "2023-05",
          location: "Remoto",
          highlights: [
            "Executei campanhas de email marketing com taxa de abertura média de 32% (acima da média do setor de 21%)",
            "Produzi mais de 60 artigos otimizados para SEO que geraram aumento de 45% no tráfego orgânico em 6 meses",
            "Coordenei lançamento de produto digital que atingiu 500 vendas na primeira semana"
          ]
        }
      ],
      education: [
        {
          institution: "Universidade Federal do Rio de Janeiro (UFRJ)",
          area: "Comunicação Social - Publicidade",
          studyType: "Bacharelado",
          startDate: "2017-03",
          endDate: "2021-07",
          status: "Concluído"
        }
      ],
      skills: [
        { category: "Marketing", name: "Google Ads / Meta Ads", level: "Avançado" },
        { category: "Marketing", name: "SEO e Marketing de Conteúdo", level: "Avançado" },
        { category: "Analytics", name: "Google Analytics / GA4", level: "Avançado" },
        { category: "Marketing", name: "Email Marketing (RD Station, Mailchimp)", level: "Intermediário" },
        { category: "Conteúdo", name: "Copywriting", level: "Avançado" },
        { category: "Ferramentas", name: "Excel / Google Sheets", level: "Intermediário" }
      ],
      projects: [
        {
          name: "Campanha Black Friday 2024",
          description: "Liderei estratégia omnichannel para 5 clientes com ROAS médio de 8.2x e faturamento total de R$ 2.1M",
          highlights: [],
          technologies: ["Google Ads", "Meta Ads", "RD Station", "Google Analytics"],
          url: "",
          repository: ""
        }
      ],
      languages: [
        { language: "Português", fluency: "Nativo" },
        { language: "Inglês", fluency: "Avançado" },
        { language: "Espanhol", fluency: "Intermediário" }
      ],
      certifications: [],
      volunteer: []
    }
  },

  // ── EXPERIENTE ─────────────────────────────────────
  {
    level: "experiente",
    resume: {
      basics: {
        name: "Mariana Costa Ferreira",
        label: "Gerente de Projetos de TI",
        email: "mariana.ferreira@email.com",
        phone: "(31) 96543-2109",
        location: "Belo Horizonte - MG",
        summary: "Gerente de Projetos com mais de 10 anos de experiência liderando equipes multidisciplinares em projetos de transformação digital e desenvolvimento de software. Certificada PMP e CSM, com histórico de entregas dentro do prazo e orçamento em 95% dos projetos. Experiência em gestão de portfólios de até R$ 5M.",
        linkedin: "linkedin.com/in/mariana-ferreira",
        github: "",
        website: ""
      },
      work: [
        {
          company: "Banco Nacional S.A.",
          position: "Gerente de Projetos Sênior",
          startDate: "2021-01",
          endDate: "Atual",
          location: "Belo Horizonte - MG",
          highlights: [
            "Lidero portfólio de 6 projetos simultâneos com orçamento combinado de R$ 4.8M e equipe de 32 pessoas",
            "Conduzi migração do sistema de core banking para arquitetura de microsserviços, reduzindo downtime em 60%",
            "Implementei framework de gestão ágil (SAFe) que aumentou a velocidade de entrega em 40%",
            "Reduzi o turnover da equipe de 25% para 8% através de programa de mentoria e desenvolvimento"
          ]
        },
        {
          company: "Consultoria Tech Solutions",
          position: "Coordenadora de Projetos",
          startDate: "2017-04",
          endDate: "2020-12",
          location: "Belo Horizonte - MG",
          highlights: [
            "Gerenciei mais de 15 projetos de implementação de ERP para clientes de médio e grande porte",
            "Entreguei projeto de R$ 2.3M para indústria farmacêutica 2 semanas antes do prazo, gerando bônus de performance",
            "Estruturei PMO da empresa, padronizando processos e documentação para mais de 20 gerentes de projeto",
            "Negociei contratos com fornecedores que resultaram em economia de 18% nos custos de infraestrutura"
          ]
        },
        {
          company: "Empresa de Software ABC",
          position: "Analista de Projetos",
          startDate: "2014-06",
          endDate: "2017-03",
          location: "Belo Horizonte - MG",
          highlights: [
            "Coordenei sprints de desenvolvimento para 3 produtos SaaS com base de mais de 10.000 usuários",
            "Elaborei documentação técnica e funcional utilizada como referência por equipe de 15 desenvolvedores"
          ]
        }
      ],
      education: [
        {
          institution: "Fundação Getúlio Vargas (FGV)",
          area: "Gestão de Projetos",
          studyType: "MBA",
          startDate: "2018-03",
          endDate: "2019-12",
          status: "Concluído"
        },
        {
          institution: "Universidade Federal de Minas Gerais (UFMG)",
          area: "Sistemas de Informação",
          studyType: "Bacharelado",
          startDate: "2010-03",
          endDate: "2014-07",
          status: "Concluído"
        }
      ],
      skills: [
        { category: "Gestão", name: "Gestão de Projetos (PMBoK, Agile, SAFe)", level: "Avançado" },
        { category: "Gestão", name: "Liderança de Equipes", level: "Avançado" },
        { category: "Gestão", name: "Gestão de Orçamento", level: "Avançado" },
        { category: "Ferramentas", name: "Jira / Confluence / MS Project", level: "Avançado" },
        { category: "Gestão", name: "Gestão de Riscos", level: "Avançado" },
        { category: "Gestão", name: "Negociação com Stakeholders", level: "Avançado" },
        { category: "Ferramentas", name: "SQL / Power BI", level: "Intermediário" }
      ],
      projects: [
        {
          name: "Transformação Digital - Core Banking",
          description: "Liderei projeto de 18 meses para migração de sistema legado para cloud, impactando 2M+ de clientes com zero interrupção de serviço",
          highlights: [],
          technologies: ["AWS", "Kubernetes", "Java", "React"],
          url: "",
          repository: ""
        }
      ],
      languages: [
        { language: "Português", fluency: "Nativo" },
        { language: "Inglês", fluency: "Fluente" },
        { language: "Espanhol", fluency: "Intermediário" }
      ],
      certifications: [],
      volunteer: []
    }
  }
];

export const DATASET_VERSION = "v4";

export function getExamplesForPrompt(): string {
  return RESUME_EXAMPLES.map((ex) =>
    `=== EXEMPLO (${ex.level.toUpperCase()}) ===\n${JSON.stringify(ex.resume, null, 2)}`
  ).join("\n\n");
}
