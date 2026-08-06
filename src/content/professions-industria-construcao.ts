import type { Profession } from "./types";

// Profissões de indústria, logística e construção civil.
// As faixas em `salaryNote` são referências de mercado e variam por região,
// porte da empresa e convenção coletiva — mantenha o texto sempre com essa ressalva.
export const PROFESSIONS_INDUSTRIA_CONSTRUCAO: Profession[] = [
  {
    slug: "auxiliar-de-producao",
    profession: "Auxiliar de Produção",
    metaTitle: "Modelo de Currículo para Auxiliar de Produção (Exemplo 2026)",
    h1: "Modelo de Currículo para Auxiliar de Produção",
    metaDescription:
      "Modelo de currículo para auxiliar de produção pronto para preencher: exemplo real, habilidades, NRs, palavras-chave de ATS, faixa salarial e dicas para a triagem.",
    intro:
      "O currículo de auxiliar de produção é avaliado em poucos segundos por quem contrata em volume — indústrias que abrem dezenas de vagas de uma vez e precisam filtrar rápido. Nesse cenário, três coisas decidem: disponibilidade de turno, experiência em linha de produção e treinamentos de segurança em dia. Quem coloca essas informações no topo é chamado; quem esconde tudo no meio de um texto corrido não é. Este modelo mostra como estruturar o currículo para as duas realidades da vaga — a primeira experiência e o profissional que já rodou linha, embalagem e qualidade —, com exemplo pronto para adaptar.",
    sampleResume: {
      name: "Rafael Souza Lima",
      headline: "Auxiliar de Produção | Linha de Montagem e Embalagem | Disponibilidade para turnos",
      summary:
        "Auxiliar de produção com 4 anos de experiência em indústria de alimentos e de plásticos, atuando em linha de montagem, embalagem e controle visual de qualidade. Experiência com metas de produção por turno, preenchimento de fichas de controle, boas práticas de fabricação e rotina de 5S. Disponibilidade total para turnos e escala 6x1.",
      experience: [
        {
          role: "Auxiliar de Produção",
          company: "Indústria Alimentícia Bom Sabor",
          period: "Mai 2023 - Atual",
          bullets: [
            "Atuo na linha de embalagem de produtos secos, com meta média de 1.800 unidades por turno, mantendo o índice de refugo abaixo de 1,5%",
            "Realizo inspeção visual de qualidade (selagem, rotulagem, data de validade) e separo produtos não conformes conforme o POP da linha",
            "Preencho fichas de controle de produção e de parada de máquina, informando o líder sobre desvios de processo",
            "Sigo integralmente as Boas Práticas de Fabricação (BPF): uniforme completo, higienização de mãos, controle de utensílios e registro de temperatura da área",
            "Participo da rotina de 5S e da limpeza de setup na troca de produto, reduzindo o tempo de virada de linha",
          ],
        },
        {
          role: "Auxiliar de Produção (Linha de Montagem)",
          company: "Plastimax Indústria de Embalagens",
          period: "Fev 2022 - Abr 2023",
          bullets: [
            "Operei posto fixo em linha de montagem de embalagens plásticas, em escala 6x1 com revezamento de turnos",
            "Abasteci a linha com matéria-prima e realizei conferência de lote e etiqueta antes da entrada no processo",
            "Auxiliei na paletização e identificação de produto acabado para expedição, com uso de transpaleteira manual",
            "Cumpri integralmente as normas de segurança da área, com uso obrigatório de EPI e participação nos DDS diários",
          ],
        },
      ],
      education: [
        {
          degree: "Ensino Médio Completo",
          institution: "EE Professor Alípio de Barros",
          period: "Concluído em 2021",
        },
        {
          degree: "NR-12 (Segurança em Máquinas e Equipamentos) e NR-06 (EPI)",
          institution: "Treinamento interno — Plastimax",
          period: "2022",
        },
      ],
      skills: [
        "Linha de montagem e embalagem",
        "Controle visual de qualidade",
        "Boas Práticas de Fabricação (BPF)",
        "Preenchimento de fichas de produção",
        "Metodologia 5S",
        "Transpaleteira manual",
        "Uso correto de EPI",
        "Disponibilidade para turnos e escala 6x1",
      ],
    },
    keySkills: [
      "Atuação em linha de produção e montagem",
      "Embalagem, paletização e identificação de produto",
      "Inspeção visual de qualidade e separação de não conformes",
      "Preenchimento de fichas e apontamento de produção",
      "Boas Práticas de Fabricação (BPF) e higienização",
      "Metodologia 5S e organização de posto de trabalho",
      "Normas regulamentadoras (NR-06, NR-11, NR-12, NR-35 quando aplicável)",
      "Trabalho em ritmo de meta e cadência de linha",
      "Disponibilidade para turnos, escala 6x1 e horas extras",
      "Trabalho em equipe e comunicação com liderança de turno",
    ],
    atsKeywords: [
      "Auxiliar de Produção",
      "Operador de Produção",
      "Linha de Montagem",
      "Embalagem",
      "Paletização",
      "Controle de Qualidade",
      "Boas Práticas de Fabricação",
      "BPF",
      "5S",
      "NR-12",
      "NR-06",
      "NR-11",
      "EPI",
      "Escala 6x1",
      "Turno",
      "Apontamento de Produção",
      "Refugo",
      "Setup de Linha",
      "Transpaleteira",
      "Indústria",
    ],
    salaryNote:
      "No Brasil (2026), o auxiliar de produção costuma receber entre R$ 1.700 e R$ 2.600, com adicional de insalubridade ou periculosidade em algumas operações e adicional noturno para turnos. Indústrias químicas, automotivas e de bebidas costumam pagar acima da média, e o piso da categoria é definido por convenção coletiva do sindicato da região — vale conferir a convenção vigente antes de negociar.",
    dos: [
      "Coloque a disponibilidade de turno logo no topo, junto ao contato: é o primeiro filtro em quase toda vaga de produção.",
      "Cite o segmento da indústria em que atuou (alimentos, plástico, automotivo, farmacêutico) — a experiência no mesmo setor pesa muito.",
      "Informe volumes e metas: unidades por turno, índice de refugo, número de postos operados.",
      "Liste as NRs que você tem em dia, com o ano do treinamento, e mencione se está válida.",
      "Mencione escala trabalhada (6x1, 5x2, 12x36) e experiência com revezamento de turnos.",
      "Se tem experiência com transpaleteira, paleteira elétrica ou empilhadeira, destaque — abre portas para vagas melhores.",
    ],
    donts: [
      "Não escreva apenas 'auxiliei na produção' sem dizer em que linha, com qual produto e em qual volume.",
      "Não omita a disponibilidade de horário: currículos sem essa informação são deixados de lado nas vagas de turno.",
      "Não invente NR que você não tem — muitas empresas conferem o certificado antes da admissão.",
      "Não use currículo com foto, colunas ou enfeites; boa parte das indústrias usa triagem automática e o layout simples passa melhor.",
      "Não deixe lacunas de tempo sem explicação, principalmente entre contratos temporários.",
      "Não liste apenas 'trabalho em equipe' e 'proatividade' como habilidades — sem exemplo, não dizem nada.",
    ],
    faqs: [
      {
        question: "Como fazer currículo de auxiliar de produção sem experiência?",
        answer:
          "Coloque no topo o que a vaga mais valoriza e que você já tem: ensino médio completo, disponibilidade total de horário e turno, residência próxima à empresa e vontade de aprender demonstrada por algum curso. Se você fez cursos livres de segurança do trabalho, boas práticas ou operação de máquinas, destaque-os. Use a seção de experiência para qualquer trabalho anterior, mesmo informal — em obra, em comércio, em serviços —, focando em pontualidade, cumprimento de rotina e trabalho em ritmo. Empresas que contratam auxiliar de produção sem experiência procuram principalmente confiabilidade e disponibilidade, então deixe essas duas coisas visíveis logo na primeira leitura.",
      },
      {
        question: "Quais cursos ajudam a conseguir vaga de auxiliar de produção?",
        answer:
          "Os que mais pesam são os treinamentos de normas regulamentadoras — NR-06 (EPI), NR-11 (movimentação de cargas), NR-12 (máquinas e equipamentos) e, em algumas operações, NR-33 e NR-35. Cursos de Boas Práticas de Fabricação são muito valorizados na indústria de alimentos, e noções de 5S e controle de qualidade ajudam em qualquer segmento. Cursos gratuitos ou de baixo custo em instituições de formação profissional costumam ser suficientes para a triagem. Um diferencial forte é a formação em operação de empilhadeira, porque permite migrar para funções melhor remuneradas dentro da mesma indústria.",
      },
      {
        question: "O que colocar como objetivo no currículo de auxiliar de produção?",
        answer:
          "Prefira um resumo profissional a um objetivo genérico. Em três linhas, diga quanto tempo de experiência tem, em que tipo de linha ou setor atuou, quais rotinas domina e qual é a sua disponibilidade. Por exemplo: 'Auxiliar de produção com 3 anos de experiência em linha de embalagem na indústria de alimentos, com rotina de controle de qualidade visual, apontamento de produção e BPF. Disponibilidade total para turnos e escala 6x1.' Isso responde de uma vez às perguntas que o recrutador faria e substitui frases vazias como 'busco uma oportunidade de crescimento profissional'.",
      },
      {
        question: "Preciso colocar as NRs no currículo?",
        answer:
          "Sim, e de forma destacada, com o ano do treinamento. As normas regulamentadoras são um filtro concreto em vagas de indústria: em muitas empresas, o candidato que já tem a NR em dia entra mais rápido, porque reduz custo e prazo de integração. Crie uma seção curta chamada 'Treinamentos e Certificações' e liste cada NR com o ano e a instituição. Se o treinamento já venceu, você pode mencionar informando a data — algumas empresas reciclam internamente. O que não vale é listar normas que você nunca fez, porque o certificado costuma ser exigido antes da admissão.",
      },
      {
        question: "Vale a pena colocar experiência em outras áreas no currículo?",
        answer:
          "Vale, principalmente se você tem pouca experiência industrial. Trabalhos em construção, comércio, limpeza, logística ou serviços demonstram rotina, cumprimento de horário e responsabilidade — que é boa parte do que se avalia nessa função. O importante é traduzir a experiência para o que interessa na produção: ritmo de trabalho, cumprimento de procedimento, atenção a detalhe, uso de EPI, trabalho em equipe. Um bullet como 'atendi em média 60 pedidos por turno mantendo o padrão de montagem' comunica muito mais do que apenas o nome do cargo anterior.",
      },
      {
        question: "Como destacar disponibilidade de horário no currículo?",
        answer:
          "Coloque logo abaixo dos dados de contato, em uma linha própria e visível: 'Disponibilidade: turnos, escala 6x1, horas extras e finais de semana'. Repita a informação no resumo profissional. Se você tem restrição real de horário, seja honesto e específico — descobrir isso depois da contratação gera desligamento rápido e queima a relação com a empresa e com a agência de recrutamento. Se você mora perto da unidade ou tem transporte próprio, mencione também: em vagas de turno, especialmente noturno, a proximidade e o meio de locomoção contam bastante na decisão.",
      },
    ],
  },
  {
    slug: "almoxarife",
    profession: "Almoxarife",
    metaTitle: "Modelo de Currículo para Almoxarife (Exemplo Pronto 2026)",
    h1: "Modelo de Currículo para Almoxarife",
    metaDescription:
      "Modelo de currículo para almoxarife com exemplo real: controle de estoque, inventário, WMS, ERP, palavras-chave de ATS, faixa salarial e dicas de triagem.",
    intro:
      "O almoxarife é o profissional que responde pela acuracidade do estoque — e é exatamente isso que um bom currículo da área precisa comunicar. Quem contrata quer saber três coisas: qual sistema você usou, qual era o volume sob sua responsabilidade e qual foi o resultado dos seus inventários. Currículos que apenas dizem 'responsável pelo almoxarifado' perdem para os que dizem 'controlei 4.200 itens em WMS com acuracidade de 98% no inventário rotativo'. Este modelo mostra como estruturar essa informação, quais sistemas citar e como se diferenciar em uma função em que a confiança é o principal critério.",
    sampleResume: {
      name: "Marcos Vinícius Teixeira",
      headline: "Almoxarife | Controle de Estoque, Inventário e WMS | ERP TOTVS Protheus",
      summary:
        "Almoxarife com 6 anos de experiência em almoxarifado industrial e de manutenção, responsável por recebimento, armazenagem, separação e controle de mais de 4 mil itens. Domínio de WMS e ERP TOTVS Protheus, inventário rotativo e gestão de estoque mínimo. Histórico de aumento de acuracidade de inventário e redução de ruptura de itens críticos.",
      experience: [
        {
          role: "Almoxarife",
          company: "Metalúrgica São Bento",
          period: "Ago 2021 - Atual",
          bullets: [
            "Respondo pelo almoxarifado de manutenção e produção, com 4.200 itens ativos e movimentação média de 600 requisições por mês",
            "Elevei a acuracidade do inventário rotativo de 91% para 98% ao implantar contagem cíclica semanal por curva ABC",
            "Reduzi a ruptura de itens críticos de manutenção em 40% após revisar pontos de ressuprimento e estoque mínimo no ERP",
            "Realizo recebimento e conferência física e fiscal de materiais (nota fiscal, quantidade, lote e certificado), com registro no TOTVS Protheus",
            "Organizo endereçamento e curva ABC do armazém, reduzindo o tempo médio de separação de requisição de 12 para 5 minutos",
            "Conduzo o inventário geral anual com equipe de 4 pessoas, com fechamento sem divergência relevante nos últimos 3 ciclos",
          ],
        },
        {
          role: "Auxiliar de Almoxarifado",
          company: "Construtora Vale Norte",
          period: "Mar 2019 - Jul 2021",
          bullets: [
            "Controlei o almoxarifado de obra com recebimento de materiais, controle de EPI e ferramentas por colaborador",
            "Implantei planilha de controle de retirada de ferramentas que reduziu perdas e extravios em cerca de 30%",
            "Realizei separação e entrega de material às frentes de serviço conforme requisição do encarregado",
            "Auxiliei nos inventários mensais e no controle de devolução de materiais não utilizados",
          ],
        },
      ],
      education: [
        {
          degree: "Técnico em Logística",
          institution: "SENAI",
          period: "2020 - 2021",
        },
        {
          degree: "Ensino Médio Completo",
          institution: "EE Dom Pedro II",
          period: "Concluído em 2018",
        },
      ],
      skills: [
        "Controle de estoque e curva ABC",
        "Inventário rotativo e geral",
        "WMS e endereçamento de armazém",
        "ERP TOTVS Protheus",
        "Recebimento fiscal e conferência",
        "Excel intermediário (PROCV e tabela dinâmica)",
        "Controle de EPI e ferramentas",
        "Operação de transpaleteira",
      ],
    },
    keySkills: [
      "Controle de estoque e acuracidade de inventário",
      "Recebimento, conferência física e conferência fiscal",
      "Endereçamento de armazém e curva ABC",
      "Inventário rotativo, cíclico e geral",
      "Sistemas WMS e ERP (TOTVS, SAP, Sankhya, Senior)",
      "Ponto de ressuprimento e estoque mínimo",
      "Separação e atendimento a requisições internas",
      "Controle de EPI, ferramentas e materiais de manutenção",
      "Excel para controle e relatório de estoque",
      "Organização, disciplina de registro e atenção a detalhe",
    ],
    atsKeywords: [
      "Almoxarife",
      "Almoxarifado",
      "Controle de Estoque",
      "Inventário",
      "Inventário Rotativo",
      "Curva ABC",
      "WMS",
      "ERP",
      "TOTVS Protheus",
      "SAP",
      "Recebimento de Materiais",
      "Conferência Fiscal",
      "Endereçamento",
      "Estoque Mínimo",
      "Ponto de Ressuprimento",
      "Requisição de Materiais",
      "Acuracidade",
      "Logística",
      "Controle de EPI",
      "Transpaleteira",
    ],
    salaryNote:
      "No Brasil (2026), o almoxarife costuma receber entre R$ 2.200 e R$ 3.800, com valores mais altos em indústrias de grande porte, almoxarifados de manutenção com itens críticos e operações que exigem domínio de WMS e ERP. Auxiliares de almoxarifado ficam em faixa inferior, e a experiência com inventário e sistema integrado é o principal fator de diferenciação salarial. Os pisos variam por convenção coletiva da categoria e da região.",
    dos: [
      "Informe o número de itens (SKUs) sob sua responsabilidade e o volume de movimentação mensal — é o que dimensiona a sua experiência.",
      "Cite os sistemas pelo nome e versão sempre que possível: WMS, TOTVS Protheus, SAP MM, Sankhya, Senior.",
      "Destaque resultados de acuracidade de inventário, redução de ruptura e redução de perdas, com percentuais.",
      "Deixe claro o tipo de almoxarifado (produção, manutenção, obra, hospitalar, almoxarifado de TI) — cada um tem exigências próprias.",
      "Mencione experiência com conferência fiscal e recebimento de nota, que separa o almoxarife do auxiliar.",
      "Inclua Excel com o nível real e as funções que você usa de fato.",
    ],
    donts: [
      "Não escreva apenas 'responsável pelo almoxarifado' sem volume, sistema nem resultado.",
      "Não confunda experiência em estoque de loja com almoxarifado industrial — descreva o contexto real.",
      "Não liste 'conhecimento em informática' de forma vaga; cite os sistemas específicos.",
      "Não deixe de mencionar inventário: é o assunto mais perguntado na entrevista da função.",
      "Não exagere no nível de Excel — testes práticos são comuns em processos de almoxarifado.",
      "Não use layout com colunas ou ícones: a triagem automática lê melhor a coluna única.",
    ],
    faqs: [
      {
        question: "O que um almoxarife faz exatamente?",
        answer:
          "O almoxarife é responsável por receber, conferir, armazenar, controlar e entregar os materiais de uma empresa. Na prática, isso envolve conferência física e fiscal do que chega, endereçamento no armazém, atendimento a requisições internas, controle de estoque mínimo e ponto de ressuprimento, condução de inventários rotativos e gerais, e registro de todas as movimentações no sistema. Em almoxarifados de manutenção, soma-se o controle de itens críticos e de peças de reposição; em obras, o controle de EPI e ferramentas por colaborador. A medida de desempenho mais usada é a acuracidade do inventário — o quanto o estoque físico bate com o sistema.",
      },
      {
        question: "Preciso de curso técnico para ser almoxarife?",
        answer:
          "Não é obrigatório na maioria das vagas, mas ajuda bastante. O requisito básico costuma ser ensino médio completo, e a experiência prática pesa mais do que a formação. Dito isso, um curso técnico em Logística ou em Administração é um diferencial claro na triagem e costuma ser exigido em empresas maiores ou para posições de coordenação. Cursos livres de gestão de estoque, movimentação de materiais e Excel também aparecem bem no currículo. Para quem já atua, a formação técnica costuma ser o caminho mais direto para migrar de auxiliar para almoxarife pleno e, depois, para supervisão de estoque.",
      },
      {
        question: "Como mostrar experiência com inventário no currículo?",
        answer:
          "Com números e com o tipo de inventário. Diga quantos itens você controlava, com que frequência fazia contagem, qual metodologia usava (rotativo por curva ABC, cíclico, geral anual) e, principalmente, qual acuracidade alcançou. Um bullet forte é: 'Elevei a acuracidade do inventário rotativo de 91% para 98% ao implantar contagem cíclica semanal por curva ABC.' Se você conduziu ou participou do inventário geral, informe o tamanho da equipe e o resultado do fechamento. Esse é o tema mais explorado na entrevista de almoxarife, então quem já traz o dado no currículo entra na conversa em vantagem.",
      },
      {
        question: "Quais sistemas devo citar no currículo de almoxarife?",
        answer:
          "Cite pelo nome todos os que você realmente usou, começando pelos mais comuns nas vagas: ERPs como TOTVS Protheus, SAP (módulo MM), Sankhya e Senior, e qualquer WMS de gestão de armazém. Diga também qual era o seu nível de uso — apenas movimentação e requisição, ou também cadastro, ajuste e relatórios. Complementarmente, informe o nível de Excel com as funções que você usa na prática (PROCV, tabela dinâmica, filtros), porque muitos processos aplicam teste prático. Evite escrever 'conhecimento em sistemas de gestão' sem especificar: essa frase não passa em busca por palavra-chave nem informa nada ao recrutador.",
      },
      {
        question: "Qual a diferença entre auxiliar de almoxarifado e almoxarife?",
        answer:
          "O auxiliar executa as tarefas operacionais — separação, conferência simples, organização física, apoio no recebimento e nas contagens. O almoxarife responde pelo controle: lança e ajusta no sistema, faz a conferência fiscal do recebimento, define e monitora estoque mínimo e ponto de ressuprimento, conduz inventários e responde pela acuracidade. Essa diferença deve ficar clara no currículo. Se você está migrando de auxiliar para almoxarife, destaque tudo o que já fez do lado do controle: lançamentos no sistema, participação em inventário, controle de planilhas e conferência de nota fiscal. É isso que sustenta a mudança de nível.",
      },
      {
        question: "Vale a pena tirar certificado de empilhadeira sendo almoxarife?",
        answer:
          "Vale, e é um dos investimentos com melhor retorno para quem trabalha em almoxarifado. O treinamento de operação de empilhadeira (relacionado à NR-11) amplia bastante o leque de vagas, porque muitas operações preferem contratar alguém que possa movimentar carga quando necessário, sem depender de outro profissional. Em empresas menores, isso frequentemente é requisito. No currículo, cite o treinamento com o ano e informe se a certificação está válida, além de mencionar experiência com transpaleteira manual ou elétrica. Junto com domínio de WMS e experiência em inventário, é um dos fatores que mais deslocam a faixa salarial da função para cima.",
      },
    ],
  },
  {
    slug: "operador-de-empilhadeira",
    profession: "Operador de Empilhadeira",
    metaTitle: "Modelo de Currículo para Operador de Empilhadeira (2026)",
    h1: "Modelo de Currículo para Operador de Empilhadeira",
    metaDescription:
      "Modelo de currículo para operador de empilhadeira: NR-11, tipos de máquina, exemplo pronto, habilidades, palavras-chave de ATS e faixa salarial atualizada.",
    intro:
      "Na vaga de operador de empilhadeira, a triagem começa e muitas vezes termina em dois itens: NR-11 válida e o tipo de máquina que você opera. Empilhadeira a gás, elétrica retrátil, contrabalançada e paleteira elétrica exigem habilidades diferentes, e a empresa filtra exatamente por isso. Currículos genéricos, que apenas dizem 'operador de empilhadeira', competem em desvantagem com quem informa modelo, capacidade, altura de elevação e tipo de operação. Este modelo mostra como organizar essas informações, o que colocar em destaque e como demonstrar segurança operacional — que é o segundo critério mais avaliado depois da certificação.",
    sampleResume: {
      name: "Anderson Ribeiro da Silva",
      headline: "Operador de Empilhadeira | Retrátil, Contrabalançada e Paleteira | NR-11 válida",
      summary:
        "Operador de empilhadeira com 7 anos de experiência em centros de distribuição e armazéns industriais, habilitado em empilhadeira retrátil, contrabalançada a gás e elétrica, além de paleteira elétrica. Experiência com armazenagem em porta-paletes de até 10 metros, movimentação de cargas de até 2,5 toneladas e operação com coletor de dados em WMS. Sem registro de acidente ou avaria em toda a trajetória.",
      experience: [
        {
          role: "Operador de Empilhadeira",
          company: "CD Logística Sul — Operador Logístico",
          period: "Jan 2022 - Atual",
          bullets: [
            "Opero empilhadeira retrátil elétrica em armazenagem de porta-paletes com até 10 metros de altura, movimentando em média 130 paletes por turno",
            "Realizo abastecimento de linha, endereçamento e picking de paletes com coletor de dados integrado ao WMS",
            "Zero acidente e zero avaria de estrutura ou produto nos últimos 3 anos de operação",
            "Executo checklist diário da máquina (bateria, garfos, freios, sinalização) e reporto anomalias à manutenção antes do início do turno",
            "Auxilio no carregamento e descarregamento de carretas com conferência de lacre e quantidade junto ao conferente",
          ],
        },
        {
          role: "Operador de Empilhadeira / Auxiliar de Logística",
          company: "Indústria de Bebidas Serra Azul",
          period: "Mar 2019 - Dez 2021",
          bullets: [
            "Operei empilhadeira contrabalançada a gás na movimentação de produto acabado entre linha de produção e armazém",
            "Realizei paletização e organização de blocado, respeitando empilhamento máximo e critérios de FIFO por lote",
            "Participei do inventário mensal do armazém, apoiando a contagem física em altura",
            "Atuei em escala 6x1 com revezamento de turnos, incluindo turno noturno",
          ],
        },
      ],
      education: [
        {
          degree: "NR-11 — Operação de Empilhadeira (formação e reciclagem)",
          institution: "SENAI",
          period: "Reciclagem em 2025",
        },
        {
          degree: "Ensino Médio Completo",
          institution: "EE Coronel Fernando Prestes",
          period: "Concluído em 2018",
        },
      ],
      skills: [
        "Empilhadeira retrátil elétrica",
        "Empilhadeira contrabalançada a gás",
        "Paleteira elétrica e transpaleteira",
        "Armazenagem em porta-paletes (até 10 m)",
        "Coletor de dados e WMS",
        "Checklist e inspeção diária de máquina",
        "FIFO e controle de lote",
        "Carregamento e descarregamento de carreta",
      ],
    },
    keySkills: [
      "Operação de empilhadeira retrátil, contrabalançada e patolada",
      "Operação de paleteira elétrica e transpaleteira",
      "Armazenagem em porta-paletes e blocado",
      "Picking, endereçamento e abastecimento de linha",
      "Uso de coletor de dados e sistema WMS",
      "Checklist diário e inspeção preventiva do equipamento",
      "Normas de segurança (NR-11, NR-06, NR-12)",
      "Carga e descarga de caminhão e carreta",
      "Controle de lote, FIFO e conferência de produto",
      "Disponibilidade para turnos e escala 6x1",
    ],
    atsKeywords: [
      "Operador de Empilhadeira",
      "Empilhadeira Retrátil",
      "Empilhadeira Contrabalançada",
      "Paleteira Elétrica",
      "Transpaleteira",
      "NR-11",
      "NR-06",
      "Porta-Paletes",
      "Armazenagem",
      "Picking",
      "Endereçamento",
      "WMS",
      "Coletor de Dados",
      "Movimentação de Cargas",
      "Paletização",
      "FIFO",
      "Centro de Distribuição",
      "Carga e Descarga",
      "Checklist de Máquina",
      "Logística",
    ],
    salaryNote:
      "No Brasil (2026), o operador de empilhadeira costuma receber entre R$ 2.200 e R$ 3.500, com adicional noturno em turnos e, em algumas operações, adicional de periculosidade. Operadores de retrátil em armazéns de grande altura e profissionais habilitados em mais de um tipo de máquina costumam ficar no topo da faixa. Operadores logísticos e indústrias de grande porte tendem a pagar acima do comércio e de pequenos armazéns; confira o piso da convenção coletiva da sua região.",
    dos: [
      "Coloque a NR-11 no topo do currículo, com o ano da última reciclagem e a validade.",
      "Especifique todos os tipos de máquina que você opera: retrátil, contrabalançada (gás, elétrica, diesel), patolada, paleteira elétrica.",
      "Informe capacidade de carga movimentada e altura de armazenagem — dimensiona a sua experiência imediatamente.",
      "Destaque histórico de segurança: tempo sem acidente e sem avaria é um dos argumentos mais fortes da função.",
      "Cite se opera com coletor de dados e qual WMS ou sistema utilizava.",
      "Informe disponibilidade de turno e escala logo abaixo do contato.",
    ],
    donts: [
      "Não escreva apenas 'operador de empilhadeira' sem dizer qual tipo de máquina — é o principal filtro da vaga.",
      "Não omita a data da reciclagem da NR-11: certificação vencida costuma travar a admissão.",
      "Não deixe de mencionar avarias e segurança; sem essa informação, o recrutador precisa perguntar.",
      "Não invente habilitação em máquina que você não opera — há teste prático em quase todo processo.",
      "Não use currículo longo e com muitos elementos gráficos; uma página objetiva funciona melhor.",
      "Não esqueça de citar experiência com carga e descarga, que aparece em boa parte das vagas.",
    ],
    faqs: [
      {
        question: "A NR-11 é obrigatória para operar empilhadeira?",
        answer:
          "O treinamento previsto na NR-11 é o requisito padrão exigido pelas empresas para autorizar a operação de empilhadeiras, e praticamente toda vaga formal pede o certificado. Além da formação inicial, é comum a exigência de reciclagem periódica, e muitas empresas fazem também uma avaliação prática interna antes de liberar o operador. Por isso, coloque a NR-11 em destaque no currículo, com o ano da formação e o ano da última reciclagem. Se a sua certificação estiver vencida, vale renovar antes de iniciar a busca: é um curso relativamente rápido e a falta dele elimina o candidato ainda na triagem.",
      },
      {
        question: "Qual a diferença entre empilhadeira retrátil e contrabalançada?",
        answer:
          "A contrabalançada é a mais comum, com contrapeso traseiro, usada principalmente em áreas externas, pátios e carga e descarga de caminhões — pode ser a gás, elétrica ou a diesel. A retrátil é elétrica, tem mastro que avança e recua, opera em corredores mais estreitos e alcança alturas maiores, sendo típica de centros de distribuição com porta-paletes altos. A diferença importa muito na triagem: são habilidades distintas e as vagas especificam qual máquina será operada. Por isso, liste no currículo todos os tipos que você domina, e não apenas 'empilhadeira' de forma genérica — quem opera mais de um modelo tem acesso a um número bem maior de oportunidades.",
      },
      {
        question: "Como conseguir a primeira vaga de operador de empilhadeira?",
        answer:
          "O caminho mais comum é entrar na operação em outra função — auxiliar de logística, conferente, ajudante de armazém — e migrar internamente depois de tirar a NR-11, aproveitando a máquina e o treinamento prático da própria empresa. Faça o curso mesmo antes de ter a vaga: ele é o requisito de entrada e sinaliza iniciativa. No currículo, destaque a certificação no topo, informe experiência com transpaleteira ou paleteira elétrica se houver e deixe clara a disponibilidade total de turnos. Operadores logísticos e transportadoras costumam ser mais abertos a candidatos iniciantes do que indústrias com armazéns de grande altura.",
      },
      {
        question: "Devo colocar tempo sem acidente no currículo?",
        answer:
          "Sim — é um dos argumentos mais fortes da função e quase ninguém usa. Segurança é o principal risco que a empresa assume ao contratar um operador, porque um acidente com empilhadeira envolve custo alto, dano a estrutura, parada de operação e risco à integridade de pessoas. Um bullet como 'zero acidente e zero avaria de estrutura ou produto nos últimos 3 anos de operação' comunica exatamente o que o gestor precisa ouvir. Complemente citando a rotina de checklist diário da máquina e a conduta em relação a EPI e sinalização, que reforçam a percepção de operador disciplinado.",
      },
      {
        question: "Preciso de CNH para ser operador de empilhadeira?",
        answer:
          "A operação da empilhadeira em si é autorizada pelo treinamento da NR-11 e pela autorização da empresa, e não pela habilitação de trânsito. Ainda assim, muitas vagas pedem CNH como requisito adicional, principalmente em operações menores, onde o profissional pode precisar movimentar veículos no pátio, fazer entregas eventuais ou conduzir equipamentos que circulam em área com trânsito de veículos. Se você tem CNH, informe a categoria no currículo — é um diferencial de baixo custo. Se não tem, isso não impede a maior parte das vagas de armazém e centro de distribuição, mas reduz um pouco o leque de oportunidades.",
      },
      {
        question: "Como descrever a experiência se operei vários tipos de armazém?",
        answer:
          "Organize por experiência e deixe explícito o contexto de cada uma, porque armazéns diferentes exigem habilidades diferentes. Informe o tipo de operação (centro de distribuição, indústria, transportadora, atacado), o tipo de armazenagem (porta-paletes, blocado, drive-in), a altura máxima de elevação, o peso médio movimentado e o volume por turno. Assim o recrutador consegue avaliar em segundos se você tem o perfil da vaga dele. Um exemplo: 'Empilhadeira retrátil em CD com porta-paletes de 10 m, média de 130 paletes por turno, com coletor de dados integrado ao WMS.' Isso vale mais do que qualquer descrição genérica de atividades.",
      },
    ],
  },
  {
    slug: "soldador",
    profession: "Soldador",
    metaTitle: "Modelo de Currículo para Soldador (Exemplo Pronto 2026)",
    h1: "Modelo de Currículo para Soldador",
    metaDescription:
      "Modelo de currículo para soldador com exemplo real: processos MIG/MAG, TIG e eletrodo, qualificações, NRs, palavras-chave de ATS e faixa salarial atualizada.",
    intro:
      "O currículo de soldador é um dos mais técnicos entre as funções operacionais — e um dos que mais perdem oportunidade por falta de especificidade. Quem contrata precisa saber, em segundos, quais processos você domina (MIG/MAG, TIG, eletrodo revestido, arame tubular), em quais materiais, em quais posições e se você tem qualificação de procedimento. Um currículo que diz apenas 'soldador com 5 anos de experiência' obriga o recrutador a adivinhar; um que informa processo, material, posição e espessura é chamado para o teste prático. Este modelo mostra exatamente como organizar essas informações.",
    sampleResume: {
      name: "José Carlos Barbosa",
      headline: "Soldador MIG/MAG e TIG | Aço Carbono e Inox | Posições 1G a 4G | NR-34 e NR-35",
      summary:
        "Soldador com 8 anos de experiência em estruturas metálicas e caldeiraria, qualificado nos processos MIG/MAG, TIG e eletrodo revestido, em aço carbono e aço inoxidável. Atuação em posições 1G a 4G, com leitura de desenho técnico e simbologia de solda. Histórico de baixo índice de reprovação em ensaio visual e por líquido penetrante, com NR-34, NR-35 e NR-33 em dia.",
      experience: [
        {
          role: "Soldador Montador",
          company: "Metalúrgica Estrutural Andrade",
          period: "Fev 2021 - Atual",
          bullets: [
            "Executo soldagem MIG/MAG e eletrodo revestido em estruturas metálicas de aço carbono, com espessuras de 3 mm a 25 mm, nas posições plana, horizontal, vertical e sobre-cabeça",
            "Mantenho índice de reprovação em ensaio visual abaixo de 3%, contra média de 8% do setor na unidade",
            "Realizo leitura e interpretação de desenho técnico e simbologia de solda para montagem de vigas, pilares e treliças",
            "Executo preparação de junta, chanfro e ponteamento, com controle de parâmetros de corrente e velocidade conforme procedimento",
            "Atuo em trabalho em altura com uso de cinto e talabarte conforme NR-35, e em espaço confinado conforme NR-33 quando necessário",
          ],
        },
        {
          role: "Soldador TIG",
          company: "Inox Sul Caldeiraria",
          period: "Jun 2018 - Jan 2021",
          bullets: [
            "Executei soldagem TIG em aço inoxidável para tanques, tubulações e equipamentos da indústria alimentícia",
            "Realizei soldagem de tubulação em posição fixa, com acabamento sanitário e passe de raiz com purga de argônio",
            "Participei da qualificação de procedimento de soldagem (EPS) junto ao inspetor da qualidade",
            "Cumpri rotina de inspeção dimensional e acabamento antes da liberação das peças para o cliente",
          ],
        },
      ],
      education: [
        {
          degree: "Curso de Soldagem MIG/MAG, TIG e Eletrodo Revestido",
          institution: "SENAI",
          period: "2017 - 2018",
        },
        {
          degree: "NR-34, NR-35 (trabalho em altura) e NR-33 (espaço confinado)",
          institution: "Treinamentos com reciclagem em 2025",
          period: "2025",
        },
        {
          degree: "Ensino Médio Completo",
          institution: "EE Antônio Carlos",
          period: "Concluído em 2016",
        },
      ],
      skills: [
        "Soldagem MIG/MAG",
        "Soldagem TIG",
        "Eletrodo revestido",
        "Aço carbono e aço inoxidável",
        "Posições 1G a 4G",
        "Leitura de desenho técnico e simbologia",
        "Preparação de junta e chanfro",
        "NR-33, NR-34 e NR-35",
      ],
    },
    keySkills: [
      "Processos MIG/MAG, TIG, eletrodo revestido e arame tubular",
      "Soldagem em aço carbono, aço inoxidável e alumínio",
      "Posições de soldagem (plana, horizontal, vertical, sobre-cabeça)",
      "Leitura de desenho técnico e simbologia de solda",
      "Preparação de junta, chanfro, ponteamento e acabamento",
      "Controle de parâmetros de soldagem (corrente, tensão, velocidade)",
      "Noções de ensaios (visual, líquido penetrante, ultrassom)",
      "Normas regulamentadoras (NR-06, NR-12, NR-33, NR-34, NR-35)",
      "Uso de esmerilhadeira, maçarico e ferramentas de corte",
      "Atenção a detalhe e disciplina de procedimento",
    ],
    atsKeywords: [
      "Soldador",
      "MIG/MAG",
      "TIG",
      "Eletrodo Revestido",
      "Arame Tubular",
      "Aço Carbono",
      "Aço Inoxidável",
      "Caldeiraria",
      "Estruturas Metálicas",
      "Solda de Tubulação",
      "Desenho Técnico",
      "Simbologia de Solda",
      "Qualificação de Soldador",
      "EPS",
      "Líquido Penetrante",
      "NR-34",
      "NR-35",
      "NR-33",
      "Espaço Confinado",
      "Trabalho em Altura",
    ],
    salaryNote:
      "No Brasil (2026), o soldador costuma receber entre R$ 2.500 e R$ 5.500, com forte variação por processo e setor. Soldadores TIG qualificados em inox, soldadores de tubulação e profissionais que atuam em obras industriais, naval e offshore costumam ficar bem acima da média, muitas vezes com adicional de periculosidade e ajuda de custo. Estruturas metálicas e serralherias tendem a pagar no piso da faixa. Confira também o piso da convenção coletiva da categoria metalúrgica da sua região.",
    dos: [
      "Liste os processos que você domina logo no título do currículo: MIG/MAG, TIG, eletrodo, arame tubular.",
      "Informe os materiais (aço carbono, inox, alumínio) e a faixa de espessura com que trabalha.",
      "Cite as posições de soldagem (1G a 6G) — é um dos critérios técnicos mais objetivos da triagem.",
      "Destaque qualificações e ensaios: aprovação em teste, baixo índice de reprovação, participação em EPS.",
      "Liste as NRs com o ano da reciclagem, principalmente NR-33, NR-34 e NR-35.",
      "Mencione leitura de desenho técnico e simbologia de solda — muitos candidatos não têm e não informam.",
    ],
    donts: [
      "Não escreva apenas 'soldador' sem especificar processo, material e posição.",
      "Não omita as NRs: em obras industriais elas são requisito eliminatório.",
      "Não invente qualificação — praticamente toda vaga aplica teste prático com inspeção da peça.",
      "Não deixe de citar o setor em que atuou (estrutura metálica, caldeiraria, naval, automotivo): o vocabulário muda muito.",
      "Não descreva atividades genéricas como 'soldei peças diversas'; diga o que era a peça e o requisito.",
      "Não esqueça de informar disponibilidade para viagem ou obra fora, que é comum na área.",
    ],
    faqs: [
      {
        question: "Quais processos de solda devo colocar no currículo?",
        answer:
          "Todos os que você executa com autonomia, começando pelos mais requisitados: MIG/MAG (também chamado de GMAW), TIG (GTAW), eletrodo revestido (SMAW) e arame tubular (FCAW). Para cada um, informe os materiais em que você trabalha e a faixa de espessura, porque isso muda completamente a exigência técnica. Coloque essa informação já no título do currículo, algo como 'Soldador MIG/MAG e TIG | Aço Carbono e Inox | Posições 1G a 4G'. Evite listar processos que você viu ou fez pouquíssimas vezes: praticamente toda vaga de soldador tem teste prático, e a peça é inspecionada — inflar o currículo aqui só antecipa a reprovação.",
      },
      {
        question: "Preciso ter qualificação de soldador para conseguir vaga?",
        answer:
          "Depende do setor. Em serralheria, estrutura leve e manutenção geral, a experiência comprovada e a aprovação no teste prático da empresa costumam bastar. Já em obras industriais, caldeiraria, tubulação, indústria naval e setores com exigência de código, é comum a necessidade de qualificação conforme procedimento de soldagem (EPS/RQPS) e, em alguns casos, certificações específicas. Se você já foi qualificado em algum procedimento, cite no currículo com o processo, a posição e o material. Se ainda não, vale buscar cursos de qualificação em instituições de formação profissional: é o principal caminho para acessar as faixas salariais mais altas da profissão.",
      },
      {
        question: "Como colocar as NRs no currículo de soldador?",
        answer:
          "Crie uma seção específica de 'Treinamentos e Normas' logo abaixo da formação, listando cada norma com o ano da formação e o ano da última reciclagem. As mais relevantes para a função são NR-34 (construção e reparação naval, quando aplicável), NR-35 (trabalho em altura), NR-33 (espaço confinado), NR-12 (máquinas) e NR-06 (EPI). Em obras industriais e paradas de manutenção, a ausência dessas normas costuma ser eliminatória, porque a empresa precisaria arcar com o treinamento antes da liberação. Informe também se as certificações estão dentro da validade — esse detalhe acelera bastante a admissão.",
      },
      {
        question: "Qual a diferença entre soldador e soldador montador?",
        answer:
          "O soldador executa a soldagem propriamente dita, seguindo o procedimento definido. O soldador montador, além de soldar, faz a montagem do conjunto: interpreta o desenho técnico, posiciona e alinha as peças, prepara a junta, faz o ponteamento e garante o esquadro e as dimensões antes da soldagem final. É uma função mais completa e normalmente mais bem remunerada. Se você faz montagem, deixe isso explícito no currículo, citando leitura de desenho, uso de instrumentos de medição e tipos de estrutura montada — muita gente executa essas tarefas e não as registra, perdendo a diferenciação salarial que elas justificam.",
      },
      {
        question: "Como fazer currículo de soldador iniciante?",
        answer:
          "Destaque no topo a formação técnica em soldagem, com a instituição, a carga horária e os processos praticados no curso. Em seguida, crie uma seção de 'Práticas e Projetos' descrevendo o que você soldou durante a formação: tipo de junta, material, espessura, posições treinadas e ensaios realizados nas peças. Trate isso como experiência real, porque é o que o avaliador quer entender. Liste também as NRs que você já possui — obter NR-35 e NR-33 antes de procurar vaga é um diferencial concreto e de custo baixo. Por fim, deixe claro que você tem disponibilidade para teste prático, que é como quase toda contratação da área é decidida.",
      },
      {
        question: "Vale a pena aprender solda TIG em inox?",
        answer:
          "É provavelmente o investimento de maior retorno na carreira de soldador no Brasil. A soldagem TIG em aço inoxidável exige mais técnica, é usada em setores com exigência de acabamento e sanidade — alimentício, farmacêutico, químico, tubulação — e tem oferta menor de profissionais qualificados, o que empurra a remuneração para cima. Quem domina TIG em inox, especialmente com passe de raiz e purga, costuma acessar faixas salariais bem acima da média da profissão. Se você já solda MIG/MAG e eletrodo, adicionar o TIG amplia o leque de vagas de forma imediata e costuma se pagar em poucos meses.",
      },
    ],
  },
  {
    slug: "entregador",
    profession: "Entregador",
    metaTitle: "Modelo de Currículo para Entregador e Motoboy (Exemplo 2026)",
    h1: "Modelo de Currículo para Entregador (Motoboy e Motorista de Entrega)",
    metaDescription:
      "Modelo de currículo para entregador e motoboy: CNH, veículo próprio, rotas, aplicativos, exemplo pronto, palavras-chave de ATS e faixa salarial.",
    intro:
      "Vagas de entregador são preenchidas rápido e a triagem é objetiva: CNH na categoria certa, veículo próprio ou não, conhecimento da região e histórico de pontualidade. Um currículo bem montado responde a essas quatro perguntas antes que alguém precise ligar — e essa é justamente a diferença entre ser chamado hoje ou daqui a duas semanas. Este modelo serve tanto para motoboy quanto para entregador com carro ou van, e mostra como transformar a experiência com aplicativos de entrega em algo que aparece bem no currículo formal, além de destacar o que mais pesa na decisão: confiabilidade e ausência de infrações.",
    sampleResume: {
      name: "Diego Alves Pereira",
      headline: "Entregador | CNH A/B | Moto própria | Conhecimento da Zona Leste e Centro",
      summary:
        "Entregador com 5 anos de experiência em entregas urbanas, atuando com moto própria em farmácia, delivery de alimentos e distribuição de documentos. Domínio das rotas da Zona Leste e região central, com histórico de mais de 98% de entregas no prazo e CNH sem pontuação. Experiência com aplicativos de roteirização, conferência de carga e recebimento de valores.",
      experience: [
        {
          role: "Entregador (Motoboy)",
          company: "Rede de Farmácias Bem-Estar",
          period: "Set 2022 - Atual",
          bullets: [
            "Realizo em média 35 entregas por dia em rota urbana, com índice de entrega no prazo acima de 98%",
            "Faço a conferência do pedido antes da saída e a confirmação de entrega no aplicativo, incluindo assinatura do cliente",
            "Trabalho com medicamentos controlados, seguindo o procedimento de conferência de receita e entrega ao titular",
            "Realizo recebimento de pagamentos em dinheiro e maquininha, com prestação de contas diária sem divergência",
            "Mantenho a moto em dia com revisões preventivas, sem ocorrência de acidente ou multa nos últimos 4 anos",
          ],
        },
        {
          role: "Entregador de Delivery",
          company: "Atuação por aplicativos de entrega",
          period: "Jan 2021 - Ago 2022",
          bullets: [
            "Atuei com entregas de alimentos e encomendas por plataformas de delivery, com avaliação média acima de 4,8",
            "Cumpri média de 25 a 30 corridas por turno, com roteirização própria para otimizar tempo entre pedidos",
            "Lidei diretamente com clientes e estabelecimentos, resolvendo divergências de pedido sem escalar ocorrência",
          ],
        },
      ],
      education: [
        {
          degree: "Ensino Médio Completo",
          institution: "EE Jardim das Palmeiras",
          period: "Concluído em 2020",
        },
        {
          degree: "CNH categorias A e B — sem pontuação",
          institution: "Detran",
          period: "Válida até 2029",
        },
      ],
      skills: [
        "Entregas urbanas e roteirização",
        "Conhecimento de rotas da região metropolitana",
        "Aplicativos de entrega e rastreamento",
        "Conferência de carga e de pedido",
        "Recebimento em dinheiro e maquininha",
        "Atendimento ao cliente na entrega",
        "Manutenção preventiva de moto",
        "Direção defensiva",
      ],
    },
    keySkills: [
      "CNH nas categorias A e/ou B, com pontuação limpa",
      "Conhecimento das rotas da região e uso de aplicativos de navegação",
      "Roteirização e otimização de entregas",
      "Conferência de carga, pedido e nota fiscal",
      "Recebimento de valores e prestação de contas",
      "Atendimento ao cliente no momento da entrega",
      "Manutenção preventiva e cuidado com o veículo",
      "Direção defensiva e cumprimento das leis de trânsito",
      "Pontualidade e cumprimento de janela de entrega",
      "Organização e registro de comprovantes",
    ],
    atsKeywords: [
      "Entregador",
      "Motoboy",
      "Motociclista",
      "Entregas",
      "Delivery",
      "CNH A",
      "CNH B",
      "Moto Própria",
      "Roteirização",
      "Rotas",
      "Conferência de Carga",
      "Comprovante de Entrega",
      "Atendimento ao Cliente",
      "Direção Defensiva",
      "Aplicativo de Entrega",
      "Logística de Última Milha",
      "Coleta e Entrega",
      "Documentos",
      "Prestação de Contas",
      "Pontualidade",
    ],
    salaryNote:
      "No Brasil (2026), o entregador contratado em regime CLT costuma receber entre R$ 1.700 e R$ 3.000, geralmente com ajuda de custo para combustível e manutenção quando usa veículo próprio, além de vale-refeição e, em algumas empresas, adicional de periculosidade para atividade com motocicleta. A remuneração varia bastante conforme o segmento (farmácia, alimentos, documentos, e-commerce) e conforme o modelo de contratação — vale sempre confirmar se o valor anunciado inclui ou não a ajuda de custo do veículo.",
    dos: [
      "Coloque a categoria da CNH e a validade logo abaixo do contato, junto com a informação de veículo próprio.",
      "Informe as regiões que você conhece bem — bairros e zonas específicas, não apenas a cidade.",
      "Use números: entregas por dia, percentual de entrega no prazo, avaliação em aplicativos.",
      "Mencione se tem pontuação na carteira e histórico sem acidente: é um dos critérios mais avaliados.",
      "Cite experiência com recebimento de valores e prestação de contas, que gera confiança imediata.",
      "Trate a experiência com aplicativos como experiência profissional, com volume e avaliação.",
    ],
    donts: [
      "Não omita a categoria da CNH nem a existência de veículo próprio: são o primeiro filtro.",
      "Não escreva apenas 'fiz entregas' sem dizer o volume, o tipo de produto e a região.",
      "Não deixe de informar disponibilidade de horário, principalmente para finais de semana.",
      "Não esconda pontuação na carteira se a vaga exigir prontuário limpo — isso é verificado.",
      "Não use currículo com mais de uma página; nessa função, objetividade conta a favor.",
      "Não deixe de citar experiência com atendimento ao cliente, que pesa em entregas de varejo e farmácia.",
    ],
    faqs: [
      {
        question: "Preciso ter moto própria para trabalhar como entregador?",
        answer:
          "Depende da vaga. Muitas empresas exigem veículo próprio e pagam ajuda de custo para combustível e manutenção; outras fornecem a moto ou o carro da frota, o que é comum em redes maiores, farmácias e operações de e-commerce. Por isso, deixe essa informação bem visível logo abaixo do contato: 'CNH A/B — moto própria' ou 'CNH A — disponível para veículo da empresa'. Se você tem veículo próprio, informe também o ano e o estado de conservação, porque algumas empresas verificam. E, ao avaliar a proposta, confira se o valor anunciado inclui a ajuda de custo — a diferença líquida entre os dois modelos costuma ser significativa.",
      },
      {
        question: "Como colocar experiência com aplicativos de entrega no currículo?",
        answer:
          "Trate como experiência profissional normal, porque é exatamente isso. Use o período, descreva a atuação e traga números: média de corridas por turno, tempo médio de entrega, avaliação recebida na plataforma e tipos de entrega realizados. Um exemplo: 'Atuei com entregas de alimentos e encomendas por plataformas de delivery, com média de 25 a 30 corridas por turno e avaliação acima de 4,8.' Se você usou várias plataformas, pode agrupar em uma única linha de experiência. Muitos recrutadores valorizam esse histórico porque demonstra autonomia, conhecimento de rotas e capacidade de trabalhar sob meta e prazo.",
      },
      {
        question: "O que colocar no currículo de entregador sem experiência?",
        answer:
          "Comece pelo essencial: CNH com a categoria e validade, veículo próprio se houver, disponibilidade de horário e as regiões que você conhece bem. Em seguida, use qualquer experiência anterior para demonstrar pontualidade, responsabilidade com valores e atendimento ao cliente — trabalhos em comércio, serviços ou até atividades informais servem. Se você fez curso de direção defensiva ou de transporte de passageiros e cargas, destaque. E deixe claro que conhece a região de atuação, citando bairros: esse é um diferencial concreto, porque reduz o tempo de adaptação e o risco de atraso nas primeiras semanas.",
      },
      {
        question: "Como destacar que sou um entregador confiável?",
        answer:
          "Com fatos verificáveis, não com adjetivos. Três informações fazem esse trabalho: histórico sem acidente e sem multa (informe o período), percentual de entregas realizadas no prazo, e experiência com recebimento de valores e prestação de contas sem divergência. Essa última é especialmente forte, porque entrega envolve confiança sobre produto e dinheiro. Se você trabalhou com itens de maior valor ou controlados — medicamentos, eletrônicos, documentos —, mencione, porque indica que empresas anteriores já confiaram em você para esse tipo de carga. Evite escrever apenas 'sou pontual e responsável': isso está em todo currículo e não comunica nada.",
      },
      {
        question: "Vale a pena tirar o curso de mototaxista ou motofretista?",
        answer:
          "Vale, e em muitos municípios ele é exigido para atuar profissionalmente com entregas em motocicleta. O curso especializado para condutores de moto no transporte remunerado de cargas costuma ser requisito em vagas formais e é verificado no processo de admissão. Além de abrir portas, ele é relativamente rápido e barato perto do retorno. No currículo, liste na seção de cursos com a instituição e o ano, e informe se está dentro da validade. Some a isso a observação na CNH que autoriza o exercício de atividade remunerada, que também costuma ser exigida — sem ela, boa parte das vagas formais fica inacessível.",
      },
      {
        question: "Devo informar se tenho pontos na carteira?",
        answer:
          "Se a vaga exigir prontuário limpo, sim — a consulta é feita na admissão e a omissão gera desligamento imediato e queima a relação com a empresa. Se você tem a carteira sem pontuação, transforme isso em um diferencial explícito no currículo: 'CNH categorias A e B, sem pontuação'. É uma informação que poucos candidatos colocam e que reduz o risco percebido pelo empregador, especialmente em empresas que respondem por frota. Se você tem pontos, mas dentro do limite e sem suspensão, não é preciso destacar no documento — mas responda com honestidade se for perguntado na entrevista.",
      },
    ],
  },
  {
    slug: "pedreiro",
    profession: "Pedreiro",
    metaTitle: "Modelo de Currículo para Pedreiro (Exemplo Pronto 2026)",
    h1: "Modelo de Currículo para Pedreiro",
    metaDescription:
      "Modelo de currículo para pedreiro com exemplo real: alvenaria, reboco, assentamento, leitura de projeto, NR-18, NR-35, palavras-chave de ATS e faixa salarial.",
    intro:
      "Pedreiro é uma das profissões em que o currículo escrito ainda faz diferença, mesmo com a contratação acontecendo muito por indicação. Construtoras e empresas de manutenção predial usam triagem formal e procuram informações específicas: que tipo de serviço você executa (alvenaria estrutural, alvenaria de vedação, reboco, assentamento, contrapiso), em que porte de obra atuou e se você tem as normas de segurança em dia. Este modelo mostra como transformar anos de experiência prática em um documento que passa na triagem, com exemplo pronto e a lista de palavras-chave que as vagas usam.",
    sampleResume: {
      name: "Antônio Ferreira dos Santos",
      headline: "Pedreiro | Alvenaria Estrutural, Reboco e Assentamento | NR-18 e NR-35",
      summary:
        "Pedreiro com 12 anos de experiência em obras residenciais e comerciais, atuando em alvenaria estrutural e de vedação, reboco, contrapiso, assentamento de cerâmica e porcelanato. Leitura de projeto arquitetônico básico e uso de nível a laser e prumo. Experiência em obras de até 8 pavimentos, com NR-18 e NR-35 em dia e histórico sem acidente.",
      experience: [
        {
          role: "Pedreiro",
          company: "Construtora Horizonte Empreendimentos",
          period: "Mar 2020 - Atual",
          bullets: [
            "Executo alvenaria estrutural e de vedação em obras residenciais de até 8 pavimentos, com controle de prumo, nível e alinhamento conforme projeto",
            "Realizo reboco interno e externo, chapisco e emboço, atendendo a média de 25 m² por dia com padrão de acabamento aprovado na inspeção",
            "Faço assentamento de cerâmica e porcelanato em áreas secas e molhadas, com uso de nível a laser e espaçadores",
            "Interpreto projeto arquitetônico básico para marcação de paredes e conferência de medidas antes do levante",
            "Oriento 2 serventes na frente de serviço, distribuindo tarefas e conferindo o traço de argamassa",
            "Cumpro integralmente as normas de segurança da obra (NR-18 e NR-35), com uso de EPI e participação nos DDS",
          ],
        },
        {
          role: "Pedreiro de Acabamento",
          company: "Reformas e Manutenção Predial Alvorada",
          period: "Jan 2016 - Fev 2020",
          bullets: [
            "Executei reformas residenciais completas: demolição, alvenaria, revestimento, contrapiso e acabamento",
            "Realizei assentamento de revestimentos em fachadas com uso de andaime e cinto de segurança",
            "Fiz reparos estruturais leves, impermeabilização de áreas molhadas e regularização de contrapiso",
            "Atendi diretamente clientes finais, com orçamento de material e prazo de execução",
          ],
        },
      ],
      education: [
        {
          degree: "Curso de Pedreiro de Alvenaria",
          institution: "SENAI",
          period: "2015",
        },
        {
          degree: "NR-18 (Construção Civil) e NR-35 (Trabalho em Altura)",
          institution: "Treinamento com reciclagem em 2025",
          period: "2025",
        },
        {
          degree: "Ensino Fundamental Completo",
          institution: "EE Vila Nova",
          period: "Concluído em 2010",
        },
      ],
      skills: [
        "Alvenaria estrutural e de vedação",
        "Reboco, chapisco e emboço",
        "Assentamento de cerâmica e porcelanato",
        "Contrapiso e regularização",
        "Leitura de projeto arquitetônico básico",
        "Nível a laser, prumo e trena",
        "Traço de argamassa e concreto",
        "NR-18 e NR-35",
      ],
    },
    keySkills: [
      "Alvenaria estrutural e alvenaria de vedação",
      "Reboco, chapisco, emboço e acabamento",
      "Assentamento de cerâmica, porcelanato e pedras",
      "Contrapiso, regularização e nivelamento",
      "Leitura de projeto e marcação de obra",
      "Uso de nível a laser, prumo, esquadro e trena",
      "Traço de argamassa, concreto e dosagem",
      "Impermeabilização de áreas molhadas",
      "Normas de segurança (NR-18, NR-35, NR-06)",
      "Liderança de servente e organização da frente de serviço",
    ],
    atsKeywords: [
      "Pedreiro",
      "Alvenaria",
      "Alvenaria Estrutural",
      "Reboco",
      "Chapisco",
      "Emboço",
      "Assentamento",
      "Porcelanato",
      "Cerâmica",
      "Contrapiso",
      "Construção Civil",
      "Obra Residencial",
      "Reforma",
      "Leitura de Projeto",
      "Nível a Laser",
      "Argamassa",
      "Impermeabilização",
      "NR-18",
      "NR-35",
      "Acabamento",
    ],
    salaryNote:
      "No Brasil (2026), o pedreiro costuma receber entre R$ 2.200 e R$ 4.000 em regime CLT, com variação relevante por região e por especialização. Pedreiros de acabamento fino, de alvenaria estrutural e de obras industriais tendem a ficar acima da média, e o trabalho autônomo por empreitada pode superar essas faixas em períodos de alta demanda. O piso da categoria é definido pela convenção coletiva do sindicato da construção civil de cada região — confira a convenção vigente antes de negociar.",
    dos: [
      "Especifique os tipos de serviço que você executa: alvenaria estrutural, vedação, reboco, assentamento, contrapiso.",
      "Informe o porte das obras em que atuou (residencial, comercial, número de pavimentos) — dimensiona a sua experiência.",
      "Use produtividade quando tiver: metros quadrados por dia, número de unidades entregues.",
      "Destaque NR-18 e NR-35 com o ano da reciclagem: obras formais não contratam sem isso.",
      "Mencione se lidera servente ou equipe, o que aproxima o perfil de encarregado.",
      "Cite leitura de projeto e uso de nível a laser: diferencia você da maioria dos candidatos.",
    ],
    donts: [
      "Não escreva apenas 'trabalhei em obras' sem dizer que serviços executava.",
      "Não deixe de citar as normas de segurança: em construtoras é requisito eliminatório.",
      "Não omita o tipo de obra; o vocabulário e a exigência de residencial, industrial e reforma são diferentes.",
      "Não use currículo com foto e enfeites: construtoras médias e grandes usam triagem automática.",
      "Não deixe períodos de trabalho autônomo sem registro — descreva como experiência, com o tipo de serviço.",
      "Não liste ferramentas genéricas sem dizer o que você executa com elas.",
    ],
    faqs: [
      {
        question: "Como fazer currículo de pedreiro?",
        answer:
          "Comece com um título objetivo que já traga a sua especialidade, como 'Pedreiro | Alvenaria Estrutural, Reboco e Assentamento | NR-18 e NR-35'. Em seguida, um resumo de três linhas com o tempo de experiência, os tipos de serviço que você domina e o porte das obras em que atuou. Na experiência, descreva cada obra ou empregador com os serviços executados e, sempre que possível, com produtividade — metros quadrados por dia, número de unidades. Liste as normas de segurança com o ano da reciclagem em uma seção própria. Mantenha em uma página, layout simples em coluna única e envie em PDF: construtoras médias e grandes usam triagem automática.",
      },
      {
        question: "Preciso de curso para ser pedreiro?",
        answer:
          "Não é obrigatório para exercer a função, e boa parte dos profissionais aprende na prática. Mas um curso de formação em alvenaria, revestimento ou leitura de projeto faz diferença clara na triagem de construtoras e em obras maiores, além de facilitar a evolução para encarregado. Igualmente importantes são os treinamentos de segurança: NR-18 (construção civil) e NR-35 (trabalho em altura) são exigidos em praticamente toda obra formal, e a ausência deles elimina o candidato antes de qualquer avaliação técnica. Se você tem experiência mas nenhum curso, priorize essas duas normas — são rápidas, baratas e destravam vagas imediatamente.",
      },
      {
        question: "Como comprovar experiência se sempre trabalhei por conta própria?",
        answer:
          "Registre o período como uma experiência profissional normal, com o título 'Pedreiro Autônomo' e o intervalo de datas, e descreva o tipo de serviço executado: reformas residenciais completas, alvenaria, revestimento, contrapiso, acabamento. Informe o volume aproximado — quantas obras por ano, metragem típica, se conduzia equipe. Se você tem fotos dos serviços, referências de clientes ou contatos de contratantes que possam confirmar, mencione que pode apresentar referências. Muitas construtoras aceitam bem esse histórico, desde que ele esteja descrito com clareza; o problema é deixar o período em branco, o que gera dúvida sobre o que você fez naqueles anos.",
      },
      {
        question: "O que diferencia um pedreiro de acabamento?",
        answer:
          "O pedreiro de acabamento é especializado nas etapas finais da obra, em que o padrão de qualidade visual é mais exigente: reboco fino, assentamento de porcelanato de grande formato, rejunte, revestimento de fachada, detalhes de esquadro e alinhamento. Exige mais precisão, uso de nível a laser e cuidado com o material, que costuma ser caro. Por isso, normalmente é mais bem remunerado do que a alvenaria bruta. Se você atua nessa etapa, deixe explícito no currículo — cite os tipos de revestimento com que trabalha, os formatos de peça e o padrão de acabamento entregue. É uma especialização que muitos executam e poucos registram.",
      },
      {
        question: "Vale a pena colocar NR-18 e NR-35 no currículo de pedreiro?",
        answer:
          "Vale, e devem estar em destaque. Em obras de construtoras, empresas de manutenção predial e canteiros organizados, esses treinamentos são requisito de entrada, e o candidato que já os possui reduz custo e prazo de integração — o que na prática o coloca à frente. Crie uma seção específica de 'Treinamentos e Normas' e liste cada uma com o ano da formação e o da última reciclagem, informando se está válida. Se você trabalha com andaime, plataforma elevatória ou escada, a NR-35 é praticamente indispensável. Vale ainda mencionar a participação em DDS e o uso disciplinado de EPI, que reforçam a percepção de profissional seguro.",
      },
      {
        question: "Como me tornar encarregado de obra?",
        answer:
          "O caminho mais comum combina três coisas: domínio técnico amplo (não só uma etapa), capacidade de ler projeto e capacidade de conduzir equipe. No currículo, isso deve aparecer em bullets concretos: quantas pessoas você orientava, se distribuía tarefas e conferia serviço, se controlava material e traço, se conferia medidas contra o projeto. Cursos de leitura e interpretação de projeto, noções de planejamento de obra e segurança do trabalho aceleram bastante a transição. Registre também qualquer experiência em que você respondeu por uma frente de serviço inteira, mesmo informalmente — é essa evidência que sustenta a mudança de nível na entrevista.",
      },
    ],
  },
  {
    slug: "pintor",
    profession: "Pintor",
    metaTitle: "Modelo de Currículo para Pintor (Predial e Industrial) 2026",
    h1: "Modelo de Currículo para Pintor Predial e Industrial",
    metaDescription:
      "Modelo de currículo para pintor com exemplo pronto: pintura predial, industrial, texturas, preparação de superfície, NR-35, ATS e faixa salarial.",
    intro:
      "Pintor é uma função em que a diferença entre o profissional comum e o bem pago está em detalhes que raramente aparecem no currículo: preparação de superfície, tipo de tinta e sistema de pintura, técnicas de aplicação e trabalho em altura. Vagas de pintura predial em construtoras e de pintura industrial em manutenção têm exigências bem diferentes, e quem não especifica acaba concorrendo às vagas erradas. Este modelo mostra como descrever a sua experiência com precisão técnica, quais normas destacar e como demonstrar padrão de acabamento — o critério que mais pesa na contratação.",
    sampleResume: {
      name: "Sérgio Nogueira Campos",
      headline: "Pintor Predial e Industrial | Preparação de Superfície, Epóxi e Texturas | NR-35",
      summary:
        "Pintor com 9 anos de experiência em pintura predial e industrial, atuando em preparação de superfície, aplicação de massa corrida e acrílica, pintura látex, esmalte, epóxi e texturas. Experiência em trabalho em altura com andaime e balancim, com NR-35 e NR-18 em dia. Histórico de entregas aprovadas na primeira inspeção de acabamento.",
      experience: [
        {
          role: "Pintor Predial",
          company: "Construtora Vertical Empreendimentos",
          period: "Abr 2021 - Atual",
          bullets: [
            "Executo pintura interna e externa em obras residenciais, com preparação completa de superfície: lixamento, correção, massa corrida e selador",
            "Aplico tinta látex e acrílica em média de 90 m² por dia, com padrão de acabamento aprovado na primeira inspeção em mais de 90% das unidades",
            "Realizo pintura de fachada com uso de balancim e cinto de segurança, conforme NR-35 e procedimento da obra",
            "Aplico textura, grafiato e efeito decorativo conforme especificação do projeto de arquitetura",
            "Faço o controle de consumo de material por unidade, reduzindo desperdício de tinta em cerca de 15% na obra atual",
          ],
        },
        {
          role: "Pintor Industrial",
          company: "Manutenção Industrial Ferrotec",
          period: "Fev 2017 - Mar 2021",
          bullets: [
            "Executei pintura industrial em estruturas metálicas e tubulações, com preparação por lixamento mecânico e tratamento anticorrosivo",
            "Apliquei sistema de pintura com fundo epóxi e acabamento poliuretano, seguindo especificação de espessura de camada",
            "Realizei pintura de piso industrial em epóxi, com preparo de substrato e controle de umidade",
            "Trabalhei em áreas industriais com uso obrigatório de EPI específico, incluindo respirador e proteção química",
          ],
        },
      ],
      education: [
        {
          degree: "Curso de Pintor de Obras",
          institution: "SENAI",
          period: "2016",
        },
        {
          degree: "NR-35 (Trabalho em Altura) e NR-18 (Construção Civil)",
          institution: "Treinamento com reciclagem em 2025",
          period: "2025",
        },
        {
          degree: "Ensino Médio Completo",
          institution: "EE Santo Antônio",
          period: "Concluído em 2014",
        },
      ],
      skills: [
        "Preparação de superfície e correção",
        "Massa corrida, massa acrílica e selador",
        "Tinta látex, acrílica e esmalte",
        "Pintura epóxi e poliuretano",
        "Textura, grafiato e efeitos decorativos",
        "Trabalho em altura (andaime e balancim)",
        "Pistola, rolo e trincha",
        "NR-35 e NR-18",
      ],
    },
    keySkills: [
      "Preparação de superfície (lixamento, correção, selador)",
      "Aplicação de massa corrida, massa acrílica e gesso",
      "Pintura látex, acrílica, esmalte sintético e verniz",
      "Pintura industrial com epóxi e poliuretano",
      "Texturas, grafiato e efeitos decorativos",
      "Pintura de piso e demarcação industrial",
      "Aplicação com rolo, trincha, pistola e airless",
      "Trabalho em altura com andaime, balancim e cadeirinha",
      "Cálculo de consumo e controle de desperdício de material",
      "Normas de segurança (NR-06, NR-18, NR-35)",
    ],
    atsKeywords: [
      "Pintor",
      "Pintor Predial",
      "Pintor Industrial",
      "Pintura",
      "Preparação de Superfície",
      "Massa Corrida",
      "Massa Acrílica",
      "Tinta Látex",
      "Tinta Acrílica",
      "Esmalte Sintético",
      "Epóxi",
      "Poliuretano",
      "Textura",
      "Grafiato",
      "Fachada",
      "Andaime",
      "Balancim",
      "Airless",
      "NR-35",
      "NR-18",
    ],
    salaryNote:
      "No Brasil (2026), o pintor costuma receber entre R$ 2.000 e R$ 3.500 em regime CLT, com valores mais altos para pintura industrial, pintura de fachada em altura e aplicação de sistemas especiais como epóxi e poliuretano. Trabalhos por empreitada podem superar essas faixas em períodos de alta demanda. O piso é definido pela convenção coletiva da construção civil ou da categoria industrial da região, e adicionais de periculosidade e altura podem se aplicar conforme a atividade.",
    dos: [
      "Diferencie claramente pintura predial de pintura industrial: são mercados e exigências distintos.",
      "Descreva a preparação de superfície — é o que separa o pintor profissional do improvisado.",
      "Cite os tipos de tinta e sistema que você aplica: látex, acrílica, esmalte, epóxi, poliuretano.",
      "Informe produtividade em metros quadrados por dia e padrão de aprovação em inspeção.",
      "Destaque NR-35 se você trabalha em altura, com balancim, andaime ou cadeirinha.",
      "Mencione controle de consumo de material: economia de tinta é um argumento forte para construtoras.",
    ],
    donts: [
      "Não escreva apenas 'pintor' sem dizer o segmento e as técnicas que domina.",
      "Não omita a preparação de superfície; sem ela, o recrutador supõe que você só aplica tinta.",
      "Não deixe de citar as normas de segurança em vagas de obra e indústria.",
      "Não use fotos e enfeites no currículo — a triagem automática lê melhor o layout simples.",
      "Não descreva trabalho autônomo como lacuna: registre como experiência com os serviços executados.",
      "Não invente domínio de sistemas industriais como epóxi: há inspeção de espessura e acabamento.",
    ],
    faqs: [
      {
        question: "Qual a diferença entre pintor predial e pintor industrial?",
        answer:
          "O pintor predial atua em obras e reformas residenciais e comerciais, com foco em acabamento visual: preparação de parede, massa corrida, látex, acrílica, esmalte, texturas e fachadas. O pintor industrial trabalha com proteção de superfícies metálicas e concreto em ambiente fabril, aplicando sistemas anticorrosivos como epóxi e poliuretano, com exigência de preparo de substrato, controle de espessura de camada e uso de EPI específico. A remuneração industrial costuma ser maior, mas exige conhecimento técnico de sistemas de pintura e, muitas vezes, normas adicionais de segurança. No currículo, deixe claro em qual você atua — ou nos dois, se for o caso.",
      },
      {
        question: "Como descrever preparação de superfície no currículo?",
        answer:
          "Descreva as etapas que você executa, porque é justamente aí que se avalia a qualificação do pintor. Em pintura predial: limpeza, lixamento, correção de imperfeições, aplicação de massa (corrida ou acrílica), lixamento fino e selador antes da tinta. Em pintura industrial: limpeza mecânica ou jateamento, remoção de oxidação, tratamento anticorrosivo e aplicação de fundo antes do acabamento. Um bullet forte seria: 'Executo preparação completa de superfície — lixamento, correção, massa corrida e selador — antes da aplicação, com acabamento aprovado na primeira inspeção em mais de 90% das unidades.' Isso comunica método, e método é o que diferencia o profissional.",
      },
      {
        question: "Preciso de curso para trabalhar como pintor?",
        answer:
          "Não é obrigatório, e muitos profissionais aprendem na prática, mas um curso de formação em pintura de obras ajuda bastante na triagem de construtoras e é praticamente indispensável para pintura industrial, onde há especificação técnica de sistema e espessura. Mais importante do que o curso técnico, porém, são as normas de segurança: NR-35 é requisito para qualquer serviço em altura — fachada, andaime, balancim — e NR-18 é exigida em canteiro de obras formal. Ambas são rápidas e destravam vagas imediatamente. Se você pretende migrar para pintura industrial, cursos de sistemas de pintura anticorrosiva são o passo seguinte.",
      },
      {
        question: "Como colocar produtividade no currículo de pintor?",
        answer:
          "Use metros quadrados por dia, número de unidades entregues por período e taxa de aprovação na inspeção. Por exemplo: 'Aplico tinta látex e acrílica em média de 90 m² por dia, com acabamento aprovado na primeira inspeção em mais de 90% das unidades.' Esses números dizem duas coisas ao mesmo tempo: que você trabalha em ritmo compatível com obra e que entrega qualidade sem retrabalho — e retrabalho é justamente o custo que mais preocupa quem contrata. Se você não tem os números exatos, use estimativas honestas e sinalize como tal. Ainda assim comunicam muito mais do que uma lista de atividades sem medida.",
      },
      {
        question: "Vale a pena aprender textura e grafiato?",
        answer:
          "Vale bastante, porque são serviços de maior valor agregado e com menos profissionais qualificados. Texturas, grafiato, efeitos decorativos, cimento queimado e acabamentos especiais costumam ser cobrados por metro quadrado a preços bem superiores à pintura convencional, tanto em obra quanto em trabalho autônomo. Além disso, ampliam o leque de vagas em construtoras que trabalham com padrão de acabamento mais alto. No currículo, liste cada técnica separadamente e, se possível, cite o tipo de projeto em que aplicou. Quem também domina pintura industrial com epóxi cobre as duas pontas de melhor remuneração da profissão.",
      },
      {
        question: "Como fazer currículo de pintor autônomo?",
        answer:
          "Registre o período como experiência profissional com o título 'Pintor Autônomo' e o intervalo de datas — deixar em branco gera dúvida, e é o principal erro. Descreva os serviços executados (pintura interna e externa, fachadas, texturas, reformas completas), o volume aproximado de obras por ano e a metragem típica. Se você fazia orçamento, comprava material e conduzia ajudantes, mencione: isso demonstra autonomia e capacidade de gestão, que interessa a empresas de manutenção predial. Informe que pode apresentar referências de clientes e, se tiver, mencione um portfólio de fotos dos serviços — em pintura, a evidência visual pesa muito na decisão.",
      },
    ],
  },
  {
    slug: "tecnico-de-seguranca-do-trabalho",
    profession: "Técnico de Segurança do Trabalho",
    metaTitle: "Modelo de Currículo para Técnico de Segurança do Trabalho 2026",
    h1: "Modelo de Currículo para Técnico de Segurança do Trabalho",
    metaDescription:
      "Modelo de currículo para técnico de segurança do trabalho: NRs, PGR, PCMSO, CIPA, indicadores de acidente, exemplo pronto, ATS e faixa salarial.",
    intro:
      "O currículo de técnico de segurança do trabalho é avaliado por dois públicos: o RH, que filtra pelo registro no Ministério do Trabalho e pelas normas dominadas, e o gestor de SESMT, que quer ver indicadores — taxa de frequência, taxa de gravidade, número de acidentes com afastamento. Currículos que listam apenas as NRs sem nenhum resultado perdem para os que mostram redução de acidente e programas implantados. Este modelo mostra como equilibrar as duas exigências, quais documentos e programas citar e como demonstrar atuação prática em campo, e não apenas domínio teórico de norma.",
    sampleResume: {
      name: "Patrícia Mendes Carvalho",
      headline: "Técnica de Segurança do Trabalho | PGR, PCMSO e CIPA | Indústria e Construção Civil",
      summary:
        "Técnica de segurança do trabalho com 7 anos de atuação em indústria de transformação e obras civis, responsável por PGR, integração, treinamentos de NR, gestão de EPI e investigação de acidentes. Histórico de redução da taxa de frequência de acidentes e de condução de CIPA e SIPAT. Registro no Ministério do Trabalho ativo.",
      experience: [
        {
          role: "Técnica de Segurança do Trabalho",
          company: "Indústria Metalúrgica Campos & Cia (420 colaboradores)",
          period: "Jul 2021 - Atual",
          bullets: [
            "Reduzi a taxa de frequência de acidentes com afastamento de 12,4 para 4,8 em dois anos, com plano de ação baseado em análise de causa-raiz",
            "Elaboro e mantenho o PGR e o inventário de riscos da unidade, com atualização das medidas de controle por setor",
            "Conduzo treinamentos de NR-06, NR-10, NR-11, NR-12, NR-33 e NR-35, com média de 900 horas-homem de treinamento por ano",
            "Realizo inspeções de segurança semanais em 6 setores produtivos, com registro de não conformidades e acompanhamento de prazo de correção",
            "Coordeno a CIPA e organizo a SIPAT anual, com participação superior a 85% dos colaboradores",
            "Investigo acidentes e incidentes, emitindo relatório de análise de causa e acompanhando a emissão de CAT junto ao RH",
            "Gerencio a matriz de EPI por função, com controle de entrega, troca e ficha de registro assinada",
          ],
        },
        {
          role: "Técnico de Segurança do Trabalho",
          company: "Construtora Ipê Obras e Infraestrutura",
          period: "Mar 2019 - Jun 2021",
          bullets: [
            "Atuei em canteiro de obras com até 180 trabalhadores, respondendo pelo cumprimento da NR-18 e NR-35",
            "Realizei a integração de segurança de todos os novos trabalhadores e das empresas terceirizadas",
            "Acompanhei liberação de trabalho em altura, espaço confinado e serviços a quente, com emissão de permissão de trabalho",
            "Conduzi DDS diários e inspeções de andaimes, plataformas, guarda-corpos e instalações elétricas provisórias",
            "Apoiei a documentação para auditorias de cliente e fiscalizações, sem autuação no período",
          ],
        },
      ],
      education: [
        {
          degree: "Técnico em Segurança do Trabalho — registro ativo no Ministério do Trabalho",
          institution: "SENAC",
          period: "2017 - 2018",
        },
        {
          degree: "Formação de Auditor Interno em Sistema de Gestão de SST",
          institution: "Curso livre",
          period: "2023",
        },
        {
          degree: "Ensino Médio Completo",
          institution: "EE Monteiro Lobato",
          period: "Concluído em 2015",
        },
      ],
      skills: [
        "PGR e inventário de riscos",
        "PCMSO (interface com medicina do trabalho)",
        "Treinamentos de NR e integração",
        "Investigação de acidentes e análise de causa",
        "CIPA e SIPAT",
        "Gestão de EPI e matriz por função",
        "Permissão de trabalho (altura, quente, confinado)",
        "Indicadores de SST (taxa de frequência e gravidade)",
      ],
    },
    keySkills: [
      "Elaboração e gestão do PGR e inventário de riscos",
      "Interface com PCMSO e medicina do trabalho",
      "Treinamentos das normas regulamentadoras e integração",
      "Investigação de acidentes e análise de causa-raiz",
      "Coordenação de CIPA e organização da SIPAT",
      "Gestão de EPI: matriz por função, entrega e ficha de controle",
      "Emissão e controle de permissão de trabalho",
      "Inspeções de segurança e acompanhamento de não conformidades",
      "Indicadores de SST (taxa de frequência, gravidade, quase acidentes)",
      "Atendimento a fiscalização e auditoria de cliente",
    ],
    atsKeywords: [
      "Técnico de Segurança do Trabalho",
      "SESMT",
      "PGR",
      "PCMSO",
      "GRO",
      "CIPA",
      "SIPAT",
      "CAT",
      "NR-06",
      "NR-10",
      "NR-12",
      "NR-18",
      "NR-33",
      "NR-35",
      "Investigação de Acidentes",
      "Análise de Risco",
      "Permissão de Trabalho",
      "Gestão de EPI",
      "Taxa de Frequência",
      "Inspeção de Segurança",
    ],
    salaryNote:
      "No Brasil (2026), o técnico de segurança do trabalho costuma receber entre R$ 2.800 e R$ 5.500, com valores mais altos em indústrias de grande porte, obras de infraestrutura, setor químico, petroquímico e de energia. Atuação em canteiro de obras com muitos trabalhadores, domínio de normas de alto risco (NR-10, NR-33, NR-35) e experiência com sistema de gestão certificado tendem a puxar a remuneração para o topo da faixa. O registro ativo no Ministério do Trabalho é requisito para o exercício da profissão.",
    dos: [
      "Coloque o registro no Ministério do Trabalho em destaque, logo abaixo do contato.",
      "Informe o porte da operação: número de colaboradores, número de setores, tamanho do canteiro.",
      "Traga indicadores: taxa de frequência, taxa de gravidade, acidentes com afastamento, horas de treinamento.",
      "Liste os programas e documentos que você elabora ou mantém: PGR, inventário de riscos, ordens de serviço, PPRA legado.",
      "Especifique as NRs em que você ministra treinamento — não apenas as que conhece.",
      "Mencione experiência com fiscalização, auditoria de cliente e sistema de gestão, se houver.",
    ],
    donts: [
      "Não liste apenas as normas regulamentadoras como se fossem habilidades — mostre o que você faz com elas.",
      "Não omita indicadores: sem números, o currículo parece teórico.",
      "Não descreva atividades genéricas como 'zelei pela segurança dos colaboradores'.",
      "Não misture indústria e obra sem diferenciar: as exigências e as normas aplicáveis são distintas.",
      "Não deixe de citar o registro profissional ativo — é requisito legal e o RH confere.",
      "Não esconda o número de acidentes ocorridos: o valor está em mostrar como você reduziu.",
    ],
    faqs: [
      {
        question: "O que o técnico de segurança do trabalho faz na prática?",
        answer:
          "Atua na identificação, avaliação e controle dos riscos ocupacionais de uma organização. Na rotina, isso envolve elaborar e manter o programa de gerenciamento de riscos, realizar inspeções de segurança, ministrar treinamentos das normas regulamentadoras, conduzir a integração de novos colaboradores e de terceiros, gerenciar a matriz e a entrega de EPI, investigar acidentes e incidentes com análise de causa, acompanhar a emissão de CAT, coordenar a CIPA e organizar a SIPAT. Em obras, soma-se a emissão e o controle de permissões de trabalho para altura, espaço confinado e serviços a quente. O desempenho costuma ser medido por indicadores como taxa de frequência e taxa de gravidade de acidentes.",
      },
      {
        question: "Preciso de registro para trabalhar como técnico de segurança do trabalho?",
        answer:
          "Sim. O exercício da profissão exige formação técnica específica e registro profissional junto ao Ministério do Trabalho, e as empresas verificam esse documento antes da contratação. Por isso, coloque o registro em destaque no currículo, logo abaixo dos dados de contato, e mantenha-o ativo. Sem ele, o candidato não passa da triagem, mesmo com experiência prática. Além do registro, é comum que as vagas peçam os treinamentos das normas com as quais o profissional vai atuar e, em setores de risco elevado, formações complementares como brigada de incêndio, primeiros socorros e auditoria de sistema de gestão.",
      },
      {
        question: "Quais indicadores colocar no currículo de segurança do trabalho?",
        answer:
          "Os mais reconhecidos são a taxa de frequência (acidentes por milhão de horas trabalhadas) e a taxa de gravidade (dias perdidos por milhão de horas), porque permitem comparação entre operações. Some a eles o número de acidentes com e sem afastamento, a variação ano a ano, horas-homem de treinamento realizadas, número de inspeções e percentual de não conformidades tratadas no prazo, e taxa de participação em CIPA e SIPAT. Um bullet forte é: 'Reduzi a taxa de frequência de acidentes com afastamento de 12,4 para 4,8 em dois anos com plano de ação baseado em análise de causa-raiz.' Esse tipo de dado diferencia imediatamente o currículo.",
      },
      {
        question: "Como destacar as NRs no currículo?",
        answer:
          "Separe o que você conhece do que você efetivamente ministra ou aplica. Crie uma seção com as normas em que você conduz treinamento, indicando a carga horária média e o público, e outra com as normas em que atua na aplicação e fiscalização em campo. Isso é bem mais informativo do que uma lista solta de números. Destaque as de maior peso conforme o setor da vaga: NR-10 e NR-33 para indústria e energia, NR-18 e NR-35 para construção civil, NR-12 para operações com máquinas, NR-13 e NR-20 para processos com caldeira e inflamáveis. Um técnico que ministra NR-10 e NR-33 costuma ter acesso a faixas salariais mais altas.",
      },
      {
        question: "Qual a diferença entre atuar em indústria e em obra?",
        answer:
          "Em indústria, a rotina é mais estável e centrada em gestão de programa, treinamento periódico, inspeções por setor, ergonomia, gestão de EPI e indicadores de médio prazo. Em obra, o ambiente muda a cada etapa e a atuação é mais dinâmica: NR-18 é o eixo central, há forte controle de terceiros, emissão diária de permissões de trabalho, inspeção de andaimes, plataformas e instalações provisórias, e integração constante de novos trabalhadores. As duas experiências são valorizadas, mas exigem vocabulário diferente no currículo. Se você atuou nas duas, separe as experiências e descreva cada uma com os termos próprios do ambiente — isso amplia bastante o número de vagas em que você aparece.",
      },
      {
        question: "Como conseguir a primeira vaga de técnico de segurança do trabalho?",
        answer:
          "Priorize três frentes. Primeira: conclua o registro profissional e destaque-o no topo do currículo, junto com os treinamentos complementares que você já tem (brigada de incêndio, primeiros socorros, formação em NRs específicas). Segunda: transforme o estágio ou as atividades práticas do curso técnico em experiência descrita — inspeções realizadas, treinamentos aplicados, documentos elaborados, com o porte da operação. Terceira: mire setores com maior demanda e maior rotatividade de canteiro, como construção civil e prestadoras de serviço industrial, que costumam ser mais abertas a profissionais em início de carreira. Se você já trabalha em uma indústria em outra função, a transição interna costuma ser o caminho mais rápido.",
      },
    ],
  },
];
