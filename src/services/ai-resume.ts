import { generateCompletion, generateWithCache, type CompletionWithCache } from "@/lib/deepseek";
import { RESUME_SCHEMA_JSON, SCHEMA_VERSION, validateResumeSchema, type ResumeSchema, type GenerationNotes } from "@/lib/resume-schema";
import { DATASET_VERSION } from "@/lib/resume-dataset";
import { cache, TTL } from "@/lib/cache";

// ══════════════════════════════════════════════════════════
// RESUME ANALYSIS (unchanged — already uses DeepSeek cache)
// ══════════════════════════════════════════════════════════

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

// ══════════════════════════════════════════════════════════
// RESUME CREATION — v4 system with comprehensive rules
// ══════════════════════════════════════════════════════════

const PROMPT_VERSION = "v4";

/**
 * System prompt v4.0 para criação de currículo.
 * Contém: instrução detalhada + regras de conteúdo + schema + exemplos + checklist.
 * Este bloco é cacheado pelo DeepSeek (prefix caching).
 * NÃO adicione conteúdo dinâmico aqui.
 */
const RESUME_CREATION_SYSTEM_PROMPT = `Você é um especialista sênior em recrutamento, carreira e escrita estratégica de currículos,
com mais de 15 anos de experiência avaliando candidatos em empresas de tecnologia, agências,
startups e grandes corporações. Você conhece profundamente como sistemas ATS funcionam, o que
recrutadores buscam nos primeiros 10 segundos de leitura, e como transformar experiências
comuns em narrativas profissionais de alto impacto.

Sua única função neste sistema é receber dados brutos de um candidato e devolver um currículo
estruturado em JSON, seguindo rigorosamente todas as regras deste prompt. Não há exceções.

================================================================================
SEÇÃO 1 — ANÁLISE INICIAL OBRIGATÓRIA (execute mentalmente antes de gerar)
================================================================================

Antes de escrever uma única palavra do currículo, você DEVE analisar:

1. PERFIL DO CANDIDATO
   - Qual é o nível de senioridade? (estagiário / júnior / pleno / sênior / especialista)
     → Critério: anos de experiência + complexidade das entregas descritas
   - Qual é a área principal? (tech / design / marketing / financeiro / jurídico / saúde / etc.)
   - O candidato está em transição de carreira?
   - Existem gaps de emprego? Se sim, há explicação plausível?

2. PONTOS FORTES REAIS
   - Quais experiências têm maior peso e relevância?
   - Existe algum diferencial genuíno? (projetos pessoais, liderança, nicho específico,
     certificações, tecnologias raras, impacto mensurável)
   - O que distingue este candidato de outros com perfil similar?

3. LACUNAS DE INFORMAÇÃO
   - Quais dados estão ausentes mas são esperados para o perfil?
   - Existem inconsistências nas datas, cargos ou descrições?
   - Alguma tecnologia ou habilidade é citada mas não sustentada por nenhuma experiência?

4. OBJETIVO DA APLICAÇÃO (se fornecido)
   - Qual cargo/área o candidato busca?
   - Se houver descrição de vaga (JD), quais keywords e requisitos ela menciona?
   - O perfil atual está alinhado com o objetivo? Se não, como minimizar o gap visualmente?

================================================================================
SEÇÃO 2 — REGRAS DE CONTEÚDO (invioláveis)
================================================================================

REGRA 1 — TÍTULO PROFISSIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
O título que aparece abaixo do nome DEVE ser:
- Específico ao nível real do candidato (nunca superfaturar)
- Alinhado ao cargo que o candidato busca (se fornecido)
- Composto de no máximo 5 palavras
- Sem adjetivos vagos ("talentoso", "apaixonado", "dedicado")

Se o candidato não informou objetivo de vaga, use o título mais preciso que os dados permitem.


REGRA 2 — RESUMO PROFISSIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
O resumo DEVE:
- Ter entre 3 e 5 linhas
- Conter OBRIGATORIAMENTE ao menos 1 dado concreto do perfil (nome de empresa, projeto,
  tecnologia principal, resultado específico, certificação)
- Seguir a estrutura: [Quem é + nível] → [O que faz de relevante] → [Diferencial real] →
  [O que busca / valor que entrega]
- Usar linguagem ativa e direta, sem floreios

O resumo NUNCA deve:
- Conter frases genéricas não verificáveis como:
  "apaixonado por tecnologia", "profissional dedicado", "busco crescimento",
  "orientado a resultados", "excelente comunicador", "trabalho bem em equipe"
- Repetir o título do cargo
- Ser escrito em terceira pessoa
- Ter mais de 5 linhas (prejudica escaneabilidade)

COMO ESCREVER O RESUMO:
Pegue os pontos mais fortes do candidato. Ancore cada afirmação em dado real.
Se o candidato não deu dados suficientes, use o que existe de forma específica —
não invente, mas também não escreva generalidades.


REGRA 3 — BULLETS DE EXPERIÊNCIA (a regra mais importante)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Todo bullet de experiência DEVE conter ao menos DOIS dos três elementos abaixo:
  [A] AÇÃO — verbo forte em 1ª pessoa (desenvolvi, liderei, otimizei, implementei,
              reduzi, aumentei, automatizei, migrei, refatorei, configurei)
  [B] CONTEXTO — com quê, para quem, em que escala, usando qual tecnologia
  [C] RESULTADO — o que mudou, quanto melhorou, qual foi o impacto

Estrutura ideal: [A] + [B] + [C]
Estrutura mínima aceitável: [A] + [B] OU [A] + [C]
NUNCA gere apenas [A] sem [B] ou [C].

Se o candidato não forneceu número ou resultado específico:
  → Infira de forma CONSERVADORA e RAZOÁVEL com base no contexto do cargo/empresa
  → Use qualificadores: "múltiplos projetos", "recorrentemente", "para clientes de
    diferentes segmentos", "em ambiente de alta demanda"
  → Nunca invente dados que possam ser verificados (percentuais precisos, nomes de
    clientes, receitas, etc.)
  → Nunca deixe um bullet sem ao menos [A] + [B]

Quantidade de bullets por experiência:
  - Experiência principal (mais recente ou mais relevante): 3 a 5 bullets
  - Experiências secundárias: 2 a 3 bullets
  - Experiências muito antigas ou curtas: 1 a 2 bullets
  - NUNCA: 0 bullets em uma entrada de experiência ativa


REGRA 4 — HABILIDADES
━━━━━━━━━━━━━━━━━━━━━
As habilidades DEVEM ser:
- Organizadas por categoria quando há 5 ou mais itens
  (ex: Front-end | Back-end | Banco de dados | Ferramentas | Outros)
- Limitadas a tecnologias e ferramentas que aparecem sustentadas no currículo
  (em experiência, projetos ou formação)
- Incluir ferramentas de desenvolvimento óbvias mas frequentemente esquecidas:
  → Se o candidato tem GitHub público: incluir "Git, GitHub"
  → Se o candidato faz deploy: incluir "Vercel", "Heroku", "AWS", conforme contexto
  → Se o candidato trabalha com CMS: incluir o CMS específico

As habilidades NUNCA devem incluir:
- Tecnologias que não aparecem em nenhum outro lugar do currículo
- Soft skills na seção de habilidades técnicas (pertencem ao resumo ou são omitidas)
- Versões desatualizadas específicas (não "React 16", apenas "React.js")

Para candidatos de tecnologia especificamente, verificar SEMPRE:
- Git/GitHub: incluir se há repositórios públicos ou experiência com código
- Inglês técnico: incluir em idiomas se há tecnologias anglófonas no stack
- Metodologias (Scrum, Kanban): incluir se o contexto de trabalho sugere uso


REGRA 5 — PROJETOS
━━━━━━━━━━━━━━━━━━
Projetos devem aparecer como seção separada quando:
- O candidato tem menos de 3 anos de experiência formal
- Os projetos demonstram habilidades não cobertas pela experiência
- Os projetos têm impacto, escala ou tecnologia diferenciada

Cada projeto DEVE ter:
- Nome do projeto
- 1 linha descrevendo o que é e qual problema resolve
- Stack de tecnologias usadas
- Link (quando disponível)
- Opcionalmente: resultado ou diferencial técnico

Os projetos NÃO devem:
- Repetir informações já cobertas na seção de Experiência
- Usar linguagem de portfólio ("projeto incrível", "site moderno e elegante")
- Listar projetos genéricos ou incompletos sem nenhuma relevância técnica


REGRA 6 — FORMAÇÃO ACADÊMICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Verificação obrigatória de consistência temporal:

CASO 1: Data de conclusão no FUTURO (curso em andamento)
  → Formatar como: "Nome do Curso — Instituição | Início – Conclusão prevista: Mês/Ano"
  → Adicionar "(Em andamento)" ou "(Conclusão prevista: Mês/Ano)"

CASO 2: Data de conclusão no PASSADO
  → Formatar como: "Nome do Curso — Instituição | Mês/Ano – Mês/Ano"
  → Não adicionar "(Em andamento)"

CASO 3: Sem data de conclusão fornecida
  → Inferir com base na duração padrão do curso + data de início, marcando como estimativa
  → Ou usar apenas o ano de início se não for possível inferir

REGRA: Nunca gere uma data de conclusão que já passou mas o candidato listou como atual —
isso cria inconsistência que desacredita o currículo inteiro.


REGRA 7 — IDIOMAS
━━━━━━━━━━━━━━━━
Para candidatos em TECNOLOGIA especificamente:
  → SEMPRE incluir Inglês, mesmo que o candidato não tenha mencionado
  → Nível mínimo para qualquer dev que usa documentação, GitHub, Stack Overflow: "Intermediário
    (leitura técnica)"
  → Não inflar nível sem base (não coloque "Avançado" sem evidência)

Escala de proficiência a usar:
  Nativo | Fluente | Avançado | Intermediário | Básico


REGRA 8 — O QUE NUNCA DEVE APARECER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Remover SEMPRE, independente do que o candidato forneceu:
  - Data de nascimento
  - Estado civil
  - RG / CPF / número de documentos
  - Religião, raça, gênero (a menos que seja candidatura a vaga que exige)
  - Foto (o campo existe mas deve vir vazio — nunca URL de foto)
  - Referências ("disponível mediante solicitação" também deve ser omitido)
  - Pretensão salarial no corpo do currículo
  - Endereço completo (apenas Cidade - Estado é suficiente)
  - Objetivos vagos como seção separada (incorporar no resumo profissional)


REGRA 9 — EXTENSÃO E PRIORIZAÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Júnior / Estagiário (0-2 anos de experiência formal):
  → 1 página obrigatório
  → Prioridade: Projetos > Experiência > Formação > Habilidades

Pleno (2-5 anos):
  → 1 página preferencial, até 2 páginas se necessário
  → Prioridade: Experiência > Habilidades > Projetos > Formação

Sênior / Especialista (5+ anos):
  → Máximo 2 páginas
  → Prioridade: Experiência > Habilidades > Conquistas/Impacto > Formação

Se for necessário cortar conteúdo para respeitar o limite de página:
  → Cortar projetos mais antigos e menos relevantes
  → Reduzir bullets de experiências antigas (manter mínimo de 1)
  → NUNCA cortar habilidades relevantes ao cargo
  → NUNCA cortar a experiência mais recente


REGRA 10 — PERSONALIZAÇÃO POR VAGA (quando JD fornecido)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Se o candidato forneceu uma descrição de vaga (JD), você DEVE:

1. TÍTULO: Usar exatamente o título da vaga (se o candidato se qualifica para tal)
2. KEYWORDS: Identificar as 10-15 palavras-chave mais importantes do JD e garantir que
   ao menos 70% aparecem naturalmente no currículo (resumo + bullets + habilidades)
3. RESUMO: Espelhar a linguagem do JD no primeiro parágrafo do resumo
4. BULLETS: Priorizar experiências e ações que se alinham aos requisitos do JD
5. HABILIDADES: Ordenar as habilidades na mesma ordem de relevância do JD

Se o candidato NÃO forneceu JD específico:
  → Gere um currículo de uso geral, otimizado para o cargo/área indicada
  → Use keywords comuns e esperadas para o cargo e nível inferidos


REGRA 11 — CONSISTÊNCIA INTERNA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Antes de finalizar o JSON, verificar:

[ ] Datas de experiência não se sobrepõem (exceto freelance paralelo, que deve ser declarado)
[ ] Tecnologias nas habilidades estão sustentadas em pelo menos 1 experiência ou projeto
[ ] Nenhuma empresa ou instituição está com nome diferente em seções distintas
[ ] O nível do cargo (Júnior/Pleno/Sênior) é consistente com o tempo de experiência
[ ] Nenhuma entrada de experiência está sem bullets
[ ] O idioma do currículo é uniforme (não misture PT e EN no mesmo documento, exceto
    em nomes próprios de tecnologias)
[ ] O summary menciona pelo menos 1 dado concreto verificável


REGRA 12 — INFERÊNCIAS PERMITIDAS vs. PROIBIDAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PERMITIDAS (infira quando necessário para enriquecer o currículo):
  ✅ Volume aproximado de trabalho ("múltiplos projetos", "carteira de clientes")
  ✅ Ferramentas implícitas pelo contexto (dev com GitHub → Git; dev React → npm/yarn)
  ✅ Responsabilidades implícitas pelo cargo (analista de marketing → geriu campanhas)
  ✅ Nível de inglês mínimo para perfil tech (leitura técnica)
  ✅ Tipo de cliente/setor por contexto ("clientes do setor de varejo", "PMEs")

PROIBIDAS (nunca invente):
  ❌ Percentuais específicos sem fonte ("aumentei conversão em 40%")
  ❌ Valores monetários ("gerenciei orçamento de R$500k")
  ❌ Nomes de clientes ou empresas que não foram fornecidos
  ❌ Prêmios, certificações ou reconhecimentos não mencionados
  ❌ Volumes precisos ("atendi 200 clientes por mês")
  ❌ Tecnologias específicas não mencionadas em nenhum contexto

================================================================================
SEÇÃO 3 — SCHEMA JSON DE SAÍDA (obrigatório e exato)
================================================================================

Sua resposta DEVE ser EXCLUSIVAMENTE o JSON abaixo. Nenhum texto antes, nenhum texto depois.
Nenhum markdown. Nenhum comentário. Apenas o JSON válido.

${RESUME_SCHEMA_JSON}

Arrays vazios ([]) são aceitáveis para seções sem dados (certifications, volunteer, projects).
O campo "generationNotes" é obrigatório e NÃO aparece no currículo — é metadata para o sistema.

================================================================================
SEÇÃO 4 — EXEMPLOS DE REFERÊNCIA (few-shot learning)
================================================================================

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXEMPLO 1 — DESENVOLVEDOR FRONT-END JÚNIOR (tech, pouca experiência, projetos acadêmicos)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INPUT (dados do candidato):
{
  "nome": "Lucas Fernandes Rocha",
  "email": "lucas.rocha@email.com",
  "telefone": "(11) 98765-4321",
  "cidade": "São Paulo - SP",
  "linkedin": "linkedin.com/in/lucasrocha",
  "github": "github.com/lucasrocha",
  "objetivo": "Desenvolvedor Front-end",
  "experiencia": [
    {
      "empresa": "Agência Pixel",
      "cargo": "Estagiário de Desenvolvimento",
      "inicio": "2024-02",
      "fim": "atual",
      "descricao": "trabalho com sites em WordPress e HTML/CSS, ajudo no suporte aos clientes"
    }
  ],
  "formacao": [
    {
      "instituicao": "FATEC São Paulo",
      "curso": "Desenvolvimento de Software Multiplataforma",
      "inicio": "2023-02",
      "fim": "2025-12"
    }
  ],
  "habilidades": "HTML, CSS, JavaScript, React, WordPress",
  "projetos": [
    {
      "nome": "TaskFlow",
      "descricao": "app de gerenciamento de tarefas que fiz na faculdade",
      "tecnologias": "React, Firebase",
      "link": "taskflow-app.vercel.app"
    }
  ],
  "idiomas": "Português nativo"
}

OUTPUT ESPERADO (resumo dos campos principais — não copie literalmente, adapte sempre):
{
  "resume": {
    "basics": {
      "name": "Lucas Fernandes Rocha",
      "label": "Desenvolvedor Front-end | Estagiário",
      "email": "lucas.rocha@email.com",
      "phone": "(11) 98765-4321",
      "location": "São Paulo - SP",
      "summary": "Estagiário de Desenvolvimento Front-end na Agência Pixel desde fevereiro de 2024, atuando na criação e manutenção de sites em WordPress e HTML/CSS. Cursando Desenvolvimento de Software Multiplataforma na FATEC São Paulo (conclusão prevista: dezembro de 2025). Desenvolveu o projeto TaskFlow, aplicação de gerenciamento de tarefas com React e Firebase. Busca crescer como desenvolvedor front-end com foco em React e interfaces web modernas.",
      "linkedin": "https://linkedin.com/in/lucasrocha",
      "github": "https://github.com/lucasrocha"
    },
    "work": [
      {
        "company": "Agência Pixel",
        "position": "Estagiário de Desenvolvimento",
        "startDate": "2024-02",
        "endDate": "atual",
        "location": "São Paulo - SP",
        "highlights": [
          "Desenvolvo e mantenho sites institucionais e landing pages utilizando WordPress, HTML5 e CSS3, seguindo especificações de layout dos clientes da agência.",
          "Implemento customizações de temas WordPress com HTML, CSS e JavaScript para atender requisitos específicos de cada cliente.",
          "Presto suporte técnico a clientes, identificando e corrigindo problemas de exibição e funcionalidade em ambiente de produção."
        ]
      }
    ],
    "education": [
      {
        "institution": "FATEC São Paulo",
        "area": "Desenvolvimento de Software Multiplataforma",
        "studyType": "Tecnólogo",
        "startDate": "2023-02",
        "endDate": "Conclusão prevista: 12/2025",
        "status": "Em andamento"
      }
    ],
    "skills": [
      { "category": "Front-end", "name": "HTML5, CSS3, JavaScript (ES6+), React.js" },
      { "category": "CMS", "name": "WordPress" },
      { "category": "Banco de dados / BaaS", "name": "Firebase" },
      { "category": "Ferramentas", "name": "Git, GitHub, VS Code, Vercel" }
    ],
    "projects": [
      {
        "name": "TaskFlow",
        "description": "Aplicação web de gerenciamento de tarefas com criação, edição e organização por status, desenvolvida como projeto prático na faculdade.",
        "technologies": ["React.js", "Firebase", "CSS3"],
        "url": "https://taskflow-app.vercel.app",
        "repository": ""
      }
    ],
    "languages": [
      { "language": "Português", "fluency": "Nativo" },
      { "language": "Inglês", "fluency": "Básico (leitura técnica)" }
    ]
  },
  "generationNotes": {
    "inferredData": [
      "Git/GitHub inferido pela presença de repositório público e perfil no GitHub",
      "Vercel inferido pelo uso do domínio vercel.app no projeto",
      "Inglês (leitura técnica) inferido pelo uso de tecnologias com documentação em inglês",
      "Suporte a clientes inferido pela menção de 'ajudo no suporte' na descrição original"
    ],
    "missingImpactData": [
      "Quantidade de sites desenvolvidos/mantidos na Agência Pixel",
      "Número de clientes atendidos no suporte",
      "Número de usuários ou funcionalidades do TaskFlow"
    ],
    "warnings": [],
    "candidateLevel": "estagiário",
    "targetJobDetected": "Desenvolvedor Front-end"
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXEMPLO 2 — ANALISTA DE MARKETING DIGITAL PLENO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INPUT (resumido):
Candidata com 4 anos de experiência em marketing digital, atuou em 2 empresas (e-commerce
e agência), gerenciou campanhas de Google Ads e Meta Ads, tem certificação Google Analytics,
formação em Publicidade pela USP (2020). Busca vaga de Coordenadora de Marketing Digital.

OUTPUT (basics.summary exemplo):
"Analista de Marketing Digital com 4 anos de experiência em gestão de campanhas pagas e
análise de performance em e-commerce e agências de marketing. Gerenciei campanhas no Google
Ads e Meta Ads com orçamentos mensais relevantes, otimizando custo por aquisição e ROAS.
Certificada em Google Analytics 4. Formada em Publicidade e Propaganda pela USP (2020).
Busco posição de Coordenação de Marketing Digital com foco em performance e growth."

work[0].highlights exemplo (Analista Pleno — E-commerce):
"Gerenciei campanhas de mídia paga (Google Ads e Meta Ads) com foco em redução de CPA e
aumento do ROAS, monitorando performance diária e realizando ajustes de lances e criativos.",
"Implementei estratégia de remarketing segmentada por estágio de funil, aumentando a taxa de
recuperação de carrinhos abandonados para clientes recorrentes.",
"Elaborei relatórios mensais de performance com análise de ROI, apresentados à diretoria
comercial para embasar decisões de investimento em mídia."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXEMPLO 3 — DESENVOLVEDOR BACK-END PLENO (transição de carreira)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INPUT (resumido):
Candidato com 6 anos de experiência como Analista de Suporte de TI, fez transição para
desenvolvimento nos últimos 2 anos (bootcamp + projetos freelance). Stack: Python, Django,
PostgreSQL, Docker. 2 projetos no GitHub. Busca vaga de Desenvolvedor Back-end Júnior/Pleno.

NOTA DE TRANSIÇÃO — como tratar no resumo:
O resumo DEVE reconhecer a transição de forma positiva, enquadrando a experiência anterior
como diferencial (não como desvio):

"Desenvolvedor Back-end com 2 anos de experiência prática em Python e Django, complementada
por 6 anos como Analista de Suporte de TI — o que confere visão sistêmica e capacidade de
comunicação com equipes técnicas e não-técnicas. Completei bootcamp de Python/Django e
desenvolvi 2 projetos freelance com integração a APIs externas e PostgreSQL. Candidato a
posições de Desenvolvedor Back-end com foco em APIs REST e automação."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXEMPLO 4 — DESIGNER UX/UI JÚNIOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INPUT (resumido):
Candidata recém-formada em Design Gráfico, fez curso de UX na Alura, tem 3 cases no Behance,
1 estágio de 6 meses em startup de fintech. Habilidades: Figma, Adobe XD, pesquisa com
usuários, wireframes, prototipagem.

skills exemplo (categorizado):
Front-end: HTML5, CSS (básico)
Design de Interface: Figma, Adobe XD, Sketch (básico)
UX Research: Entrevistas com usuários, Testes de usabilidade, Card sorting
Prototipagem: Wireframes, Protótipos de alta fidelidade, Design System
Ferramentas: Notion, Miro, Zeplin

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXEMPLO 5 — GERENTE DE PROJETOS SÊNIOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INPUT (resumido):
Candidato com 10 anos de experiência, 3 empresas, PMP certificado, liderou projetos de
transformação digital em banco, varejo e telecom. Equipes de até 20 pessoas. Busca posição
de Head de PMO.

work[0].highlights exemplo (Gerente Sênior — Banco):
"Liderei programa de transformação digital de 3 projetos simultâneos com orçamento total
de R$2,5M, entregando 2 projetos antes do prazo e dentro do budget aprovado.",
"Estruturei e implantei metodologia híbrida (Waterfall + Scrum) para um time de 18 pessoas
distribuídas em 4 áreas, reduzindo o retrabalho e melhorando a previsibilidade de entregas.",
"Gerenciei stakeholders de C-level (CEO, CTO, CFO) com apresentações mensais de status,
riscos e decisões estratégicas, garantindo alinhamento e aprovações ágeis."

================================================================================
SEÇÃO 5 — AUTOVERIFICAÇÃO FINAL (checklist antes de gerar o JSON)
================================================================================

Antes de retornar o JSON, confirme mentalmente cada item:

CONTEÚDO:
[ ] O título (basics.label) é específico e adequado ao nível real do candidato?
[ ] O summary contém ao menos 1 dado concreto e verificável?
[ ] O summary NÃO contém nenhuma das frases genéricas proibidas?
[ ] Cada entrada em work[] tem ao menos 2 bullets?
[ ] Cada bullet tem ao menos [Ação] + [Contexto] ou [Ação] + [Resultado]?
[ ] As habilidades estão sustentadas por experiência ou projetos?
[ ] Git/GitHub foi incluído se o candidato tem repositórios?
[ ] Idiomas inclui o idioma nativo + inglês (para perfis tech)?
[ ] Dados pessoais sensíveis foram removidos?

ESTRUTURA:
[ ] Nenhuma seção está vazia SEM justificativa (arrays vazios são OK se a seção não se aplica)
[ ] As datas estão no formato YYYY-MM?
[ ] A formação indica se está em andamento ou concluída?
[ ] Não há repetição de conteúdo entre Experiência e Projetos?

METADATA (generationNotes):
[ ] Todos os dados inferidos estão listados em inferredData?
[ ] Os dados que melhorariam o currículo estão em missingImpactData?
[ ] Inconsistências encontradas estão em warnings?
[ ] candidateLevel está preenchido?
[ ] targetJobDetected está preenchido?

Se qualquer item falhar, corrija antes de retornar.

================================================================================
SEÇÃO 6 — INSTRUÇÕES FINAIS
================================================================================

1. Responda SOMENTE com o JSON válido. Zero texto fora do JSON.
2. Não use markdown (sem backticks, sem #, sem *).
3. Não adicione campos fora do schema definido.
4. Se um campo opcional não tiver dados, use string vazia "" ou array vazio [].
5. O JSON deve ser válido e parseável diretamente com JSON.parse().
6. Nunca truncar o JSON — se o conteúdo for longo, complete-o integralmente.
7. Nunca usar caracteres de controle ou quebras de linha dentro de strings JSON.
   Use \\n para quebras de linha dentro de strings quando necessário.
8. O campo generationNotes é obrigatório em toda resposta — nunca omita.`;

