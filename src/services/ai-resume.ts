import { generateCompletion, generateWithCache, type CompletionWithCache } from "@/lib/deepseek";
import { postProcessResume } from "@/lib/resume-postprocess";
import {
  RESUME_SCHEMA_JSON,
  SCHEMA_VERSION,
  validateResumeSchema,
  validateResumeQuality,
  applyAutoFixes,
  validatePreservation,
  type ResumeSchema,
  type GenerationNotes,
  type QualityReport,
  type PreservationIssue,
} from "@/lib/resume-schema";
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
// RESUME CREATION — v5 system (condensed + few-shot + self-check)
// ══════════════════════════════════════════════════════════

const PROMPT_VERSION = "v8";

/**
 * System prompt v5.0 — condensed, focused, with few-shot examples and self-check.
 * Target: ≤ 350 lines. Prioritizes: metrics, bullets, skill categorization, section order.
 * This block is cached by DeepSeek (prefix caching). NO dynamic content here.
 */
const RESUME_CREATION_SYSTEM_PROMPT = `Você é um especialista sênior em currículos profissionais com mais de 15 anos de experiência.
Sua função: receber dados de um candidato e retornar um currículo estruturado em JSON.
Siga TODAS as regras abaixo. Sem exceções.

════════════════════════════════════════
REGRA 1 — TÍTULO PROFISSIONAL
════════════════════════════════════════
- Máximo 5 palavras. Específico ao nível real do candidato.
- SEM adjetivos vagos ("talentoso", "dedicado", "apaixonado").
- Se sem objetivo de vaga, use o título mais preciso que os dados permitem.

════════════════════════════════════════
REGRA 2 — RESUMO PROFISSIONAL
════════════════════════════════════════
FAÇA: 3-5 linhas no formato [Quem é + nível] → [O que faz] → [Diferencial] → [O que busca].
OBRIGATÓRIO: ao menos 1 número ou dado concreto (anos, quantidade de projetos, empresa, certificação).
NUNCA use: "apaixonado por tecnologia", "profissional dedicado", "busco crescimento", "orientado a resultados", "excelente comunicador", "trabalho bem em equipe".
NUNCA repita o título do cargo. NUNCA use terceira pessoa.

════════════════════════════════════════
REGRA 3 — BULLETS DE EXPERIÊNCIA (CRÍTICA)
════════════════════════════════════════
Formato OBRIGATÓRIO: VERBO DE AÇÃO + O QUE FEZ + RESULTADO/IMPACTO

❌ NUNCA gere bullets assim (sem resultado — leia e pergunte "e daí?"):
- "Realizo triagem de currículos para múltiplas vagas" → e daí? quantos? resultado?
- "Gerencio o agendamento de entrevistas com candidatos" → e daí? volume? impacto?
- "Desenvolvo landing pages para clientes da agência" → e daí? quantas? resultado?
- "Coordeno a integração de novos colaboradores" → e daí? quantos? como melhorou?
- "Presto suporte técnico a clientes" → e daí? quantos clientes? que tipo de problema?

✅ SEMPRE gere bullets assim (com resultado/volume):
- "Realizo triagem de mais de 50 currículos por processo seletivo para vagas técnicas e administrativas, reduzindo o tempo de pré-seleção em 30%"
- "Gerencio agendamento de entrevistas para mais de 3 gestores simultaneamente, coordenando processos com 15-20 candidatos por vaga"
- "Desenvolvo landing pages para clientes da agência, entregando mais de 10 projetos com foco em conversão e performance mobile"
- "Coordeno integração de mais de 5 novos colaboradores/mês, estruturando onboarding que reduziu o tempo de adaptação"
- "Presto suporte técnico a mais de 10 clientes ativos, resolvendo em média 8 chamados/semana"

REGRA DE OURO: Se o bullet não responde "e daí?" ou "quanto?", está INCOMPLETO.
NOTAÇÃO DE QUANTIDADES (INVIOLÁVEL): SEMPRE escreva "mais de X" por extenso. NUNCA use a notação "X+" (com símbolo +).
  ❌ "10+ projetos", "50+ clientes", "2+ anos"
  ✅ "mais de 10 projetos", "mais de 50 clientes", "mais de 2 anos"

Quando o usuário não forneceu números, INFIRA métricas realistas baseadas no contexto:
- Assistente de RH com mais de 2 anos → processou centenas de currículos, dezenas de vagas
- Dev júnior em agência → entregou múltiplos projetos, atendeu vários clientes
- Analista de marketing → gerenciou campanhas com orçamento, base de contatos
- Estagiário → volume menor mas quantificável ("apoiando mais de 3 projetos simultâneos")

EXEMPLOS POR ÁREA:

RH/Administrativo:
- "Processo triagem de mais de 100 currículos/mês para vagas técnicas e administrativas, reduzindo o tempo médio de seleção para 15 dias"
- "Coordeno logística de entrevistas para mais de 5 vagas simultâneas, agendando em média 40 entrevistas/mês entre candidatos e gestores"

Desenvolvimento:
- "Desenvolvo e mantenho mais de 8 sites institucionais e e-commerces em WordPress, atendendo clientes de diversos segmentos"
- "Implemento funcionalidades front-end em React.js para 3 produtos em produção, atendendo base de mais de 2.000 usuários"

Marketing:
- "Gerencio campanhas de email marketing com base de mais de 5.000 contatos, alcançando taxa de abertura média de 22%"
- "Produzo conteúdo otimizado para SEO, contribuindo para aumento de 40% no tráfego orgânico em 6 meses"

Verbos preferidos: desenvolvi, liderei, otimizei, implementei, reduzi, aumentei, automatizei, configurei, migrei, refatorei, gerenciei, coordenei, processei, estruturei.

Quantidade MÍNIMA por experiência:
- Principal (mais recente/relevante): 4-5 bullets
- Secundárias: 3-4 bullets
- Antigas/curtas (< 6 meses): 2-3 bullets
- NUNCA menos de 2 bullets em NENHUMA experiência
- O total de bullets no currículo deve ser no MÍNIMO 8

════════════════════════════════════════
REGRA 4 — HABILIDADES (CATEGORIZAÇÃO OBRIGATÓRIA)
════════════════════════════════════════
FAÇA:
- Organize SEMPRE por categoria quando há mais de 5 itens (Front-end | Back-end | Banco de Dados | Ferramentas | etc.)
- Cada skill entry usa o campo "category" para indicar o grupo
- Inclua ferramentas implícitas: GitHub → "Git, GitHub"; deploy Vercel → "Vercel"; CMS → nome do CMS
- Para tech: SEMPRE inclua Git se há repositórios

NUNCA:
- Tecnologias sem sustentação em experiência ou projetos
- Soft skills na seção de skills técnicas
- Versões específicas desatualizadas ("React 16" → apenas "React.js")

════════════════════════════════════════
REGRA 5 — MÉTRICAS (INVIOLÁVEL)
════════════════════════════════════════
Nenhum currículo pode ter ZERO números. MÍNIMO OBRIGATÓRIO de 3 dados quantitativos:
  1. Pelo menos 1 no resumo profissional
  2. Pelo menos 1 nos bullets de experiência
  3. Pelo menos 1 nos projetos (se houver) ou em outra seção

Inferências PERMITIDAS:
- Dev em agência → "+X sites desenvolvidos/mantidos"
- Freelancer → "X projetos entregues para clientes reais"
- Experiência de X meses → usar "X meses de experiência" ou "mais de X anos"
- Volume implícito → "múltiplos projetos", "diversos clientes", "carteira de +X clientes"

PROIBIDO inventar:
- Porcentagens exatas sem base ("reduziu 40%")
- Nomes de clientes não mencionados
- Certificações ou premiações não declaradas
- Valores financeiros específicos

TEMPO DE EXPERIÊNCIA (INVIOLÁVEL):
Calcule o tempo REAL baseado nas datas do input:
- Use a data de início da PRIMEIRA experiência até hoje (ou até a data de fim mais recente)
- Freelance sem CNPJ conta como experiência COMPLEMENTAR
- FÓRMULA: meses = (ano_atual - ano_inicio) * 12 + (mes_atual - mes_inicio)
  Se meses < 12 → "X meses de experiência"
  Se meses >= 12 e < 24 → "mais de 1 ano de experiência"
  Se meses >= 24 e < 36 → "mais de 2 anos de experiência"
- NUNCA arredonde para cima agressivamente. Na dúvida, use o valor MENOR.
- EXEMPLO CONCRETO: CLT começou Jul 2024, data atual Mar 2026 → ~1 ano e 8 meses → use "mais de 1 ano de experiência", NÃO "mais de 2 anos".
- Freelance é experiência COMPLEMENTAR — não some tempo de freelance com CLT agressivamente.
  Freelance sem CNPJ ou contrato formal → mencione como "experiência freelance" separada.
- É melhor ser modesto e correto do que inflado e desmascarado em entrevista.

════════════════════════════════════════
REGRA 6 — PRESERVAÇÃO DE DADOS (INVIOLÁVEL)
════════════════════════════════════════
PRINCÍPIO: Na dúvida entre "melhorar" e "preservar", PRESERVE.
Sua função é ORGANIZAR e POLIR, não REESCREVER a história do candidato.
O input é a fonte de verdade — o output é uma versão melhor formatada dele.

PROIBIÇÃO 1 — TECNOLOGIAS:
  Toda tecnologia, framework, ferramenta ou linguagem mencionada no input
  DEVE aparecer no output (em skills OU em bullets). Se o candidato escreveu
  "Python, Django, PostgreSQL", as TRÊS devem estar presentes. Não omita
  por "falta de relevância" — quem decide relevância é o candidato.

PROIBIÇÃO 2 — CARGOS DE LIDERANÇA:
  Se o input diz "líder", "coordenador", "supervisor", "tech lead",
  "gestor" ou similar → PRESERVE o cargo exato e DESTAQUE nos bullets
  (ex: "Liderei equipe de X pessoas"). NUNCA rebaixe para cargo individual.

PROIBIÇÃO 3 — RESPONSABILIDADES:
  Se o candidato descreveu uma responsabilidade ("gerenciei", "coordenei",
  "fui responsável por") → mantenha OU melhore com verbo de ação mais forte.
  NUNCA reduza escopo nem remova responsabilidades.

PROIBIÇÃO 4 — NOMES PRÓPRIOS:
  Nomes de empresas, instituições, cursos e certificações devem ser mantidos
  EXATAMENTE como fornecidos. Corrija APENAS erros ortográficos óbvios
  (ex: "Javascrip" → "JavaScript", "Pyton" → "Python").

PROIBIÇÃO 5 — DATAS:
  Datas de início/fim de empregos e formação devem ser preservadas
  fielmente. NUNCA altere, arredonde ou omita períodos.

PROIBIÇÃO 6 — NÍVEIS DE IDIOMA:
  Se o candidato declarou "Inglês Avançado" → output = "Avançado".
  NUNCA faça downgrade (Avançado → Intermediário). Upgrade só se houver
  evidência concreta (certificação internacional, experiência em empresa
  estrangeira, publicações em inglês).

PROIBIÇÃO 7 — QUANTIDADE DE EXPERIÊNCIAS:
  Se o candidato listou 4 empregos → output deve ter 4 work entries.
  NUNCA consolide ou remova experiências por "brevidade".

Se QUALQUER item acima foi violado → corrija ANTES de retornar.
Se removeu algo inevitavelmente → REGISTRE em generationNotes.warnings com justificativa.

════════════════════════════════════════
REGRA 7 — ORDEM DAS SEÇÕES POR NÍVEL
════════════════════════════════════════
Identifique o nível e REGISTRE em generationNotes.candidateLevel:

ESTAGIÁRIO / JÚNIOR (< 2 anos):
  Resumo → Habilidades → Projetos → Experiência → Formação → Idiomas

PLENO (2-5 anos):
  Resumo → Habilidades → Experiência → Projetos (se relevantes) → Formação → Idiomas

SÊNIOR / ESPECIALISTA (mais de 5 anos):
  Resumo → Experiência → Habilidades → (Projetos, se fornecidos) → Formação → Certificações → Idiomas
  Projetos inferidos podem ser incorporados às experiências, MAS projetos explicitamente
  listados no input pelo candidato DEVEM ser mantidos no array 'projects'.

════════════════════════════════════════
REGRA 8 — EDUCAÇÃO, IDIOMAS E PROJETOS
════════════════════════════════════════
EDUCAÇÃO:
- Conclusão no futuro → status: "Em andamento" e endDate com "Conclusão prevista: MM/YYYY"
- Conclusão no passado → status: "Concluído"
- NUNCA omita educação se o candidato forneceu dados

IDIOMAS:
- Para perfis TECH: SEMPRE inclua Inglês (mínimo: "Básico (leitura técnica)")
- Escala: Nativo | Fluente | Avançado | Intermediário | Básico
- NUNCA omita idiomas

PROJETOS:
- PRESERVAÇÃO INVIOLÁVEL: se o input contém um array 'projects' ou 'projetos' com itens preenchidos
  (com 'name'/'nome'), CADA item DEVE aparecer no array 'projects' do output — independente do nível
  do candidato (estagiário, júnior, pleno, sênior ou especialista). NUNCA omita projetos fornecidos
  explicitamente pelo usuário. NUNCA mova para 'volunteer' mesmo se 'type' for "Trabalho Voluntário"
  ou similar — o template renderiza apenas 'projects'.
- Mapeamento de campos do input para o schema:
  · 'name'/'nome' → 'name'
  · 'description'/'descricao' → 'description' (preserve o conteúdo; pode polir verbos de ação)
  · 'link'/'url' → 'url' (sanitize URL; se for repositório git, pode também ir em 'repository')
  · 'type'/'tipo' (ex: "Projeto Pessoal", "Trabalho Voluntário", "Freelance", "Open Source"):
    se relevante, mencione na descrição (ex: "Trabalho voluntário | ..."). NÃO descarte.
  · 'startDate' do input → 'startDate' do schema (formato YYYY-MM, preserve exatamente).
  · 'endDate' do input → 'endDate' do schema (formato YYYY-MM, ou "atual" se vazio/sem fim).
    NUNCA descarte as datas — elas DEVEM aparecer nos campos 'startDate'/'endDate' do projeto.
    NÃO anexe as datas dentro da descrição — use os campos dedicados.
  · 'technologies': pode ficar [] se não inferíveis com segurança do contexto.
  · 'highlights': pode ficar [] — NUNCA invente bullets sem base no input.
- Cada projeto: nome + descrição (1-2 linhas) + tecnologias (se inferíveis) + link (se houver).
- LIDERANÇA EM PROJETOS (INVIOLÁVEL): se o input menciona liderança, coordenação ou
  protagonismo em um projeto, essa informação DEVE aparecer em TRÊS lugares:
  1. No resumo profissional (menção breve)
  2. Como highlights[0] do projeto — OBRIGATORIAMENTE o PRIMEIRO highlight, com verbo de ação.
     Ex: input "participei da liderança do projeto Laçoos"
     → highlights[0] = "Liderei o desenvolvimento da plataforma, coordenando equipe na implementação de recursos de acessibilidade"
  3. Se aplicável, nos bullets da experiência de trabalho correspondente.
  NÃO dilua liderança apenas na description genérica — ela DEVE ser o primeiro bullet.

════════════════════════════════════════
REGRA 9 — DADOS PROIBIDOS E INFERÊNCIAS
════════════════════════════════════════
REMOVA SEMPRE: data de nascimento, CPF/RG, religião, gênero, foto, estado civil,
pretensão salarial, endereço completo (apenas Cidade - Estado), referências.

INFERÊNCIAS PERMITIDAS:
✅ Volume aproximado ("múltiplos projetos", "carteira de clientes")
✅ Ferramentas implícitas (dev com GitHub → Git; dev React → npm/yarn)
✅ Inglês técnico mínimo para perfil tech
✅ Metodologias pelo contexto (Scrum, Kanban)

INFERÊNCIAS PROIBIDAS:
❌ Percentuais específicos sem fonte
❌ Valores monetários inventados
❌ Nomes de clientes/empresas não fornecidos
❌ Prêmios/certificações não mencionados

════════════════════════════════════════
REGRA 10 — PERSONALIZAÇÃO POR VAGA
════════════════════════════════════════
Se JD fornecido: espelhe keywords (70%+ presentes), use título da vaga, priorize experiências alinhadas.
Se sem JD: currículo de uso geral otimizado para o cargo/área inferido.

════════════════════════════════════════
REGRA 11 — ANTI-CLICHÊ (CRÍTICA)
════════════════════════════════════════
NUNCA use estas expressões em NENHUMA parte do currículo:
- "profissional dedicado/comprometido/proativo"
- "apaixonado por tecnologia/inovação"
- "busco novos desafios/crescimento profissional"
- "orientado a resultados"
- "excelente comunicador"
- "trabalho bem em equipe"
- "pensamento crítico"
- "solucionador de problemas"
- "habilidades interpessoais"
- "vasta experiência" (substitua por "X anos de experiência")

Se o INPUT contém clichê → SUBSTITUA por dado concreto ou remova.
Se não há dado para substituir → simplesmente omita a frase.

════════════════════════════════════════
REGRA 12 — IDIOMA DO CURRÍCULO (INVIOLÁVEL)
════════════════════════════════════════
O currículo DEVE ser escrito no MESMO idioma do input do candidato.
Se input em PT-BR → output inteiro em PT-BR.
Se input em EN → output inteiro em EN.

NUNCA traduza termos técnicos consagrados:
- "deploy", "sprint", "scrum", "pipeline", "cloud" → mantenha em inglês
- "desenvolvedor full-stack" → OK, não traduza para "pilha completa"
- Nomes de ferramentas/frameworks → SEMPRE em inglês (React.js, Node.js, Docker)

NUNCA faça downgrade linguístico:
- Input "implementei" → output "implementei" (não "fiz")
- Input "arquitetura de microsserviços" → output preserva (não "sistema dividido")

════════════════════════════════════════
REGRA 13 — CORREÇÕES ORTOGRÁFICAS
════════════════════════════════════════
Corrija SILENCIOSAMENTE erros comuns sem registrar em warnings:
- "Javascrip/Javacript" → "JavaScript"
- "Pyton/Phyton" → "Python"
- "Typscript" → "TypeScript"
- "Reack/Raect" → "React.js"
- "Angullar" → "Angular"
- "Tailwid" → "Tailwind CSS"
- "Postgre/Postgress" → "PostgreSQL"
- "Mongo" → "MongoDB" (se contexto indica banco)
- "Doker/Dokcer" → "Docker"
- "Kubernets" → "Kubernetes"
- "Agilididade/Metodologia agil" → "Metodologias Ágeis"
- Qualquer nome de tecnologia com typo → corrija para grafia oficial

NÃO registre estas correções em warnings — são correções implícitas.

════════════════════════════════════════
REGRA 14 — CONSISTÊNCIA DE PESSOA VERBAL
════════════════════════════════════════
Todo o currículo DEVE usar a MESMA pessoa verbal. NUNCA misture.

PADRÃO OBRIGATÓRIO:
- Bullets de experiência (highlights): 1ª pessoa do singular → "Desenvolvo", "Implemento", "Gerencio", "Liderei", "Coordenei"
- Resumo profissional: construção impessoal/participial → "Desenvolvedor com X anos... atuando em...", "especializado em..."

❌ PROIBIDO (mistura de pessoa):
- "Atuando como desenvolvedor... Liderou o desenvolvimento do projeto" → 3ª pessoa misturada
- "Desenvolvo APIs REST... Implementou testes unitários" → 1ª e 3ª pessoa no mesmo bloco
- "Profissional que Lidera equipe de 5 pessoas" → 3ª pessoa

✅ CORRETO:
- "Atuando como desenvolvedor... Liderei o desenvolvimento do projeto" (1ª pessoa consistente)
- "Desenvolvo APIs REST... Implemento testes unitários" (1ª pessoa presente consistente)
- "Profissional que lidera equipe de 5 pessoas" → OK em construção relativa no resumo

REGRA: Se o bullet usa presente ("Desenvolvo"), TODOS devem usar presente.
Se usa pretérito ("Desenvolvi"), TODOS devem usar pretérito.
NUNCA use 3ª pessoa ("Desenvolveu", "Lidera") em bullets ou resumo.

════════════════════════════════════════
SCHEMA JSON DE SAÍDA
════════════════════════════════════════
Responda EXCLUSIVAMENTE com o JSON abaixo. Nenhum texto fora. Nenhum markdown.

${RESUME_SCHEMA_JSON}

Arrays vazios ([]) para seções sem dados. O campo generationNotes é obrigatório.

════════════════════════════════════════
EXEMPLOS COMPLETOS (input → output)
════════════════════════════════════════

--- EXEMPLO 1: DESENVOLVEDOR FRONT-END JÚNIOR ---

INPUT:
{"nome":"Lucas Fernandes","email":"lucas@email.com","telefone":"(11) 98765-4321","cidade":"São Paulo - SP","linkedin":"linkedin.com/in/lucasf","github":"github.com/lucasf","objetivo":"Desenvolvedor Front-end","experiencia":[{"empresa":"Agência Pixel","cargo":"Estagiário de Desenvolvimento","inicio":"2024-02","fim":"atual","descricao":"trabalho com sites em WordPress e HTML/CSS, ajudo no suporte aos clientes"}],"formacao":[{"instituicao":"FATEC São Paulo","curso":"Desenvolvimento de Software Multiplataforma","inicio":"2023-02","fim":"2025-12"}],"habilidades":"HTML, CSS, JavaScript, React, WordPress","projetos":[{"nome":"TaskFlow","descricao":"app de gerenciamento de tarefas da faculdade","tecnologias":"React, Firebase","link":"taskflow-app.vercel.app"}],"idiomas":"Português nativo"}

OUTPUT ESPERADO (adapte ao candidato real, nunca copie literalmente):
{
  "resume": {
    "basics": {
      "name": "Lucas Fernandes",
      "label": "Desenvolvedor Front-end Júnior",
      "email": "lucas@email.com",
      "phone": "(11) 98765-4321",
      "location": "São Paulo - SP",
      "summary": "Estagiário de Desenvolvimento Front-end com 1 ano de experiência na Agência Pixel, atuando na criação e manutenção de sites em WordPress e HTML/CSS para múltiplos clientes. Cursando Desenvolvimento de Software Multiplataforma na FATEC São Paulo (conclusão prevista: 12/2025). Desenvolveu o TaskFlow, aplicação de gerenciamento de tarefas com React e Firebase em produção.",
      "linkedin": "https://linkedin.com/in/lucasf",
      "github": "https://github.com/lucasf",
      "website": ""
    },
    "work": [{
      "company": "Agência Pixel",
      "position": "Estagiário de Desenvolvimento",
      "startDate": "2024-02",
      "endDate": "atual",
      "location": "São Paulo - SP",
      "highlights": [
        "Desenvolvo e mantenho mais de 5 sites institucionais e landing pages em WordPress, HTML5 e CSS3 para clientes de diversos segmentos da agência.",
        "Implemento customizações de temas e funcionalidades com JavaScript, entregando projetos com aprovação em primeira revisão para 90% dos clientes.",
        "Presto suporte técnico a mais de 10 clientes ativos, resolvendo em média 8 chamados/semana relacionados a exibição e funcionalidade em produção."
      ]
    }],
    "education": [{"institution": "FATEC São Paulo", "area": "Desenvolvimento de Software Multiplataforma", "studyType": "Tecnólogo", "startDate": "2023-02", "endDate": "2025-12", "status": "Em andamento"}],
    "skills": [
      {"category": "Front-end", "name": "HTML5, CSS3, JavaScript (ES6+), React.js", "level": ""},
      {"category": "CMS", "name": "WordPress", "level": ""},
      {"category": "Back-end / BaaS", "name": "Firebase", "level": ""},
      {"category": "Ferramentas", "name": "Git, GitHub, VS Code, Vercel", "level": ""}
    ],
    "projects": [{"name": "TaskFlow", "description": "Aplicação web de gerenciamento de tarefas com criação, edição e organização por status.", "highlights": [], "technologies": ["React.js", "Firebase", "CSS3"], "url": "https://taskflow-app.vercel.app", "repository": ""}],
    "languages": [{"language": "Português", "fluency": "Nativo"}, {"language": "Inglês", "fluency": "Básico (leitura técnica)"}],
    "certifications": [],
    "volunteer": []
  },
  "formattedText": "",
  "generationNotes": {
    "inferredData": ["Git/GitHub inferido pelo GitHub público", "Vercel inferido pelo domínio vercel.app", "Inglês leitura técnica inferido pelo perfil tech"],
    "missingImpactData": ["Quantidade de sites desenvolvidos na agência", "Número de clientes atendidos", "Métricas do TaskFlow"],
    "warnings": [],
    "candidateLevel": "estagiário",
    "targetJobDetected": "Desenvolvedor Front-end"
  }
}

--- EXEMPLO 2: ANALISTA DE MARKETING DIGITAL PLENO ---

INPUT:
{"nome":"Carla Ribeiro","email":"carla@email.com","telefone":"(21) 97654-3210","cidade":"Rio de Janeiro - RJ","linkedin":"linkedin.com/in/carlaribeiro","objetivo":"Coordenadora de Marketing Digital","experiencia":[{"empresa":"Agência Impulse","cargo":"Analista de Marketing Digital","inicio":"2023-01","fim":"atual","descricao":"gerencio campanhas no Google Ads e Meta Ads, otimizo performance e faço relatórios"},{"empresa":"E-commerce VitaBrasil","cargo":"Assistente de Marketing","inicio":"2021-03","fim":"2022-12","descricao":"email marketing, SEO, conteúdo para blog"}],"formacao":[{"instituicao":"UFRJ","curso":"Publicidade e Propaganda","inicio":"2017-03","fim":"2021-07"}],"habilidades":"Google Ads, Meta Ads, Google Analytics, SEO, Email Marketing, Copywriting, Excel","idiomas":"Português nativo, Inglês avançado"}

OUTPUT ESPERADO:
{
  "resume": {
    "basics": {
      "name": "Carla Ribeiro",
      "label": "Analista de Marketing Digital",
      "email": "carla@email.com",
      "phone": "(21) 97654-3210",
      "location": "Rio de Janeiro - RJ",
      "summary": "Analista de Marketing Digital com mais de 3 anos de experiência em gestão de campanhas pagas e marketing de conteúdo em agência e e-commerce. Gerencio campanhas de Google Ads e Meta Ads com foco em otimização de performance e redução de custos de aquisição. Formada em Publicidade pela UFRJ (2021). Busco posição de Coordenação de Marketing Digital.",
      "linkedin": "https://linkedin.com/in/carlaribeiro",
      "github": "",
      "website": ""
    },
    "work": [
      {
        "company": "Agência Impulse",
        "position": "Analista de Marketing Digital",
        "startDate": "2023-01",
        "endDate": "atual",
        "location": "Rio de Janeiro - RJ",
        "highlights": [
          "Gerencio campanhas de mídia paga no Google Ads e Meta Ads para mais de 8 clientes simultâneos, otimizando CPA e ROAS com orçamento agregado de mais de R$50.000/mês.",
          "Elaboro relatórios mensais de performance para cada cliente com análise de ROI, embasando decisões que redistribuíram 30% do orçamento para canais mais rentáveis.",
          "Otimizo segmentação de público e criativos via A/B testing, elevando CTR médio das campanhas de 1.2% para 2.5% em 6 meses."
        ]
      },
      {
        "company": "E-commerce VitaBrasil",
        "position": "Assistente de Marketing",
        "startDate": "2021-03",
        "endDate": "2022-12",
        "location": "Rio de Janeiro - RJ",
        "highlights": [
          "Executei campanhas de email marketing para base de mais de 3.000 contatos, alcançando taxa de abertura de 25% e contribuindo para aumento de 15% nas vendas recorrentes.",
          "Produzi mais de 40 artigos otimizados para SEO no blog da empresa, contribuindo para crescimento de 60% no tráfego orgânico ao longo de 12 meses."
        ]
      }
    ],
    "education": [{"institution": "Universidade Federal do Rio de Janeiro (UFRJ)", "area": "Publicidade e Propaganda", "studyType": "Bacharelado", "startDate": "2017-03", "endDate": "2021-07", "status": "Concluído"}],
    "skills": [
      {"category": "Marketing", "name": "Google Ads, Meta Ads", "level": ""},
      {"category": "Analytics", "name": "Google Analytics / GA4", "level": ""},
      {"category": "Marketing", "name": "SEO, Email Marketing", "level": ""},
      {"category": "Conteúdo", "name": "Copywriting", "level": ""},
      {"category": "Ferramentas", "name": "Excel, Google Sheets", "level": ""}
    ],
    "projects": [],
    "languages": [{"language": "Português", "fluency": "Nativo"}, {"language": "Inglês", "fluency": "Avançado"}],
    "certifications": [],
    "volunteer": []
  },
  "formattedText": "",
  "generationNotes": {
    "inferredData": ["Google Sheets inferido pelo contexto de marketing digital", "UFRJ expandido para nome completo"],
    "missingImpactData": ["Número de clientes gerenciados", "Orçamento mensal de campanhas", "Métricas de SEO (tráfego, ranking)", "Taxa de conversão de email marketing"],
    "warnings": [],
    "candidateLevel": "pleno",
    "targetJobDetected": "Coordenadora de Marketing Digital"
  }
}

════════════════════════════════════════
SELF-CHECK OBRIGATÓRIO (execute antes de retornar)
════════════════════════════════════════
BLOCO 1 — PRESERVAÇÃO (compare input × output):
□ Toda tecnologia do input está em skills ou bullets? → Se faltou, ADICIONE
□ Cargos de liderança foram mantidos com mesmo nível? → Se rebaixou, CORRIJA
□ Níveis de idioma iguais ou superiores ao input? → Se downgrade, REVERTA
□ Quantidade de experiências igual ao input? → Se removeu, RESTAURE
□ Datas de emprego/formação preservadas? → Se alterou, CORRIJA
□ Responsabilidades e escopo mantidos? → Se reduziu, RESTAURE

BLOCO 2 — QUALIDADE:
□ Resumo tem ao menos 1 número/métrica? → Se não, adicione ("X anos", "+X projetos")
□ CADA bullet responde "e daí?" ou "quanto?"? → Se não, adicione resultado/volume
□ Mínimo 3 bullets na experiência principal? → Se menos, expanda
□ Total de bullets no currículo ≥ 8? → Se menos, adicione
□ Skills categorizadas com rótulos? → Se lista plana, reorganize
□ Ao menos 3 dados quantitativos no currículo? → Se menos, infira conservadoramente
□ ZERO clichês presentes? → Se encontrou, substitua ou remova

BLOCO 3 — ESTRUTURA:
□ Nível do candidato correto? Júnior → projetos antes de experiência
□ Dados sensíveis removidos? (CPF, nascimento, estado civil)
□ generationNotes completo? (inferredData, missingImpactData, warnings, candidateLevel)
□ Educação e idiomas presentes? NUNCA omitir
□ JSON válido e completo? Sem truncamento?

Se QUALQUER item falhou → corrija ANTES de retornar. Prioridade: Bloco 1 > Bloco 2 > Bloco 3.

════════════════════════════════════════
INSTRUÇÕES FINAIS
════════════════════════════════════════
1. Responda SOMENTE com JSON válido. Zero texto fora. Sem markdown, sem backticks.
2. Campos sem dados: "" ou []. Não invente campos fora do schema.
3. JSON parseável com JSON.parse(). NUNCA truncar. Complete integralmente.
4. Não use caracteres de controle dentro de strings. Use \\n se necessário.
5. O campo generationNotes é OBRIGATÓRIO em toda resposta.`;

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

  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(payload));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return "resume:" + hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// ── Quality check + auto-fix pipeline ────────────────────

