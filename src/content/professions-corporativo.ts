import type { Profession } from "./types";

// Profissões corporativas, técnicas e programas de entrada (aprendiz e estágio).
// As faixas em `salaryNote` são referências de mercado e variam por região,
// porte da empresa e convenção coletiva — mantenha o texto sempre com essa ressalva.
export const PROFESSIONS_CORPORATIVO: Profession[] = [
  {
    slug: "jovem-aprendiz",
    profession: "Jovem Aprendiz",
    metaTitle: "Modelo de Currículo para Jovem Aprendiz (Exemplo Pronto 2026)",
    h1: "Modelo de Currículo para Jovem Aprendiz",
    metaDescription:
      "Modelo de currículo para jovem aprendiz sem experiência: o que colocar, exemplo pronto para preencher, palavras-chave de ATS e como passar na triagem.",
    intro:
      "Se você está montando o seu primeiro currículo para uma vaga de jovem aprendiz, a boa notícia é que ninguém espera experiência profissional — o programa existe justamente para quem está começando. O que as empresas avaliam é outra coisa: se você está estudando, se tem disponibilidade compatível com a escola, se demonstra interesse real e se sabe se comunicar. E aqui está o detalhe que muda tudo: como quase todos os candidatos são iniciantes, um currículo bem organizado, sem erros e com informações completas já coloca você à frente da maioria. Este modelo mostra exatamente o que colocar em cada seção quando você ainda não trabalhou.",
    sampleResume: {
      name: "Gabriel Santos Oliveira",
      headline: "Jovem Aprendiz | Cursando Ensino Médio | Disponibilidade no período da tarde",
      summary:
        "Estudante do 2º ano do ensino médio, buscando a primeira oportunidade como jovem aprendiz na área administrativa. Tenho facilidade com informática (pacote Office e Google Workspace), boa comunicação escrita e experiência de organização adquirida como representante de turma e em trabalho voluntário. Disponibilidade no período da tarde, de segunda a sexta.",
      experience: [
        {
          role: "Voluntário — Organização de Arrecadação",
          company: "Projeto Social Mãos Unidas (bairro)",
          period: "Mar 2025 - Atual",
          bullets: [
            "Auxilio na organização e no controle das doações recebidas, com registro em planilha das entradas e saídas",
            "Ajudo na montagem de cerca de 80 cestas mensais e na organização do espaço de armazenamento",
            "Atendo as famílias no dia da entrega, conferindo a lista e orientando sobre o processo",
          ],
        },
        {
          role: "Representante de Turma",
          company: "EE Professor Almeida Prado",
          period: "Fev 2024 - Dez 2024",
          bullets: [
            "Fui eleito pela turma para representar 34 alunos junto à coordenação da escola",
            "Organizei a comunicação de avisos e prazos e ajudei a mediar combinados entre alunos e professores",
            "Participei da organização da feira cultural da escola, coordenando a montagem do estande da sala",
          ],
        },
      ],
      education: [
        {
          degree: "Ensino Médio — 2º ano (cursando, previsão de conclusão em 2027)",
          institution: "EE Professor Almeida Prado",
          period: "2024 - 2027",
        },
        {
          degree: "Curso de Informática Básica e Pacote Office (60h)",
          institution: "Programa gratuito de qualificação",
          period: "2025",
        },
        {
          degree: "Curso de Comunicação e Atendimento ao Cliente (20h)",
          institution: "Curso online gratuito",
          period: "2025",
        },
      ],
      skills: [
        "Pacote Office (Word, Excel e PowerPoint)",
        "Google Workspace (Docs, Planilhas e Drive)",
        "Digitação e organização de arquivos",
        "Comunicação escrita e oral",
        "Trabalho em equipe",
        "Organização e cumprimento de prazos",
        "Redes sociais e ferramentas digitais",
        "Disponibilidade no contraturno escolar",
      ],
    },
    keySkills: [
      "Estar matriculado e frequentando a escola",
      "Disponibilidade no contraturno escolar",
      "Informática básica: Office e Google Workspace",
      "Comunicação clara, escrita e falada",
      "Organização e cumprimento de prazos",
      "Trabalho em equipe e boa convivência",
      "Vontade de aprender e receber orientação",
      "Pontualidade e responsabilidade",
      "Atendimento ao público e cordialidade",
      "Noções de rotinas administrativas",
    ],
    atsKeywords: [
      "Jovem Aprendiz",
      "Aprendiz",
      "Primeiro Emprego",
      "Menor Aprendiz",
      "Ensino Médio",
      "Cursando",
      "Pacote Office",
      "Excel Básico",
      "Word",
      "Google Workspace",
      "Rotinas Administrativas",
      "Atendimento ao Cliente",
      "Organização",
      "Comunicação",
      "Trabalho em Equipe",
      "Disponibilidade",
      "Contraturno",
      "Voluntariado",
      "Curso de Informática",
      "Programa de Aprendizagem",
    ],
    salaryNote:
      "O contrato de aprendizagem no Brasil segue a legislação específica da Lei da Aprendizagem, com remuneração calculada sobre o salário mínimo hora conforme a jornada contratada — que costuma ser de 4 a 6 horas diárias, compatível com a frequência escolar. Na prática, os valores mensais costumam ficar entre R$ 700 e R$ 1.300, acrescidos de vale-transporte e, em muitas empresas, vale-refeição. O contrato é registrado em carteira e prevê férias, 13º e FGTS conforme as regras da modalidade, com duração máxima definida em lei.",
    dos: [
      "Coloque no topo que você está estudando, com o ano e a previsão de conclusão — é o requisito principal.",
      "Informe a sua disponibilidade de turno (manhã ou tarde) logo abaixo do contato.",
      "Trate voluntariado, representação de turma e projetos escolares como experiência: eles contam.",
      "Liste todos os cursos que fez, mesmo os online e gratuitos, com carga horária e ano.",
      "Use um e-mail sério com o seu nome e confira o telefone: erro de digitação aqui custa a vaga.",
      "Revise a ortografia com atenção — em um processo com muitos iniciantes, isso é um critério real de desempate.",
    ],
    donts: [
      "Não deixe o currículo em branco por não ter experiência: preencha com escola, cursos e atividades.",
      "Não use e-mail com apelido ou números aleatórios.",
      "Não coloque foto, CPF, RG nem endereço completo — não são necessários e expõem seus dados.",
      "Não escreva um objetivo genérico do tipo 'busco crescer profissionalmente'; diga a área que te interessa.",
      "Não use enfeites, cores fortes e fontes decorativas: empresas grandes usam triagem automática.",
      "Não invente cursos ou habilidades: perguntas simples na entrevista revelam rapidamente.",
    ],
    faqs: [
      {
        question: "Como fazer currículo de jovem aprendiz sem nenhuma experiência?",
        answer:
          "Monte o currículo com o que você tem, e é mais do que parece. No topo: nome, telefone com WhatsApp, e-mail sério, cidade e bairro, e uma linha de disponibilidade. Depois, um resumo de três linhas dizendo que você está cursando o ensino médio, qual área te interessa e quais habilidades você já desenvolveu. Em seguida, uma seção de atividades e experiências, onde entram voluntariado, representação de turma, projetos escolares, ajuda em negócio da família e trabalhos pontuais. Por último, formação e cursos, incluindo os online e gratuitos, com carga horária. Uma página, layout simples, sem erros de português.",
      },
      {
        question: "O que colocar como experiência se nunca trabalhei?",
        answer:
          "Use tudo que envolveu responsabilidade, organização ou convívio com outras pessoas — e descreva com verbos de ação, como você descreveria um emprego. Vale trabalho voluntário, representação de turma ou grêmio, organização de eventos da escola, participação em times e grupos, monitoria, ajuda em negócio de familiares, venda de produtos por conta própria e projetos escolares que você conduziu. Exemplo: 'Auxiliei na organização das doações do projeto social, com registro em planilha e montagem de cerca de 80 cestas mensais.' Isso comunica muito mais do que deixar a seção vazia — e mostra iniciativa, que é o que o programa procura.",
      },
      {
        question: "Quais cursos ajudam a conseguir vaga de jovem aprendiz?",
        answer:
          "Os que mais aparecem nas vagas são informática básica (Word, Excel e Google Workspace), atendimento ao cliente, rotinas administrativas e comunicação. Todos têm versões gratuitas online, inclusive com certificado, e podem ser concluídos em poucas semanas. Se a vaga que você quer é de uma área específica — logística, vendas, saúde, tecnologia —, procure um curso introdutório dessa área: demonstra interesse real e não apenas necessidade de emprego. Liste cada curso com a carga horária e o ano no currículo. Para um candidato sem experiência, essa seção é uma das que mais pesam na triagem.",
      },
      {
        question: "Qual a idade e os requisitos para ser jovem aprendiz?",
        answer:
          "O programa de aprendizagem é destinado a jovens dentro da faixa etária prevista na legislação específica — em regra, a partir dos 14 anos e até uma idade limite definida em lei, com regras próprias para pessoas com deficiência. O requisito central é estar matriculado e frequentando a escola, ou já ter concluído o ensino médio, conforme o caso, e a jornada deve ser compatível com os horários escolares. O contrato é registrado em carteira, tem duração máxima definida em lei e combina trabalho na empresa com um curso de formação técnico-profissional. Confirme os requisitos vigentes e a faixa etária atual antes de se candidatar.",
      },
      {
        question: "Preciso colocar foto no currículo de jovem aprendiz?",
        answer:
          "Não. Foto não é necessária, não ajuda na avaliação e, em processos com triagem automática, pode inclusive atrapalhar a leitura do arquivo. O mesmo vale para CPF, RG, número da carteira de trabalho e endereço completo — nenhum deles é necessário nessa fase e todos expõem dados pessoais sem nenhum benefício. Coloque apenas cidade e bairro, que é o que interessa para a empresa avaliar deslocamento. Se a empresa precisar de documentos, ela pedirá no momento da contratação. Manter o currículo limpo, com só o essencial, também deixa espaço para o que realmente conta: cursos, atividades e disponibilidade.",
      },
      {
        question: "Como me sair bem na entrevista de jovem aprendiz?",
        answer:
          "Prepare três respostas simples e treine em voz alta. A primeira: uma apresentação de um minuto dizendo onde você estuda, o que gosta de fazer e por que quer essa vaga. A segunda: por que essa empresa e essa área — pesquise o que a empresa faz antes, mesmo que rapidamente, porque quase nenhum candidato faz isso. A terceira: um exemplo de situação em que você teve responsabilidade, resolveu um problema ou trabalhou em grupo. Chegue com dez minutos de antecedência, vista roupa simples e limpa, desligue o celular e leve uma pergunta para o final, como 'quais serão minhas principais atividades no dia a dia?'.",
      },
    ],
  },
  {
    slug: "estagiario",
    profession: "Estagiário",
    metaTitle: "Modelo de Currículo para Estágio (Exemplo Pronto 2026)",
    h1: "Modelo de Currículo para Estágio",
    metaDescription:
      "Modelo de currículo para estágio com exemplo pronto: o que colocar sem experiência, projetos acadêmicos, ferramentas, palavras-chave de ATS e dicas.",
    intro:
      "Currículo de estágio tem um problema clássico: quem está se candidatando quase sempre acha que não tem nada para escrever. Mas as empresas que oferecem estágio não procuram experiência profissional — procuram sinais de iniciativa, capacidade de aprender e alguma familiaridade com as ferramentas da área. E esses sinais estão em lugares que a maioria dos estudantes ignora: trabalhos acadêmicos, empresa júnior, monitoria, projetos de extensão, cursos feitos por conta própria e atividades extracurriculares. Este modelo mostra como transformar tudo isso em um currículo que passa na triagem, com exemplo pronto e as palavras-chave que os programas de estágio procuram.",
    sampleResume: {
      name: "Beatriz Almeida Carvalho",
      headline: "Estudante de Administração (6º período) | Estágio em Financeiro ou Controladoria | Excel e Power BI",
      summary:
        "Estudante do 6º período de Administração, com foco em finanças e controladoria. Experiência prática em empresa júnior conduzindo projeto de reestruturação de custos para cliente real, monitoria de Estatística e formação complementar em Excel avançado e Power BI. Busco estágio na área financeira para aplicar e aprofundar análise de dados e rotinas de controle.",
      experience: [
        {
          role: "Consultora Júnior — Projeto de Custos",
          company: "Empresa Júnior de Administração da universidade",
          period: "Ago 2025 - Atual",
          bullets: [
            "Conduzi, em dupla, um projeto de mapeamento e reestruturação de custos para uma padaria com 12 funcionários",
            "Levantei e organizei 8 meses de dados financeiros em planilha, identificando as três categorias de maior peso no custo",
            "Propus uma reorganização de compras que, segundo o cliente, reduziu o desperdício de insumos em cerca de 15%",
            "Apresentei o relatório final ao proprietário, com dashboard em Power BI para acompanhamento mensal",
          ],
        },
        {
          role: "Monitora de Estatística Aplicada",
          company: "Universidade — Departamento de Administração",
          period: "Mar 2025 - Jul 2025",
          bullets: [
            "Atendi cerca de 25 alunos por semestre em plantões de dúvidas sobre estatística descritiva e inferência",
            "Preparei listas de exercícios complementares e material de apoio revisado pelo professor responsável",
            "Desenvolvi didática para explicar conteúdo técnico a quem estava com dificuldade, com foco em exemplos práticos",
          ],
        },
      ],
      education: [
        {
          degree: "Bacharelado em Administração — 6º período (previsão de conclusão em 2027)",
          institution: "Universidade Estadual",
          period: "2023 - 2027",
        },
        {
          degree: "Excel Avançado — Fórmulas, Tabela Dinâmica e Dashboards (40h)",
          institution: "Curso online",
          period: "2025",
        },
        {
          degree: "Introdução ao Power BI (30h)",
          institution: "Curso online",
          period: "2025",
        },
        {
          degree: "Inglês — nível intermediário (B1)",
          institution: "Escola de idiomas",
          period: "2022 - 2024",
        },
      ],
      skills: [
        "Excel avançado (PROCV, tabela dinâmica, dashboards)",
        "Power BI",
        "Análise de dados e organização de planilhas",
        "Noções de custos e fluxo de caixa",
        "Apresentação e comunicação de resultados",
        "Pacote Office e Google Workspace",
        "Inglês intermediário",
        "Trabalho em equipe e gestão de prazo",
      ],
    },
    keySkills: [
      "Domínio de Excel e ferramentas de planilha",
      "Familiaridade com as ferramentas específicas da área do estágio",
      "Capacidade de organizar e analisar dados",
      "Comunicação escrita e apresentação de resultados",
      "Iniciativa demonstrada em projetos e cursos próprios",
      "Trabalho em equipe e cumprimento de prazos",
      "Inglês (leitura e, se possível, conversação)",
      "Organização e atenção a detalhe",
      "Vontade de aprender e receber feedback",
      "Compatibilidade de horário com a grade acadêmica",
    ],
    atsKeywords: [
      "Estagiário",
      "Estágio",
      "Estudante",
      "Universitário",
      "Empresa Júnior",
      "Monitoria",
      "Projeto de Extensão",
      "Iniciação Científica",
      "Excel",
      "Excel Avançado",
      "Power BI",
      "Pacote Office",
      "Análise de Dados",
      "Inglês Intermediário",
      "Trabalho em Equipe",
      "Previsão de Formatura",
      "Administração",
      "Programa de Estágio",
      "Voluntariado",
      "Liderança Estudantil",
    ],
    salaryNote:
      "No Brasil (2026), a bolsa de estágio costuma variar entre R$ 800 e R$ 2.500, dependendo do porte da empresa, da área e da carga horária contratada. Programas de estágio de grandes empresas, especialmente em tecnologia, finanças e engenharia, costumam pagar acima da média e oferecer benefícios adicionais. O estágio é regido por legislação própria, que estabelece a obrigatoriedade do termo de compromisso, limites de jornada compatíveis com a atividade acadêmica, auxílio-transporte, recesso remunerado e prazo máximo de permanência na mesma empresa.",
    dos: [
      "Coloque no topo o curso, o período atual e a previsão de conclusão — é o primeiro filtro de qualquer programa.",
      "Trate empresa júnior, monitoria, iniciação científica e projetos de extensão como experiência real.",
      "Descreva os projetos com problema, o que você fez e o resultado — não apenas o tema.",
      "Liste as ferramentas da área com o nível real: Excel, Power BI, Canva, Figma, Python, o que for.",
      "Informe o nível de inglês de forma honesta, usando uma escala reconhecível.",
      "Diga a sua disponibilidade de turno e a carga horária que consegue cumprir.",
    ],
    donts: [
      "Não deixe o currículo em uma página em branco alegando falta de experiência.",
      "Não escreva apenas o nome dos trabalhos acadêmicos: descreva o que você fez neles.",
      "Não infle o nível de inglês nem de ferramentas — testes práticos são comuns em programas de estágio.",
      "Não use foto, CPF, RG nem endereço completo.",
      "Não faça um currículo genérico para todas as vagas: adapte as palavras ao anúncio de cada programa.",
      "Não passe de uma página; em estágio, ela é mais do que suficiente.",
    ],
    faqs: [
      {
        question: "O que colocar no currículo de estágio sem experiência?",
        answer:
          "Comece pelo curso, período atual e previsão de conclusão, que é o primeiro filtro de qualquer programa. Depois, crie uma seção de experiências e projetos com tudo que envolveu prática: empresa júnior, monitoria, iniciação científica, projetos de extensão, trabalhos acadêmicos relevantes, participação em centro acadêmico, competições e voluntariado. Descreva cada um com o problema, o que você fez e o resultado — não apenas o tema. Em seguida, liste cursos complementares com carga horária e as ferramentas que você domina, com o nível real. Feche com idiomas e disponibilidade de horário. Uma página bem preenchida é suficiente.",
      },
      {
        question: "Trabalho acadêmico conta como experiência no currículo?",
        answer:
          "Conta, desde que você o descreva como descreveria um projeto profissional. O erro comum é escrever apenas o título do trabalho, o que não comunica nada. Descreva o contexto, a sua responsabilidade específica, o método usado, as ferramentas envolvidas e o resultado. Por exemplo: 'Conduzi, em dupla, um projeto de mapeamento de custos para uma padaria real, organizando 8 meses de dados em planilha e propondo uma reorganização de compras que reduziu o desperdício em cerca de 15%.' Isso demonstra capacidade de execução e uso de ferramenta, que é exatamente o que o programa de estágio quer avaliar.",
      },
      {
        question: "Quantas páginas deve ter o currículo de estágio?",
        answer:
          "Uma página, sem exceção. Programas de estágio recebem volume alto de candidaturas e a triagem é rápida — muitas vezes automatizada em uma primeira etapa. Duas páginas para quem ainda está na graduação sinalizam dificuldade de priorização, e frequentemente indicam que o candidato listou cursos irrelevantes ou detalhou demais. Se você tem muito material, escolha o que se conecta à área da vaga e corte o resto. Um currículo de uma página com projetos bem descritos, ferramentas relevantes e informações completas rende muito mais do que duas páginas de listas.",
      },
      {
        question: "Preciso ter inglês para conseguir estágio?",
        answer:
          "Depende da área e do porte da empresa. Programas de estágio de grandes empresas, multinacionais e áreas como comércio exterior, tecnologia e finanças frequentemente exigem inglês intermediário ou avançado, e muitos aplicam teste na seleção. Em empresas menores e em várias áreas técnicas, o inglês é desejável e não eliminatório. Informe o seu nível de forma honesta, usando uma escala reconhecível (básico, intermediário, avançado, ou o padrão A1 a C2), e não infle — a verificação costuma acontecer em alguma etapa. Se o inglês for a sua principal lacuna, é o investimento com maior retorno para ampliar as vagas acessíveis.",
      },
      {
        question: "Como me destacar em um processo de estágio com muitos candidatos?",
        answer:
          "Três coisas fazem a maior diferença. Primeira: adaptar o currículo a cada programa, usando as palavras do anúncio — a maioria dos candidatos envia o mesmo arquivo para tudo. Segunda: ter evidência de iniciativa própria, ou seja, algo que você buscou sem ninguém mandar: um curso, um projeto pessoal, um trabalho voluntário, uma participação em empresa júnior. Isso é o que mais impressiona em candidatos juniores, porque não pode ser fabricado às pressas. Terceira: pesquisar a empresa antes das etapas e conseguir dizer, em uma frase, o que ela faz e por que você quer estagiar ali. Poucos fazem, e a diferença aparece.",
      },
      {
        question: "Quais são as regras básicas do contrato de estágio?",
        answer:
          "O estágio é regido por legislação específica e exige um termo de compromisso entre estudante, instituição de ensino e empresa, com plano de atividades compatível com o curso. A jornada tem limites definidos em lei para não prejudicar a atividade acadêmica, e há previsão de auxílio-transporte, bolsa (obrigatória no estágio não obrigatório), recesso remunerado após determinado período e prazo máximo de permanência na mesma parte concedente. O estágio não gera vínculo empregatício quando essas regras são cumpridas. Antes de assinar, confira o plano de atividades: um estágio que não tem relação com o seu curso descaracteriza a finalidade formativa.",
      },
    ],
  },
  {
    slug: "analista-de-rh",
    profession: "Analista de RH",
    metaTitle: "Modelo de Currículo para Analista de RH (Exemplo Pronto 2026)",
    h1: "Modelo de Currículo para Analista de Recursos Humanos",
    metaDescription:
      "Modelo de currículo para analista de RH: recrutamento e seleção, DP, indicadores, sistemas, exemplo pronto, palavras-chave de ATS e faixa salarial.",
    intro:
      "Analista de RH é um cargo com escopos muito diferentes conforme a empresa: pode significar recrutamento e seleção, departamento pessoal, treinamento e desenvolvimento, cargos e salários, ou tudo isso junto em um RH generalista. Por isso, o primeiro trabalho do currículo é deixar claro qual é o seu. Depois vêm os indicadores — tempo de fechamento de vaga, turnover, custo por contratação, horas de treinamento — que separam quem executa rotinas de quem responde por resultado. Este modelo mostra como organizar essas informações, quais sistemas citar e como adaptar o currículo para cada subárea.",
    sampleResume: {
      name: "Aline Ribeiro Santana",
      headline: "Analista de RH | Recrutamento e Seleção, Onboarding e Indicadores | Gupy e TOTVS RM",
      summary:
        "Analista de RH com 6 anos de experiência em recrutamento e seleção e desenvolvimento organizacional, atuando em empresas com até 600 colaboradores. Condução de processos do briefing ao fechamento, com redução do tempo médio de contratação e do turnover nos primeiros 90 dias. Domínio de Gupy, TOTVS RM e ferramentas de avaliação, com experiência em onboarding estruturado e programas de treinamento.",
      experience: [
        {
          role: "Analista de RH Pleno",
          company: "Grupo Varejista Nordeste (600 colaboradores)",
          period: "Jun 2022 - Atual",
          bullets: [
            "Conduzo em média 18 processos seletivos simultâneos, do alinhamento com o gestor ao fechamento, para vagas operacionais, administrativas e de liderança",
            "Reduzi o tempo médio de fechamento de vaga de 42 para 24 dias ao padronizar o briefing com gestores e criar um banco de talentos ativo",
            "Reduzi o turnover nos primeiros 90 dias de 31% para 14% com a implantação de um onboarding estruturado de 30-60-90 dias",
            "Aplico e interpreto avaliações comportamentais e conduzo entrevistas por competência com método STAR",
            "Estruturei o programa anual de treinamentos, com levantamento de necessidades por área e 1.200 horas-homem no último ciclo",
            "Acompanho os indicadores de RH (turnover, tempo de contratação, custo por contratação, absenteísmo) e apresento o painel mensal à diretoria",
            "Faço a interface com o departamento pessoal para admissões, alterações contratuais e desligamentos",
          ],
        },
        {
          role: "Assistente de Recursos Humanos",
          company: "Indústria Alimentícia Vale Verde",
          period: "Fev 2020 - Mai 2022",
          bullets: [
            "Realizei triagem curricular, entrevistas iniciais e agendamento com gestores para vagas operacionais e administrativas",
            "Executei rotinas de admissão e documentação, com conferência de exames e integração de novos colaboradores",
            "Organizei o controle de treinamentos obrigatórios e o arquivo de certificados por colaborador",
            "Apoiei a comunicação interna e a organização de campanhas e eventos de clima",
          ],
        },
      ],
      education: [
        {
          degree: "Bacharelado em Psicologia",
          institution: "Universidade Federal",
          period: "2015 - 2019",
        },
        {
          degree: "Pós-graduação em Gestão de Pessoas",
          institution: "Instituição de ensino superior",
          period: "2021 - 2022",
        },
        {
          degree: "Certificação em Entrevista por Competências e Método STAR",
          institution: "Curso livre",
          period: "2023",
        },
      ],
      skills: [
        "Recrutamento e seleção ponta a ponta",
        "Entrevista por competências (STAR)",
        "Onboarding e integração",
        "Indicadores de RH e people analytics básico",
        "Levantamento de necessidades de treinamento",
        "Gupy e TOTVS RM",
        "Interface com departamento pessoal",
        "Excel avançado e dashboards",
      ],
    },
    keySkills: [
      "Recrutamento e seleção do briefing ao fechamento",
      "Entrevista por competências e avaliação comportamental",
      "Onboarding, integração e acompanhamento dos primeiros 90 dias",
      "Indicadores de RH: turnover, tempo e custo de contratação, absenteísmo",
      "Treinamento e desenvolvimento (LNT, execução e avaliação)",
      "Rotinas de departamento pessoal e interface com folha",
      "Cargos, salários e estrutura organizacional",
      "Sistemas de RH e ATS (Gupy, TOTVS RM, Senior, SAP SuccessFactors)",
      "Excel avançado e construção de painéis de indicadores",
      "Comunicação com gestores e condução de conversas sensíveis",
    ],
    atsKeywords: [
      "Analista de RH",
      "Recursos Humanos",
      "Recrutamento e Seleção",
      "R&S",
      "Entrevista por Competências",
      "Onboarding",
      "Turnover",
      "Departamento Pessoal",
      "Treinamento e Desenvolvimento",
      "LNT",
      "Cargos e Salários",
      "Clima Organizacional",
      "Indicadores de RH",
      "People Analytics",
      "Gupy",
      "TOTVS RM",
      "SuccessFactors",
      "Senior",
      "Excel Avançado",
      "Gestão de Pessoas",
    ],
    salaryNote:
      "No Brasil (2026), o analista de RH costuma receber entre R$ 3.000 e R$ 6.500, variando conforme a senioridade e a subárea. Analistas de departamento pessoal com domínio de legislação e folha, e analistas de R&S com experiência em vagas técnicas e de liderança, tendem a ficar no topo da faixa. Empresas de grande porte, multinacionais e tecnologia pagam acima da média. Coordenadores e business partners recebem acima dessa faixa; assistentes de RH ficam abaixo.",
    dos: [
      "Deixe claro o seu escopo logo no título: R&S, DP, T&D, cargos e salários ou generalista.",
      "Informe o porte da empresa em número de colaboradores — dimensiona a complexidade da sua atuação.",
      "Traga indicadores: tempo de fechamento, turnover, custo por contratação, horas de treinamento.",
      "Cite os sistemas pelo nome: Gupy, TOTVS RM, Senior, SuccessFactors, Solides, entre outros.",
      "Descreva os tipos de vaga que você conduz (operacional, administrativa, técnica, liderança).",
      "Mencione a interface com gestores e com departamento pessoal, que mostra visão de processo.",
    ],
    donts: [
      "Não escreva 'responsável pelo RH' sem dizer quais subáreas e com que escopo.",
      "Não omita indicadores: sem eles, o currículo parece apenas descrição de rotina.",
      "Não confunda RH com departamento pessoal no texto: quem contrata sabe a diferença.",
      "Não deixe de citar sistemas — é filtro frequente nas triagens automáticas.",
      "Não liste 'empatia' e 'boa comunicação' sem exemplo de situação em que foram decisivas.",
      "Não use currículo com layout complexo: ironicamente, é a área que mais usa triagem automática.",
    ],
    faqs: [
      {
        question: "Qual a diferença entre analista de RH e analista de DP?",
        answer:
          "O analista de departamento pessoal cuida do ciclo contratual e legal do colaborador: admissão, folha de pagamento, ponto, férias, benefícios, encargos, eSocial, rescisões e obrigações acessórias. É uma função técnica, com forte exigência de legislação trabalhista e precisão. O analista de RH, em sentido estrito, atua em recrutamento e seleção, treinamento e desenvolvimento, clima, cargos e salários e indicadores de gestão de pessoas. Em empresas menores, uma mesma pessoa acumula tudo. No currículo, deixe explícito qual é o seu escopo real, porque candidatos que se apresentam de forma genérica acabam sendo descartados nos dois tipos de vaga.",
      },
      {
        question: "Quais indicadores colocar no currículo de RH?",
        answer:
          "Priorize os que a área realmente acompanha: tempo médio de fechamento de vaga (time to fill ou time to hire), turnover geral e turnover nos primeiros 90 dias, custo por contratação, taxa de aceitação de proposta, absenteísmo, horas-homem de treinamento e índice de satisfação em pesquisa de clima. Apresente com antes e depois sempre que possível: 'Reduzi o tempo médio de fechamento de vaga de 42 para 24 dias ao padronizar o briefing com gestores e criar um banco de talentos ativo.' Esse formato demonstra que você não apenas executou a rotina, mas produziu resultado — que é a diferença entre analista e assistente na leitura do recrutador.",
      },
      {
        question: "Preciso ser formado em Psicologia para trabalhar com RH?",
        answer:
          "Não. Administração, Gestão de Recursos Humanos, Psicologia e áreas correlatas são todas aceitas na maioria das vagas, e há profissionais vindos de outras formações que atuam bem, especialmente em recrutamento técnico e em people analytics. A Psicologia é um diferencial para atividades ligadas a avaliação comportamental e desenvolvimento, e algumas ferramentas de avaliação têm restrições de aplicação a profissionais habilitados. O que mais pesa na prática é a experiência comprovada nas rotinas da subárea, o domínio dos sistemas e a capacidade de trabalhar com indicadores. Uma pós-graduação em Gestão de Pessoas costuma ser bem valorizada.",
      },
      {
        question: "Como fazer currículo de RH para vaga de recrutamento e seleção?",
        answer:
          "Foque no ciclo completo do processo e nos números. Informe quantos processos você conduz simultaneamente, para quais tipos de vaga (operacional, administrativa, técnica, liderança), quais canais utiliza (ATS, redes profissionais, hunting ativo, banco de talentos, indicação), quais metodologias aplica (entrevista por competências, método STAR, avaliação comportamental, testes técnicos) e quais indicadores alcança. Cite os sistemas pelo nome, porque são filtro comum. E descreva a relação com os gestores requisitantes: alinhamento de briefing, calibração de perfil e apresentação de shortlist — é essa maturidade que distingue um recrutador experiente.",
      },
      {
        question: "Como migrar de assistente para analista de RH?",
        answer:
          "A diferença entre os dois níveis é responsabilidade sobre resultado, não sobre tarefa. Para sustentar a mudança no currículo, registre tudo que você já fez além da execução: processos que conduziu do início ao fim sem supervisão, indicadores que acompanhou ou melhorou, projetos que propôs (onboarding, programa de treinamento, revisão de descrição de cargos), gestores que atendeu diretamente e sistemas que domina. Em paralelo, invista em duas lacunas comuns: Excel avançado com construção de painéis, e leitura de indicadores de gestão de pessoas. Uma pós-graduação em Gestão de Pessoas costuma acelerar a transição em empresas estruturadas.",
      },
      {
        question: "Quais sistemas de RH devo citar no currículo?",
        answer:
          "Cite pelo nome todos que você usou, começando pelos mais comuns nas vagas: plataformas de recrutamento e ATS como Gupy, sistemas integrados como TOTVS RM, Senior, Sênior HCM, SAP SuccessFactors e Protheus, e ferramentas de avaliação comportamental. Informe também o seu nível de uso — se apenas operava ou se configurava fluxos, extraía relatórios e parametrizava processos. Complementarmente, informe o nível de Excel com as funções que domina, porque construção de indicadores é uma exigência crescente na área. Escrever 'conhecimento em sistemas de RH' sem especificar não passa em busca por palavra-chave nem informa nada útil.",
      },
    ],
  },
  {
    slug: "analista-financeiro",
    profession: "Analista Financeiro",
    metaTitle: "Modelo de Currículo para Analista Financeiro (Exemplo 2026)",
    h1: "Modelo de Currículo para Analista Financeiro",
    metaDescription:
      "Modelo de currículo para analista financeiro: fluxo de caixa, conciliação, orçamento, ERP, exemplo pronto, palavras-chave de ATS e faixa salarial.",
    intro:
      "O currículo de analista financeiro é lido por gestores que trabalham com números o dia inteiro — e eles percebem imediatamente quando um currículo não tem nenhum. Descrever a rotina ('responsável por contas a pagar e receber') não diz nada sobre o tamanho da operação nem sobre o que você entregou. O que diferencia é o volume administrado, os sistemas dominados e os resultados: redução de inadimplência, ganho em prazo médio, economia em despesa financeira, automação de relatório. Este modelo mostra como construir esse currículo, com exemplo pronto e adaptação para as diferentes subáreas de finanças.",
    sampleResume: {
      name: "Rodrigo Nunes Barbosa",
      headline: "Analista Financeiro Pleno | Fluxo de Caixa, Conciliação e Orçamento | SAP e Power BI",
      summary:
        "Analista financeiro com 7 anos de experiência em empresas de médio porte, responsável por fluxo de caixa, conciliação bancária, contas a pagar e receber e apoio ao processo orçamentário. Administro carteira com faturamento mensal de R$ 12 milhões, com histórico de redução de inadimplência e automação de relatórios gerenciais. Domínio de SAP, Excel avançado e Power BI.",
      experience: [
        {
          role: "Analista Financeiro Pleno",
          company: "Distribuidora Industrial Sul (faturamento de R$ 12 mi/mês)",
          period: "Abr 2022 - Atual",
          bullets: [
            "Elaboro e mantenho o fluxo de caixa projetado de 90 dias, com acuracidade média superior a 95% na projeção semanal",
            "Reduzi a inadimplência da carteira de 6,2% para 2,4% em 18 meses, ao implantar régua de cobrança escalonada e análise de crédito prévia",
            "Realizo a conciliação bancária de 8 contas com movimentação diária, com fechamento mensal sem pendências nos últimos 20 meses",
            "Automatizei o relatório gerencial mensal em Power BI, eliminando cerca de 16 horas de trabalho manual por mês",
            "Apoio o processo orçamentário anual, consolidando as premissas das áreas e acompanhando o realizado versus orçado com análise de desvios",
            "Negocio prazos e condições com fornecedores e bancos, com ganho de 7 dias no prazo médio de pagamento sem custo adicional",
            "Faço a interface com a contabilidade para fechamento e com a auditoria externa no encerramento do exercício",
          ],
        },
        {
          role: "Assistente Financeiro",
          company: "Grupo Comercial Aurora",
          period: "Jan 2019 - Mar 2022",
          bullets: [
            "Executei rotinas de contas a pagar e a receber, com processamento de cerca de 900 títulos por mês",
            "Realizei conciliação bancária e de cartões, identificando e tratando divergências junto às operadoras",
            "Emiti boletos, notas e relatórios de posição de carteira para a gerência",
            "Organizei a documentação fiscal e financeira para envio à contabilidade e para auditorias",
          ],
        },
      ],
      education: [
        {
          degree: "Bacharelado em Ciências Contábeis",
          institution: "Universidade Estadual",
          period: "2014 - 2018",
        },
        {
          degree: "MBA em Gestão Financeira e Controladoria",
          institution: "Instituição de ensino superior",
          period: "2022 - 2023",
        },
        {
          degree: "Power BI para Finanças e Excel Avançado",
          institution: "Cursos de especialização técnica",
          period: "2023",
        },
      ],
      skills: [
        "Fluxo de caixa e projeção",
        "Conciliação bancária e de cartões",
        "Contas a pagar e a receber",
        "Análise de crédito e régua de cobrança",
        "Processo orçamentário e análise de desvios",
        "SAP e ERP de gestão",
        "Excel avançado e Power BI",
        "Interface com contabilidade e auditoria",
      ],
    },
    keySkills: [
      "Fluxo de caixa, projeção e gestão de liquidez",
      "Conciliação bancária, de cartões e de contas contábeis",
      "Contas a pagar e a receber e gestão de carteira",
      "Análise de crédito, cobrança e redução de inadimplência",
      "Orçamento, acompanhamento de realizado versus orçado e análise de desvios",
      "Negociação com fornecedores, bancos e operadoras",
      "Relatórios gerenciais e construção de indicadores",
      "ERPs financeiros (SAP, TOTVS Protheus, Sankhya, Senior, Omie)",
      "Excel avançado e ferramentas de BI",
      "Interface com contabilidade, fiscal e auditoria",
    ],
    atsKeywords: [
      "Analista Financeiro",
      "Fluxo de Caixa",
      "Conciliação Bancária",
      "Contas a Pagar",
      "Contas a Receber",
      "Inadimplência",
      "Análise de Crédito",
      "Orçamento",
      "Budget",
      "Forecast",
      "Análise de Desvios",
      "Relatórios Gerenciais",
      "SAP",
      "TOTVS Protheus",
      "Sankhya",
      "Excel Avançado",
      "Power BI",
      "Controladoria",
      "Tesouraria",
      "Capital de Giro",
    ],
    salaryNote:
      "No Brasil (2026), o analista financeiro costuma receber entre R$ 3.500 e R$ 7.500, variando por senioridade e por subárea. Analistas de controladoria, planejamento financeiro (FP&A) e tesouraria em empresas de grande porte tendem a ficar acima da faixa, assim como profissionais com domínio de BI e de ERPs corporativos como SAP. Assistentes financeiros ficam abaixo, e coordenadores e gerentes acima. Multinacionais e empresas de tecnologia costumam pagar acima da média do mercado.",
    dos: [
      "Informe o porte da operação: faturamento mensal, número de títulos, número de contas conciliadas.",
      "Traga resultados com número: redução de inadimplência, ganho de prazo, horas economizadas, acuracidade de projeção.",
      "Cite os ERPs pelo nome e módulo, além do nível real de Excel e das ferramentas de BI.",
      "Deixe clara a sua subárea: contas a pagar/receber, tesouraria, controladoria, FP&A ou generalista.",
      "Mencione interface com contabilidade, fiscal e auditoria — mostra visão de processo completo.",
      "Descreva negociações conduzidas com fornecedores, bancos e operadoras, com o ganho obtido.",
    ],
    donts: [
      "Não descreva a rotina sem nenhum número: em finanças, isso é imediatamente percebido.",
      "Não escreva 'conhecimento em sistemas' sem citar o ERP específico.",
      "Não infle o nível de Excel — testes práticos são padrão em processos de finanças.",
      "Não misture rotinas de assistente e de analista sem distinguir o que era sua responsabilidade.",
      "Não omita formação e certificações relevantes, que costumam ser filtro em empresas estruturadas.",
      "Não use layout com colunas e gráficos: a triagem automática lê melhor a coluna única.",
    ],
    faqs: [
      {
        question: "O que um analista financeiro faz?",
        answer:
          "Depende da subárea, e é isso que o currículo precisa esclarecer. Em finanças operacionais, responde por contas a pagar e receber, conciliação bancária, emissão e baixa de títulos e cobrança. Em tesouraria, cuida de fluxo de caixa, aplicações, captações, relacionamento bancário e gestão de liquidez. Em controladoria e planejamento financeiro, atua em orçamento, acompanhamento de realizado versus orçado, análise de desvios, relatórios gerenciais e apoio à decisão. Em empresas menores, uma mesma pessoa cobre tudo. Deixar o escopo explícito no título e no resumo evita que o seu currículo seja descartado por parecer genérico demais para qualquer uma das vagas.",
      },
      {
        question: "Quais resultados colocar no currículo de analista financeiro?",
        answer:
          "Escolha de quatro a seis com número e período. Os mais reconhecidos são: redução de inadimplência em pontos percentuais, ganho no prazo médio de pagamento ou recebimento em dias, acuracidade da projeção de fluxo de caixa, economia em despesa financeira ou em tarifas bancárias, redução do tempo de fechamento mensal, horas economizadas por automação de relatório e volume de títulos ou de conciliações processadas sem pendência. Um exemplo forte: 'Reduzi a inadimplência da carteira de 6,2% para 2,4% em 18 meses ao implantar régua de cobrança escalonada e análise de crédito prévia.' Em finanças, currículo sem número chama atenção negativa.",
      },
      {
        question: "Excel avançado é obrigatório para analista financeiro?",
        answer:
          "Na prática, sim — e é comum haver teste prático na seleção. O nível esperado costuma incluir PROCV e ÍNDICE/CORRESP, tabela dinâmica, formatação condicional, funções condicionais aninhadas, SOMASE e CONT.SE, tratamento de bases e, cada vez mais, Power Query. Além do Excel, ferramentas de BI como Power BI se tornaram diferencial forte e, em algumas vagas, requisito. No currículo, não escreva apenas 'Excel avançado': liste as funções e os recursos que você usa de fato, porque isso é verificável e demonstra domínio real. Inflar o nível é um dos erros mais custosos em processos de finanças.",
      },
      {
        question: "Como migrar de assistente para analista financeiro?",
        answer:
          "A diferença entre os níveis é analítica: o assistente executa a rotina, o analista interpreta os números e propõe ação. Para sustentar a transição, registre no currículo tudo o que você já fez do lado analítico: elaboração ou apoio ao fluxo de caixa projetado, análise de desvios, relatórios gerenciais que você construiu, negociações que conduziu, propostas que resultaram em economia ou ganho de prazo. Em paralelo, ataque as duas lacunas mais comuns: Excel avançado com tratamento de base e alguma ferramenta de BI. Uma pós-graduação em Gestão Financeira ou Controladoria costuma acelerar a mudança em empresas estruturadas.",
      },
      {
        question: "Preciso ser formado em Contábeis ou Administração?",
        answer:
          "Ciências Contábeis, Administração, Economia e Ciências Atuariais são as formações mais aceitas, e a maioria das vagas de analista financeiro pede uma delas ou área correlata. Engenharia também é bem aceita, especialmente em planejamento financeiro e controladoria, pela base quantitativa. O que costuma pesar mais do que o curso específico é a combinação entre experiência na rotina, domínio de ERP e capacidade analítica comprovada. Para posições de controladoria e para carreira em contabilidade, a formação em Ciências Contábeis tem vantagem clara. Pós-graduações em Finanças, Controladoria ou Gestão Financeira são bem valorizadas em qualquer trilha.",
      },
      {
        question: "Como descrever experiência com ERP no currículo?",
        answer:
          "Cite o sistema pelo nome e, quando fizer sentido, o módulo: SAP (FI, CO, MM), TOTVS Protheus (financeiro, faturamento), Sankhya, Senior, Omie, Domínio. Informe também o seu nível de uso, porque há diferença grande entre lançar títulos e configurar parâmetros, extrair e cruzar relatórios ou participar de uma implantação. Se você atuou em migração ou implantação de sistema, destaque — é uma experiência muito valorizada e relativamente rara. Escrever 'conhecimento em ERP' sem especificar não passa nas buscas por palavra-chave, que costumam filtrar exatamente pelo nome do sistema usado na empresa contratante.",
      },
    ],
  },
  {
    slug: "operador-de-telemarketing",
    profession: "Operador de Telemarketing",
    metaTitle: "Modelo de Currículo para Operador de Telemarketing (2026)",
    h1: "Modelo de Currículo para Operador de Telemarketing",
    metaDescription:
      "Modelo de currículo para operador de telemarketing: receptivo, ativo, retenção, indicadores de call center, exemplo pronto, ATS e faixa salarial.",
    intro:
      "Call centers medem tudo — e por isso o currículo de operador de telemarketing que traz indicadores se destaca imediatamente. Tempo médio de atendimento, taxa de resolução no primeiro contato, conversão em ativo, índice de retenção, aderência à escala e nota de monitoria são os números que a operação acompanha diariamente. Currículos que apenas dizem 'atendia clientes por telefone' não respondem a nada disso. Este modelo mostra como estruturar a experiência com os indicadores certos, diferenciar receptivo de ativo e de retenção, e demonstrar as competências que reduzem o risco de rotatividade — a maior preocupação do setor.",
    sampleResume: {
      name: "Priscila Gomes de Andrade",
      headline: "Operadora de Telemarketing | Receptivo, Ativo e Retenção | Nota de monitoria acima de 95%",
      summary:
        "Operadora de telemarketing com 5 anos de experiência em operações de telecomunicações e serviços financeiros, atuando em atendimento receptivo, vendas ativas e retenção. Nota média de monitoria de qualidade acima de 95%, com tempo médio de atendimento dentro da meta e alta taxa de resolução no primeiro contato. Experiência com CRM, script consultivo e escalonamento de casos críticos.",
      experience: [
        {
          role: "Operadora de Retenção e Vendas",
          company: "Central de Atendimento — Operadora de Telecomunicações",
          period: "Mar 2023 - Atual",
          bullets: [
            "Atuo na célula de retenção com média de 75 contatos por dia, revertendo cerca de 42% dos pedidos de cancelamento",
            "Mantenho nota média de 96% nas monitorias de qualidade, com destaque em condução do diálogo e aderência ao procedimento",
            "Supero a meta de venda de upgrade e serviços adicionais em média em 118% do previsto",
            "Mantenho o tempo médio de atendimento dentro da meta da operação sem prejuízo da resolução no primeiro contato",
            "Registro todos os atendimentos em CRM com histórico completo, o que reduz retrabalho em contatos subsequentes",
            "Atuo como referência para operadores novos, apoiando a integração da célula em períodos de contratação",
          ],
        },
        {
          role: "Operadora de Telemarketing Receptivo",
          company: "Central de Atendimento — Serviços Financeiros",
          period: "Fev 2021 - Fev 2023",
          bullets: [
            "Atendi em média 95 chamadas por dia em receptivo, com informações de conta, desbloqueio, contestação e negociação de dívida",
            "Alcancei taxa de resolução no primeiro contato acima de 80%, contra média de 68% da operação",
            "Conduzi atendimentos de clientes irritados com foco em desescalada e solução, com baixo índice de reclamação registrada",
            "Mantive aderência à escala acima de 98%, com baixíssimo índice de absenteísmo",
          ],
        },
      ],
      education: [
        {
          degree: "Tecnólogo em Gestão Comercial (cursando)",
          institution: "Faculdade a distância",
          period: "2024 - 2026",
        },
        {
          degree: "Curso de Atendimento ao Cliente e Técnicas de Negociação",
          institution: "Curso livre",
          period: "2022",
        },
        {
          degree: "Ensino Médio Completo",
          institution: "EE Bairro Alto",
          period: "Concluído em 2020",
        },
      ],
      skills: [
        "Atendimento receptivo e ativo",
        "Retenção e reversão de cancelamento",
        "Vendas por telefone e upgrade",
        "Negociação e cobrança",
        "CRM e registro de atendimento",
        "Desescalada de conflito",
        "Aderência a script e procedimento",
        "Digitação rápida e multitarefa",
      ],
    },
    keySkills: [
      "Atendimento receptivo, ativo e híbrido",
      "Retenção de clientes e reversão de cancelamento",
      "Vendas por telefone, cross-sell e upgrade",
      "Negociação e recuperação de crédito",
      "Registro em CRM e histórico de atendimento",
      "Aderência a script, procedimento e conformidade",
      "Desescalada de conflito e atendimento a cliente irritado",
      "Gestão de tempo médio de atendimento e pausas",
      "Digitação rápida e operação simultânea de sistemas",
      "Aderência à escala e baixo absenteísmo",
    ],
    atsKeywords: [
      "Operador de Telemarketing",
      "Teleoperador",
      "Call Center",
      "SAC",
      "Atendimento Receptivo",
      "Telemarketing Ativo",
      "Retenção",
      "Cobrança",
      "Negociação",
      "Vendas por Telefone",
      "CRM",
      "TMA",
      "Tempo Médio de Atendimento",
      "Resolução no Primeiro Contato",
      "Monitoria de Qualidade",
      "Script",
      "Aderência",
      "Absenteísmo",
      "Upgrade",
      "Central de Atendimento",
    ],
    salaryNote:
      "No Brasil (2026), o operador de telemarketing costuma receber entre R$ 1.500 e R$ 2.200 de salário base, considerando a jornada reduzida típica da categoria, acrescido de comissão ou premiação por meta em operações de vendas, retenção e cobrança — que pode representar parcela expressiva do total. Adicional noturno se aplica a turnos, e operações técnicas ou bilíngues pagam acima da média. As condições de jornada e intervalos são regulamentadas por norma específica da atividade; confirme com a convenção coletiva da categoria.",
    dos: [
      "Diferencie o tipo de operação: receptivo, ativo, retenção, cobrança, suporte técnico, backoffice.",
      "Traga indicadores: nota de monitoria, TMA, resolução no primeiro contato, conversão, aderência à escala.",
      "Cite o segmento atendido (telecom, financeiro, saúde, varejo): a experiência no mesmo setor pesa.",
      "Informe os sistemas e CRMs que você operou e a sua velocidade de digitação, se for boa.",
      "Destaque baixo absenteísmo e aderência à escala — é a maior dor das operações de call center.",
      "Mencione se já apoiou a integração de operadores novos, o que aproxima o perfil de monitor.",
    ],
    donts: [
      "Não escreva apenas 'atendia clientes por telefone' — a operação é medida por indicadores.",
      "Não omita o tipo de operação: receptivo e ativo exigem perfis bem diferentes.",
      "Não deixe de citar a nota de monitoria de qualidade, que é o principal indicador individual.",
      "Não invente números: as operações verificam facilmente na checagem de referências.",
      "Não use currículo com foto e enfeites; grandes operações usam triagem automática.",
      "Não deixe de informar disponibilidade de turno e escala, que é filtro imediato.",
    ],
    faqs: [
      {
        question: "Quais indicadores colocar no currículo de telemarketing?",
        answer:
          "Priorize os que a operação acompanha por operador: nota média de monitoria de qualidade, tempo médio de atendimento em relação à meta, taxa de resolução no primeiro contato, conversão em vendas ou retenção, número médio de contatos por dia, aderência à escala e índice de absenteísmo. Um exemplo forte: 'Nota média de 96% nas monitorias de qualidade, com taxa de resolução no primeiro contato acima de 80%, contra média de 68% da operação.' Comparar com a média da célula é especialmente eficaz, porque contextualiza o número. Currículos de call center que trazem indicadores são minoria e se destacam de imediato.",
      },
      {
        question: "Qual a diferença entre telemarketing receptivo e ativo?",
        answer:
          "No receptivo, o cliente liga para a central — buscando informação, suporte, desbloqueio, contestação ou reclamação. Exige domínio de produto, agilidade em sistemas, resolução e capacidade de lidar com clientes irritados. No ativo, a operação liga para o cliente, seja para venda, cobrança, pesquisa ou reativação. Exige mais resiliência, técnica de abordagem e persistência, já que a taxa de rejeição é naturalmente alta. Retenção fica em um meio-termo, com o cliente ligando para cancelar e o operador precisando reverter. São perfis diferentes, e as vagas especificam qual procuram — por isso deixe claro no currículo em quais você atuou.",
      },
      {
        question: "Como fazer currículo de telemarketing sem experiência?",
        answer:
          "Destaque três coisas no topo: ensino médio completo, disponibilidade de turnos e escala, e boa comunicação verbal — que você pode evidenciar mencionando qualquer experiência de contato com público. Se você tem digitação rápida, informe as palavras por minuto: é uma competência concreta e valorizada. Faça um curso de atendimento ao cliente e técnicas de negociação, que são curtos, acessíveis e aparecem bem na triagem. Use experiências anteriores de comércio, serviços ou até atividades informais para demonstrar lidar com pessoas e cumprir rotina. O setor contrata volume e treina internamente, então a porta de entrada é acessível.",
      },
      {
        question: "Como demonstrar que não vou faltar e nem sair rápido?",
        answer:
          "Essa é a maior preocupação do setor, porque a rotatividade em call center é historicamente alta e cada desligamento custa treinamento e produtividade. Endereçe isso com fatos: informe a sua aderência à escala em percentual, o índice de absenteísmo e, principalmente, o tempo de permanência em cada emprego anterior. Um bullet como 'Mantive aderência à escala acima de 98%, com baixíssimo índice de absenteísmo' fala diretamente à dor do gestor. Se você tem histórico de permanências longas, destaque no resumo. E se teve passagens curtas, explique o contexto de forma objetiva em vez de deixar a dúvida no ar.",
      },
      {
        question: "Como crescer na carreira dentro de um call center?",
        answer:
          "As trilhas mais comuns são: operador, monitor de qualidade, supervisor de célula e coordenador de operação. Também há caminhos para backoffice, treinamento, planejamento de escala (workforce) e qualidade. Para acelerar, três coisas ajudam. Primeira, indicadores consistentemente acima da média, especialmente monitoria e resolução. Segunda, apoiar a integração de operadores novos e cobrir a supervisão em ausências — registre isso no currículo, é a evidência que sustenta a promoção. Terceira, dominar os sistemas além do necessário, incluindo extração de relatórios. Uma graduação em andamento também costuma ser critério em processos internos para supervisão.",
      },
      {
        question: "Vale a pena mencionar velocidade de digitação?",
        answer:
          "Vale, e é uma das poucas competências técnicas objetivas da função. Operadores registram atendimento em CRM enquanto falam com o cliente, e digitar rápido reduz diretamente o tempo médio de atendimento e melhora a qualidade do registro. Se você digita bem, informe as palavras por minuto no currículo — existem testes online gratuitos para medir. Complemente citando a capacidade de operar vários sistemas simultaneamente, que é a rotina real da função: atender, consultar cadastro, verificar histórico e registrar ao mesmo tempo. Essa combinação é exatamente o que os supervisores procuram e quase nenhum currículo menciona.",
      },
    ],
  },
  {
    slug: "engenheiro-civil",
    profession: "Engenheiro Civil",
    metaTitle: "Modelo de Currículo para Engenheiro Civil (Exemplo Pronto 2026)",
    h1: "Modelo de Currículo para Engenheiro Civil",
    metaDescription:
      "Modelo de currículo para engenheiro civil: CREA, obras executadas, orçamento, planejamento, softwares, exemplo pronto, ATS e faixa salarial.",
    intro:
      "O currículo de engenheiro civil precisa responder rapidamente a três perguntas: qual o seu registro profissional, que tipo e porte de obra você já executou, e em qual etapa da cadeia você atua — planejamento, orçamento, execução, qualidade ou gestão de contratos. Currículos que listam apenas empresas e cargos sem essas informações obrigam o recrutador a supor, e no setor de construção essa suposição costuma ser desfavorável. Este modelo mostra como estruturar obras, indicadores de prazo e custo, softwares e certificações de forma que o seu perfil seja avaliado corretamente por construtoras, incorporadoras e empresas de infraestrutura.",
    sampleResume: {
      name: "Eng. Thiago Moreira Rezende",
      headline: "Engenheiro Civil | CREA-MG 000000/D | Execução de Obras Residenciais e Comerciais | Planejamento e Orçamento",
      summary:
        "Engenheiro civil com 9 anos de experiência em execução e planejamento de obras residenciais e comerciais, com atuação em empreendimentos de até 22 mil m² de área construída. Responsável por cronograma, orçamento, gestão de subempreiteiros e controle de qualidade, com histórico de entregas dentro do prazo e abaixo do orçado. Domínio de AutoCAD, Revit, MS Project e sistemas de gestão de obra.",
      experience: [
        {
          role: "Engenheiro Civil — Coordenador de Obra",
          company: "Construtora Alta Vista Empreendimentos",
          period: "Mai 2021 - Atual",
          bullets: [
            "Coordeno a execução de empreendimento residencial de 22 mil m² e 168 unidades, com equipe própria de 90 pessoas e 12 subempreiteiros",
            "Entreguei a última torre com 3 semanas de antecedência sobre o cronograma contratual e 4% abaixo do orçamento previsto",
            "Elaboro e mantenho o cronograma físico-financeiro em MS Project, com medição mensal e análise de desvio de prazo e custo",
            "Conduzo a gestão de contratos com subempreiteiros: escopo, medição, aditivos, glosas e avaliação de desempenho",
            "Respondo pelo controle de qualidade da obra conforme os procedimentos do sistema de gestão, com inspeção por etapa e registro de não conformidades",
            "Atuo junto ao setor de segurança do trabalho no cumprimento da NR-18 e NR-35, com o canteiro sem autuação no período",
            "Faço a compatibilização de projetos em Revit, tendo identificado interferências que evitaram retrabalho estimado em mais de R$ 200 mil",
          ],
        },
        {
          role: "Engenheiro Civil de Planejamento e Orçamento",
          company: "Construtora Pilar Engenharia",
          period: "Fev 2017 - Abr 2021",
          bullets: [
            "Elaborei orçamentos de obras residenciais e comerciais com composições próprias e referências de tabelas oficiais de custo",
            "Desenvolvi cronogramas físico-financeiros e curvas S para acompanhamento de empreendimentos simultâneos",
            "Realizei o acompanhamento de medições, aditivos contratuais e reajustes, com controle de desvio orçamentário por etapa",
            "Conduzi processos de cotação e negociação com fornecedores, com economia média de 6% sobre o orçamento base",
            "Apoiei a diretoria em estudos de viabilidade técnica e econômica de novos empreendimentos",
          ],
        },
      ],
      education: [
        {
          degree: "Bacharelado em Engenharia Civil — CREA-MG ativo",
          institution: "Universidade Federal",
          period: "2011 - 2016",
        },
        {
          degree: "Pós-graduação em Gerenciamento de Obras e Planejamento",
          institution: "Instituição de ensino superior",
          period: "2018 - 2019",
        },
        {
          degree: "Curso de BIM e Compatibilização de Projetos em Revit",
          institution: "Curso de especialização técnica",
          period: "2022",
        },
      ],
      skills: [
        "Execução e coordenação de obra",
        "Planejamento e cronograma físico-financeiro",
        "Orçamento e composição de custos",
        "Gestão de contratos e subempreiteiros",
        "Controle de qualidade e não conformidades",
        "AutoCAD, Revit e MS Project",
        "Compatibilização de projetos (BIM)",
        "NR-18 e NR-35 aplicadas ao canteiro",
      ],
    },
    keySkills: [
      "Execução, coordenação e fiscalização de obras",
      "Planejamento, cronograma físico-financeiro e curva S",
      "Orçamento, composição de custos e medições",
      "Gestão de contratos, subempreiteiros e aditivos",
      "Compatibilização de projetos e BIM",
      "Controle tecnológico e qualidade da obra",
      "Segurança do trabalho aplicada ao canteiro (NR-18, NR-35)",
      "Softwares: AutoCAD, Revit, MS Project, Excel avançado",
      "Estudos de viabilidade técnica e econômica",
      "Liderança de equipe e relacionamento com cliente e fornecedores",
    ],
    atsKeywords: [
      "Engenheiro Civil",
      "CREA",
      "Execução de Obras",
      "Planejamento de Obras",
      "Orçamento de Obras",
      "Cronograma Físico-Financeiro",
      "Curva S",
      "Medição",
      "Gestão de Contratos",
      "Subempreiteiros",
      "Compatibilização de Projetos",
      "BIM",
      "Revit",
      "AutoCAD",
      "MS Project",
      "Controle Tecnológico",
      "NR-18",
      "Construção Civil",
      "Incorporadora",
      "Infraestrutura",
    ],
    salaryNote:
      "No Brasil (2026), o engenheiro civil costuma receber entre R$ 5.000 e R$ 14.000, com forte variação por senioridade, porte da empresa e segmento. Obras de infraestrutura, industriais e empreendimentos de grande porte tendem a pagar acima da média, assim como funções de planejamento e gerenciamento em incorporadoras. Engenheiros recém-formados e em início de carreira ficam na base da faixa. A legislação prevê parâmetros específicos de jornada e piso para profissionais de engenharia — confirme as condições vigentes com o conselho e o sindicato da categoria.",
    dos: [
      "Coloque o CREA com o estado logo abaixo do nome — é o primeiro item verificado.",
      "Descreva cada obra com tipo, área construída, número de unidades, valor e equipe envolvida.",
      "Traga indicadores de prazo e custo: antecipação ou atraso, desvio orçamentário, economia obtida.",
      "Deixe claro em qual etapa você atua: planejamento, orçamento, execução, qualidade ou gestão de contratos.",
      "Liste os softwares com o nível real, incluindo BIM se você trabalha com compatibilização.",
      "Mencione a atuação em segurança do trabalho no canteiro e o histórico de conformidade.",
    ],
    donts: [
      "Não liste apenas nomes de construtoras sem descrever as obras executadas.",
      "Não omita porte e tipologia das obras: é o que determina se o seu perfil serve à vaga.",
      "Não deixe de citar indicadores de prazo e custo — é como o setor mede desempenho.",
      "Não escreva 'conhecimento em softwares de engenharia' sem citar quais e em que nível.",
      "Não use currículo de mais de duas páginas; priorize as obras mais relevantes e recentes.",
      "Não deixe de informar disponibilidade para mudança de cidade, comum em obras de infraestrutura.",
    ],
    faqs: [
      {
        question: "Como descrever obras no currículo de engenheiro civil?",
        answer:
          "Descreva cada obra como um projeto, com dados que permitam dimensionar a complexidade: tipologia (residencial, comercial, industrial, infraestrutura), área construída em metros quadrados, número de unidades ou pavimentos, valor aproximado do empreendimento, tamanho da equipe própria e número de subempreiteiros. Em seguida, informe a sua responsabilidade específica e os resultados de prazo e custo. Um exemplo: 'Coordenei empreendimento residencial de 22 mil m² e 168 unidades, com equipe de 90 pessoas e 12 subempreiteiros, entregando a última torre 3 semanas antes do cronograma e 4% abaixo do orçamento.' Isso comunica escopo e resultado em uma frase.",
      },
      {
        question: "Qual a importância do CREA no currículo?",
        answer:
          "É determinante. O exercício da profissão de engenheiro civil exige registro ativo no conselho regional, e a maioria das vagas verifica isso já na triagem, tanto por exigência legal quanto porque o profissional pode precisar assumir responsabilidade técnica por obras e emitir anotações de responsabilidade. Coloque o número e a sigla do estado logo abaixo do nome, e mantenha o registro em dia. Se você tem registro em mais de um estado ou visto profissional, informe. Para engenheiros recém-formados, o registro é uma das primeiras providências após a colação de grau e destrava boa parte das oportunidades formais.",
      },
      {
        question: "Vale a pena aprender BIM e Revit?",
        answer:
          "Vale bastante, e a tendência é que se torne requisito e não diferencial. A metodologia BIM permite compatibilizar projetos de arquitetura, estrutura e instalações antes da execução, identificando interferências que, descobertas em obra, geram retrabalho caro. Construtoras e incorporadoras que adotaram o processo procuram ativamente profissionais que dominem Revit e a lógica de coordenação de modelos. No currículo, não basta listar o software: descreva o que você faz com ele. Um exemplo forte é quantificar o benefício: 'Compatibilização de projetos em Revit, identificando interferências que evitaram retrabalho estimado em mais de R$ 200 mil.'",
      },
      {
        question: "Como fazer currículo de engenheiro civil recém-formado?",
        answer:
          "Priorize evidência de prática. Descreva o estágio supervisionado como experiência real, com o tipo e o porte da obra, as atividades executadas e o que você acompanhou. Inclua trabalho de conclusão de curso com tema aplicado, iniciação científica, projetos de extensão e participação em competições ou empresa júnior de engenharia. Liste os softwares com o nível honesto — AutoCAD, Revit, Excel, MS Project — e faça o registro no conselho o quanto antes. Informe disponibilidade para mudança de cidade, porque obras de infraestrutura e grandes empreendimentos costumam ser a porta de entrada mais acessível para quem está começando.",
      },
      {
        question: "É melhor atuar em obra ou em planejamento e orçamento?",
        answer:
          "São trilhas complementares, e a mais valorizada a médio prazo costuma ser a de quem transitou pelas duas. A obra desenvolve leitura de produtividade, gestão de equipe, resolução de problema sob pressão e domínio de método construtivo. O planejamento e o orçamento desenvolvem visão de custo, contrato, medição e viabilidade — competências que abrem caminho para gerência e para incorporadoras. Quem só conhece o escritório costuma ter dificuldade em estimar produtividade real; quem só conhece o canteiro costuma ter dificuldade com contrato e custo. No currículo, se você tem as duas experiências, destaque essa combinação: é um diferencial relevante.",
      },
      {
        question: "Quais indicadores colocar no currículo de engenharia civil?",
        answer:
          "Os que o setor usa para avaliar desempenho de obra: aderência ao cronograma (dias ou semanas de antecipação ou atraso), desvio orçamentário em percentual, economia obtida em negociação de contratos e cotações, índice de retrabalho e de não conformidades, produtividade por etapa e desempenho em segurança do trabalho (canteiro sem autuação, taxa de acidentes). Se você atua em planejamento, some acuracidade da previsão e aderência da curva S. Esses números respondem à pergunta central de quem contrata em construção — se o profissional entrega no prazo e dentro do custo — e são raros nos currículos da área.",
      },
    ],
  },
  {
    slug: "tecnico-em-informatica",
    profession: "Técnico em Informática",
    metaTitle: "Modelo de Currículo para Técnico em Informática (Exemplo 2026)",
    h1: "Modelo de Currículo para Técnico em Informática",
    metaDescription:
      "Modelo de currículo para técnico em informática e suporte: hardware, redes, service desk, SLA, exemplo pronto, palavras-chave de ATS e faixa salarial.",
    intro:
      "Técnico em informática é um cargo que abrange coisas muito diferentes: manutenção de hardware, suporte a usuário, infraestrutura de redes, service desk corporativo ou atendimento em assistência técnica. O currículo precisa deixar claro qual desses você faz — e com quais sistemas, ferramentas e volume. Empresas avaliam também indicadores que quase ninguém registra: chamados atendidos por dia, cumprimento de SLA, taxa de resolução no primeiro atendimento. Este modelo mostra como organizar competências técnicas, certificações e resultados de forma que a triagem entenda o seu perfil em segundos.",
    sampleResume: {
      name: "Vinícius Costa Pereira",
      headline: "Técnico em Informática | Suporte N1/N2, Redes e Windows Server | ITIL Foundation",
      summary:
        "Técnico em informática com 6 anos de experiência em suporte corporativo e infraestrutura, atendendo ambiente com 450 usuários e 12 servidores. Atuação em service desk N1 e N2, manutenção de hardware, administração de Active Directory, redes cabeadas e wireless e backup. Cumprimento consistente de SLA e alta taxa de resolução no primeiro atendimento. Certificação ITIL Foundation.",
      experience: [
        {
          role: "Técnico de Suporte N2",
          company: "Grupo Empresarial Meridiano (450 usuários, 3 filiais)",
          period: "Jul 2022 - Atual",
          bullets: [
            "Atendo média de 22 chamados por dia em service desk N1 e N2, com cumprimento de SLA acima de 96% e resolução no primeiro atendimento em torno de 78%",
            "Administro contas, grupos e políticas no Active Directory, além de gerenciar acessos e permissões de pastas de rede",
            "Faço a manutenção preventiva e corretiva de cerca de 380 estações de trabalho e notebooks, com controle de inventário de TI",
            "Gerencio a rotina de backup e testo periodicamente a restauração, com registro de execução e evidências",
            "Configuro e mantenho a rede cabeada e wireless das unidades, incluindo switches gerenciáveis, VLANs e pontos de acesso",
            "Implantei um catálogo de serviços e a categorização dos chamados no sistema de ticket, o que reduziu o tempo médio de atendimento em cerca de 30%",
            "Elaboro documentação de procedimentos e base de conhecimento, reduzindo a dependência de atendimento presencial",
          ],
        },
        {
          role: "Técnico em Informática",
          company: "Assistência Técnica e Suporte TecFix",
          period: "Mar 2020 - Jun 2022",
          bullets: [
            "Realizei manutenção de hardware em computadores e notebooks: diagnóstico, troca de componentes, limpeza e upgrade",
            "Executei instalação e configuração de sistemas operacionais, drivers, softwares e antivírus",
            "Atendi clientes corporativos de pequeno porte com suporte remoto e presencial, incluindo configuração de rede e impressoras",
            "Realizei recuperação de dados e migração de perfis em trocas de equipamento",
          ],
        },
      ],
      education: [
        {
          degree: "Técnico em Informática",
          institution: "Escola Técnica Estadual",
          period: "2018 - 2019",
        },
        {
          degree: "Tecnólogo em Redes de Computadores (cursando)",
          institution: "Faculdade de Tecnologia",
          period: "2024 - 2026",
        },
        {
          degree: "ITIL Foundation",
          institution: "Certificação",
          period: "2023",
        },
      ],
      skills: [
        "Suporte técnico N1 e N2",
        "Windows Server e Active Directory",
        "Redes cabeadas e wireless, VLAN e switches",
        "Manutenção de hardware e inventário de TI",
        "Backup e restauração",
        "Sistema de chamados e SLA",
        "Office 365 e ferramentas de colaboração",
        "Documentação e base de conhecimento",
      ],
    },
    keySkills: [
      "Suporte técnico a usuário (N1 e N2), remoto e presencial",
      "Manutenção preventiva e corretiva de hardware",
      "Instalação e configuração de sistemas operacionais e softwares",
      "Windows Server, Active Directory e políticas de grupo",
      "Redes: cabeamento, switches, VLAN, wireless e roteamento básico",
      "Rotina de backup, restauração e testes de recuperação",
      "Sistema de chamados, SLA e catálogo de serviços",
      "Office 365, e-mail corporativo e ferramentas de colaboração",
      "Segurança básica: antivírus, permissões e boas práticas",
      "Documentação técnica e base de conhecimento",
    ],
    atsKeywords: [
      "Técnico em Informática",
      "Suporte Técnico",
      "Service Desk",
      "Help Desk",
      "Suporte N1",
      "Suporte N2",
      "Manutenção de Hardware",
      "Windows Server",
      "Active Directory",
      "Redes de Computadores",
      "VLAN",
      "Switch",
      "Wireless",
      "Backup",
      "Office 365",
      "ITIL",
      "SLA",
      "Chamados",
      "Infraestrutura de TI",
      "Inventário de TI",
    ],
    salaryNote:
      "No Brasil (2026), o técnico em informática costuma receber entre R$ 2.200 e R$ 4.000, com variação relevante conforme o escopo. Suporte N1 em service desk fica na base da faixa; suporte N2, infraestrutura, administração de servidores e redes ficam acima. Certificações reconhecidas, domínio de ambiente Microsoft corporativo, virtualização e experiência com nuvem tendem a puxar a remuneração para cima e abrem caminho para funções de analista de infraestrutura, com faixas superiores.",
    dos: [
      "Deixe claro o escopo: suporte a usuário, manutenção de hardware, redes, servidores ou service desk corporativo.",
      "Informe o tamanho do ambiente: número de usuários, estações, servidores e unidades atendidas.",
      "Traga indicadores: chamados por dia, cumprimento de SLA, resolução no primeiro atendimento.",
      "Liste as tecnologias pelo nome e versão quando relevante: Windows Server, AD, VLAN, Office 365.",
      "Cite certificações, mesmo as de entrada, e cursos técnicos com carga horária.",
      "Mencione documentação e base de conhecimento — poucos fazem e é muito valorizado.",
    ],
    donts: [
      "Não escreva 'conhecimento em informática' de forma genérica; liste as tecnologias específicas.",
      "Não omita o tamanho do ambiente atendido, que dimensiona a sua experiência.",
      "Não confunda suporte a usuário com infraestrutura no mesmo bloco sem distinguir o que você fazia.",
      "Não infle o nível em tecnologias que você apenas viu — testes técnicos são comuns.",
      "Não deixe de citar indicadores de atendimento em vagas de service desk corporativo.",
      "Não use currículo com layout complexo; a triagem automática lê melhor a coluna única.",
    ],
    faqs: [
      {
        question: "O que colocar no currículo de técnico em informática?",
        answer:
          "Comece por um título que já delimite o escopo, como 'Técnico em Informática | Suporte N1/N2, Redes e Windows Server'. No resumo, informe anos de experiência, tamanho do ambiente atendido (usuários, estações, servidores) e as principais competências. Na experiência, descreva cada vínculo com o tipo de atuação, as tecnologias envolvidas e indicadores: chamados por dia, cumprimento de SLA, taxa de resolução no primeiro atendimento. Liste formação técnica e certificações em seção própria. Uma seção de competências técnicas com os nomes exatos das tecnologias ajuda muito na triagem automática, que costuma filtrar por termo específico.",
      },
      {
        question: "Qual a diferença entre suporte N1, N2 e N3?",
        answer:
          "N1 é o primeiro nível de atendimento: recebe o chamado, faz o registro, executa procedimentos padronizados e resolve os problemas mais comuns — senha, acesso, impressora, dúvidas de software. N2 assume o que o N1 não resolve: diagnósticos mais profundos, configuração de sistemas, análise de rede, administração de contas e permissões, manutenção de hardware. N3 costuma ser especialista, com atuação em servidores, infraestrutura crítica, virtualização e problemas estruturais. No currículo, informe em qual nível você atua, porque as vagas são publicadas por nível e o candidato que não especifica acaba sendo enquadrado no nível mais baixo.",
      },
      {
        question: "Quais certificações valem a pena para técnico em informática?",
        answer:
          "As de maior retorno inicial costumam ser as ligadas ao ambiente corporativo mais comum: certificações de fundamentos em ambiente Microsoft, ITIL Foundation para processos de service desk, e certificações de rede de nível introdutório. Elas aparecem com frequência nas descrições de vaga e são filtro em triagem automática. Certificações de fundamentos em nuvem também se tornaram bastante valorizadas e abrem caminho para infraestrutura. No currículo, liste com o ano de obtenção e mantenha as que ainda são relevantes. Para quem quer migrar para analista de infraestrutura ou de redes, elas costumam ser o caminho mais direto.",
      },
      {
        question: "Como mostrar resultado em uma vaga de suporte?",
        answer:
          "Use os indicadores que a operação de TI acompanha: número médio de chamados atendidos por dia, percentual de cumprimento de SLA, taxa de resolução no primeiro atendimento, tempo médio de atendimento e redução de chamados recorrentes. Some a isso melhorias que você implantou: catálogo de serviços, categorização de chamados, base de conhecimento, automação de tarefas repetitivas, padronização de imagem de estações. Um exemplo forte: 'Implantei catálogo de serviços e categorização de chamados, reduzindo o tempo médio de atendimento em cerca de 30%.' Isso mostra que você não apenas apagou incêndios, mas melhorou o processo.",
      },
      {
        question: "Como migrar de técnico para analista de infraestrutura?",
        answer:
          "O caminho passa por sair do reativo e entrar no estrutural. Registre no currículo tudo o que você já faz nesse sentido: administração de Active Directory e políticas de grupo, gestão de backup com testes de restauração, configuração de switches e VLANs, virtualização, monitoramento, documentação de ambiente e projetos de melhoria. Em paralelo, invista em três lacunas comuns: redes em nível mais profundo, virtualização e fundamentos de nuvem, todos com certificações acessíveis. Uma graduação tecnológica em Redes ou Análise de Sistemas costuma ser critério em empresas estruturadas e ajuda a formalizar a mudança de nível.",
      },
      {
        question: "Preciso de curso superior para trabalhar com suporte técnico?",
        answer:
          "Não para a maioria das vagas de técnico e de service desk, em que o curso técnico em Informática ou em Redes já atende o requisito e a experiência prática pesa mais. A graduação tecnológica ou o bacharelado passam a fazer diferença para funções de analista, para empresas maiores com política de cargos definida e para a evolução de carreira em infraestrutura, segurança ou desenvolvimento. Uma estratégia comum e eficiente é entrar no mercado com o curso técnico e certificações, e cursar a graduação em paralelo, já trabalhando na área — o que combina renda, experiência e formação ao mesmo tempo.",
      },
    ],
  },
];