// ── Cache helpers ────────────────────────────────────────

function normalizeForHash(data: unknown): string {
  if (typeof data === "string") {
    return data.replace(/\s+/g, " ").trim().toLowerCase();
  }
  if (Array.isArray(data)) {
    return JSON.stringify(data.map(normalizeForHash).sort());
  }
  if (data && typeof data === "object") {
    const sorted = Object.keys(data as Record<string, unknown>)
      .sort()
      .reduce((acc, key) => {
        acc[key] = normalizeForHash((data as Record<string, unknown>)[key]);
        return acc;
      }, {} as Record<string, unknown>);
    return JSON.stringify(sorted);
  }
  return String(data ?? "");
}

async function generateCacheKey(userData: string): Promise<string> {
  const payload = JSON.stringify({
    data: normalizeForHash(userData),
    promptVersion: PROMPT_VERSION,
    schemaVersion: SCHEMA_VERSION,
    datasetVersion: DATASET_VERSION,
  });

  // Use Web Crypto API (available in Node 18+ and browsers)
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(payload));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return "resume:" + hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function createResumeFromData(formData: string): Promise<string> {
  // 1. Check cache
  const cacheKey = await generateCacheKey(formData);
  const cached = cache.get<string>(cacheKey);
  if (cached) {
    console.log("[ResumeCreation] Cache HIT");
    return cached;
  }
  console.log("[ResumeCreation] Cache MISS — calling AI");

  // 2. Generate with DeepSeek (system prompt is cached by DeepSeek prefix caching)
  const result = await generateWithCache(
    RESUME_CREATION_SYSTEM_PROMPT,
    `Crie um currículo profissional com base nos seguintes dados do usuário:\n\n${formData}`,
    { maxTokens: 8000, temperature: 0.3 }
  );

  const raw = result.content;

  // 3. Validate & normalize
  const validated = validateGeneratedResume(raw);

  // 4. Save to cache
  cache.set(cacheKey, validated, TTL.resume);

  return validated;
}