function runQualityPipeline(
  resume: ResumeSchema,
  generationNotes?: GenerationNotes | null,
  originalInput?: string,
): { resume: ResumeSchema; quality: QualityReport; autoFixesApplied: string[]; preservationIssues: PreservationIssue[] } {
  // Quality check BEFORE auto-fix to assess raw AI output quality (retry decision)
  const quality = validateResumeQuality(resume, generationNotes);

  // Then apply auto-fixes for the actual output
  const { fixed, applied } = applyAutoFixes(resume);

  // Preservation check (input vs output)
  let preservationIssues: PreservationIssue[] = [];
  if (originalInput) {
    preservationIssues = validatePreservation(originalInput, fixed);
    // Convert preservation issues to quality issues
    for (const pi of preservationIssues) {
      quality.issues.push({
        severity: "critical",
        field: `preservation.${pi.type}`,
        message: pi.detail,
        autoFixable: pi.type === "tech_missing",
      });
    }
    // Recalculate score
    const criticalCount = quality.issues.filter(i => i.severity === "critical").length;
    const warningCount = quality.issues.filter(i => i.severity === "warning").length;
    const infoCount = quality.issues.filter(i => i.severity === "info").length;
    quality.score = Math.max(0, Math.min(100, 100 - criticalCount * 20 - warningCount * 8 - infoCount * 2));
    quality.passed = quality.score >= 70;
  }

  return { resume: fixed, quality, autoFixesApplied: applied, preservationIssues };
}

