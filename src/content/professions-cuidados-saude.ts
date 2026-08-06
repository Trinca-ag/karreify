import type { Profession } from "./types";

// Profissões de cuidados, serviços domésticos e saúde.
// As faixas em `salaryNote` são referências de mercado e variam por região,
// porte da empresa e convenção coletiva — mantenha o texto sempre com essa ressalva.
export const PROFESSIONS_CUIDADOS_SAUDE: Profession[] = [
  {
    slug: "cuidador-de-idosos",
    profession: "Cuidador de Idosos",
    metaTitle: "Modelo de Currículo para Cuidador de Idosos (Exemplo 2026)",
    h1: "Modelo de Currículo para Cuidador de Idosos",
    metaDescription:
      "Modelo de currículo para cuidador de idosos: rotina de cuidados, medicação, mobilidade, Alzheimer, exemplo pronto, palavras-chave de ATS e faixa salarial.",
    intro:
      "Contratar um cuidador de idosos é uma decisão de confiança, e o currículo precisa endereçar isso antes de qualquer outra coisa. Famílias e instituições avaliam três pontos: formação específica na área, experiência com o tipo de condição do idoso (mobilidade reduzida, demência, pós-operatório, acamado) e referências verificáveis. Currículos genéricos que dizem apenas 'cuidei de idosos' perdem para os que descrevem a rotina real de cuidado, o grau de dependência atendido e os procedimentos executados. Este modelo mostra como estruturar essas informações com clareza e responsabilidade profissional.",
    sampleResume: {
      name: "Marlene Aparecida Souza",
      headline: "Cuidadora de Idosos | Mobilidade Reduzida, Alzheimer e Pós-operatório | Curso técnico e primeiros socorros",
      summary:
        "Cuidadora de idosos com 8 anos de experiência em atendimento domiciliar e institucional, com atuação junto a idosos com mobilidade reduzida, demência e em recuperação pós-cirúrgica. Rotina de administração de medicamentos conforme prescrição, higiene, alimentação, estímulo cognitivo e acompanhamento em consultas. Curso de cuidador de idosos e formação em primeiros socorros atualizada.",
      experience: [
        {
          role: "Cuidadora de Idosos (domiciliar)",
          company: "Atendimento particular — família em São Paulo/SP",
          period: "Mar 2021 - Atual",
          bullets: [
            "Acompanho idosa de 84 anos com Alzheimer em estágio moderado, em regime de 12 horas diárias, com rotina estruturada de atividades e estímulo cognitivo",
            "Administro a medicação conforme prescrição médica, com controle de horários em planilha e comunicação de qualquer alteração à família e à equipe de saúde",
            "Realizo auxílio completo na higiene pessoal, banho, troca de fraldas e cuidados com a pele para prevenção de lesões por pressão",
            "Preparo e ofereço as refeições conforme orientação nutricional, com registro de aceitação alimentar e hidratação",
            "Acompanho consultas médicas e exames, organizando documentos, receitas e anotações para repasse à família",
            "Mantenho registro diário de intercorrências, sono, humor e comportamento, o que ajudou a equipe médica a ajustar a medicação",
          ],
        },
        {
          role: "Cuidadora de Idosos",
          company: "Casa de Repouso Vida Serena (28 residentes)",
          period: "Jan 2018 - Fev 2021",
          bullets: [
            "Atendi grupo de até 8 residentes por plantão, com diferentes graus de dependência, incluindo idosos acamados",
            "Realizei transferências e mudanças de decúbito conforme orientação da equipe de enfermagem, com uso correto de técnica para proteção do idoso e da minha coluna",
            "Auxiliei na alimentação de residentes com dificuldade de deglutição, seguindo a orientação da fonoaudióloga",
            "Conduzi atividades de recreação e estímulo cognitivo em grupo, com jogos, música e leitura",
            "Registrei ocorrências no prontuário do residente e comuniquei alterações à enfermagem responsável",
          ],
        },
      ],
      education: [
        {
          degree: "Curso de Cuidador de Idosos (160 horas)",
          institution: "SENAC",
          period: "2017",
        },
        {
          degree: "Primeiros Socorros e Suporte Básico de Vida",
          institution: "Curso livre com atualização em 2025",
          period: "2025",
        },
        {
          degree: "Ensino Médio Completo",
          institution: "EE Presidente Kennedy",
          period: "Concluído em 2015",
        },
      ],
      skills: [
        "Cuidado a idosos com Alzheimer e demência",
        "Administração de medicação conforme prescrição",
        "Higiene, banho e cuidados com a pele",
        "Transferência e mobilidade de idosos acamados",
        "Prevenção de lesões por pressão",
        "Preparo de refeições conforme orientação",
        "Registro de intercorrências e acompanhamento",
        "Primeiros socorros",
      ],
    },
    keySkills: [
      "Rotina de cuidados de higiene, banho e vestuário",
      "Administração de medicação conforme prescrição e controle de horários",
      "Auxílio na alimentação e controle de hidratação",
      "Mobilidade, transferência e mudança de decúbito",
      "Prevenção de quedas e de lesões por pressão",
      "Cuidado a idosos com Alzheimer, Parkinson e demências",
      "Estímulo cognitivo e atividades de recreação",
      "Registro diário e comunicação com família e equipe de saúde",
      "Primeiros socorros e reconhecimento de sinais de alerta",
      "Paciência, discrição e postura ética no ambiente domiciliar",
    ],
    atsKeywords: [
      "Cuidador de Idosos",
      "Cuidadora de Idosos",
      "Atendimento Domiciliar",
      "Home Care",
      "Alzheimer",
      "Demência",
      "Parkinson",
      "Idoso Acamado",
      "Mobilidade Reduzida",
      "Administração de Medicamentos",
      "Higiene Pessoal",
      "Lesão por Pressão",
      "Transferência de Paciente",
      "Estímulo Cognitivo",
      "Primeiros Socorros",
      "Casa de Repouso",
      "ILPI",
      "Acompanhamento em Consultas",
      "Registro de Intercorrências",
      "Escala 12x36",
    ],
    salaryNote:
      "No Brasil (2026), o cuidador de idosos costuma receber entre R$ 1.700 e R$ 3.000 em regime formal, com variação importante conforme a carga horária (diarista, 12x36, plantão noturno, residente) e o grau de dependência do idoso. Atendimentos particulares com jornada estendida, idosos acamados ou com demência avançada tendem a pagar acima da faixa. Plantões noturnos e finais de semana costumam ter valores diferenciados. Confirme sempre a forma de contratação e os direitos aplicáveis antes de fechar o acordo.",
    dos: [
      "Descreva o perfil dos idosos atendidos: idade, grau de dependência e condições (demência, mobilidade, pós-operatório).",
      "Informe o formato do atendimento: domiciliar ou institucional, carga horária e escala.",
      "Liste os cursos com carga horária — cuidador de idosos e primeiros socorros são os mais valorizados.",
      "Cite o registro de intercorrências e a comunicação com família e equipe de saúde: demonstra método.",
      "Ofereça referências verificáveis de famílias e instituições anteriores.",
      "Deixe claro o limite da função: você não substitui a equipe de enfermagem, e sim executa cuidados conforme orientação.",
    ],
    donts: [
      "Não escreva apenas 'cuidei de uma senhora idosa' sem descrever a rotina e as condições atendidas.",
      "Não se apresente executando procedimentos privativos de profissionais de enfermagem.",
      "Não omita cursos e formação — em uma função de confiança, formação reduz muito o risco percebido.",
      "Não deixe períodos sem registro: em atendimento particular, descreva como experiência com o período.",
      "Não use termos vagos como 'sou carinhosa e paciente' sem nenhum exemplo concreto da rotina.",
      "Não deixe de mencionar disponibilidade para plantão noturno e finais de semana, quando houver.",
    ],
    faqs: [
      {
        question: "Precisa de curso para ser cuidador de idosos?",
        answer:
          "Não há exigência legal de diploma para o exercício da função no Brasil, mas na prática o curso de cuidador de idosos é pedido pela maioria das famílias e é praticamente requisito em instituições de longa permanência. Ele cobre envelhecimento, higiene, mobilidade, administração de medicamentos, alimentação, primeiros socorros e aspectos éticos — conteúdo diretamente aplicado na rotina. Some a ele uma formação em primeiros socorros atualizada, que é o que mais tranquiliza famílias. No currículo, informe a carga horária de cada curso e o ano, e mantenha as atualizações em dia: em uma função baseada em confiança, formação comprovada é um diferencial concreto.",
      },
      {
        question: "Cuidador de idosos pode aplicar medicação?",
        answer:
          "O cuidador auxilia na administração de medicamentos já prescritos por médico, seguindo rigorosamente a prescrição, os horários e a via indicada — o que é diferente de prescrever, alterar dose ou executar procedimentos privativos de profissionais de enfermagem, como administração por via injetável, curativos complexos ou sondagens. Essa distinção é importante e vale explicitá-la no currículo e na entrevista, porque demonstra responsabilidade profissional e conhecimento dos limites da função. Descreva o que você faz de fato: controle de horários, organização da medicação, registro do que foi administrado e comunicação imediata de qualquer intercorrência à família e à equipe de saúde.",
      },
      {
        question: "Como fazer currículo de cuidador de idosos sem experiência formal?",
        answer:
          "Registre a experiência com familiares como experiência real, com o período e a descrição da rotina: 'Cuidadora domiciliar — cuidado a familiar com mobilidade reduzida por 3 anos, com rotina de higiene, alimentação, controle de medicação e acompanhamento em consultas.' Isso é verdadeiro e informativo. Em seguida, priorize a formação: o curso de cuidador e o de primeiros socorros são acessíveis e mudam completamente a percepção sobre o seu currículo. Ofereça referências — médicos, vizinhos, outros familiares — que possam confirmar. E mostre no resumo que você conhece a rotina técnica da função, usando o vocabulário correto.",
      },
      {
        question: "Como descrever experiência com idosos com Alzheimer?",
        answer:
          "Seja específico sobre o estágio da doença e sobre as estratégias que você utiliza, porque isso demonstra experiência real. Descreva a rotina estruturada, o manejo de episódios de agitação e confusão, as atividades de estímulo cognitivo, os cuidados com segurança e prevenção de fugas, a comunicação adaptada e o registro de comportamento para acompanhamento médico. Um bullet forte: 'Acompanho idosa de 84 anos com Alzheimer em estágio moderado, com rotina estruturada de atividades e registro diário de sono, humor e comportamento, o que ajudou a equipe médica a ajustar a medicação.' Famílias que buscam cuidador para demência valorizam muito essa especialização.",
      },
      {
        question: "Qual a diferença entre cuidador de idosos e técnico de enfermagem?",
        answer:
          "O técnico de enfermagem é um profissional de saúde com formação técnica regulamentada e registro no conselho de classe, habilitado a executar procedimentos como administração de medicamentos por via injetável, curativos, aferição e monitoramento clínico, sob supervisão do enfermeiro. O cuidador atua no apoio às atividades da vida diária: higiene, alimentação, mobilidade, companhia, estímulo, organização da rotina e auxílio na medicação já prescrita por via oral. São funções complementares e frequentemente atuam juntas. No currículo, deixe claro o seu papel — apresentar-se executando atribuições privativas da enfermagem é um erro grave que compromete a credibilidade.",
      },
      {
        question: "Como conseguir referências para trabalhar como cuidador?",
        answer:
          "Referências são o ativo mais valioso nessa profissão, porque a contratação é uma decisão de confiança. Ao encerrar um atendimento, peça à família uma carta simples ou autorização para indicá-los como referência, com nome e telefone — o momento certo é logo no fim, enquanto a lembrança está fresca. Guarde também contatos de profissionais de saúde que acompanharam o caso (médico, fisioterapeuta, enfermeiro), cujo aval tem peso adicional. No currículo, inclua uma linha ao final: 'Referências disponíveis mediante solicitação'. E mantenha um registro organizado de cada atendimento, com período e rotina, porque a memória se perde rápido depois de alguns anos.",
      },
    ],
  },
  {
    slug: "baba",
    profession: "Babá",
    metaTitle: "Modelo de Currículo para Babá (Exemplo Pronto 2026)",
    h1: "Modelo de Currículo para Babá",
    metaDescription:
      "Modelo de currículo para babá: rotina infantil por faixa etária, primeiros socorros, referências, exemplo pronto, palavras-chave de ATS e faixa salarial.",
    intro:
      "Poucas contratações envolvem tanta confiança quanto a de uma babá, e o currículo é a primeira peça dessa avaliação. Famílias procuram três coisas: experiência com a faixa etária específica dos filhos, formação em primeiros socorros e desenvolvimento infantil, e referências verificáveis de famílias anteriores. Um currículo que diz apenas 'cuidei de crianças' não responde a nenhuma delas. Este modelo mostra como descrever a rotina real de cuidado por faixa etária, como apresentar formação e referências, e como comunicar profissionalismo em uma função que acontece dentro da casa de alguém.",
    sampleResume: {
      name: "Vanessa Lopes Ferreira",
      headline: "Babá | Bebês, Primeira Infância e Idade Escolar | Primeiros Socorros e Desenvolvimento Infantil",
      summary:
        "Babá com 7 anos de experiência em atendimento domiciliar a crianças de 3 meses a 10 anos, com rotina completa de cuidados: alimentação, sono, higiene, estímulo, acompanhamento escolar e atividades. Formação em primeiros socorros infantis atualizada e curso de desenvolvimento infantil. Referências disponíveis de todas as famílias atendidas.",
      experience: [
        {
          role: "Babá (domiciliar)",
          company: "Família em Belo Horizonte/MG — 2 crianças",
          period: "Fev 2022 - Atual",
          bullets: [
            "Acompanho duas crianças (atualmente 4 e 8 anos) em jornada de segunda a sexta, das 7h às 18h, com rotina estruturada de atividades",
            "Organizo a rotina de alimentação conforme o cardápio orientado pela família, com preparo de refeições e registro de aceitação",
            "Levo e busco as crianças na escola e em atividades extracurriculares, com uso de cadeirinha adequada e atenção às normas de segurança",
            "Acompanho as tarefas escolares da criança mais velha, com rotina diária de estudo e organização de material",
            "Conduzo atividades de estímulo adequadas à idade: leitura, jogos, brincadeiras motoras e atividades ao ar livre, com tempo de tela controlado conforme combinado",
            "Mantenho comunicação diária com os pais sobre alimentação, sono, comportamento e intercorrências",
          ],
        },
        {
          role: "Babá de Bebê",
          company: "Família em Contagem/MG — 1 bebê",
          period: "Mar 2019 - Jan 2022",
          bullets: [
            "Cuidei de bebê desde os 3 meses até os 3 anos, com rotina completa de amamentação complementar, sono, banho e higiene",
            "Realizei preparo e esterilização de mamadeiras e utensílios, seguindo orientação da pediatra",
            "Acompanhei a introdução alimentar conforme orientação nutricional, com registro de aceitação e reações",
            "Conduzi atividades de estímulo motor e sensorial apropriadas a cada fase do desenvolvimento",
            "Acompanhei consultas pediátricas e mantive o calendário de vacinação organizado junto à mãe",
          ],
        },
      ],
      education: [
        {
          degree: "Curso de Babá e Cuidados Infantis",
          institution: "SENAC",
          period: "2018",
        },
        {
          degree: "Primeiros Socorros Infantis e Desengasgo",
          institution: "Curso livre com atualização em 2025",
          period: "2025",
        },
        {
          degree: "Ensino Médio Completo",
          institution: "EE Governador Valadares",
          period: "Concluído em 2017",
        },
      ],
      skills: [
        "Cuidados com bebês (0 a 2 anos)",
        "Rotina de primeira infância e idade escolar",
        "Preparo de refeições e introdução alimentar",
        "Higiene, banho e rotina de sono",
        "Acompanhamento escolar e tarefas",
        "Atividades de estímulo por faixa etária",
        "Primeiros socorros infantis e desengasgo",
        "CNH B para transporte das crianças",
      ],
    },
    keySkills: [
      "Cuidados com bebês: amamentação complementar, sono, banho e higiene",
      "Rotina de alimentação e apoio à introdução alimentar",
      "Atividades de estímulo adequadas à faixa etária",
      "Acompanhamento escolar e apoio às tarefas",
      "Transporte seguro com cadeirinha e normas de segurança",
      "Organização da rotina infantil e limites",
      "Primeiros socorros infantis e manobra de desengasgo",
      "Comunicação diária e registro para os pais",
      "Controle de tempo de tela e mediação de conflitos entre irmãos",
      "Discrição, ética e respeito à privacidade da família",
    ],
    atsKeywords: [
      "Babá",
      "Cuidados Infantis",
      "Cuidadora de Crianças",
      "Bebê",
      "Primeira Infância",
      "Introdução Alimentar",
      "Rotina de Sono",
      "Estímulo Infantil",
      "Acompanhamento Escolar",
      "Primeiros Socorros Infantis",
      "Desengasgo",
      "Desenvolvimento Infantil",
      "Atendimento Domiciliar",
      "Higiene do Bebê",
      "Esterilização de Mamadeiras",
      "Transporte Escolar",
      "Cadeirinha",
      "CNH B",
      "Referências",
      "Trabalho Doméstico",
    ],
    salaryNote:
      "No Brasil (2026), a babá costuma receber entre R$ 1.700 e R$ 3.500, com variação relevante conforme a região, o número de crianças, a faixa etária (bebês tendem a pagar mais), a carga horária e as atribuições adicionais como dirigir, viajar com a família ou dormir no emprego. Capitais e regiões de maior renda pagam acima da média. O trabalho doméstico tem regras próprias de contratação, jornada e direitos — confirme o enquadramento e o registro em carteira antes de fechar o acordo.",
    dos: [
      "Especifique a faixa etária das crianças que você atendeu e por quanto tempo acompanhou cada uma.",
      "Descreva a rotina real: alimentação, sono, higiene, escola, atividades e comunicação com os pais.",
      "Coloque primeiros socorros infantis em destaque, com o ano da última atualização.",
      "Informe se tem CNH e disponibilidade para transportar as crianças — é diferencial forte.",
      "Ofereça referências verificáveis: em cuidado infantil, elas frequentemente decidem a contratação.",
      "Mencione tempo de permanência em cada família: longevidade transmite confiança.",
    ],
    donts: [
      "Não escreva apenas 'cuidei de crianças' sem dizer a idade e a rotina executada.",
      "Não omita a formação em primeiros socorros — é o item que mais tranquiliza famílias.",
      "Não deixe de citar o período de cada atendimento; permanências curtas sem explicação geram dúvida.",
      "Não inclua fotos das crianças que você cuidou nem informações que identifiquem as famílias.",
      "Não confunda babá com empregada doméstica no currículo: descreva as atribuições que você aceita.",
      "Não use apenas adjetivos ('sou carinhosa e paciente'); descreva situações e rotinas concretas.",
    ],
    faqs: [
      {
        question: "O que colocar no currículo de babá?",
        answer:
          "Comece com um título que traga a faixa etária que você domina, como 'Babá | Bebês e Primeira Infância | Primeiros Socorros'. No resumo, informe anos de experiência, idades atendidas e as principais rotinas que executa. Na experiência, descreva cada família com o período, o número e a idade das crianças e a rotina completa: alimentação, sono, higiene, escola, atividades de estímulo e comunicação com os pais. Liste os cursos, especialmente primeiros socorros infantis, com o ano de atualização. Informe CNH se tiver. E encerre com uma linha oferecendo referências — em cuidado infantil, elas costumam ser decisivas.",
      },
      {
        question: "Preciso de curso para ser babá?",
        answer:
          "Não é exigido por lei, mas faz uma diferença enorme na percepção da família e na sua segurança no dia a dia. Os dois mais valorizados são o curso de babá ou cuidados infantis, que cobre rotina, higiene, alimentação e desenvolvimento por faixa etária, e o de primeiros socorros infantis com manobra de desengasgo — este último é o que mais tranquiliza pais e frequentemente é solicitado. Cursos sobre desenvolvimento infantil, sono do bebê e introdução alimentar são diferenciais adicionais e ajudam a acessar vagas melhor remuneradas. Mantenha o de primeiros socorros sempre atualizado e informe o ano no currículo.",
      },
      {
        question: "Como conseguir referências sendo babá iniciante?",
        answer:
          "Comece pelo que você já tem: cuidado de sobrinhos, primos ou filhos de vizinhos, trabalho voluntário com crianças em igreja ou associação, atuação como monitora em escolinha, colônia de férias ou recreação em festas. Peça a essas pessoas autorização para indicá-las como referência, com nome e telefone. Em paralelo, invista nos cursos, que compensam parcialmente a falta de histórico. Considere também começar com trabalhos pontuais — babá por período, apoio em eventos, cobertura de férias — que geram referências reais rapidamente. Ao encerrar cada trabalho, peça uma recomendação por escrito enquanto a experiência está recente.",
      },
      {
        question: "Babá também faz serviços domésticos?",
        answer:
          "Depende do que for combinado, e é fundamental que isso esteja claro desde a entrevista. Muitas famílias esperam que a babá cuide do que é relacionado à criança — organizar o quarto, lavar a roupa da criança, preparar as refeições dela, esterilizar mamadeiras — sem assumir a limpeza geral da casa. Outras contratam uma função combinada, com remuneração correspondente. Não há resposta única, mas há uma regra prática: defina o escopo por escrito antes de começar, para evitar o desgaste progressivo que ocorre quando as atribuições crescem sem combinação. No currículo, deixe claro quais atribuições você exerce.",
      },
      {
        question: "Como descrever experiência com bebês no currículo?",
        answer:
          "Bebês exigem competências específicas, e detalhá-las diferencia bastante o currículo. Descreva a idade em que assumiu e até quando acompanhou, e as rotinas executadas: amamentação complementar e preparo de mamadeiras, esterilização de utensílios, rotina de sono e cochilos, banho e higiene, troca e cuidados com a pele, apoio à introdução alimentar conforme orientação nutricional, estímulo motor e sensorial por fase, e acompanhamento de consultas e calendário de vacinação. Um exemplo: 'Cuidei de bebê dos 3 meses aos 3 anos, com rotina completa de sono, alimentação e higiene, acompanhando toda a introdução alimentar conforme orientação da pediatra.'",
      },
      {
        question: "Babá tem carteira assinada e quais direitos?",
        answer:
          "A babá é uma trabalhadora doméstica quando presta serviço de forma contínua e subordinada à família, e nessa condição tem direito ao registro em carteira e aos direitos previstos na legislação do trabalho doméstico, que inclui jornada definida, controle de horas, férias, 13º, FGTS e demais verbas, conforme as regras aplicáveis à categoria. Antes de aceitar uma vaga, confirme o formato da contratação, a jornada, os dias de trabalho e o que está incluído na remuneração. Para dúvidas específicas sobre enquadramento, jornada em regime de dormir no emprego ou verbas rescisórias, vale consultar o sindicato da categoria ou um profissional da área trabalhista.",
      },
    ],
  },
  {
    slug: "empregada-domestica",
    profession: "Empregada Doméstica",
    metaTitle: "Modelo de Currículo para Empregada Doméstica (Exemplo 2026)",
    h1: "Modelo de Currículo para Empregada Doméstica",
    metaDescription:
      "Modelo de currículo para empregada doméstica e diarista: rotina de limpeza, cozinha, organização, referências, exemplo pronto, ATS e faixa salarial.",
    intro:
      "Um currículo de empregada doméstica bem-feito é raro — e justamente por isso ele diferencia muito. A maioria das contratações acontece por indicação, mas apresentar um documento organizado transmite profissionalismo antes mesmo da entrevista e ajuda especialmente quem está mudando de cidade ou não tem rede de indicações. Famílias e agências avaliam basicamente três coisas: quais atribuições você domina (limpeza, cozinha, passar roupa, organização), tempo de permanência nos empregos anteriores e referências verificáveis. Este modelo mostra como apresentar tudo isso de forma clara e profissional.",
    sampleResume: {
      name: "Sandra Regina Oliveira",
      headline: "Empregada Doméstica | Limpeza, Cozinha e Organização | Referências de 6 anos na última casa",
      summary:
        "Profissional doméstica com 12 anos de experiência em residências, com domínio da rotina completa: limpeza geral, cozinha do dia a dia, lavagem e passadoria, organização de armários e apoio em recepções. Experiência com casas de até 4 dormitórios e famílias com crianças e animais. Permanência média de 5 anos por família, com referências disponíveis de todas as casas em que trabalhei.",
      experience: [
        {
          role: "Empregada Doméstica (mensalista)",
          company: "Residência em Campinas/SP — casa de 4 dormitórios",
          period: "Jan 2019 - Atual",
          bullets: [
            "Executo a rotina completa da casa de segunda a sexta: limpeza geral, banheiros, cozinha, área de serviço e áreas comuns",
            "Preparo o almoço diário para a família de 4 pessoas, seguindo cardápio combinado e restrições alimentares de um dos moradores",
            "Realizo lavagem, secagem, passadoria e guarda de roupas, incluindo peças delicadas e uniformes escolares",
            "Organizo armários, despensa e geladeira, com controle de validade e lista de compras semanal",
            "Auxilio na recepção de visitas e no preparo de jantares e almoços de família em datas comemorativas",
            "Cuido de dois cães da família: alimentação, água e limpeza do espaço deles",
          ],
        },
        {
          role: "Empregada Doméstica",
          company: "Residência em Valinhos/SP — apartamento de 3 dormitórios",
          period: "Mar 2014 - Dez 2018",
          bullets: [
            "Responsável pela limpeza completa do apartamento e pela rotina de lavanderia",
            "Preparei refeições diárias e apoiei no cuidado de duas crianças em idade escolar, com lanches e organização de material",
            "Organizei a rotina de compras e o controle de produtos de limpeza e de despensa",
            "Mantive rotina de limpeza pesada semanal (vidros, rejuntes, armários) além da manutenção diária",
          ],
        },
      ],
      education: [
        {
          degree: "Curso de Organização e Higienização Residencial",
          institution: "Curso livre",
          period: "2022",
        },
        {
          degree: "Ensino Fundamental Completo",
          institution: "EE Vila Industrial",
          period: "Concluído em 2011",
        },
      ],
      skills: [
        "Limpeza geral e limpeza pesada",
        "Cozinha do dia a dia e cardápio familiar",
        "Lavagem, passadoria e cuidado com tecidos",
        "Organização de armários e despensa",
        "Controle de compras e produtos",
        "Cuidado com animais domésticos",
        "Apoio em recepções e eventos familiares",
        "Discrição e respeito à privacidade",
      ],
    },
    keySkills: [
      "Rotina de limpeza diária e limpeza pesada periódica",
      "Preparo de refeições e cardápio do dia a dia",
      "Lavagem, secagem, passadoria e cuidado com tecidos delicados",
      "Organização de armários, despensa e geladeira",
      "Controle de estoque doméstico e lista de compras",
      "Uso correto e seguro de produtos de limpeza",
      "Cuidado com animais domésticos",
      "Apoio em recepções, almoços e jantares",
      "Autonomia para conduzir a rotina sem supervisão",
      "Discrição, pontualidade e respeito à privacidade da família",
    ],
    atsKeywords: [
      "Empregada Doméstica",
      "Doméstica",
      "Diarista",
      "Serviços Domésticos",
      "Limpeza Residencial",
      "Limpeza Pesada",
      "Passadoria",
      "Lavanderia",
      "Cozinha",
      "Preparo de Refeições",
      "Organização Residencial",
      "Mensalista",
      "Governanta",
      "Cuidado com Animais",
      "Controle de Compras",
      "Referências",
      "Trabalho Doméstico",
      "Casa de Família",
      "Higienização",
      "Rotina Doméstica",
    ],
    salaryNote:
      "No Brasil (2026), a empregada doméstica mensalista costuma receber entre R$ 1.600 e R$ 2.600, com valores acima da média em capitais, casas maiores e quando a função acumula cozinha elaborada, cuidado com crianças ou responsabilidades de governanta. Diaristas trabalham por valor de diária, que varia conforme a região e o tamanho do imóvel. O trabalho doméstico tem legislação própria sobre jornada, registro, FGTS e demais direitos — confirme o enquadramento e o registro em carteira antes de fechar o acordo.",
    dos: [
      "Liste as atribuições que você domina separadamente: limpeza, cozinha, passar roupa, organização, cuidado com pets.",
      "Informe o porte da residência: número de dormitórios, tamanho da família, presença de crianças e animais.",
      "Destaque o tempo de permanência em cada casa — longevidade é o principal sinal de confiança.",
      "Ofereça referências verificáveis, com autorização das famílias anteriores.",
      "Diga se você é mensalista ou diarista e qual disponibilidade tem (dias, horários).",
      "Mencione habilidades específicas: cozinha para restrições alimentares, cuidado com tecidos, organização.",
    ],
    donts: [
      "Não escreva apenas 'fazia serviços gerais' — descreva as rotinas que você domina.",
      "Não omita o tempo de cada emprego; permanências curtas sem explicação geram dúvida.",
      "Não deixe de oferecer referências: em trabalho doméstico, elas são frequentemente decisivas.",
      "Não inclua dados que identifiquem as famílias anteriores além do necessário.",
      "Não aceite acordos verbais sobre jornada e atribuições sem registro por escrito.",
      "Não use apenas adjetivos como 'sou caprichosa'; descreva a rotina que comprova isso.",
    ],
    faqs: [
      {
        question: "Como fazer currículo de empregada doméstica?",
        answer:
          "Mantenha em uma página, com estrutura simples. No topo: nome, telefone com WhatsApp, cidade e bairro, e uma linha de disponibilidade (mensalista ou diarista, dias e horários). Em seguida, um resumo de três linhas com anos de experiência, atribuições que você domina e permanência média nos empregos. Na experiência, descreva cada casa com o período, o porte do imóvel e as rotinas executadas — limpeza, cozinha, lavanderia, organização, cuidado com animais. Liste cursos, se houver, e encerre com 'Referências disponíveis mediante solicitação'. Um documento organizado é raro na área e transmite profissionalismo antes da primeira conversa.",
      },
      {
        question: "Qual a diferença entre empregada doméstica e diarista?",
        answer:
          "A distinção mais usada envolve a continuidade e a frequência do serviço. A empregada doméstica presta serviço de forma contínua para a mesma família, com subordinação e jornada definida, e deve ter registro em carteira com os direitos da categoria. A diarista atua com frequência reduzida em cada residência, geralmente atendendo várias casas, com autonomia sobre a própria rotina. Essa diferença tem efeitos jurídicos relevantes sobre vínculo, direitos e obrigações. Antes de fechar um acordo, deixe claro qual é o formato e, em caso de dúvida sobre o enquadramento correto da sua situação, consulte o sindicato da categoria ou um profissional da área trabalhista.",
      },
      {
        question: "Como conseguir referências para trabalho doméstico?",
        answer:
          "Peça sempre ao encerrar um trabalho, enquanto a relação está boa e a lembrança fresca. O ideal é ter duas coisas: autorização para informar nome e telefone da família como referência, e uma carta simples assinada descrevendo o período trabalhado e as atribuições. Guarde essas cartas organizadas. Se você está começando, use referências de qualquer trabalho anterior que demonstre confiabilidade e pontualidade, além de pessoas que possam falar do seu caráter. Referências são o principal fator de decisão nessa área, porque o trabalho acontece dentro da casa das pessoas, muitas vezes sem supervisão.",
      },
      {
        question: "Empregada doméstica precisa de carteira assinada?",
        answer:
          "O trabalho doméstico contínuo e subordinado deve ser registrado em carteira, com os direitos previstos na legislação específica da categoria — que abrange jornada, horas extras, férias, 13º, FGTS e demais verbas, conforme as regras aplicáveis. O registro protege os dois lados e é obrigação do empregador. Ao negociar uma vaga, confirme desde o início: registro em carteira, jornada e dias de trabalho, valor do salário e o que está incluso (vale-transporte, alimentação). Se houver dúvida sobre o enquadramento da sua situação específica ou sobre verbas, o sindicato da categoria costuma orientar gratuitamente.",
      },
      {
        question: "Como valorizar meu currículo se sempre trabalhei na mesma casa?",
        answer:
          "Longevidade é um ativo, não uma limitação — trate-a como diferencial explícito. Escreva no resumo: 'Permanência de 8 anos na última residência, com referências disponíveis'. Em uma área baseada em confiança, ficar muito tempo com a mesma família é o sinal mais forte que existe. Detalhe a evolução das suas atribuições ao longo do período: se você começou só com limpeza e passou a cozinhar, organizar compras, cuidar de crianças ou receber visitas, isso mostra crescimento e confiança conquistada. Descreva também o porte da casa e a complexidade da rotina, para que o recrutador dimensione a sua experiência.",
      },
      {
        question: "Devo listar cozinha como habilidade separada?",
        answer:
          "Sim, e com detalhe, porque é uma das atribuições que mais influenciam a remuneração. Muitas famílias procuram especificamente alguém que cozinhe bem, e o nível de exigência varia bastante: do almoço simples do dia a dia até cardápios com restrições alimentares, dietas específicas, comida para crianças ou preparo de refeições para recepções. Descreva o que você faz de fato: para quantas pessoas, com que frequência, se segue cardápio combinado, se atende restrições e se já preparou refeições para eventos familiares. Quem domina cozinha, organização e passadoria fina costuma acessar as vagas mais bem remuneradas da área.",
      },
    ],
  },
  {
    slug: "auxiliar-de-farmacia",
    profession: "Auxiliar de Farmácia",
    metaTitle: "Modelo de Currículo para Auxiliar de Farmácia (Exemplo 2026)",
    h1: "Modelo de Currículo para Auxiliar de Farmácia",
    metaDescription:
      "Modelo de currículo para auxiliar de farmácia: atendimento, medicamentos, controlados, SNGPC, estoque, exemplo pronto, palavras-chave de ATS e salário.",
    intro:
      "O auxiliar de farmácia trabalha na fronteira entre atendimento comercial e ambiente de saúde — e o currículo precisa mostrar competência nos dois lados. Drogarias avaliam conhecimento de medicamentos (classes, genéricos, similares), domínio dos procedimentos para receituário e controlados, operação de sistema e desempenho em vendas de perfumaria e conveniência, que sustentam boa parte da margem. Currículos que descrevem apenas 'atendimento ao cliente' não comunicam o conhecimento técnico que a função exige. Este modelo mostra como equilibrar as duas dimensões, com exemplo pronto e a lista de termos que a triagem procura.",
    sampleResume: {
      name: "Tatiane Moreira dos Reis",
      headline: "Auxiliar de Farmácia | Atendimento, Controlados e Gestão de Estoque | Curso técnico em Farmácia",
      summary:
        "Auxiliar de farmácia com 6 anos de experiência em drogaria de rede, com atendimento ao cliente, orientação sobre medicamentos isentos de prescrição, recebimento e conferência de receituário, apoio ao controle de medicamentos sujeitos a controle especial e gestão de estoque e validade. Curso técnico em Farmácia concluído e experiência com sistema de gestão de drogaria.",
      experience: [
        {
          role: "Auxiliar de Farmácia",
          company: "Drogaria Rede Popular — Unidade Centro",
          period: "Abr 2022 - Atual",
          bullets: [
            "Atendo em média 90 clientes por turno, com orientação sobre medicamentos isentos de prescrição e apresentação de opções de genérico e similar",
            "Realizo a conferência de receituário e o encaminhamento ao farmacêutico responsável para dispensação de medicamentos sujeitos a controle especial",
            "Apoio a escrituração e a organização da documentação exigida pelo controle sanitário, sob orientação do farmacêutico responsável técnico",
            "Gerencio o estoque da loja com conferência de recebimento, controle de validade e devolução de produtos próximos ao vencimento, reduzindo perdas em cerca de 30%",
            "Superei a meta de perfumaria e produtos de conveniência em 9 dos últimos 12 meses",
            "Opero o sistema de gestão com emissão de cupom, aplicação de convênios e programas de desconto de laboratórios",
            "Realizo a organização de gôndolas e a exposição conforme planograma da rede",
          ],
        },
        {
          role: "Atendente de Drogaria",
          company: "Farmácia Bem Viver",
          period: "Jan 2020 - Mar 2022",
          bullets: [
            "Atuei no atendimento de balcão e na operação de caixa, com fechamento de turno sem divergência",
            "Realizei a reposição e a organização das seções de higiene, perfumaria e dermocosméticos",
            "Auxiliei na conferência de notas fiscais de entrada e no registro de produtos no sistema",
            "Participei dos inventários mensais de estoque da loja",
          ],
        },
      ],
      education: [
        {
          degree: "Técnico em Farmácia",
          institution: "Escola Técnica Estadual",
          period: "2021 - 2022",
        },
        {
          degree: "Curso de Atendimento e Vendas em Drogaria",
          institution: "Curso corporativo da rede",
          period: "2023",
        },
        {
          degree: "Ensino Médio Completo",
          institution: "EE Cidade Jardim",
          period: "Concluído em 2019",
        },
      ],
      skills: [
        "Atendimento ao cliente em drogaria",
        "Conhecimento de genéricos e similares",
        "Conferência de receituário",
        "Apoio ao controle de medicamentos especiais",
        "Gestão de estoque e validade",
        "Sistema de gestão de drogaria",
        "Metas de perfumaria e conveniência",
        "Operação de caixa e fechamento",
      ],
    },
    keySkills: [
      "Atendimento ao cliente com orientação sobre produtos",
      "Conhecimento de classes de medicamentos, genéricos e similares",
      "Conferência de receituário e encaminhamento ao farmacêutico",
      "Apoio aos procedimentos de medicamentos sujeitos a controle especial",
      "Recebimento, conferência e organização de estoque",
      "Controle de validade e gestão de perdas",
      "Operação de sistema de gestão e de PDV",
      "Cumprimento de metas de perfumaria e conveniência",
      "Organização de gôndolas e execução de planograma",
      "Noções de armazenamento e conservação de medicamentos",
    ],
    atsKeywords: [
      "Auxiliar de Farmácia",
      "Atendente de Farmácia",
      "Técnico em Farmácia",
      "Drogaria",
      "Medicamentos",
      "Genéricos",
      "Similares",
      "Medicamentos Controlados",
      "Receituário",
      "SNGPC",
      "Dispensação",
      "Perfumaria",
      "Dermocosméticos",
      "Controle de Validade",
      "Gestão de Estoque",
      "Inventário",
      "PDV",
      "Metas de Venda",
      "Farmacêutico Responsável",
      "Atendimento ao Cliente",
    ],
    salaryNote:
      "No Brasil (2026), o auxiliar de farmácia costuma receber entre R$ 1.700 e R$ 2.600 de salário fixo, frequentemente com comissão sobre venda de perfumaria, dermocosméticos e produtos de laboratórios parceiros, o que pode representar parcela relevante da remuneração. Profissionais com curso técnico em Farmácia e experiência com controle de estoque e medicamentos especiais tendem a ficar no topo da faixa. Grandes redes costumam pagar acima de farmácias independentes; confira o piso da convenção coletiva dos comerciários da região.",
    dos: [
      "Destaque a formação técnica em Farmácia, se tiver: é o principal diferencial na triagem.",
      "Cite conhecimento de classes de medicamentos, genéricos e similares de forma concreta.",
      "Mencione a rotina de receituário e o apoio aos procedimentos de medicamentos controlados.",
      "Traga números de venda: cumprimento de meta de perfumaria, ticket médio, clientes por turno.",
      "Informe experiência com estoque, validade e inventário, que amplia bastante as vagas possíveis.",
      "Deixe claro o limite da função: você apoia o farmacêutico responsável, não substitui a dispensação técnica.",
    ],
    donts: [
      "Não se apresente executando atribuições privativas do farmacêutico responsável técnico.",
      "Não escreva apenas 'atendi clientes': descreva o conhecimento técnico envolvido.",
      "Não omita metas de venda — a função é comercial e isso pesa na avaliação.",
      "Não invente conhecimento sobre medicamentos: há teste e perguntas técnicas na entrevista.",
      "Não deixe de citar o sistema de gestão utilizado, que reduz o tempo de treinamento.",
      "Não use currículo com foto e enfeites; redes de drogaria usam triagem automática.",
    ],
    faqs: [
      {
        question: "Precisa de curso técnico para ser auxiliar de farmácia?",
        answer:
          "Não é exigido para todas as vagas de atendimento em drogaria, e muitas redes contratam com ensino médio e treinam internamente. Mas o curso técnico em Farmácia é um diferencial expressivo na triagem, abre acesso a funções com mais responsabilidade e costuma refletir na remuneração. Ele cobre farmacologia básica, formas farmacêuticas, armazenamento, legislação sanitária e atendimento — conteúdo cobrado no dia a dia e em entrevistas. Se você não pretende fazer o curso técnico agora, um curso livre de atendimento em drogaria já ajuda. E lembre-se de que a responsabilidade técnica e a dispensação são atribuições do farmacêutico responsável.",
      },
      {
        question: "Auxiliar de farmácia pode vender medicamento controlado?",
        answer:
          "O atendimento a receitas de medicamentos sujeitos a controle especial envolve procedimentos e responsabilidade técnica do farmacêutico responsável presente no estabelecimento. O auxiliar atua no apoio: recebimento e conferência inicial do receituário, encaminhamento ao farmacêutico, organização da documentação e do arquivo conforme o procedimento da loja, e registro no sistema sob orientação. Deixar essa distinção clara no currículo e na entrevista demonstra conhecimento da legislação sanitária e responsabilidade profissional — o oposto de se apresentar executando atribuições privativas, que é um erro grave e facilmente percebido por quem contrata em farmácia.",
      },
      {
        question: "Como fazer currículo de auxiliar de farmácia sem experiência?",
        answer:
          "Priorize três coisas no topo: formação (curso técnico em Farmácia, se estiver cursando informe o período; ou curso livre de atendimento em drogaria), disponibilidade para escala 6x1 e finais de semana, e qualquer experiência anterior com atendimento ao público e operação de caixa. No resumo, mostre que você entende a natureza dupla da função: atendimento com conhecimento técnico e cumprimento de metas comerciais. Se você tem noções de medicamentos por estudo próprio ou por experiência com cuidado familiar, mencione com honestidade. E destaque organização e atenção a detalhe, que são essenciais em uma operação com controle sanitário rigoroso.",
      },
      {
        question: "Qual a diferença entre auxiliar e técnico em farmácia?",
        answer:
          "O auxiliar ou atendente de farmácia atua no atendimento comercial, na organização da loja, no estoque e no apoio à operação, normalmente sem exigência de formação específica. O técnico em Farmácia tem formação técnica de nível médio na área, com conteúdo de farmacologia, formas farmacêuticas, legislação sanitária e, em alguns casos, manipulação — o que amplia as atribuições possíveis e o acesso a vagas em farmácias de manipulação, hospitais e indústria. No currículo, use o termo correspondente à sua formação real. Se você é auxiliar cursando o técnico, informe: 'Auxiliar de Farmácia | Técnico em Farmácia (cursando, conclusão em 2026)'.",
      },
      {
        question: "Metas de venda são importantes em farmácia?",
        answer:
          "Muito. Boa parte da margem de uma drogaria vem de perfumaria, dermocosméticos, produtos de higiene, genéricos de maior margem e itens de laboratórios parceiros — e o auxiliar é quem tem o contato direto no momento da decisão. Por isso, metas individuais são a norma e costumam gerar comissão relevante na remuneração. No currículo, traga esse lado com números: percentual de atingimento, meses em que superou a meta, posição no ranking da loja, ticket médio. Um bullet como 'superei a meta de perfumaria em 9 dos últimos 12 meses' comunica exatamente o que o gerente da loja procura e diferencia o currículo com facilidade.",
      },
      {
        question: "Como evoluir na carreira dentro de uma farmácia?",
        answer:
          "As trilhas mais comuns são duas. A primeira é comercial: auxiliar, subgerente e gerente de loja, com foco em metas, indicadores, estoque e gestão de equipe — para isso, invista em leitura de indicadores, controle de perdas e liderança. A segunda é técnica: concluir o curso técnico em Farmácia e, eventualmente, a graduação, abrindo caminho para atuação como farmacêutico responsável, em manipulação, farmácia hospitalar ou indústria. No currículo, registre desde já tudo o que aponta para a trilha desejada: se é comercial, destaque resultados e substituições de liderança; se é técnica, destaque estoque, controle sanitário e formação em curso.",
      },
    ],
  },
  {
    slug: "dentista",
    profession: "Dentista (Cirurgião-Dentista)",
    metaTitle: "Modelo de Currículo para Dentista (Cirurgião-Dentista) 2026",
    h1: "Modelo de Currículo para Dentista",
    metaDescription:
      "Modelo de currículo para cirurgião-dentista: CRO, especializações, procedimentos, produção clínica, exemplo pronto, palavras-chave de ATS e faixa salarial.",
    intro:
      "O currículo de cirurgião-dentista é avaliado por dois filtros: o administrativo, que confere CRO ativo, especialização e disponibilidade de agenda, e o clínico, que quer saber quais procedimentos você executa com autonomia, em qual volume e com qual índice de retorno. Currículos que listam apenas os cursos feitos, sem produção clínica, não respondem à segunda pergunta — que é a que decide. Este modelo mostra como estruturar formação, especialidades, procedimentos e indicadores de produção, servindo tanto para clínicas e redes odontológicas quanto para serviço público e convênios.",
    sampleResume: {
      name: "Dra. Fernanda Lima Assunção",
      headline: "Cirurgiã-Dentista | CRO-SP 00.000 | Clínica Geral, Endodontia e Odontopediatria",
      summary:
        "Cirurgiã-dentista com 9 anos de atuação clínica, com especialização em Endodontia e experiência consolidada em clínica geral e odontopediatria. Média de 180 atendimentos mensais em clínica de rede, com alto índice de aceitação de plano de tratamento e baixo índice de retorno por intercorrência. Experiência com convênios odontológicos, auditoria e documentação clínica completa.",
      experience: [
        {
          role: "Cirurgiã-Dentista",
          company: "Rede de Clínicas Odontológicas Sorriso Real",
          period: "Fev 2021 - Atual",
          bullets: [
            "Realizo média de 180 atendimentos por mês em clínica geral e endodontia, com agenda de 5 dias por semana",
            "Executo tratamentos endodônticos uni e multirradiculares com instrumentação rotatória, com índice de sucesso acompanhado por controle radiográfico",
            "Mantenho taxa de aceitação de plano de tratamento acima de 70%, com apresentação clara de diagnóstico e alternativas ao paciente",
            "Realizo procedimentos de dentística restauradora, profilaxia, exodontias simples e atendimento de urgência",
            "Atendo pacientes infantis com manejo comportamental adequado à faixa etária e orientação de higiene aos responsáveis",
            "Mantenho documentação clínica completa (anamnese, odontograma, evolução, radiografias e termos de consentimento), com aprovação em todas as auditorias de convênio do período",
            "Oriento e acompanho duas auxiliares de saúde bucal na rotina de instrumentação, biossegurança e esterilização",
          ],
        },
        {
          role: "Cirurgiã-Dentista",
          company: "Unidade Básica de Saúde — Prefeitura Municipal",
          period: "Mar 2017 - Jan 2021",
          bullets: [
            "Atendi demanda espontânea e programada em atenção primária, com média de 16 pacientes por turno",
            "Executei procedimentos de urgência, dentística, periodontia básica, exodontias e prevenção",
            "Conduzi ações de educação em saúde bucal em escolas e grupos comunitários do território",
            "Realizei o registro e a alimentação dos sistemas de informação em saúde conforme protocolo da secretaria",
          ],
        },
      ],
      education: [
        {
          degree: "Especialização em Endodontia",
          institution: "Faculdade de Odontologia — programa de especialização",
          period: "2019 - 2021",
        },
        {
          degree: "Graduação em Odontologia — CRO-SP ativo",
          institution: "Universidade Federal",
          period: "2011 - 2016",
        },
        {
          degree: "Atualização em Odontopediatria e Manejo Comportamental",
          institution: "Curso de atualização",
          period: "2023",
        },
      ],
      skills: [
        "Clínica geral e dentística restauradora",
        "Endodontia com instrumentação rotatória",
        "Odontopediatria e manejo comportamental",
        "Periodontia básica e profilaxia",
        "Exodontias simples",
        "Atendimento de urgência",
        "Documentação clínica e auditoria de convênio",
        "Biossegurança e protocolos de esterilização",
      ],
    },
    keySkills: [
      "Diagnóstico, plano de tratamento e apresentação ao paciente",
      "Dentística restauradora e procedimentos de clínica geral",
      "Endodontia (uni e multirradicular, instrumentação rotatória)",
      "Periodontia básica, profilaxia e raspagem",
      "Exodontias simples e atendimento de urgência",
      "Odontopediatria e manejo comportamental infantil",
      "Documentação clínica: anamnese, odontograma, evolução e consentimento",
      "Biossegurança, esterilização e controle de infecção",
      "Atendimento a convênios e resposta a auditoria",
      "Orientação de equipe auxiliar (ASB e TSB)",
    ],
    atsKeywords: [
      "Cirurgião-Dentista",
      "Dentista",
      "CRO",
      "Odontologia",
      "Clínica Geral",
      "Endodontia",
      "Dentística",
      "Periodontia",
      "Odontopediatria",
      "Exodontia",
      "Prótese",
      "Ortodontia",
      "Urgência Odontológica",
      "Plano de Tratamento",
      "Biossegurança",
      "Esterilização",
      "Convênio Odontológico",
      "Auditoria",
      "Odontograma",
      "Atenção Primária",
    ],
    salaryNote:
      "No Brasil (2026), a remuneração do cirurgião-dentista varia muito conforme o modelo de trabalho. Em clínicas e redes, é comum o pagamento por produção (percentual sobre os procedimentos realizados), com rendimentos que costumam ficar entre R$ 4.000 e R$ 12.000 mensais dependendo do volume, da especialidade e do ticket médio dos procedimentos. Em serviço público e em vínculos CLT com carga horária definida, as faixas costumam ser mais estáveis e previsíveis. Especialidades como implantodontia, ortodontia e endodontia tendem a apresentar remuneração acima da clínica geral.",
    dos: [
      "Coloque o CRO com a sigla do estado logo abaixo do nome — é o primeiro item verificado.",
      "Liste as especializações com a instituição e o período, e separe-as de cursos de atualização.",
      "Descreva os procedimentos que você executa com autonomia, agrupados por área.",
      "Traga produção clínica: atendimentos por mês, taxa de aceitação de plano, índice de retorno.",
      "Mencione experiência com convênios e aprovação em auditoria, que é muito valorizada por clínicas.",
      "Informe a disponibilidade de agenda: dias, turnos e possibilidade de atendimento de urgência.",
    ],
    donts: [
      "Não liste apenas cursos e congressos sem nenhuma informação sobre produção clínica.",
      "Não omita o CRO nem o estado de registro.",
      "Não descreva procedimentos que você não executa com autonomia — isso aparece já no período de adaptação.",
      "Não use currículo com layout artístico; clínicas e redes usam triagem administrativa padrão.",
      "Não deixe de citar biossegurança e documentação clínica, que são critérios de auditoria.",
      "Não inclua informações que identifiquem pacientes, mesmo em descrições de casos.",
    ],
    faqs: [
      {
        question: "O que colocar no currículo de dentista?",
        answer:
          "Comece pelo essencial administrativo: nome com a titulação, CRO com a sigla do estado, contato e cidade. Em seguida, um resumo de três a quatro linhas com anos de atuação, especialidades e volume médio de atendimentos. Na formação, separe graduação, especializações (com instituição e período) e cursos de atualização. Na experiência, descreva cada vínculo com o tipo de serviço (clínica privada, rede, convênio, serviço público), os procedimentos executados e, principalmente, indicadores de produção: atendimentos por mês, taxa de aceitação de plano de tratamento, índice de retorno por intercorrência. Encerre com biossegurança, documentação clínica e disponibilidade de agenda.",
      },
      {
        question: "Como mostrar produção clínica no currículo?",
        answer:
          "Use métricas que as clínicas acompanham: número médio de atendimentos por mês ou por turno, taxa de aceitação do plano de tratamento apresentado, faturamento gerado ou ticket médio quando você tiver esse dado, índice de retorno por intercorrência e taxa de comparecimento dos seus pacientes. Um exemplo forte: 'Média de 180 atendimentos mensais, com taxa de aceitação de plano de tratamento acima de 70%.' Esses números respondem à pergunta que todo gestor de clínica faz — se o profissional produz e retém pacientes. É informação que quase nenhum currículo odontológico traz, e por isso diferencia com facilidade.",
      },
      {
        question: "Vale a pena listar todos os cursos que fiz?",
        answer:
          "Não. Separe o que é formação estruturada do que é atualização pontual. Especializações, mestrado e doutorado merecem destaque com instituição e período. Cursos de atualização relevantes e recentes, ligados ao que você realmente pratica, entram em uma seção própria — de preferência os cinco a oito mais importantes. Congressos assistidos, cursos de poucas horas e certificados antigos poluem o documento e diluem o que importa. A regra prática: se o curso não sustenta um procedimento que você executa hoje, ele provavelmente não precisa estar no currículo. Um documento enxuto e coerente transmite mais domínio do que uma lista extensa.",
      },
      {
        question: "Como fazer currículo de dentista recém-formado?",
        answer:
          "Compense a ausência de tempo de clínica com evidência de prática. Descreva o estágio supervisionado e as clínicas da graduação como experiência real: procedimentos executados, número aproximado de atendimentos, tipos de caso conduzidos. Inclua projetos de extensão, ligas acadêmicas, iniciação científica e trabalhos de conclusão com tema clínico. Destaque cursos práticos e de urgência, que sinalizam autonomia. E deixe explícita a disponibilidade de agenda, inclusive para turnos noturnos e finais de semana, que é onde clínicas costumam ter mais dificuldade de cobertura — para o recém-formado, é a porta de entrada mais rápida para ganhar volume clínico.",
      },
      {
        question: "Devo colocar experiência com convênios no currículo?",
        answer:
          "Sim, e com destaque, porque é um diferencial concreto para clínicas e redes. Atender convênio exige conhecer as tabelas, os prazos e os fluxos de autorização, e sobretudo manter a documentação clínica em conformidade — anamnese completa, odontograma, evolução, radiografias e termos de consentimento —, porque glosas e problemas de auditoria custam caro à clínica. Escreva algo como: 'Mantenho documentação clínica completa, com aprovação em todas as auditorias de convênio do período.' Isso comunica que você reduz risco financeiro para o contratante, que é exatamente o que o gestor da clínica precisa saber.",
      },
      {
        question: "Especialização vale mais que experiência para dentista?",
        answer:
          "Elas resolvem coisas diferentes. A especialização abre acesso a procedimentos de maior valor agregado, amplia o leque de vagas e costuma elevar a remuneração por procedimento — é o que muda o patamar da carreira. A experiência clínica sustenta autonomia, velocidade, manejo de intercorrências e relacionamento com o paciente, que é o que gera produção e retenção. Na prática, clínicas contratam olhando os dois: querem alguém que domine a técnica e que produza com segurança. Por isso o currículo ideal traz formação e indicadores lado a lado, em vez de apostar apenas na lista de títulos.",
      },
    ],
  },
  {
    slug: "tecnico-em-radiologia",
    profession: "Técnico em Radiologia",
    metaTitle: "Modelo de Currículo para Técnico em Radiologia (Exemplo 2026)",
    h1: "Modelo de Currículo para Técnico em Radiologia",
    metaDescription:
      "Modelo de currículo para técnico em radiologia: CRTR, modalidades, proteção radiológica, PACS, exemplo pronto, palavras-chave de ATS e faixa salarial.",
    intro:
      "Na radiologia, a triagem começa por dois itens objetivos: registro profissional ativo e as modalidades que você opera. Radiologia convencional, tomografia, ressonância, mamografia, densitometria e hemodinâmica exigem competências distintas, e cada serviço procura uma combinação específica. Currículos que apenas dizem 'técnico em radiologia com experiência hospitalar' obrigam o recrutador a adivinhar. Este modelo mostra como organizar modalidades, equipamentos, volume de exames e formação em proteção radiológica de forma que o seu perfil seja avaliado corretamente — e como demonstrar cuidado com o paciente e com a dose, que é o que diferencia o profissional maduro.",
    sampleResume: {
      name: "Leandro Pacheco Vieira",
      headline: "Técnico em Radiologia | CRTR ativo | Convencional, Tomografia e Mamografia | Proteção Radiológica",
      summary:
        "Técnico em radiologia com 7 anos de experiência em hospital de médio porte e clínica de diagnóstico por imagem, atuando em radiologia convencional, tomografia computadorizada e mamografia. Média de 55 exames por plantão, com baixo índice de repetição por erro de técnica. Domínio de PACS e RIS, protocolos de proteção radiológica e posicionamento conforme rotina de cada exame.",
      experience: [
        {
          role: "Técnico em Radiologia",
          company: "Hospital Municipal Santa Rita (240 leitos)",
          period: "Ago 2021 - Atual",
          bullets: [
            "Realizo média de 55 exames por plantão em radiologia convencional e tomografia computadorizada, incluindo atendimento de urgência e emergência",
            "Mantenho índice de repetição por erro de técnica abaixo de 3%, contra média histórica de 8% do serviço",
            "Executo exames em pacientes politraumatizados e acamados, com adaptação de posicionamento e uso de aparelho portátil no leito e no centro cirúrgico",
            "Aplico o princípio de otimização de dose, ajustando parâmetros por biotipo e por indicação clínica, com uso correto de proteção para paciente e acompanhante",
            "Opero sistemas PACS e RIS, com envio, identificação e conferência de imagens para o laudo do médico radiologista",
            "Realizo o controle diário de qualidade dos equipamentos e reporto não conformidades à engenharia clínica",
            "Uso dosímetro individual conforme protocolo do serviço e participo dos treinamentos periódicos de proteção radiológica",
          ],
        },
        {
          role: "Técnico em Radiologia",
          company: "Clínica de Diagnóstico por Imagem Imagem Vida",
          period: "Fev 2019 - Jul 2021",
          bullets: [
            "Atuei em radiologia convencional, mamografia e densitometria óssea em rotina ambulatorial",
            "Realizei o acolhimento e o preparo das pacientes para mamografia, com atenção ao conforto e à qualidade do posicionamento",
            "Conferi pedidos médicos, dados cadastrais e preparo prévio dos pacientes antes da realização dos exames",
            "Apoiei a organização da agenda de exames e o fluxo de atendimento para reduzir o tempo de espera",
          ],
        },
      ],
      education: [
        {
          degree: "Técnico em Radiologia — registro profissional ativo",
          institution: "Escola Técnica de Saúde",
          period: "2017 - 2018",
        },
        {
          degree: "Curso de Proteção Radiológica e Radioproteção Aplicada",
          institution: "Curso de atualização",
          period: "2024",
        },
        {
          degree: "Ensino Médio Completo",
          institution: "EE Almirante Barroso",
          period: "Concluído em 2016",
        },
      ],
      skills: [
        "Radiologia convencional e digital",
        "Tomografia computadorizada",
        "Mamografia e densitometria óssea",
        "Posicionamento radiológico",
        "Otimização de dose e proteção radiológica",
        "Sistemas PACS e RIS",
        "Exames no leito e em centro cirúrgico",
        "Controle de qualidade de equipamento",
      ],
    },
    keySkills: [
      "Radiologia convencional, digital e computadorizada",
      "Tomografia computadorizada e protocolos por região",
      "Mamografia, densitometria e exames especializados",
      "Posicionamento radiológico e adaptação para pacientes críticos",
      "Proteção radiológica e otimização de dose",
      "Operação de PACS, RIS e envio de imagens para laudo",
      "Exames portáteis no leito, UTI e centro cirúrgico",
      "Controle de qualidade e conferência diária de equipamentos",
      "Acolhimento, orientação e preparo do paciente",
      "Registro de exames e conferência de pedido médico",
    ],
    atsKeywords: [
      "Técnico em Radiologia",
      "Técnico em Radiologia Médica",
      "CRTR",
      "Radiologia Convencional",
      "Radiologia Digital",
      "Tomografia Computadorizada",
      "Ressonância Magnética",
      "Mamografia",
      "Densitometria Óssea",
      "Hemodinâmica",
      "Posicionamento Radiológico",
      "Proteção Radiológica",
      "Radioproteção",
      "Dosimetria",
      "PACS",
      "RIS",
      "Raio-X Portátil",
      "Centro Cirúrgico",
      "Diagnóstico por Imagem",
      "Plantão 12x36",
    ],
    salaryNote:
      "No Brasil (2026), o técnico em radiologia costuma receber entre R$ 2.500 e R$ 4.500, considerando a jornada especial prevista para a categoria e os adicionais aplicáveis, como insalubridade ou periculosidade conforme a atividade e o serviço. Profissionais que operam ressonância, tomografia e hemodinâmica, além de quem atua em plantões noturnos e em hospitais de grande porte, tendem a ficar no topo da faixa. A legislação específica da profissão estabelece parâmetros próprios de jornada e piso — confirme as condições vigentes com o conselho e o sindicato da categoria.",
    dos: [
      "Coloque o registro profissional ativo logo abaixo do nome, com a sigla do conselho regional.",
      "Liste todas as modalidades que você opera: convencional, tomografia, ressonância, mamografia, densitometria, hemodinâmica.",
      "Informe volume: exames por plantão ou por mês, e o porte do serviço (leitos, exames/dia).",
      "Destaque o índice de repetição por erro de técnica: é o indicador de qualidade mais objetivo da função.",
      "Cite proteção radiológica, uso de dosímetro e otimização de dose — demonstra maturidade profissional.",
      "Mencione domínio de PACS e RIS, e experiência com exames portáteis em leito e centro cirúrgico.",
    ],
    donts: [
      "Não omita as modalidades: é o principal filtro técnico da triagem.",
      "Não deixe de citar o registro profissional e a validade.",
      "Não descreva apenas 'realizei exames' sem volume, modalidade e tipo de serviço.",
      "Não invente experiência em ressonância ou hemodinâmica — o teste prático aparece rápido.",
      "Não ignore o tema proteção radiológica; sua ausência no currículo chama atenção negativa.",
      "Não deixe de informar disponibilidade para plantão noturno e escala 12x36.",
    ],
    faqs: [
      {
        question: "Quais modalidades devo listar no currículo de técnico em radiologia?",
        answer:
          "Todas as que você opera com autonomia, começando pelas mais requisitadas: radiologia convencional e digital, tomografia computadorizada, ressonância magnética, mamografia, densitometria óssea, hemodinâmica e arco cirúrgico. Para cada uma, vale informar o tempo de atuação e o volume aproximado. Coloque essa informação já no título do currículo, algo como 'Técnico em Radiologia | Convencional, Tomografia e Mamografia'. Essa é a informação que mais influencia a triagem, porque os serviços contratam para modalidades específicas — e um currículo genérico acaba sendo descartado mesmo quando o profissional tem exatamente o perfil procurado.",
      },
      {
        question: "Como mostrar qualidade técnica no currículo?",
        answer:
          "O indicador mais objetivo é o índice de repetição de exames por erro de técnica: quanto menor, melhor o posicionamento e o ajuste de parâmetros, e menor a dose desnecessária ao paciente. Um bullet forte é: 'Mantenho índice de repetição por erro de técnica abaixo de 3%, contra média histórica de 8% do serviço.' Complemente com volume por plantão, tipos de paciente atendidos (politraumatizados, acamados, pediátricos), participação no controle diário de qualidade dos equipamentos e adesão aos protocolos de otimização de dose. Esse conjunto comunica competência técnica de forma verificável, muito além de uma lista de modalidades.",
      },
      {
        question: "Proteção radiológica precisa estar no currículo?",
        answer:
          "Precisa, e a ausência chama atenção negativa. A radioproteção é o eixo ético e técnico da profissão, e serviços sérios avaliam se o profissional demonstra domínio do tema. Registre no currículo: cursos e atualizações em proteção radiológica com o ano, uso disciplinado de dosímetro individual conforme protocolo, aplicação de vestimentas de proteção para paciente e acompanhante, ajuste de parâmetros por biotipo e indicação clínica para otimização de dose, e participação nos treinamentos periódicos do serviço. Além de ser exigência regulatória, isso demonstra que você entende que cada exame envolve uma decisão sobre dose.",
      },
      {
        question: "Como fazer currículo de técnico em radiologia recém-formado?",
        answer:
          "Destaque no topo o registro profissional e a formação técnica, com a instituição e o período. Em seguida, transforme o estágio supervisionado em experiência descrita: em qual serviço, por quantas horas, em quais modalidades, com que volume aproximado de exames acompanhados e executados sob supervisão, e quais tipos de paciente. Liste cursos de proteção radiológica e de posicionamento, que sinalizam preparo. E deixe explícita a disponibilidade para plantões noturnos, escala 12x36 e finais de semana — é onde os serviços têm mais dificuldade de cobertura e onde o recém-formado costuma conseguir a primeira oportunidade e ganhar volume rapidamente.",
      },
      {
        question: "Vale a pena se especializar em ressonância ou tomografia?",
        answer:
          "Vale, e é o caminho mais direto para faixas salariais melhores. Ressonância magnética, tomografia, hemodinâmica e medicina nuclear exigem conhecimento técnico adicional, envolvem equipamentos de alto custo e têm oferta menor de profissionais experientes — o que se reflete na remuneração e na estabilidade da vaga. A ressonância, em particular, tem especificidades importantes de segurança relacionadas ao campo magnético, e serviços valorizam quem domina os protocolos. No currículo, informe não apenas que opera a modalidade, mas os protocolos e regiões que executa e o volume mensal, porque é isso que demonstra experiência real e não apenas contato eventual.",
      },
      {
        question: "Como é a jornada de trabalho do técnico em radiologia?",
        answer:
          "A profissão tem legislação específica que estabelece parâmetros próprios de jornada e de piso salarial para a categoria, distintos da regra geral. Na prática, é comum a organização em plantões, incluindo escalas como 12x36 e turnos noturnos, principalmente em hospitais e serviços de urgência. Clínicas de diagnóstico costumam ter rotina mais previsível, em horário comercial. Como as condições variam e a legislação pode ser atualizada, confirme sempre a jornada praticada, os adicionais aplicáveis e o enquadramento com o conselho regional e o sindicato da categoria antes de aceitar a vaga. No currículo, informe sua disponibilidade de escala com clareza.",
      },
    ],
  },
];