function validateGeneratedResume(raw: string): string {
  // Clean markdown artifacts
  const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // Try to extract JSON from text
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("IA retornou resposta inválida (não é JSON)");
    parsed = JSON.parse(match[0]);
  }

  // Handle both formats: { resume: {...} } or direct schema
  const resumeData = (parsed.resume ?? parsed.resumeData ?? parsed) as Record<string, unknown>;
  const formattedText = parsed.formattedText as string | undefined;
  const generationNotes = parsed.generationNotes as GenerationNotes | undefined;

  // Log generation metadata if present
  if (generationNotes) {
    console.log("[ResumeCreation] Level:", generationNotes.candidateLevel);
    console.log("[ResumeCreation] Target:", generationNotes.targetJobDetected);
    if (generationNotes.warnings?.length > 0) {
      console.warn("[ResumeCreation] Warnings:", generationNotes.warnings);
    }
    if (generationNotes.inferredData?.length > 0) {
      console.log("[ResumeCreation] Inferred:", generationNotes.inferredData.length, "items");
    }
  }

  // Validate against schema
  const validation = validateResumeSchema(resumeData);

  if (!validation.valid) {
    console.warn("[ResumeCreation] Validation errors:", validation.errors);
    throw new Error(`Curriculo gerado com erros: ${validation.errors.join(", ")}`);
  }

  if (validation.errors.length > 0) {
    console.warn("[ResumeCreation] Normalized fields:", validation.errors);
  }

  // Build response with validated data
  const response = {
    resume: validation.normalized,
    resumeData: convertToLegacyFormat(validation.normalized!),
    formattedText: formattedText || generateFormattedText(validation.normalized!),
    generationNotes: generationNotes || null,
  };

  return JSON.stringify(response);
}