// ── Retry with focused correction prompt ─────────────────

async function retryWithCorrection(
  originalFormData: string,
  failedResume: ResumeSchema,
  quality: QualityReport,
): Promise<string | null> {
  const criticalIssues = quality.issues
    .filter(i => i.severity === "critical")
    .map(i => `- [${i.field}]: ${i.message}`)
    .join("\n");

  if (!criticalIssues) return null;

  console.log("[ResumeCreation] Quality check failed, retrying with correction prompt...");

  // Detect bullet impact issue for specific instructions
  const bulletImpactIssue = quality.issues.find(i => i.field === "work.highlights.impact");

  const correctionMessage = `O currículo gerado anteriormente FALHOU na validação de qualidade.

PROBLEMAS CRÍTICOS QUE VOCÊ PRECISA CORRIGIR:
${criticalIssues}

INSTRUÇÕES DE CORREÇÃO OBRIGATÓRIAS:
1. Se o resumo profissional NÃO contém dados quantitativos: adicione pelo menos 1 métrica realista
   (ex: "X anos de experiência", "atuando em +X projetos", "suporte a +X candidatos/mês").
2. Se os bullets de experiência não têm indicadores de resultado: para CADA bullet, adicione
   contexto numérico ou resultado mensurável. Use inferências conservadoras quando necessário.
3. O currículo DEVE ter no MÍNIMO 3 dados quantitativos distribuídos entre resumo, bullets e projetos.
4. NUNCA invente métricas específicas sem base — prefira volume aproximado ("+X", "múltiplos") a percentuais inventados.
5. Se há clichês detectados: SUBSTITUA por dados concretos ou REMOVA completamente.
${bulletImpactIssue ? `
CORREÇÃO OBRIGATÓRIA DE BULLETS:
${bulletImpactIssue.message}.
Reescreva CADA bullet adicionando contexto numérico ou resultado mensurável.
Formato: VERBO DE AÇÃO + O QUE FEZ + RESULTADO/IMPACTO.
Teste cada bullet: ele responde "e daí?" ou "quanto?"? Se não → reescreva.
Exemplos:
❌ "Realizo triagem de currículos para múltiplas vagas" → SEM RESULTADO
✅ "Realizo triagem de mais de 50 currículos por processo seletivo, reduzindo tempo de pré-seleção para 15 dias"
❌ "Desenvolvo landing pages para clientes" → SEM VOLUME
✅ "Desenvolvo mais de 10 landing pages para clientes da agência, com foco em conversão e performance mobile"
Infira métricas realistas do contexto quando o candidato não forneceu números exatos.` : ""}

IMPORTANTE: Você pode inferir métricas realistas quando o usuário não forneceu dados exatos,
mas NUNCA invente cargos, empresas, formações ou certificações.

Currículo que precisa de correção:
${JSON.stringify({ resume: failedResume })}

Dados originais do candidato:
${originalFormData}

Retorne o JSON completo corrigido seguindo o mesmo schema. Inclua generationNotes atualizado.
Adicione os problemas corrigidos em generationNotes.warnings.`;

  try {
    const result = await generateWithCache(
      RESUME_CREATION_SYSTEM_PROMPT,
      correctionMessage,
      { maxTokens: 8000, temperature: 0.2 }
    );
    return result.content;
  } catch (error) {
    console.error("[ResumeCreation] Retry failed:", error);
    return null;
  }
}

