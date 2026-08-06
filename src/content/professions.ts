import type { Metadata } from "next";
import type { Profession } from "./types";
import { PROFESSIONS_INDUSTRIA_CONSTRUCAO } from "./professions-industria-construcao";
import { PROFESSIONS_COMERCIO_ALIMENTACAO } from "./professions-comercio-alimentacao";
import { PROFESSIONS_CUIDADOS_SAUDE } from "./professions-cuidados-saude";
import { PROFESSIONS_CORPORATIVO } from "./professions-corporativo";

// Lote original de profissões. Os lotes seguintes ficam em arquivos próprios e
// entram no array exportado lá embaixo — evita um único arquivo gigante.
const PROFESSIONS_BASE: Profession[] = [
  {
    "slug": "desenvolvedor",
    "profession": "Desenvolvedor de Software",
    "metaTitle": "Modelo de Currículo para Desenvolvedor de Software (Exemplo Pronto 2026)",
    "h1": "Modelo de Currículo para Desenvolvedor de Software",
    "metaDescription": "Modelo de currículo para desenvolvedor com exemplo real, stack de tecnologias, projetos, GitHub, palavras-chave de ATS, faixa salarial e dicas para passar na triagem.",
    "intro": "O currículo de um desenvolvedor não vende cargos, vende impacto técnico: o que você construiu, com qual stack e qual resultado isso gerou (latência, uptime, conversão, custo). Recrutadores técnicos passam menos de 30 segundos na primeira triagem e, antes deles, um ATS filtra por palavras-chave de tecnologia. Este modelo mostra exatamente como estruturar stack, projetos, GitHub/portfólio e bullets de resultado para passar nos dois filtros.",
    "sampleResume": {
      "name": "Lucas Andrade Ferreira",
      "headline": "Desenvolvedor Full Stack Pleno | React, Node.js e AWS",
      "summary": "Desenvolvedor full stack com 5 anos de experiência construindo aplicações web escaláveis em React e Node.js. Foco em performance, qualidade de código e entrega contínua. Reduzi tempo de carregamento e custos de infraestrutura em produtos com mais de 100 mil usuários ativos, atuando em times ágeis com forte cultura de code review e testes automatizados.",
      "experience": [
        {
          "role": "Desenvolvedor Full Stack Pleno",
          "company": "Nuvem Tech Soluções",
          "period": "Mar 2022 - Atual",
          "bullets": [
            "Migrei o frontend monolítico para uma arquitetura em React + TypeScript com code splitting, reduzindo o tempo de carregamento inicial (LCP) de 4,2s para 1,6s.",
            "Desenvolvi APIs REST e GraphQL em Node.js/Express atendendo 1,2 mil requisições por segundo, com cache em Redis que reduziu a carga no banco PostgreSQL em 60%.",
            "Implementei pipeline de CI/CD no GitHub Actions com testes automatizados (Jest e Cypress), elevando a cobertura de 35% para 82% e cortando o tempo de deploy de 40 para 8 minutos.",
            "Refatorei consultas SQL críticas e adicionei índices, reduzindo a latência média de endpoints de relatório de 900ms para 180ms.",
            "Atuei em squad ágil (Scrum) com entregas quinzenais, conduzindo code reviews e mentorando 2 desenvolvedores juniores."
          ]
        },
        {
          "role": "Desenvolvedor Front-End Júnior",
          "company": "Agência Pixel Digital",
          "period": "Jan 2020 - Fev 2022",
          "bullets": [
            "Construí interfaces responsivas em React e Sass para mais de 15 projetos de clientes, seguindo padrões de acessibilidade (WCAG AA).",
            "Integrei o frontend com APIs REST e gateways de pagamento, aumentando a taxa de conversão de checkout em 18% após otimizações de UX.",
            "Adotei Storybook para documentar componentes reutilizáveis, reduzindo o retrabalho de UI entre projetos em cerca de 30%.",
            "Participei de dailies e plannings, registrando tarefas no Jira e colaborando com designers via Figma."
          ]
        }
      ],
      "education": [
        {
          "degree": "Bacharelado em Ciência da Computação",
          "institution": "Universidade Federal do Paraná (UFPR)",
          "period": "2016 - 2020"
        },
        {
          "degree": "Certificação AWS Certified Developer – Associate",
          "institution": "Amazon Web Services",
          "period": "2023"
        }
      ],
      "skills": [
        "JavaScript / TypeScript",
        "React / Next.js",
        "Node.js / Express",
        "PostgreSQL / Redis",
        "Docker / AWS",
        "GraphQL / REST",
        "Git / GitHub Actions (CI/CD)",
        "Jest / Cypress",
        "Scrum / Kanban"
      ]
    },
    "keySkills": [
      "JavaScript e TypeScript",
      "React, Next.js ou Vue",
      "Node.js e APIs REST/GraphQL",
      "Bancos de dados SQL e NoSQL (PostgreSQL, MongoDB, Redis)",
      "Git e fluxo de pull request/code review",
      "Docker e containers",
      "Cloud (AWS, GCP ou Azure)",
      "CI/CD e pipelines de deploy",
      "Testes automatizados (unitários, integração, e2e)",
      "Metodologias ágeis (Scrum/Kanban)",
      "Arquitetura e design de software (SOLID, microsserviços)",
      "Boas práticas de código limpo e performance"
    ],
    "atsKeywords": [
      "Desenvolvedor Full Stack",
      "Desenvolvedor Front-End",
      "Desenvolvedor Back-End",
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Python",
      "Java",
      "API REST",
      "GraphQL",
      "SQL",
      "PostgreSQL",
      "Docker",
      "AWS",
      "CI/CD",
      "Git",
      "Scrum",
      "Testes automatizados",
      "Microsserviços"
    ],
    "salaryNote": "No Brasil (2026), desenvolvedor júnior costuma ganhar entre R$ 3.000 e R$ 5.500; pleno fica na faixa de R$ 6.000 a R$ 11.000; e sênior geralmente entre R$ 12.000 e R$ 20.000+. Valores variam bastante por stack (back-end/dados e mobile tendem a pagar mais que front-end), regime (CLT vs. PJ), região e, principalmente, por contratos remotos para empresas estrangeiras pagando em dólar, que podem superar R$ 25.000.",
    "dos": [
      "Liste sua stack principal logo no topo (linguagens, frameworks, bancos, cloud) — é o que o ATS e o recrutador técnico buscam primeiro.",
      "Quantifique resultados técnicos: latência reduzida, cobertura de testes, requisições por segundo, queda de custo de infra, aumento de conversão.",
      "Inclua o link do GitHub e do portfólio/projetos no cabeçalho, e garanta que os repositórios tenham README e commits recentes.",
      "Descreva projetos reais (mesmo pessoais ou freelancer) com o problema, a solução técnica e o impacto.",
      "Adapte as palavras-chave do currículo à descrição de cada vaga (se pede 'Vue', não envie só 'React').",
      "Mostre maturidade de processo: code review, CI/CD, testes, versionamento e metodologia ágil usada."
    ],
    "donts": [
      "Não liste 30 tecnologias soltas em uma nuvem de tags sem contexto de uso ou nível de proficiência.",
      "Não descreva tarefas genéricas ('responsável por desenvolver sistemas') sem stack nem resultado.",
      "Não deixe o link do GitHub vazio, desatualizado ou cheio de repositórios de tutoriais copiados.",
      "Não exagere a senioridade colocando como 'avançado' algo que você usou uma vez — recrutadores validam no teste técnico.",
      "Não use design exótico, colunas duplas complexas ou ícones que quebram a leitura do ATS; prefira layout limpo em uma coluna.",
      "Não ignore soft skills relevantes ao time (comunicação, trabalho em squad), mas sem encher o currículo de adjetivos vazios."
    ],
    "faqs": [
      {
        "question": "Devo separar o currículo por front-end, back-end ou full stack?",
        "answer": "Sim. Direcione o título e o resumo para a vaga específica. Se você é full stack mas está se candidatando a uma vaga de back-end, destaque Node.js/Python, bancos e arquitetura no topo, e deixe o front em segundo plano. Um currículo focado passa melhor na triagem do que um genérico 'faço de tudo'."
      },
      {
        "question": "Preciso colocar o GitHub mesmo sem projetos famosos?",
        "answer": "Sim, desde que esteja apresentável. Recrutadores técnicos olham consistência de commits, README claro e código organizado — não estrelas. Tenha 2 ou 3 projetos bem documentados que demonstrem sua stack. Um GitHub com repositórios vazios ou só forks de tutoriais pesa mais contra do que a favor."
      },
      {
        "question": "Como mostro experiência se nunca trabalhei formalmente como dev?",
        "answer": "Use projetos pessoais, freelas, trabalhos de bootcamp e contribuições open source como 'experiência'. Descreva cada um com problema, stack e resultado, igual a uma experiência profissional. Clones funcionais de aplicações reais, um SaaS pequeno seu ou um bug corrigido em projeto open source valem muito para a primeira vaga."
      },
      {
        "question": "Quantas páginas o currículo de desenvolvedor deve ter?",
        "answer": "Uma página para júnior e pleno; duas no máximo para sênior com histórico longo. Foque nas experiências e projetos mais recentes e relevantes. Detalhes extensos de projetos podem ir para o portfólio ou GitHub, que você linka no currículo."
      },
      {
        "question": "Vale a pena incluir certificações como AWS ou Scrum?",
        "answer": "Sim, quando relevantes à vaga. Certificações de cloud (AWS, GCP, Azure) e algumas de plataformas específicas ajudam na triagem e em vagas que pedem essas competências. Já cursos curtos genéricos têm pouco peso — priorize os que comprovam uma skill exigida na descrição da vaga."
      },
      {
        "question": "Como lidar com palavras-chave de ATS sem 'forçar'?",
        "answer": "Extraia os termos técnicos da descrição da vaga (linguagens, frameworks, ferramentas, metodologias) e use-os naturalmente nos bullets de experiência e na seção de skills, sempre vinculados a algo que você realmente fez. Evite esconder palavras em texto branco ou repetir tags — ATS modernos e recrutadores detectam isso."
      }
    ]
  },
  {
    "slug": "enfermagem",
    "profession": "Enfermagem",
    "metaTitle": "Modelo de Currículo para Enfermagem 2026 | Enfermeiro e Técnico",
    "h1": "Modelo de Currículo para Enfermagem (Enfermeiro e Técnico de Enfermagem)",
    "metaDescription": "Modelo de currículo de Enfermagem pronto para preencher: COREN, especializações, setores hospitalares, procedimentos e habilidades. Exemplo real, palavras-chave de ATS e faixa salarial em R$.",
    "intro": "O currículo de Enfermagem é avaliado em segundos por coordenadores de enfermagem e setores de RH hospitalar, que procuram primeiro pelo número do COREN ativo, pela formação e pelos setores em que você já atuou. Diferente de outras áreas, aqui contam tanto a comprovação técnica (procedimentos, escalas, protocolos como NR-32, SAE, POPs) quanto as competências humanas no cuidado ao paciente. Este modelo mostra exatamente como estruturar essas informações para enfermeiro(a) e técnico(a) de enfermagem, com um exemplo real que você pode adaptar.",
    "sampleResume": {
      "name": "Mariana Oliveira dos Santos",
      "headline": "Enfermeira | COREN-SP 123.456 | UTI Adulto e Urgência/Emergência",
      "summary": "Enfermeira com 6 anos de experiência em UTI adulto e pronto-socorro de hospitais de grande porte. Especialista em Terapia Intensiva, com domínio de Sistematização da Assistência de Enfermagem (SAE), manejo de pacientes críticos em ventilação mecânica e gestão de equipe de técnicos. Foco em redução de eventos adversos e adesão a protocolos de segurança do paciente.",
      "experience": [
        {
          "role": "Enfermeira Assistencial - UTI Adulto",
          "company": "Hospital Santa Clara (250 leitos)",
          "period": "Mar 2021 - Atual",
          "bullets": [
            "Assistência a 10 leitos de UTI adulto em escala 12x36, com pacientes em ventilação mecânica invasiva, drogas vasoativas e hemodiálise contínua",
            "Implantei checklist de prevenção de PAV (pneumonia associada à ventilação) que reduziu a taxa da unidade de 9,2 para 4,1 por 1.000 ventiladores/dia em 12 meses",
            "Coordeno equipe de 6 técnicos de enfermagem por plantão, com escala, distribuição de leitos e educação continuada",
            "Responsável pela SAE completa: histórico, diagnósticos (NANDA), prescrição de enfermagem e evolução em prontuário eletrônico (Tasy)",
            "Atuo em passagem de plantão estruturada (SBAR) e auditoria diária de dispositivos (CVC, SVD, SNE) para prevenção de infecção"
          ]
        },
        {
          "role": "Técnica de Enfermagem - Pronto-Socorro",
          "company": "UPA Zona Leste",
          "period": "Jan 2019 - Fev 2021",
          "bullets": [
            "Acolhimento e classificação de risco (Protocolo de Manchester) de até 120 pacientes por plantão",
            "Realização de procedimentos: punção venosa periférica, coleta de exames, administração de medicação EV/IM/SC e aerossolterapia",
            "Auxílio em procedimentos de emergência: parada cardiorrespiratória (suporte à RCP), intubação e pequenas suturas",
            "Controle e checagem de carro de emergência e materiais de via aérea conforme POP da unidade"
          ]
        }
      ],
      "education": [
        {
          "degree": "Pós-graduação (Especialização) em Enfermagem em Terapia Intensiva",
          "institution": "Faculdade Israelita de Ciências da Saúde",
          "period": "2022 - 2023"
        },
        {
          "degree": "Bacharelado em Enfermagem",
          "institution": "Universidade Paulista (UNIP)",
          "period": "2014 - 2018"
        },
        {
          "degree": "Curso Técnico em Enfermagem",
          "institution": "ETEC - Centro Paula Souza",
          "period": "2012 - 2013"
        }
      ],
      "skills": [
        "SAE e diagnósticos de enfermagem (NANDA)",
        "Manejo de paciente crítico em ventilação mecânica",
        "Classificação de risco (Protocolo de Manchester)",
        "Segurança do paciente e prevenção de IRAS",
        "Suporte avançado de vida (ACLS/BLS)",
        "Prontuário eletrônico (Tasy/MV)",
        "Gestão de equipe e escalas",
        "NR-32 e biossegurança"
      ]
    },
    "keySkills": [
      "Sistematização da Assistência de Enfermagem (SAE)",
      "Administração de medicamentos (EV, IM, SC, VO)",
      "Punção venosa e acesso periférico",
      "Classificação de risco (Protocolo de Manchester)",
      "Manejo de paciente crítico e ventilação mecânica",
      "Segurança do paciente e prevenção de IRAS/eventos adversos",
      "Suporte básico e avançado de vida (BLS/ACLS)",
      "Curativos e prevenção de lesão por pressão",
      "Controle de sinais vitais e balanço hídrico",
      "Biossegurança e NR-32",
      "Prontuário eletrônico (Tasy, MV, Pixeon)",
      "Educação continuada e supervisão de equipe"
    ],
    "atsKeywords": [
      "COREN",
      "Enfermeiro",
      "Técnico de Enfermagem",
      "UTI",
      "Pronto-socorro",
      "SAE",
      "Ventilação mecânica",
      "Protocolo de Manchester",
      "Segurança do paciente",
      "Administração de medicamentos",
      "Punção venosa",
      "Curativos",
      "NR-32",
      "Prontuário eletrônico",
      "Suporte avançado de vida"
    ],
    "salaryNote": "No Brasil (2026), técnico(a) de enfermagem geralmente ganha de R$ 1.900 a R$ 3.200 (com adicionais de insalubridade e noturno podendo elevar o total). Enfermeiro(a) júnior costuma iniciar entre R$ 3.000 e R$ 4.500; pleno entre R$ 4.500 e R$ 7.000; e sênior/especialista (UTI, centro cirúrgico, coordenação) de R$ 7.000 a R$ 12.000 ou mais. Valores variam bastante por estado, porte do hospital (público, privado ou filantrópico) e adicionais. Acompanhe também o piso nacional da enfermagem em vigor na sua categoria.",
    "dos": [
      "Coloque o número do COREN ativo e a UF logo no topo, ao lado do nome (ex.: COREN-SP 123.456) — é a primeira coisa que o recrutador procura",
      "Liste os setores específicos em que atuou (UTI adulto, neonatal, centro cirúrgico, CME, pronto-socorro, clínica médica) em vez de dizer apenas 'experiência hospitalar'",
      "Cite procedimentos e protocolos concretos: SAE, punção, ventilação mecânica, Manchester, NR-32, prevenção de PAV e lesão por pressão",
      "Quantifique resultados sempre que possível: número de leitos, pacientes por plantão, redução de infecção ou de eventos adversos",
      "Mantenha certificações de vida e validade visíveis (BLS, ACLS, PALS, vacinação em dia) e diga se tem disponibilidade para escala 12x36 e plantões noturnos"
    ],
    "donts": [
      "Não envie o currículo sem o número do COREN ou com registro vencido/suspenso — isso elimina a candidatura na triagem",
      "Não confunda atribuições de técnico e de enfermeiro: prescrição de enfermagem, SAE e supervisão de equipe são privativas do enfermeiro",
      "Não use termos vagos como 'cuidei de pacientes' — especifique grau de complexidade, setor e procedimentos realizados",
      "Não omita a formação técnica nem registre cursos sem instituição e período; a banca confere a titulação",
      "Não exagere competências que você não domina (ex.: hemodiálise, ventilação) — isso é testado já na entrevista prática e nos primeiros plantões"
    ],
    "faqs": [
      {
        "question": "Preciso colocar o número do COREN no currículo?",
        "answer": "Sim, e ele deve estar em destaque, logo abaixo ou ao lado do nome, com a sigla do estado (ex.: COREN-RJ 654.321). O registro ativo é exigência legal para atuar e a maioria dos hospitais filtra os currículos por ele já na triagem. Se o registro estiver em outra UF e você for se candidatar em outro estado, mencione que fará a inscrição secundária."
      },
      {
        "question": "Qual a diferença entre o currículo de enfermeiro e o de técnico de enfermagem?",
        "answer": "O do enfermeiro deve destacar competências privativas como SAE, diagnósticos de enfermagem, prescrição de enfermagem, supervisão de equipe e gestão de escalas, além de especializações (pós-graduação). O do técnico deve focar na execução de procedimentos sob supervisão: administração de medicação, punção, curativos, coleta, sinais vitais e auxílio em procedimentos. Use o título correto da função no topo para não gerar dúvida."
      },
      {
        "question": "Como destacar especializações e cursos no currículo de enfermagem?",
        "answer": "Crie uma seção de Formação separando graduação, pós-graduação/especialização (ex.: Terapia Intensiva, Obstetrícia, Cardiologia, Saúde Pública, Centro Cirúrgico) e uma seção de Certificações para cursos de vida (BLS, ACLS, PALS) com a validade. Priorize o que tem relação direta com a vaga: para UTI, destaque a especialização em Terapia Intensiva e o ACLS antes de cursos genéricos."
      },
      {
        "question": "O que recrutadores de hospitais mais valorizam no currículo?",
        "answer": "COREN ativo, setores de atuação compatíveis com a vaga, domínio de protocolos de segurança do paciente, disponibilidade para escala (12x36, plantões noturnos e fins de semana) e experiência com o nível de complexidade exigido. Em hospitais que usam acreditação (como ONA), conhecimento de POPs, indicadores e protocolos institucionais conta muito. Resultados mensuráveis, como redução de IRAS, diferenciam você dos demais."
      },
      {
        "question": "Tenho pouca experiência. Como montar o currículo de enfermagem recém-formada?",
        "answer": "Valorize o estágio supervisionado e as práticas: cite os setores em que estagiou, a carga horária e os procedimentos que acompanhou ou realizou. Inclua a graduação, o COREN recém-emitido, cursos de vida (BLS/ACLS) e disponibilidade de horário. Um resumo objetivo dizendo o setor de interesse e a disposição para plantões ajuda o recrutador a te enquadrar rapidamente."
      }
    ]
  },
  {
    "slug": "vendedor",
    "profession": "Vendas",
    "metaTitle": "Modelo de Currículo para Vendas (Vendedor) | Exemplo Pronto 2026",
    "h1": "Modelo de Currículo para Vendas",
    "metaDescription": "Modelo de currículo para vendedor com exemplo real, bullets focados em metas batidas, CRM e técnicas de vendas. Veja habilidades, palavras-chave de ATS e faixa salarial.",
    "intro": "Em vendas, o currículo é a sua primeira demonstração de capacidade de fechar negócio: o recrutador precisa enxergar resultado em segundos. A diferença entre ser chamado ou descartado está em traduzir tudo em números — quanto você vendeu, quanto bateu da meta e qual ticket médio você sustentava. Este modelo mostra como transformar relacionamento com cliente, domínio de CRM e técnicas de prospecção em evidências concretas que passam no filtro do ATS e convencem o gestor comercial.",
    "sampleResume": {
      "name": "Rafael Oliveira Santos",
      "headline": "Executivo de Vendas | Consultor Comercial B2B | Inside Sales",
      "summary": "Profissional de vendas com 6 anos de experiência em vendas consultivas B2B e B2C, especializado em prospecção ativa, negociação e gestão de pipeline em CRM. Histórico consistente de superação de metas (média de 118% no acumulado dos últimos 3 anos) e expansão de carteira com foco em recompra e ticket médio.",
      "experience": [
        {
          "role": "Executivo de Vendas Pleno",
          "company": "Nexus Soluções Comerciais",
          "period": "Mar 2022 - Atual",
          "bullets": [
            "Superei a meta trimestral em 11 dos últimos 12 trimestres, com média de 121% de atingimento e pico de 147% no Q4/2024",
            "Aumentei o ticket médio da carteira de R$ 3.200 para R$ 4.850 (+51%) por meio de cross-sell e venda de planos anuais",
            "Reduzi o ciclo de vendas de 45 para 28 dias ao padronizar o follow-up e qualificar leads com metodologia BANT no HubSpot",
            "Gerenciei pipeline de mais de 80 oportunidades ativas mantendo taxa de conversão de lead qualificado para fechamento em 32%",
            "Recuperei 18 contas inativas em 2024, gerando R$ 240 mil em receita adicional via reativação e renegociação"
          ]
        },
        {
          "role": "Consultor de Vendas Júnior",
          "company": "Grupo Vértice Varejo",
          "period": "Jan 2020 - Fev 2022",
          "bullets": [
            "Bati a meta individual de vendas em 100% dos meses do segundo ano, com atingimento médio de 109%",
            "Construí carteira do zero, prospectando por telefone e WhatsApp e fechando em média 22 novos clientes por mês",
            "Mantive índice de satisfação (NPS) de 87 ao garantir pós-venda ativo e resolução de objeções no primeiro contato",
            "Fui reconhecido como Top 3 vendedores da regional em 2021 entre 40 profissionais"
          ]
        }
      ],
      "education": [
        {
          "degree": "Tecnólogo em Gestão Comercial",
          "institution": "Universidade Anhembi Morumbi",
          "period": "2017 - 2019"
        },
        {
          "degree": "Certificação em Vendas Consultivas e Negociação",
          "institution": "Curso livre (carga de 40h)",
          "period": "2023"
        }
      ],
      "skills": [
        "Prospecção ativa (cold call e social selling)",
        "Vendas consultivas B2B e B2C",
        "Gestão de pipeline em CRM (HubSpot, Salesforce, Pipedrive)",
        "Negociação e contorno de objeções",
        "Qualificação de leads (BANT, SPIN Selling)",
        "Cross-sell e up-sell",
        "Pós-venda e fidelização de carteira",
        "Análise de funil e métricas (taxa de conversão, ticket médio, CAC)"
      ]
    },
    "keySkills": [
      "Prospecção ativa e cold calling",
      "Vendas consultivas (SPIN Selling)",
      "Gestão de pipeline e CRM (HubSpot, Salesforce, Pipedrive)",
      "Negociação e contorno de objeções",
      "Qualificação de leads (BANT)",
      "Cross-sell e up-sell",
      "Fechamento de vendas (closing)",
      "Relacionamento e fidelização de clientes",
      "Pós-venda e gestão de carteira",
      "Análise de funil e indicadores comerciais",
      "Social selling e prospecção via LinkedIn",
      "Inside sales e field sales"
    ],
    "atsKeywords": [
      "vendedor",
      "executivo de vendas",
      "consultor comercial",
      "vendas B2B",
      "vendas B2C",
      "prospecção",
      "CRM",
      "HubSpot",
      "Salesforce",
      "Pipedrive",
      "negociação",
      "fechamento de vendas",
      "pipeline",
      "metas",
      "inside sales",
      "vendas consultivas"
    ],
    "salaryNote": "No Brasil, vendedor júnior costuma receber entre R$ 1.600 e R$ 2.500 de fixo (mais comissão); pleno/consultor de vendas fica na faixa de R$ 2.800 a R$ 4.500 de fixo; executivo de vendas sênior ou key account vai de R$ 5.000 a R$ 9.000 de fixo, podendo dobrar com comissões e bônus por meta. Em vendas, a remuneração variável muitas vezes supera o fixo, então vale destacar OTE (on-target earnings) quando relevante. Valores variam conforme segmento, região e modelo de comissionamento.",
    "dos": [
      "Quantifique TUDO: percentual de atingimento de meta, valor vendido (R$), ticket médio, taxa de conversão e número de clientes na carteira",
      "Cite os CRMs e ferramentas que você domina pelo nome (HubSpot, Salesforce, Pipedrive, RD Station) — recrutadores filtram por eles",
      "Mostre evolução: ticket médio que cresceu, ciclo de vendas que encurtou, carteira que expandiu",
      "Nomeie as metodologias que você usa (SPIN Selling, BANT, Inbound Sales) para sinalizar maturidade comercial",
      "Inclua prêmios e rankings (Top 3, Vendedor do Mês, clube de líderes) como prova social de performance",
      "Deixe claro o segmento e o modelo de venda (B2B, B2C, inside sales, field sales, ticket alto ou recorrente)"
    ],
    "donts": [
      "Não escreva 'responsável por vendas' sem nenhum número — é o erro que mais elimina currículos de vendedor",
      "Não invente metas batidas ou percentuais que você não consegue defender na entrevista (o gestor vai perguntar)",
      "Não liste apenas tarefas operacionais ('atendia clientes', 'fazia ligações') sem mostrar o resultado dessas ações",
      "Não omita o CRM que você usou achando que é detalhe — para vagas de vendas é palavra-chave decisiva",
      "Não use objetivo genérico tipo 'busco crescimento profissional'; troque por um resumo com seu histórico de atingimento",
      "Não exagere no design colorido em vagas comerciais tradicionais: clareza e números pesam mais que estética"
    ],
    "faqs": [
      {
        "question": "Como mostrar metas batidas no currículo de vendas se eu não tenho os números exatos?",
        "answer": "Use estimativas honestas e arredondadas que você consiga sustentar na entrevista. Em vez de 'aumentei as vendas', escreva 'superei a meta mensal em cerca de 110% na média do ano' ou 'cresci a carteira de aproximadamente 30 para 50 clientes'. Se não lembra o percentual, descreva em ordem de grandeza ('mais de R$ 1 milhão em vendas no ano') ou em ranking ('entre os 3 melhores da equipe'). O importante é mostrar resultado mensurável, nunca um número inventado."
      },
      {
        "question": "Vale a pena colocar a comissão ou OTE no currículo de vendedor?",
        "answer": "Você não precisa expor seu salário, mas mencionar OTE (on-target earnings) ou que você operava com remuneração variável forte sinaliza que está acostumado a trabalhar por meta. Mais útil ainda é mostrar o impacto que gerou: faturamento da carteira, valor médio dos contratos fechados e receita recuperada. Deixe a negociação de valores para a etapa de proposta."
      },
      {
        "question": "Qual a diferença entre destacar vendas B2B e B2C no currículo?",
        "answer": "São perfis diferentes e o recrutador busca o adequado à vaga. Vendas B2B costumam ter ciclo mais longo, ticket maior e venda consultiva — destaque negociação com decisores, gestão de pipeline e metodologias como SPIN Selling. Vendas B2C tendem a ter volume alto e ciclo curto — destaque velocidade de fechamento, número de atendimentos e conversão. Deixe claro no resumo qual é o seu mundo."
      },
      {
        "question": "Preciso saber usar CRM para conseguir vaga de vendas?",
        "answer": "Na maioria das vagas de inside sales e B2B, sim — o CRM é onde o trabalho acontece. Cite as ferramentas que você usou (HubSpot, Salesforce, Pipedrive, RD Station, Zoho). Se nunca usou nenhuma, vale fazer um curso gratuito de introdução e mencionar que está familiarizado com gestão de funil. Em vendas de varejo de balcão, o CRM pesa menos, mas conhecer o conceito de funil ainda conta pontos."
      },
      {
        "question": "Como adaptar meu currículo de vendas para passar no ATS?",
        "answer": "Use as palavras-chave que aparecem na descrição da vaga (ex.: 'inside sales', 'prospecção', 'B2B', 'CRM') de forma natural no resumo e nos bullets. Evite gráficos, tabelas e ícones que o sistema não lê. Mantenha o formato em coluna única, fontes simples e salve em PDF padrão. Repita os termos comerciais exatos que o recrutador usou, pois o ATS faz correspondência literal antes de um humano ver o currículo."
      }
    ]
  },
  {
    "slug": "auxiliar-administrativo",
    "profession": "Auxiliar Administrativo",
    "metaTitle": "Modelo de Currículo para Auxiliar Administrativo (Exemplo Pronto)",
    "h1": "Modelo de currículo para Auxiliar Administrativo",
    "metaDescription": "Modelo de currículo para Auxiliar Administrativo com exemplo real, resumo, experiências com resultados, habilidades, palavras-chave de ATS e faixa salarial em R$.",
    "intro": "O recrutador de uma vaga de Auxiliar Administrativo costuma analisar dezenas de currículos quase idênticos: \"responsável por rotinas administrativas\" e nada mais. O que separa quem é chamado para a entrevista é mostrar com números o volume que você organizou, os sistemas de gestão (ERP) que dominou e como seu controle de planilhas e documentos evitou retrabalho ou atrasos. Este modelo traz um exemplo completo e realista, com os bullets de resultado, as habilidades e as palavras-chave que os filtros de triagem (ATS) e o RH realmente procuram para essa função.",
    "sampleResume": {
      "name": "Camila Ferreira de Souza",
      "headline": "Auxiliar Administrativo | Rotinas de Office, Excel e ERP (TOTVS Protheus)",
      "summary": "Auxiliar Administrativo com 4 anos de experiência em rotinas de back office, controle de documentos, emissão de notas fiscais e atendimento a fornecedores e clientes. Domínio de Excel intermediário (PROCV, tabelas dinâmicas) e ERP TOTVS Protheus. Reconhecida pela organização do arquivo físico e digital e pela redução de erros em lançamentos. Foco em apoiar a operação financeira e de compras com agilidade e precisão.",
      "experience": [
        {
          "role": "Auxiliar Administrativo",
          "company": "Distribuidora Nova Rota Ltda.",
          "period": "Mar 2022 - Atual",
          "bullets": [
            "Realizo o lançamento de cerca de 350 notas fiscais por mês no ERP TOTVS Protheus, com índice de erro abaixo de 1% após implantar checklist de conferência.",
            "Organizei o arquivo de contratos e documentos fiscais (físico e digital), reduzindo o tempo de localização de um documento de 15 para 2 minutos.",
            "Concilio diariamente contas a pagar e a receber em planilha de Excel com tabela dinâmica, garantindo fechamento mensal sem pendências em aberto.",
            "Atendo em média 40 contatos por dia entre telefone e e-mail de fornecedores e clientes, com retorno em até 2 horas úteis.",
            "Padronizei o controle de pedidos de compra em planilha compartilhada, eliminando duplicidade de solicitações entre os setores."
          ]
        },
        {
          "role": "Assistente Administrativo Júnior (Jovem Aprendiz efetivada)",
          "company": "Clínica Bem Estar Saúde",
          "period": "Fev 2020 - Fev 2022",
          "bullets": [
            "Agendava e confirmava cerca de 60 atendimentos por dia em sistema de gestão (software de agenda), reduzindo faltas com lembretes por WhatsApp.",
            "Emitia recibos, controlava o caixa pequeno e organizava o fluxo de prontuários físicos seguindo as normas internas.",
            "Apoiei a digitalização de aproximadamente 5.000 documentos, migrando o arquivo morto para pastas digitais organizadas por data e setor.",
            "Elaborava planilhas mensais de controle de materiais de escritório, evitando ruptura de estoque dos itens essenciais."
          ]
        }
      ],
      "education": [
        {
          "degree": "Tecnólogo em Gestão de Recursos Humanos (cursando)",
          "institution": "Universidade Anhanguera (EAD)",
          "period": "2024 - 2026"
        },
        {
          "degree": "Ensino Médio Completo",
          "institution": "E.E. Professor Antônio Lourenço",
          "period": "2017 - 2019"
        },
        {
          "degree": "Curso de Excel Intermediário (40h) e Departamento Pessoal (Senac)",
          "institution": "Senac",
          "period": "2021"
        }
      ],
      "skills": [
        "Pacote Office (Word, Excel, PowerPoint, Outlook)",
        "Excel intermediário: PROCV, tabelas dinâmicas, filtros",
        "ERP TOTVS Protheus",
        "Emissão de notas fiscais e boletos",
        "Contas a pagar e a receber",
        "Organização de arquivo físico e digital",
        "Atendimento telefônico e por e-mail",
        "Rotinas de compras e controle de estoque",
        "Google Workspace (Planilhas, Drive, Agenda)",
        "Digitação rápida e redação de e-mails formais"
      ]
    },
    "keySkills": [
      "Domínio do Pacote Office, com Excel em nível intermediário (PROCV, tabelas dinâmicas, filtros e fórmulas básicas)",
      "Operação de ERP e sistemas de gestão (TOTVS Protheus, SAP, Sankhya ou similar)",
      "Rotinas administrativas: lançamento de notas fiscais, emissão de boletos e controle de documentos",
      "Contas a pagar e a receber e conciliação bancária básica",
      "Organização e arquivamento de documentos físicos e digitais",
      "Atendimento a clientes, fornecedores e demais setores por telefone, e-mail e presencial",
      "Apoio às rotinas de compras, cotação e controle de estoque de materiais",
      "Redação de e-mails formais, ofícios e comunicados internos",
      "Gestão de agenda, agendamentos e organização de reuniões",
      "Atenção a detalhes, organização e cumprimento de prazos",
      "Noções de departamento pessoal e rotinas de RH (admissão, ponto, benefícios)",
      "Google Workspace (Planilhas, Documentos, Drive e Agenda)"
    ],
    "atsKeywords": [
      "Auxiliar Administrativo",
      "Assistente Administrativo",
      "rotinas administrativas",
      "Pacote Office",
      "Excel intermediário",
      "tabelas dinâmicas",
      "PROCV",
      "ERP",
      "TOTVS Protheus",
      "emissão de notas fiscais",
      "contas a pagar e a receber",
      "controle de documentos",
      "atendimento ao cliente",
      "organização de arquivo",
      "sistema de gestão"
    ],
    "salaryNote": "No Brasil, a faixa salarial de Auxiliar Administrativo varia conforme região, porte da empresa e setor. Júnior/início de carreira (ou jovem aprendiz efetivado): cerca de R$ 1.500 a R$ 1.900 por mês. Pleno (2 a 4 anos de experiência, com ERP e Excel intermediário): cerca de R$ 2.000 a R$ 2.800. Sênior ou Auxiliar com escopo ampliado, próximo de Assistente Administrativo (rotinas fiscais, financeiras ou de DP): cerca de R$ 2.800 a R$ 3.800. Em capitais como São Paulo e em multinacionais os valores tendem a ficar no topo da faixa; muitas vagas incluem vale-transporte, vale-refeição/alimentação e plano de saúde.",
    "dos": [
      "Quantifique o volume das suas rotinas: 'lançava 350 notas fiscais/mês' ou 'atendia 40 contatos/dia' diz muito mais que 'realizava rotinas administrativas'.",
      "Nomeie os sistemas que você usa: ERP (TOTVS Protheus, SAP, Sankhya), nível de Excel (intermediário, com PROCV e tabelas dinâmicas) e softwares de gestão específicos.",
      "Adapte o currículo para cada vaga, usando as mesmas palavras do anúncio (ex.: se pedem 'contas a pagar', escreva 'contas a pagar', não apenas 'financeiro').",
      "Mostre resultados de organização: redução de tempo para localizar documentos, queda de erros em lançamentos, fechamento de mês sem pendências.",
      "Inclua cursos práticos relevantes (Excel, Departamento Pessoal, rotinas fiscais) mesmo que de carga horária curta — eles diferenciam.",
      "Mantenha o currículo em 1 página, limpo e com seções claras: resumo, experiência, formação e habilidades."
    ],
    "donts": [
      "Não escreva apenas 'responsável por rotinas administrativas' sem dizer quais rotinas, em que sistema e em que volume.",
      "Não declare 'Excel avançado' se você só usa filtros e soma — recrutadores testam isso na entrevista; seja honesto com o nível real.",
      "Não liste como habilidade competências óbvias e vazias como 'sei usar computador' ou 'sou comunicativo' sem nenhum exemplo.",
      "Não inclua foto, número de RG/CPF, estado civil ou pretensão salarial fixa no corpo do currículo (a não ser que a vaga peça expressamente).",
      "Não envie o mesmo currículo genérico para uma vaga fiscal e uma vaga de compras — destaque a experiência que conversa com cada área.",
      "Não deixe lacunas grandes sem explicação e evite erros de português, que pesam muito numa função que envolve e-mails e documentos."
    ],
    "faqs": [
      {
        "question": "Preciso de faculdade para ser Auxiliar Administrativo?",
        "answer": "Não. A maioria das vagas exige apenas Ensino Médio completo. Cursos técnicos em Administração ou cursos livres de Excel, rotinas fiscais e Departamento Pessoal aumentam suas chances. Estar cursando uma graduação ou tecnólogo (Administração, Gestão de RH, Processos Gerenciais) é um diferencial, mas raramente é requisito obrigatório para o início de carreira."
      },
      {
        "question": "Qual nível de Excel devo colocar no currículo?",
        "answer": "Seja específico e honesto. Se você usa fórmulas básicas, filtros e formatação, é 'Excel básico'. Se domina PROCV, tabelas dinâmicas, SE, CONT.SE e gráficos, é 'Excel intermediário'. 'Avançado' envolve macros, VBA e dashboards. A maioria das vagas de Auxiliar Administrativo pede o intermediário — descreva o que sabe fazer ('Excel intermediário: PROCV e tabelas dinâmicas') em vez de só o rótulo."
      },
      {
        "question": "Como descrevo minhas experiências se eu só fazia 'tarefas básicas'?",
        "answer": "Toda tarefa tem um resultado por trás. Em vez de 'organizava documentos', escreva 'organizei o arquivo físico e digital, reduzindo o tempo de localização de documentos'. Em vez de 'atendia o telefone', escreva 'atendia cerca de 40 contatos/dia de fornecedores com retorno em até 2 horas'. Pense em volume, prazo, redução de erro ou economia que você gerou."
      },
      {
        "question": "Não tenho experiência. Como faço um currículo de Auxiliar Administrativo?",
        "answer": "Foque em formação, cursos e experiências equivalentes. Vale Jovem Aprendiz, estágio, trabalho voluntário, ajuda no negócio da família ou tarefas administrativas que você fez em outro emprego (organizar planilhas, atender clientes, controlar caixa). Liste cursos de Excel e Pacote Office e escreva um resumo que mostre organização, atenção a detalhes e vontade de aprender os sistemas da empresa."
      },
      {
        "question": "Qual a diferença entre Auxiliar e Assistente Administrativo no currículo?",
        "answer": "O Auxiliar costuma executar rotinas mais operacionais e de apoio (arquivar, lançar, conferir, atender), enquanto o Assistente tem autonomia maior e lida com análises, relatórios e processos mais completos. No currículo, se você já assume responsabilidades de Assistente (fechamentos, conciliações, gestão de processos), deixe isso claro nos bullets — isso ajuda a pleitear a faixa salarial e o cargo seguinte."
      },
      {
        "question": "Quais sistemas de gestão vale a pena mencionar?",
        "answer": "Cite o ERP que você usou pelo nome: TOTVS Protheus, SAP, Sankhya, Senior, Microsiga, Bling ou Omie são os mais buscados. Inclua também ferramentas de apoio como Google Workspace, Outlook e sistemas de emissão de nota fiscal eletrônica. Os filtros de triagem (ATS) procuram esses nomes exatos, então escrevê-los corretamente aumenta a chance de o currículo passar."
      }
    ]
  },
  {
    "slug": "motorista",
    "profession": "Motorista",
    "metaTitle": "Modelo de Currículo para Motorista (2026) | Exemplo Pronto e Dicas",
    "h1": "Modelo de Currículo para Motorista",
    "metaDescription": "Veja um modelo de currículo para motorista pronto para copiar, com CNH, categorias, cursos MOPP, experiência em rotas e cargas, palavras-chave de ATS e faixa salarial.",
    "intro": "No transporte, o recrutador decide em segundos se chama você para a entrevista — e os dois primeiros dados que ele procura são a categoria da sua CNH e o tipo de veículo que você dirige. Um currículo de motorista precisa deixar isso explícito logo no topo, junto com cursos obrigatórios (como MOPP), tipos de carga e rotas que você já conduziu. Este guia traz um modelo realista e completo, as habilidades que pesam na seleção e as palavras-chave que os sistemas de triagem (ATS) buscam para vagas de motorista.",
    "sampleResume": {
      "name": "Carlos Eduardo Ferreira",
      "headline": "Motorista Carreteiro | CNH E + MOPP | Cargas Secas e Perigosas",
      "summary": "Motorista profissional com 9 anos de experiência em transporte rodoviário de cargas, CNH categoria E com EAR (atividade remunerada), MOPP e curso de Direção Defensiva em dia. Atuação em rotas de longa distância (Sul, Sudeste e Centro-Oeste), com histórico de zero acidentes em mais de 600 mil km rodados e índice de entregas no prazo acima de 98%. Experiência com carreta baú, sider, bitrem e transporte de produtos perigosos (classe 3 e 8).",
      "experience": [
        {
          "role": "Motorista Carreteiro (Categoria E)",
          "company": "Transportadora Rota Sul Logística",
          "period": "Mar 2020 - Atual",
          "bullets": [
            "Conduzo carreta Scania R450 (cavalo 6x2) com bitrem sider em rotas longas entre SP, PR, SC e MS, percorrendo média de 18.000 km/mês",
            "Mantenho índice de 98,7% de entregas no prazo, com registro zero de acidentes ou multas graves nos últimos 4 anos",
            "Transporto cargas perigosas (combustíveis e produtos químicos classe 3 e 8) seguindo normas da ANTT e portando documentação MOPP e ficha de emergência",
            "Reduzi em 12% o consumo médio de diesel aplicando técnicas de direção econômica e controle de RPM em subidas da Serra",
            "Realizo inspeção diária de pneus, freios, óleo e sistema de freio motor (checklist pré-viagem), reduzindo paradas não programadas em oficina",
            "Preencho diário de bordo, controle de jornada (Lei do Motorista 13.103/2015) e registros via rastreador da frota"
          ]
        },
        {
          "role": "Motorista de Caminhão Truck (Categoria D)",
          "company": "Distribuidora Bom Preço Atacadista",
          "period": "Jun 2016 - Fev 2020",
          "bullets": [
            "Realizei entregas urbanas e regionais de cargas fracionadas em caminhão truck baú (VW Constellation) pela região metropolitana de Campinas",
            "Cumpri rota com média de 22 pontos de entrega por dia, respeitando janelas de descarga de supermercados e centros de distribuição",
            "Responsável pela conferência de notas fiscais, canhotos e coleta de assinatura no recebimento, com 99% de conformidade na prestação de contas",
            "Auxiliei no carregamento e organização da carga para otimizar a sequência de entregas e evitar avarias em produtos frágeis"
          ]
        }
      ],
      "education": [
        {
          "degree": "Ensino Médio Completo",
          "institution": "Escola Estadual Prof. João Lima",
          "period": "Concluído em 2011"
        },
        {
          "degree": "Curso MOPP - Movimentação Operacional de Produtos Perigosos",
          "institution": "Autoescola / SEST SENAT",
          "period": "Atualizado em 2024"
        },
        {
          "degree": "Curso de Direção Defensiva e Primeiros Socorros",
          "institution": "SEST SENAT",
          "period": "2023"
        }
      ],
      "skills": [
        "CNH categoria E com EAR (atividade remunerada)",
        "Curso MOPP (produtos perigosos) atualizado",
        "Direção defensiva e econômica",
        "Carreta, bitrem, sider e baú",
        "Cargas secas e produtos perigosos (classe 3 e 8)",
        "Rotas de longa distância (interestaduais)",
        "Controle de jornada (Lei 13.103/2015)",
        "Manutenção básica e checklist pré-viagem",
        "Uso de rastreador e diário de bordo",
        "Pontualidade e zero acidentes"
      ]
    },
    "keySkills": [
      "CNH na categoria correta (B, C, D ou E) com EAR",
      "Curso MOPP para transporte de produtos perigosos",
      "Direção defensiva e direção econômica",
      "Domínio de tipos de veículo: VUC, truck, carreta, bitrem",
      "Experiência com tipos de carga: seca, fracionada, frigorificada, perigosa",
      "Conhecimento de rotas e leitura de rota/GPS",
      "Manutenção preventiva e checklist pré-viagem",
      "Controle de jornada conforme Lei do Motorista (13.103/2015)",
      "Documentação de transporte: nota fiscal, CT-e, MDF-e, canhoto",
      "Pontualidade e cumprimento de prazos de entrega",
      "Atendimento ao cliente na entrega/descarga",
      "Uso de rastreadores e aplicativos de logística"
    ],
    "atsKeywords": [
      "motorista",
      "CNH categoria E",
      "CNH categoria D",
      "CNH categoria C",
      "EAR atividade remunerada",
      "MOPP",
      "direção defensiva",
      "carreteiro",
      "motorista de caminhão",
      "motorista entregador",
      "transporte de cargas",
      "cargas perigosas",
      "rotas interestaduais",
      "carreta",
      "bitrem",
      "Lei do Motorista 13.103",
      "manutenção preventiva",
      "checklist pré-viagem",
      "pontualidade",
      "zero acidentes"
    ],
    "salaryNote": "As faixas variam conforme categoria da CNH, tipo de veículo e rota. Motorista entregador/urbano (categorias B e C, júnior): R$ 1.800 a R$ 2.600. Motorista de caminhão truck (categoria D, pleno): R$ 2.600 a R$ 3.800. Motorista carreteiro/longa distância (categoria E, sênior) e motoristas com MOPP para cargas perigosas: R$ 3.800 a R$ 6.500, podendo ultrapassar R$ 7.000 com diárias, comissão por km e bônus de produtividade. Valores médios para o Brasil em 2026, com variação por região e empresa.",
    "dos": [
      "Coloque a categoria da CNH, validade e se possui EAR (atividade remunerada) logo no topo, em destaque",
      "Liste os tipos de veículo que você dirige com modelo e configuração (ex.: carreta Scania 6x2, truck baú, VUC)",
      "Especifique os tipos de carga que já transportou (seca, fracionada, frigorificada, perigosa) e as rotas/regiões",
      "Destaque cursos válidos: MOPP, direção defensiva, primeiros socorros, e a data de atualização de cada um",
      "Inclua números concretos: km rodados, % de entregas no prazo, anos sem acidentes ou multas graves",
      "Mencione experiência com documentação (nota fiscal, CT-e, MDF-e) e controle de jornada"
    ],
    "donts": [
      "Não esconda ou omita a categoria da CNH e a situação da pontuação — isso é a primeira coisa que o recrutador confere",
      "Não use foto de carteira de motorista, selfie no caminhão ou imagem informal no currículo",
      "Não escreva apenas 'experiência com caminhão' sem dizer o porte do veículo e o tipo de carga",
      "Não deixe cursos vencidos sem indicar que vai renovar; MOPP e direção defensiva têm prazo de validade",
      "Não invente experiência com cargas perigosas ou categoria que você não tem — é verificável e custa a vaga",
      "Não envie um currículo de mais de 2 páginas; recrutador de transportadora quer ler em segundos"
    ],
    "faqs": [
      {
        "question": "Qual categoria de CNH devo destacar no currículo de motorista?",
        "answer": "Destaque sempre a categoria mais alta que você possui, pois ela habilita as inferiores. A escala vai de B (carros e utilitários), C (caminhões com mais de 3.500 kg), D (ônibus e veículos de passageiros) até E (carreta, bitrem, veículos com reboque acima de 6.000 kg). Coloque também se você tem a observação EAR (Exerce Atividade Remunerada), obrigatória para dirigir profissionalmente, e a data de validade da carteira."
      },
      {
        "question": "Preciso colocar o curso MOPP no currículo mesmo sem vaga de carga perigosa?",
        "answer": "Sim, vale a pena. O MOPP (Movimentação Operacional de Produtos Perigosos) é um diferencial competitivo: ele mostra que você está apto a transportar combustíveis, químicos e cargas das classes da ANTT, o que abre vagas mais bem pagas. Mesmo que a vaga atual não exija, ter MOPP atualizado (ele tem validade e precisa de reciclagem) sinaliza profissionalismo. Sempre informe o ano da última atualização."
      },
      {
        "question": "Como mostrar experiência em rotas e tipos de carga sem ficar genérico?",
        "answer": "Seja específico. Em vez de 'fazia entregas', escreva o que e por onde: 'rotas interestaduais entre SP, PR e SC com carreta sider, transportando cargas secas e fracionadas, média de 18.000 km/mês'. Indique as regiões/estados, o tipo de operação (longa distância, distribuição urbana, transferência entre filiais) e o porte do veículo. Isso prova domínio real e ajuda o recrutador a encaixar você na operação dele."
      },
      {
        "question": "Vale a pena colocar que tenho zero acidentes e pontualidade?",
        "answer": "Sim, esses são os indicadores que mais pesam para transportadoras, porque impactam diretamente seguro, multas e relação com o cliente. Mas comprove com números: 'zero acidentes em mais de 600 mil km rodados', '98% de entregas no prazo nos últimos 12 meses', '4 anos sem multas graves'. Afirmações com dados concretos têm muito mais peso do que adjetivos como 'sou responsável e pontual'."
      },
      {
        "question": "O que escrever no currículo se sou motorista iniciante (primeira CNH ou primeiro emprego)?",
        "answer": "Foque na sua habilitação, cursos e disponibilidade. Destaque a categoria da CNH com EAR, eventuais cursos (direção defensiva, MOPP, autoescola), disponibilidade para viagens e turnos, e conhecimento de regiões/rotas que você já dirige no dia a dia. Se ajudou em entregas, fez frete autônomo, dirigiu na lavoura ou conduziu veículos da família/empresa, descreva isso como experiência prática. Conhecimento de manutenção básica e checklist pré-viagem também conta pontos."
      },
      {
        "question": "Devo incluir a pontuação da CNH e antecedentes no currículo?",
        "answer": "Não coloque o detalhe da pontuação no currículo, mas esteja preparado para apresentar a consulta do prontuário (sem multas graves ou suspensão) na entrevista ou no processo de admissão, porque a transportadora vai verificar. Você pode escrever 'CNH sem restrições' ou 'prontuário sem pontos relevantes' se for o caso. Manter a carteira limpa é, na prática, um dos critérios de contratação mais decisivos."
      }
    ]
  },
  {
    "slug": "professor",
    "profession": "Professor",
    "metaTitle": "Modelo de Currículo para Professor (2026): Exemplo Pronto + Dicas",
    "h1": "Modelo de Currículo para Professor",
    "metaDescription": "Modelo de currículo para professor com exemplo completo, formação e licenciatura, disciplinas, níveis de ensino, metodologias, palavras-chave de ATS e faixa salarial em R$.",
    "intro": "O currículo de professor não vende só \"anos de sala de aula\" — ele precisa provar formação e habilitação legal (licenciatura, registro funcional), os níveis e disciplinas que você domina e, principalmente, resultados pedagógicos mensuráveis (evolução de notas, redução de evasão, aprovação no ENEM/vestibular, projetos institucionais). Coordenadores e equipes de RH de escolas leem dezenas de currículos por vaga: o seu tem poucos segundos para mostrar que você combina com a etapa de ensino (Educação Infantil, Fundamental I/II, Médio, EJA ou superior), com a disciplina e com a proposta pedagógica da instituição. Este modelo mostra como organizar tudo isso de forma que passe tanto no filtro de ATS quanto no olhar do coordenador pedagógico.",
    "sampleResume": {
      "name": "Mariana Albuquerque Tavares",
      "headline": "Professora de Matemática | Ensino Fundamental II e Médio | Licenciada",
      "summary": "Professora licenciada em Matemática com 8 anos de experiência no Ensino Fundamental II e Médio em escolas particulares e da rede pública. Especialista em metodologias ativas e ensino baseado em competências da BNCC, com histórico comprovado de elevação de desempenho em avaliações externas (SAEB e ENEM) e redução de reprovação. Busco recolocação como professora de Matemática ou coordenadora de área em instituição com proposta pedagógica inovadora.",
      "experience": [
        {
          "role": "Professora de Matemática (Fund. II e Médio)",
          "company": "Colégio Saber Integral",
          "period": "Fev 2021 - Atual",
          "bullets": [
            "Leciono Matemática para 9 turmas (6º ao 9º ano e 1ª a 3ª série do EM), cerca de 320 alunos por semestre, com média de aprovação de 94%.",
            "Elevei a nota média de Matemática no simulado ENEM da escola de 540 para 632 em dois anos, aplicando trilhas de revisão por competência e correção de itens descritores.",
            "Reduzi a reprovação na disciplina de 18% para 7% ao ano ao implantar avaliação formativa contínua e recuperação paralela estruturada.",
            "Coordenei a Olimpíada Brasileira de Matemática (OBMEP) na escola, levando 12 alunos à 2ª fase e conquistando 2 menções honrosas em 2024.",
            "Implantei o uso de GeoGebra e plataformas adaptativas (Khan Academy) no plano de aula, alinhando atividades às habilidades da BNCC."
          ]
        },
        {
          "role": "Professora de Matemática (Ensino Fundamental II)",
          "company": "EMEF Professor João Ribeiro (Rede Municipal)",
          "period": "Mar 2017 - Jan 2021",
          "bullets": [
            "Lecionei Matemática para turmas do 6º ao 9º ano (média de 35 alunos por turma) em escola pública de periferia.",
            "Atuei como protagonista do projeto de recomposição de aprendizagem pós-pandemia, recuperando defasagens de 4 das 5 turmas atendidas.",
            "Participei da elaboração coletiva do PPP (Projeto Político-Pedagógico) e do plano de curso anual da área de exatas.",
            "Reduzi a evasão nas turmas do 9º ano em 22% por meio de busca ativa e tutoria entre pares."
          ]
        }
      ],
      "education": [
        {
          "degree": "Especialização (Pós-Graduação) em Educação Matemática",
          "institution": "PUC Minas",
          "period": "2019 - 2020"
        },
        {
          "degree": "Licenciatura em Matemática",
          "institution": "Universidade Federal de Minas Gerais (UFMG)",
          "period": "2012 - 2016"
        }
      ],
      "skills": [
        "Metodologias ativas (sala de aula invertida, ABP)",
        "Planejamento alinhado à BNCC",
        "Avaliação formativa e diagnóstica",
        "Gestão de sala e mediação de conflitos",
        "GeoGebra, Google Workspace for Education e Khan Academy",
        "Preparação para ENEM e vestibulares",
        "Recuperação paralela e recomposição de aprendizagem"
      ]
    },
    "keySkills": [
      "Domínio do conteúdo da disciplina e da etapa de ensino",
      "Planejamento de aulas alinhado à BNCC e ao currículo",
      "Metodologias ativas (sala invertida, aprendizagem baseada em projetos)",
      "Avaliação formativa, diagnóstica e somativa",
      "Gestão de sala de aula e mediação de conflitos",
      "Uso de tecnologias educacionais (Google Workspace, plataformas adaptativas)",
      "Educação inclusiva e atendimento à diversidade (PEI/AEE)",
      "Elaboração de planos de curso e material didático",
      "Acompanhamento e devolutiva de desempenho aos alunos e responsáveis",
      "Trabalho com avaliações externas (SAEB, ENEM, vestibulares, Provinha Brasil)",
      "Relacionamento com famílias e reuniões de pais",
      "Educação a distância e ensino híbrido"
    ],
    "atsKeywords": [
      "professor",
      "licenciatura",
      "BNCC",
      "Ensino Fundamental",
      "Ensino Médio",
      "metodologias ativas",
      "plano de aula",
      "avaliação formativa",
      "gestão de sala de aula",
      "ensino híbrido",
      "educação inclusiva",
      "coordenação pedagógica",
      "ENEM",
      "projeto político-pedagógico (PPP)",
      "tecnologias educacionais"
    ],
    "salaryNote": "A remuneração de professor varia bastante por etapa de ensino, rede (pública x privada), carga horária e região. Em regime de hora-aula na rede privada, valores comuns ficam entre R$ 25 e R$ 70 por hora-aula. Em salário mensal CLT/estatutário (referência para jornada de 20h a 40h): professor júnior/iniciante (Educação Infantil e Fundamental I) costuma ganhar de R$ 2.200 a R$ 3.500; professor pleno (Fundamental II e Médio, com licenciatura e alguns anos de experiência) fica na faixa de R$ 3.500 a R$ 6.000; professor sênior, com especialização/mestrado, atuação no Ensino Médio, cursinhos pré-vestibular ou ensino superior, pode ultrapassar R$ 6.000 a R$ 12.000. Concursos públicos estaduais e municipais seguem o piso nacional do magistério (reajustado anualmente) e planos de carreira próprios. Coordenação pedagógica e direção elevam os ganhos.",
    "dos": [
      "Especifique sempre a etapa e a disciplina logo no título: 'Professor de História — Ensino Fundamental II e Médio'. Coordenadores filtram por isso.",
      "Coloque formação e licenciatura em destaque, com a habilitação legal (ex.: Licenciatura Plena em Letras). Sem licenciatura na área, a maioria das vagas é eliminatória.",
      "Quantifique resultados pedagógicos: evolução de notas, taxa de aprovação, redução de evasão/reprovação, aprovações no ENEM/vestibular, classificações em olimpíadas.",
      "Cite a BNCC, o currículo de referência do seu estado e as metodologias que você domina (sala invertida, ABP, avaliação formativa) — mostra atualização.",
      "Liste ferramentas e plataformas educacionais reais que você usa (Google Workspace for Education, GeoGebra, Khan Academy, Moodle), porque ensino híbrido virou requisito comum.",
      "Inclua registro funcional, número de matrícula docente ou habilitação quando relevante, além de cursos de formação continuada recentes."
    ],
    "donts": [
      "Não envie um currículo genérico para todas as etapas. Adaptar para a vaga (Infantil x Médio) muda completamente o foco das competências.",
      "Não liste só 'ministrei aulas' sem nenhum resultado. 'Lecionei Matemática' é tarefa; 'elevei a média do simulado ENEM de 540 para 632' é resultado.",
      "Não omita a licenciatura nem tente disfarçar a falta dela. Para a maioria das redes, habilitação na área é exigência legal e o RH verifica.",
      "Não use linguagem vaga como 'apaixonado por ensinar' sem evidência. Prove o engajamento com projetos, olimpíadas e indicadores.",
      "Não ignore as ferramentas digitais. Escola que adota plataforma e não vê isso no currículo assume que você terá curva de aprendizado.",
      "Não exagere idade/data de formatura de forma irrelevante, mas também não esconda experiência recente de formação continuada — ela conta muito para escolas."
    ],
    "faqs": [
      {
        "question": "Preciso ter licenciatura para colocar 'professor' no currículo?",
        "answer": "Para a Educação Básica (Infantil, Fundamental e Médio), a LDB exige licenciatura na área (ou curso normal/magistério para a Educação Infantil e anos iniciais). Sem habilitação na disciplina, a maioria das vagas em redes públicas e em escolas particulares estruturadas é eliminatória. Se você é bacharel e leciona, deixe isso claro e destaque complementação pedagógica (R2/programa especial de formação) ou pós em docência. Para cursos livres, técnicos e parte do ensino superior, as regras são mais flexíveis, mas titulação ainda pesa."
      },
      {
        "question": "Como destaco resultados se 'aprendizado de aluno' é difícil de medir?",
        "answer": "Use indicadores que a escola já acompanha: taxa de aprovação/reprovação, média da turma em avaliações internas e externas (SAEB, simulados, ENEM), redução de evasão, número de alunos classificados em olimpíadas (OBMEP, OBA, OBQ), aprovações em vestibulares e participação em projetos institucionais. Mesmo melhorias qualitativas podem ser dimensionadas: 'reduzi a reprovação de 18% para 7%' é muito mais forte que 'melhorei o desempenho da turma'."
      },
      {
        "question": "Devo fazer um currículo diferente para cada etapa de ensino?",
        "answer": "Sim, adapte. Educação Infantil e Fundamental I valorizam alfabetização, ludicidade, desenvolvimento socioemocional e acolhimento. Fundamental II e Médio cobram domínio aprofundado da disciplina, preparação para avaliações externas e gestão de adolescentes. Ensino superior e cursinhos pedem titulação (mestrado/doutorado), produção e didática para grandes turmas. Reordene resumo, habilidades e palavras-chave conforme a vaga em vez de mandar o mesmo arquivo para tudo."
      },
      {
        "question": "Como mostro experiência se sou professor recém-formado ou em início de carreira?",
        "answer": "Valorize estágio supervisionado, residência pedagógica, PIBID, monitorias, aulas particulares, projetos de extensão e voluntariado em reforço escolar. Descreva o que você fez com resultado ('acompanhei 15 alunos em reforço de Matemática, com 12 recuperando a média'). Inclua a licenciatura em destaque, cursos de formação continuada e domínio de plataformas digitais. Para o primeiro emprego, formação sólida e iniciativa pesam mais do que tempo de casa."
      },
      {
        "question": "Quais palavras-chave colocar para passar nos sistemas de triagem (ATS) das escolas?",
        "answer": "Use os termos exatos da vaga e da rotina docente: a disciplina ('professor de Geografia'), a etapa ('Ensino Médio', 'Fundamental II'), 'licenciatura', 'BNCC', 'plano de aula', 'metodologias ativas', 'avaliação formativa', 'gestão de sala de aula', 'ensino híbrido', 'educação inclusiva' e ferramentas como 'Google Workspace for Education'. Inclua siglas e termos por extenso (ex.: 'PPP' e 'Projeto Político-Pedagógico'), porque você não sabe qual o sistema busca."
      },
      {
        "question": "Vale a pena citar formação continuada, pós-graduação e mestrado no currículo?",
        "answer": "Vale muito. Na docência, formação continuada é um diferencial competitivo claro: especializações em educação, mestrado/doutorado, cursos de metodologias ativas, educação inclusiva, BNCC e tecnologias educacionais sinalizam atualização e abrem portas para coordenação, ensino superior e melhores faixas salariais. Liste com instituição e ano, priorizando o que tem relação direta com a vaga e o que foi concluído recentemente."
      }
    ]
  },
  {
    "slug": "recepcionista",
    "profession": "Recepcionista",
    "metaTitle": "Modelo de Currículo para Recepcionista (Exemplo Pronto 2026)",
    "h1": "Modelo de Currículo para Recepcionista",
    "metaDescription": "Modelo de currículo para Recepcionista com exemplo real e completo: resumo, experiência, habilidades, palavras-chave de ATS, faixa salarial e dicas de RH.",
    "intro": "A recepção é o primeiro contato que o cliente, paciente ou visitante tem com a empresa — e o seu currículo precisa provar que você sabe causar uma boa primeira impressão, organizar uma agenda cheia e operar os sistemas do dia a dia sem deixar nada cair. Recrutadores de recepcionista escaneiam o currículo em segundos buscando três coisas: atendimento ao público comprovado, domínio de ferramentas (agenda, telefonia, ERP) e comunicação impecável. Abaixo você encontra um exemplo pronto para adaptar e o que cada parte precisa ter para passar no filtro de ATS e cair na mesa do gestor.",
    "sampleResume": {
      "name": "Camila Fernandes de Souza",
      "headline": "Recepcionista | Atendimento ao Cliente e Gestão de Agenda",
      "summary": "Recepcionista com 5 anos de experiência em recepção de clínica e empresarial, responsável por atendimento presencial e telefônico, agendamento e organização de agenda de até 8 profissionais simultaneamente. Domínio de sistemas de gestão (ERP TOTVS e Google Agenda), perfil organizado, comunicação clara e inglês intermediário para atendimento de visitantes estrangeiros.",
      "experience": [
        {
          "role": "Recepcionista",
          "company": "Clínica Vida Saúde",
          "period": "Mar 2022 - Atual",
          "bullets": [
            "Atendo média de 90 pacientes/dia entre presencial e telefônico, com tempo médio de espera reduzido de 12 para 6 minutos após reorganização do fluxo de chegada.",
            "Gerencio a agenda de 8 médicos no sistema Feegow, reduzindo faltas (no-show) em 22% com rotina de confirmação por WhatsApp 24h antes.",
            "Faço cadastro e atualização de prontuários, conferência de convênios e emissão de guias, com índice de glosa por erro de cadastro próximo de zero.",
            "Treinei 3 recepcionistas novas no padrão de atendimento e no uso do sistema, padronizando o discurso de acolhimento da clínica."
          ]
        },
        {
          "role": "Recepcionista de Portaria/Empresarial",
          "company": "Edifício Corporate Tower (terceirizada Grupo Confiança)",
          "period": "Jun 2019 - Fev 2022",
          "bullets": [
            "Controlei o acesso de visitantes e prestadores de até 400 pessoas/dia, com registro em sistema de controle de visitantes e crachá provisório.",
            "Operei central telefônica (PABX) com triagem e transferência de ligações para 12 empresas do prédio, garantindo encaminhamento correto em até 30 segundos.",
            "Organizei reservas de salas de reunião e recebimento de correspondências e malotes, mantendo planilha de controle sem extravios no período.",
            "Atendi visitantes estrangeiros em inglês intermediário, prestando informações sobre o prédio e direcionando às empresas."
          ]
        }
      ],
      "education": [
        {
          "degree": "Tecnólogo em Gestão de Recursos Humanos (em andamento)",
          "institution": "Universidade Estácio de Sá",
          "period": "2024 - 2026"
        },
        {
          "degree": "Ensino Médio Completo",
          "institution": "Colégio Estadual Dom Pedro II",
          "period": "Concluído em 2018"
        }
      ],
      "skills": [
        "Atendimento ao cliente presencial e telefônico",
        "Gestão e organização de agenda",
        "Sistemas ERP (TOTVS, Feegow)",
        "Pacote Office e Google Workspace",
        "Operação de central telefônica (PABX)",
        "Controle de acesso e recepção de visitantes",
        "Comunicação verbal e escrita",
        "Inglês intermediário",
        "Organização e gestão de tempo",
        "Discrição e sigilo de informações"
      ]
    },
    "keySkills": [
      "Atendimento ao cliente presencial e telefônico",
      "Organização e gestão de agenda",
      "Operação de central telefônica (PABX)",
      "Sistemas de gestão (ERP, CRM, software de agendamento)",
      "Pacote Office e Google Workspace",
      "Controle de acesso e recepção de visitantes",
      "Comunicação verbal e escrita clara",
      "Boa apresentação pessoal e postura profissional",
      "Inglês e/ou espanhol (diferencial)",
      "Organização, proatividade e gestão de tempo",
      "Discrição e sigilo de informações",
      "Resolução de conflitos e atendimento sob pressão"
    ],
    "atsKeywords": [
      "recepcionista",
      "atendimento ao cliente",
      "atendimento ao público",
      "agendamento",
      "organização de agenda",
      "central telefônica",
      "PABX",
      "controle de acesso",
      "recepção",
      "atendimento telefônico",
      "Pacote Office",
      "ERP",
      "CRM",
      "secretária",
      "inglês intermediário",
      "comunicação",
      "cadastro de clientes"
    ],
    "salaryNote": "No Brasil, o salário de recepcionista varia bastante por região e segmento. Júnior (até 1 ano): faixa de R$ 1.500 a R$ 1.900, geralmente piso da categoria mais benefícios. Pleno (1 a 4 anos, com domínio de sistemas e atendimento bilíngue ou em clínica/corporativo): R$ 1.900 a R$ 2.800. Sênior/recepção especializada (5+ anos, recepção bilíngue, hospitalar, jurídica ou liderança de equipe de recepção): R$ 2.800 a R$ 3.800. Recepção em multinacionais, hotéis de alto padrão e segmento médico/jurídico tende a pagar acima da média, e o domínio de um segundo idioma pode elevar a faixa em 15% a 30%.",
    "dos": [
      "Quantifique o volume de atendimento: diga quantas ligações, pessoas ou agendamentos você gerencia por dia (ex.: 'atendo 90 pacientes/dia'). Número impressiona mais que adjetivo.",
      "Liste os sistemas que você domina pelo nome (TOTVS, SAP, Feegow, Google Agenda, PABX, Outlook). Recrutadores e ATS buscam ferramentas específicas.",
      "Destaque idiomas com o nível real (básico/intermediário/avançado/fluente) — em recepção bilíngue isso é decisivo e muitas vagas exigem.",
      "Inclua resultados concretos de organização: redução de no-show, diminuição do tempo de espera, zero extravio de correspondência.",
      "Mantenha o currículo em 1 página, com visual limpo e bem espaçado — sua organização visual sinaliza a organização que a vaga exige.",
      "Adapte o resumo e as palavras-chave ao segmento da vaga (clínica, corporativo, hotel, escritório), espelhando os termos do anúncio."
    ],
    "donts": [
      "Não escreva apenas 'responsável pela recepção' sem dizer o que isso envolvia (telefone, agenda, sistemas, visitantes). Descreva as tarefas reais.",
      "Não omita o nome dos sistemas usando termos vagos como 'sistemas internos' — isso faz o ATS te ignorar e o gestor não sabe o que você opera.",
      "Não exagere no idioma: colocar 'inglês fluente' e travar na entrevista queima sua imagem; seja honesto com o nível.",
      "Não use foto inadequada, e-mail informal (gatinha_xoxo@) ou excesso de cores e fontes decorativas — apresentação conta muito nesta função.",
      "Não liste apenas características genéricas ('proativa, dinâmica, comunicativa') sem provar com exemplo; todo candidato escreve isso.",
      "Não envie o mesmo currículo para clínica, hotel e escritório de advocacia sem adaptar o vocabulário e os destaques de cada segmento."
    ],
    "faqs": [
      {
        "question": "Preciso ter curso técnico para ser recepcionista?",
        "answer": "Não é obrigatório na maioria das vagas — o requisito padrão é ensino médio completo. Mas cursos de atendimento ao cliente, secretariado, informática (Pacote Office) ou um idioma são diferenciais reais e valem destaque no currículo. Para recepção hospitalar ou jurídica, conhecimento específico do segmento (terminologia médica, rotina de convênios, organização de processos) pesa mais que um diploma técnico genérico."
      },
      {
        "question": "Como descrever experiência de recepcionista se foi meu primeiro emprego?",
        "answer": "Foque em qualquer experiência de contato com público: estágio, atendimento em loja, telemarketing, trabalho voluntário ou recepção de eventos. Destaque tarefas transferíveis como atendimento telefônico, organização, uso de computador e comunicação. Sem experiência formal, valorize cursos, domínio de sistemas e idiomas, e use um resumo de objetivo que conecte seu perfil organizado e comunicativo à vaga."
      },
      {
        "question": "Qual a diferença entre currículo de recepcionista de clínica, corporativo e hotel?",
        "answer": "São a mesma base com ênfases diferentes. Clínica: agendamento de consultas, convênios, prontuário, sistemas de gestão de saúde (Feegow, Shosp). Corporativo/empresarial: controle de acesso, PABX, reserva de salas, recebimento de malotes e correspondências. Hotel: check-in/check-out, sistema PMS, atendimento bilíngue e perfil de hospitalidade. Adapte o resumo, as palavras-chave e os destaques de experiência ao segmento da vaga."
      },
      {
        "question": "Devo colocar foto no currículo de recepcionista?",
        "answer": "Para recepção, em que a boa apresentação faz parte da função, uma foto profissional pode ajudar — desde que seja sóbria, com fundo neutro, roupa social e expressão simpática. Evite selfies, fotos de festa ou imagens muito casuais. Se ficar em dúvida sobre o padrão da empresa, o mais seguro é enviar sem foto e levar uma boa apresentação para a entrevista."
      },
      {
        "question": "Quais habilidades de recepcionista os recrutadores mais valorizam?",
        "answer": "Atendimento ao cliente com cordialidade, organização de agenda, domínio de sistemas e telefone, comunicação clara e boa apresentação. Habilidades comportamentais como paciência, discrição com informações sigilosas e capacidade de manter a calma sob pressão pesam muito — a recepção lida com pessoas estressadas e várias demandas ao mesmo tempo. Idiomas e proatividade para resolver imprevistos são os diferenciais que separam candidatos."
      },
      {
        "question": "Como mostrar que domino os sistemas no currículo?",
        "answer": "Crie uma linha de 'Sistemas e Ferramentas' ou inclua nas habilidades, citando cada um pelo nome e contexto: 'Google Agenda e Outlook para gestão de compromissos', 'ERP TOTVS para cadastro', 'PABX para central telefônica', 'Excel intermediário para planilhas de controle'. Sempre que possível, conecte o sistema a um resultado na experiência (ex.: 'reduzi faltas em 22% usando rotina de confirmação no sistema de agendamento')."
      }
    ]
  },
  {
    "slug": "marketing-digital",
    "profession": "Marketing Digital",
    "metaTitle": "Modelo de Currículo para Marketing Digital (2026) | Exemplo Pronto",
    "h1": "Modelo de Currículo para Marketing Digital",
    "metaDescription": "Modelo de currículo de Marketing Digital com exemplo real: tráfego pago, SEO, mídias sociais, métricas e KPIs. Veja habilidades, palavras-chave de ATS, faixa salarial e dicas para passar na triagem.",
    "intro": "Em Marketing Digital, o currículo é a sua primeira campanha — e quem recruta lê centenas deles procurando uma coisa: resultado mensurável. Não basta dizer que você \"gerencia redes sociais\" ou \"roda anúncios\"; é preciso mostrar quanto reduziu o CPA, quantos leads gerou e qual ROAS entregou. Este modelo foi montado para destacar exatamente isso, conectando ferramentas (Meta Ads, Google Ads, GA4) a números que provam o seu impacto.",
    "sampleResume": {
      "name": "Mariana Oliveira Costa",
      "headline": "Analista de Marketing Digital | Tráfego Pago, SEO e Performance",
      "summary": "Profissional de marketing digital com 5 anos de experiência em gestão de mídia paga (Meta Ads e Google Ads), SEO e análise de dados. Foco em performance: reduzi o CPA de campanhas de geração de leads em 38% e escalei investimento de R$ 30 mil para R$ 120 mil/mês mantendo ROAS acima de 4x. Domínio de GA4, Looker Studio e automação de funil.",
      "experience": [
        {
          "role": "Analista de Marketing Digital Pleno",
          "company": "Loja & Cia E-commerce",
          "period": "Mar 2023 - Atual",
          "bullets": [
            "Gestão de R$ 1,4 milhão/ano em mídia paga (Meta Ads e Google Ads), mantendo ROAS médio de 4,2x no e-commerce.",
            "Reestruturei a conta de Google Ads com campanhas Performance Max e segmentação por intenção, reduzindo o CPA em 38% (de R$ 64 para R$ 40) em 4 meses.",
            "Implementei rastreamento server-side via GTM e GA4 após o fim dos cookies de terceiros, recuperando ~25% de conversões antes não atribuídas.",
            "Estruturei calendário e estratégia de SEO de conteúdo: 18 artigos publicados levaram o tráfego orgânico de 12 mil para 41 mil sessões/mês em 8 meses.",
            "Criei dashboards no Looker Studio integrando Meta, Google Ads e GA4, dando à diretoria visibilidade diária de CAC, ROAS e ticket médio."
          ]
        },
        {
          "role": "Assistente de Marketing Digital",
          "company": "Agência Conecta Performance",
          "period": "Jan 2021 - Fev 2023",
          "bullets": [
            "Operei contas de mídia paga de 6 clientes simultâneos (B2B e varejo), com verba total de R$ 80 mil/mês.",
            "Gerenciei o calendário editorial e a comunidade de Instagram e LinkedIn de 4 marcas, elevando a taxa de engajamento média de 1,8% para 3,6%.",
            "Produzi relatórios mensais de KPIs (CTR, CPC, CPL, taxa de conversão) e apresentei resultados diretamente aos clientes.",
            "Conduzi testes A/B de criativos e copies que aumentaram a CTR média dos anúncios em 22%."
          ]
        }
      ],
      "education": [
        {
          "degree": "Bacharelado em Publicidade e Propaganda",
          "institution": "Universidade Federal do Paraná (UFPR)",
          "period": "2016 - 2020"
        },
        {
          "degree": "Certificações: Google Ads Search, Google Analytics (GA4) e Meta Certified Digital Marketing Associate",
          "institution": "Google Skillshop e Meta Blueprint",
          "period": "2021 - 2024"
        }
      ],
      "skills": [
        "Meta Ads (Gerenciador de Anúncios)",
        "Google Ads (Search, PMax, Display)",
        "Google Analytics 4 (GA4)",
        "Google Tag Manager (GTM)",
        "SEO (on-page e técnico)",
        "Looker Studio",
        "Análise de funil e KPIs",
        "Testes A/B",
        "Copywriting para conversão",
        "RD Station / automação de marketing"
      ]
    },
    "keySkills": [
      "Gestão de tráfego pago (Meta Ads e Google Ads)",
      "SEO on-page e técnico",
      "Análise de dados com Google Analytics 4 (GA4)",
      "Configuração de rastreamento via Google Tag Manager",
      "Construção de dashboards (Looker Studio)",
      "Gestão e estratégia de mídias sociais",
      "Copywriting e produção de criativos para conversão",
      "Testes A/B e otimização (CRO)",
      "Automação de marketing e e-mail (funil)",
      "Leitura de KPIs: CAC, ROAS, CPA, CTR, LTV",
      "Marketing de conteúdo e inbound",
      "Planejamento e gestão de verba de mídia"
    ],
    "atsKeywords": [
      "Marketing Digital",
      "Tráfego Pago",
      "Meta Ads",
      "Google Ads",
      "Google Analytics",
      "GA4",
      "SEO",
      "Performance",
      "ROAS",
      "CPA",
      "KPIs",
      "Mídias Sociais",
      "Inbound Marketing",
      "Google Tag Manager",
      "Looker Studio"
    ],
    "salaryNote": "No Brasil (2026), a faixa típica varia conforme senioridade e localização: Júnior/Assistente entre R$ 2.000 e R$ 3.500; Pleno entre R$ 3.500 e R$ 6.500; Sênior/Especialista entre R$ 6.500 e R$ 12.000. Coordenadores e gestores de mídia em grandes empresas ou com PJ podem ultrapassar R$ 15.000. Quem domina tráfego pago com bom histórico de ROAS e atuação data-driven tende a ficar no topo da faixa.",
    "dos": [
      "Quantifique tudo: troque 'gerenciava campanhas' por 'gerenciei R$ 50 mil/mês em Meta Ads com ROAS de 4x'. Números vencem adjetivos.",
      "Cite as ferramentas pelo nome exato (Meta Ads, Google Ads, GA4, GTM, Looker Studio) — os sistemas de ATS buscam esses termos literalmente.",
      "Liste certificações reais e verificáveis (Google Skillshop, Meta Blueprint) com o ano, pois agregam credibilidade técnica imediata.",
      "Mostre domínio de métricas de negócio (CAC, ROAS, LTV), não só de vaidade (curtidas, seguidores) — isso separa o operador do estrategista.",
      "Adapte o currículo ao tipo de vaga: foque em tráfego pago para performance, ou em conteúdo e SEO para inbound, em vez de um currículo genérico.",
      "Inclua link para portfólio, LinkedIn atualizado ou um estudo de caso real de campanha que você otimizou."
    ],
    "donts": [
      "Não escreva 'conhecimento em redes sociais' sem contexto — especifique plataformas, objetivos e resultados alcançados.",
      "Não confunda métricas de vaidade com resultado de negócio: 10 mil seguidores sem conversão não impressiona quem contrata.",
      "Não invente domínio de ferramentas que você não sabe operar — a entrevista técnica e os testes práticos expõem isso rapidamente.",
      "Não use um currículo único para todas as vagas; uma vaga de 'Gestor de Tráfego' e outra de 'Analista de Conteúdo' pedem destaques diferentes.",
      "Não despeje siglas sem mostrar uso prático (ex.: citar 'CRO' sem nenhum teste A/B no histórico soa decorado).",
      "Não deixe o resumo profissional vago ('apaixonado por marketing'); abra com sua especialidade e seu maior resultado numérico."
    ],
    "faqs": [
      {
        "question": "Preciso saber programar para trabalhar com marketing digital?",
        "answer": "Não é obrigatório programar, mas conhecimento técnico básico ajuda muito e diferencia o currículo. Saber configurar o Google Tag Manager, entender pixels de conversão, ler um relatório de GA4 e mexer em HTML/CSS básico para landing pages são diferenciais reais. Para vagas de performance e dados, esse domínio técnico costuma valer mais que um curso a mais de design."
      },
      {
        "question": "Como mostro resultados se trabalhei em projetos pequenos ou freelas?",
        "answer": "Use os números que você tem, mesmo que pequenos: 'reduzi o CPA de R$ 30 para R$ 18 em uma campanha local' ou 'levei o Instagram de um cliente de 500 para 4 mil seguidores com 3% de engajamento'. Percentuais e antes/depois funcionam em qualquer escala. Se não tiver acesso a dados de clientes, crie um projeto próprio (um blog com SEO ou uma campanha teste) e documente como estudo de caso."
      },
      {
        "question": "Quais certificações realmente fazem diferença no currículo?",
        "answer": "As gratuitas e oficiais das próprias plataformas têm o melhor custo-benefício: Google Ads e Google Analytics (GA4) pelo Google Skillshop, e Meta Certified Digital Marketing Associate pelo Meta Blueprint. Elas são reconhecidas pelo mercado, validam que você opera as ferramentas e aparecem bem em buscas de recrutadores. Inclua o ano para mostrar que estão atualizadas."
      },
      {
        "question": "Devo separar o currículo por especialidade (tráfego, SEO, social)?",
        "answer": "Não precisa de currículos completamente diferentes, mas vale reordenar os destaques conforme a vaga. Para 'Gestor de Tráfego', coloque mídia paga, ROAS e CPA no topo. Para 'Analista de Conteúdo/SEO', destaque crescimento orgânico, palavras-chave e produção. O ATS e o recrutador batem o olho nos primeiros itens — eles precisam refletir exatamente o que a vaga pede."
      },
      {
        "question": "Qual a diferença entre um currículo de marketing júnior e sênior?",
        "answer": "O júnior demonstra domínio das ferramentas e disposição para executar (operou campanhas, fez relatórios, postou e otimizou). O sênior demonstra estratégia e impacto no negócio: definiu canais, geriu verbas maiores, escalou investimento com eficiência e liderou pessoas ou projetos. Na prática, o currículo sênior fala de decisões e resultados de negócio (CAC, LTV, escala), não apenas de execução de tarefas."
      }
    ]
  },
  {
    "slug": "social-media",
    "profession": "Social Media",
    "metaTitle": "Modelo de Currículo para Social Media (2026) | Exemplo Pronto",
    "h1": "Modelo de Currículo para Social Media",
    "metaDescription": "Modelo de currículo para Social Media com exemplo real: gestão de redes sociais, calendário de conteúdo, copywriting, métricas e KPIs. Habilidades, palavras-chave de ATS, faixa salarial e dicas.",
    "intro": "O currículo de quem trabalha com Social Media precisa provar uma coisa que recrutador adora e candidato esquece: que você move métrica, não só posta bonito. Postar todo dia é o mínimo; o que diferencia é mostrar que você fez o engajamento subir, o alcance crescer e a audiência virar comunidade (e, quando dá, venda). Cuidado para não cair na armadilha das métricas de vaidade: 'aumentei os seguidores' diz pouco se você não conta de quanto para quanto, em quanto tempo e com qual estratégia de conteúdo. Este modelo mostra como estruturar gestão de redes, calendário editorial, copywriting, ferramentas e KPIs em bullets que provam resultado — sem confundir a vaga com a de tráfego pago ou de marketing genérico.",
    "sampleResume": {
      "name": "Beatriz Almeida Nunes",
      "headline": "Analista de Social Media | Conteúdo, Comunidade e Métricas",
      "summary": "Social media com 4 anos de experiência em gestão de redes sociais de marcas B2C, do calendário editorial à análise de performance. Especialista em transformar audiência em comunidade engajada: levei o Instagram de uma marca de moda de 18 mil para 76 mil seguidores em 14 meses, com taxa de engajamento média de 5,4%. Domínio de Instagram, TikTok, LinkedIn, edição de Reels (CapCut), copywriting e relatórios de KPIs (Meta Business Suite, Metricool).",
      "experience": [
        {
          "role": "Analista de Social Media Pleno",
          "company": "Marca Própria Moda & Lifestyle",
          "period": "Fev 2023 - Atual",
          "bullets": [
            "Conduzi a estratégia de conteúdo de Instagram, TikTok e Pinterest, levando o perfil principal de 18 mil para 76 mil seguidores em 14 meses, com taxa de engajamento média de 5,4% (acima da média do setor).",
            "Estruturei um calendário editorial mensal com pilares de conteúdo definidos (educativo, bastidores, prova social e venda), elevando a frequência de 4 para 12 publicações semanais sem queda de qualidade.",
            "Produzi e editei Reels e vídeos para TikTok no CapCut: 3 vídeos ultrapassaram 1 milhão de visualizações cada e geraram pico de 9 mil novos seguidores em uma semana.",
            "Gerenciei a comunidade respondendo comentários e DMs com tempo médio de resposta abaixo de 2 horas, o que reduziu reclamações públicas e aumentou as menções espontâneas à marca.",
            "Montei relatórios mensais de KPIs (alcance, impressões, taxa de engajamento, salvamentos, compartilhamentos e crescimento de seguidores) no Looker Studio, conectando o conteúdo orgânico a um aumento de 27% no tráfego de social para o e-commerce."
          ]
        },
        {
          "role": "Assistente de Social Media",
          "company": "Agência Engaja Conteúdo",
          "period": "Jan 2021 - Jan 2023",
          "bullets": [
            "Operei as redes sociais de 5 clientes simultâneos (alimentação, beleza e serviços), cuidando de calendário, copywriting de legendas, agendamento e community management.",
            "Escrevi legendas e roteiros de Reels com foco em retenção e CTA, aumentando a taxa média de salvamentos dos posts dos clientes em 31%.",
            "Agendei publicações e organizei o fluxo de aprovação no mLabs e Trello, garantindo zero atrasos de postagem ao longo de 18 meses.",
            "Acompanhei tendências e áudios em alta no TikTok e Instagram, adaptando-os à identidade de cada marca e gerando os vídeos de melhor desempenho do trimestre.",
            "Produzi relatórios quinzenais de desempenho e apresentei os resultados diretamente aos clientes, traduzindo métricas em recomendações de pauta."
          ]
        }
      ],
      "education": [
        {
          "degree": "Bacharelado em Publicidade e Propaganda",
          "institution": "Pontifícia Universidade Católica do Rio Grande do Sul (PUCRS)",
          "period": "2017 - 2021"
        },
        {
          "degree": "Certificações: Meta Certified Digital Marketing Associate e Marketing de Conteúdo (HubSpot Academy)",
          "institution": "Meta Blueprint e HubSpot Academy",
          "period": "2022 - 2023"
        }
      ],
      "skills": [
        "Gestão de redes sociais (Instagram, TikTok, LinkedIn)",
        "Calendário e planejamento editorial",
        "Copywriting de legendas e roteiros",
        "Edição de Reels e vídeos curtos (CapCut)",
        "Community management (comentários e DMs)",
        "Meta Business Suite",
        "Metricool / mLabs (agendamento e relatórios)",
        "Canva (design de posts)",
        "Análise de KPIs e relatórios",
        "Identificação de tendências e social listening"
      ]
    },
    "keySkills": [
      "Gestão de redes sociais (Instagram, TikTok, LinkedIn, Facebook, X)",
      "Planejamento e gestão de calendário de conteúdo (pilares e pautas)",
      "Copywriting para social: legendas, roteiros de Reels e CTAs",
      "Edição de vídeos curtos e Reels (CapCut, InShot, Premiere)",
      "Design de posts (Canva, Figma ou Photoshop básico)",
      "Community management e gestão de crise nos comentários",
      "Ferramentas de agendamento e gestão (Metricool, mLabs, Etus, Hootsuite)",
      "Análise de métricas e KPIs (engajamento, alcance, salvamentos, crescimento)",
      "Relatórios de performance (Meta Business Suite, Looker Studio)",
      "Social listening e acompanhamento de tendências",
      "Influencer marketing e gestão de parcerias/UGC",
      "Fotografia e produção de conteúdo para feed"
    ],
    "atsKeywords": [
      "Social Media",
      "Mídias Sociais",
      "Gestão de Redes Sociais",
      "Calendário de Conteúdo",
      "Instagram",
      "TikTok",
      "LinkedIn",
      "Reels",
      "Copywriting",
      "Community Manager",
      "Engajamento",
      "KPIs",
      "Meta Business Suite",
      "Metricool",
      "Canva",
      "Produção de Conteúdo"
    ],
    "salaryNote": "No Brasil (2026), a faixa típica de Social Media varia por senioridade e porte da empresa: Júnior/Assistente entre R$ 1.800 e R$ 3.000; Pleno/Analista entre R$ 3.000 e R$ 5.500; Sênior/Coordenador de Social Media entre R$ 5.500 e R$ 10.000. Em agências, os salários iniciais tendem a ser mais baixos que em empresas com marca própria. Quem acumula edição de vídeo, copywriting forte e leitura de dados (não só execução) costuma ficar no topo da faixa, e gestores de social em grandes marcas ou no modelo PJ podem ultrapassar R$ 12.000.",
    "dos": [
      "Quantifique o crescimento com antes/depois e prazo: 'levei o Instagram de 18 mil para 76 mil seguidores em 14 meses' diz muito mais que 'aumentei os seguidores'.",
      "Cite as plataformas e ferramentas pelo nome exato (Instagram, TikTok, Meta Business Suite, Metricool, CapCut, Canva) — o ATS busca esses termos literalmente.",
      "Mostre que você pensa em estratégia, não só em execução: pilares de conteúdo, calendário editorial e leitura de métricas separam o analista do mero 'postador'.",
      "Inclua link para um portfólio ou para os próprios perfis que você gerenciou (com permissão) — em social media, o trabalho é público e isso prova o que você fala.",
      "Destaque habilidades de produção (edição de Reels, copywriting, design no Canva), porque a maioria das vagas pede um profissional 'mão na massa' completo.",
      "Adapte o currículo ao tipo de marca: B2C/varejo valoriza engajamento e vendas; B2B e LinkedIn valorizam autoridade, conteúdo educativo e geração de leads."
    ],
    "donts": [
      "Não liste métricas de vaidade soltas ('10 mil seguidores') sem contexto de estratégia, prazo e resultado de negócio.",
      "Não escreva 'cuido das redes sociais' de forma genérica — especifique quais plataformas, qual tipo de conteúdo e quais resultados.",
      "Não ignore os números: um currículo de social sem nenhuma métrica (engajamento, alcance, crescimento) parece de quem nunca olhou um relatório.",
      "Não confunda a vaga com a de tráfego pago; se a vaga é orgânica, não encha o currículo de ROAS e CPA, e vice-versa.",
      "Não invente domínio de ferramentas de edição ou design — em entrevista é comum pedir um teste prático de Reels ou de copy na hora.",
      "Não deixe o resumo vago ('apaixonada por redes sociais'); abra com sua especialidade (conteúdo, comunidade ou performance orgânica) e seu maior resultado."
    ],
    "faqs": [
      {
        "question": "Preciso saber editar vídeo e fazer design para trabalhar com social media?",
        "answer": "Na maioria das vagas, sim — pelo menos no nível operacional. O mercado de social media hoje espera um profissional 'mão na massa' que edita Reels (CapCut ou InShot), monta posts no Canva e escreve a própria copy. Não precisa ser editor profissional nem designer formado, mas saber produzir conteúdo de vídeo curto com agilidade é um dos maiores diferenciais do currículo em 2026, já que vídeo vertical domina o alcance orgânico."
      },
      {
        "question": "Qual a diferença entre Social Media, Community Manager e Gestor de Tráfego?",
        "answer": "Social Media é quem planeja e produz o conteúdo orgânico (calendário, posts, Reels, copy) e analisa o desempenho. Community Manager foca na relação com a audiência: responde comentários e DMs, gerencia a comunidade e atua em crises. Gestor de Tráfego cuida da mídia paga (impulsionar posts, anúncios no Meta Ads). Em empresas menores, uma pessoa faz tudo; em maiores, são funções separadas. No currículo, deixe claro qual dessas frentes é a sua especialidade principal."
      },
      {
        "question": "Como mostro resultados se só trabalhei com perfis pequenos ou pessoais?",
        "answer": "Use os números que você tem e mostre a evolução percentual: 'levei um perfil de 500 para 4 mil seguidores em 6 meses com 4% de engajamento' funciona em qualquer escala. Se não gerenciou marcas, crie um projeto próprio — um perfil de nicho que você cuida — e documente a estratégia, o calendário e o crescimento como estudo de caso. Em social media, mostrar um perfil real que você construiu vale mais que listar cursos."
      },
      {
        "question": "Quais métricas devo destacar no currículo de social media?",
        "answer": "Priorize as que provam impacto real: crescimento de seguidores (com prazo), taxa de engajamento, alcance e impressões, salvamentos e compartilhamentos (que mostram conteúdo de valor) e, quando houver, conversões ou tráfego gerado para o site. Evite destacar só curtidas e número total de seguidores isolados — recrutadores experientes sabem que são as métricas mais fáceis de inflar e as que menos refletem estratégia."
      },
      {
        "question": "Vale a pena incluir links dos perfis que gerenciei no currículo?",
        "answer": "Sim, é um dos maiores diferenciais. Social media é um trabalho público e verificável: incluir o link dos perfis que você gerenciou (com autorização do cliente ou empregador) permite que o recrutador veja na hora a qualidade do seu conteúdo, a consistência do feed e o engajamento. Se houver confidencialidade, monte um portfólio simples (até no Canva ou Notion) com prints, métricas e exemplos dos melhores posts."
      }
    ]
  },
  {
    "slug": "tecnico-de-enfermagem",
    "profession": "Técnico de Enfermagem",
    "metaTitle": "Modelo de Currículo para Técnico de Enfermagem (Exemplo Pronto 2026)",
    "h1": "Modelo de Currículo para Técnico de Enfermagem",
    "metaDescription": "Modelo de currículo para técnico de enfermagem com exemplo real, número do COREN, setores (UTI, PS), procedimentos técnicos, palavras-chave de ATS, faixa salarial e dicas de triagem.",
    "intro": "No currículo de um técnico de enfermagem, a primeira coisa que o recrutador procura não é a sua experiência: é o seu COREN ativo. Sem o registro válido no Conselho Regional de Enfermagem, o currículo é descartado na triagem, por melhor que seja. Depois disso, o que diferencia candidatos é a especificidade clínica: em quais setores você atuou (UTI, pronto-socorro, centro cirúrgico, clínica médica), quais procedimentos domina (punção venosa, sondagem, curativos, administração de medicação) e que volume você sustentava (número de leitos, plantões, escala). Hospitais e operadoras usam ATS que filtram por termos como \"COREN\", \"sinais vitais\", \"UTI\" e \"punção\"; e a enfermeira responsável pela triagem lê em segundos buscando setor e procedimentos. Este modelo mostra exatamente como organizar registro profissional, setores, procedimentos e resultados para passar nos dois filtros.",
    "sampleResume": {
      "name": "Mariana Souza Oliveira",
      "headline": "Técnica de Enfermagem | COREN-SP 1.234.567-TE | UTI Adulto e Pronto-Socorro",
      "summary": "Técnica de enfermagem com 6 anos de experiência em unidades de alta complexidade, com atuação consolidada em UTI adulto e pronto-socorro. Domínio de monitorização de sinais vitais, administração segura de medicação (checagem dos 9 certos), punção venosa periférica, controle de bombas de infusão e cuidados com pacientes em ventilação mecânica. Forte alinhamento a protocolos de segurança do paciente, prevenção de infecção hospitalar (NRs e CCIH) e registro de enfermagem no prontuário eletrônico. Disponibilidade para escala 12x36.",
      "experience": [
        {
          "role": "Técnica de Enfermagem - UTI Adulto",
          "company": "Hospital Santa Clara (UTI de 20 leitos)",
          "period": "Fev 2022 - Atual",
          "bullets": [
            "Assistência a pacientes críticos em ventilação mecânica e drogas vasoativas em UTI de 20 leitos, mantendo registro horário de sinais vitais e balanço hídrico no prontuário eletrônico (MV/Tasy).",
            "Administração de medicação endovenosa em bomba de infusão seguindo os 9 certos, com índice zero de erros de medicação notificados nos últimos 18 meses em auditoria interna.",
            "Realização de punção venosa periférica, coleta de gasometria arterial sob supervisão e cuidados com cateter venoso central, contribuindo para a queda da taxa de infecção de corrente sanguínea (ICS) da unidade.",
            "Participação ativa nos bundles de prevenção de PAV e ICSAVC da CCIH, reforçando cabeceira a 30-45°, higiene oral com clorexidina e troca de curativo de CVC conforme protocolo.",
            "Atuação em escala 12x36 com passagem de plantão estruturada (SBAR), reduzindo intercorrências por falha de comunicação entre turnos."
          ]
        },
        {
          "role": "Técnica de Enfermagem - Pronto-Socorro",
          "company": "Pronto Atendimento Vida Plena",
          "period": "Mar 2020 - Jan 2022",
          "bullets": [
            "Acolhimento e classificação de risco (Protocolo de Manchester) de cerca de 80 pacientes por plantão, aferindo sinais vitais e priorizando atendimentos por gravidade.",
            "Preparo e administração de medicação por via oral, IM, SC e EV em sala de emergência, incluindo suporte em paradas cardiorrespiratórias e auxílio no carrinho de emergência.",
            "Execução de procedimentos técnicos: sondagem vesical de demora, sondagem nasogástrica, curativos, eletrocardiograma (ECG) e nebulização.",
            "Controle e checagem diária de validade e lacre do carrinho de emergência e de medicamentos de alta vigilância (insulina, eletrólitos, opioides), garantindo conformidade em auditorias.",
            "Orientação de alta a pacientes e familiares sobre medicação domiciliar e retorno, reduzindo reincidências por uso incorreto de prescrição."
          ]
        }
      ],
      "education": [
        {
          "degree": "Curso Técnico em Enfermagem",
          "institution": "Escola Técnica Estadual (ETEC) - registro COREN-SP",
          "period": "2018 - 2019"
        },
        {
          "degree": "Atualização em Urgência e Emergência + Suporte Básico de Vida (BLS)",
          "institution": "Centro de Educação em Enfermagem",
          "period": "2023"
        }
      ],
      "skills": [
        "Aferição e monitorização de sinais vitais",
        "Administração de medicação (oral, IM, SC, EV) e 9 certos",
        "Punção venosa periférica e cuidados com CVC",
        "Bombas de infusão e controle de gotejamento",
        "Sondagem vesical e nasogástrica",
        "Curativos e prevenção de lesão por pressão",
        "Suporte em ventilação mecânica (UTI)",
        "Classificação de risco (Protocolo de Manchester)",
        "BLS / suporte em PCR e carrinho de emergência",
        "Prontuário eletrônico (MV, Tasy) e registro de enfermagem",
        "Protocolos de segurança do paciente e CCIH",
        "Escala 12x36 e passagem de plantão (SBAR)"
      ]
    },
    "keySkills": [
      "Aferição de sinais vitais (PA, FC, FR, SpO2, temperatura, dor)",
      "Administração de medicação por via oral, IM, SC, EV e inalatória",
      "Verificação dos certos da medicação (paciente, droga, dose, via, hora, registro)",
      "Punção venosa periférica e manuseio de acesso venoso central",
      "Operação de bombas de infusão e cálculo de gotejamento",
      "Sondagem vesical de demora e de alívio e sondagem nasogástrica/nasoenteral",
      "Curativos, prevenção e tratamento de lesão por pressão",
      "Coleta de exames (sangue, urina, swab) e realização de ECG e glicemia capilar",
      "Suporte a pacientes em ventilação mecânica e drogas vasoativas (UTI)",
      "Classificação de risco e acolhimento em pronto-socorro (Protocolo de Manchester)",
      "Suporte Básico de Vida (BLS) e atuação em parada cardiorrespiratória",
      "Prevenção de infecção hospitalar e adesão a protocolos da CCIH",
      "Registro de enfermagem em prontuário (físico e eletrônico: MV, Tasy, Pixeon)",
      "Segurança do paciente: identificação, prevenção de quedas e de erro de medicação"
    ],
    "atsKeywords": [
      "Técnico de Enfermagem",
      "COREN",
      "Sinais vitais",
      "Administração de medicação",
      "Punção venosa",
      "UTI",
      "Pronto-socorro",
      "Centro cirúrgico",
      "Sondagem vesical",
      "Sondagem nasogástrica",
      "Curativos",
      "Bomba de infusão",
      "Ventilação mecânica",
      "Classificação de risco",
      "Protocolo de Manchester",
      "Suporte Básico de Vida (BLS)",
      "Segurança do paciente",
      "CCIH",
      "Prontuário eletrônico",
      "Escala 12x36",
      "Glicemia capilar",
      "Eletrocardiograma (ECG)"
    ],
    "salaryNote": "O piso salarial nacional do técnico de enfermagem é de R$ 3.325 (Lei 14.434/2022), válido para os setores público e privado, mas que segue sem reajuste automático desde 2022. Na prática de mercado em 2026, a remuneração varia bastante: início de carreira (júnior, recém-formado) costuma ficar entre R$ 2.200 e R$ 3.300 em clínicas e atenção básica; pleno (com experiência em setores fechados) entre R$ 3.300 e R$ 4.500; e sênior/especializado (UTI, centro cirúrgico, hemodiálise, com adicionais) pode passar de R$ 4.500, podendo chegar a R$ 5.500 ou mais. Os valores variam por região (capitais e Sul/Sudeste pagam mais), por adicionais legais (insalubridade, periculosidade e noturno), por setor (UTI, CC e emergência tendem a pagar mais que enfermaria) e por tipo de vínculo (hospital privado, público concursado, home care ou cooperativa).",
    "dos": [
      "Coloque o número do COREN com o estado e a categoria (ex.: COREN-SP 1.234.567-TE) logo no cabeçalho, junto ao nome e ao contato — é o primeiro item verificado.",
      "Especifique os setores em que atuou (UTI, pronto-socorro, centro cirúrgico, clínica médica, oncologia) e o porte da unidade (número de leitos), porque cada setor exige competências distintas.",
      "Liste os procedimentos técnicos que você executa de fato: punção venosa, sondagem, curativos, administração de medicação, ECG, glicemia capilar, controle de bomba de infusão.",
      "Quantifique o que der: leitos sob cuidado, pacientes por plantão, índice zero de erro de medicação, adesão a bundles da CCIH, redução de intercorrências.",
      "Cite os protocolos e sistemas que domina (Protocolo de Manchester, 9 certos, SBAR, prontuário MV/Tasy, bundles de PAV e ICS) — são palavras-chave fortes de ATS hospitalar.",
      "Inclua cursos e certificações vigentes (BLS, ACLS, urgência e emergência, hemodiálise, UTI) e a disponibilidade de escala (12x36, plantões, noturno)."
    ],
    "donts": [
      "Não omita ou deixe vago o número do COREN — registro inativo ou ausente reprova o currículo automaticamente na triagem.",
      "Não descreva funções genéricas como 'auxiliei a equipe de enfermagem' sem dizer o setor, os procedimentos e a complexidade dos pacientes.",
      "Não confunda atribuições de auxiliar, técnico e enfermeiro; deixe claro o que é da sua competência legal para não passar impressão de exagero ou de exercício irregular.",
      "Não use um único currículo para vagas muito diferentes: o perfil de UTI não é o mesmo de atenção básica, home care ou centro cirúrgico — adapte os setores e procedimentos em destaque.",
      "Não invente domínio de procedimentos de alta complexidade que você nunca executou; isso é checado no teste prático e na entrevista técnica com a enfermeira.",
      "Não use layout poluído, fotos desnecessárias, colunas complexas ou ícones que travem o ATS; prefira uma coluna limpa e legível, com seções claras."
    ],
    "faqs": [
      {
        "question": "Preciso colocar o número do COREN no currículo de técnico de enfermagem?",
        "answer": "Sim, e logo no topo. O registro ativo no Conselho Regional de Enfermagem (COREN) é exigência legal para exercer a profissão, e a maioria dos hospitais e operadoras filtra os currículos por esse dado já na triagem automatizada. Escreva no formato COREN-[UF] [número]-TE (a sigla TE indica Técnico de Enfermagem), por exemplo: COREN-SP 1.234.567-TE. Mantenha o registro com anuidade em dia, porque um COREN inativo invalida a candidatura."
      },
      {
        "question": "Como destacar experiência em setores como UTI e pronto-socorro?",
        "answer": "Crie uma linha de experiência por setor, deixando claro o nome do setor, o porte da unidade (número de leitos) e a complexidade dos pacientes. Em UTI, cite ventilação mecânica, drogas vasoativas, monitorização contínua e bundles da CCIH. Em pronto-socorro, cite classificação de risco (Protocolo de Manchester), sala de emergência, atendimento a PCR e volume de pacientes por plantão. Esses termos são exatamente o que a enfermeira responsável procura e o que o ATS hospitalar indexa."
      },
      {
        "question": "Que procedimentos técnicos devo listar no currículo?",
        "answer": "Liste apenas os que você executa de fato e que são da competência do técnico: aferição de sinais vitais, administração de medicação (oral, IM, SC, EV e inalatória), punção venosa periférica, cuidados com cateter venoso central, sondagem vesical e nasogástrica, curativos, coleta de exames, glicemia capilar, ECG, nebulização e controle de bombas de infusão. Agrupe-os numa seção de habilidades técnicas para facilitar a leitura rápida e a captura pelo ATS."
      },
      {
        "question": "Como mostrar que sei administrar medicação com segurança?",
        "answer": "Cite explicitamente os protocolos de segurança do paciente que você segue, como a checagem dos certos da medicação (paciente certo, medicamento, dose, via, horário, registro e validade), a dupla checagem de medicamentos de alta vigilância (insulina, eletrólitos concentrados, opioides) e o uso correto de bomba de infusão e cálculo de gotejamento. Se tiver um indicador, use-o: por exemplo, 'índice zero de erros de medicação notificados em auditoria interna'. Isso transmite responsabilidade e reduz o risco percebido pela contratação."
      },
      {
        "question": "Qual a diferença entre o currículo de auxiliar e de técnico de enfermagem?",
        "answer": "O técnico tem formação e competência legal para procedimentos de maior complexidade do que o auxiliar, como punção venosa, administração de medicação endovenosa, sondagens e atuação em setores fechados (UTI, CC). No currículo, isso deve aparecer no destaque dos procedimentos e dos setores: enquanto o auxiliar enfatiza cuidados básicos e higiene, o técnico enfatiza procedimentos invasivos, suporte a pacientes críticos e operação de equipamentos. Deixar isso claro evita subaproveitamento ou expectativas equivocadas na seleção."
      },
      {
        "question": "Vale a pena incluir certificações como BLS e cursos de UTI?",
        "answer": "Sim. Certificações de Suporte Básico de Vida (BLS), urgência e emergência, UTI, hemodiálise e atualização em segurança do paciente diferenciam o candidato e funcionam como palavras-chave para vagas de alta complexidade. Coloque o nome do curso, a instituição e o ano, e priorize as certificações ainda válidas. Para vagas de UTI e PS, um BLS atualizado costuma ser um critério prático de desempate."
      }
    ]
  },
  {
    "slug": "operador-de-caixa",
    "profession": "Operador de Caixa",
    "metaTitle": "Modelo de Currículo para Operador de Caixa (Exemplo Pronto 2026)",
    "h1": "Modelo de Currículo para Operador de Caixa",
    "metaDescription": "Modelo de currículo para Operador de Caixa com exemplo real, resumo, experiências com resultados, sistema PDV, fechamento de caixa, habilidades, palavras-chave de ATS e faixa salarial em R$.",
    "intro": "Numa vaga de Operador de Caixa, o gerente de loja recebe dezenas de currículos quase iguais: \"responsável pelo caixa\" e nada mais. O que faz você ser chamado é provar três coisas em segundos — que você é ágil no atendimento, confiável no manuseio de dinheiro e que fecha o caixa sem quebra (sobra ou falta). Recrutadores de varejo olham primeiro se você já operou sistema PDV, qual o volume de clientes que atendia e se o seu caixa batia certo no fechamento. Este modelo traz um exemplo completo e realista, com bullets de resultado, as habilidades que pesam na seleção e as palavras-chave que os filtros de triagem (ATS) e o RH do varejo realmente buscam.",
    "sampleResume": {
      "name": "Juliana Aparecida Lima",
      "headline": "Operadora de Caixa | Sistema PDV | Atendimento Ágil e Fechamento sem Quebra",
      "summary": "Operadora de Caixa com 4 anos de experiência em supermercado e loja de varejo, com domínio de sistema PDV, manuseio de valores (dinheiro, cartão, Pix e vale) e fechamento de caixa com conferência de cupom. Reconhecida pela agilidade no atendimento em horários de pico e pelo histórico de caixa fechado sem quebras relevantes. Foco em fila ágil, cobrança correta e atendimento cordial que fideliza o cliente.",
      "experience": [
        {
          "role": "Operadora de Caixa",
          "company": "Supermercado Preço Bom (loja de bairro, 12 checkouts)",
          "period": "Mar 2022 - Atual",
          "bullets": [
            "Atendo em média 280 clientes por dia no PDV em horários de pico, com tempo médio de fila reduzido por agilidade na passagem de produtos e no registro de código de barras.",
            "Realizo o fechamento de caixa diário com conferência de sangria, suprimento e cupom, mantendo índice de quebra (sobra/falta) abaixo de R$ 5,00 por turno.",
            "Opero diferentes formas de pagamento — dinheiro, cartão de débito/crédito, Pix e vale-alimentação/refeição — conferindo troco e autenticando boletos sem erros de cobrança.",
            "Identifiquei e barrei tentativas de pagamento com cédulas falsas usando caneta detectora e conferência visual, evitando prejuízo ao caixa.",
            "Apoio a abertura e o reabastecimento de sacolas e a organização do checkout, além de cadastrar clientes no programa de fidelidade, contribuindo para o aumento de adesões no setor."
          ]
        },
        {
          "role": "Operadora de Caixa / Atendente",
          "company": "Drogaria Saúde & Vida",
          "period": "Jan 2020 - Fev 2022",
          "bullets": [
            "Operava o caixa e o sistema PDV da farmácia, registrando vendas, aplicando descontos de convênios e programas de desconto em medicamentos com precisão.",
            "Fazia a abertura do caixa com conferência do fundo de troco e o fechamento ao fim do turno, batendo o valor físico com o relatório do sistema.",
            "Realizei cross-sell no caixa oferecendo itens de conveniência e genéricos, contribuindo para o aumento do ticket médio do balcão.",
            "Mantive postura cordial e paciente com o público idoso, explicando posologia básica e encaminhando dúvidas técnicas ao farmacêutico responsável."
          ]
        }
      ],
      "education": [
        {
          "degree": "Ensino Médio Completo",
          "institution": "E.E. Professora Maria do Carmo",
          "period": "Concluído em 2019"
        },
        {
          "degree": "Curso de Operador de Caixa e Atendimento ao Cliente (40h)",
          "institution": "Senac",
          "period": "2021"
        },
        {
          "degree": "Curso de Frente de Caixa e Prevenção de Perdas (online, 20h)",
          "institution": "Curso livre",
          "period": "2023"
        }
      ],
      "skills": [
        "Operação de sistema PDV (frente de caixa)",
        "Manuseio de valores e conferência de troco",
        "Formas de pagamento: dinheiro, cartão, Pix e vale",
        "Abertura e fechamento de caixa (sangria e suprimento)",
        "Conferência de cupom fiscal e relatório de caixa",
        "Agilidade na fila e atendimento em horário de pico",
        "Identificação de cédulas falsas e prevenção de perdas",
        "Atendimento ao cliente cordial e resolução de dúvidas",
        "Leitura de código de barras e registro de produtos",
        "Organização e limpeza do checkout"
      ]
    },
    "keySkills": [
      "Operação de sistema PDV / frente de caixa",
      "Manuseio de valores, conferência de troco e contagem de dinheiro",
      "Domínio de formas de pagamento: dinheiro, cartão, Pix, TEF e vale (alimentação/refeição)",
      "Abertura e fechamento de caixa, com sangria e suprimento",
      "Conferência de cupom fiscal e relatório de fechamento",
      "Agilidade no atendimento e gestão de fila em horário de pico",
      "Identificação de cédulas falsas e prevenção de perdas (loss prevention)",
      "Atendimento ao cliente cordial, paciência e resolução de objeções",
      "Leitura de código de barras e registro correto de produtos",
      "Aplicação de descontos, promoções e programas de fidelidade",
      "Atenção a detalhes para evitar quebra de caixa (sobra/falta)",
      "Organização, higiene e reabastecimento do checkout"
    ],
    "atsKeywords": [
      "Operador de Caixa",
      "Operadora de Caixa",
      "frente de caixa",
      "sistema PDV",
      "atendimento ao cliente",
      "manuseio de valores",
      "fechamento de caixa",
      "abertura de caixa",
      "sangria",
      "conferência de cupom",
      "formas de pagamento",
      "Pix",
      "cartão de crédito e débito",
      "vale-alimentação",
      "prevenção de perdas",
      "cédulas falsas",
      "agilidade",
      "varejo",
      "supermercado"
    ],
    "salaryNote": "No Brasil (2026), a faixa salarial de Operador de Caixa varia conforme região, porte da loja e setor. Júnior/início de carreira (primeiro emprego ou pouca experiência): cerca de R$ 1.500 a R$ 1.800 por mês, normalmente próximo do piso da categoria do comércio. Pleno (1 a 3 anos, com domínio de PDV e fechamento de caixa): cerca de R$ 1.800 a R$ 2.300. Sênior ou líder de caixa / supervisor de frente de caixa (com responsabilidade sobre conferência, escala e treinamento de novatos): cerca de R$ 2.300 a R$ 3.200. Em grandes redes de supermercado e atacarejo, e em capitais, os valores tendem ao topo da faixa, geralmente somados a benefícios como vale-transporte, vale-refeição/alimentação, cesta básica e, em algumas redes, comissão por adesão a programas de fidelidade ou cartão da loja. Atenção também à convenção coletiva do sindicato do comércio da sua cidade, que define o piso.",
    "dos": [
      "Diga logo no topo que você opera sistema PDV e cite o tipo de loja (supermercado, farmácia, loja de roupa, atacarejo) — é a primeira coisa que o gerente procura.",
      "Quantifique o volume: 'atendia cerca de 280 clientes/dia' ou 'operava em horário de pico com 12 checkouts' diz muito mais que 'trabalhava no caixa'.",
      "Destaque o controle financeiro: caixa fechado sem quebra, índice de sobra/falta baixo, conferência de sangria e suprimento — isso é o que mais gera confiança.",
      "Cite todas as formas de pagamento que você domina (dinheiro, cartão, Pix, TEF, vale, boleto) e a conferência de troco.",
      "Inclua prevenção de perdas: identificação de cédulas falsas, atenção a fraudes de cartão e conferência de produtos para evitar furto no checkout.",
      "Mostre o lado de atendimento: cordialidade, agilidade na fila, cadastro em fidelidade e cross-sell de itens no caixa, que diferenciam você de um operador comum."
    ],
    "donts": [
      "Não escreva apenas 'responsável pelo caixa' sem dizer qual sistema, o volume de clientes e como você fechava o caixa.",
      "Não omita que você sabe operar PDV e conferir fechamento — para essa vaga é palavra-chave decisiva na triagem.",
      "Não invente experiência com valores altos ou liderança de caixa que você não teve; o gerente confirma na entrevista e no período de experiência.",
      "Não use foto informal, número de RG/CPF, estado civil ou pretensão salarial fixa no corpo do currículo (a menos que a vaga peça).",
      "Não deixe erros de português e de digitação; numa função que lida com dinheiro e cupom, atenção a detalhes é exatamente o que avaliam.",
      "Não envie um currículo de várias páginas — para frente de caixa, uma página limpa e objetiva é o ideal, e o recrutador lê em segundos."
    ],
    "faqs": [
      {
        "question": "Preciso de experiência para conseguir vaga de Operador de Caixa?",
        "answer": "Não necessariamente. Muitas redes contratam para o primeiro emprego e treinam o sistema PDV internamente. O que conta é mostrar que você é organizado com dinheiro, ágil e tem bom atendimento. Se nunca trabalhou em caixa, valorize experiências equivalentes: atendimento ao público, ajuda no comércio da família, controle de caixa em eventos, ou cursos de frente de caixa. Deixe claro no resumo que você é cuidadoso com valores e gosta de lidar com pessoas."
      },
      {
        "question": "O que é mais importante destacar: agilidade ou conferência do caixa?",
        "answer": "Os dois, porque o gerente busca o equilíbrio. Agilidade reduz fila e melhora a experiência do cliente em horário de pico; a conferência correta evita quebra de caixa (sobra ou falta), que é prejuízo direto para a loja e gera desconfiança. No currículo, mostre os dois lados: o volume de clientes que você atendia por dia (agilidade) e o fato de seu caixa fechar batido (confiabilidade). Quem demonstra rapidez sem errar no troco é o perfil mais valorizado."
      },
      {
        "question": "Como mostro que sou confiável com dinheiro se nunca foi medido com números?",
        "answer": "Descreva a rotina de controle que você seguia. Em vez de 'mexia com dinheiro', escreva 'fazia a abertura do caixa conferindo o fundo de troco e o fechamento batendo o valor físico com o relatório do PDV, sem quebras relevantes'. Cite a conferência de sangria e suprimento, a checagem de cédulas falsas e o cuidado na devolução de troco. Mostrar o processo já transmite confiabilidade, mesmo sem um percentual exato."
      },
      {
        "question": "Quais sistemas e ferramentas vale a pena mencionar no currículo?",
        "answer": "Cite que você opera sistema PDV (frente de caixa) e, se souber o nome do sistema usado, mencione-o (por exemplo, sistemas comuns no varejo, leitor de código de barras, balança integrada e máquina/TEF de cartão). Inclua também o domínio de Pix e vale-alimentação/refeição, pois hoje são essenciais. Os filtros de triagem (ATS) e o gerente procuram 'PDV', 'frente de caixa' e 'formas de pagamento' — usar esses termos exatos aumenta a chance de o currículo passar."
      },
      {
        "question": "Qual a diferença entre Operador de Caixa e Líder de Caixa no currículo?",
        "answer": "O Operador de Caixa executa o atendimento, registra vendas e fecha o próprio caixa. O Líder (ou supervisor) de frente de caixa coordena a equipe, faz escala, autoriza sangrias, resolve divergências de fechamento e treina novatos. Se você já assumia responsabilidades de liderança — conferir o caixa dos colegas, cobrir folgas, orientar novatos — deixe isso claro nos bullets, pois ajuda a pleitear uma faixa salarial maior e a próxima posição."
      },
      {
        "question": "Como deixar o currículo de Operador de Caixa pronto para o ATS?",
        "answer": "Use as palavras exatas que aparecem no anúncio da vaga, como 'frente de caixa', 'sistema PDV', 'atendimento ao cliente' e 'fechamento de caixa', de forma natural no resumo e nos bullets. Evite imagens, tabelas e ícones que o sistema não lê, mantenha o formato em coluna única, fonte simples e salve em PDF padrão. Como muitas redes de varejo usam triagem automatizada, repetir os termos da vaga vinculados ao que você realmente fez é o que faz o currículo chegar a um recrutador humano."
      }
    ]
  },
  {
    "slug": "atendente",
    "profession": "Atendente",
    "metaTitle": "Modelo de Currículo para Atendente (2026) | Exemplo Pronto e Dicas",
    "h1": "Modelo de Currículo para Atendente",
    "metaDescription": "Modelo de currículo para Atendente com exemplo real, resumo, experiências com resultados de atendimento, vendas e CRM, habilidades, palavras-chave de ATS e faixa salarial em R$.",
    "intro": "A vaga de Atendente costuma receber centenas de currículos quase idênticos: \"atendia clientes e tirava dúvidas\". O que separa quem é chamado para a entrevista é mostrar com números o volume de atendimentos que você sustentava, sua taxa de resolução no primeiro contato, os indicadores que bateu (CSAT, NPS, TMA) e os sistemas que dominava (CRM, PDV, chat). Atendente é uma função em que comunicação clara, resolução de problemas e, muitas vezes, conversão em vendas andam juntas. Este modelo traz um exemplo completo e realista, com bullets de resultado, as habilidades que pesam na seleção e as palavras-chave que os filtros de triagem (ATS) e o RH realmente procuram para essa função, seja em loja, call center, recepção ou suporte por chat.",
    "sampleResume": {
      "name": "Beatriz Almeida Rocha",
      "headline": "Atendente | Atendimento ao Cliente, Suporte e Vendas | CRM e PDV",
      "summary": "Atendente com 4 anos de experiência em atendimento ao cliente multicanal (presencial, telefone, chat e WhatsApp), com forte atuação em resolução de problemas e conversão em vendas. Histórico de manter CSAT acima de 90% e alta taxa de resolução no primeiro contato. Domínio de CRM (Zendesk e Salesforce), sistema de PDV e rotinas de pós-venda. Reconhecida pela comunicação clara, empatia com o cliente e agilidade no fechamento de chamados sem perder qualidade.",
      "experience": [
        {
          "role": "Atendente de Suporte e Vendas",
          "company": "Conecta Telecom & Internet",
          "period": "Mar 2022 - Atual",
          "bullets": [
            "Atendo em média 70 contatos por dia entre telefone, chat e WhatsApp, mantendo CSAT (satisfação do cliente) de 92% e tempo médio de atendimento (TMA) de 4min30.",
            "Mantenho taxa de resolução no primeiro contato (FCR) de 88%, reduzindo reaberturas de chamado e encaminhamentos para o segundo nível.",
            "Convertí atendimentos de suporte em vendas de upgrade de plano, batendo a meta mensal de retenção e upsell em 11 dos últimos 12 meses (média de 116% de atingimento).",
            "Registro e categorizo todos os chamados no CRM Zendesk, alimentando a base de conhecimento e reduzindo o retrabalho da equipe.",
            "Reduzi reclamações reincidentes do meu turno em 23% ao padronizar o passo a passo de troubleshooting e o retorno proativo ao cliente."
          ]
        },
        {
          "role": "Atendente de Loja (Vendas e Caixa)",
          "company": "Magazine Estilo Casa",
          "period": "Fev 2020 - Fev 2022",
          "bullets": [
            "Atendia em média 80 clientes por dia no salão de vendas, com abordagem consultiva e indicação de produtos complementares (cross-sell).",
            "Operava o PDV (frente de caixa), realizando vendas, trocas, devoluções e fechamento de caixa diário sem divergências.",
            "Bati a meta individual de vendas em 100% dos meses do segundo ano, com ticket médio 18% acima da média da loja.",
            "Cadastrava clientes no programa de fidelidade, aumentando a base ativa do meu turno em cerca de 30 clientes por mês.",
            "Resolvia reclamações e trocas no balcão com foco em reverter a insatisfação, mantendo avaliações positivas no Google e Reclame Aqui."
          ]
        }
      ],
      "education": [
        {
          "degree": "Tecnólogo em Gestão Comercial (cursando)",
          "institution": "Universidade Anhanguera (EAD)",
          "period": "2024 - 2026"
        },
        {
          "degree": "Ensino Médio Completo",
          "institution": "E.E. Profª Helena Borges",
          "period": "2016 - 2018"
        },
        {
          "degree": "Curso de Atendimento ao Cliente e Técnicas de Vendas (40h)",
          "institution": "Senac",
          "period": "2021"
        }
      ],
      "skills": [
        "Atendimento ao cliente multicanal (presencial, telefone, chat, WhatsApp)",
        "Resolução de problemas e contorno de objeções",
        "Vendas, cross-sell e up-sell",
        "Operação de CRM (Zendesk, Salesforce)",
        "Operação de PDV e frente de caixa",
        "Comunicação clara, escrita e verbal",
        "Indicadores: CSAT, NPS, TMA, FCR",
        "Pós-venda e fidelização de clientes",
        "Gestão de reclamações e trocas",
        "Empatia, paciência e escuta ativa"
      ]
    },
    "keySkills": [
      "Atendimento ao cliente multicanal (presencial, telefone, chat e WhatsApp)",
      "Comunicação clara e objetiva, na fala e na escrita",
      "Resolução de problemas e tomada de decisão no primeiro contato",
      "Contorno de objeções e gestão de reclamações",
      "Vendas, cross-sell, up-sell e conversão de atendimento em venda",
      "Operação de CRM (Zendesk, Salesforce, HubSpot, Movidesk)",
      "Operação de PDV / frente de caixa e sistemas de pedido",
      "Conhecimento de indicadores de atendimento: CSAT, NPS, TMA, FCR, SLA",
      "Empatia, escuta ativa e inteligência emocional sob pressão",
      "Pós-venda, follow-up e fidelização de clientes",
      "Organização de chamados, registro e categorização",
      "Trabalho em equipe e cumprimento de metas e escalas"
    ],
    "atsKeywords": [
      "Atendente",
      "Atendimento ao cliente",
      "Suporte ao cliente",
      "Call center",
      "SAC",
      "CRM",
      "Zendesk",
      "Salesforce",
      "PDV",
      "vendas",
      "cross-sell",
      "up-sell",
      "resolução de problemas",
      "CSAT",
      "NPS",
      "TMA",
      "FCR",
      "pós-venda",
      "WhatsApp",
      "chat",
      "frente de caixa",
      "fidelização"
    ],
    "salaryNote": "No Brasil (2026), a faixa salarial de Atendente varia conforme o canal, o setor e a região. Júnior/início de carreira (atendente de loja, recepção ou call center receptivo): cerca de R$ 1.500 a R$ 2.000 por mês. Pleno (2 a 4 anos, com CRM e metas de venda ou suporte técnico): cerca de R$ 2.000 a R$ 2.900. Sênior ou atendente com escopo ampliado (suporte especializado, atendimento bilíngue, supervisão de fila ou alta conversão em vendas): cerca de R$ 2.900 a R$ 4.000. Em funções com forte componente comercial, a comissão e o bônus por meta podem somar valor relevante ao fixo. A maioria das vagas inclui vale-transporte, vale-refeição/alimentação e, em call centers, adicional para horário noturno e prêmios por produtividade.",
    "dos": [
      "Quantifique o volume e a qualidade do seu atendimento: 'atendia 70 contatos/dia com CSAT de 92%' diz muito mais que 'atendia clientes'.",
      "Cite os canais que você domina (presencial, telefone, chat, WhatsApp, e-mail) e os sistemas pelo nome (Zendesk, Salesforce, PDV, HubSpot, Movidesk).",
      "Mostre resultados de resolução: taxa de resolução no primeiro contato (FCR), redução de reclamações reincidentes, queda no tempo médio de atendimento (TMA).",
      "Se a vaga tem componente de venda, destaque metas batidas, conversão, cross-sell, up-sell e ticket médio com números.",
      "Use as mesmas palavras do anúncio (ex.: se pedem 'SAC', escreva 'SAC'; se pedem 'suporte N1', escreva 'suporte N1') para passar no ATS.",
      "Mantenha o currículo em 1 página, com português impecável — em atendimento, a escrita correta é parte do trabalho."
    ],
    "donts": [
      "Não escreva apenas 'responsável pelo atendimento ao cliente' sem dizer o canal, o volume e o resultado.",
      "Não liste como habilidade frases vazias como 'sou comunicativo' ou 'gosto de gente' sem nenhum exemplo ou número que comprove.",
      "Não omita os sistemas que você usou (CRM, PDV, sistema de chamados) — para muitas vagas eles são palavra-chave decisiva.",
      "Não invente indicadores (CSAT, NPS, conversão) que você não consiga explicar na entrevista — o gestor vai perguntar como você os media.",
      "Não envie o mesmo currículo genérico para uma vaga de call center receptivo e uma de vendas em loja; destaque a experiência que conversa com cada uma.",
      "Não cometa erros de português nem use linguagem informal demais; em atendimento, isso elimina o candidato logo na triagem."
    ],
    "faqs": [
      {
        "question": "Preciso de experiência para conseguir uma vaga de Atendente?",
        "answer": "Não necessariamente. Muitas vagas de Atendente são porta de entrada e exigem apenas Ensino Médio completo e boa comunicação. Se você não tem experiência formal, valorize Jovem Aprendiz, estágio, trabalho voluntário, atendimento no negócio da família ou qualquer função em que você lidou com público (recepção, balcão, telemarketing). Inclua um curso de atendimento ao cliente ou técnicas de vendas e um resumo que mostre clareza na comunicação, paciência e vontade de aprender os sistemas da empresa."
      },
      {
        "question": "Quais indicadores de atendimento vale a pena colocar no currículo?",
        "answer": "Os que mais pesam são CSAT (satisfação do cliente), NPS, TMA (tempo médio de atendimento), FCR (resolução no primeiro contato) e SLA (cumprimento de prazo). Se a vaga tem venda, inclua taxa de conversão, atingimento de meta e ticket médio. Sempre traga o número junto com o contexto: 'CSAT de 92% atendendo 70 contatos/dia'. Se você não acompanhava esses indicadores formalmente, descreva o resultado em palavras concretas: 'reduzi reclamações reincidentes do meu turno' ou 'mantinha avaliações positivas dos clientes'."
      },
      {
        "question": "Como adaptar o currículo para atendimento em loja, call center ou suporte por chat?",
        "answer": "São perfis diferentes e o recrutador busca o adequado à vaga. Para loja, destaque vendas, operação de PDV/caixa, abordagem no salão e cross-sell. Para call center, destaque volume de chamadas, TMA, script, atendimento receptivo ou ativo e uso de discador/CRM. Para suporte por chat e WhatsApp, destaque escrita clara, atendimento simultâneo de várias conversas, registro de chamados e resolução técnica (N1). Ajuste o título e o resumo do currículo para o canal da vaga em vez de mandar um genérico para todas."
      },
      {
        "question": "Atendente precisa saber usar CRM ou outros sistemas?",
        "answer": "Na maioria das vagas de suporte e SAC, sim. O CRM e o sistema de chamados (Zendesk, Salesforce, HubSpot, Movidesk, Freshdesk) são onde o atendimento acontece e onde o histórico do cliente fica registrado. Cite as ferramentas que você já usou pelo nome. Em loja, o sistema mais comum é o PDV (frente de caixa) e o sistema de pedidos. Se você nunca usou nenhum CRM, vale dizer que tem facilidade com sistemas e mencionar qualquer software que tenha operado, pois os filtros de triagem (ATS) procuram esses nomes exatos."
      },
      {
        "question": "Como mostro que sei resolver problemas e lidar com cliente difícil?",
        "answer": "Em vez de escrever 'tenho bom relacionamento com o cliente', mostre a ação e o resultado. Por exemplo: 'revertia reclamações no balcão com foco em recuperar a satisfação, mantendo avaliações positivas' ou 'mantinha 88% de resolução no primeiro contato, reduzindo reaberturas de chamado'. Descreva situações de contorno de objeção, troca, devolução ou cliente insatisfeito que você resolveu sem escalar. Resolução de problemas com exemplo concreto vale muito mais do que adjetivos como 'paciente' e 'empático' soltos na lista de habilidades."
      },
      {
        "question": "Vale a pena destacar que converto atendimento em venda?",
        "answer": "Sim, e muito — especialmente em telecom, varejo, planos e serviços, onde o atendente também tem meta comercial. Mostre com números: 'convertia atendimentos de suporte em upgrade de plano, batendo a meta de upsell em média 116%' ou 'ticket médio 18% acima da média da loja'. Isso posiciona você acima de quem só executa o atendimento, ajuda a pleitear uma faixa salarial melhor e abre portas para cargos de vendas e retenção. Se a vaga é puramente de suporte sem venda, foque mais em resolução e satisfação."
      }
    ]
  },
  {
    "slug": "cozinheiro",
    "profession": "Cozinheiro",
    "metaTitle": "Modelo de Currículo para Cozinheiro (Exemplo Pronto 2026)",
    "h1": "Modelo de Currículo para Cozinheiro",
    "metaDescription": "Modelo de currículo para cozinheiro com exemplo real: tipos de cozinha, técnicas culinárias, higiene (boas práticas/RDC 216), montagem de cardápio, mise en place, palavras-chave de ATS e faixa salarial em R$.",
    "intro": "O chef de cozinha ou o gerente do restaurante que recebe seu currículo quer responder a três perguntas em segundos: em que tipo de cozinha você já trabalhou (à la carte, alta rotatividade, banquete, industrial), quais praças (grill, garde manger, confeitaria, fogão) você domina e se você conhece boas práticas de manipulação de alimentos. Currículo de cozinheiro não se vende com adjetivos como \"caprichoso\" — vende com volume de pratos por serviço, técnicas que executa, controle de CMV (custo de mercadoria vendida) e adesão às normas da Anvisa (RDC 216). Este modelo mostra exatamente como estruturar técnicas culinárias, higiene, cardápios e organização de cozinha para passar na triagem e convencer quem comanda a brigada.",
    "sampleResume": {
      "name": "Rodrigo Almeida Nunes",
      "headline": "Cozinheiro | Praça de Grill e Garde Manger | Cozinha Contemporânea e À la Carte",
      "summary": "Cozinheiro com 7 anos de experiência em restaurantes à la carte de média e alta rotatividade, com domínio de praças de grill, sauté e garde manger. Sólido conhecimento de técnicas clássicas francesas (cortes, fundos, molhos-mãe, sous-vide) e de boas práticas de manipulação de alimentos (RDC 216 e RDC 49). Histórico de redução de desperdício e padronização de fichas técnicas, mantendo tempo médio de saída de prato abaixo de 12 minutos em serviços com mais de 120 cobertos.",
      "experience": [
        {
          "role": "Cozinheiro de Praça (Chef de Partie)",
          "company": "Restaurante Terroir Cozinha Contemporânea",
          "period": "Mar 2021 - Atual",
          "bullets": [
            "Comando as praças de grill e sauté em serviços de almoço e jantar com média de 130 cobertos, mantendo tempo de saída de prato em torno de 11 minutos no horário de pico.",
            "Padronizei 28 fichas técnicas (gramagem, rendimento e custo por porção), reduzindo a variação de porcionamento e o CMV do cardápio principal de 34% para 29%.",
            "Implantei sistema de etiquetagem e PVPS (primeiro que vence, primeiro que sai) no estoque e nas câmaras, cortando o descarte por validade em cerca de 22%.",
            "Executo técnicas de cocção controlada (sous-vide, selagem, confit e redução de fundos) e finalização de molhos à base de demi-glace e beurre blanc.",
            "Treinei 3 auxiliares de cozinha em mise en place, cortes (brunoise, julienne, paysanne) e procedimentos de higienização, reduzindo retrabalho no pré-preparo."
          ]
        },
        {
          "role": "Auxiliar de Cozinha / Cozinheiro Júnior",
          "company": "Bistrô Pão & Sal",
          "period": "Jan 2018 - Fev 2021",
          "bullets": [
            "Atuei no pré-preparo (mise en place) de uma cozinha com cardápio de 40 itens, executando cortes, porcionamento e armazenamento conforme boas práticas.",
            "Responsável pela praça fria (garde manger): saladas, entradas, molhos frios e montagem de pratos com padrão visual de apresentação.",
            "Controlei temperatura de câmaras frias e balcões térmicos com registro em planilha, garantindo conformidade na visita da vigilância sanitária (nota máxima na inspeção de 2020).",
            "Apoiei a confeitaria na produção de sobremesas de cardápio (panna cotta, petit gâteau e tortas), seguindo receitas padronizadas."
          ]
        }
      ],
      "education": [
        {
          "degree": "Curso Técnico em Cozinha / Gastronomia",
          "institution": "Senac - Centro Universitário Senac",
          "period": "2017 - 2018"
        },
        {
          "degree": "Curso de Boas Práticas de Manipulação de Alimentos (Manipulador de Alimentos - RDC 216)",
          "institution": "Senac",
          "period": "Atualizado em 2024"
        },
        {
          "degree": "Ensino Médio Completo",
          "institution": "E.E. Professor Mário Schenberg",
          "period": "Concluído em 2015"
        }
      ],
      "skills": [
        "Técnicas de cocção (grelhar, saltear, braseado, sous-vide, confit)",
        "Cortes clássicos (brunoise, julienne, paysanne, chiffonade)",
        "Fundos, molhos-mãe e finalização (demi-glace, beurre blanc)",
        "Mise en place e organização de praça",
        "Boas práticas de manipulação (RDC 216) e POPs",
        "Controle de temperatura e PVPS (estoque/câmaras)",
        "Ficha técnica, porcionamento e controle de CMV",
        "Cozinha à la carte e de alta rotatividade",
        "Montagem e apresentação de pratos",
        "Liderança de praça e treinamento de auxiliares"
      ]
    },
    "keySkills": [
      "Técnicas de cocção: grelhar, saltear, fritar, assar, braseado, sous-vide e confit",
      "Cortes e habilidades com faca (brunoise, julienne, paysanne, chiffonade)",
      "Preparo de fundos, caldos e molhos-mãe (béchamel, velouté, demi-glace, holandês)",
      "Mise en place e organização da praça antes do serviço",
      "Boas práticas de manipulação de alimentos (RDC 216 da Anvisa) e POPs",
      "Controle de temperatura, cadeia do frio e PVPS (primeiro que vence, primeiro que sai)",
      "Higienização de utensílios, bancadas e equipamentos; controle de pragas",
      "Leitura e execução de fichas técnicas, gramagem e porcionamento",
      "Controle de estoque, CMV e redução de desperdício",
      "Montagem, finalização e apresentação de pratos",
      "Trabalho em alta rotatividade e gestão do tempo de saída do prato",
      "Liderança de praça e organização da brigada de cozinha"
    ],
    "atsKeywords": [
      "Cozinheiro",
      "Auxiliar de cozinha",
      "Chef de partie",
      "Cozinheiro de praça",
      "Técnicas culinárias",
      "Mise en place",
      "Ficha técnica",
      "Boas práticas de manipulação",
      "RDC 216",
      "Manipulação de alimentos",
      "Cortes de alimentos",
      "Cocção",
      "Sous-vide",
      "Garde manger",
      "Grill",
      "Controle de temperatura",
      "Cardápio",
      "CMV",
      "Higienização",
      "Cozinha à la carte"
    ],
    "salaryNote": "No Brasil (2026), as faixas variam conforme tipo de estabelecimento (bar, restaurante à la carte, hotel, cozinha industrial), porte e região. Auxiliar de cozinha / cozinheiro júnior: cerca de R$ 1.500 a R$ 2.200. Cozinheiro pleno / cozinheiro de praça (chef de partie), com domínio de técnicas e fichas técnicas: cerca de R$ 2.300 a R$ 3.800. Cozinheiro sênior, sous chef ou chef de cozinha (com gestão de brigada, cardápio e CMV): de R$ 4.000 a R$ 8.000 ou mais em restaurantes renomados, hotéis e redes. Muitas vagas incluem refeição no local, vale-transporte e gorjeta (10%), que pode aumentar bastante o ganho mensal. Cozinha industrial e coletiva (refeições em escala) tende a pagar fixo competitivo e horários mais regulares.",
    "dos": [
      "Especifique o tipo de cozinha e a praça em que atua (à la carte, banquete, industrial; grill, garde manger, confeitaria, fogão) em vez de só escrever 'cozinheiro'.",
      "Liste as técnicas que domina pelo nome (sous-vide, braseado, redução de fundos, cortes brunoise/julienne) — é o que o chef procura para saber seu nível.",
      "Quantifique o volume e o ritmo: número de cobertos por serviço, tamanho do cardápio, tempo médio de saída do prato e cozinha que você sustentava no pico.",
      "Destaque higiene e segurança alimentar: boas práticas (RDC 216), POPs, controle de temperatura e aprovação em inspeção da vigilância sanitária.",
      "Mostre resultado de gestão de cozinha: redução de desperdício, queda de CMV, padronização de fichas técnicas e porcionamento.",
      "Inclua o curso de Manipulador de Alimentos atualizado e formação em gastronomia/técnica de cozinha, com a data da última reciclagem."
    ],
    "donts": [
      "Não escreva apenas 'preparava os alimentos' ou 'ajudava na cozinha' sem dizer a praça, as técnicas e o volume de serviço.",
      "Não omita o curso de Boas Práticas de Manipulação de Alimentos (RDC 216) — muitas vagas e a vigilância sanitária exigem isso de quem manipula alimento.",
      "Não use adjetivos vazios como 'caprichoso', 'amo cozinhar' ou 'tempero especial' sem nenhuma evidência técnica por trás.",
      "Não exagere a senioridade colocando-se como 'chef' se você atuava como auxiliar ou cozinheiro de praça — a brigada tem hierarquia clara e isso é checado no teste prático.",
      "Não ignore a parte de higiene e organização; em cozinha, sujeira e desorganização reprovam um candidato mais rápido que falta de criatividade.",
      "Não envie um currículo com fotos de pratos coladas no corpo do documento; se quiser mostrar portfólio, cite um link de Instagram profissional separado."
    ],
    "faqs": [
      {
        "question": "Preciso ter faculdade de gastronomia para ser cozinheiro?",
        "answer": "Não. Muitos cozinheiros entram na cozinha como auxiliares e crescem na prática, dentro da brigada. O que pesa mais é a experiência real nas praças, o domínio das técnicas e o curso de Boas Práticas de Manipulação de Alimentos (exigido por lei para quem manipula alimento). Cursos técnicos de cozinha (Senac, escolas de gastronomia) e o tecnólogo em Gastronomia ajudam a acelerar a carreira e a chegar a cargos de sous chef e chef, mas raramente são requisito obrigatório para vagas de cozinheiro."
      },
      {
        "question": "Como mostro minhas técnicas culinárias no currículo sem ficar genérico?",
        "answer": "Nomeie as técnicas e diga onde aplicava. Em vez de 'sabia cozinhar de tudo', escreva 'praça de grill e sauté, com domínio de selagem, redução de fundos, sous-vide e finalização de molhos à base de demi-glace'. Indique também os cortes que executa (brunoise, julienne, chiffonade) e o tipo de cozinha (francesa clássica, contemporânea, regional). Isso permite que o chef enquadre seu nível na hora e saiba para qual praça te chamar no teste prático."
      },
      {
        "question": "Por que devo destacar higiene e a RDC 216 no currículo?",
        "answer": "Porque segurança alimentar é inegociável e é o que mais derruba estabelecimentos na fiscalização. A RDC 216 da Anvisa define as boas práticas de manipulação de alimentos, e a maioria das cozinhas exige que o manipulador tenha o curso atualizado. Citar boas práticas, POPs, controle de temperatura, cadeia do frio, PVPS e aprovação em inspeção da vigilância sanitária mostra ao empregador que você não vai gerar autuação nem risco de contaminação — um diferencial enorme na triagem."
      },
      {
        "question": "Como descrevo experiência com cardápio e fichas técnicas?",
        "answer": "Mostre que você entende a cozinha como operação, não só como preparo. Cite quantos itens tinha o cardápio, se você ajudou a criar ou padronizar pratos e se trabalhava com ficha técnica (gramagem, rendimento e custo por porção). Frases como 'padronizei 28 fichas técnicas, reduzindo o CMV de 34% para 29%' ou 'participei da reformulação do cardápio sazonal' valem muito, porque ligam sua cozinha ao resultado financeiro do restaurante — exatamente o que gerentes e chefs querem ver."
      },
      {
        "question": "Tenho pouca ou nenhuma experiência. Como monto um currículo de cozinheiro?",
        "answer": "Foque no curso de Manipulador de Alimentos, em formação técnica de cozinha e em qualquer experiência prática equivalente: estágio em restaurante, ajuda em buffet, cozinha de eventos, lanchonete, padaria ou até trabalho em cozinha familiar/negócio próprio. Descreva as técnicas básicas que domina (mise en place, cortes, cocções simples, higienização) e demonstre disponibilidade para escala de fim de semana e turnos. Mostrar organização, capricho com higiene e vontade de aprender a brigada conta muito para a primeira vaga."
      },
      {
        "question": "Qual a diferença entre cozinha à la carte e cozinha industrial no currículo?",
        "answer": "São operações diferentes e o recrutador procura o perfil certo. Na cozinha à la carte (restaurantes), destaque agilidade no pico, montagem e apresentação de pratos, domínio de praças e tempo de saída. Na cozinha industrial/coletiva (refeições em escala para empresas, hospitais, escolas), destaque produção em grande volume, padronização, controle rigoroso de temperatura, PCMSO/PPRA, fichas técnicas e segurança alimentar. Deixe claro no resumo em qual mundo você atuou, porque ritmo e prioridades mudam bastante entre os dois."
      }
    ]
  },
  {
    "slug": "estoquista",
    "profession": "Estoquista",
    "metaTitle": "Modelo de Currículo para Estoquista 2026 | Exemplo Pronto e Dicas",
    "h1": "Modelo de Currículo para Estoquista",
    "metaDescription": "Modelo de currículo de Estoquista pronto para adaptar: controle de estoque, inventário, conferência, WMS e organização. Exemplo real com bullets de resultado, palavras-chave de ATS e faixa salarial em R$.",
    "intro": "O currículo de estoquista é avaliado em segundos por encarregados de logística e analistas de RH, que procuram primeiro por experiência com controle de estoque, conferência de mercadorias, inventário e domínio de sistemas (WMS, ERP, coletor de dados). Diferente do que muita gente pensa, não basta escrever \"organizado e responsável\": o que destaca um estoquista é a precisão do inventário, a redução de divergências e a agilidade na separação e endereçamento. Este modelo mostra exatamente como transformar a rotina do estoque em resultados mensuráveis e como passar pela triagem do ATS, com um exemplo real que você pode adaptar para vagas em CD, varejo, indústria ou e-commerce.",
    "sampleResume": {
      "name": "Rafael Souza Lima",
      "headline": "Estoquista | Controle de Estoque, Inventário e WMS | Coletor de Dados",
      "summary": "Estoquista com 5 anos de experiência em centro de distribuição e estoque de varejo, atuando em recebimento, conferência, endereçamento, separação (picking) e inventário cíclico. Domínio de sistema WMS e ERP (SAP e TOTVS), coletor de dados (RF) e movimentação com paleteira e empilhadeira (com NR-11). Foco em acuracidade de inventário, redução de divergências e organização do estoque por curva ABC.",
      "experience": [
        {
          "role": "Estoquista / Operador de Estoque",
          "company": "Distribuidora Central Log (Centro de Distribuição)",
          "period": "Mar 2022 - Atual",
          "bullets": [
            "Realizo recebimento e conferência cega de até 40 notas fiscais por dia, conferindo quantidade, lote, validade e avarias contra o pedido de compra no WMS, mantendo divergência de entrada abaixo de 0,5%.",
            "Implantei rotina de inventário cíclico por curva ABC que elevou a acuracidade do estoque de 92% para 99,1% em 8 meses, reduzindo rupturas e baixas por perda.",
            "Faço endereçamento e armazenagem de mercadorias com coletor de dados (RF), respeitando FIFO/PEPS por validade, o que reduziu perdas por vencimento em cerca de 35%.",
            "Separo (picking) e embalo pedidos com média de 600 itens por dia e índice de erro de separação inferior a 1%, garantindo expedição no SLA acordado.",
            "Opero paleteira elétrica e empilhadeira (NR-11 válida) na movimentação de pallets, organizando porta-pallets e mantendo o layout do estoque sinalizado e dentro das normas de segurança."
          ]
        },
        {
          "role": "Auxiliar de Estoque",
          "company": "Rede Lar & Cia (varejo de materiais de construção)",
          "period": "Jan 2020 - Fev 2022",
          "bullets": [
            "Conferia o recebimento de mercadorias e dava entrada no ERP (TOTVS), atualizando saldos e organizando o estoque por categoria e giro.",
            "Apoiei o inventário rotativo mensal e o inventário geral anual, reduzindo o tempo de contagem em 20% após reorganizar o endereçamento das prateleiras.",
            "Atendia requisições da loja e abastecia o ponto de venda (reposição), evitando rupturas em itens de alto giro nos finais de semana.",
            "Mantinha o estoque limpo, organizado e identificado com etiquetas e placas de endereço, seguindo o 5S e os procedimentos internos (POP)."
          ]
        }
      ],
      "education": [
        {
          "degree": "Ensino Médio Completo",
          "institution": "EE Professor João Ramalho",
          "period": "2015 - 2017"
        },
        {
          "degree": "Curso de Operador de Empilhadeira (NR-11)",
          "institution": "SENAI",
          "period": "2021"
        },
        {
          "degree": "Curso de Gestão e Controle de Estoque",
          "institution": "SENAC",
          "period": "2022"
        }
      ],
      "skills": [
        "Controle e gestão de estoque",
        "Recebimento e conferência de mercadorias",
        "Inventário cíclico, rotativo e geral",
        "Sistema WMS e ERP (SAP, TOTVS)",
        "Coletor de dados / leitor de código de barras (RF)",
        "Endereçamento e armazenagem (FIFO/PEPS)",
        "Separação de pedidos (picking) e expedição",
        "Operação de paleteira e empilhadeira (NR-11)",
        "Curva ABC e acuracidade de estoque",
        "Organização 5S e normas de segurança"
      ]
    },
    "keySkills": [
      "Controle e gestão de estoque (entradas, saídas e saldos)",
      "Recebimento e conferência de mercadorias (quantidade, lote, validade, avarias)",
      "Inventário cíclico, rotativo e geral, com foco em acuracidade",
      "Domínio de sistema WMS e ERP (SAP, TOTVS, Bling, Senior)",
      "Uso de coletor de dados / leitor de código de barras (RF)",
      "Endereçamento, armazenagem e controle FIFO/PEPS (validade)",
      "Separação de pedidos (picking), embalagem e expedição",
      "Operação de paleteira e empilhadeira com NR-11",
      "Organização do estoque por curva ABC e método 5S",
      "Conhecimento de notas fiscais, romaneios e procedimentos (POP)",
      "Noções de segurança do trabalho e uso de EPI",
      "Pacote Office / Excel básico para planilhas de controle"
    ],
    "atsKeywords": [
      "Estoquista",
      "Auxiliar de Estoque",
      "Operador de Estoque",
      "Controle de estoque",
      "Conferência de mercadorias",
      "Recebimento",
      "Inventário",
      "Inventário cíclico",
      "Acuracidade de estoque",
      "WMS",
      "ERP",
      "SAP",
      "TOTVS",
      "Coletor de dados",
      "Código de barras",
      "Endereçamento",
      "Separação de pedidos",
      "Picking",
      "Expedição",
      "Curva ABC",
      "FIFO / PEPS",
      "Empilhadeira",
      "Paleteira",
      "NR-11",
      "Logística",
      "Centro de distribuição",
      "Movimentação de materiais",
      "Nota fiscal",
      "5S",
      "Armazenagem"
    ],
    "salaryNote": "No Brasil (2026), o estoquista júnior ou auxiliar de estoque costuma ganhar entre R$ 1.600 e R$ 2.200; o estoquista pleno fica na faixa de R$ 2.200 a R$ 3.200; e o estoquista sênior ou líder de estoque geralmente entre R$ 3.200 e R$ 4.500, podendo ultrapassar esse valor em centros de distribuição de grande porte ou com responsabilidade de equipe. Os valores variam por porte da empresa, setor (e-commerce e indústria farmacêutica/alimentícia tendem a pagar mais que varejo), região (Sudeste paga acima da média) e adicionais como periculosidade, insalubridade, hora extra e certificação de empilhadeira (NR-11), que costumam aumentar a remuneração.",
    "dos": [
      "Coloque logo no topo as ferramentas que você domina: WMS, ERP (cite o sistema, como SAP ou TOTVS), coletor de dados e empilhadeira com NR-11 — é o que o ATS e o encarregado buscam primeiro.",
      "Quantifique resultados: acuracidade de inventário (ex.: 'de 92% para 99%'), redução de divergências, itens separados por dia, perdas evitadas e SLA de expedição cumprido.",
      "Use os verbos certos da função: receber, conferir, endereçar, armazenar, separar, expedir, inventariar e movimentar — em vez de só 'auxiliei' ou 'ajudei'.",
      "Mencione os métodos que você aplica: FIFO/PEPS por validade, curva ABC, inventário cíclico e organização 5S, mostrando que você entende de processo e não só de braço.",
      "Inclua certificações e treinamentos válidos (NR-11 de empilhadeira, NR-35 de altura se houver, cursos de logística do SENAI/SENAC) com data de validade quando aplicável.",
      "Adapte as palavras-chave à vaga: se ela pede experiência com SAP ou com e-commerce, destaque exatamente isso no resumo e nos bullets."
    ],
    "donts": [
      "Não resuma sua experiência a 'organizar o estoque' — descreva o que você controlava, com qual volume e em qual sistema.",
      "Não deixe de citar os sistemas: um currículo de estoquista sem WMS, ERP ou coletor de dados perde para quem especificou as ferramentas.",
      "Não exagere na empilhadeira: só coloque que opera se tiver a NR-11 válida, porque a empresa pede o certificado e checa na admissão.",
      "Não encha o currículo de adjetivos vazios ('proativo, dinâmico, esforçado') sem nenhum dado que comprove — prefira números e fatos.",
      "Não use layout com colunas duplas complexas, tabelas ou ícones que o ATS não consegue ler; mantenha uma coluna limpa e objetiva.",
      "Não omita a NR-11 e outros treinamentos de segurança quando a vaga exige movimentação de carga — isso é eliminatório em muitos processos."
    ],
    "faqs": [
      {
        "question": "Preciso ter experiência com WMS ou ERP para ser estoquista?",
        "answer": "Para vagas em centros de distribuição e empresas médias e grandes, sim — o domínio de sistema WMS ou ERP (SAP, TOTVS, Senior, Bling) costuma ser um diferencial decisivo. Se você ainda não usou nenhum, destaque experiência com coletor de dados, leitor de código de barras ou até planilhas de controle no Excel, e considere fazer um curso básico de logística no SENAI/SENAC. Em vagas de auxiliar de estoque no varejo pequeno, a exigência é menor, mas citar qualquer sistema já te coloca à frente."
      },
      {
        "question": "Como mostro experiência se nunca trabalhei formalmente como estoquista?",
        "answer": "Use experiências correlatas: repositor, conferente, ajudante de carga e descarga, auxiliar de almoxarifado ou até organização de estoque em comércio da família. Descreva as tarefas com os verbos da função (receber, conferir, organizar, separar) e qualquer ferramenta que usou. Cursos de controle de estoque e a certificação NR-11 de empilhadeira também ajudam a abrir a primeira vaga."
      },
      {
        "question": "Vale a pena colocar a certificação de empilhadeira (NR-11) no currículo?",
        "answer": "Sim, e bem destacada. A NR-11 é um divisor de águas: muitas vagas de estoquista em CD pedem operação de empilhadeira ou paleteira elétrica, e ter o certificado válido pode aumentar seu salário e suas chances. Coloque o nome do curso, a instituição (SENAI, por exemplo) e o ano, e mantenha a reciclagem em dia, porque a empresa valida na admissão."
      },
      {
        "question": "O que escrever sobre inventário no currículo de estoquista?",
        "answer": "Especifique o tipo de inventário que você fez (cíclico, rotativo ou geral), a frequência e, principalmente, o resultado: acuracidade alcançada, redução de divergências ou de perdas. Um bullet como 'apoiei o inventário cíclico mensal, contribuindo para acuracidade de 99%' vale muito mais do que 'fazia inventário', porque mostra que você entende a métrica que importa no estoque."
      },
      {
        "question": "Qual a diferença entre estoquista, conferente e almoxarife no currículo?",
        "answer": "São funções próximas que se sobrepõem. O estoquista cuida do controle geral (entrada, armazenagem, saída e inventário); o conferente foca na conferência de mercadorias no recebimento e na expedição; o almoxarife controla materiais internos (ferramentas, insumos) de almoxarifado. Se você já atuou em mais de uma, vale citar todas, mas direcione o título e o resumo do currículo para o cargo exato da vaga a que está se candidatando."
      },
      {
        "question": "Quantas páginas deve ter o currículo de estoquista?",
        "answer": "Uma página é o ideal e suficiente para a grande maioria dos casos. Foque nas duas ou três experiências mais recentes e relevantes, nas ferramentas (WMS, ERP, coletor, empilhadeira) e nos resultados. Evite listar empregos antigos sem relação com estoque e logística; clareza e objetividade contam mais do que volume de informação."
      }
    ]
  },
  {
    "slug": "designer-grafico",
    "profession": "Designer Gráfico",
    "metaTitle": "Modelo de Currículo para Designer Gráfico (Exemplo Pronto 2026)",
    "h1": "Modelo de Currículo para Designer Gráfico",
    "metaDescription": "Modelo de currículo para Designer Gráfico com exemplo real, link de portfólio, domínio de Photoshop, Illustrator e Figma, identidade visual, palavras-chave de ATS e faixa salarial em R$.",
    "intro": "No design gráfico, o currículo abre a porta, mas quem fecha a vaga é o portfólio. A primeira coisa que um diretor de arte ou recrutador procura é o link para o seu trabalho — e se ele não estiver clicável no topo, em destaque, boa parte das candidaturas é descartada antes mesmo da leitura. Ainda assim, o currículo cumpre dois papéis decisivos: passar pelo filtro de ATS (que lê texto, não imagens, e busca por Photoshop, Illustrator, Figma e identidade visual) e contextualizar o portfólio com resultados — quais marcas você criou, qual problema visual resolveu e qual impacto isso gerou. Este modelo mostra como estruturar portfólio, domínio de ferramentas, projetos de identidade visual e bullets de resultado para passar nos dois filtros e provar que você entrega criatividade com método.",
    "sampleResume": {
      "name": "Beatriz Almeida Nogueira",
      "headline": "Designer Gráfico Pleno | Identidade Visual, Branding e Social Media | Adobe + Figma",
      "summary": "Designer gráfico com 5 anos de experiência em identidade visual, branding e peças para social media e impressos. Domínio avançado de Photoshop, Illustrator e InDesign, além de Figma para UI e protótipos. Crio sistemas visuais consistentes do conceito à aplicação (logo, paleta, tipografia e brand guidelines) e tenho histórico de aumentar engajamento de marcas em redes sociais. Foco em traduzir briefing de negócio em solução visual com prazo e padronização.",
      "experience": [
        {
          "role": "Designer Gráfico Pleno",
          "company": "Estúdio Matiz Branding",
          "period": "Abr 2022 - Atual",
          "bullets": [
            "Conduzi a criação de identidade visual completa para 14 marcas (logo, paleta, tipografia, grid e manual da marca em InDesign), do briefing à entrega final aprovada pelo cliente.",
            "Desenvolvi o rebranding de um cliente do varejo que, após o redesign de logo e embalagens, registrou aumento de 23% no reconhecimento de marca medido em pesquisa pós-lançamento.",
            "Produzi em média 120 peças por mês para social media (feed, stories e anúncios) em Photoshop e Illustrator, elevando o engajamento médio das contas atendidas em 35%.",
            "Criei templates editáveis no Figma e bibliotecas de componentes que reduziram em 40% o tempo de produção de peças recorrentes da equipe.",
            "Apresentei conceitos e defendi decisões de design para clientes, alinhando expectativas e diminuindo o número médio de rodadas de aprovação de 4 para 2."
          ]
        },
        {
          "role": "Designer Gráfico Júnior",
          "company": "Agência Ponto & Vírgula Comunicação",
          "period": "Fev 2020 - Mar 2022",
          "bullets": [
            "Criei artes para campanhas digitais e impressas (banners, flyers, KV de campanha) para mais de 20 clientes de diferentes segmentos, seguindo o brandbook de cada marca.",
            "Diagramei catálogos e materiais institucionais em InDesign, garantindo padronização tipográfica e fechamento de arquivo correto para gráfica (CMYK, sangria e marcas de corte).",
            "Tratei e fiz montagem de imagens de produto em Photoshop para e-commerce, padronizando mais de 500 fotos e reduzindo a taxa de devolução por divergência visual.",
            "Colaborei com redatores e social media usando Figma e Google Drive, mantendo o fluxo de aprovação organizado e cumprindo prazos de campanhas sazonais."
          ]
        }
      ],
      "education": [
        {
          "degree": "Bacharelado em Design Gráfico",
          "institution": "Universidade Federal de Minas Gerais (UFMG)",
          "period": "2015 - 2019"
        },
        {
          "degree": "Curso de UI Design e Figma (60h)",
          "institution": "Escola de design online (curso livre)",
          "period": "2023"
        },
        {
          "degree": "Adobe Certified Professional - Photoshop",
          "institution": "Adobe",
          "period": "2022"
        }
      ],
      "skills": [
        "Adobe Photoshop (avançado)",
        "Adobe Illustrator (avançado)",
        "Adobe InDesign (diagramação e fechamento de arquivo)",
        "Figma (UI e protótipos)",
        "Identidade visual e branding (manual da marca)",
        "Tipografia, teoria das cores e composição",
        "Design para social media e tráfego pago",
        "Tratamento e montagem de imagem",
        "Preparação de arquivo para impressão (CMYK, sangria, PDF/X)",
        "Gestão de briefing, prazos e rodadas de aprovação"
      ]
    },
    "keySkills": [
      "Adobe Photoshop (tratamento, montagem e composição)",
      "Adobe Illustrator (vetorização e criação de logos)",
      "Adobe InDesign (diagramação e materiais editoriais)",
      "Figma (UI, protótipos e bibliotecas de componentes)",
      "Identidade visual e branding (logo, paleta, manual da marca)",
      "Tipografia, teoria das cores e hierarquia visual",
      "Layout e diagramação (grid e composição)",
      "Design para social media e peças de tráfego pago",
      "Preparação de arquivos para impressão (CMYK, sangria, PDF/X)",
      "Tratamento e edição de imagens",
      "Motion e animação básica (After Effects, Canva)",
      "Gestão de briefing, prazos e fluxo de aprovação com clientes"
    ],
    "atsKeywords": [
      "Designer Gráfico",
      "Design Gráfico",
      "Identidade Visual",
      "Branding",
      "Photoshop",
      "Illustrator",
      "InDesign",
      "Figma",
      "Adobe Creative Cloud",
      "Social Media",
      "Diagramação",
      "Layout",
      "Tipografia",
      "Tratamento de imagem",
      "Criação de logo",
      "Manual da marca",
      "Arte-final",
      "CMYK",
      "Portfólio",
      "UI Design"
    ],
    "salaryNote": "No Brasil (2026), designer gráfico júnior costuma ganhar entre R$ 1.900 e R$ 3.000; pleno fica na faixa de R$ 3.000 a R$ 5.500; e sênior geralmente entre R$ 5.500 e R$ 9.000, podendo passar disso em direção de arte, branding ou posições de UI/UX em produto digital. Valores variam por região (capitais e o eixo Rio-São Paulo tendem ao topo), porte da empresa (agência, estúdio, in-house ou freelancer) e especialização — quem domina UI/UX, motion ou branding estratégico tende a ganhar acima da média do mercado puramente gráfico. Freelancers cobram por projeto: uma identidade visual completa pode variar de R$ 1.500 a R$ 15.000+ conforme escopo e maturidade do cliente.",
    "dos": [
      "Coloque o link clicável do portfólio (Behance, site próprio ou PDF) logo no topo, ao lado do nome — é a primeira coisa que o recrutador de design procura.",
      "Liste suas ferramentas com nível real de domínio: Photoshop, Illustrator, InDesign, Figma e After Effects, separando o que é avançado do que é básico.",
      "Quantifique resultados de design: aumento de engajamento, queda no tempo de produção, número de marcas criadas, redução de rodadas de aprovação.",
      "Descreva projetos de identidade visual pelo escopo completo (logo, paleta, tipografia, manual da marca) e não apenas como 'fiz o logo'.",
      "Adapte o currículo e o portfólio ao foco da vaga: branding, social media, editorial ou UI — destaque os cases que conversam com aquela necessidade.",
      "Garanta que o próprio currículo tenha bom design: tipografia limpa, hierarquia clara e consistência — ele é uma amostra do seu trabalho."
    ],
    "donts": [
      "Não envie o currículo sem link de portfólio, ou com link quebrado, Behance vazio ou Drive sem permissão de acesso — isso elimina a candidatura.",
      "Não exagere o nível das ferramentas ('Illustrator avançado' sem saber vetorizar bem) — diretores de arte percebem na primeira conversa e no teste prático.",
      "Não escreva tarefas genéricas como 'responsável pela criação de artes' sem dizer o tipo de peça, a ferramenta e o resultado.",
      "Não cometa erros de tipografia, alinhamento ou português no próprio currículo: para um designer, isso é um furo grave de credibilidade.",
      "Não exagere em ornamentos, colunas complexas e ícones que quebram a leitura do ATS — equilibre estética com um layout que o filtro consiga ler (envie também versão em PDF com texto selecionável).",
      "Não inclua no portfólio só trabalhos de faculdade ou exercícios soltos sem contexto; mostre o problema, o processo e o resultado de cada case."
    ],
    "faqs": [
      {
        "question": "O portfólio é mais importante que o currículo para designer gráfico?",
        "answer": "Sim, o portfólio é o que decide a contratação — mas o currículo continua sendo necessário. Ele passa pelo filtro de ATS (que lê texto e busca por Photoshop, Illustrator, Figma, identidade visual), organiza sua trajetória e contextualiza os cases. O ideal é tratá-los como dupla: link clicável do portfólio em destaque no topo do currículo e, no portfólio, cases bem editados com problema, processo e resultado. Currículo sem portfólio raramente avança; portfólio sem currículo dificulta a triagem em empresas que usam ATS."
      },
      {
        "question": "Como mostrar projetos de identidade visual no currículo?",
        "answer": "Descreva o escopo real do que você entregou, não só o logo. Em vez de 'criei a logo da marca X', escreva 'desenvolvi a identidade visual completa da marca X: logo, paleta, tipografia, grid e manual da marca em InDesign'. Cite o segmento do cliente, o desafio (rebranding, lançamento, padronização) e, se possível, o resultado (aumento de reconhecimento, consistência entre canais, redução de retrabalho). Os cases visuais detalhados ficam no portfólio; o currículo resume o impacto."
      },
      {
        "question": "Quais ferramentas devo listar e como indicar o nível?",
        "answer": "Liste as que você realmente usa, separando por domínio. O núcleo do design gráfico é Photoshop, Illustrator e InDesign; Figma é cada vez mais exigido (UI, protótipo e trabalho colaborativo); After Effects e Canva aparecem em vagas de social e motion. Seja honesto no nível: 'Illustrator avançado (vetorização e criação de logo)', 'InDesign intermediário (diagramação)', 'Figma básico'. Diretores de arte aplicam teste prático, então inflar o nível custa a vaga já na primeira etapa."
      },
      {
        "question": "Estou começando e não tenho experiência profissional. Como monto o currículo?",
        "answer": "Construa um portfólio com projetos próprios e fictícios bem-feitos: redesenhe a identidade de uma marca real, crie um conjunto de peças para uma campanha inventada, faça um projeto editorial completo. Inclua trabalhos de faculdade com contexto (briefing, processo, resultado), freelas, voluntariado para ONGs e qualquer peça real que você tenha produzido. No currículo, destaque a formação, os cursos de Adobe/Figma e um resumo que mostre repertório visual e vontade de aprender. Para o primeiro emprego, a qualidade e a organização do portfólio pesam mais que o tempo de casa."
      },
      {
        "question": "Devo enviar o currículo em PDF com layout caprichado ou um modelo simples para o ATS?",
        "answer": "O equilíbrio é a melhor saída. Para vagas em agências e estúdios, onde um designer olha primeiro, um currículo com bom design (tipografia, hierarquia, consistência) é uma amostra do seu trabalho e conta a favor. Para empresas grandes que filtram por ATS, evite layouts com texto dentro de imagem, colunas exóticas ou fontes que o sistema não lê — gere o PDF com texto selecionável e use as palavras-chave da vaga. Quando em dúvida, mantenha um modelo limpo e bem tipografado: ele agrada o robô e o humano."
      },
      {
        "question": "Como adapto o currículo para vagas diferentes (branding, social media, editorial, UI)?",
        "answer": "Cada foco valoriza competências distintas, então reordene seus destaques. Para branding, priorize cases de identidade visual, manual da marca e Illustrator. Para social media, destaque volume de peças, engajamento gerado e domínio de formatos de feed/stories e tráfego pago. Para editorial, foque em InDesign, diagramação e fechamento de arquivo para gráfica. Para UI, traga Figma, protótipos e noções de usabilidade. Reordene também o portfólio para que os primeiros cases sejam os mais alinhados à vaga — recrutador raramente vê tudo."
      }
    ]
  },
  {
    "slug": "analista-de-dados",
    "profession": "Analista de Dados",
    "metaTitle": "Modelo de Currículo para Analista de Dados (Exemplo Pronto 2026)",
    "h1": "Modelo de Currículo para Analista de Dados",
    "metaDescription": "Modelo de currículo para Analista de Dados com exemplo real: SQL, Python, Power BI, dashboards e storytelling. Veja habilidades, palavras-chave de ATS e faixa salarial em R$.",
    "intro": "O currículo de Analista de Dados não é avaliado pela quantidade de ferramentas listadas, e sim pela decisão de negócio que a sua análise gerou. Recrutadores técnicos e gestores de BI procuram, em segundos, três coisas: o domínio de SQL (a competência mais cobrada da área), a stack de visualização (Power BI, Looker Studio ou Tableau) e — o que separa o sênior do júnior — a capacidade de transformar números em recomendação acionável. Antes do humano, um ATS filtra por palavras-chave como \"SQL\", \"ETL\", \"dashboard\" e \"Python\". Este modelo mostra exatamente como estruturar suas competências técnicas, descrever projetos com impacto mensurável (em R$, %, horas economizadas) e provar storytelling de dados sem cair no erro mais comum: listar tarefas em vez de resultados.",
    "sampleResume": {
      "name": "Beatriz Almeida Nogueira",
      "headline": "Analista de Dados Pleno | SQL, Python e Power BI | BI e Análise de Negócios",
      "summary": "Analista de Dados com 4 anos de experiência transformando dados em decisão de negócio em times de marketing, financeiro e operações. Domínio avançado de SQL (BigQuery e PostgreSQL), Python para automação e análise (pandas, NumPy) e Power BI para dashboards executivos. Especialista em modelagem de dados, métricas de produto (retenção, churn, LTV) e em traduzir análises complexas para áreas não técnicas. Reduzi tempo de geração de relatórios manuais e dei suporte a decisões que impactaram receita e eficiência operacional.",
      "experience": [
        {
          "role": "Analista de Dados Pleno",
          "company": "Vortex Tecnologia e Pagamentos",
          "period": "Abr 2022 - Atual",
          "bullets": [
            "Construí 12 dashboards executivos em Power BI conectados ao BigQuery via DirectQuery, eliminando cerca de 20 horas/mês de relatórios manuais em Excel para as áreas de marketing e financeiro.",
            "Reescrevi e otimizei consultas SQL críticas (CTEs e window functions) que rodavam diariamente, reduzindo o custo de processamento no BigQuery em 38% e o tempo de atualização de 25 para 6 minutos.",
            "Desenvolvi uma análise de churn em Python (pandas e scikit-learn) que identificou 3 sinais de cancelamento e embasou uma régua de retenção, contribuindo para reduzir o churn mensal de 6,2% para 4,5%.",
            "Modelei a camada semântica do data warehouse (modelo estrela) e padronizei 30+ métricas em um dicionário de dados, eliminando divergências de número entre as áreas em reuniões de resultado.",
            "Apresentei análises quinzenais para a diretoria usando storytelling de dados, transformando resultados de testes A/B em recomendações que aumentaram a conversão do checkout em 9%."
          ]
        },
        {
          "role": "Analista de Dados Júnior / BI",
          "company": "Grupo Mercatto Varejo",
          "period": "Fev 2020 - Mar 2022",
          "bullets": [
            "Criei e mantive relatórios de vendas e estoque em Power BI para 45 lojas, com atualização diária via ETL no Power Query a partir do ERP.",
            "Desenvolvi consultas SQL em SQL Server para extrair e cruzar dados de vendas, ruptura e margem, dando visibilidade que reduziu a ruptura de gôndola em 14%.",
            "Automatizei a coleta semanal de dados de planilhas em Python, substituindo um processo manual de 8 horas por um script que roda em 10 minutos.",
            "Construí o dashboard de indicadores comerciais (faturamento, ticket médio, conversão) usado na reunião semanal da diretoria de varejo."
          ]
        }
      ],
      "education": [
        {
          "degree": "Bacharelado em Estatística",
          "institution": "Universidade Estadual de Campinas (UNICAMP)",
          "period": "2015 - 2019"
        },
        {
          "degree": "Certificação Microsoft Power BI Data Analyst Associate (PL-300)",
          "institution": "Microsoft",
          "period": "2023"
        },
        {
          "degree": "Google Data Analytics Professional Certificate",
          "institution": "Google / Coursera",
          "period": "2021"
        }
      ],
      "skills": [
        "SQL avançado (BigQuery, PostgreSQL, SQL Server)",
        "Python para dados (pandas, NumPy, scikit-learn)",
        "Power BI (DAX, Power Query, modelagem)",
        "Modelagem de dados e ETL/ELT",
        "Estatística e testes de hipótese (A/B testing)",
        "Looker Studio e Tableau",
        "Métricas de produto (churn, retenção, LTV, funil)",
        "Storytelling e visualização de dados",
        "Git e versionamento de queries"
      ]
    },
    "keySkills": [
      "SQL avançado (joins, CTEs, window functions, subqueries)",
      "Python para análise de dados (pandas, NumPy, Matplotlib/Seaborn)",
      "Power BI com DAX e Power Query (ou Tableau/Looker Studio)",
      "Modelagem de dados (modelo estrela, normalização, camada semântica)",
      "ETL/ELT e pipelines de dados",
      "Estatística aplicada (média, mediana, desvio, correlação, regressão)",
      "Testes de hipótese e experimentação (testes A/B)",
      "Métricas de negócio e produto (churn, retenção, LTV, CAC, funil de conversão)",
      "Construção de dashboards e relatórios executivos",
      "Data warehouse e SQL na nuvem (BigQuery, Redshift, Snowflake)",
      "Storytelling de dados e comunicação com áreas não técnicas",
      "Excel/Google Sheets avançado (tabelas dinâmicas, PROCV/ÍNDICE+CORRESP)"
    ],
    "atsKeywords": [
      "Analista de Dados",
      "Analista de BI",
      "SQL",
      "Python",
      "Power BI",
      "Tableau",
      "Looker Studio",
      "BigQuery",
      "ETL",
      "dashboard",
      "data warehouse",
      "modelagem de dados",
      "DAX",
      "Power Query",
      "pandas",
      "estatística",
      "testes A/B",
      "KPIs",
      "data visualization",
      "storytelling de dados"
    ],
    "salaryNote": "No Brasil (2026), o Analista de Dados júnior costuma ganhar entre R$ 3.500 e R$ 6.000; pleno fica na faixa de R$ 6.500 a R$ 11.000; e sênior geralmente entre R$ 11.000 e R$ 18.000+. Valores variam por stack (quem domina engenharia de dados, cloud e Python avançado tende a ganhar mais), região (eixo São Paulo paga acima da média), porte da empresa e regime (CLT vs. PJ). Contratos remotos para empresas estrangeiras pagando em dólar podem superar R$ 25.000. Há também sobreposição com cargos vizinhos: Analista de BI costuma ficar um pouco abaixo, enquanto Cientista de Dados e Engenheiro de Dados costumam pagar acima da faixa de Analista.",
    "dos": [
      "Coloque sua stack no topo (SQL, Python, Power BI, BigQuery) — é o primeiro filtro do ATS e do recrutador técnico para a vaga.",
      "Quantifique o IMPACTO da análise, não a tarefa: 'reduzi o churn de 6,2% para 4,5%' vale muito mais que 'fiz análises de churn'.",
      "Especifique o dialeto de SQL e o nível real (consultas simples, joins, CTEs, window functions) — recrutadores testam isso no teste técnico.",
      "Descreva projetos de ponta a ponta: o problema de negócio, a fonte de dados, a análise/modelagem e a decisão que ela gerou.",
      "Mostre storytelling: cite que você apresentou resultados para diretoria, traduziu dados para áreas não técnicas ou criou um dashboard que virou rotina de decisão.",
      "Adapte as palavras-chave a cada vaga (se pede Tableau e Snowflake, não envie só Power BI e BigQuery) e mencione certificações relevantes (PL-300, Google Data Analytics)."
    ],
    "donts": [
      "Não escreva 'responsável por extrair dados e gerar relatórios' sem dizer qual decisão ou resultado isso gerou.",
      "Não liste 25 ferramentas em uma nuvem de tags sem contexto nem nível — qualidade e profundidade pesam mais que quantidade.",
      "Não declare 'SQL avançado' ou 'Python avançado' se você só roda SELECT simples ou usa pandas para abrir CSV; o teste técnico expõe isso.",
      "Não confunda os papéis: Analista de Dados não é o mesmo que Cientista de Dados (modelagem preditiva pesada) nem Engenheiro de Dados (pipelines e infraestrutura) — posicione-se para a vaga certa.",
      "Não use dashboards e gráficos coloridos dentro do próprio currículo; o ATS não lê imagens e isso quebra a triagem. Mantenha layout limpo em uma coluna.",
      "Não esconda a régua de impacto atrás de jargão técnico: o gestor precisa entender, em uma linha, o que a sua análise mudou no negócio."
    ],
    "faqs": [
      {
        "question": "SQL ou Python: o que é mais importante no currículo de Analista de Dados?",
        "answer": "SQL é a competência mais cobrada e quase sempre eliminatória — é nele que você extrai e cruza os dados antes de qualquer análise. Coloque-o sempre em primeiro lugar, com o nível real (joins, CTEs, window functions). Python é um diferencial forte, sobretudo para automação e análise mais profunda (pandas, limpeza, estatística), mas em muitas vagas de Analista de Dados/BI ele é desejável, não obrigatório. A regra prática: garanta SQL sólido primeiro e use Python para se destacar."
      },
      {
        "question": "Preciso de portfólio mesmo já tendo experiência?",
        "answer": "Para sênior com histórico forte, o portfólio é opcional. Para júnior e em transição de carreira, ele é decisivo: hospede 2 ou 3 projetos no GitHub com o notebook, as queries SQL e um README explicando o problema de negócio, a análise e a conclusão. Um dashboard publicado no Power BI Service ou Looker Studio, com link no currículo, vale mais do que qualquer adjetivo. Evite só refazer datasets famosos sem insight próprio — mostre a pergunta de negócio que você respondeu."
      },
      {
        "question": "Como mostro 'storytelling de dados' no currículo sem soar genérico?",
        "answer": "Storytelling não é uma skill solta na lista; é evidência. Em vez de escrever 'tenho storytelling de dados', mostre: 'apresentei a análise de funil para a diretoria e a recomendação aumentou a conversão em 9%' ou 'traduzi o resultado do teste A/B em uma decisão de produto adotada pela equipe'. Sempre que possível, conecte a comunicação a uma decisão tomada e a um resultado. Isso prova que você fecha o ciclo dado → insight → ação, que é o que diferencia o analista."
      },
      {
        "question": "Qual a diferença entre Analista de Dados, Analista de BI e Cientista de Dados no currículo?",
        "answer": "São perfis vizinhos, mas distintos, e o recrutador busca o adequado à vaga. O Analista de BI foca em relatórios, dashboards e métricas recorrentes (Power BI/Tableau, SQL, modelagem). O Analista de Dados amplia isso com análises exploratórias, estatística e automação em Python para responder perguntas de negócio. O Cientista de Dados foca em modelagem preditiva e machine learning. Posicione o título e o resumo para a vaga: para uma vaga de BI, destaque dashboards e DAX; para Dados, equilibre SQL, Python e impacto analítico."
      },
      {
        "question": "Tenho pouca experiência. Como monto um currículo de Analista de Dados júnior?",
        "answer": "Foque em projetos práticos e fundamentos. Liste cursos e certificações reconhecidas (Google Data Analytics, Microsoft PL-300), sua formação (Estatística, Engenharia, Economia, Sistemas ou bootcamp) e, principalmente, 2 ou 3 projetos com dados reais ou públicos: descreva a pergunta de negócio, as queries SQL, a análise em Python/Excel e a conclusão. Vale também análise feita em estágio ou em outro emprego (planilha que virou painel, relatório que automatizou uma rotina). Um resumo objetivo dizendo a stack que você domina e o tipo de problema que sabe resolver ajuda o recrutador a te enquadrar."
      },
      {
        "question": "Que certificações valem a pena no currículo de Analista de Dados?",
        "answer": "Priorize as que comprovam uma skill exigida na vaga. As mais reconhecidas no Brasil são a Microsoft PL-300 (Power BI Data Analyst Associate), o Google Data Analytics Professional Certificate e, para quem usa nuvem, certificações de BigQuery/GCP, AWS ou Databricks. Tableau Desktop Specialist conta para vagas com Tableau. Certificações ajudam principalmente quem está começando ou migrando de área; para sênior, experiência e projetos com impacto pesam mais. Evite encher o currículo de cursos curtos genéricos sem relação direta com a vaga."
      }
    ]
  },
  {
    "slug": "contador",
    "profession": "Contador",
    "metaTitle": "Modelo de Currículo para Contador (2026) | Exemplo Pronto com CRC e SPED",
    "h1": "Modelo de Currículo para Contador",
    "metaDescription": "Modelo de currículo para Contador com exemplo real, CRC, contabilidade fiscal e tributária, SPED, balanços e sistemas contábeis. Veja habilidades, palavras-chave de ATS e faixa salarial em R$.",
    "intro": "O currículo de um contador é avaliado por gestores contábeis, controllers e RH que procuram, antes de tudo, pelo registro ativo no CRC e pelo domínio das obrigações que realmente movem o caixa e o risco da empresa: SPED (ECD, ECF, EFD-Contribuições e EFD-ICMS/IPI), apuração de tributos, fechamento de balanço e conciliação de contas. Diferente de currículos genéricos de \"área financeira\", aqui contam a comprovação técnica (regimes tributários que você dominou, obrigações que entregou, sistemas que operou) e o impacto em redução de carga tributária, eliminação de passivos fiscais e fechamentos no prazo. Este modelo mostra exatamente como estruturar CRC, experiência fiscal/tributária e domínio de sistemas contábeis para passar no filtro do ATS e convencer o gestor.",
    "sampleResume": {
      "name": "Bruno Henrique Carvalho",
      "headline": "Contador | CRC-SP 1SP123456/O-7 | Contabilidade Fiscal e Tributária | SPED",
      "summary": "Contador com 8 anos de experiência em contabilidade fiscal, tributária e societária em empresas de Lucro Real e Lucro Presumido. Especialista em apuração de tributos (PIS, COFINS, ICMS, IRPJ, CSLL), escrituração e entrega de obrigações do SPED (ECD, ECF, EFD-Contribuições) e fechamento de balanço patrimonial e DRE conforme as normas brasileiras de contabilidade (NBC) e o pronunciamentos do CPC. Histórico de revisão tributária com recuperação de créditos e redução de carga fiscal, além de fechamentos contábeis entregues no prazo legal.",
      "experience": [
        {
          "role": "Contador Pleno (Fiscal e Societário)",
          "company": "Vértice Contabilidade e Consultoria (carteira de 60 clientes)",
          "period": "Mar 2021 - Atual",
          "bullets": [
            "Responsável pela apuração mensal de PIS, COFINS, ICMS, ISS, IRPJ e CSLL de uma carteira de 18 empresas em Lucro Real e Presumido, com zero autuações nos últimos 3 anos.",
            "Realizo a escrituração contábil completa e o fechamento de balanço patrimonial e DRE em sistema Domínio/Thomson Reuters, conciliando contas e entregando a ECD e a ECF dentro do prazo da Receita Federal.",
            "Conduzi revisão tributária em 5 clientes do regime não cumulativo, recuperando R$ 380 mil em créditos de PIS/COFINS sobre insumos antes não aproveitados.",
            "Implantei rotina de conciliação mensal entre razão contábil e EFD-Contribuições, reduzindo divergências de fechamento de 12 para 2 ocorrências por mês.",
            "Orientei a migração de 4 clientes de Lucro Presumido para Lucro Real após estudo de planejamento tributário, gerando economia média de 9% sobre a carga tributária anual.",
            "Atendo fiscalizações e respondo a intimações eletrônicas (e-CAC e DTE-SN), elaborando defesas e regularizando pendências junto à Receita e ao Fisco estadual."
          ]
        },
        {
          "role": "Assistente Contábil / Contador Júnior",
          "company": "Grupo Aurora Indústria e Comércio Ltda.",
          "period": "Fev 2018 - Fev 2021",
          "bullets": [
            "Executei a escrituração fiscal de entradas e saídas, gerando a EFD-ICMS/IPI e a apuração de ICMS, ICMS-ST e DIFAL da indústria.",
            "Apurei e gerei as guias mensais (DARF, GARE, GNRE) e mantive o controle de obrigações acessórias com calendário fiscal, zerando atrasos de entrega.",
            "Realizei a conciliação de contas a pagar/receber, bancos e estoque, apoiando o fechamento mensal do balancete.",
            "Apoiei a apuração do IRPJ e CSLL pelo Lucro Real trimestral, incluindo adições e exclusões na parte A e B do e-LALUR (ECF).",
            "Elaborei relatórios gerenciais e DRE mensal para a diretoria, com análise de margem por linha de produto."
          ]
        }
      ],
      "education": [
        {
          "degree": "Pós-graduação (Especialização) em Planejamento Tributário",
          "institution": "Fundação Instituto de Pesquisas Contábeis (FIPECAFI)",
          "period": "2022 - 2023"
        },
        {
          "degree": "Bacharelado em Ciências Contábeis",
          "institution": "Pontifícia Universidade Católica de São Paulo (PUC-SP)",
          "period": "2013 - 2017"
        },
        {
          "degree": "Aprovação no Exame de Suficiência do CFC e registro ativo no CRC-SP",
          "institution": "Conselho Federal de Contabilidade (CFC)",
          "period": "2017"
        }
      ],
      "skills": [
        "Apuração tributária (PIS, COFINS, ICMS, ISS, IRPJ, CSLL)",
        "SPED: ECD, ECF, EFD-Contribuições e EFD-ICMS/IPI",
        "Fechamento de balanço patrimonial e DRE",
        "Lucro Real, Lucro Presumido e Simples Nacional",
        "Conciliação contábil e revisão de razão",
        "Planejamento tributário e recuperação de créditos",
        "Normas brasileiras de contabilidade (NBC) e CPC",
        "Sistemas contábeis (Domínio, Sage, Alterdata)",
        "Excel avançado (PROCV, ÍNDICE/CORRESP, dinâmicas)",
        "Atendimento a fiscalizações (e-CAC, DTE)"
      ]
    },
    "keySkills": [
      "Registro ativo no CRC e aprovação no Exame de Suficiência do CFC",
      "Apuração de tributos federais, estaduais e municipais (PIS, COFINS, ICMS, ISS, IRPJ, CSLL, INSS)",
      "Domínio dos regimes tributários (Simples Nacional, Lucro Presumido e Lucro Real)",
      "Escrituração e entrega das obrigações do SPED (ECD, ECF, EFD-Contribuições, EFD-ICMS/IPI, EFD-Reinf)",
      "Fechamento contábil: balanço patrimonial, DRE, DFC e balancete",
      "Conciliação de contas contábeis (bancos, clientes, fornecedores, estoque)",
      "Escrituração contábil pelas normas brasileiras (NBC) e pronunciamentos do CPC",
      "Planejamento tributário e recuperação de créditos (PIS/COFINS, ICMS)",
      "Apuração de IRPJ/CSLL no Lucro Real (e-LALUR/e-LACS, adições e exclusões)",
      "Domínio de sistemas contábeis e ERPs (Domínio/Thomson Reuters, SAP, TOTVS, Alterdata, Sage)",
      "Excel avançado para conciliação, relatórios gerenciais e análise de balanço",
      "Atendimento a obrigações acessórias e fiscalizações (e-CAC, DTE, DCTF, DCTFWeb)"
    ],
    "atsKeywords": [
      "Contador",
      "CRC",
      "Ciências Contábeis",
      "Exame de Suficiência",
      "contabilidade fiscal",
      "contabilidade tributária",
      "SPED",
      "ECD",
      "ECF",
      "EFD-Contribuições",
      "EFD-ICMS/IPI",
      "apuração de impostos",
      "PIS",
      "COFINS",
      "ICMS",
      "IRPJ",
      "CSLL",
      "Lucro Real",
      "Lucro Presumido",
      "Simples Nacional",
      "balanço patrimonial",
      "DRE",
      "conciliação contábil",
      "obrigações acessórias",
      "DCTFWeb",
      "planejamento tributário",
      "sistema Domínio",
      "SAP",
      "Excel avançado"
    ],
    "salaryNote": "No Brasil (2026), o contador júnior (recém-registrado no CRC, atuando em escrituração e obrigações acessórias) costuma ganhar entre R$ 2.800 e R$ 4.500; o pleno (responsável por carteira de clientes ou pela contabilidade da empresa, com domínio de SPED e fechamento) fica na faixa de R$ 4.500 a R$ 8.000; e o sênior, controller ou contador responsável técnico (assina balanços, lidera equipe e atua em planejamento tributário) geralmente entre R$ 8.000 e R$ 15.000 ou mais. Valores variam bastante por regime do empregador (escritório contábil costuma pagar menos que indústria e empresas de grande porte), região, complexidade tributária da operação e por responsabilidade técnica formal. Atuação como contador autônomo ou sócio de escritório tem remuneração variável conforme a carteira.",
    "dos": [
      "Coloque o número do CRC ativo com a UF e a categoria logo no topo (ex.: CRC-SP 1SP123456/O-7) — é a primeira validação que o recrutador faz, e o registro é exigência legal para assinar trabalhos contábeis.",
      "Especifique os regimes tributários que você domina (Simples Nacional, Lucro Presumido, Lucro Real) e o porte/segmento das empresas — indústria, comércio e serviços têm rotinas fiscais bem diferentes.",
      "Liste as obrigações do SPED que você efetivamente escriturou e entregou (ECD, ECF, EFD-Contribuições, EFD-ICMS/IPI, EFD-Reinf, DCTFWeb), não apenas 'SPED' genérico.",
      "Quantifique impacto: créditos tributários recuperados (R$), redução de carga fiscal (%), fechamentos entregues no prazo, autuações zeradas, divergências de conciliação reduzidas.",
      "Nomeie os sistemas contábeis e ERPs que você operou (Domínio/Thomson Reuters, SAP, TOTVS Protheus, Alterdata, Sage, Questor) — recrutadores filtram por eles no ATS.",
      "Indique seu nível real de Excel e diga se já atuou como responsável técnico que assina balanço, pois isso define a senioridade e a faixa salarial."
    ],
    "donts": [
      "Não envie o currículo sem o número do CRC ou com registro vencido/baixado — sem ele você não pode assinar demonstrações contábeis e a candidatura cai na triagem.",
      "Não escreva apenas 'rotinas contábeis' ou 'área fiscal' sem dizer quais tributos apurou, quais obrigações entregou e em qual regime tributário.",
      "Não confunda contabilidade com departamento pessoal ou financeiro genérico — se a vaga é fiscal/tributária, destaque SPED e apuração, não 'pagamento de contas'.",
      "Não declare 'domínio de Lucro Real' se você só atuou no Simples Nacional — isso é testado em segundos na entrevista técnica e nos primeiros fechamentos.",
      "Não omita os sistemas contábeis que usou achando que é detalhe; para vagas de contador, o nome do software (Domínio, SAP, Alterdata) é palavra-chave decisiva.",
      "Não use objetivo vago tipo 'busco crescimento na área'; substitua por um resumo com regimes, obrigações dominadas e resultados tributários concretos."
    ],
    "faqs": [
      {
        "question": "Preciso colocar o número do CRC no currículo de contador?",
        "answer": "Sim, e em destaque, logo abaixo ou ao lado do nome, com a sigla do estado e a categoria (ex.: CRC-SP 1SP123456/O-7). O registro ativo no Conselho Regional de Contabilidade é exigência legal para assinar demonstrações contábeis, escriturações e perícias, então a maioria das empresas e escritórios filtra o currículo por ele já na triagem. Se você é técnico em contabilidade, use o registro na categoria correta. Quem ainda não passou no Exame de Suficiência do CFC deve deixar claro que está cursando ou aguardando o registro, mas isso limita as funções que pode assumir."
      },
      {
        "question": "Como destacar experiência com SPED e obrigações fiscais sem ficar genérico?",
        "answer": "Liste cada obrigação que você efetivamente escriturou e transmitiu, e não apenas a sigla 'SPED'. Diga, por exemplo: 'escrituração e entrega de ECD, ECF e EFD-Contribuições de empresas em Lucro Real' ou 'geração da EFD-ICMS/IPI com apuração de ICMS-ST e DIFAL na indústria'. Mencione também obrigações ligadas, como DCTFWeb, EFD-Reinf, DIRF e os reflexos no e-LALUR/e-LACS. Quanto mais específico o conjunto de obrigações e o regime tributário, mais o recrutador consegue encaixar você na operação dele."
      },
      {
        "question": "Qual a diferença entre o currículo do contador de escritório e o de empresa (in company)?",
        "answer": "No escritório contábil, destaque a gestão de carteira (quantos clientes, de quais regimes e segmentos), a entrega de obrigações acessórias em volume e o atendimento ao cliente. Em empresa (in company), foque na profundidade: fechamento contábil mensal, conciliações, demonstrações pelo CPC, suporte à auditoria, controladoria e relatórios gerenciais para a diretoria. Indústrias e empresas de grande porte valorizam quem domina custos, estoque e ICMS-ST; já a controladoria valoriza análise de balanço, orçamento e fluxo de caixa. Direcione o resumo e os bullets para o tipo de vaga."
      },
      {
        "question": "Quais sistemas contábeis vale a pena mencionar no currículo?",
        "answer": "Cite pelo nome os que você realmente usou. Em escritórios, os mais buscados são Domínio (Thomson Reuters/Sage), Alterdata, Questor, Prosoft e Fortes. Em empresas, predominam ERPs como SAP, TOTVS Protheus, Oracle e Sankhya, além de módulos fiscais. Inclua também o nível de Excel (avançado, com PROCV/ÍNDICE-CORRESP, tabelas dinâmicas e fórmulas de conciliação), porque grande parte do trabalho de fechamento e revisão tributária acontece em planilhas. O ATS faz correspondência literal, então escreva os nomes corretamente."
      },
      {
        "question": "Tenho pouca experiência. Como montar o currículo de contador recém-formado?",
        "answer": "Valorize o registro no CRC (ou a aprovação no Exame de Suficiência), o estágio e as rotinas que você já executou: escrituração fiscal, lançamentos contábeis, conciliações, geração de guias e apoio na entrega de obrigações. Cite os sistemas que usou no estágio e o nível de Excel. Inclua cursos práticos de SPED, apuração de tributos e rotinas do Simples Nacional/Lucro Presumido, que costumam ser o ponto de entrada. Um resumo objetivo dizendo o regime e o tipo de empresa em que você atuou (ou tem interesse) ajuda o recrutador a te enquadrar rapidamente."
      },
      {
        "question": "Vale a pena destacar planejamento tributário e recuperação de créditos?",
        "answer": "Sim, e isso diferencia bastante, sobretudo para vagas plenas e sênior. Mostre resultados concretos e que você consiga defender na entrevista: 'recuperei R$ X em créditos de PIS/COFINS sobre insumos', 'estudo de migração de Lucro Presumido para Lucro Real com economia de Y%', 'revisão de ICMS que reduziu a carga em Z%'. Esses bullets provam que você gera economia direta, não apenas cumpre obrigação. Evite inventar números ou prometer reduções agressivas sem base legal, pois o entrevistador técnico vai questionar a fundamentação."
      }
    ]
  },
  {
    "slug": "advogado",
    "profession": "Advogado",
    "metaTitle": "Modelo de Currículo para Advogado (2026) | Exemplo Pronto e Dicas",
    "h1": "Modelo de Currículo para Advogado",
    "metaDescription": "Modelo de currículo para advogado com exemplo real: OAB, áreas do direito, petições e audiências, resultados em processos, palavras-chave de ATS e faixa salarial em R$.",
    "intro": "No Direito, o currículo é avaliado por sócios, coordenadores jurídicos e RH de banca em poucos segundos — e a primeira coisa que procuram é o número da OAB ativo e a área de atuação. Diferente de outras profissões, o currículo jurídico precisa traduzir a rotina (petições, audiências, prazos, sustentações) em resultados concretos: volume de processos sob sua responsabilidade, taxa de êxito, valores envolvidos e economia gerada para o cliente. Bancas grandes usam sistemas de triagem (ATS) que filtram por área (cível, trabalhista, tributário) e por ferramentas (PJe, Projudi, sistemas de gestão de processos). Este modelo mostra exatamente como estruturar OAB, áreas do direito, experiência contenciosa e consultiva, e resultados mensuráveis, com um exemplo realista que você adapta para escritório, departamento jurídico de empresa ou setor público.",
    "sampleResume": {
      "name": "Bruno Henrique Vasconcelos",
      "headline": "Advogado | OAB/SP 412.785 | Direito Trabalhista e Cível Contencioso",
      "summary": "Advogado com 7 anos de experiência em contencioso trabalhista e cível, atuando na elaboração de petições iniciais, contestações e recursos, além de sustentação oral em audiências de instrução e julgamento. Carteira média de 280 processos ativos, com índice de êxito (total ou parcial) de 71% em reclamatórias trabalhistas. Experiência em gestão de prazos via PJe e sistema Astrea, negociação de acordos e assessoria preventiva a clientes empresariais. Pós-graduado em Direito e Processo do Trabalho.",
      "experience": [
        {
          "role": "Advogado Pleno - Contencioso Trabalhista e Cível",
          "company": "Mendonça & Prado Advogados Associados",
          "period": "Abr 2021 - Atual",
          "bullets": [
            "Atuo em carteira de aproximadamente 280 processos ativos (reclamatórias trabalhistas e ações cíveis indenizatórias), responsável pelo ciclo completo: petição inicial, contestação, réplica, recursos e cumprimento de sentença.",
            "Obtive índice de êxito (total ou parcial) de 71% nas reclamatórias trabalhistas patrocinadas em 2024, reduzindo o passivo médio condenatório dos clientes empresariais em cerca de 30% frente ao pedido inicial.",
            "Realizo, em média, 12 audiências por mês (conciliação, instrução e julgamento) na Justiça do Trabalho e cível estadual, com sustentação oral e inquirição de testemunhas.",
            "Implantei controle de prazos em planilha integrada ao PJe e ao sistema Astrea, zerando perdas de prazo no escritório nos últimos 3 anos.",
            "Negociei 64 acordos em 2024 (audiências e CEJUSC), encerrando processos por valor médio 42% inferior ao pedido e reduzindo o tempo de litígio.",
            "Presto consultoria preventiva trabalhista a 9 clientes empresariais, revisando contratos de trabalho, políticas internas e rotinas de compliance para reduzir riscos de autuação e reclamatórias."
          ]
        },
        {
          "role": "Advogado Júnior / Estagiário efetivado",
          "company": "Departamento Jurídico - Grupo Aurora Varejo S.A.",
          "period": "Fev 2018 - Mar 2021",
          "bullets": [
            "Elaborei contestações, manifestações e cálculos em ações trabalhistas de massa, gerenciando subcarteira de 150 processos no PJe e no Projudi.",
            "Acompanhei audiências em diferentes comarcas do interior de SP, preparando prepostos e testemunhas e elaborando atas de instrução.",
            "Apoiei a área de contratos na revisão de instrumentos com fornecedores, reduzindo cláusulas de risco e padronizando minutas usadas em todas as filiais.",
            "Organizei o controle de provisão de contingências jurídicas em conjunto com o financeiro, dando previsibilidade ao passivo trabalhista da companhia."
          ]
        }
      ],
      "education": [
        {
          "degree": "Pós-graduação (Especialização) em Direito e Processo do Trabalho",
          "institution": "Pontifícia Universidade Católica de São Paulo (PUC-SP)",
          "period": "2020 - 2021"
        },
        {
          "degree": "Bacharelado em Direito",
          "institution": "Universidade Presbiteriana Mackenzie",
          "period": "2012 - 2016"
        },
        {
          "degree": "Inscrição na OAB/SP nº 412.785 (ativa e regular)",
          "institution": "Ordem dos Advogados do Brasil - Seccional São Paulo",
          "period": "Aprovação no Exame de Ordem em 2017"
        }
      ],
      "skills": [
        "Contencioso trabalhista e cível",
        "Elaboração de petições, contestações e recursos",
        "Audiências e sustentação oral",
        "Gestão de prazos processuais (PJe, Projudi, e-SAJ)",
        "Sistema de gestão de processos (Astrea, Legal One)",
        "Negociação e celebração de acordos (CEJUSC)",
        "Consultoria preventiva e compliance trabalhista",
        "Análise de risco e provisão de contingências",
        "Pesquisa de jurisprudência (STF, STJ, TST, TRTs)"
      ]
    },
    "keySkills": [
      "Domínio de uma ou mais áreas do Direito (trabalhista, cível, tributário, penal, empresarial, previdenciário, família)",
      "Elaboração de peças processuais: petição inicial, contestação, réplica, recursos e memoriais",
      "Atuação em audiências (conciliação, instrução e julgamento) e sustentação oral",
      "Gestão e controle rigoroso de prazos processuais",
      "Sistemas de tramitação eletrônica: PJe, Projudi, e-SAJ, eproc",
      "Sistemas de gestão de escritório: Astrea, Legal One, ADVBox, SAJ ADV",
      "Pesquisa e análise de jurisprudência (STF, STJ, TST, TJs, TRTs, CARF)",
      "Negociação, mediação e celebração de acordos",
      "Consultoria e assessoria jurídica preventiva (parecer, due diligence, contratos)",
      "Análise de risco jurídico e provisão de contingências",
      "Redação jurídica clara e técnica",
      "Conhecimento de processo eletrônico e LGPD aplicada à advocacia"
    ],
    "atsKeywords": [
      "Advogado",
      "OAB",
      "Direito Trabalhista",
      "Direito Cível",
      "Direito Tributário",
      "Direito Empresarial",
      "contencioso",
      "consultivo",
      "petição inicial",
      "contestação",
      "recursos",
      "audiências",
      "sustentação oral",
      "PJe",
      "Projudi",
      "e-SAJ",
      "jurisprudência",
      "controle de prazos",
      "acordos",
      "assessoria jurídica",
      "compliance",
      "parecer jurídico"
    ],
    "salaryNote": "No Brasil (2026), o salário de advogado varia muito conforme o porte da banca, a área e a região. Advogado júnior (recém-inscrito na OAB, até 2 anos): geralmente de R$ 2.500 a R$ 5.000 em escritórios de pequeno e médio porte; em bancas grandes (full service) e departamentos jurídicos de multinacionais, pode iniciar entre R$ 6.000 e R$ 9.000. Pleno (3 a 6 anos, carteira própria de processos): de R$ 6.000 a R$ 14.000. Sênior/coordenador e especialista em áreas de alto valor (tributário, M&A, societário, contencioso estratégico): de R$ 15.000 a R$ 30.000 ou mais. Em advocacia associada, parte da remuneração costuma ser variável (êxito e participação em honorários). Cargos públicos da carreira jurídica (Procurador, Defensor, Magistratura) seguem tabelas próprias e costumam superar bastante essas faixas. Valores variam por estado, área e modelo (CLT, associado ou sócio).",
    "dos": [
      "Coloque o número da OAB e a seccional (UF) logo no topo, ao lado do nome (ex.: OAB/SP 412.785) — é o primeiro dado que o recrutador jurídico confere.",
      "Defina com clareza sua(s) área(s) de atuação no headline e no resumo (trabalhista, cível, tributário, penal, empresarial) em vez de se dizer 'advogado generalista'.",
      "Separe e quantifique experiência contenciosa e consultiva: número de processos na carteira, audiências por mês, taxa de êxito, valores e contingências gerenciadas.",
      "Nomeie os sistemas que domina: PJe, Projudi, e-SAJ, eproc e ferramentas de gestão (Astrea, Legal One, SAJ ADV) — são palavras-chave de triagem.",
      "Mostre resultados concretos: percentual de acordos, redução de passivo/condenação, zero perda de prazo, êxito em recursos e teses aplicadas.",
      "Liste pós-graduação, LL.M. e cursos na área específica da vaga, e mantenha a inscrição na OAB ativa e regular (sem suspensão/licença)."
    ],
    "donts": [
      "Não envie o currículo sem o número da OAB ou com a inscrição licenciada/suspensa — sem registro ativo você não pode advogar e a candidatura é descartada.",
      "Não se descreva como 'advogado de todas as áreas': isso sinaliza falta de especialização e prejudica a triagem para vagas focadas.",
      "Não liste apenas atribuições genéricas ('responsável por processos') sem dizer a área, o volume e o resultado obtido.",
      "Não exagere a senioridade nem invente teses ou êxitos que não consegue sustentar — sócios validam isso na entrevista técnica e em estudos de caso.",
      "Não inclua o conteúdo de processos sob sigilo ou dados sensíveis de clientes; cite contexto e resultado sem violar o sigilo profissional e a LGPD.",
      "Não use currículo com design rebuscado, colunas complexas ou tabelas que quebram no ATS; o meio jurídico valoriza um layout sóbrio, limpo e em uma coluna."
    ],
    "faqs": [
      {
        "question": "Preciso colocar o número da OAB no currículo de advogado?",
        "answer": "Sim, e em destaque, logo abaixo ou ao lado do nome, com a seccional (ex.: OAB/RJ 123.456). A inscrição ativa e regular é requisito legal para advogar e a maioria das bancas e departamentos jurídicos filtra os currículos por ela já na triagem. Se você está em situação de estagiário inscrito na OAB, deixe isso explícito (ex.: 'Estagiário inscrito - OAB/SP 12.345E'), pois suas atribuições são diferentes das de um advogado pleno."
      },
      {
        "question": "Como destacar a área de atuação se eu já trabalhei em várias?",
        "answer": "Direcione o currículo para a vaga. Defina no headline e no resumo a área principal que aquela vaga pede (ex.: 'Advogado - Direito Tributário') e organize a experiência destacando primeiro o que conversa com a vaga. As demais áreas entram como complemento. Um currículo focado em uma área passa muito melhor na triagem do que um genérico que tenta cobrir cível, criminal, trabalhista e tributário ao mesmo tempo, o que sinaliza pouca profundidade."
      },
      {
        "question": "Qual a diferença entre destacar atuação contenciosa e consultiva no currículo?",
        "answer": "São perfis distintos e o recrutador busca o adequado à vaga. No contencioso, destaque elaboração de peças (inicial, contestação, recursos), audiências, sustentação oral, gestão de carteira de processos e taxa de êxito. No consultivo, destaque pareceres, revisão e elaboração de contratos, due diligence, assessoria preventiva, compliance e mitigação de risco. Se você atua nos dois, separe em blocos no resumo e nos bullets para o gestor entender rapidamente seu equilíbrio entre as frentes."
      },
      {
        "question": "Como mostrar resultados em um currículo jurídico sem violar o sigilo dos clientes?",
        "answer": "Você não precisa identificar partes nem expor o conteúdo dos autos. Trabalhe com agregados e percentuais: 'carteira média de 280 processos', 'índice de êxito de 71% em reclamatórias', 'redução de 30% no passivo condenatório', '64 acordos celebrados em 2024'. Descreva o tipo de causa, a complexidade e o resultado financeiro ou processual em termos gerais. Isso comprova entrega sem ferir o sigilo profissional, a OAB e a LGPD."
      },
      {
        "question": "Recém-formado e recém-aprovado na OAB: como montar o currículo de advogado iniciante?",
        "answer": "Valorize estágio e prática real: cite as áreas em que estagiou, os tipos de peça que elaborou (petições, manifestações, cálculos), os sistemas que usou (PJe, Projudi) e as audiências que acompanhou. Inclua a graduação, a inscrição na OAB recém-obtida, monitorias, grupos de pesquisa, participação em núcleo de prática jurídica e cursos de extensão na área de interesse. Um resumo objetivo dizendo a área que pretende seguir e a disposição para a rotina forense ajuda o recrutador a te enquadrar."
      },
      {
        "question": "Vale a pena incluir pós-graduação, LL.M. e cursos no currículo jurídico?",
        "answer": "Sim, quando alinhados à vaga. Especializações e LL.M. nas áreas de maior valor (tributário, societário, trabalhista, compliance) pesam bastante na triagem e justificam faixas salariais melhores. Crie uma seção de Formação separando graduação, pós-graduação/especialização e cursos relevantes, sempre indicando instituição e período. Priorize o que tem relação direta com a vaga: para uma vaga tributária, destaque a especialização em Direito Tributário antes de cursos genéricos."
      },
      {
        "question": "Como adaptar o currículo de advogado para passar no ATS das bancas grandes?",
        "answer": "Extraia da descrição da vaga os termos exatos (área do direito, tipos de peça, sistemas, ferramentas) e use-os naturalmente no resumo e nos bullets, sempre vinculados a algo que você realmente fez. Escreva 'OAB' por extenso e cite os sistemas pelo nome (PJe, Projudi, e-SAJ, Astrea). Mantenha layout em coluna única, fontes simples, sem ícones nem tabelas, e salve em PDF padrão. ATS fazem correspondência literal de palavras-chave antes de um humano ler o currículo."
      }
    ]
  },
  {
    "slug": "eletricista",
    "profession": "Eletricista",
    "metaTitle": "Modelo de Currículo para Eletricista (2026) | Exemplo Pronto e Dicas",
    "h1": "Modelo de Currículo para Eletricista",
    "metaDescription": "Modelo de currículo para eletricista pronto para copiar: NR-10, instalações e manutenção elétrica, leitura de projetos, segurança, palavras-chave de ATS e faixa salarial em R$.",
    "intro": "Na contratação de um eletricista, o recrutador procura primeiro por uma coisa: a NR-10 válida. Sem ela, o currículo costuma ser descartado já na triagem, porque a empresa não pode liberar você para trabalhar em instalações energizadas. Depois disso, ele quer saber o que você realmente domina — instalação predial ou industrial, baixa ou alta tensão, comandos elétricos, leitura de projetos e diagramas, manutenção preventiva e corretiva. Um currículo genérico que só diz \"fazia serviços elétricos\" não passa. Este modelo traz um exemplo completo e realista de eletricista, com bullets de resultado, as habilidades técnicas que pesam na seleção, as normas e palavras-chave que os filtros de triagem (ATS) e o RH buscam, além da faixa salarial atualizada no Brasil.",
    "sampleResume": {
      "name": "Anderson Ribeiro da Silva",
      "headline": "Eletricista Industrial e Predial | NR-10 e NR-35 | Comandos Elétricos e Manutenção",
      "summary": "Eletricista com 8 anos de experiência em instalação e manutenção elétrica industrial e predial em baixa e média tensão. NR-10 (básico e SEP), NR-35 (trabalho em altura) e NR-12 em dia. Domínio de leitura e interpretação de projetos elétricos, diagramas unifilares e multifilares, montagem de painéis de comando, partida de motores e manutenção preventiva e corretiva. Histórico de redução de paradas não programadas e zero acidentes com afastamento nos últimos 4 anos.",
      "experience": [
        {
          "role": "Eletricista de Manutenção Industrial",
          "company": "Metalúrgica Aço Forte Indústria Ltda.",
          "period": "Mar 2021 - Atual",
          "bullets": [
            "Realizo manutenção preventiva e corretiva em instalações elétricas industriais de baixa e média tensão (subestação de 13,8 kV), seguindo procedimentos da NR-10 e SEP.",
            "Montei e dei manutenção em painéis de comando com CLP, contatores, relés e inversores de frequência (WEG e Siemens) para partida e proteção de motores trifásicos.",
            "Implantei plano de manutenção preventiva com termografia trimestral em quadros e barramentos, reduzindo paradas não programadas da linha em 27% no primeiro ano.",
            "Faço leitura e interpretação de projetos elétricos, diagramas unifilares e multifilares para diagnóstico e correção de falhas, com redução do tempo médio de reparo (MTTR) de 95 para 50 minutos.",
            "Executo bloqueio e etiquetagem (LOTO), medição com multímetro, alicate amperímetro e megôhmetro, e emito ordens de serviço no sistema de manutenção (CMMS) da fábrica.",
            "Mantenho registro de zero acidentes com afastamento desde 2021, com uso correto de EPI, EPC e ferramentas isoladas."
          ]
        },
        {
          "role": "Eletricista Predial e de Instalações",
          "company": "Construtora Horizonte Engenharia",
          "period": "Fev 2017 - Fev 2021",
          "bullets": [
            "Executei instalações elétricas prediais completas (enfiação, quadros de distribuição, tomadas, iluminação e aterramento) em obras residenciais e comerciais conforme a NBR 5410.",
            "Dimensionei e montei quadros de distribuição com disjuntores e DR (dispositivo diferencial residual), garantindo aprovação na vistoria da concessionária na primeira inspeção.",
            "Realizei a leitura de plantas e projetos elétricos para marcação de pontos, eletrodutos e infraestrutura, reduzindo retrabalho de passagem de cabos.",
            "Atuei na entrada de energia e padrão de medição em prédios de até 4 pavimentos, fazendo aterramento e equipotencialização dentro da norma.",
            "Trabalhei em altura com NR-35 (andaimes e plataformas) na instalação de luminárias e infraestrutura de teto em galpões comerciais."
          ]
        }
      ],
      "education": [
        {
          "degree": "Curso Técnico em Eletrotécnica",
          "institution": "SENAI - Serviço Nacional de Aprendizagem Industrial",
          "period": "2014 - 2016"
        },
        {
          "degree": "Curso NR-10 Básico (Segurança em Instalações e Serviços em Eletricidade) e Complementar SEP",
          "institution": "SENAI / SEST SENAT",
          "period": "Reciclagem em 2024"
        },
        {
          "degree": "Cursos NR-35 (Trabalho em Altura) e NR-12 (Segurança em Máquinas)",
          "institution": "SENAI",
          "period": "Atualizados em 2024"
        },
        {
          "degree": "Ensino Médio Completo",
          "institution": "Escola Estadual Profª Maria Aparecida",
          "period": "Concluído em 2013"
        }
      ],
      "skills": [
        "NR-10 básico e complementar SEP (Sistema Elétrico de Potência)",
        "NR-35 (trabalho em altura) e NR-12 (máquinas)",
        "Leitura e interpretação de projetos e diagramas elétricos (unifilar e multifilar)",
        "Instalações elétricas prediais e industriais (NBR 5410)",
        "Montagem de painéis e comandos elétricos (contatores, relés, CLP, inversores)",
        "Manutenção preventiva e corretiva",
        "Medição e ensaios (multímetro, alicate amperímetro, megôhmetro, termografia)",
        "Aterramento, SPDA e dispositivos de proteção (disjuntor, DR, DPS)",
        "Bloqueio e etiquetagem (LOTO) e procedimentos de segurança",
        "Baixa e média tensão"
      ]
    },
    "keySkills": [
      "NR-10 básico e complementar SEP atualizada (com validade dentro do prazo)",
      "Leitura e interpretação de projetos, plantas e diagramas elétricos (unifilar e multifilar)",
      "Instalações elétricas prediais, comerciais e industriais conforme a NBR 5410",
      "Montagem e manutenção de painéis de comando (contatores, relés, CLP, inversores de frequência)",
      "Manutenção preventiva, preditiva e corretiva de equipamentos e instalações",
      "Uso de instrumentos de medição: multímetro, alicate amperímetro, megôhmetro e termovisor",
      "Aterramento, equipotencialização e SPDA (para-raios)",
      "Dispositivos de proteção: disjuntores, DR, DPS e dimensionamento de circuitos",
      "Partida e proteção de motores trifásicos (direta, estrela-triângulo, soft-starter)",
      "Trabalho em altura (NR-35) e segurança em máquinas (NR-12)",
      "Bloqueio e etiquetagem (LOTO) e análise preliminar de risco (APR)",
      "Baixa, média e, quando aplicável, alta tensão"
    ],
    "atsKeywords": [
      "eletricista",
      "eletricista industrial",
      "eletricista predial",
      "eletricista de manutenção",
      "NR-10",
      "SEP Sistema Elétrico de Potência",
      "NR-35",
      "instalações elétricas",
      "manutenção elétrica",
      "leitura de projetos elétricos",
      "diagrama unifilar",
      "comandos elétricos",
      "painel de comando",
      "CLP",
      "inversor de frequência",
      "NBR 5410",
      "baixa tensão",
      "média tensão",
      "aterramento",
      "manutenção preventiva e corretiva"
    ],
    "salaryNote": "No Brasil (2026), as faixas variam conforme o tipo de atuação, a tensão e as normas que o profissional possui. Eletricista predial/residencial ou auxiliar (início de carreira): cerca de R$ 1.700 a R$ 2.600. Eletricista de manutenção ou instalador pleno (com NR-10 e experiência em comandos e leitura de projetos): cerca de R$ 2.600 a R$ 4.200. Eletricista industrial sênior, de subestação, média/alta tensão ou com NR-10 SEP e especializações: cerca de R$ 4.200 a R$ 7.000, podendo ultrapassar R$ 8.000 com adicional de periculosidade (30% sobre o salário, garantido por lei para quem trabalha com eletricidade), insalubridade, horas extras e turnos. Valores variam por região, porte da empresa e setor (indústria, construção, concessionária de energia).",
    "dos": [
      "Coloque suas normas regulamentadoras (NR-10 básico, NR-10 SEP, NR-35, NR-12) em destaque logo no topo, com o ano da última reciclagem — a NR-10 válida é o primeiro filtro da vaga.",
      "Especifique o tipo de atuação: predial, comercial ou industrial, e a tensão que você trabalha (baixa, média ou alta tensão).",
      "Cite que você lê e interpreta projetos elétricos, diagramas unifilares e multifilares — é um diferencial que separa o instalador do profissional técnico.",
      "Liste os equipamentos e instrumentos que domina pelo nome: multímetro, megôhmetro, alicate amperímetro, termovisor, CLP, inversor (WEG, Siemens).",
      "Quantifique resultados: redução de paradas de linha, queda no tempo de reparo (MTTR), aprovação em vistoria na primeira inspeção, anos sem acidentes.",
      "Mencione a NBR 5410 (baixa tensão) e, se for o caso, NBR 5419 (SPDA) e NR-12 para demonstrar domínio normativo."
    ],
    "donts": [
      "Não envie o currículo sem informar a situação da NR-10 (ou com ela vencida) — a maioria das empresas elimina a candidatura na triagem, pois é exigência legal para serviço energizado.",
      "Não escreva apenas 'fazia serviços elétricos' ou 'mexia com elétrica' sem dizer o tipo de instalação, a tensão e os equipamentos.",
      "Não confunda funções: 'auxiliar de eletricista', 'instalador' e 'eletricista de manutenção' têm escopos diferentes; use o título correto da sua experiência.",
      "Não invente domínio de média/alta tensão, CLP ou comandos que você não opera — isso é testado no teste prático e nos primeiros dias.",
      "Não omita os cursos complementares (NR-35, NR-12, primeiros socorros, SPDA) achando que são detalhe; eles habilitam você a mais frentes de trabalho.",
      "Não use foto informal, selfie em obra ou currículo de mais de 2 páginas; o gestor de manutenção quer ler em segundos."
    ],
    "faqs": [
      {
        "question": "A NR-10 é obrigatória no currículo de eletricista?",
        "answer": "Na prática, sim. A NR-10 é a norma de segurança em instalações e serviços em eletricidade, e o treinamento é exigência legal para quem trabalha em circuitos energizados ou na zona de risco. A maioria das empresas filtra os currículos por ela já na triagem e não libera o profissional sem o certificado válido. Informe se você tem o curso básico e, para serviços em subestação e linhas, o complementar SEP (Sistema Elétrico de Potência). Importante: a NR-10 exige reciclagem periódica (a cada 2 anos), então coloque o ano da última atualização."
      },
      {
        "question": "Qual a diferença entre eletricista predial, industrial e de manutenção no currículo?",
        "answer": "São perfis diferentes e o recrutador busca o adequado à vaga. O eletricista predial/residencial foca em instalações conforme a NBR 5410: enfiação, quadros, tomadas, iluminação, aterramento e padrão de entrada. O industrial trabalha com comandos elétricos, painéis, motores, CLP, inversores e muitas vezes média/alta tensão. O de manutenção atua no preventivo e corretivo de máquinas e instalações, com diagnóstico de falhas e leitura de diagramas. Deixe claro no título e no resumo qual é o seu foco, e adapte os bullets ao tipo de vaga."
      },
      {
        "question": "Como mostro experiência se nunca trabalhei registrado como eletricista?",
        "answer": "Valorize curso técnico, cursos das NRs e trabalhos práticos, mesmo informais. Cite instalações que você fez como autônomo (residências, pequenos comércios), serviços de reparo, ajuda em obras, manutenção em propriedade da família ou estágio. Descreva o que executou: 'montagem de quadro de distribuição com disjuntores e DR', 'troca de fiação seguindo a NBR 5410', 'instalação de chuveiro e tomadas com aterramento'. Inclua o curso técnico em Eletrotécnica ou Eletricista do SENAI e as NRs que possui — isso pesa muito para a primeira vaga formal."
      },
      {
        "question": "Vale a pena dizer que sei ler projetos e diagramas elétricos?",
        "answer": "Sim, e muito. Saber interpretar plantas, projetos, diagramas unifilares e multifilares é o que diferencia o eletricista técnico do profissional que apenas executa por instrução de terceiros. Vagas de manutenção industrial e instalação valorizam isso porque significa que você consegue diagnosticar falhas, dimensionar circuitos e montar painéis sozinho, lendo o esquema. Se você tem essa habilidade, destaque-a no resumo e cite um exemplo concreto num bullet, como 'leitura de diagrama multifilar para correção de comando de motor'."
      },
      {
        "question": "Quais cursos e normas valem a pena incluir além da NR-10?",
        "answer": "Depende da vaga, mas os mais buscados são: NR-35 (trabalho em altura), essencial para instalações em postes, andaimes e galpões; NR-12 (segurança em máquinas), para a indústria; NR-33 (espaço confinado) para alguns ambientes industriais; e cursos de SPDA (NBR 5419), comandos elétricos, CLP, automação e primeiros socorros. Liste cada um com a instituição (SENAI, SEST SENAT) e o ano. Esses cursos ampliam as frentes de trabalho que você pode assumir e ajudam a justificar uma faixa salarial maior."
      },
      {
        "question": "O adicional de periculosidade aparece no salário do eletricista?",
        "answer": "Sim. Por lei, o trabalho com eletricidade em condições de risco dá direito ao adicional de periculosidade de 30% sobre o salário-base. Isso costuma elevar bastante a remuneração final, principalmente em vagas industriais e de concessionárias. No currículo você não precisa falar de valores, mas é bom saber disso na hora de negociar a proposta. Demonstrar que você cumpre os procedimentos de segurança (NR-10, EPIs, bloqueio LOTO) reforça que está apto a atuar nessas condições e a receber o adicional."
      }
    ]
  },
  {
    "slug": "mecanico",
    "profession": "Mecânico",
    "metaTitle": "Modelo de Currículo para Mecânico (2026) | Exemplo Pronto e Dicas",
    "h1": "Modelo de Currículo para Mecânico",
    "metaDescription": "Modelo de currículo para mecânico automotivo com exemplo real, especialidades (motor, suspensão, freios), diagnóstico com scanner, cursos SENAI, palavras-chave de ATS e faixa salarial em R$.",
    "intro": "O dono de oficina ou o gestor de concessionária que recebe um currículo de mecânico quer responder a três perguntas em segundos: em que tipo de veículo você mexe, o que você consegue diagnosticar sozinho e quão rápido você devolve o carro pronto. A maioria dos currículos só diz \"mecânico com experiência em manutenção\", e isso não diferencia ninguém. O que abre porta é especificar as especialidades (motor, suspensão, freios, injeção eletrônica), as marcas e sistemas que você domina, o uso de scanner e equipamentos de diagnóstico, e resultados como tempo de reparo e índice de retrabalho. Este modelo traz um exemplo completo e realista para mecânico automotivo, com bullets de resultado, habilidades técnicas e as palavras-chave que os filtros de triagem (ATS) e o RH realmente procuram nessa função.",
    "sampleResume": {
      "name": "Anderson Ribeiro da Silva",
      "headline": "Mecânico Automotivo | Injeção Eletrônica, Motor e Suspensão | Scanner e Diagnóstico",
      "summary": "Mecânico automotivo com 8 anos de experiência em manutenção preventiva e corretiva de veículos leves a gasolina, flex e diesel. Domínio de diagnóstico com scanner automotivo (leitura de códigos OBD-II), reparo de motor, sistema de suspensão, freios (ABS) e injeção eletrônica. Atuação em concessionária e oficina multimarcas, com histórico de redução do tempo médio de reparo e baixo índice de retrabalho. Foco em diagnóstico assertivo na primeira passada e em transparência com o cliente no orçamento.",
      "experience": [
        {
          "role": "Mecânico Automotivo Pleno",
          "company": "Auto Center Velocidade (oficina multimarcas)",
          "period": "Fev 2021 - Atual",
          "bullets": [
            "Realizo diagnóstico com scanner automotivo (Raven, Kapture e OBD-II) em média de 12 veículos/dia, identificando falhas de injeção, sensores e atuadores com acerto acima de 90% na primeira análise.",
            "Executo retífica parcial, troca de correia/corrente dentada, junta de cabeçote e regulagem de válvulas em motores flex e diesel leve (Fiat, VW, GM, Hyundai e Toyota).",
            "Reduzi o tempo médio de reparo de suspensão completa (amortecedores, batentes, bandeja e bieletas) de 4h para 2h30 padronizando a sequência de desmontagem e organização de ferramentas.",
            "Mantive o índice de retorno por retrabalho abaixo de 3% ao adotar checklist de teste em rampa e test-drive após cada serviço de freio e suspensão.",
            "Realizo serviços de freio (troca de pastilhas, discos, sangria de fluido e diagnóstico de ABS) e troca de embreagem, seguindo torque de fabricante com torquímetro calibrado.",
            "Oriento o orçamento ao cliente explicando o diagnóstico e a peça a ser trocada, o que elevou a taxa de aprovação de serviços em cerca de 15%."
          ]
        },
        {
          "role": "Mecânico Júnior / Auxiliar de Mecânico",
          "company": "Concessionária Premium Motors (rede autorizada)",
          "period": "Mar 2018 - Jan 2021",
          "bullets": [
            "Executei revisões programadas (10.000 a 60.000 km) seguindo o plano de manutenção do fabricante, com média de 8 veículos/dia.",
            "Atuei na troca de óleo, filtros, velas, correias e fluidos, registrando os serviços no sistema da concessionária (ordem de serviço/DMS).",
            "Auxiliei mecânicos sêniores em reparos de motor e câmbio, aprendendo desmontagem de cabeçote, sincronismo e medição com paquímetro e micrômetro.",
            "Mantive a organização e a calibração das ferramentas do box, reduzindo perda de tempo na procura de equipamentos.",
            "Cumpri os procedimentos de segurança e descarte correto de óleo e fluidos conforme normas ambientais da rede."
          ]
        }
      ],
      "education": [
        {
          "degree": "Curso Técnico em Manutenção Automotiva",
          "institution": "SENAI",
          "period": "2016 - 2017"
        },
        {
          "degree": "Curso de Injeção Eletrônica e Diagnóstico com Scanner (80h)",
          "institution": "SENAI / Bosch Service",
          "period": "2022"
        },
        {
          "degree": "Ensino Médio Completo",
          "institution": "Escola Estadual Monteiro Lobato",
          "period": "Concluído em 2014"
        }
      ],
      "skills": [
        "Diagnóstico com scanner automotivo (OBD-II, Raven, Kapture)",
        "Injeção eletrônica e sistemas de gerenciamento do motor",
        "Reparo de motor: cabeçote, válvulas, correia/corrente dentada",
        "Sistema de suspensão e direção (amortecedor, bandeja, bieleta)",
        "Freios e sistema ABS (pastilha, disco, sangria de fluido)",
        "Troca de embreagem e diagnóstico de câmbio",
        "Manutenção preventiva e revisões programadas",
        "Leitura de manual técnico e esquema elétrico",
        "Uso de torquímetro, paquímetro e micrômetro",
        "Veículos flex, gasolina e diesel leve (multimarcas)"
      ]
    },
    "keySkills": [
      "Diagnóstico de falhas com scanner automotivo e leitura de códigos OBD-II",
      "Injeção eletrônica e gerenciamento eletrônico do motor",
      "Manutenção e reparo de motor (cabeçote, válvulas, correia/corrente dentada, retífica)",
      "Sistema de suspensão e direção (amortecedores, bandejas, bieletas, terminais)",
      "Sistema de freios, incluindo ABS (pastilhas, discos, tambor, sangria de fluido)",
      "Embreagem, câmbio manual e noções de câmbio automático",
      "Sistema elétrico e leitura de esquema/diagrama elétrico",
      "Manutenção preventiva e revisões programadas conforme fabricante",
      "Uso correto de ferramentas de precisão (torquímetro, paquímetro, micrômetro)",
      "Interpretação de manual técnico e tabela de torque do fabricante",
      "Organização do box, segurança no trabalho e descarte correto de fluidos",
      "Atendimento ao cliente e elaboração de orçamento de serviço"
    ],
    "atsKeywords": [
      "mecânico automotivo",
      "mecânico de automóveis",
      "manutenção preventiva",
      "manutenção corretiva",
      "injeção eletrônica",
      "diagnóstico automotivo",
      "scanner automotivo",
      "OBD-II",
      "reparo de motor",
      "suspensão",
      "freios",
      "ABS",
      "embreagem",
      "câmbio",
      "correia dentada",
      "sistema elétrico automotivo",
      "revisão programada",
      "mecânico de veículos leves",
      "mecânico diesel",
      "SENAI"
    ],
    "salaryNote": "As faixas variam conforme especialidade, tipo de veículo e empregador (concessionária, oficina multimarcas ou frota). Mecânico júnior / auxiliar (revisões, troca de óleo, peças simples): cerca de R$ 1.800 a R$ 2.600. Mecânico pleno (diagnóstico com scanner, motor, suspensão e freios): cerca de R$ 2.600 a R$ 4.200. Mecânico sênior / especialista (injeção eletrônica, retífica, diesel pesado ou chefe de oficina): cerca de R$ 4.200 a R$ 7.000, podendo ultrapassar esse valor em concessionárias de marcas premium, com frota pesada ou no modelo de produtividade por hora trabalhada/flat rate. Valores médios para o Brasil em 2026, com variação por região, marca atendida e remuneração por produção.",
    "dos": [
      "Liste suas especialidades logo no topo (motor, suspensão, freios, injeção eletrônica) em vez de escrever só 'manutenção em geral'.",
      "Diga em quais tipos de veículo e marcas você mexe (leves flex, diesel leve/pesado, linha VW/GM/Fiat/Toyota), e se atuou em concessionária ou multimarcas.",
      "Destaque o domínio de diagnóstico: scanner automotivo, leitura OBD-II e os equipamentos que você sabe operar.",
      "Quantifique resultados: veículos atendidos por dia, tempo médio de reparo, índice de retrabalho/retorno e aprovação de orçamento.",
      "Cite cursos técnicos e certificações pelo nome e ano (SENAI, Bosch, cursos de injeção eletrônica, ar-condicionado automotivo).",
      "Mostre cuidado com segurança e qualidade: uso de torquímetro, respeito ao torque do fabricante, checklist e test-drive após o serviço."
    ],
    "donts": [
      "Não escreva apenas 'mecânico com experiência em manutenção' sem dizer quais sistemas você domina nem em que tipo de veículo.",
      "Não omita se você sabe usar scanner e fazer diagnóstico eletrônico — hoje isso separa o mecânico atual do que só troca peça.",
      "Não invente domínio de motor diesel pesado, injeção direta ou câmbio automático que você não conhece; é testado na prática nos primeiros dias.",
      "Não liste 'sou esforçado e dedicado' como habilidade sem nenhum exemplo concreto de serviço executado.",
      "Não use currículo com foto de selfie na oficina, óleo na mão ou imagem informal; mantenha um documento limpo e objetivo.",
      "Não envie o mesmo currículo para uma vaga de concessionária de marca específica e uma de oficina multimarcas sem ajustar as marcas e sistemas em destaque."
    ],
    "faqs": [
      {
        "question": "Quais especialidades devo destacar no currículo de mecânico?",
        "answer": "Destaque primeiro as que combinam com a vaga e que você realmente domina: motor (cabeçote, retífica, correia/corrente dentada), suspensão e direção, freios e ABS, embreagem e câmbio, injeção eletrônica e sistema elétrico. Em vez de dizer 'manutenção em geral', escreva 'reparo de motor flex, suspensão completa e diagnóstico de injeção eletrônica com scanner'. Se você é especialista em diesel, ar-condicionado automotivo ou câmbio automático, deixe isso bem visível, porque são nichos mais bem pagos."
      },
      {
        "question": "Preciso saber usar scanner e fazer diagnóstico eletrônico?",
        "answer": "Na maioria das vagas atuais, sim. Os veículos modernos dependem de injeção eletrônica e centrais (ECU), e o diagnóstico com scanner e a leitura de códigos OBD-II tornaram-se rotina. Cite os equipamentos que você opera (Raven, Kapture, Scanner Bosch, OBD-II) e que sabe interpretar os códigos de falha. Se você ainda só faz mecânica 'de força', vale muito fazer um curso de injeção eletrônica no SENAI ou em escola técnica e mencionar isso no currículo, pois é o que mais diferencia hoje."
      },
      {
        "question": "Como mostro experiência se trabalhei sem registro em carteira ou em oficina pequena?",
        "answer": "O que vale é o serviço que você sabe fazer, não só a formalidade. Liste a oficina (mesmo pequena ou de bairro), o período aproximado e descreva os reparos que executava com tipos de veículo e sistemas. Se você fez serviços por conta própria ou ajudou no negócio da família, descreva como experiência prática: 'reparo de motor e suspensão de veículos leves multimarcas'. Cursos técnicos e certificações ajudam a comprovar a competência quando o histórico formal é curto."
      },
      {
        "question": "Vale a pena colocar cursos do SENAI e da Bosch no currículo?",
        "answer": "Sim, e eles pesam bastante nessa profissão. Cursos técnicos de manutenção automotiva (SENAI), de injeção eletrônica, de ar-condicionado automotivo e treinamentos de fabricantes ou da Bosch sinalizam atualização técnica e dão segurança ao empregador. Coloque o nome do curso, a instituição, a carga horária e o ano. Para vagas de concessionária, treinamentos específicos da marca atendida (VW, GM, Toyota, etc.) são um diferencial forte."
      },
      {
        "question": "O que escrever se sou mecânico iniciante ou recém-formado?",
        "answer": "Foque na formação técnica, nos estágios e na prática que você já teve. Destaque o curso técnico em manutenção automotiva, as competências aprendidas (troca de óleo, freios, suspensão, leitura de scanner, uso de ferramentas de precisão) e disponibilidade de horário. Se você ajudou em oficina, mexeu em carros da família ou fez bicos de manutenção, descreva isso como experiência prática. Mostrar que conhece ferramentas, segurança no box e que está disposto a aprender os procedimentos da empresa conta muitos pontos para a primeira vaga."
      },
      {
        "question": "Qual a diferença entre o currículo de mecânico de concessionária e de oficina multimarcas?",
        "answer": "O de concessionária deve enfatizar o conhecimento da(s) marca(s) atendida(s), o uso do sistema/ordem de serviço (DMS), as revisões programadas dentro do padrão do fabricante e treinamentos oficiais. O de oficina multimarcas valoriza versatilidade: capacidade de diagnosticar e reparar diferentes marcas e modelos, agilidade no atendimento e diagnóstico assertivo com poucos recursos. Ajuste o destaque conforme a vaga: para multimarcas, mostre amplitude; para concessionária, mostre profundidade na marca e aderência ao processo."
      }
    ]
  },
  {
    "slug": "costureira",
    "profession": "Costureira",
    "metaTitle": "Modelo de Currículo para Costureira (2026) | Exemplo Pronto e Dicas",
    "h1": "Modelo de Currículo para Costureira",
    "metaDescription": "Modelo de currículo para costureira pronto para copiar: máquinas (reta, overlock, galoneira), modelagem, acabamento, tipos de tecido e produção. Exemplo real, palavras-chave de ATS e faixa salarial em R$.",
    "intro": "Na indústria têxtil e nas confecções, quem seleciona costureira (encarregada de produção, supervisor de costura ou RH de fábrica) decide em segundos olhando duas coisas: quais máquinas você opera e quanto você produz. Um currículo de costureira precisa deixar isso explícito logo no topo — máquina reta, overlock, galoneira, travete, fechadeira — junto com o tipo de peça (malha, jeans, lingerie, uniforme), a meta de produção que você atinge e o nível de acabamento que entrega. Este modelo traz um exemplo realista e completo, as habilidades que pesam na seleção e as palavras-chave que os sistemas de triagem (ATS) e os encarregados procuram para vagas de costura industrial e sob medida.",
    "sampleResume": {
      "name": "Maria Aparecida da Silva",
      "headline": "Costureira Industrial | Reta, Overlock e Galoneira | Malha e Tecido Plano",
      "summary": "Costureira industrial com 8 anos de experiência em confecção de malharia e tecido plano, operando máquina reta eletrônica, overlock (interlock), galoneira e travete. Domínio de costura por etapa e peça completa, com média de produção acima da meta e índice de retrabalho abaixo de 2%. Experiência em montagem de camisetas, moletons, calças e uniformes, leitura de ficha técnica, regulagem de pontos e tensão, e acabamento fino (caseado, pregar botão, barra invisível). Conhecimento de modelagem básica e diversos tipos de tecido (malha PV, moletom, jeans, viscose, tactel).",
      "experience": [
        {
          "role": "Costureira Industrial - Setor de Montagem",
          "company": "Confecções Vale do Sol Ltda. (malharia, 120 funcionários)",
          "period": "Mar 2020 - Atual",
          "bullets": [
            "Opero máquina reta eletrônica, overlock de 3 e 5 fios, galoneira (cobertura) e travete na montagem completa de camisetas, moletons e regatas em malha PV e algodão",
            "Mantenho produção média de 280 a 320 peças/dia no fechamento de camiseta, superando a meta da célula em cerca de 15% com índice de retrabalho abaixo de 2%",
            "Realizo costura por etapas em sistema de célula (gola, mangas, fechamento lateral, barra na galoneira) seguindo ficha técnica e ordem de produção",
            "Regulo ponto, tensão de linha e tipo de agulha conforme o tecido (malha, moletom flanelado, viscolycra), reduzindo quebra de linha e furos na peça",
            "Faço inspeção de qualidade da própria peça (alinhamento de gola, simetria de mangas, acabamento de barra) antes de passar para a revisão final",
            "Auxilio na troca de máquina e na adaptação de novos modelos lendo a ficha técnica e fazendo a peça-piloto com a encarregada"
          ]
        },
        {
          "role": "Costureira - Costura sob Medida e Ajustes",
          "company": "Ateliê e Lavanderia Costura Fácil",
          "period": "Jun 2016 - Fev 2020",
          "bullets": [
            "Realizei ajustes e reformas em roupas (bainha, ajuste de cintura, troca de zíper, estreitar/alargar peça) em tecido plano, jeans e tecidos finos como seda e cetim",
            "Costurei peças sob medida a partir de molde e modelagem básica (saias, blusas, vestidos), do corte ao acabamento final",
            "Operei máquina reta industrial e overlock doméstica/semi-industrial, além de caseado e pregar botão na reta e a mão",
            "Atendi em média 40 clientes por semana com prazo e qualidade, mantendo taxa de retorno por defeito praticamente zero",
            "Controlei estoque de linhas, zíperes, botões e aviamentos, e orientei a cliente sobre tipo de tecido e melhor acabamento para cada peça"
          ]
        }
      ],
      "education": [
        {
          "degree": "Ensino Médio Completo",
          "institution": "EE Profª Anita Garibaldi",
          "period": "Concluído em 2014"
        },
        {
          "degree": "Curso de Costura Industrial e Operação de Máquinas (reta, overlock e galoneira)",
          "institution": "SENAI",
          "period": "2015"
        },
        {
          "degree": "Curso de Modelagem e Corte Básico",
          "institution": "Escola de Moda / SENAC",
          "period": "2018"
        }
      ],
      "skills": [
        "Máquina reta industrial e reta eletrônica",
        "Overlock / interlock (3 e 5 fios)",
        "Galoneira (cobertura) e travete",
        "Caseado e pregar botão (caseadeira/botoneira)",
        "Leitura de ficha técnica e ordem de produção",
        "Regulagem de ponto, tensão e troca de agulha",
        "Costura por etapa e peça completa (montagem)",
        "Modelagem e corte básico",
        "Acabamento fino (barra invisível, simetria, alinhamento)",
        "Conhecimento de tecidos (malha, plano, jeans, viscose)"
      ]
    },
    "keySkills": [
      "Operação de máquina reta (mecânica e eletrônica)",
      "Overlock / interlock de 3 e 5 fios",
      "Galoneira (máquina de cobertura) e travete",
      "Fechadeira de braço, zig-zag e caseadeira/botoneira",
      "Costura por etapa em célula e montagem de peça completa",
      "Leitura de ficha técnica e ordem de produção",
      "Regulagem de ponto, tensão de linha, troca de agulha e calcador",
      "Modelagem e corte básico (interpretação de molde)",
      "Conhecimento de tipos de tecido (malha, plano, jeans, viscose, tactel, brim)",
      "Acabamento e controle de qualidade da própria peça",
      "Cumprimento de meta de produção e baixo índice de retrabalho",
      "Organização do posto de trabalho e noções de NR-12 (segurança em máquinas)"
    ],
    "atsKeywords": [
      "costureira",
      "costureira industrial",
      "operadora de máquina de costura",
      "máquina reta",
      "reta eletrônica",
      "overlock",
      "interlock",
      "galoneira",
      "máquina de cobertura",
      "travete",
      "fechadeira",
      "caseadeira",
      "botoneira",
      "ficha técnica",
      "costura por etapa",
      "montagem de peça",
      "modelagem",
      "acabamento",
      "controle de qualidade",
      "meta de produção",
      "malha",
      "tecido plano",
      "confecção",
      "NR-12"
    ],
    "salaryNote": "As faixas variam conforme as máquinas que você opera, o tipo de peça e a região (o polo têxtil de SP, SC e do agreste de PE costuma pagar diferente). Costureira júnior / em formação, com máquina reta e overlock: R$ 1.500 a R$ 1.900. Costureira plena, operando reta, overlock e galoneira com boa produção: R$ 1.900 a R$ 2.600. Costureira sênior / polivalente (domina todas as máquinas, faz peça completa, lê ficha técnica e tem produção alta), além de funções como pilotista, encarregada de costura ou modelista: R$ 2.600 a R$ 4.000, podendo passar disso com prêmio de produção. Em ateliê e costura sob medida, o ganho costuma ser por peça ou por produção. Valores médios para o Brasil em 2026, com variação por empresa, convenção do sindicato têxtil e produtividade.",
    "dos": [
      "Liste no topo as máquinas que você opera com o nome certo (reta, overlock/interlock, galoneira, travete, fechadeira, caseadeira) e o nível em cada uma",
      "Diga o tipo de peça e de tecido que você costura: malha (camiseta, moletom), tecido plano, jeans, lingerie, uniforme, alfaiataria",
      "Coloque números de produção: peças/dia, % acima da meta, índice de retrabalho ou de qualidade — é o que o encarregado quer ver",
      "Informe se você faz costura por etapa (em célula/esteira) ou peça completa, e se monta a peça do início ao fim",
      "Destaque cursos do SENAI/SENAC e habilidades extras: leitura de ficha técnica, modelagem, regulagem de máquina, peça-piloto/pilotista",
      "Mencione acabamento e controle de qualidade (barra invisível, simetria, alinhamento de gola) — qualidade pesa tanto quanto velocidade"
    ],
    "donts": [
      "Não escreva só 'experiência com costura' sem dizer quais máquinas opera — sem isso o currículo não passa na triagem da confecção",
      "Não confunda os nomes das máquinas (overlock não é galoneira, reta não é interlock); errar o termo mostra falta de prática",
      "Não omita o tipo de tecido e de peça: quem costura malha nem sempre costura tecido plano ou jeans, e o recrutador precisa saber",
      "Não invente domínio de máquina que você nunca operou — no teste prático isso aparece em minutos e custa a vaga",
      "Não deixe de fora os números de produção achando que 'sou rápida' basta; meta e retrabalho são medidos na fábrica",
      "Não envie currículo de várias páginas nem com foto informal; o encarregado quer ler máquinas, peças e produção em segundos"
    ],
    "faqs": [
      {
        "question": "Quais máquinas eu devo destacar no currículo de costureira?",
        "answer": "Destaque pelo nome exato cada máquina que você opera de verdade: reta (mecânica e eletrônica), overlock/interlock (de 3 e 5 fios), galoneira ou cobertura (para barra de malha), travete (para reforço de bolso e presilha), fechadeira de braço (jeans), caseadeira e botoneira (caseado e pregar botão) e zig-zag. Quanto mais máquinas você domina, mais 'polivalente' você é — e costureira polivalente é a mais disputada e mais bem paga, porque a fábrica consegue te alocar em qualquer posto da célula."
      },
      {
        "question": "Qual a diferença entre overlock e galoneira, e por que isso importa no currículo?",
        "answer": "A overlock (ou interlock) é a máquina que fecha e arremata a peça ao mesmo tempo, cortando a sobra de tecido e fazendo o ponto que evita que a malha desfie — é usada no fechamento lateral e na união de partes. A galoneira (máquina de cobertura) faz a barra e o acabamento com dois ou três pontos paralelos por cima e a corrente por baixo, típico da barra de camiseta e do punho. São funções diferentes; trocar os nomes no currículo denuncia que a pessoa tem pouca prática. Escreva o que realmente sabe operar."
      },
      {
        "question": "Como mostro minha produção sem ficar genérica?",
        "answer": "Use números reais do seu posto. Em vez de 'sou rápida e produtiva', escreva o que e quanto: 'média de 280 a 320 peças/dia no fechamento de camiseta, 15% acima da meta da célula, com retrabalho abaixo de 2%'. Indique a operação (fechamento, pregar gola, barra na galoneira), a meta que você batia e o índice de qualidade. Na confecção, produção e retrabalho são medidos diariamente, então dado concreto pesa muito mais que adjetivo."
      },
      {
        "question": "Preciso saber modelagem e ler ficha técnica para conseguir vaga de costureira?",
        "answer": "Para a costura de linha (etapa na célula) nem sempre, mas é um grande diferencial. Saber ler ficha técnica e ordem de produção mostra que você entende a peça toda — tipo de costura, ponto, tolerância e acabamento — e consegue fazer a peça-piloto e se adaptar a modelos novos sem depender da encarregada. Quem também faz modelagem e corte básico, ou já atuou como pilotista, costuma ganhar mais e tem caminho para encarregada de costura ou modelista. Coloque esses cursos e experiências em destaque."
      },
      {
        "question": "Costuro malha; posso me candidatar a vaga de tecido plano ou jeans?",
        "answer": "Pode, mas seja honesta sobre o que domina. Malha (camiseta, moletom) e tecido plano (camisa social, calça de alfaiataria) ou jeans pedem máquinas, agulhas, tensões e técnicas diferentes — jeans, por exemplo, usa fechadeira de braço e agulha mais grossa. No currículo, diga claramente os tecidos e peças que você já costurou e os que tem facilidade de aprender. Demonstrar que conhece a diferença entre os tecidos e sabe regular a máquina para cada um já conta muitos pontos."
      },
      {
        "question": "O que escrever se sou costureira iniciante ou estou saindo de um curso?",
        "answer": "Foque nas máquinas que aprendeu, no curso e na disposição para produção. Destaque o curso de costura industrial (SENAI/SENAC), as máquinas que você operou na prática (reta, overlock, galoneira), os tipos de ponto e de tecido que treinou e qualquer experiência costurando em casa, em ateliê, fazendo ajustes ou ajudando em confecção. Se você fez peças completas no curso (camiseta, calça, vestido do molde ao acabamento), descreva isso como prática. Disponibilidade de horário e vontade de bater meta também valem citar."
      }
    ]
  },
  {
    "slug": "cabeleireiro",
    "profession": "Cabeleireiro",
    "metaTitle": "Modelo de Currículo para Cabeleireiro (2026) | Exemplo Pronto e Dicas",
    "h1": "Modelo de Currículo para Cabeleireiro",
    "metaDescription": "Modelo de currículo para cabeleireiro com exemplo real: cortes, coloração, química, atendimento e fidelização. Veja habilidades, palavras-chave de ATS e faixa salarial em R$.",
    "intro": "Em salão, o currículo do cabeleireiro precisa provar duas coisas que o dono ou gerente decide em segundos: você domina a técnica (corte, coloração, química) e você segura cliente na cadeira (atendimento e fidelização). A maioria dos currículos da área só lista \"cortes femininos e masculinos\" e para por aí — o que faz diferença é mostrar com números o tamanho da sua agenda, a taxa de retorno da sua clientela, o ticket médio que você sustentava e as técnicas e marcas de produto que você realmente domina. Este modelo traz um exemplo completo e realista, as habilidades que pesam na seleção de redes e salões, e as palavras-chave que os filtros de triagem (ATS) e o RH buscam para vagas de cabeleireiro e hairstylist.",
    "sampleResume": {
      "name": "Juliana Mendes Carvalho",
      "headline": "Cabeleireira | Colorista e Especialista em Loiros | Cortes e Química",
      "summary": "Cabeleireira com 7 anos de experiência em salão de médio porte, especializada em coloração, mechas e correção de cor (loiros, balayage e morena iluminada). Domínio de cortes femininos e masculinos, escova, progressiva e tratamentos de reconstrução. Construí carteira própria de mais de 200 clientes ativos com taxa de retorno mensal acima de 70%, atuando no sistema de comissão sobre serviço e venda de produtos de tratamento.",
      "experience": [
        {
          "role": "Cabeleireira e Colorista",
          "company": "Studio Beleza & Estilo (salão com 8 cadeiras)",
          "period": "Mar 2021 - Atual",
          "bullets": [
            "Atendo média de 35 a 45 clientes por semana entre corte, coloração, mechas e tratamentos, com agenda própria cheia e lista de espera nos fins de semana.",
            "Sou referência do salão em coloração e correção de cor: realizo descoloração, matização, balayage e morena iluminada usando linhas profissionais (Wella, L'Oréal e Truss).",
            "Aumentei meu ticket médio de R$ 95 para R$ 160 ao combinar serviço de cor com tratamento de reconstrução e venda de home care.",
            "Mantenho taxa de retorno mensal de cerca de 72% da minha carteira, com reagendamento ainda na cadeira e lembrete por WhatsApp.",
            "Faço diagnóstico capilar e teste de mecha antes de toda química, garantindo zero ocorrências de quebra ou reação alérgica em mais de 3 anos.",
            "Vendi em média R$ 1.800/mês em produtos de tratamento (máscaras, leave-in e finalizadores), contribuindo para a meta de varejo do salão."
          ]
        },
        {
          "role": "Cabeleireira (corte e escova)",
          "company": "Salão Charme Hair",
          "period": "Fev 2018 - Fev 2021",
          "bullets": [
            "Realizava cortes femininos e masculinos, escova modeladora, hidratação e penteados para eventos e formaturas.",
            "Atendia em média 30 clientes por semana, cobrindo horários de pico (sábado e véspera de feriado) com pontualidade e agilidade.",
            "Aprendi e passei a executar progressiva, selagem e botox capilar, ampliando os serviços que oferecia e minha comissão.",
            "Fidelizei clientes pela consistência do acabamento e pelo pós-atendimento, recebendo indicações que formaram a base da minha carteira atual.",
            "Apoiava a organização e higienização das estações e ferramentas conforme as normas de biossegurança da Anvisa."
          ]
        }
      ],
      "education": [
        {
          "degree": "Curso Profissionalizante de Cabeleireiro (Cabeleireiro Profissional)",
          "institution": "Senac",
          "period": "2017"
        },
        {
          "degree": "Especialização em Colorimetria e Correção de Cor",
          "institution": "Curso livre com educadora de marca (Wella Professionals)",
          "period": "2022"
        },
        {
          "degree": "Curso de Cortes Femininos e Visagismo",
          "institution": "Curso livre (carga de 60h)",
          "period": "2020"
        }
      ],
      "skills": [
        "Coloração, descoloração e matização",
        "Mechas, balayage e morena iluminada",
        "Colorimetria e correção de cor",
        "Cortes femininos e masculinos",
        "Química: progressiva, selagem e botox capilar",
        "Tratamentos: reconstrução, hidratação e cauterização",
        "Diagnóstico capilar e teste de mecha",
        "Escova, brushing e penteados para eventos",
        "Atendimento, fidelização e venda de home care",
        "Biossegurança e higienização (normas Anvisa)"
      ]
    },
    "keySkills": [
      "Cortes femininos e masculinos (tesoura, navalha e máquina)",
      "Coloração, descoloração e matização (colorimetria)",
      "Mechas, luzes, balayage e morena iluminada",
      "Correção de cor e neutralização de tons indesejados",
      "Química capilar: progressiva, selagem, relaxamento e botox",
      "Tratamentos: reconstrução, hidratação, nutrição e cauterização",
      "Diagnóstico capilar e teste de mecha/alergia antes da química",
      "Escova, brushing, finalização e penteados para eventos",
      "Domínio de marcas profissionais (Wella, L'Oréal, Truss, Alfaparf)",
      "Atendimento ao cliente, escuta e gestão de expectativa",
      "Fidelização: reagendamento, pós-venda e venda de home care",
      "Biossegurança, higienização de ferramentas e normas da Anvisa"
    ],
    "atsKeywords": [
      "cabeleireiro",
      "cabeleireira",
      "hairstylist",
      "colorista",
      "corte feminino",
      "corte masculino",
      "coloração",
      "descoloração",
      "mechas",
      "balayage",
      "progressiva",
      "química capilar",
      "colorimetria",
      "correção de cor",
      "tratamento capilar",
      "reconstrução",
      "escova",
      "atendimento ao cliente",
      "fidelização",
      "venda de produtos"
    ],
    "salaryNote": "No Brasil (2026), a remuneração do cabeleireiro varia muito porque a maioria trabalha por comissão (em geral 30% a 50% sobre o serviço) ou no modelo de aluguel de cadeira, e não com salário fixo. Para referência de fixo/carteira (CLT) e ganhos médios: cabeleireiro júnior/assistente (lavagem, escova, auxílio em química) costuma ficar entre R$ 1.500 e R$ 2.200; cabeleireiro pleno (corte, cor e química com agenda própria) geralmente entre R$ 2.500 e R$ 4.500 considerando comissão; e cabeleireiro sênior/colorista especialista, com carteira fiel e ticket alto, pode passar de R$ 5.000 a R$ 8.000 ou mais em salões de médio e alto padrão nas capitais. No modelo de comissão, quem tem clientela própria e vende home care costuma ganhar bem acima da média. Valores variam por região, porte e padrão do salão e pelo modelo de contratação.",
    "dos": [
      "Liste suas especialidades de técnica no topo, separando o que você realmente domina (ex.: 'colorista — loiros e correção de cor') do que apenas executa no básico.",
      "Quantifique sua agenda e fidelização: número de clientes atendidos por semana, taxa de retorno da carteira, ticket médio e quanto você vende de home care por mês.",
      "Cite as marcas e linhas profissionais que você usa pelo nome (Wella, L'Oréal, Truss, Alfaparf, Keune) — salões valorizam quem já conhece o produto da casa.",
      "Detalhe os serviços de química que executa com responsabilidade (progressiva, selagem, descoloração, matização) e mencione que faz diagnóstico capilar e teste de mecha.",
      "Mostre fidelização concreta: reagendamento na cadeira, pós-venda por WhatsApp, indicações e clientela que te acompanha — é o que mais interessa ao dono do salão.",
      "Inclua cursos e workshops de marca (colorimetria, visagismo, técnicas de loiro) com a instituição e o ano, mesmo os de carga horária curta."
    ],
    "donts": [
      "Não escreva só 'cortes e coloração' sem dizer o nível, as técnicas e as marcas — todo currículo da área diz isso e não diferencia ninguém.",
      "Não afirme que domina química e correção de cor se você ainda não faz com segurança; isso é testado no teste prático e um erro em descoloração custa a vaga e a confiança.",
      "Não omita se você tem carteira própria de clientes — para muitos salões, levar clientela ativa é o fator decisivo da contratação.",
      "Não despreze o atendimento e a fidelização achando que só a técnica conta; salão vive de cliente que volta, e o gestor procura isso no currículo.",
      "Não deixe de mencionar higienização e biossegurança (esterilização de ferramentas, descartáveis, normas da Anvisa) — pesa em salões organizados e em fiscalizações.",
      "Não use foto inadequada nem encha o currículo de fotos de trabalhos; em vez disso, deixe o link de um portfólio (Instagram profissional) organizado."
    ],
    "faqs": [
      {
        "question": "Devo colocar minha carteira de clientes no currículo de cabeleireiro?",
        "answer": "Sim, e isso pode ser o seu maior diferencial. Muitos salões contratam justamente quem chega com clientela ativa, porque isso significa faturamento imediato na cadeira. Indique o tamanho aproximado da sua carteira ('mais de 200 clientes ativos'), a taxa de retorno ('cerca de 70% reagenda no mês') e diga, com honestidade, quanto dessa base costuma te acompanhar em uma troca de salão. Não exponha dados pessoais dos clientes — fale apenas em volume e fidelização."
      },
      {
        "question": "Como mostro que domino química e coloração sem ser genérico?",
        "answer": "Especifique a técnica e o resultado, não só o nome do serviço. Em vez de 'faço coloração', escreva 'realizo descoloração, matização e balayage com linhas profissionais Wella e L'Oréal, fazendo teste de mecha antes de toda química'. Cite correção de cor, neutralização de tons, progressiva, selagem e reconstrução conforme o que você executa de verdade. Mencionar diagnóstico capilar e zero ocorrências de quebra/reação transmite a segurança técnica que o salão procura."
      },
      {
        "question": "Preciso de curso técnico ou registro para trabalhar como cabeleireiro?",
        "answer": "Não há um conselho de classe obrigatório como em algumas profissões, mas a maioria dos salões pede comprovação de formação. Um curso profissionalizante (Senac, Senai ou escolas de beleza reconhecidas) e cursos de aperfeiçoamento de marca (colorimetria, cortes, visagismo) aumentam muito suas chances. Liste-os com instituição e ano. Se você aprendeu na prática, descreva a experiência real e os cursos livres e workshops que fez para se atualizar."
      },
      {
        "question": "Trabalho por comissão. Como isso aparece no currículo?",
        "answer": "Deixe claro o modelo em que você atua (comissão sobre serviço, aluguel de cadeira ou CLT com comissão) e, principalmente, mostre os números que comprovam sua produtividade: ticket médio, quantidade de atendimentos por semana, volume de venda de produtos e taxa de retorno. Para o dono do salão, um cabeleireiro que gira bem a agenda e vende home care vale mais do que qualquer salário pedido — então transforme sua performance em dados concretos."
      },
      {
        "question": "Como destaco a fidelização de clientes no currículo?",
        "answer": "Fidelização é resultado, então mostre em números e ações. Cite a taxa de retorno da sua carteira, o reagendamento feito ainda na cadeira, o pós-atendimento por WhatsApp e o volume de indicações que você gera. Frases como 'mantenho cerca de 70% da carteira em retorno mensal' ou 'minha base atual veio em grande parte de indicações' provam que você não só atende bem, como faz o cliente voltar — exatamente o que sustenta o faturamento de um salão."
      },
      {
        "question": "Vale a pena colocar o Instagram dos meus trabalhos no currículo?",
        "answer": "Sim, desde que seja um perfil profissional e organizado. O portfólio visual é decisivo em beleza: o gestor quer ver acabamento de corte, uniformidade de cor e antes/depois de química. Coloque o @ do seu Instagram de trabalhos no cabeçalho, ao lado do contato, e garanta que as fotos tenham boa qualidade e mostrem diferentes técnicas (loiros, cortes, escova, eventos). Evite misturar com conteúdo pessoal e não exponha clientes sem autorização."
      }
    ]
  },
  {
    "slug": "farmaceutico",
    "profession": "Farmacêutico",
    "metaTitle": "Modelo de Currículo para Farmacêutico (Exemplo Pronto 2026)",
    "h1": "Modelo de Currículo para Farmacêutico",
    "metaDescription": "Modelo de currículo para Farmacêutico com exemplo real: CRF, dispensação, manipulação, atenção farmacêutica e SNGPC. Habilidades, palavras-chave de ATS e faixa salarial em R$.",
    "intro": "O currículo de Farmacêutico é avaliado em segundos por gerentes de farmácia, coordenadores de farmácia hospitalar e RH de indústrias e distribuidoras, que procuram primeiro pelo número do CRF ativo, pela área de atuação (drogaria, hospitalar, manipulação, indústria ou distribuição) e por responsabilidades regulatórias como assunção de RT, SNGPC e Portaria 344/98. Diferente de outras áreas da saúde, aqui o recrutador precisa enxergar tanto a competência técnica (dispensação, manipulação magistral, controle de psicotrópicos) quanto a responsabilidade legal que você assume ao assinar como Responsável Técnico. Este modelo mostra exatamente como estruturar essas informações, com um exemplo realista que você adapta para vagas de farmácia comunitária, hospitalar ou de manipulação.",
    "sampleResume": {
      "name": "Juliana Martins Albuquerque",
      "headline": "Farmacêutica | CRF-SP 45.678 | Responsável Técnica, Dispensação e Atenção Farmacêutica",
      "summary": "Farmacêutica com 7 anos de experiência em farmácia comunitária e hospitalar, atuando como Responsável Técnica (RT) com domínio de SNGPC, escrituração de medicamentos controlados (Portaria 344/98) e farmacovigilância. Experiência consolidada em dispensação assistida, atenção farmacêutica, seguimento farmacoterapêutico e gestão de estoque sob boas práticas (RDC 44/2009 da Anvisa). Foco em segurança do paciente, redução de erros de dispensação e conformidade em inspeções sanitárias e do CRF.",
      "experience": [
        {
          "role": "Farmacêutica Responsável Técnica",
          "company": "Drogaria Saúde Plena (rede com 12 lojas)",
          "period": "Fev 2021 - Atual",
          "bullets": [
            "Assumi a RT da unidade perante o CRF-SP e a Vigilância Sanitária, mantendo o estabelecimento aprovado em 100% das inspeções (sanitária e do CRF) nos últimos 4 anos",
            "Faço a escrituração diária de medicamentos controlados (listas A, B e C da Portaria 344/98) no SNGPC, com transmissão mensal sem pendências e divergência de estoque inferior a 0,5%",
            "Implantei serviço de atenção farmacêutica com aferição de pressão e glicemia e seguimento farmacoterapêutico, atendendo cerca de 120 pacientes/mês e aumentando a recompra de receituário contínuo em 23%",
            "Treinei e supervisiono equipe de 8 atendentes e balconistas em dispensação correta, retenção de receitas e orientação ao paciente, reduzindo em 40% as devoluções por erro de dispensação",
            "Realizo intervenções farmacêuticas em interações medicamentosas e duplicidade terapêutica, registrando as orientações e encaminhando casos ao prescritor quando necessário",
            "Controlo a cadeia de frio de termolábeis (insulinas e vacinas) com monitoramento de temperatura e plano de contingência, sem perdas por excursão de temperatura"
          ]
        },
        {
          "role": "Farmacêutica Clínica - Farmácia Hospitalar",
          "company": "Hospital São Lucas (180 leitos)",
          "period": "Mar 2018 - Jan 2021",
          "bullets": [
            "Realizei validação e dispensação de prescrições em sistema de dose unitária e dose individualizada para clínica médica e UTI, cobrindo cerca de 180 leitos",
            "Atuei na conciliação medicamentosa na admissão e alta, reduzindo discrepâncias e eventos adversos relacionados a medicamentos (EAM) na clínica médica",
            "Participei da Comissão de Farmácia e Terapêutica (CFT) na padronização de medicamentos e protocolos de antimicrobianos junto à CCIH",
            "Controlei psicotrópicos e antimicrobianos de uso restrito com dupla checagem e rastreabilidade por lote, garantindo conformidade na acreditação ONA",
            "Supervisionei a manipulação de nutrição parenteral e diluição de quimioterápicos na central de misturas intravenosas (CMIV) sob NR-32 e RDC 67"
          ]
        }
      ],
      "education": [
        {
          "degree": "Pós-graduação (Especialização) em Farmácia Clínica e Atenção Farmacêutica",
          "institution": "Instituto Racine",
          "period": "2019 - 2020"
        },
        {
          "degree": "Bacharelado em Farmácia",
          "institution": "Universidade Estadual de Londrina (UEL)",
          "period": "2012 - 2016"
        },
        {
          "degree": "Capacitação em Farmacovigilância e SNGPC",
          "institution": "Conselho Regional de Farmácia (CRF-SP)",
          "period": "2022"
        }
      ],
      "skills": [
        "Responsabilidade Técnica (RT) e habilitação no CRF",
        "Dispensação e atenção farmacêutica",
        "SNGPC e escrituração de controlados (Portaria 344/98)",
        "Seguimento farmacoterapêutico e conciliação medicamentosa",
        "Farmacovigilância e notificação de EAM",
        "Boas Práticas Farmacêuticas (RDC 44/2009)",
        "Gestão de estoque e cadeia de frio",
        "Análise de interações medicamentosas"
      ]
    },
    "keySkills": [
      "Dispensação de medicamentos e orientação ao paciente",
      "Atenção farmacêutica e seguimento farmacoterapêutico",
      "Escrituração de medicamentos controlados no SNGPC (Portaria 344/98)",
      "Responsabilidade Técnica (RT) e relação com Vigilância Sanitária e CRF",
      "Manipulação magistral e farmacotécnica (RDC 67/2007)",
      "Boas Práticas Farmacêuticas e de Manipulação (RDC 44/2009, RDC 301)",
      "Farmacovigilância e notificação de eventos adversos",
      "Análise de interações medicamentosas e duplicidade terapêutica",
      "Conciliação medicamentosa e farmácia clínica hospitalar",
      "Controle de estoque, validade, rastreabilidade por lote e cadeia de frio",
      "Aferição de parâmetros (pressão arterial, glicemia capilar) e serviços farmacêuticos",
      "Gestão de equipe de balcão e treinamento em dispensação"
    ],
    "atsKeywords": [
      "Farmacêutico",
      "CRF",
      "Responsável Técnico",
      "RT",
      "Dispensação",
      "SNGPC",
      "Portaria 344/98",
      "Medicamentos controlados",
      "Atenção farmacêutica",
      "Manipulação magistral",
      "Farmácia hospitalar",
      "Farmácia clínica",
      "Boas Práticas Farmacêuticas",
      "RDC 44",
      "Farmacovigilância",
      "Vigilância Sanitária",
      "Anvisa",
      "Controle de estoque",
      "Seguimento farmacoterapêutico",
      "Conciliação medicamentosa"
    ],
    "salaryNote": "No Brasil (2026), farmacêutico(a) júnior (início de carreira, drogaria/dispensação) costuma ganhar entre R$ 3.500 e R$ 5.000; pleno (com RT, SNGPC e atenção farmacêutica consolidados) fica na faixa de R$ 5.000 a R$ 7.500; e sênior/especialista (farmácia hospitalar, clínica, indústria, gestão de RT de redes ou coordenação) geralmente entre R$ 7.500 e R$ 13.000 ou mais. A indústria farmacêutica (controle de qualidade, garantia da qualidade, assuntos regulatórios) e a função de RT em distribuidoras tendem a pagar acima da média de drogaria. Valores variam por estado, porte do empregador (rede de drogaria, hospital público/privado, indústria) e pelo piso da categoria definido em convenção coletiva regional do Sinfar/sindicato dos farmacêuticos.",
    "dos": [
      "Coloque o número do CRF ativo com a UF logo no topo, ao lado do nome (ex.: CRF-SP 45.678) — é o primeiro dado que o recrutador e a Vigilância Sanitária conferem",
      "Deixe explícita a área de atuação (drogaria, hospitalar, manipulação, indústria, distribuição) e se você já assumiu Responsabilidade Técnica (RT), pois muda totalmente o perfil da vaga",
      "Cite competências regulatórias concretas: SNGPC, escrituração da Portaria 344/98, Boas Práticas (RDC 44/2009), farmacovigilância e aprovação em inspeções",
      "Quantifique resultados: divergência de estoque no SNGPC, queda de erros de dispensação, número de pacientes em atenção farmacêutica, conformidade em inspeções e acreditação",
      "Liste especializações e habilitações que abrem vagas melhores: Farmácia Clínica, Manipulação, Oncologia, Farmácia Hospitalar, e habilitações do CRF (vacinação, prescrição farmacêutica)",
      "Adapte o currículo ao tipo de farmácia: para manipulação, destaque farmacotécnica e RDC 67; para hospitalar, destaque dose unitária, CFT e CCIH"
    ],
    "donts": [
      "Não envie o currículo sem o número do CRF ou com registro suspenso/em débito — isso elimina a candidatura, já que o RT precisa estar regular no conselho",
      "Não use 'atuei em farmácia' de forma genérica: especifique se foi dispensação, manipulação, hospitalar ou indústria, porque são rotinas e exigências legais diferentes",
      "Não confunda atribuições do farmacêutico com as de balconista/atendente — destaque o que é privativo: dispensação assistida, RT, atenção farmacêutica e escrituração de controlados",
      "Não omita conhecimento de SNGPC e Portaria 344/98 se a vaga é de drogaria; é praticamente requisito eliminatório para assumir como RT",
      "Não exagere habilitações que você não tem (ex.: prescrição farmacêutica, aplicação de injetáveis) — são verificáveis no CRF e custam a vaga",
      "Não envie currículo de 3 páginas com cada tarefa operacional; foque nas experiências e responsabilidades regulatórias mais relevantes em 1 a 2 páginas"
    ],
    "faqs": [
      {
        "question": "Preciso colocar o número do CRF no currículo de farmacêutico?",
        "answer": "Sim, e ele deve estar em destaque, logo abaixo ou ao lado do nome, com a sigla do estado (ex.: CRF-RJ 12.345). O registro ativo e regular (sem débito ou suspensão) é exigência legal para exercer a profissão e obrigatório para assumir como Responsável Técnico. A maioria dos empregadores filtra os currículos por ele já na triagem. Se você vai atuar em outro estado, mencione que fará a inscrição secundária ou a transferência junto ao CRF de destino."
      },
      {
        "question": "Como destaco experiência com medicamentos controlados e SNGPC?",
        "answer": "Esse é um dos pontos que mais pesa para vagas de RT em drogaria. Em vez de só citar 'controle de medicamentos', descreva a rotina: escrituração das listas da Portaria 344/98 (A1/A2, B1/B2, C), transmissão mensal do SNGPC, retenção e arquivamento de notificações de receita e receituários, balanço de psicotrópicos (BMPO) e divergência de estoque mantida baixa. Mencionar aprovação em inspeções da Vigilância Sanitária e do CRF, sem autuações, é uma prova forte de domínio do tema."
      },
      {
        "question": "Qual a diferença entre currículo para drogaria, hospital e manipulação?",
        "answer": "São perfis distintos e o recrutador busca o adequado. Para drogaria/farmácia comunitária, destaque dispensação assistida, atenção farmacêutica, SNGPC, RT e gestão de equipe de balcão. Para farmácia hospitalar/clínica, destaque dose unitária, validação de prescrição, conciliação medicamentosa, CFT, CCIH e manipulação de quimioterápicos e nutrição parenteral. Para farmácia de manipulação, destaque farmacotécnica, formas farmacêuticas, controle de qualidade do magistral e a RDC 67/2007. Direcione o título e o resumo para a vaga específica."
      },
      {
        "question": "Atenção farmacêutica conta como diferencial no currículo?",
        "answer": "Sim, e cada vez mais. Com a regulamentação de serviços farmacêuticos (como aferição de pressão e glicemia, prescrição farmacêutica de itens isentos de prescrição médica e seguimento farmacoterapêutico), o farmacêutico que sabe gerar valor clínico e fidelizar pacientes se destaca. Descreva os serviços que você presta, quantos pacientes atende, os resultados (adesão ao tratamento, recompra de receituário contínuo, intervenções em interações medicamentosas) e as habilitações que possui junto ao CRF para esses serviços."
      },
      {
        "question": "Sou recém-formado em Farmácia. Como monto o currículo sem experiência?",
        "answer": "Valorize o estágio supervisionado e os projetos: cite onde estagiou (drogaria, hospital, manipulação, indústria, análises clínicas), a carga horária e as rotinas que acompanhou — dispensação, escrituração de controlados, manipulação, controle de qualidade. Inclua a graduação, o CRF recém-emitido, capacitações (SNGPC, farmacovigilância, atenção farmacêutica) e iniciação científica ou TCC, se relevante. Um resumo objetivo informando a área de interesse e a disposição para assumir RT ajuda o recrutador a te enquadrar rápido."
      },
      {
        "question": "Vale a pena incluir especializações e habilitações do CRF?",
        "answer": "Vale muito, desde que relevantes à vaga. Pós-graduações em Farmácia Clínica, Hospitalar, Oncologia, Manipulação ou Assuntos Regulatórios abrem faixas salariais melhores e diferenciam você. Habilitações registradas no CRF — como prescrição farmacêutica, aplicação de injetáveis/vacinas e plantas medicinais — devem aparecer porque muitas vagas de drogaria já exigem esses serviços. Liste-as em uma seção de formação/certificações, priorizando o que tem relação direta com a descrição da vaga."
      }
    ]
  },
  {
    "slug": "fisioterapeuta",
    "profession": "Fisioterapeuta",
    "metaTitle": "Modelo de Currículo para Fisioterapeuta (2026) | Exemplo Pronto",
    "h1": "Modelo de Currículo para Fisioterapeuta",
    "metaDescription": "Modelo de currículo para Fisioterapeuta com exemplo real: CREFITO, especialidades (ortopédica, respiratória), técnicas, avaliação funcional, palavras-chave de ATS e faixa salarial em R$.",
    "intro": "O currículo de Fisioterapeuta é avaliado em segundos por coordenadores de reabilitação, gestores de clínicas e RH hospitalar, que procuram primeiro pelo número do CREFITO ativo, pela área de atuação (ortopédica, respiratória, neurofuncional, esportiva) e pelo setor em que você já trabalhou. Diferente de listar \"atendia pacientes\", o que abre porta para a entrevista é mostrar avaliação funcional concreta, técnicas que você domina (terapia manual, cinesioterapia, ventilação mecânica) e o desfecho clínico que você gerou — ganho de amplitude de movimento, desmame de ventilador, alta funcional. Este modelo mostra exatamente como estruturar registro profissional, especialidade, técnicas e resultados em um exemplo realista que você pode adaptar à sua vaga.",
    "sampleResume": {
      "name": "Beatriz Carvalho Nogueira",
      "headline": "Fisioterapeuta | CREFITO-3 123.456-F | Ortopédica e Traumato-Funcional",
      "summary": "Fisioterapeuta com 6 anos de experiência em reabilitação ortopédica, traumatológica e pós-operatória, em clínica especializada e ambulatório hospitalar. Especialista em Fisioterapia Traumato-Ortopédica, com domínio de avaliação funcional (goniometria, testes especiais, escala EVA), terapia manual, cinesioterapia e reeducação de marcha. Foco em alta funcional dentro do prazo de reabilitação e em reduzir reincidência de lesões por meio de protocolos de fortalecimento e educação do paciente.",
      "experience": [
        {
          "role": "Fisioterapeuta - Reabilitação Ortopédica",
          "company": "Clínica Movimento Reabilitação",
          "period": "Mar 2021 - Atual",
          "bullets": [
            "Conduzo em média 16 atendimentos individuais por dia em pós-operatório de joelho (LCA, menisco), ombro (manguito rotador) e coluna, com plano terapêutico individualizado a partir de avaliação funcional completa.",
            "Reduzi o tempo médio de retorno ao esporte de pacientes pós-reconstrução de LCA de 9 para 7 meses ao integrar treino proprioceptivo e fortalecimento excêntrico ao protocolo, com testes de hop validando a alta.",
            "Aumentei a adesão ao tratamento de 68% para 89% ao implantar reavaliações quinzenais com metas funcionais claras e exercícios domiciliares prescritos por aplicativo.",
            "Apliquo terapia manual (mobilização articular, liberação miofascial), cinesioterapia, eletroterapia (TENS, FES) e bandagem funcional, registrando evolução em prontuário eletrônico a cada sessão.",
            "Padronizei os testes especiais de avaliação de ombro e joelho da clínica, reduzindo divergência entre avaliadores e melhorando o encaminhamento ao ortopedista."
          ]
        },
        {
          "role": "Fisioterapeuta - Ambulatório de Reabilitação",
          "company": "Hospital Santa Helena (180 leitos)",
          "period": "Fev 2019 - Fev 2021",
          "bullets": [
            "Atendi pacientes de ortopedia e reumatologia em ambulatório, com avaliação de amplitude de movimento (goniometria), força muscular (teste de Oxford) e dor (escala EVA) a cada admissão e alta.",
            "Realizei mobilização precoce e cinesioterapia em pós-operatório de artroplastia de quadril e joelho, contribuindo para alta hospitalar dentro da meta de até 4 dias no protocolo institucional.",
            "Conduzi grupos de fisioterapia para lombalgia crônica (Pilates terapêutico e RPG), com queda média de 3 pontos na escala EVA ao fim de 10 sessões.",
            "Colaborei com a equipe multiprofissional (médico, enfermagem, terapeuta ocupacional) na discussão de casos e na progressão dos planos de reabilitação."
          ]
        }
      ],
      "education": [
        {
          "degree": "Pós-graduação (Especialização) em Fisioterapia Traumato-Ortopédica e Esportiva",
          "institution": "Universidade Cidade de São Paulo (UNICID)",
          "period": "2020 - 2021"
        },
        {
          "degree": "Bacharelado em Fisioterapia",
          "institution": "Pontifícia Universidade Católica de Campinas (PUC-Campinas)",
          "period": "2013 - 2017"
        },
        {
          "degree": "Cursos: Mobilização Neural, Bandagem Funcional e Pilates Clínico",
          "institution": "Cursos livres de aperfeiçoamento",
          "period": "2018 - 2022"
        }
      ],
      "skills": [
        "Avaliação funcional (goniometria, teste de Oxford, escala EVA, testes especiais)",
        "Terapia manual (mobilização articular e liberação miofascial)",
        "Cinesioterapia e exercício terapêutico",
        "Reabilitação pós-operatória ortopédica (LCA, manguito, artroplastia)",
        "Eletroterapia (TENS, FES, ultrassom)",
        "Reeducação de marcha e treino proprioceptivo",
        "Pilates clínico e RPG",
        "Bandagem funcional e mobilização neural",
        "Prontuário eletrônico e evolução clínica",
        "Educação do paciente e prescrição de exercícios domiciliares"
      ]
    },
    "keySkills": [
      "Avaliação funcional (goniometria, perimetria, escala EVA, teste de força muscular)",
      "Testes especiais por segmento (joelho, ombro, coluna)",
      "Terapia manual: mobilização articular e liberação miofascial",
      "Cinesioterapia e exercício terapêutico (fortalecimento, alongamento, propriocepção)",
      "Reabilitação ortopédica e pós-operatória (LCA, manguito rotador, artroplastia)",
      "Fisioterapia respiratória: higiene brônquica, reexpansão pulmonar e desmame ventilatório",
      "Manejo de paciente em ventilação mecânica (UTI)",
      "Eletrotermofototerapia (TENS, FES, ultrassom, laser)",
      "Reeducação de marcha e treino de equilíbrio",
      "Métodos específicos (Pilates clínico, RPG, mobilização neural, Bobath/Kabat na neurofuncional)",
      "Elaboração de plano terapêutico e definição de metas funcionais",
      "Registro em prontuário e evolução clínica baseada em escalas"
    ],
    "atsKeywords": [
      "Fisioterapeuta",
      "CREFITO",
      "reabilitação",
      "fisioterapia ortopédica",
      "fisioterapia respiratória",
      "avaliação funcional",
      "cinesioterapia",
      "terapia manual",
      "ventilação mecânica",
      "UTI",
      "pós-operatório",
      "eletroterapia",
      "goniometria",
      "escala EVA",
      "reeducação de marcha",
      "pilates clínico",
      "RPG",
      "plano terapêutico",
      "equipe multiprofissional",
      "prontuário eletrônico"
    ],
    "salaryNote": "No Brasil (2026), o fisioterapeuta júnior (início de carreira, clínica ou home care) costuma ganhar entre R$ 2.200 e R$ 3.400; pleno (3 a 6 anos, com especialização) fica na faixa de R$ 3.400 a R$ 5.500; e sênior/especialista (UTI, ortopedia avançada, coordenação ou docência) geralmente entre R$ 5.500 e R$ 9.000 ou mais. UTI e fisioterapia hospitalar (com plantões e adicional de insalubridade) e atuação em home care costumam pagar acima da média da clínica ambulatorial. Valores variam por estado, porte da instituição (pública, privada ou filantrópica), regime (CLT, PJ ou autônomo) e por carga horária — muitos contratos seguem o piso e a carga de 30 horas semanais defendidos pela categoria.",
    "dos": [
      "Coloque o número do CREFITO ativo com a regional logo no topo, ao lado do nome (ex.: CREFITO-3 123.456-F) — é a primeira coisa que o recrutador confere.",
      "Deixe explícita a sua especialidade ou área de atuação (ortopédica, respiratória, neurofuncional, esportiva, uroginecológica) em vez de dizer apenas 'fisioterapia geral'.",
      "Cite técnicas e recursos concretos: terapia manual, cinesioterapia, eletroterapia, ventilação mecânica, Pilates clínico, RPG, mobilização neural.",
      "Mostre que você avalia com instrumentos: goniometria, teste de Oxford, escala EVA, testes especiais, índice de Barthel ou Tinetti — avaliação é o que separa o profissional do técnico de exercícios.",
      "Quantifique desfechos clínicos: ganho de amplitude de movimento, redução da dor na EVA, tempo de alta funcional, taxa de desmame de ventilador, adesão ao tratamento.",
      "Liste especializações e cursos com a instituição, e indique disponibilidade para plantões, escala ou home care quando a vaga pedir."
    ],
    "donts": [
      "Não envie o currículo sem o número do CREFITO ou com registro irregular/suspenso — isso elimina a candidatura na triagem.",
      "Não escreva genericamente 'realizava atendimentos de fisioterapia' sem dizer a área, a técnica e o desfecho do tratamento.",
      "Não misture especialidades muito distintas como se dominasse todas; um currículo focado na área da vaga (ex.: respiratória para UTI) passa melhor que um 'faço de tudo'.",
      "Não confunda atuação privativa: prescrição do plano fisioterapêutico, alta e laudo funcional são do fisioterapeuta — não os atribua a estágio ou auxiliar.",
      "Não declare domínio de técnicas que você não pratica (ventilação mecânica, Bobath, ventilação não invasiva) — isso é testado na prática já nos primeiros plantões.",
      "Não use design carregado, colunas duplas ou ícones que quebram a leitura do ATS; prefira layout limpo em uma coluna, em PDF padrão."
    ],
    "faqs": [
      {
        "question": "Preciso colocar o número do CREFITO no currículo?",
        "answer": "Sim, e em destaque, logo abaixo ou ao lado do nome, com a regional e o tipo de registro (ex.: CREFITO-3 123.456-F). O registro ativo é exigência legal para atuar e clínicas e hospitais filtram os currículos por ele já na triagem. Se o seu registro for de uma regional diferente do estado da vaga, mencione que fará a transferência ou a inscrição secundária."
      },
      {
        "question": "Como destaco minha especialidade se atuo em mais de uma área?",
        "answer": "Defina uma especialidade principal no título e no resumo (ortopédica, respiratória, neurofuncional, esportiva, uroginecológica, dermatofuncional) alinhada à vaga, e cite as demais como complementares na experiência. Para uma vaga de UTI, deixe a fisioterapia respiratória e o manejo de ventilação mecânica em primeiro plano; para uma clínica de coluna, destaque ortopedia, RPG e Pilates clínico. Foco vence dispersão."
      },
      {
        "question": "Quais técnicas e recursos vale a pena listar no currículo?",
        "answer": "Liste o que você realmente domina e que a vaga busca: na ortopédica, terapia manual, cinesioterapia, eletroterapia, bandagem funcional e treino proprioceptivo; na respiratória, higiene brônquica, reexpansão pulmonar, VNI e desmame de ventilação mecânica; na neurofuncional, Bobath, Kabat (FNP) e treino de marcha. Sempre vincule a técnica a uma avaliação (goniometria, EVA, escalas) e a um objetivo funcional, não as cite soltas."
      },
      {
        "question": "Como mostro resultado em fisioterapia, já que não 'vendo' nada?",
        "answer": "O resultado da fisioterapia é o ganho funcional, e ele é mensurável. Use as escalas e medidas do dia a dia: 'reduzi a dor de EVA 8 para 3 em 10 sessões', 'recuperei amplitude de flexão de joelho de 70 para 120 graus', 'taxa de desmame de ventilação mecânica de 85% na unidade', 'alta funcional de pós-operatório dentro do protocolo de 4 dias'. Esses números provam efetividade clínica e diferenciam você."
      },
      {
        "question": "Sou recém-formado em fisioterapia. Como monto o currículo sem experiência?",
        "answer": "Valorize os estágios supervisionados: cite os setores em que estagiou (ortopedia, UTI, neuro, cardiorrespiratória, saúde da mulher), a carga horária e as técnicas que aplicou e os instrumentos de avaliação que usou. Inclua a graduação, o CREFITO recém-emitido, cursos de aperfeiçoamento e disponibilidade para plantões ou escala. Um resumo objetivo dizendo a área de interesse e a disposição para aprender os protocolos da instituição ajuda o recrutador a te enquadrar."
      },
      {
        "question": "Vale a pena ter especialização ou título de especialista pelo COFFITO?",
        "answer": "Sim, quando relevante à vaga. A pós-graduação (especialização) na área da vaga aumenta muito as chances e costuma elevar a faixa salarial, principalmente em UTI, ortopedia e neurofuncional. O título de especialista reconhecido pelo COFFITO é um diferencial forte em concursos e instituições de referência. Destaque a especialização que conversa com a vaga antes de cursos genéricos, e mantenha os comprovantes prontos, pois a titulação é conferida."
      }
    ]
  },
  {
    "slug": "psicologo",
    "profession": "Psicólogo",
    "metaTitle": "Modelo de Currículo para Psicólogo (Exemplo Pronto 2026)",
    "h1": "Modelo de Currículo para Psicólogo",
    "metaDescription": "Modelo de currículo para psicólogo com exemplo real, CRP em destaque, abordagem teórica, atuação clínica e organizacional, palavras-chave de ATS, faixa salarial em R$ e dicas para passar na triagem.",
    "intro": "O currículo de psicólogo é analisado por dois olhares diferentes: o RH de uma clínica/empresa, que procura primeiro pelo número do CRP ativo e pela área de atuação, e o sistema de triagem (ATS), que filtra por abordagem teórica, público atendido e ferramentas. Diferente de outras profissões, aqui a sua especialidade NÃO é genérica: um psicólogo clínico TCC, um psicólogo organizacional e um psicólogo escolar têm currículos completamente distintos, mesmo com a mesma graduação. O erro mais comum é escrever \"atendimento psicológico\" sem dizer a abordagem, o público (adulto, infantil, casal, idoso), o tipo de demanda (ansiedade, depressão, luto, dependência) nem o setor. Este modelo mostra como estruturar CRP, abordagem, escuta clínica, sigilo profissional e resultados mensuráveis para que o seu currículo passe na triagem e demonstre maturidade técnica de verdade.",
    "sampleResume": {
      "name": "Beatriz Almeida Nogueira",
      "headline": "Psicóloga Clínica | CRP 06/123456 | Terapia Cognitivo-Comportamental (TCC) | Adultos e Adolescentes",
      "summary": "Psicóloga clínica com 6 anos de experiência em psicoterapia individual de adultos e adolescentes na abordagem Cognitivo-Comportamental (TCC), com formação complementar em Terapia de Aceitação e Compromisso (ACT). Atuação com transtornos de ansiedade, depressão, TOC e processos de luto, conduzindo o atendimento dentro do sigilo profissional e do Código de Ética do Psicólogo. Experiência também em saúde mental no contexto organizacional, com programas de acolhimento e prevenção de burnout. Foco em escuta qualificada, plano terapêutico baseado em evidências e acompanhamento de evolução do paciente.",
      "experience": [
        {
          "role": "Psicóloga Clínica (Consultório e Telepsicologia)",
          "company": "Consultório próprio e Clínica Espaço Equilíbrio",
          "period": "Mar 2021 - Atual",
          "bullets": [
            "Conduzo cerca de 30 sessões semanais de psicoterapia individual (presencial e online via telepsicologia regulamentada pela Resolução CFP 04/2020), com adultos e adolescentes em abordagem TCC.",
            "Elaboro plano terapêutico individualizado com avaliação inicial, definição de objetivos, técnicas baseadas em evidências (reestruturação cognitiva, exposição gradual) e reavaliação periódica de progresso.",
            "Mantenho taxa de adesão à terapia acima de 80% ao longo do primeiro semestre de tratamento, com registro de evolução e prontuário psicológico conforme exigências do CFP.",
            "Realizo escuta clínica e manejo de crise (ideação suicida, ataques de pânico) seguindo protocolos de avaliação de risco e encaminhamento responsável para psiquiatria quando necessário.",
            "Emito documentos psicológicos (atestado, declaração, relatório e laudo) de acordo com a Resolução CFP 06/2019, preservando o sigilo e a finalidade ética de cada documento.",
            "Participo de supervisão clínica mensal e de grupo de estudos em TCC para atualização técnica contínua."
          ]
        },
        {
          "role": "Psicóloga Organizacional (Saúde Mental no Trabalho)",
          "company": "Grupo Vértice - Indústria e Serviços",
          "period": "Fev 2019 - Fev 2021",
          "bullets": [
            "Estruturei o programa de acolhimento psicológico interno, realizando escuta e triagem de cerca de 25 colaboradores/mês e encaminhando casos clínicos para a rede de apoio externa.",
            "Implantei rodas de conversa e ações de prevenção de burnout e estresse ocupacional, reduzindo o absenteísmo por afastamento relacionado à saúde mental em 18% em 12 meses.",
            "Apoiei o RH em entrevistas de devolutiva e em processos de avaliação psicológica para cargos de risco, sempre dentro do sigilo e do consentimento informado.",
            "Conduzi treinamentos de liderança sobre comunicação não violenta e identificação de sinais de sofrimento psíquico para 40 gestores.",
            "Atuei na NR-1 (gestão de riscos psicossociais), mapeando fatores de risco e propondo medidas preventivas em parceria com o SESMT."
          ]
        }
      ],
      "education": [
        {
          "degree": "Pós-graduação (Especialização) em Terapia Cognitivo-Comportamental",
          "institution": "Instituto de Terapia Cognitiva (ITC)",
          "period": "2020 - 2022"
        },
        {
          "degree": "Bacharelado e Formação em Psicologia",
          "institution": "Pontifícia Universidade Católica de São Paulo (PUC-SP)",
          "period": "2013 - 2017"
        },
        {
          "degree": "Formação em Terapia de Aceitação e Compromisso (ACT)",
          "institution": "Curso livre de aperfeiçoamento (120h)",
          "period": "2023"
        }
      ],
      "skills": [
        "Psicoterapia individual em TCC (adultos e adolescentes)",
        "Escuta clínica e manejo de crise (avaliação de risco)",
        "Avaliação psicológica e testes (entrevista, anamnese)",
        "Elaboração de documentos psicológicos (Resolução CFP 06/2019)",
        "Telepsicologia (Resolução CFP 04/2020)",
        "Sigilo profissional e Código de Ética do Psicólogo",
        "Saúde mental no trabalho e prevenção de burnout",
        "Plano terapêutico baseado em evidências",
        "Encaminhamento e trabalho em rede (psiquiatria, RAPS)",
        "Prontuário psicológico e registro de evolução"
      ]
    },
    "keySkills": [
      "Escuta clínica qualificada e empatia",
      "Domínio de uma abordagem teórica (TCC, Psicanálise, Gestalt, ACT, Fenomenológica, Sistêmica)",
      "Avaliação psicológica (anamnese, entrevista, testes psicológicos do SATEPSI)",
      "Elaboração de documentos psicológicos (laudo, relatório, parecer, atestado, declaração)",
      "Sigilo profissional e ética conforme o Código de Ética do Psicólogo",
      "Manejo de crise e avaliação de risco (ideação suicida, surto, pânico)",
      "Telepsicologia regulamentada (Resolução CFP 04/2020)",
      "Construção e acompanhamento de plano terapêutico",
      "Trabalho em equipe multidisciplinar e em rede (RAPS, CAPS, NASF)",
      "Psicologia organizacional: recrutamento, avaliação, clima e saúde mental no trabalho",
      "Atendimento a públicos específicos (infantil, adolescente, adulto, idoso, casal, família)",
      "Registro de prontuário psicológico e guarda de documentos"
    ],
    "atsKeywords": [
      "Psicólogo",
      "Psicóloga",
      "CRP",
      "psicologia clínica",
      "psicologia organizacional",
      "TCC",
      "Terapia Cognitivo-Comportamental",
      "psicanálise",
      "Gestalt-terapia",
      "psicoterapia",
      "avaliação psicológica",
      "testes psicológicos",
      "escuta clínica",
      "saúde mental",
      "atendimento psicológico",
      "telepsicologia",
      "sigilo profissional",
      "Código de Ética",
      "laudo psicológico",
      "anamnese",
      "plano terapêutico",
      "psicologia hospitalar",
      "psicologia escolar",
      "RAPS"
    ],
    "salaryNote": "No Brasil (2026), o salário do psicólogo varia muito por área de atuação, vínculo e região. Em consultório clínico, a remuneração depende do volume de sessões e do valor por sessão (geralmente de R$ 80 a R$ 250+ por atendimento de 50 minutos, variando por cidade e experiência). Em vínculo CLT: psicólogo júnior/início de carreira costuma ganhar de R$ 2.500 a R$ 3.800; pleno entre R$ 3.800 e R$ 6.000; e sênior/especialista (coordenação, perícia, organizacional sênior) de R$ 6.000 a R$ 11.000 ou mais. Concursos públicos (SUS, prefeituras, tribunais, sistema prisional) e a psicologia do tráfego ou perícia tendem a pagar acima da média. Atenção ao piso da categoria definido em lei e às negociações sindicais regionais, já que muitos vínculos respeitam carga de 30h semanais.",
    "dos": [
      "Coloque o número do CRP ativo e a região logo no topo, ao lado do nome (ex.: CRP 06/123456) — é a primeira coisa que o recrutador e o ATS procuram.",
      "Declare sua abordagem teórica de forma clara (TCC, Psicanálise, Gestalt, ACT, Sistêmica) e o público que atende (adulto, adolescente, infantil, casal, idoso) — currículo de psicólogo sem abordagem parece imaturo.",
      "Diferencie a vaga: para clínica, destaque psicoterapia, plano terapêutico e manejo de demandas; para organizacional, destaque recrutamento, avaliação, clima e saúde mental no trabalho.",
      "Cite as demandas e populações com que tem experiência (ansiedade, depressão, luto, dependência química, TEA, vítimas de violência) em vez de só 'atendimento psicológico'.",
      "Mencione domínio de testes do SATEPSI, elaboração de documentos (Resolução CFP 06/2019) e telepsicologia (Resolução CFP 04/2020) quando relevantes à vaga.",
      "Quantifique com discrição e ética: número de atendimentos/semana, redução de absenteísmo, taxa de adesão, número de avaliações realizadas — sem nunca expor dados de pacientes."
    ],
    "donts": [
      "Não envie o currículo sem o número do CRP ou com registro vencido/suspenso — sem CRP ativo a candidatura é eliminada na triagem e o exercício é ilegal.",
      "Não escreva apenas 'realizava atendimentos' sem dizer abordagem, público, demanda e setor — é o erro que mais nivela o currículo por baixo.",
      "Não exponha nomes, casos ou detalhes identificáveis de pacientes; isso fere o sigilo profissional e demonstra desconhecimento ético, eliminando você na hora.",
      "Não invente domínio de abordagem ou de testes psicológicos que você não pratica — é verificado na entrevista técnica e na supervisão.",
      "Não misture o currículo clínico com o organizacional num documento único e genérico; adapte o foco para cada vaga.",
      "Não use linguagem mística ou pseudocientífica (constelação sem base, 'energias', diagnósticos sem respaldo) em vaga clínica formal — isso pesa contra a credibilidade técnica."
    ],
    "faqs": [
      {
        "question": "Preciso colocar o número do CRP no currículo?",
        "answer": "Sim, e em destaque, logo ao lado ou abaixo do nome, com a região (ex.: CRP 06/123456, sendo 06 o conselho de São Paulo). O registro ativo no Conselho Regional de Psicologia é exigência legal para exercer e clínicas, hospitais e RHs filtram os currículos por ele já na triagem. Se você atua em estado diferente do registro, informe que fará a inscrição secundária no CRP local."
      },
      {
        "question": "Devo dizer minha abordagem teórica mesmo se ainda estiver me formando nela?",
        "answer": "Sim. A abordagem (TCC, Psicanálise, Gestalt-terapia, ACT, Fenomenológica-existencial, Sistêmica) é parte central da identidade do psicólogo clínico e o recrutador usa isso para encaixar você na vaga e no público da clínica. Se está em formação, escreva com honestidade: 'abordagem Cognitivo-Comportamental (em formação/especialização)'. O que não funciona é não mencionar abordagem nenhuma — passa a impressão de falta de direcionamento técnico."
      },
      {
        "question": "Como mostro experiência sem ferir o sigilo profissional dos pacientes?",
        "answer": "Descreva o trabalho por tipo de demanda, população e abordagem, nunca por caso individual. Em vez de citar um paciente, escreva 'atendimento de adultos com transtornos de ansiedade e depressão em abordagem TCC' ou 'manejo de crise e avaliação de risco em pronto atendimento'. Use números agregados (sessões/semana, número de avaliações, taxa de adesão) que não identifiquem ninguém. Demonstrar esse cuidado já no currículo sinaliza maturidade ética, que é justamente o que o recrutador da área valoriza."
      },
      {
        "question": "Qual a diferença entre o currículo de psicólogo clínico e o de psicólogo organizacional?",
        "answer": "São perfis distintos. O clínico deve destacar abordagem teórica, psicoterapia, plano terapêutico, avaliação psicológica, manejo de demandas (ansiedade, luto, dependência) e documentos psicológicos. O organizacional deve focar em recrutamento e seleção, avaliação psicológica para cargos, pesquisa de clima, programas de qualidade de vida, saúde mental no trabalho, prevenção de burnout e, cada vez mais, riscos psicossociais (NR-1). Use o título e o resumo para deixar claro qual é o seu foco e adapte os bullets a cada vaga — um currículo genérico que tenta cobrir as duas áreas costuma perder força nas duas."
      },
      {
        "question": "Recém-formado(a): como monto o currículo de psicólogo sem experiência?",
        "answer": "Valorize os estágios supervisionados (eles são experiência real): cite a área (clínica-escola, hospital, organizacional, social/CRAS), a carga horária, a abordagem trabalhada e as demandas atendidas. Inclua o CRP recém-emitido, a abordagem em que está se formando, cursos e supervisões. Estágios em clínica-escola, plantão psicológico, trabalho voluntário em CVV ou projetos sociais contam muito. Um resumo objetivo dizendo a área de interesse, a abordagem e a disposição para supervisão ajuda o recrutador a te enquadrar rapidamente."
      },
      {
        "question": "Quais testes psicológicos e ferramentas vale a pena mencionar?",
        "answer": "Cite apenas testes aprovados pelo SATEPSI (sistema do CFP) que você realmente aplica e corrige — por exemplo, instrumentos de avaliação de personalidade, atenção, inteligência ou específicos para psicologia do tráfego e organizacional. Mencione também domínio de anamnese, entrevista clínica estruturada, elaboração de documentos psicológicos conforme a Resolução CFP 06/2019 e telepsicologia conforme a Resolução CFP 04/2020. Em vaga organizacional, vale citar ferramentas de avaliação por competências e dinâmicas de grupo. Liste só o que domina, pois a aplicação de teste é privativa e auditável."
      },
      {
        "question": "Vale a pena fazer um currículo de uma ou duas páginas?",
        "answer": "Uma página para início e meio de carreira; até duas para sênior com histórico longo, especializações e produção (publicações, supervisões, docência). Priorize as experiências e estágios mais relevantes para a vaga. Detalhes de formação continuada e cursos podem ser resumidos numa seção própria. O recrutador da área de saúde e RH quer identificar em segundos o CRP, a abordagem, a área de atuação e o público atendido — clareza pesa mais que volume."
      }
    ]
  },
  {
    "slug": "nutricionista",
    "profession": "Nutricionista",
    "metaTitle": "Modelo de Currículo para Nutricionista (Exemplo Pronto 2026)",
    "h1": "Modelo de Currículo para Nutricionista",
    "metaDescription": "Modelo de currículo para Nutricionista com exemplo real, CRN, planos alimentares, avaliação nutricional e áreas (clínica e esportiva). Habilidades, palavras-chave de ATS e faixa salarial em R$.",
    "intro": "O currículo de Nutricionista é avaliado em segundos por coordenadores de nutrição, RH de clínicas, hospitais e academias — e a primeira coisa que eles procuram é o número do CRN ativo e a sua área de atuação (clínica, esportiva, UAN/food service, saúde pública ou indústria). Diferente de um currículo genérico de saúde, aqui é preciso provar competência técnica concreta: métodos de avaliação nutricional (antropometria, bioimpedância, dobras cutâneas), prescrição de planos alimentares individualizados e domínio de softwares de nutrição. Este modelo mostra exatamente como estruturar essas informações, com um exemplo completo e realista que você pode adaptar para vagas de nutrição clínica ou esportiva e passar tanto na triagem do ATS quanto no olhar do recrutador.",
    "sampleResume": {
      "name": "Beatriz Almeida Rocha",
      "headline": "Nutricionista | CRN-3 12345/P | Nutrição Clínica e Esportiva",
      "summary": "Nutricionista com 5 anos de experiência em atendimento clínico ambulatorial e acompanhamento de praticantes de atividade física e atletas amadores. Especialista em Nutrição Esportiva, com domínio de avaliação nutricional completa (antropometria, bioimpedância e dobras cutâneas), prescrição de planos alimentares individualizados e periodização nutricional. Foco em adesão do paciente, evolução de composição corporal e resultados mensuráveis em emagrecimento, hipertrofia e controle de comorbidades.",
      "experience": [
        {
          "role": "Nutricionista Clínica",
          "company": "Clínica Vida Integrada (consultório multiprofissional)",
          "period": "Mar 2022 - Atual",
          "bullets": [
            "Realizo cerca de 120 atendimentos clínicos por mês, com avaliação nutricional completa (anamnese alimentar, recordatório 24h, antropometria e bioimpedância) e prescrição de planos alimentares individualizados.",
            "Acompanho pacientes com obesidade, diabetes tipo 2, dislipidemia e hipertensão, alcançando adesão média de 78% ao plano e redução média de 6% do peso corporal em 90 dias.",
            "Estruturei protocolo de retorno e reavaliação a cada 30 dias usando o software Dietbox, elevando a taxa de retenção de pacientes de 55% para 82% em 12 meses.",
            "Atuo em conjunto com endocrinologista e educador físico no manejo de pacientes em pré e pós-cirurgia bariátrica, ajustando aporte proteico e suplementação.",
            "Elaboro materiais de educação alimentar (listas de substituição, receitas e orientações de rótulos) que reduziram dúvidas recorrentes e faltas em retorno."
          ]
        },
        {
          "role": "Nutricionista Esportiva (PJ / parceria com academia)",
          "company": "Performa Studio de Treinamento",
          "period": "Jan 2020 - Fev 2022",
          "bullets": [
            "Atendi em média 40 alunos ativos por mês entre praticantes de musculação, corrida de rua e crossfit, com avaliação de composição corporal por dobras cutâneas (protocolo de 7 dobras) e cálculo de %GC.",
            "Prescrevi planos alimentares com periodização para fases de cutting e bulking, ajustando macronutrientes por fase de treino e calculando necessidades calóricas (GET) individualmente.",
            "Orientei o uso seguro e baseado em evidências de suplementos (whey protein, creatina, cafeína e beta-alanina) conforme posicionamento de diretrizes da área.",
            "Acompanhei 3 atletas amadores de corrida em prova de meia maratona, definindo estratégia de carboidratos pré, intra e pós-treino e protocolo de hidratação.",
            "Conduzi 8 palestras de educação nutricional para os alunos da academia, aumentando a procura por consultas individuais em 35%."
          ]
        }
      ],
      "education": [
        {
          "degree": "Pós-graduação (Especialização) em Nutrição Esportiva e Funcional",
          "institution": "Instituto de Pesquisas Ensino e Gestão em Saúde",
          "period": "2021 - 2022"
        },
        {
          "degree": "Bacharelado em Nutrição",
          "institution": "Pontifícia Universidade Católica de São Paulo (PUC-SP)",
          "period": "2015 - 2019"
        },
        {
          "degree": "Curso de Antropometria e Avaliação da Composição Corporal (ISAK nível 1)",
          "institution": "Curso livre / certificação internacional",
          "period": "2021"
        }
      ],
      "skills": [
        "Avaliação nutricional completa (anamnese, recordatório 24h, antropometria)",
        "Bioimpedância e dobras cutâneas (protocolo de 7 dobras)",
        "Prescrição de planos alimentares individualizados",
        "Cálculo de GET, macronutrientes e necessidades nutricionais",
        "Nutrição clínica (obesidade, diabetes, dislipidemia, HAS)",
        "Nutrição esportiva e periodização nutricional",
        "Suplementação baseada em evidências",
        "Softwares de nutrição (Dietbox, DietWin, Webdiet, AvaNutri)",
        "Educação alimentar e orientação de rótulos",
        "Atendimento humanizado e estratégias de adesão"
      ]
    },
    "keySkills": [
      "Avaliação nutricional completa (anamnese alimentar e recordatório 24h)",
      "Antropometria: peso, altura, circunferências, dobras cutâneas e IMC",
      "Bioimpedância e análise de composição corporal (%GC, massa magra)",
      "Cálculo de gasto energético total (GET) e necessidades de macro e micronutrientes",
      "Prescrição de planos alimentares individualizados e dietéticos",
      "Nutrição clínica: obesidade, diabetes, dislipidemia, hipertensão, doença renal e gastrointestinal",
      "Nutrição esportiva: periodização, cutting/bulking e estratégias pré e pós-treino",
      "Suplementação nutricional baseada em evidências",
      "Conduta em pré e pós-operatório de cirurgia bariátrica",
      "Softwares de nutrição (Dietbox, DietWin, Webdiet, AvaNutri)",
      "Educação nutricional e orientação sobre rótulos de alimentos",
      "Conhecimento de UAN/food service e legislação sanitária (RDC e boas práticas) quando aplicável",
      "Atendimento humanizado e técnicas de adesão ao tratamento",
      "Conduta ética conforme o Código de Ética do Nutricionista (CFN)"
    ],
    "atsKeywords": [
      "Nutricionista",
      "CRN",
      "avaliação nutricional",
      "plano alimentar",
      "antropometria",
      "bioimpedância",
      "dobras cutâneas",
      "composição corporal",
      "nutrição clínica",
      "nutrição esportiva",
      "prescrição dietética",
      "recordatório 24h",
      "macronutrientes",
      "suplementação",
      "obesidade",
      "diabetes",
      "educação alimentar",
      "Dietbox",
      "cirurgia bariátrica",
      "UAN"
    ],
    "salaryNote": "No Brasil (2026), nutricionista júnior (início de carreira, recém-formado) costuma ganhar entre R$ 2.200 e R$ 3.200; pleno (com especialização e 2 a 5 anos de experiência) fica na faixa de R$ 3.200 a R$ 5.000; e sênior/especialista ou coordenador de nutrição (UAN, clínica de referência, hospital ou liderança de equipe) geralmente entre R$ 5.000 e R$ 8.500 ou mais. Em consultório próprio ou atendimento particular, a renda varia muito conforme volume de pacientes e valor da consulta (de R$ 120 a R$ 400+ por atendimento em grandes capitais). Áreas como nutrição esportiva de alta performance, indústria de alimentos e gestão de UAN tendem a pagar acima da média. Valores variam por região, porte e tipo de instituição (clínica, hospital, academia, indústria ou serviço público).",
    "dos": [
      "Coloque o número do CRN ativo com a região e a categoria logo no topo, ao lado do nome (ex.: CRN-3 12345/P) — é a primeira coisa que o recrutador confere.",
      "Deixe explícita a sua área de atuação (clínica, esportiva, UAN/food service, saúde pública, indústria) no headline e no resumo, porque cada vaga busca um perfil diferente.",
      "Cite métodos de avaliação concretos: antropometria, bioimpedância, dobras cutâneas (e o protocolo usado), recordatório 24h e anamnese alimentar.",
      "Quantifique resultados sempre que possível: número de atendimentos/mês, taxa de adesão ao plano, evolução de peso ou de composição corporal e retenção de pacientes.",
      "Nomeie os softwares de nutrição que você domina (Dietbox, DietWin, Webdiet, AvaNutri) — recrutadores e ATS filtram por esses nomes.",
      "Destaque especializações e cursos alinhados à vaga (Nutrição Esportiva, Clínica, Materno-Infantil, Funcional) antes de cursos genéricos."
    ],
    "donts": [
      "Não envie o currículo sem o número do CRN ou com registro vencido/suspenso — sem ele você não pode atuar e a candidatura é eliminada na triagem.",
      "Não escreva apenas 'atendia pacientes' ou 'montava dietas' sem dizer quais condições tratava, quais métodos usava e qual resultado gerou.",
      "Não use o mesmo currículo genérico para uma vaga clínica, uma de academia e uma de UAN — destaque a experiência que conversa com cada área.",
      "Não prometa ou cite resultados milagrosos de emagrecimento; o tom deve ser técnico, ético e baseado em evidências, como pede o Código de Ética do Nutricionista.",
      "Não confunda atribuições: 'prescrição de plano alimentar' e 'avaliação nutricional' são privativas do nutricionista — use os termos corretos e não invente competências (ex.: prescrição de medicamentos).",
      "Não exagere o domínio de métodos que você não pratica (ex.: dizer que faz bioimpedância octapolar sem nunca ter operado) — isso é checado na entrevista técnica."
    ],
    "faqs": [
      {
        "question": "Preciso colocar o número do CRN no currículo de nutricionista?",
        "answer": "Sim, e ele deve estar em destaque, logo abaixo ou ao lado do nome, com a região e a categoria (ex.: CRN-3 12345/P, sendo o 3 a região de São Paulo e Mato Grosso do Sul). O registro ativo no Conselho Regional de Nutricionistas é exigência legal para exercer a profissão, e clínicas e hospitais filtram os currículos por ele já na triagem. Se você for atuar em outro estado, mencione que fará a inscrição secundária na região correspondente."
      },
      {
        "question": "Qual a diferença entre um currículo de nutrição clínica e um de nutrição esportiva?",
        "answer": "O de nutrição clínica deve destacar manejo de comorbidades (obesidade, diabetes, dislipidemia, hipertensão, doença renal, distúrbios gastrointestinais), conduta em ambulatório/hospital, terapia nutricional e trabalho multiprofissional. O de nutrição esportiva foca em avaliação de composição corporal, periodização nutricional (cutting/bulking), cálculo de macronutrientes por fase de treino, estratégias pré e pós-treino, hidratação e suplementação baseada em evidências. Direcione o headline, o resumo e os bullets para a área da vaga em vez de um currículo 'faço de tudo'."
      },
      {
        "question": "Como mostro experiência em avaliação nutricional sem ficar genérico?",
        "answer": "Seja específico sobre os métodos e o que você faz com eles. Em vez de 'fazia avaliação dos pacientes', escreva 'realizo avaliação completa com anamnese alimentar, recordatório 24h, antropometria e bioimpedância, prescrevendo plano individualizado a partir do cálculo de GET e macronutrientes'. Cite o protocolo de dobras cutâneas que usa (ex.: 7 dobras) e o software onde registra a evolução. Isso prova domínio técnico real, não apenas a tarefa."
      },
      {
        "question": "Tenho pouca experiência. Como montar o currículo de nutricionista recém-formado?",
        "answer": "Valorize o estágio supervisionado e as práticas obrigatórias: cite os campos onde estagiou (ambulatório, UAN/cozinha hospitalar, saúde pública, clínica), a carga horária e os procedimentos que acompanhou ou realizou (avaliações antropométricas, cálculo de dietas, acompanhamento de prescrição dietoterápica). Inclua a graduação, o CRN recém-emitido, cursos complementares (antropometria, nutrição esportiva, segurança de alimentos) e um resumo objetivo dizendo sua área de interesse e disponibilidade. Trabalhos de TCC e projetos de extensão relevantes também contam."
      },
      {
        "question": "Vale a pena listar os softwares de nutrição que eu uso?",
        "answer": "Sim. Ferramentas como Dietbox, DietWin, Webdiet e AvaNutri agilizam cálculo de dietas, prescrição e acompanhamento, e muitas clínicas já trabalham com uma delas. Citar o nome exato ajuda o currículo a passar nos filtros de triagem (ATS) e mostra que você está pronto para produzir desde o primeiro dia. Se você usa um software específico no consultório, mencione, e se domina mais de um, liste — isso reduz o tempo de adaptação na nova vaga."
      },
      {
        "question": "Como destacar especializações e cursos no currículo de nutrição?",
        "answer": "Crie uma seção de Formação separando a graduação, a pós-graduação/especialização (ex.: Nutrição Esportiva, Clínica, Funcional, Materno-Infantil, Saúde Pública) e uma seção de cursos/certificações complementares (antropometria/ISAK, fitoterapia, segurança de alimentos, atendimento em bariátrica). Priorize o que tem relação direta com a vaga: para uma academia, destaque a especialização em Nutrição Esportiva e a certificação em avaliação de composição corporal antes de cursos genéricos. Sempre inclua instituição e período."
      }
    ]
  },
  {
    "slug": "porteiro",
    "profession": "Porteiro",
    "metaTitle": "Modelo de Currículo para Porteiro 2026 | Exemplo Pronto e Dicas",
    "h1": "Modelo de Currículo para Porteiro (Condomínio, Comercial e Noturno)",
    "metaDescription": "Modelo de currículo de Porteiro pronto para preencher: controle de acesso, segurança, atendimento, sistemas de monitoramento e registro. Exemplo real, palavras-chave de ATS e faixa salarial em R$.",
    "intro": "O currículo de Porteiro é lido em poucos segundos por síndicos, administradoras de condomínio e RHs de empresas de portaria e facilities. Eles procuram primeiro por confiabilidade, disponibilidade de horário (escala 12x36, plantão noturno, fins de semana) e experiência concreta com controle de acesso. Não basta dizer que foi \"responsável pela portaria\": o que pesa é mostrar que você sabe identificar visitantes, operar interfone e sistemas de monitoramento (CFTV), registrar entradas e saídas em livro de ocorrências e agir com calma em situações de risco. Este modelo mostra exatamente como estruturar essas informações, com um exemplo real de Porteiro de condomínio que você pode adaptar para portaria comercial, noturna ou de empresa.",
    "sampleResume": {
      "name": "José Carlos Pereira da Silva",
      "headline": "Porteiro | Controle de Acesso e Monitoramento CFTV | Escala 12x36 e Noturna",
      "summary": "Porteiro com 8 anos de experiência em condomínios residenciais de grande porte e portaria comercial. Domínio de controle de acesso de moradores, visitantes e prestadores, operação de sistemas de monitoramento (CFTV) e interfone, e registro detalhado em livro de ocorrências. Pontual, com histórico sem faltas em escala 12x36 e plantão noturno, e referências comprovadas de síndicos. Foco em atendimento cordial aos moradores e em seguir rigorosamente as normas de segurança e o regimento interno.",
      "experience": [
        {
          "role": "Porteiro - Condomínio Residencial",
          "company": "Condomínio Edifício Jardim das Acácias (180 unidades)",
          "period": "Abr 2020 - Atual",
          "bullets": [
            "Realizo o controle de acesso de moradores, visitantes, prestadores de serviço e entregadores, conferindo documentos e confirmando autorização por interfone antes de liberar a entrada",
            "Opero o sistema de monitoramento por câmeras (CFTV) com 24 pontos, identificando movimentações suspeitas e acionando a portaria ou a empresa de segurança quando necessário",
            "Mantenho o livro de ocorrências e o controle de correspondências e encomendas atualizados, reduzindo reclamações de extravio de encomendas em cerca de 40% após implantar checklist de retirada com assinatura",
            "Controlo a entrada e saída de veículos pela cancela, o acesso à garagem e a liberação de portões sociais, garantindo que nenhum portão fique aberto simultaneamente (controle de eclusa)",
            "Atendo telefone e interfone com cordialidade, oriento visitantes e presto suporte a moradores em emergências, acionando síndico, zelador, bombeiros ou SAMU conforme o protocolo do condomínio"
          ]
        },
        {
          "role": "Porteiro - Portaria Comercial (Plantão Noturno)",
          "company": "Empresa de Portaria e Facilities Vigilância Total",
          "period": "Jun 2017 - Mar 2020",
          "bullets": [
            "Atuei em portaria de edifício comercial em escala 12x36 noturna, controlando o acesso de funcionários, terceirizados e prestadores fora do horário comercial",
            "Realizei rondas internas no início e no fim do plantão, conferindo portas, janelas, luzes e equipamentos, e registrando todas as ocorrências no livro de plantão",
            "Operei catraca eletrônica e leitor de crachá/biometria, liberando acessos e cadastrando visitantes no sistema de controle de acesso",
            "Acompanhei a entrada e saída de cargas e a movimentação de veículos na doca, conferindo notas e autorizações de retirada de materiais",
            "Mantive comunicação constante com a central de monitoramento via rádio, seguindo os procedimentos de segurança e o POP da empresa"
          ]
        }
      ],
      "education": [
        {
          "degree": "Ensino Médio Completo",
          "institution": "E.E. Professor Antônio Gomes",
          "period": "Concluído em 2015"
        },
        {
          "degree": "Curso de Porteiro e Controle de Acesso (40h)",
          "institution": "SENAC / Centro de Formação Profissional",
          "period": "2017"
        },
        {
          "degree": "Curso de Prevenção e Combate a Incêndio e Primeiros Socorros (Brigada)",
          "institution": "Corpo de Bombeiros / Instituição de treinamento",
          "period": "2021"
        }
      ],
      "skills": [
        "Controle de acesso (moradores, visitantes e prestadores)",
        "Operação de CFTV (monitoramento por câmeras)",
        "Interfone, telefone e rádio comunicador",
        "Livro de ocorrências e controle de correspondências",
        "Catraca, cancela e portão eletrônico",
        "Leitor de crachá e biometria",
        "Atendimento ao público e relacionamento com moradores",
        "Prevenção e combate a incêndio (brigada)",
        "Primeiros socorros",
        "Pontualidade e disponibilidade para escala 12x36 e noturna"
      ]
    },
    "keySkills": [
      "Controle de acesso de moradores, visitantes e prestadores",
      "Operação de sistemas de monitoramento por câmeras (CFTV)",
      "Uso de interfone, telefone e rádio comunicador",
      "Preenchimento de livro de ocorrências e controle de portaria",
      "Controle de correspondências e encomendas",
      "Operação de catraca, cancela, portão eletrônico e biometria",
      "Atendimento cordial e relacionamento com moradores e visitantes",
      "Postura de segurança e identificação de situações suspeitas",
      "Noções de prevenção e combate a incêndio (brigada)",
      "Primeiros socorros e acionamento de emergências (bombeiros, SAMU)",
      "Conhecimento do regimento interno e das normas do condomínio",
      "Disponibilidade para escala 12x36, plantão noturno e fins de semana"
    ],
    "atsKeywords": [
      "Porteiro",
      "Porteiro de condomínio",
      "Porteiro noturno",
      "Controlador de acesso",
      "Controle de acesso",
      "Portaria",
      "CFTV",
      "Monitoramento",
      "Livro de ocorrências",
      "Interfone",
      "Atendimento ao público",
      "Escala 12x36",
      "Plantão noturno",
      "Segurança patrimonial",
      "Cancela",
      "Catraca",
      "Biometria",
      "Controle de encomendas",
      "Prevenção a incêndio",
      "Primeiros socorros"
    ],
    "salaryNote": "No Brasil (2026), o salário de Porteiro costuma seguir o piso da categoria, que varia por estado e convenção coletiva (SEAC e sindicatos de empregados em edifícios). Em geral, o porteiro iniciante fica na faixa de R$ 1.500 a R$ 1.900; o pleno, com experiência e domínio de CFTV e controle de acesso, entre R$ 1.900 e R$ 2.600; e o sênior ou líder de portaria, em condomínios de alto padrão e portaria comercial, pode chegar a R$ 2.600 a R$ 3.500. Plantão noturno costuma ter adicional noturno (mínimo de 20% sobre a hora), e há ainda os benefícios de convenção (vale-transporte, vale-alimentação, cesta básica). Sempre confira o piso vigente na convenção coletiva do seu estado.",
    "dos": [
      "Deixe claro no topo sua disponibilidade de horário (escala 12x36, plantão noturno, fins de semana e feriados) — é um dos primeiros filtros de síndicos e administradoras.",
      "Cite os sistemas e equipamentos que você opera: CFTV, interfone, catraca, cancela, portão eletrônico, leitor de crachá e biometria.",
      "Mostre que entende a rotina completa: controle de acesso, conferência de documentos, registro no livro de ocorrências e controle de correspondências.",
      "Inclua cursos curtos de valor (porteiro/controle de acesso, brigada de incêndio, primeiros socorros) — eles diferenciam você na triagem.",
      "Quantifique quando possível: número de unidades do condomínio, pontos de câmera, redução de reclamações de encomendas, anos sem faltas.",
      "Liste referências de síndicos ou supervisores anteriores e mantenha o telefone atualizado — confiabilidade é o critério número um para portaria."
    ],
    "donts": [
      "Não escreva apenas \"responsável pela portaria\" sem detalhar controle de acesso, monitoramento e registro de ocorrências.",
      "Não omita lacunas de emprego sem explicação; em portaria, a estabilidade e a ausência de faltas pesam muito.",
      "Não deixe de informar disponibilidade de horário — currículo de porteiro sem essa informação costuma ser descartado.",
      "Não confunda a função de porteiro com a de vigilante: vigilante exige curso de formação e registro na Polícia Federal; se você não é vigilante, não use o termo.",
      "Não use design rebuscado, fotos informais ou várias cores; prefira layout limpo em uma coluna, fácil de ler e de passar no ATS.",
      "Não exagere nem invente experiência com sistemas que você nunca operou — síndicos validam isso já na entrevista ou no período de experiência."
    ],
    "faqs": [
      {
        "question": "Preciso de algum curso ou registro para trabalhar como porteiro?",
        "answer": "Para porteiro não há exigência legal de registro como existe para vigilante (que precisa de curso de formação e registro na Polícia Federal). Basta, em geral, ensino fundamental ou médio. Porém, cursos curtos de Porteiro/Controle de Acesso, Brigada de Incêndio e Primeiros Socorros fazem muita diferença na triagem e mostram preparo para emergências."
      },
      {
        "question": "Qual a diferença entre porteiro, controlador de acesso e vigilante no currículo?",
        "answer": "O porteiro atua na recepção e no controle de entrada de pessoas e veículos, com foco em atendimento. O controlador de acesso é um termo próximo, comum em empresas e portarias comerciais. Já o vigilante é profissional de segurança privada com porte autorizado e registro na Polícia Federal. Use no seu currículo apenas o termo que corresponde à sua formação e experiência reais."
      },
      {
        "question": "Como mostro experiência se nunca trabalhei formalmente como porteiro?",
        "answer": "Aproveite experiências próximas: zelador, recepcionista, controlador de acesso, atendente, ou até funções em que você lidava com atendimento ao público e responsabilidade. Destaque pontualidade, idoneidade e disponibilidade de horário. Some um curso de porteiro ou de brigada de incêndio, que sinaliza preparo para a função e ajuda a compensar a falta de experiência específica."
      },
      {
        "question": "Vale a pena colocar a disponibilidade de horário e escala no currículo?",
        "answer": "Sim, é essencial. Síndicos e administradoras precisam preencher escalas 12x36, plantões noturnos e fins de semana. Informar logo no resumo que você tem disponibilidade para essas escalas aumenta muito suas chances, porque resolve de imediato a principal dúvida de quem contrata para portaria."
      },
      {
        "question": "Devo incluir referências de síndicos ou supervisores anteriores?",
        "answer": "Sim. Em portaria, a confiança é o fator decisivo, já que você lida com as chaves, o acesso e a segurança de moradores. Referências de síndicos, administradoras ou supervisores com telefone atualizado dão credibilidade e costumam ser checadas. Avise os contatos antes de colocá-los no currículo."
      },
      {
        "question": "Como destaco que sei operar sistemas de monitoramento e controle de acesso?",
        "answer": "Crie uma seção de habilidades e cite os equipamentos pelo nome: CFTV (câmeras), interfone, rádio, catraca, cancela, portão eletrônico, leitor de crachá e biometria. Nos bullets de experiência, mostre o uso prático — por exemplo, monitorar X pontos de câmera, cadastrar visitantes no sistema ou registrar ocorrências no livro de plantão. Isso prova domínio real, e não apenas teórico."
      }
    ]
  },
  {
    "slug": "vigilante",
    "profession": "Vigilante",
    "metaTitle": "Modelo de Currículo para Vigilante 2026 | Exemplo Pronto e Dicas",
    "h1": "Modelo de Currículo para Vigilante (Segurança Patrimonial)",
    "metaDescription": "Modelo de currículo para vigilante pronto para adaptar: Curso de Formação, reciclagem em dia, CNV, segurança patrimonial, ronda e prevenção. Exemplo real, palavras-chave de ATS e faixa salarial em R$.",
    "intro": "O currículo de vigilante é avaliado em segundos pelo RH de empresas de segurança privada e por supervisores operacionais, que procuram primeiro por três coisas: Curso de Formação de Vigilante concluído, reciclagem bienal em dia e disponibilidade para escala 12x36. Diferente de outras áreas, aqui a documentação é eliminatória — sem CFV válido e reciclagem dentro do prazo, o candidato sequer passa da triagem, porque a empresa precisa cumprir as exigências da Polícia Federal (Lei 7.102/83 e Portaria 3.233/2012-DG/DPF). Este modelo mostra exatamente como organizar formação, cursos de extensão (escolta, segurança pessoal, grandes eventos), postos em que você atuou e resultados concretos de prevenção, com um exemplo real que você pode adaptar para vagas de vigilante patrimonial, de evento ou de ronda.",
    "sampleResume": {
      "name": "Carlos Eduardo Nascimento Silva",
      "headline": "Vigilante Patrimonial | Curso de Formação e Reciclagem em dia | Escolta Armada",
      "summary": "Vigilante com 7 anos de experiência em segurança patrimonial de condomínios comerciais, indústria e instituição bancária. Curso de Formação de Vigilante concluído e reciclagem bienal sempre em dia, com extensões em Segurança Pessoal Privada e Escolta Armada. Atuação em controle de acesso, ronda preventiva, operação de CFTV e elaboração de relatórios de ocorrência. Histórico sem ocorrências disciplinares, com postura preventiva e foco em redução de incidentes e perdas patrimoniais.",
      "experience": [
        {
          "role": "Vigilante Patrimonial - Posto Industrial",
          "company": "Vanguarda Segurança Privada Ltda (cliente: indústria do setor químico)",
          "period": "Mar 2021 - Atual",
          "bullets": [
            "Responsável pelo controle de acesso de pessoas, veículos e cargas em planta industrial com fluxo médio de 350 colaboradores e 80 caminhões por turno, conferindo crachás, notas fiscais e lacres.",
            "Execução de rondas preventivas a cada 2 horas em perímetro de 14 mil m², registrando pontos de checagem em bastão eletrônico de ronda e identificando 3 falhas de cerca e iluminação que foram corrigidas pela engenharia.",
            "Operação de central de monitoramento com 32 câmeras de CFTV e sistema de alarme perimetral, acionando o procedimento de emergência em 2 tentativas de invasão noturna sem perdas materiais.",
            "Elaboração diária de Relatório de Ocorrência (RO) e Livro de Registro de Ocorrências, com comunicação imediata ao supervisor e à coordenação do cliente.",
            "Atuação em escala 12x36 com pontualidade integral em 24 meses e zero faltas não justificadas, reconhecido como destaque do posto em 2023."
          ]
        },
        {
          "role": "Vigilante de Ronda e Controle de Acesso",
          "company": "Fortaleza Vigilância e Segurança",
          "period": "Fev 2018 - Fev 2021",
          "bullets": [
            "Controle de acesso e portaria em condomínio comercial com 12 lojas e estacionamento de 200 vagas, realizando triagem de visitantes e revista de bolsas conforme procedimento operacional padrão (POP).",
            "Rondas preventivas internas e externas a pé, com verificação de portas, extintores, saídas de emergência e pontos cegos, reduzindo furtos em estacionamento após reorganização do roteiro de ronda.",
            "Atendimento e orientação ao público, prestando primeiros socorros básicos em 1 ocorrência de mal súbito até a chegada do SAMU.",
            "Apoio na evacuação durante simulado de incêndio (brigada de emergência), conduzindo o público às áreas de encontro conforme plano de abandono."
          ]
        }
      ],
      "education": [
        {
          "degree": "Reciclagem de Vigilante (válida até 2027)",
          "institution": "Escola de Formação credenciada pela Polícia Federal",
          "period": "2025"
        },
        {
          "degree": "Extensão em Segurança Pessoal Privada e Escolta Armada",
          "institution": "Escola de Formação credenciada pela Polícia Federal",
          "period": "2022"
        },
        {
          "degree": "Curso de Formação de Vigilante (CFV)",
          "institution": "Escola de Formação credenciada pela Polícia Federal",
          "period": "2017"
        },
        {
          "degree": "Ensino Médio Completo",
          "institution": "E.E. Professor João Ribeiro",
          "period": "2013 - 2015"
        }
      ],
      "skills": [
        "Controle de acesso de pessoas, veículos e cargas",
        "Ronda preventiva e patrulhamento de perímetro",
        "Operação de CFTV e central de monitoramento",
        "Elaboração de Relatório de Ocorrência (RO)",
        "Revista pessoal e de veículos (POP)",
        "Prevenção de perdas e segurança patrimonial",
        "Procedimentos de emergência e evacuação",
        "Primeiros socorros e combate a princípio de incêndio",
        "Uso e manuseio de armamento (curso armado)",
        "Comunicação via rádio e relacionamento com o cliente"
      ]
    },
    "keySkills": [
      "Curso de Formação de Vigilante (CFV) concluído",
      "Reciclagem bienal em dia (obrigatória por lei)",
      "Carteira Nacional de Vigilante (CNV) válida",
      "Controle de acesso de pessoas, veículos e cargas",
      "Ronda preventiva e patrulhamento de perímetro",
      "Operação de CFTV e central de monitoramento",
      "Elaboração de relatórios e livro de ocorrências",
      "Revista pessoal e procedimentos de busca conforme POP",
      "Prevenção de perdas e segurança patrimonial",
      "Procedimentos de emergência, evacuação e combate a incêndio",
      "Primeiros socorros básicos",
      "Disponibilidade para escala 12x36 e turnos noturnos",
      "Boa comunicação e postura de atendimento ao público",
      "Cursos de extensão (escolta armada, segurança pessoal, grandes eventos)"
    ],
    "atsKeywords": [
      "Vigilante",
      "Vigilante Patrimonial",
      "Segurança Privada",
      "Curso de Formação de Vigilante",
      "Reciclagem de Vigilante",
      "Carteira Nacional de Vigilante",
      "CNV",
      "Controle de Acesso",
      "Ronda",
      "Ronda Preventiva",
      "CFTV",
      "Monitoramento",
      "Segurança Patrimonial",
      "Prevenção de Perdas",
      "Relatório de Ocorrência",
      "Escala 12x36",
      "Vigilante Armado",
      "Escolta Armada",
      "Portaria",
      "Brigada de Incêndio"
    ],
    "salaryNote": "No Brasil (2026), o piso salarial do vigilante é definido por convenção coletiva de cada estado/sindicato, então os valores variam por região. Como referência de mercado: vigilante patrimonial em início de carreira costuma ganhar entre R$ 1.600 e R$ 2.100 de salário-base; profissionais com experiência e função consolidada ficam na faixa de R$ 2.100 a R$ 2.800; e funções com adicional ou maior responsabilidade — vigilante armado, escolta armada, segurança pessoal (escolta de executivos) e líder/encarregado de posto — chegam de R$ 2.800 a R$ 4.500 ou mais. Sobre o salário-base incidem adicionais relevantes: adicional noturno, periculosidade (geralmente 30% para função armada), horas extras de escala e, em muitos casos, risco de vida e gratificação de função, o que pode elevar bastante a remuneração final. Sempre confira a convenção coletiva vigente do seu estado.",
    "dos": [
      "Coloque no topo, logo abaixo do nome, o status da sua documentação: Curso de Formação concluído e reciclagem em dia (com o ano de validade) — é o primeiro filtro do RH de segurança.",
      "Informe se você é vigilante armado ou desarmado e cite cursos de extensão (escolta armada, segurança pessoal privada, grandes eventos, transporte de valores) — eles abrem vagas mais bem pagas.",
      "Deixe explícita a disponibilidade para escala 12x36, turno noturno e o local/região onde pode atuar; a maioria das vagas é eliminada por incompatibilidade de escala ou deslocamento.",
      "Quantifique resultados de prevenção: tentativas de invasão contidas, redução de furtos, número de câmeras monitoradas, fluxo de pessoas e veículos controlado por turno.",
      "Cite os tipos de posto em que já atuou (industrial, bancário, condomínio comercial, hospitalar, evento) e os procedimentos que domina: controle de acesso, ronda, CFTV, RO, revista.",
      "Destaque conduta e confiabilidade: tempo no mesmo posto, zero faltas, ausência de ocorrências disciplinares e elogios do cliente — atributos decisivos nessa função.",
      "Inclua cursos complementares úteis: primeiros socorros, brigada de incêndio, prevenção e combate a incêndio e direção defensiva (se a vaga exige CNH)."
    ],
    "donts": [
      "Não envie currículo com a reciclagem vencida sem mencionar que já está providenciando a renovação — reciclagem em atraso é motivo direto de descarte.",
      "Não omita se o curso é armado ou desarmado; deixar isso vago faz o recrutador presumir o pior e descartar para vagas armadas.",
      "Não descreva sua função apenas como 'fazia segurança' ou 'cuidava do local'; especifique controle de acesso, ronda, monitoramento e os procedimentos executados.",
      "Não invente número de CNV, validade de reciclagem ou cursos que não possui — a empresa valida a documentação na Polícia Federal antes da contratação.",
      "Não deixe lacunas longas sem explicação no histórico; em segurança, a checagem de antecedentes e de idoneidade é rigorosa.",
      "Não use foto inadequada, design colorido ou layout em colunas complexas; prefira um currículo limpo, sóbrio e de fácil leitura em uma coluna.",
      "Não esqueça de listar a região e a disponibilidade de horário — currículos sem essa informação costumam ficar de fora de postos com escala fixa."
    ],
    "faqs": [
      {
        "question": "Preciso colocar a reciclagem e o Curso de Formação no currículo de vigilante?",
        "answer": "Sim, e logo no topo. O Curso de Formação de Vigilante e a reciclagem (obrigatória a cada 2 anos por lei) são pré-requisitos eliminatórios. O RH de segurança procura por isso antes de qualquer experiência. Informe o ano de conclusão do curso e a validade da reciclagem — por exemplo, 'Reciclagem em dia, válida até 2027'. Sem essa informação clara, seu currículo provavelmente não avança na triagem."
      },
      {
        "question": "Qual a diferença entre vigilante armado e desarmado no currículo?",
        "answer": "É uma das informações mais importantes para o recrutador, porque define para quais postos você pode ser alocado. Vigilante armado fez o curso de formação na modalidade armada e pode atuar em postos com armamento (bancos, transporte de valores, escolta), que costumam pagar adicional de periculosidade. Deixe explícito qual é o seu caso. Se você tem cursos de extensão como escolta armada ou segurança pessoal, destaque-os, pois ampliam as oportunidades e a remuneração."
      },
      {
        "question": "Como descrever experiência se eu trabalhei em postos diferentes pela mesma empresa de segurança?",
        "answer": "Na segurança privada é comum o vigilante ser remanejado entre clientes/postos pela mesma contratante. Liste a empresa de segurança como empregadora e, dentro dela, descreva os tipos de posto onde atuou (industrial, condomínio, banco, hospital, evento) e o que fazia em cada um. Assim o recrutador entende a variedade da sua experiência sem parecer que você trocou de emprego o tempo todo. Destaque o tempo total e a estabilidade."
      },
      {
        "question": "O que colocar no currículo se eu acabei de fazer o Curso de Formação e não tenho experiência?",
        "answer": "Foque na documentação e nas competências. Coloque em destaque o Curso de Formação recém-concluído, a modalidade (armado/desarmado), cursos de extensão e complementares (primeiros socorros, brigada de incêndio). Mencione experiências anteriores que demonstram responsabilidade e atendimento ao público — porteiro, controlador de acesso, atendimento, forças armadas (se serviu). Deixe clara a disponibilidade para escala 12x36 e turno noturno, que pesa muito para a primeira vaga."
      },
      {
        "question": "Vale a pena citar que servi nas Forças Armadas ou trabalhei como porteiro?",
        "answer": "Sim. Tempo de serviço militar e experiência como porteiro, controlador de acesso ou monitor são muito valorizados em vagas de vigilante, pois mostram disciplina, postura, controle de acesso e familiaridade com rotinas de segurança. Descreva as atividades de forma objetiva, ligando-as ao que se faz na função: rondas, controle de entrada/saída, atendimento ao público e cumprimento de procedimentos."
      },
      {
        "question": "Devo incluir disponibilidade de escala e região no currículo?",
        "answer": "Sim, é decisivo. A maioria das vagas de vigilante tem escala fixa (geralmente 12x36) e posto em local específico, então o recrutador filtra cedo por disponibilidade e deslocamento. Informe que você está disponível para escala 12x36, turnos diurno e noturno, e a região/cidade onde pode atuar. Se tiver CNH, mencione, pois alguns postos exigem condução de viatura ou ronda motorizada."
      }
    ]
  },
  {
    "slug": "auxiliar-de-limpeza",
    "profession": "Auxiliar de Limpeza",
    "metaTitle": "Modelo de Currículo para Auxiliar de Limpeza (Exemplo Pronto 2026)",
    "h1": "Modelo de Currículo para Auxiliar de Limpeza",
    "metaDescription": "Modelo de currículo para Auxiliar de Limpeza com exemplo real, experiência em higienização hospitalar e comercial, uso de EPIs e produtos, habilidades, palavras-chave de ATS e faixa salarial em R$.",
    "intro": "Na seleção de Auxiliar de Limpeza, o recrutador raramente procura \"experiência com limpeza\" genérica — ele quer saber em que tipo de ambiente você atuou (hospitalar, comercial, industrial, escolar), se domina a diferença entre limpeza concorrente e terminal, se sabe diluir produtos químicos corretamente e se usa os EPIs e a sinalização de área molhada sem precisar de lembrete. Em hospitais e clínicas, conhecimento de RDC da Anvisa, descarte de resíduos (lixo infectante x comum) e protocolos de biossegurança pesam tanto quanto a experiência. Este modelo mostra como traduzir sua rotina de higienização em informações concretas que passam no filtro de triagem (ATS) e convencem o supervisor de limpeza ou o RH de facilities.",
    "sampleResume": {
      "name": "Joana Aparecida da Silva",
      "headline": "Auxiliar de Limpeza | Higienização Hospitalar e Comercial | Uso de EPIs e Diluição de Produtos",
      "summary": "Auxiliar de Limpeza com 5 anos de experiência em higienização de ambientes hospitalares e comerciais, com domínio de limpeza concorrente e terminal, diluição correta de produtos saneantes e descarte de resíduos conforme RDC 222/2018 da Anvisa. Uso rigoroso de EPIs e sinalização de piso molhado, com histórico de zero acidentes e elogios em auditorias de controle de infecção. Reconhecida pela organização, agilidade e cumprimento de cronograma de limpeza.",
      "experience": [
        {
          "role": "Auxiliar de Limpeza Hospitalar",
          "company": "Hospital São Camilo (unidade de 180 leitos)",
          "period": "Abr 2022 - Atual",
          "bullets": [
            "Realizo limpeza concorrente e terminal de enfermarias, UTI, centro cirúrgico e áreas críticas, seguindo POPs e protocolos da CCIH (Comissão de Controle de Infecção Hospitalar).",
            "Higienizo em média 14 leitos por plantão na alta/transferência (limpeza terminal), com tempo médio de 35 minutos por leito e aprovação em todas as auditorias de bancada com luminômetro (ATP).",
            "Faço a diluição correta de saneantes (detergente enzimático, hipoclorito a 1% e quaternário de amônio) seguindo a tabela do fabricante, evitando desperdício e danos a superfícies.",
            "Realizo a segregação e o descarte de resíduos por classe (infectante, comum, perfurocortante e químico) conforme RDC 222/2018, sem nenhuma não conformidade registrada em 18 meses.",
            "Utilizo sistematicamente EPIs (luvas nitrílicas, máscara, avental, óculos e botas) e sinalizo área molhada, contribuindo para o registro de zero acidentes na equipe de higienização do meu turno."
          ]
        },
        {
          "role": "Auxiliar de Serviços Gerais (Limpeza Comercial)",
          "company": "Grupo Brilho Facilities (alocada em shopping e escritórios)",
          "period": "Jan 2020 - Mar 2022",
          "bullets": [
            "Executava a limpeza de áreas comuns, sanitários, praça de alimentação e escritórios de um shopping, atendendo cerca de 2.500 m² por turno dentro do cronograma.",
            "Operava enceradeira, lavadora automática e máquina de extração para limpeza de pisos, carpetes e estofados, reduzindo o tempo de limpeza pesada em comparação ao método manual.",
            "Repunha materiais (papel toalha, sabonete, papel higiênico) e controlava o estoque da copa, evitando faltas em horários de pico.",
            "Mantinha banheiros higienizados em ronda a cada 1 hora, com checklist assinado, garantindo nota máxima na pesquisa de satisfação dos lojistas."
          ]
        }
      ],
      "education": [
        {
          "degree": "Ensino Médio Completo",
          "institution": "E.E. Dr. José Bonifácio",
          "period": "Concluído em 2018"
        },
        {
          "degree": "Curso de Limpeza e Higienização Hospitalar (carga de 40h)",
          "institution": "Senac",
          "period": "2022"
        },
        {
          "degree": "Treinamento de Biossegurança e Uso de EPIs (NR-6 e NR-32)",
          "institution": "Treinamento interno - Hospital São Camilo",
          "period": "2022 e reciclagem em 2024"
        }
      ],
      "skills": [
        "Limpeza concorrente e terminal hospitalar",
        "Diluição de produtos saneantes (hipoclorito, quaternário, detergente enzimático)",
        "Descarte de resíduos por classe (RDC 222/2018 - Anvisa)",
        "Uso de EPIs e biossegurança (NR-6 e NR-32)",
        "Operação de enceradeira, lavadora e extratora",
        "Sinalização de área molhada e prevenção de acidentes",
        "Higienização de sanitários e áreas comuns",
        "Controle e reposição de materiais de limpeza",
        "Limpeza de superfícies fixas, mobiliário e vidros",
        "Cumprimento de POPs e checklist de limpeza"
      ]
    },
    "keySkills": [
      "Limpeza concorrente e terminal (ambientes hospitalares e de saúde)",
      "Diluição correta de produtos saneantes e químicos (hipoclorito, quaternário de amônio, detergente enzimático, desincrustante)",
      "Descarte e segregação de resíduos por classe (RDC 222/2018 da Anvisa: infectante, comum, perfurocortante, químico)",
      "Uso correto de EPIs (luvas, máscara, avental, óculos, botas) e cumprimento das NR-6 e NR-32",
      "Higienização de superfícies, sanitários, áreas comuns, copas e refeitórios",
      "Operação de equipamentos: enceradeira, lavadora automática, extratora, aspirador e lavadora de alta pressão",
      "Sinalização de piso molhado e prevenção de acidentes de trabalho",
      "Conhecimento e cumprimento de POPs (Procedimentos Operacionais Padrão) e checklists de limpeza",
      "Controle de estoque e reposição de materiais de higiene",
      "Limpeza de áreas críticas, semicríticas e não críticas (classificação hospitalar)",
      "Organização, agilidade e cumprimento de cronograma e rondas",
      "Noções de prevenção de infecção e biossegurança"
    ],
    "atsKeywords": [
      "Auxiliar de Limpeza",
      "Auxiliar de Serviços Gerais",
      "higienização",
      "limpeza hospitalar",
      "limpeza concorrente",
      "limpeza terminal",
      "EPIs",
      "biossegurança",
      "NR-32",
      "RDC 222",
      "descarte de resíduos",
      "diluição de produtos",
      "saneantes",
      "hipoclorito de sódio",
      "POP",
      "limpeza comercial",
      "enceradeira",
      "controle de infecção",
      "facilities",
      "asseio e conservação"
    ],
    "salaryNote": "No Brasil (2026), a faixa salarial de Auxiliar de Limpeza varia conforme região, segmento e convenção coletiva da categoria. Início de carreira (limpeza comercial, escolar ou de escritórios): cerca de R$ 1.450 a R$ 1.700 por mês (próximo ao piso da convenção de asseio e conservação). Pleno (com experiência e operação de equipamentos): cerca de R$ 1.700 a R$ 2.200. Sênior/especializado (limpeza hospitalar em áreas críticas, com adicional de insalubridade, ou líder de equipe): cerca de R$ 2.000 a R$ 2.900. A limpeza hospitalar costuma pagar adicional de insalubridade (geralmente de 20% a 40% sobre o piso) por exposição a agentes biológicos, e turnos noturnos têm adicional. A maioria das vagas inclui vale-transporte, vale-refeição/cesta básica e, em muitas, plano de saúde. Sempre confira o piso da convenção coletiva (SEAC/sindicato de asseio e conservação) do seu estado, pois ele define o valor base.",
    "dos": [
      "Especifique o tipo de ambiente em que atuou: hospitalar, clínico, comercial, escolar, industrial ou condominial — o recrutador prioriza quem já conhece a rotina dele.",
      "Em vagas de saúde, cite que você domina limpeza concorrente e terminal, descarte de resíduos pela RDC 222/2018 e protocolos da CCIH; isso te coloca à frente.",
      "Mostre que sabe diluir produtos corretamente (ex.: 'preparo hipoclorito a 1% conforme tabela do fabricante') — diluição errada é um dos erros que mais preocupam supervisores.",
      "Quantifique a rotina: metros quadrados por turno, número de leitos higienizados, rondas por hora ou áreas atendidas; números provam ritmo e organização.",
      "Destaque o uso disciplinado de EPIs, a sinalização de piso molhado e o histórico de zero acidentes — segurança é critério de seleção, não detalhe.",
      "Inclua cursos e treinamentos (limpeza hospitalar, biossegurança, NR-32, NR-6, operação de máquinas) mesmo de carga curta, pois diferenciam currículos parecidos."
    ],
    "donts": [
      "Não escreva apenas 'fazia limpeza' ou 'serviços gerais' sem dizer o ambiente, as áreas e os produtos/equipamentos que você usava.",
      "Não confunda os ambientes: a limpeza hospitalar exige protocolos (concorrente/terminal, descarte por classe) que a limpeza de escritório não tem — não invente experiência hospitalar que você não viveu.",
      "Não diga que 'mistura produtos para limpar melhor'; misturar saneantes (ex.: água sanitária com outros químicos) é perigoso e demonstra falta de treinamento — fale em diluição correta, não em mistura.",
      "Não omita os EPIs e a parte de segurança; supervisores valorizam quem trabalha sem se acidentar e sem causar acidente a terceiros.",
      "Não inclua foto, RG, CPF ou estado civil no corpo do currículo, a menos que a vaga peça expressamente.",
      "Não envie o mesmo currículo para uma vaga hospitalar e uma de escritório sem ajustar; destaque em cada uma a experiência que realmente conversa com o ambiente."
    ],
    "faqs": [
      {
        "question": "Preciso de curso ou experiência para ser Auxiliar de Limpeza?",
        "answer": "Para a maioria das vagas comerciais e de escritório, não é exigido curso: basta saber ler e escrever, e muitas aceitam Ensino Fundamental. O que faz diferença é mostrar responsabilidade, agilidade e cuidado com segurança. Já para limpeza hospitalar e laboratorial, é comum exigirem Ensino Fundamental ou Médio completo e treinamento em biossegurança/NR-32, porque você lida com risco biológico. Um curso curto de limpeza e higienização hospitalar (oferecido por Senac e outras instituições) aumenta bastante suas chances nessas vagas mais bem pagas."
      },
      {
        "question": "Qual a diferença entre limpeza concorrente e limpeza terminal no currículo?",
        "answer": "São termos do ambiente hospitalar que o recrutador da área procura. A limpeza concorrente é a higienização diária e de manutenção do ambiente ocupado (chão, superfícies de maior contato, banheiro do quarto), feita uma ou mais vezes ao dia. A limpeza terminal é a higienização completa e profunda feita na alta, transferência ou óbito do paciente, ou periodicamente em áreas críticas — inclui mobiliário, paredes, cama e todos os equipamentos. Citar que você domina as duas mostra que conhece a rotina hospitalar de verdade e não só 'passou pano'."
      },
      {
        "question": "Como falo sobre uso de produtos e EPIs sem ficar genérico?",
        "answer": "Seja específico e correto. Em vez de 'usava produtos de limpeza', escreva 'preparava a diluição de hipoclorito de sódio a 1% e quaternário de amônio seguindo a tabela do fabricante'. Em vez de 'usava equipamento de proteção', escreva 'utilizava luvas nitrílicas, máscara, avental, óculos e botas em todas as áreas, conforme treinamento de NR-32'. Mencione também que você sinaliza piso molhado e nunca mistura produtos sem orientação. Esse nível de detalhe sinaliza ao supervisor que você foi treinado e trabalha com segurança."
      },
      {
        "question": "Como descrevo minha experiência se eu só limpava escritório/casa de família?",
        "answer": "Toda rotina tem detalhes que valem ouro. Descreva as áreas (recepção, banheiros, copa, salas), a frequência (rondas, limpeza diária e geral semanal), os equipamentos (enceradeira, aspirador) e o cuidado com materiais e estoque. Em vez de 'limpava o escritório', escreva 'higienizava cerca de 600 m² de escritório por turno, com ronda de banheiros a cada hora e reposição de materiais'. Se trabalhou em casa de família, fale em organização de ambientes, lavagem de roupas e cuidado com superfícies delicadas. O recrutador quer ver método, não só esforço."
      },
      {
        "question": "Vale a pena mencionar que sei operar enceradeira e outras máquinas?",
        "answer": "Sim, e isso pode te colocar à frente. Saber operar enceradeira, lavadora automática (auto-scrubber), extratora de carpete/estofado, aspirador de pó e água e lavadora de alta pressão é diferencial em limpeza comercial, industrial e de grandes áreas, porque acelera o trabalho e reduz custo de mão de obra. Liste cada equipamento que você sabe usar. Se já operou polidora ou fez cristalização/impermeabilização de piso, destaque — são habilidades técnicas que justificam um salário maior."
      },
      {
        "question": "O adicional de insalubridade aparece no currículo? Como funciona na limpeza?",
        "answer": "O valor do adicional não vai no currículo, mas vale entender o tema porque ele aparece na entrevista e na proposta. Na limpeza hospitalar e em coleta de lixo, a exposição a agentes biológicos costuma gerar adicional de insalubridade (em geral de 20% a 40% sobre o piso, conforme laudo da empresa e a NR-15). No currículo, o que ajuda é deixar claro que você tem experiência e treinamento para atuar em áreas insalubres com segurança (uso de EPIs, descarte de resíduos, biossegurança). Isso mostra que você está apto às vagas que pagam esse adicional."
      }
    ]
  },
  {
    "slug": "secretaria",
    "profession": "Secretária(o)",
    "metaTitle": "Modelo de Currículo para Secretária(o) (Exemplo Pronto 2026)",
    "h1": "Modelo de Currículo para Secretária(o)",
    "metaDescription": "Modelo de currículo para Secretária(o) com exemplo real, gestão de agenda, atendimento, organização de documentos, pacote Office, palavras-chave de ATS e faixa salarial em R$.",
    "intro": "A secretária (ou secretário) é a pessoa que sustenta a rotina de um executivo, de uma diretoria ou de um escritório inteiro, e o recrutador sabe disso: ele procura no currículo evidências de organização, discrição e domínio das ferramentas de gestão de agenda e comunicação. O problema é que a maioria dos currículos da área só repete \"responsável pela rotina da secretaria\" e some no meio da pilha. O que faz você ser chamada para a entrevista é mostrar com números o volume que você administrava (quantas agendas, quantos e-mails, quantas viagens), os sistemas que dominava (Outlook, Google Agenda, ERP) e como sua organização evitou conflitos de horário, atrasos ou retrabalho. Este modelo traz um exemplo completo e realista, com bullets de resultado, as habilidades específicas da função e as palavras-chave que os filtros de triagem (ATS) e o RH realmente buscam para vagas de secretária.",
    "sampleResume": {
      "name": "Juliana Martins Carvalho",
      "headline": "Secretária Executiva | Gestão de Agenda, Viagens e Atendimento | Office e Outlook",
      "summary": "Secretária com 6 anos de experiência em apoio à diretoria e gestão de rotinas executivas. Especialista em gestão de agenda de múltiplos executivos, organização de reuniões e viagens nacionais e internacionais, controle de documentos e atendimento de alto padrão a clientes e parceiros. Domínio do pacote Office (Outlook, Word, Excel e PowerPoint), Google Workspace e fluência em discrição e confidencialidade. Reconhecida por reduzir conflitos de agenda e padronizar o fluxo de documentos da diretoria.",
      "experience": [
        {
          "role": "Secretária Executiva da Diretoria",
          "company": "Grupo Vértice Empreendimentos",
          "period": "Mar 2021 - Atual",
          "bullets": [
            "Administro a agenda de 3 diretores, conciliando em média 35 compromissos por semana entre reuniões, visitas e calls, com zero conflitos de horário após implantar bloqueios e confirmação prévia no Outlook.",
            "Organizo viagens nacionais e internacionais (passagens, hospedagem, traslados e roteiro), gerando economia de cerca de 15% nos custos ao negociar com fornecedores e antecipar reservas.",
            "Triagem e priorização de aproximadamente 120 e-mails por dia da diretoria, respondendo demandas operacionais e encaminhando o que era estratégico, reduzindo o tempo de resposta do diretor.",
            "Padronizei o arquivo digital de contratos e atas no SharePoint, reduzindo o tempo de localização de documentos de 20 para 3 minutos e eliminando versões duplicadas.",
            "Organizo reuniões de diretoria e do conselho (convocação, sala, equipamentos, coffee break e ata), com pauta enviada com 48 horas de antecedência e acompanhamento dos encaminhamentos."
          ]
        },
        {
          "role": "Secretária Administrativa",
          "company": "Clínica Saúde Integrada",
          "period": "Fev 2019 - Fev 2021",
          "bullets": [
            "Recepcionei e atendi cerca de 70 contatos por dia entre telefone, WhatsApp e presencial, com agendamento e confirmação de consultas e redução de faltas (no-show) em 22% após criar rotina de lembretes.",
            "Gerenciei a agenda de 5 profissionais em sistema de gestão, encaixando retornos e emergências sem sobreposição de horários.",
            "Organizei o arquivo físico e digital de prontuários e documentos seguindo as normas internas e a LGPD, garantindo sigilo das informações dos pacientes.",
            "Elaborei comunicados internos, ofícios e planilhas de controle de materiais de escritório em Word e Excel, evitando ruptura de estoque dos itens essenciais."
          ]
        }
      ],
      "education": [
        {
          "degree": "Tecnólogo em Secretariado (cursando)",
          "institution": "Universidade Anhanguera (EAD)",
          "period": "2023 - 2025"
        },
        {
          "degree": "Ensino Médio Completo",
          "institution": "Colégio Estadual Dom Pedro II",
          "period": "2014 - 2016"
        },
        {
          "degree": "Cursos de Secretariado Executivo, Excel Intermediário e Inglês Intermediário",
          "institution": "Senac",
          "period": "2018 - 2022"
        }
      ],
      "skills": [
        "Gestão de agenda de múltiplos executivos (Outlook e Google Agenda)",
        "Organização de viagens, hospedagem e prestação de contas",
        "Atendimento telefônico, presencial e por e-mail de alto padrão",
        "Organização de reuniões e elaboração de atas",
        "Controle e arquivamento de documentos (físico e digital)",
        "Pacote Office (Word, Excel, PowerPoint, Outlook)",
        "Google Workspace (Agenda, Gmail, Drive, Documentos)",
        "Redação de e-mails, ofícios e comunicados formais",
        "Discrição, confidencialidade e LGPD",
        "Inglês intermediário"
      ]
    },
    "keySkills": [
      "Gestão de agenda e administração de compromissos (Outlook, Google Agenda)",
      "Organização de reuniões, salas, pautas e elaboração de atas",
      "Organização de viagens corporativas (passagens, hospedagem, roteiro e prestação de contas)",
      "Atendimento telefônico, presencial e por e-mail com cordialidade e postura profissional",
      "Triagem e priorização de e-mails e demandas da diretoria",
      "Organização e arquivamento de documentos físicos e digitais",
      "Domínio do pacote Office (Word, Excel, PowerPoint e Outlook)",
      "Google Workspace (Agenda, Gmail, Drive e Documentos)",
      "Redação de e-mails, ofícios, comunicados e atas",
      "Discrição, confidencialidade e respeito à LGPD",
      "Atenção a detalhes, organização e cumprimento de prazos",
      "Inglês e/ou espanhol (diferencial em empresas com contato internacional)"
    ],
    "atsKeywords": [
      "Secretária",
      "Secretário",
      "Secretária Executiva",
      "Secretária Administrativa",
      "gestão de agenda",
      "agendamento de reuniões",
      "organização de viagens",
      "atendimento telefônico",
      "atendimento ao cliente",
      "pacote Office",
      "Outlook",
      "Excel",
      "Google Agenda",
      "controle de documentos",
      "elaboração de atas",
      "redação de e-mails",
      "confidencialidade",
      "rotinas administrativas",
      "recepção"
    ],
    "salaryNote": "No Brasil, a faixa salarial de Secretária(o) varia conforme o porte da empresa, a região e o nível de senioridade exigido. Secretária júnior ou administrativa (início de carreira, rotinas de apoio e atendimento): cerca de R$ 1.700 a R$ 2.500 por mês. Secretária pleno (gestão de agenda, viagens e atendimento, com bom Excel e Outlook): cerca de R$ 2.600 a R$ 4.000. Secretária executiva sênior (apoio direto à diretoria/presidência, inglês fluente, gestão de múltiplos executivos): cerca de R$ 4.000 a R$ 7.500, podendo ultrapassar esse valor em multinacionais ou cargos bilíngues/trilíngues. Em capitais como São Paulo e em grandes empresas os valores tendem a ficar no topo da faixa, e a maioria das vagas inclui vale-transporte, vale-refeição/alimentação e plano de saúde.",
    "dos": [
      "Quantifique o volume das suas rotinas: 'gerenciava a agenda de 3 diretores' ou 'triava 120 e-mails/dia' diz muito mais que 'responsável pela secretaria'.",
      "Destaque o domínio das ferramentas de agenda e comunicação pelo nome: Outlook, Google Agenda, Microsoft Teams, e o nível real de Excel (básico, intermediário ou avançado).",
      "Mostre resultados de organização: redução de conflitos de agenda, queda de no-show, economia em viagens, tempo menor para localizar documentos.",
      "Inclua idiomas e o nível real (básico, intermediário, fluente) — em secretariado executivo, inglês costuma ser decisivo e é palavra-chave de triagem.",
      "Deixe claro o público que você atendia (diretoria, presidência, clientes VIP, parceiros internacionais) para sinalizar o nível de responsabilidade.",
      "Mantenha o currículo em 1 página, limpo, sem erros de português, já que a função envolve redação de e-mails, atas e comunicados oficiais."
    ],
    "donts": [
      "Não escreva apenas 'responsável pela rotina da secretaria' sem dizer quais rotinas, para quem e em que volume.",
      "Não declare 'inglês fluente' ou 'Excel avançado' se você não domina — em secretariado executivo isso é testado já na entrevista, às vezes em inglês.",
      "Não liste habilidades genéricas e vazias como 'sou organizada' ou 'sou comunicativa' sem nenhum exemplo concreto que comprove.",
      "Não inclua foto inadequada, número de RG/CPF, estado civil ou pretensão salarial fixa no corpo do currículo (a não ser que a vaga peça expressamente).",
      "Não omita sua experiência com confidencialidade e sigilo — para uma secretária que lida com informações da diretoria, discrição é um diferencial valorizado.",
      "Não envie o mesmo currículo para uma vaga de secretária de clínica e uma de secretária executiva de multinacional; destaque a experiência que conversa com cada contexto."
    ],
    "faqs": [
      {
        "question": "Preciso de faculdade de Secretariado para trabalhar como secretária?",
        "answer": "Depende do nível da vaga. Para secretária administrativa ou de apoio, a maioria das empresas exige apenas Ensino Médio completo e bom domínio do pacote Office. Para secretária executiva, especialmente em grandes empresas, costuma-se pedir o curso técnico ou superior em Secretariado (Tecnólogo ou Bacharelado em Secretariado Executivo), que inclusive permite o registro profissional (DRT). Mesmo sem a graduação, cursos de secretariado, Excel e idiomas aumentam muito suas chances."
      },
      {
        "question": "Qual a diferença entre secretária, secretária executiva e recepcionista no currículo?",
        "answer": "A recepcionista foca no atendimento na entrada da empresa: receber visitantes, direcionar ligações e controlar a sala de espera. A secretária administrativa faz isso e mais rotinas de apoio (agenda, documentos, planilhas). A secretária executiva dá suporte direto a um ou mais executivos da alta gestão, com gestão de agenda complexa, organização de viagens, reuniões de diretoria, triagem estratégica de e-mails e, muitas vezes, idiomas. No currículo, use o título correto e deixe claro o nível de responsabilidade e o público que você atendia, pois isso impacta a faixa salarial."
      },
      {
        "question": "Como descrevo minhas experiências se eu só fazia 'tarefas de apoio'?",
        "answer": "Toda tarefa tem um resultado por trás. Em vez de 'cuidava da agenda', escreva 'gerenciava a agenda de 3 executivos com cerca de 35 compromissos por semana, sem conflitos de horário'. Em vez de 'atendia o telefone', escreva 'atendia cerca de 70 contatos por dia entre telefone, e-mail e presencial, com retorno em até 2 horas'. Pense em volume (quantas agendas, e-mails, viagens), prazo, redução de erro ou economia que você gerou e transforme isso em números."
      },
      {
        "question": "Não tenho experiência. Como faço um currículo de secretária?",
        "answer": "Foque em formação, cursos e experiências equivalentes. Vale Jovem Aprendiz, estágio, trabalho voluntário, ajuda no negócio da família ou tarefas administrativas que você fez em outro emprego (organizar agenda, atender clientes, controlar documentos, redigir e-mails). Liste cursos de Secretariado, Pacote Office, Excel e idiomas. Escreva um resumo que destaque organização, atenção a detalhes, boa comunicação escrita e disposição para aprender os sistemas e a rotina da empresa."
      },
      {
        "question": "Qual nível de inglês devo colocar no currículo de secretária?",
        "answer": "Seja honesta e específica. Use 'básico' se entende textos simples, 'intermediário' se consegue se comunicar por e-mail e em conversas do dia a dia, e 'fluente/avançado' apenas se realmente conduz reuniões e atende ligações em inglês com naturalidade. Para secretária executiva de multinacional, o inglês costuma ser pré-requisito e é testado na entrevista, às vezes na própria seleção. Se tiver certificação (TOEFL, Cambridge) ou outro idioma como espanhol, inclua, pois são palavras-chave valorizadas na triagem."
      },
      {
        "question": "Quais ferramentas e sistemas vale a pena mencionar no currículo de secretária?",
        "answer": "Cite as ferramentas de agenda e comunicação pelo nome: Microsoft Outlook e Google Agenda (gestão de compromissos), Microsoft Teams e Zoom (reuniões online), Word, Excel e PowerPoint, além de Google Workspace (Gmail, Drive, Documentos). Se já usou ERP ou sistema de gestão (TOTVS, SAP), sistemas de viagens corporativas, SharePoint para arquivos ou ferramentas de assinatura digital, inclua. Os filtros de triagem (ATS) procuram esses nomes exatos, então escrevê-los corretamente aumenta a chance de o currículo passar."
      }
    ]
  }
];

export const PROFESSIONS: Profession[] = [
  ...PROFESSIONS_BASE,
  ...PROFESSIONS_INDUSTRIA_CONSTRUCAO,
  ...PROFESSIONS_COMERCIO_ALIMENTACAO,
  ...PROFESSIONS_CUIDADOS_SAUDE,
  ...PROFESSIONS_CORPORATIVO,
];

export function getProfession(slug: string): Profession | undefined {
  return PROFESSIONS.find((p) => p.slug === slug);
}

export function allProfessionSlugs(): string[] {
  return PROFESSIONS.map((p) => p.slug);
}

export function professionMetadata(slug: string): Metadata {
  const p = getProfession(slug);
  if (!p) return {};
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    alternates: { canonical: `/modelos-de-curriculo/${p.slug}` },
    openGraph: {
      type: "article",
      title: p.metaTitle,
      description: p.metaDescription,
      url: `/modelos-de-curriculo/${p.slug}`,
    },
  };
}