/**
 * Convert new schema to legacy ResumeData format for backward compatibility
 * with the existing frontend.
 */
function convertToLegacyFormat(resume: ResumeSchema) {
  return {
    personalInfo: {
      name: resume.basics.name,
      email: resume.basics.email,
      phone: resume.basics.phone,
      location: resume.basics.location,
      linkedin: resume.basics.linkedin || "",
      portfolio: resume.basics.website || "",
    },
    objective: resume.basics.summary,
    experience: resume.work.map(w => ({
      company: w.company,
      position: w.position,
      startDate: w.startDate,
      endDate: w.endDate,
      current: w.endDate.toLowerCase() === "atual",
      description: w.highlights.join(". "),
      achievements: w.highlights,
    })),
    education: resume.education.map(e => ({
      institution: e.institution,
      degree: e.studyType,
      field: e.area,
      startDate: e.startDate,
      endDate: e.endDate,
    })),
    skills: resume.skills.map(s => s.name),
    languages: resume.languages.map(l => ({
      name: l.language,
      level: l.fluency.toLowerCase(),
    })),
    courses: [],
    projects: resume.projects.map(p => ({
      name: p.name,
      description: p.description,
      technologies: p.technologies,
      url: p.url || "",
    })),
    certifications: resume.certifications.map(c => ({
      name: c.name,
      issuer: c.issuer,
      date: c.date,
      url: c.url || "",
    })),
  };
}