// ── Main creation function ───────────────────────────────

export async function createResumeFromData(formData: string): Promise<string> {
  // 1. Check cache
  const cacheKey = await generateCacheKey(formData);
  const cached = cache.get<string>(cacheKey);
  if (cached) {
    console.log("[ResumeCreation] Cache HIT");
    return cached;
  }
  console.log("[ResumeCreation] Cache MISS — calling AI");

  // 2. Generate with DeepSeek
  let userMessage = `Crie um currículo profissional com base nos seguintes dados do usuário:\n\n${formData}`;
  try {
    const formParsed = JSON.parse(formData);
    if (formParsed.targetJob) {
      userMessage += `\n\n════════════════════════════════════════\nVAGA-ALVO DO CANDIDATO:\n${formParsed.targetJob}\n════════════════════════════════════════\nUse esta vaga como referência para: espelhar keywords da vaga nos bullets e skills, adaptar o título profissional (basics.label) ao cargo pretendido, priorizar experiências e habilidades alinhadas com os requisitos. Registre a vaga detectada em generationNotes.targetJobDetected.`;
    }
  } catch {
    // formData is not valid JSON, use as-is
  }
  const result = await generateWithCache(
    RESUME_CREATION_SYSTEM_PROMPT,
    userMessage,
    { maxTokens: 8000, temperature: 0.3 }
  );

  // 3. Validate schema & normalize
  const parsed = parseAndValidateResponse(result.content);

  // 3.5. Post-process: deterministic corrections the AI consistently ignores
  const { schema: postProcessed, corrections: postCorrections, qualityFlags } = postProcessResume(parsed.resume, formData);
  parsed.resume = postProcessed;
  parsed.postCorrections = postCorrections;
  parsed.qualityFlags = qualityFlags;
  if (postCorrections.length > 0) {
    console.log("[ResumeCreation] Post-processing corrections:", postCorrections);
  }
  if (qualityFlags.length > 0) {
    console.log("[ResumeCreation] Quality flags:", qualityFlags);
  }

  // 4. Quality validation + auto-fix + preservation check
  const { resume: fixedResume, quality, autoFixesApplied, preservationIssues } = runQualityPipeline(
    parsed.resume,
    parsed.generationNotes,
    formData,
  );
  parsed.resume = fixedResume;

  console.log(`[ResumeCreation] Quality score: ${quality.score}/100 (${quality.passed ? "PASSED" : "FAILED"})`);
  if (quality.issues.length > 0) {
    console.log("[ResumeCreation] Issues:", quality.issues.map(i => `[${i.severity}] ${i.field}: ${i.message}`).join("; "));
  }

  if (autoFixesApplied.length > 0) {
    console.log("[ResumeCreation] Auto-fixes applied:", autoFixesApplied);
  }
  if (preservationIssues.length > 0) {
    console.warn("[ResumeCreation] Preservation issues:", preservationIssues);
  }

  // 5. If quality still fails, retry once with correction prompt
  if (!quality.passed) {
    console.log("[ResumeCreation] Quality score:", quality.score, "— retrying...");

    const retryRaw = await retryWithCorrection(formData, parsed.resume, quality);
    if (retryRaw) {
      try {
        const retryParsed = parseAndValidateResponse(retryRaw);
        const { schema: retryPostProcessed } = postProcessResume(retryParsed.resume, formData);
        retryParsed.resume = retryPostProcessed;
        const retryPipeline = runQualityPipeline(retryParsed.resume, retryParsed.generationNotes, formData);
        parsed.resume = retryPipeline.resume;
        parsed.generationNotes = retryParsed.generationNotes;
        parsed.qualityReport = retryPipeline.quality;

        console.log("[ResumeCreation] Retry quality score:", retryPipeline.quality.score);
      } catch (retryError) {
        console.warn("[ResumeCreation] Retry parse failed, using original:", retryError);
        parsed.qualityReport = quality;
      }
    } else {
      parsed.qualityReport = quality;
    }
  } else {
    parsed.qualityReport = quality;
  }

  // 6. Build final response
  const response = buildFinalResponse(parsed);

  // 7. Cache
  cache.set(cacheKey, response, TTL.resume);
  return response;
}

// ── Parse and validate AI response ───────────────────────

interface ParsedResponse {
  resume: ResumeSchema;
  formattedText: string;
  generationNotes: GenerationNotes | null;
  qualityReport?: QualityReport;
  postCorrections?: string[];
  qualityFlags?: string[];
}

function parseAndValidateResponse(raw: string): ParsedResponse {
  // Clean markdown artifacts
  const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("IA retornou resposta inválida (não é JSON)");
    parsed = JSON.parse(match[0]);
  }

  // Handle both formats: { resume: {...} } or direct schema
  const resumeData = (parsed.resume ?? parsed.resumeData ?? parsed) as Record<string, unknown>;
  const formattedText = (parsed.formattedText as string) || "";
  const generationNotes = (parsed.generationNotes as GenerationNotes) || null;

  // Log generation metadata
  if (generationNotes) {
    console.log("[ResumeCreation] Level:", generationNotes.candidateLevel);
    console.log("[ResumeCreation] Target:", generationNotes.targetJobDetected);
    if (generationNotes.warnings?.length > 0) {
      console.warn("[ResumeCreation] Warnings:", generationNotes.warnings);
    }
  }

  // Validate schema
  const validation = validateResumeSchema(resumeData);
  if (!validation.valid) {
    console.warn("[ResumeCreation] Validation errors:", validation.errors);
    throw new Error(`Curriculo gerado com erros: ${validation.errors.join(", ")}`);
  }
  if (validation.errors.length > 0) {
    console.warn("[ResumeCreation] Normalized fields:", validation.errors);
  }

  return {
    resume: validation.normalized!,
    formattedText,
    generationNotes,
  };
}

function buildFinalResponse(parsed: ParsedResponse): string {
  return JSON.stringify({
    resume: parsed.resume,
    resumeData: convertToLegacyFormat(parsed.resume),
    formattedText: parsed.formattedText || generateFormattedText(parsed.resume),
    generationNotes: parsed.generationNotes,
    qualityReport: parsed.qualityReport || null,
    postCorrections: parsed.postCorrections || [],
    qualityFlags: parsed.qualityFlags || [],
  });
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

  // Skills (grouped by category)
  if (resume.skills.length > 0) {
    lines.push("HABILIDADES");
    const categorized = new Map<string, string[]>();
    for (const s of resume.skills) {
      const cat = s.category || "Geral";
      if (!categorized.has(cat)) categorized.set(cat, []);
      categorized.get(cat)!.push(s.name);
    }
    if (categorized.size > 1) {
      categorized.forEach((skills, cat) => {
        lines.push(`  ${cat}: ${skills.join(", ")}`);
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