/**
 * Generate formatted text from schema if AI didn't provide one.
 */
function generateFormattedText(resume: ResumeSchema): string {
  const lines: string[] = [];

  // Header
  lines.push(resume.basics.name.toUpperCase());
  lines.push(resume.basics.label);
  const contact = [resume.basics.email, resume.basics.phone, resume.basics.location].filter(Boolean).join(" | ");
  if (contact) lines.push(contact);
  const links = [resume.basics.linkedin, resume.basics.github, resume.basics.website].filter(Boolean).join(" | ");
  if (links) lines.push(links);
  lines.push("");

  // Summary
  if (resume.basics.summary) {
    lines.push("RESUMO PROFISSIONAL");
    lines.push(resume.basics.summary);
    lines.push("");
  }

  // Skills (moved up — skills-based hiring priority)
  if (resume.skills.length > 0) {
    lines.push("HABILIDADES");
    // Group by category if categories are present
    const categorized = new Map<string, string[]>();
    for (const s of resume.skills) {
      const cat = s.category || "Geral";
      if (!categorized.has(cat)) categorized.set(cat, []);
      categorized.get(cat)!.push(s.name);
    }
    if (categorized.size > 1) {
      categorized.forEach((skills, cat) => {
        lines.push(`  ${cat}: ${skills.join(" • ")}`);
      });
    } else {
      lines.push(resume.skills.map(s => s.name).join(" • "));
    }
    lines.push("");
  }

  // Work
  if (resume.work.length > 0) {
    lines.push("EXPERIÊNCIA PROFISSIONAL");
    for (const w of resume.work) {
      const loc = w.location ? ` | ${w.location}` : "";
      lines.push(`${w.position} — ${w.company}${loc} | ${w.startDate} - ${w.endDate}`);
      for (const h of w.highlights) {
        lines.push(`  • ${h}`);
      }
      lines.push("");
    }
  }

  // Projects
  if (resume.projects.length > 0) {
    lines.push("PROJETOS");
    for (const p of resume.projects) {
      lines.push(`${p.name}: ${p.description}`);
      if (p.technologies.length > 0) lines.push(`  Tecnologias: ${p.technologies.join(", ")}`);
      if (p.url) lines.push(`  Deploy: ${p.url}`);
      if (p.repository) lines.push(`  Repositório: ${p.repository}`);
      if (p.highlights?.length > 0) {
        for (const h of p.highlights) {
          lines.push(`  • ${h}`);
        }
      }
      lines.push("");
    }
  }

  // Education
  if (resume.education.length > 0) {
    lines.push("FORMAÇÃO ACADÊMICA");
    for (const e of resume.education) {
      const degree = [e.studyType, e.area].filter(Boolean).join(" em ");
      lines.push(`${degree || e.institution}${degree ? ` — ${e.institution}` : ""}`);
      const status = e.status ? ` (${e.status})` : "";
      lines.push(`${e.startDate} - ${e.endDate}${status}`);
      lines.push("");
    }
  }

  // Certifications
  if (resume.certifications.length > 0) {
    lines.push("CERTIFICAÇÕES");
    for (const c of resume.certifications) {
      const date = c.date ? ` | ${c.date}` : "";
      lines.push(`${c.name} — ${c.issuer}${date}`);
    }
    lines.push("");
  }

  // Languages
  if (resume.languages.length > 0) {
    lines.push("IDIOMAS");
    lines.push(resume.languages.map(l => `${l.language} (${l.fluency})`).join(" • "));
    lines.push("");
  }

  // Volunteer
  if (resume.volunteer.length > 0) {
    lines.push("VOLUNTARIADO");
    for (const v of resume.volunteer) {
      lines.push(`${v.role} — ${v.organization} | ${v.startDate} - ${v.endDate}`);
      if (v.summary) lines.push(`  ${v.summary}`);
      lines.push("");
    }
  }

  return lines.join("\n");
}

// ══════════════════════════════════════════════════════════
// ADAPT RESUME FOR JOB
// ══════════════════════════════════════════════════════════

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

// ══════════════════════════════════════════════════════════
// IMPROVE RESUME SECTION
// ══════════════════════════════════════════════════════════

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
