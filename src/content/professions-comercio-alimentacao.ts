import type { Profession } from "./types";

// Profissões de comércio, varejo, alimentação e hotelaria.
// As faixas em `salaryNote` são referências de mercado e variam por região,
// porte da empresa e convenção coletiva — mantenha o texto sempre com essa ressalva.
export const PROFESSIONS_COMERCIO_ALIMENTACAO: Profession[] = [
  {
    slug: "repositor",
    profession: "Repositor",
    metaTitle: "Modelo de Currículo para Repositor de Supermercado (2026)",
    h1: "Modelo de Currículo para Repositor",
    metaDescription:
      "Modelo de currículo para repositor de supermercado com exemplo pronto: reposição, validade, PEPS, ruptura de gôndola, palavras-chave de ATS e faixa salarial.",
    intro:
      "Repositor é uma das portas de entrada mais acessíveis do varejo — e justamente por isso a concorrência por vaga é alta, com muitos currículos praticamente idênticos. O que diferencia é mostrar que você entende a lógica do trabalho: ruptura de gôndola, controle de validade, PEPS, organização de planograma e reposição no ritmo do fluxo de clientes. Quem escreve apenas 'repunha mercadorias nas prateleiras' passa despercebido; quem cita seção, volume e controle de perdas é chamado. Este modelo mostra como estruturar o currículo em uma página, com exemplo pronto e as palavras que a triagem procura.",
    sampleResume: {
      name: "Bruno Cardoso Martins",
      headline: "Repositor | Mercearia, Perecíveis e Controle de Validade | Disponibilidade de turnos",
      summary:
        "Repositor com 4 anos de experiência em supermercado de médio porte, atuando em mercearia seca, bebidas e perecíveis. Rotina de reposição por planograma, controle de validade pelo método PEPS, conferência de recebimento e redução de ruptura de gôndola. Disponibilidade para escala 6x1, turnos e finais de semana.",
      experience: [
        {
          role: "Repositor de Mercearia e Perecíveis",
          company: "Supermercado Rede Central",
          period: "Fev 2023 - Atual",
          bullets: [
            "Reponho as seções de mercearia seca, bebidas e laticínios, com média de 90 caixas por turno e reposição concluída antes do pico de movimento",
            "Reduzi a ruptura de gôndola da minha seção de 9% para menos de 3% ao criar rotina de conferência antes da abertura da loja",
            "Aplico o método PEPS na reposição, garantindo saída dos produtos com validade mais próxima e reduzindo perdas por vencimento",
            "Confiro validade diariamente nas seções sob minha responsabilidade e sinalizo produtos próximos ao vencimento para a liderança",
            "Organizo a gôndola conforme o planograma da loja, com frenteamento, precificação correta e reposição de etiquetas",
            "Auxilio no recebimento e conferência de mercadoria, verificando quantidade, avaria e data de validade na entrada",
          ],
        },
        {
          role: "Auxiliar de Loja",
          company: "Mercado Boa Compra",
          period: "Jun 2021 - Jan 2023",
          bullets: [
            "Atuei na reposição geral, organização de estoque e apoio ao setor de hortifrúti",
            "Realizei a arrumação e limpeza das gôndolas e do depósito, mantendo o padrão de organização exigido pela loja",
            "Atendi clientes na área de vendas, orientando sobre localização de produtos e chamando o setor responsável quando necessário",
            "Apoiei o inventário mensal com contagem física de itens por seção",
          ],
        },
      ],
      education: [
        {
          degree: "Ensino Médio Completo",
          institution: "EE Vila São José",
          period: "Concluído em 2021",
        },
        {
          degree: "Curso de Boas Práticas de Manipulação de Alimentos",
          institution: "Curso livre",
          period: "2023",
        },
      ],
      skills: [
        "Reposição por planograma",
        "Controle de validade e método PEPS",
        "Redução de ruptura de gôndola",
        "Conferência de recebimento",
        "Frenteamento e precificação",
        "Organização de estoque e depósito",
        "Atendimento ao cliente na área de vendas",
        "Disponibilidade para turnos e escala 6x1",
      ],
    },
    keySkills: [
      "Reposição de mercadorias e organização de gôndola",
      "Controle de validade e aplicação do método PEPS",
      "Combate à ruptura de gôndola",
      "Leitura e execução de planograma",
      "Frenteamento, precificação e troca de etiquetas",
      "Conferência de recebimento e identificação de avarias",
      "Organização de estoque e depósito",
      "Noções de higiene e manipulação de alimentos",
      "Atendimento ao cliente na área de vendas",
      "Ritmo de trabalho, resistência física e pontualidade",
    ],
    atsKeywords: [
      "Repositor",
      "Repositor de Supermercado",
      "Reposição",
      "Gôndola",
      "Ruptura",
      "Planograma",
      "PEPS",
      "Controle de Validade",
      "Frenteamento",
      "Precificação",
      "Estoque",
      "Recebimento de Mercadoria",
      "Mercearia",
      "Perecíveis",
      "Hortifrúti",
      "Inventário",
      "Varejo",
      "Atendimento ao Cliente",
      "Escala 6x1",
      "Boas Práticas",
    ],
    salaryNote:
      "No Brasil (2026), o repositor costuma receber entre R$ 1.600 e R$ 2.300, com adicional noturno para turnos de madrugada e, em algumas redes, vale-refeição e cesta básica. Grandes redes de supermercado e atacarejos tendem a pagar acima do comércio de bairro, e repositores especializados em perecíveis, açougue e hortifrúti costumam ficar no topo da faixa. O piso é definido pela convenção coletiva do sindicato dos comerciários da região.",
    dos: [
      "Diga em quais seções você atuou: mercearia, perecíveis, bebidas, hortifrúti, frios, limpeza.",
      "Use números: caixas repostas por turno, percentual de ruptura, redução de perdas por validade.",
      "Cite os termos técnicos do varejo — PEPS, ruptura, planograma, frenteamento — que aparecem na triagem.",
      "Informe disponibilidade de turno e escala logo abaixo do contato: turnos de madrugada são comuns.",
      "Mencione experiência com recebimento e conferência de mercadoria, que abre caminho para o estoque.",
      "Se tem curso de boas práticas ou manipulação de alimentos, destaque — é diferencial em perecíveis.",
    ],
    donts: [
      "Não escreva apenas 'repunha produtos nas prateleiras' — é o que todo currículo da vaga diz.",
      "Não omita a disponibilidade de horário, principalmente para finais de semana e feriados.",
      "Não deixe de citar o porte da loja (supermercado, atacarejo, mercado de bairro): a rotina muda bastante.",
      "Não use currículo com foto e enfeites; redes maiores usam triagem automática.",
      "Não liste apenas 'sou esforçado e proativo' como qualidades, sem nenhum exemplo prático.",
      "Não deixe lacunas de tempo sem explicação, mesmo entre contratos temporários de fim de ano.",
    ],
    faqs: [
      {
        question: "O que faz um repositor de supermercado?",
        answer:
          "O repositor mantém as gôndolas abastecidas, organizadas e com preço correto. Na prática, isso envolve retirar mercadoria do depósito, repor conforme o planograma da loja, fazer o frenteamento (deixar os produtos alinhados na frente da prateleira), conferir e trocar etiquetas de preço, controlar validade aplicando o método PEPS — primeiro que entra, primeiro que sai — e sinalizar produtos próximos do vencimento. Também é comum auxiliar no recebimento de mercadoria, verificando quantidade e avarias, apoiar inventários e atender clientes que perguntam pela localização de produtos. O principal indicador do trabalho é a ruptura: gôndola vazia significa venda perdida.",
      },
      {
        question: "Como fazer currículo de repositor sem experiência?",
        answer:
          "Coloque em destaque o que o supermercado mais valoriza em quem está começando: ensino médio (completo ou cursando), disponibilidade total de horários incluindo finais de semana e feriados, e residência próxima à loja. Use a seção de experiência para qualquer trabalho anterior, mesmo informal, focando em pontualidade, ritmo e trabalho em equipe. Se você fez algum curso de atendimento, boas práticas de manipulação de alimentos ou informática básica, liste. E adicione uma linha mostrando que você entende a função: mencionar que conhece a lógica de validade, organização de gôndola e atendimento ao cliente já coloca o seu currículo à frente da maioria.",
      },
      {
        question: "O que é ruptura de gôndola e por que citar no currículo?",
        answer:
          "Ruptura é quando o produto está disponível no estoque ou deveria estar, mas a gôndola está vazia — ou seja, é venda perdida com cliente na loja. É o indicador que mais preocupa o gerente de uma seção, e por isso mencioná-lo mostra que você entende o que realmente importa na função. Um bullet forte seria: 'Reduzi a ruptura da minha seção de 9% para menos de 3% ao criar rotina de conferência antes da abertura da loja.' Mesmo sem número exato, você pode descrever a prática: conferência de gôndola antes do pico de movimento, comunicação rápida ao encarregado quando um item acaba, atenção a produtos de alto giro.",
      },
      {
        question: "Repositor precisa ter curso de manipulação de alimentos?",
        answer:
          "Não é obrigatório para todas as seções, mas é um diferencial importante e às vezes um requisito quando a vaga envolve perecíveis, frios, hortifrúti ou padaria. O curso de boas práticas de manipulação de alimentos é curto, de baixo custo e demonstra que você conhece higiene, controle de temperatura e cuidados com contaminação cruzada — temas que aparecem em fiscalizações sanitárias e que preocupam a loja. No currículo, liste em uma seção de cursos com a instituição e o ano. Para quem está entrando no varejo alimentar, é provavelmente o curso com melhor relação entre custo e impacto na triagem.",
      },
      {
        question: "É comum trabalhar de madrugada como repositor?",
        answer:
          "Sim, e essa é uma informação decisiva para a triagem. Muitas redes fazem a reposição principal fora do horário de pico ou durante a madrugada, para não atrapalhar o fluxo de clientes e para ter a loja abastecida na abertura. Turnos noturnos costumam vir com adicional noturno na remuneração. Por isso, deixe a sua disponibilidade explícita logo abaixo do contato — 'Disponibilidade: turnos, madrugada, finais de semana e feriados' — e repita no resumo. Se você tem restrição de horário, seja honesto e específico: descobrir a incompatibilidade depois da contratação gera desligamento rápido.",
      },
      {
        question: "Como crescer na carreira a partir de repositor?",
        answer:
          "O caminho mais comum dentro do varejo passa por três degraus: repositor, líder ou encarregado de seção e, depois, chefe de setor ou gerente de loja. Para acelerar, três coisas ajudam. Primeira, dominar mais de uma seção, principalmente perecíveis e hortifrúti, que exigem mais técnica. Segunda, aprender a parte de estoque e recebimento — conferência fiscal, controle de validade, inventário —, que aproxima você da gestão de mercadoria. Terceira, mostrar iniciativa em indicadores: ruptura, perdas e organização. No currículo, registre sempre que tiver orientado colegas ou respondido pela seção na ausência do encarregado; é essa evidência que sustenta a promoção.",
      },
    ],
  },
  {
    slug: "promotor-de-vendas",
    profession: "Promotor de Vendas",
    metaTitle: "Modelo de Currículo para Promotor de Vendas (Exemplo 2026)",
    h1: "Modelo de Currículo para Promotor de Vendas",
    metaDescription:
      "Modelo de currículo para promotor de vendas: roteiro de lojas, sell-out, ponto extra, trade marketing, exemplo pronto, palavras-chave de ATS e salário.",
    intro:
      "O promotor de vendas é o profissional que garante que a marca esteja bem posicionada no ponto de venda — e quem contrata avalia exatamente isso: roteiro de lojas atendidas, resultado de sell-out, conquista de ponto extra e relacionamento com o gerente do PDV. Currículos que apenas dizem 'trabalhei como promotor' não comunicam nada; os que informam número de lojas, marcas representadas e crescimento de vendas na área são chamados. Este modelo mostra como traduzir o dia a dia do PDV em linguagem de resultado, com exemplo pronto para adaptar tanto para promotor de supermercado quanto para trade marketing.",
    sampleResume: {
      name: "Camila Rocha Nascimento",
      headline: "Promotora de Vendas | Roteiro de 18 PDVs | Sell-out, Ponto Extra e Trade Marketing",
      summary:
        "Promotora de vendas com 5 anos de experiência em bens de consumo, atendendo roteiros de até 18 pontos de venda entre supermercados e atacarejos. Atuação em execução de planograma, negociação de ponto extra, controle de validade e abastecimento, com histórico de crescimento de sell-out e ampliação de espaço em gôndola. CNH B e veículo próprio.",
      experience: [
        {
          role: "Promotora de Vendas",
          company: "Distribuidora Nacional de Alimentos",
          period: "Ago 2022 - Atual",
          bullets: [
            "Atendo roteiro fixo de 18 PDVs (supermercados e atacarejos), com visita programada e registro de execução em aplicativo",
            "Aumentei o sell-out da minha carteira em 22% em 12 meses, com foco em disponibilidade, exposição e ponto extra",
            "Negocio ponto extra e ilhas promocionais diretamente com gerentes e encarregados de seção, conquistando em média 6 ativações por mês",
            "Executo planograma da marca, garantindo participação de gôndola (share of shelf) e frenteamento correto",
            "Monitoro preço praticado e ações da concorrência, reportando ao supervisor com foto e registro no aplicativo",
            "Controlo validade e faço a gestão de trocas e avarias junto ao PDV, reduzindo perdas de produto da marca",
          ],
        },
        {
          role: "Promotora de Merchandising",
          company: "Agência de Trade Marketing Conecta",
          period: "Mar 2020 - Jul 2022",
          bullets: [
            "Atendi PDVs de diferentes clientes em roteiro rotativo, com execução de material de ponto de venda e montagem de displays",
            "Realizei ações promocionais e degustação em loja, com apuração de resultado por período de campanha",
            "Fiz o reporte diário de execução com fotos, ruptura e presença da concorrência",
            "Treinei repositores da loja sobre a exposição correta dos produtos das marcas atendidas",
          ],
        },
      ],
      education: [
        {
          degree: "Tecnólogo em Gestão Comercial (cursando)",
          institution: "Faculdade de Tecnologia",
          period: "2024 - 2026",
        },
        {
          degree: "Ensino Médio Completo",
          institution: "EE Padre Anchieta",
          period: "Concluído em 2019",
        },
      ],
      skills: [
        "Execução de planograma e share of shelf",
        "Negociação de ponto extra",
        "Análise de sell-out e ruptura",
        "Monitoramento de preço e concorrência",
        "Aplicativos de execução de PDV",
        "Gestão de trocas, avarias e validade",
        "Relacionamento com gerentes de loja",
        "CNH B e veículo próprio",
      ],
    },
    keySkills: [
      "Execução de planograma e participação de gôndola",
      "Negociação de ponto extra e espaços promocionais",
      "Acompanhamento de sell-out e combate à ruptura",
      "Monitoramento de preço e ações da concorrência",
      "Uso de aplicativos de registro e execução de PDV",
      "Controle de validade, trocas e avarias",
      "Montagem de display e material de merchandising",
      "Relacionamento com encarregados e gerentes de loja",
      "Organização de roteiro e cumprimento de agenda de visitas",
      "Comunicação, negociação e postura comercial",
    ],
    atsKeywords: [
      "Promotor de Vendas",
      "Promotora de Vendas",
      "Merchandising",
      "Trade Marketing",
      "PDV",
      "Ponto de Venda",
      "Planograma",
      "Sell-out",
      "Sell-in",
      "Ruptura",
      "Ponto Extra",
      "Share of Shelf",
      "Roteiro de Visitas",
      "Display",
      "Degustação",
      "Bens de Consumo",
      "Supermercado",
      "Atacarejo",
      "Negociação",
      "CNH B",
    ],
    salaryNote:
      "No Brasil (2026), o promotor de vendas costuma receber entre R$ 1.800 e R$ 3.000 de salário fixo, frequentemente acrescido de comissão ou premiação por meta, ajuda de custo para combustível quando usa veículo próprio e vale-refeição. Promotores exclusivos de indústrias e profissionais de trade marketing com roteiro de PDVs maiores ou de canal alimentar de grande porte tendem a ficar no topo da faixa. Confira também o piso da convenção coletiva da categoria na sua região.",
    dos: [
      "Informe o número de PDVs do seu roteiro e o canal atendido (supermercado, atacarejo, farmácia, conveniência).",
      "Cite resultados de sell-out, ruptura, ponto extra conquistado e share de gôndola com percentuais.",
      "Diga quais marcas ou categorias você representou — a experiência na mesma categoria pesa muito.",
      "Destaque negociação com gerentes e encarregados: é a competência que mais diferencia o promotor.",
      "Mencione CNH e veículo próprio logo abaixo do contato, porque é requisito frequente.",
      "Cite os aplicativos de execução e registro de PDV que você utilizou.",
    ],
    donts: [
      "Não escreva apenas 'organizei produtos na loja': isso descreve repositor, não promotor.",
      "Não omita o tamanho do roteiro: sem essa informação, o recrutador não dimensiona sua experiência.",
      "Não deixe de citar resultados comerciais — o promotor é avaliado por venda, não só por execução.",
      "Não esconda a disponibilidade para viagem ou deslocamento entre cidades, quando existir.",
      "Não use currículo genérico para vagas de trade marketing: o vocabulário é mais técnico.",
      "Não liste 'boa comunicação' sem exemplo; mostre uma negociação concreta que você conduziu.",
    ],
    faqs: [
      {
        question: "Qual a diferença entre promotor de vendas e repositor?",
        answer:
          "O repositor é contratado pela loja e cuida da gôndola de forma geral, independentemente da marca. O promotor de vendas representa uma indústria ou distribuidor e é responsável pela performance das marcas dela dentro do ponto de venda: garantir disponibilidade, executar o planograma, conquistar espaço adicional, negociar ponto extra, monitorar preço e concorrência e acompanhar o sell-out. É uma função comercial, com metas e relacionamento ativo com o gerente da loja. Essa diferença deve ficar clara no currículo — quem descreve a função de promotor com verbos de reposição acaba sendo lido como repositor e perde vagas melhor remuneradas.",
      },
      {
        question: "O que é sell-out e como usar no currículo?",
        answer:
          "Sell-out é a venda do produto para o consumidor final, ou seja, o que efetivamente sai da gôndola — diferente do sell-in, que é a venda da indústria para o varejo. É o indicador mais importante para o promotor, porque mede se o trabalho no PDV está gerando venda. No currículo, use com número e período: 'Aumentei o sell-out da minha carteira em 22% em 12 meses, com foco em disponibilidade, exposição e ponto extra.' Se você não tem acesso ao dado exato, use proxies: crescimento do pedido da loja, ampliação de espaço em gôndola, número de ativações promocionais conquistadas ou redução de ruptura da sua carteira.",
      },
      {
        question: "Preciso ter carro para trabalhar como promotor de vendas?",
        answer:
          "Depende do modelo. Promotores de roteiro fixo em uma única loja grande normalmente não precisam. Já quem atende roteiro com várias lojas, especialmente em cidades diferentes ou em regiões extensas, costuma precisar de veículo próprio — moto ou carro — com ajuda de custo para combustível. Por isso, informe logo abaixo do contato: 'CNH B — veículo próprio' ou a categoria que você tiver. Se não tem veículo, foque em vagas de promotor exclusivo de loja ou em canais com roteiro concentrado, e deixe claro que tem disponibilidade para deslocamento por transporte público dentro da região.",
      },
      {
        question: "Como fazer currículo de promotor sem experiência na função?",
        answer:
          "Aproveite qualquer experiência de varejo, atendimento ou vendas e traduza para o vocabulário do PDV. Se você foi repositor, destaque tudo o que fez de execução: planograma, frenteamento, controle de validade, combate à ruptura, relacionamento com encarregado. Se veio de vendas, destaque negociação e cumprimento de meta. Some a isso disponibilidade de horário, CNH e veículo se tiver, e um curso de trade marketing ou merchandising, que é curto e sinaliza interesse real na área. E use o resumo profissional para nomear o objetivo com clareza, mostrando que você entende que a função é comercial e não apenas operacional.",
      },
      {
        question: "O que é ponto extra e por que é importante para o promotor?",
        answer:
          "Ponto extra é qualquer exposição do produto fora da gôndola habitual: ilha promocional, ponta de gôndola, cesta na frente do caixa, display no corredor. Ele aumenta significativamente a venda porque coloca o produto no caminho do cliente em um momento de decisão. Conquistar ponto extra depende de negociação direta com o gerente ou encarregado da loja, e por isso é uma das habilidades mais valorizadas do promotor — envolve relacionamento, argumentação com dados de venda e boa reputação no PDV. No currículo, quantifique: número de ativações conquistadas por mês, tipos de espaço negociados e o efeito na venda quando você tiver o dado.",
      },
      {
        question: "Como evoluir de promotor para outras funções comerciais?",
        answer:
          "As trilhas mais comuns são três: supervisor de promotores (gestão de equipe e roteiros), analista ou coordenador de trade marketing (planejamento de execução, campanhas e materiais) e vendedor ou representante comercial (negociação de pedido com o comprador da rede). Para acelerar, invista em três frentes: aprender a ler indicadores de venda e de execução, ganhar familiaridade com Excel e com os relatórios da operação, e assumir responsabilidades além do roteiro — treinar colegas novos, cobrir região, apoiar campanhas. Registre essas atividades no currículo com clareza, porque é exatamente essa evidência que sustenta a promoção na entrevista interna.",
      },
    ],
  },
  {
    slug: "balconista",
    profession: "Balconista",
    metaTitle: "Modelo de Currículo para Balconista (Farmácia e Loja) 2026",
    h1: "Modelo de Currículo para Balconista",
    metaDescription:
      "Modelo de currículo para balconista de farmácia, padaria e loja: atendimento, vendas, PDV, exemplo pronto, palavras-chave de ATS e faixa salarial.",
    intro:
      "Balconista é uma função de atendimento com meta de venda — e essa é a chave que a maioria dos currículos deixa de fora. Quem contrata, seja farmácia, padaria, autopeças ou loja de materiais, quer saber se você atende bem, se conhece o produto e se vende. Currículos que dizem apenas 'atendia os clientes no balcão' são indistinguíveis entre si; os que trazem ticket médio, itens por atendimento e conhecimento específico da categoria se destacam imediatamente. Este modelo mostra como montar esse currículo, com exemplo pronto e adaptações para farmácia, alimentação e comércio em geral.",
    sampleResume: {
      name: "Juliana Ferreira Alves",
      headline: "Balconista de Farmácia | Atendimento, Vendas e Medicamentos | Sistema de PDV",
      summary:
        "Balconista com 5 anos de experiência em farmácia e drogaria, com atendimento ao cliente, orientação sobre medicamentos isentos de prescrição, operação de PDV e cumprimento de metas de venda. Conhecimento de medicamentos genéricos e similares, controle de receitas e rotina de conferência de produtos controlados junto ao farmacêutico responsável.",
      experience: [
        {
          role: "Balconista de Farmácia",
          company: "Drogaria Saúde Total",
          period: "Jan 2022 - Atual",
          bullets: [
            "Atendo em média 80 clientes por turno, com ticket médio 18% acima da média da loja no último semestre",
            "Oriento sobre medicamentos isentos de prescrição, apresentando opções de genérico e similar conforme a necessidade e o orçamento do cliente",
            "Opero o sistema de PDV com emissão de cupom, aplicação de convênios e programas de desconto de laboratórios",
            "Realizo a conferência e o encaminhamento de receitas ao farmacêutico responsável, seguindo o procedimento para medicamentos controlados",
            "Cumpro metas de venda de perfumaria e produtos de conveniência, com destaque na loja em 4 dos últimos 6 meses",
            "Auxilio na reposição, controle de validade e organização das gôndolas de perfumaria e higiene",
          ],
        },
        {
          role: "Balconista",
          company: "Padaria e Confeitaria Estrela",
          period: "Ago 2020 - Dez 2021",
          bullets: [
            "Atendi o balcão de padaria e confeitaria, com montagem de pedidos, pesagem e embalagem de produtos",
            "Operei caixa e PDV, com fechamento de turno sem divergência de valores",
            "Realizei a reposição e organização da vitrine, seguindo padrão de exposição e controle de validade",
            "Segui as boas práticas de manipulação de alimentos, com uso de EPI e higienização conforme procedimento",
          ],
        },
      ],
      education: [
        {
          degree: "Curso de Balconista de Farmácia",
          institution: "SENAC",
          period: "2021",
        },
        {
          degree: "Ensino Médio Completo",
          institution: "EE Nossa Senhora Aparecida",
          period: "Concluído em 2019",
        },
      ],
      skills: [
        "Atendimento ao cliente e vendas no balcão",
        "Conhecimento de medicamentos genéricos e similares",
        "Operação de PDV e emissão de cupom",
        "Controle de receitas e medicamentos controlados",
        "Cumprimento de metas de venda",
        "Reposição e controle de validade",
        "Boas práticas de manipulação de alimentos",
        "Fechamento de caixa",
      ],
    },
    keySkills: [
      "Atendimento ao cliente com foco em venda",
      "Conhecimento técnico da categoria de produtos",
      "Operação de PDV e sistemas de venda",
      "Cumprimento de metas e venda adicional",
      "Organização de vitrine e exposição de produtos",
      "Controle de validade e reposição",
      "Fechamento de caixa e conferência de valores",
      "Resolução de reclamação e troca",
      "Trabalho em equipe e comunicação clara",
      "Disponibilidade para escala 6x1 e finais de semana",
    ],
    atsKeywords: [
      "Balconista",
      "Balconista de Farmácia",
      "Atendimento ao Cliente",
      "Vendas",
      "PDV",
      "Frente de Caixa",
      "Medicamentos",
      "Genéricos",
      "Similares",
      "Medicamentos Controlados",
      "Receituário",
      "Perfumaria",
      "Metas de Venda",
      "Ticket Médio",
      "Reposição",
      "Controle de Validade",
      "Fechamento de Caixa",
      "Padaria",
      "Comércio",
      "Escala 6x1",
    ],
    salaryNote:
      "No Brasil (2026), o balconista costuma receber entre R$ 1.700 e R$ 2.600 de salário fixo, frequentemente com comissão ou premiação por meta — especialmente em farmácias, onde a venda de perfumaria e produtos de laboratório costuma gerar remuneração variável relevante. Balconistas de autopeças, materiais de construção e produtos técnicos tendem a ficar acima da faixa por exigirem conhecimento especializado. O piso é definido pela convenção coletiva dos comerciários da região.",
    dos: [
      "Especifique o tipo de balcão: farmácia, padaria, autopeças, materiais de construção, açougue, frios.",
      "Traga números de venda: ticket médio, itens por atendimento, cumprimento de meta, clientes por turno.",
      "Cite o conhecimento técnico da categoria — é o que diferencia um balconista de um atendente genérico.",
      "Informe o sistema de PDV utilizado e experiência com fechamento de caixa.",
      "Mencione cursos específicos, como balconista de farmácia ou manipulação de alimentos.",
      "Deixe a disponibilidade de escala e finais de semana visível logo no topo.",
    ],
    donts: [
      "Não escreva apenas 'atendi clientes' — descreva o que você vendia e com que resultado.",
      "Não omita o conhecimento de produto: em farmácia e autopeças, é o principal critério.",
      "Não deixe de citar metas: balconista é função comercial, e ignorar isso enfraquece o currículo.",
      "Não invente conhecimento sobre medicamentos ou produtos técnicos — há teste na entrevista.",
      "Não use um currículo genérico para farmácia e para padaria: o vocabulário muda completamente.",
      "Não esqueça de mencionar experiência com caixa, que amplia bastante as vagas possíveis.",
    ],
    faqs: [
      {
        question: "Preciso de curso para ser balconista de farmácia?",
        answer:
          "Não é obrigatório por lei para o exercício da função de atendimento, mas o curso de balconista de farmácia é um diferencial expressivo na triagem e é pedido por boa parte das redes. Ele cobre noções de farmacologia básica, classes de medicamentos, genéricos e similares, atendimento e legislação sanitária aplicada ao balcão — conteúdo que aparece diretamente na entrevista e no dia a dia. Vale lembrar que dispensação de medicamentos e orientação farmacêutica são atribuições do farmacêutico responsável, e o balconista atua no atendimento comercial e no encaminhamento correto. Deixar claro no currículo que você conhece esse limite transmite responsabilidade profissional.",
      },
      {
        question: "Como colocar metas de venda no currículo de balconista?",
        answer:
          "Com números concretos e período definido. Exemplos: 'Ticket médio 18% acima da média da loja no último semestre', 'Cumprimento de meta de perfumaria em 10 dos 12 meses', 'Destaque de vendas da loja em 4 dos últimos 6 meses', 'Média de 80 atendimentos por turno'. Se você não tem o número exato, use o que consegue afirmar com honestidade — posição no ranking da loja, participação em campanha, prêmio recebido. Balconista é uma função comercial, e a maioria dos currículos ignora isso, descrevendo apenas atendimento. Trazer resultado de venda é o que coloca o seu documento em outra categoria na leitura do gerente.",
      },
      {
        question: "Qual a diferença entre balconista e atendente?",
        answer:
          "Na prática do varejo, o balconista atua atrás de um balcão com produtos que exigem intermediação e conhecimento técnico — farmácia, padaria, açougue, frios, autopeças, materiais de construção —, orientando o cliente sobre a escolha e frequentemente com meta de venda. O atendente é um termo mais amplo, que pode envolver recepção, autoatendimento assistido, caixa ou suporte na área de vendas, com menor exigência de conhecimento específico do produto. No currículo, use o termo que aparece nas vagas que você busca e descreva as atividades com precisão: o que decide não é o rótulo, e sim a demonstração de que você domina a categoria e sabe vender.",
      },
      {
        question: "Como fazer currículo de balconista sem experiência?",
        answer:
          "Priorize três coisas no topo: ensino médio, disponibilidade para escala 6x1 e finais de semana, e algum curso ligado à categoria que você quer atender (balconista de farmácia, manipulação de alimentos, atendimento e vendas). Em seguida, use qualquer experiência anterior para demonstrar contato com público, responsabilidade com dinheiro e ritmo de trabalho — inclusive trabalhos informais. Se você já operou caixa ou lidou com clientes em qualquer contexto, destaque, porque reduz o tempo de treinamento. E escreva um resumo curto mostrando que você entende que a função combina atendimento com venda; essa clareza já diferencia o currículo de um iniciante.",
      },
      {
        question: "Balconista de autopeças precisa de conhecimento técnico?",
        answer:
          "Sim, e é justamente por isso que a função costuma ser mais bem remunerada do que o balcão comum. O profissional precisa identificar peças por aplicação (modelo, ano, motor), consultar catálogos eletrônicos, entender equivalências entre marcas e orientar o cliente — muitas vezes um mecânico, que espera precisão. No currículo, cite os sistemas de catálogo que você usa, as linhas de veículo com que tem familiaridade (leve, pesado, motos) e o volume de atendimentos. Se você tem experiência prática com mecânica, mesmo informal, destaque: é um diferencial forte e explica por que você consegue identificar a peça correta com rapidez.",
      },
      {
        question: "Vale a pena mencionar experiência com caixa no currículo?",
        answer:
          "Vale muito, porque amplia bastante o número de vagas em que você se encaixa e sinaliza confiabilidade com valores. Descreva com detalhes úteis: qual sistema de PDV operava, se fazia abertura e fechamento de turno, se lidava com sangria, se trabalhava com múltiplas formas de pagamento e convênios, e se havia divergência nos fechamentos. Um bullet forte é: 'Operei caixa com fechamento de turno sem divergência de valores em todo o período.' Em farmácias e comércios menores, é comum o balconista acumular a função de caixa, então essa informação frequentemente decide entre dois candidatos com experiência semelhante.",
      },
    ],
  },
  {
    slug: "gerente-de-loja",
    profession: "Gerente de Loja",
    metaTitle: "Modelo de Currículo para Gerente de Loja (Exemplo Pronto 2026)",
    h1: "Modelo de Currículo para Gerente de Loja",
    metaDescription:
      "Modelo de currículo para gerente de loja: metas, DRE, gestão de equipe, ruptura, ticket médio, exemplo pronto, palavras-chave de ATS e faixa salarial.",
    intro:
      "O currículo de gerente de loja é lido por quem pensa em números: faturamento, meta, margem, ticket médio, conversão, perdas e turnover de equipe. É uma função de resultado, e por isso a diferença entre um currículo mediano e um forte não está na descrição das atividades — está nos indicadores. Quem escreve 'responsável pela gestão da loja' descreve um cargo; quem escreve 'assumi uma loja com 87% de atingimento e fechei o ano em 112%, reduzindo perdas de 2,1% para 0,9%' descreve um resultado. Este modelo mostra como construir esse currículo com precisão, incluindo gestão de pessoas e indicadores operacionais.",
    sampleResume: {
      name: "Ricardo Menezes Duarte",
      headline: "Gerente de Loja | Varejo de Moda | Metas, Gestão de Equipe e Indicadores de Loja",
      summary:
        "Gerente de loja com 8 anos de experiência em varejo de moda e calçados, responsável por unidades com faturamento de até R$ 900 mil por mês e equipes de 18 pessoas. Atuação em cumprimento de meta, gestão de indicadores (ticket médio, PA, conversão), controle de perdas, escala e desenvolvimento de time. Histórico de virada de loja com atingimento abaixo da meta.",
      experience: [
        {
          role: "Gerente de Loja",
          company: "Rede de Moda Urbana — Unidade Shopping Center",
          period: "Mar 2022 - Atual",
          bullets: [
            "Respondo por unidade com faturamento médio de R$ 900 mil/mês e equipe de 18 colaboradores entre vendas, caixa e estoque",
            "Assumi a loja com 87% de atingimento de meta e fechei o exercício seguinte em 112%, com crescimento de 14% sobre o ano anterior",
            "Elevei o ticket médio em 19% e as peças por atendimento (PA) de 1,6 para 2,3 com rotina diária de treinamento de abordagem e venda adicional",
            "Reduzi as perdas de inventário de 2,1% para 0,9% do faturamento ao implantar conferência cíclica e revisão do fluxo de provador",
            "Reduzi o turnover da equipe de 62% para 28% ao ano com processo estruturado de integração, metas individuais claras e feedback quinzenal",
            "Gerencio escala, banco de horas, DSR e cobertura de picos sazonais, mantendo o custo de pessoal dentro do orçado",
            "Acompanho o DRE da unidade com o regional, atuando sobre despesas variáveis, margem e mix de produtos",
          ],
        },
        {
          role: "Subgerente de Loja",
          company: "Calçados Passo Certo",
          period: "Jan 2018 - Fev 2022",
          bullets: [
            "Apoiei a gestão de loja com faturamento de R$ 450 mil/mês e equipe de 11 pessoas",
            "Respondi pela abertura e fechamento da loja, conferência de caixa, sangria e prestação de contas",
            "Conduzi o recebimento de mercadoria, conferência fiscal e organização do estoque, com controle de ruptura por grade",
            "Assumi a gerência interina por 4 meses, período em que a loja bateu a meta nos 4 meses",
          ],
        },
      ],
      education: [
        {
          degree: "Bacharelado em Administração",
          institution: "Universidade Estadual",
          period: "2015 - 2019",
        },
        {
          degree: "Formação em Liderança e Gestão de Equipes de Varejo",
          institution: "Curso corporativo",
          period: "2023",
        },
      ],
      skills: [
        "Gestão de metas e indicadores de varejo",
        "Ticket médio, PA e taxa de conversão",
        "Controle de perdas e inventário",
        "Gestão de equipe, escala e turnover",
        "Recebimento, estoque e ruptura",
        "Análise de DRE de loja",
        "Visual merchandising e execução de campanha",
        "Sistemas de PDV e ERP de varejo",
      ],
    },
    keySkills: [
      "Gestão de metas e resultado da unidade",
      "Indicadores de varejo: ticket médio, PA, conversão, fluxo",
      "Gestão de equipe, escala, banco de horas e desenvolvimento",
      "Recrutamento, integração e redução de turnover",
      "Controle de perdas, inventário e prevenção",
      "Gestão de estoque, ruptura e mix de produtos",
      "Leitura de DRE e controle de despesas da loja",
      "Visual merchandising e execução de campanhas",
      "Atendimento a cliente em situações críticas e resolução de conflito",
      "Sistemas de PDV, ERP e relatórios de varejo",
    ],
    atsKeywords: [
      "Gerente de Loja",
      "Gestão de Loja",
      "Varejo",
      "Metas",
      "Ticket Médio",
      "Taxa de Conversão",
      "PA (Peças por Atendimento)",
      "DRE",
      "Perdas",
      "Inventário",
      "Ruptura",
      "Gestão de Equipe",
      "Turnover",
      "Escala",
      "Visual Merchandising",
      "PDV",
      "ERP",
      "Prevenção de Perdas",
      "Faturamento",
      "Indicadores",
    ],
    salaryNote:
      "No Brasil (2026), o gerente de loja costuma receber entre R$ 3.000 e R$ 7.000 de fixo, com forte componente variável ligado ao atingimento de meta — em algumas redes, o variável representa parcela significativa da remuneração total. Lojas de shopping, unidades de alto faturamento e segmentos de maior ticket (eletrônicos, moda premium, materiais de construção) ficam no topo da faixa, enquanto lojas de rua menores e franquias tendem ao piso. Confira também a convenção coletiva dos comerciários da região.",
    dos: [
      "Comece cada experiência com o porte da loja: faturamento mensal, tamanho da equipe, canal (rua, shopping, franquia).",
      "Traga indicadores completos: atingimento de meta, ticket médio, PA, conversão, perdas e turnover.",
      "Mostre viradas: assumir uma loja abaixo da meta e recuperá-la é o argumento mais forte do currículo de gestão.",
      "Descreva a gestão de pessoas com números: quantos contratou, treinou, promoveu, e o efeito no turnover.",
      "Cite domínio de DRE, controle de despesas e mix, que diferencia gerente de supervisor operacional.",
      "Informe os sistemas de PDV, ERP e relatórios de varejo que você utiliza.",
    ],
    donts: [
      "Não descreva atividades genéricas como 'gerenciei a loja e a equipe' sem nenhum indicador.",
      "Não omita o tamanho da operação: sem faturamento e número de pessoas, não há como avaliar senioridade.",
      "Não esconda resultados ruins herdados — o valor está justamente em mostrar a recuperação.",
      "Não fale só de vendas: perdas, estoque, escala e pessoas fazem parte da avaliação.",
      "Não use currículo de mais de duas páginas; priorize as duas últimas experiências com profundidade.",
      "Não deixe de citar experiência com abertura de loja ou reforma, quando houver — é muito valorizado.",
    ],
    faqs: [
      {
        question: "Quais indicadores colocar no currículo de gerente de loja?",
        answer:
          "Priorize os que o varejo usa para avaliar uma unidade: atingimento de meta (percentual e período), crescimento sobre o ano anterior, ticket médio, peças por atendimento, taxa de conversão sobre fluxo, margem ou mix de produtos, perdas de inventário como percentual do faturamento, ruptura e turnover da equipe. Escolha de quatro a seis e apresente com o antes e o depois, que é o formato mais convincente: 'reduzi as perdas de 2,1% para 0,9% do faturamento'. Se você não tem acesso a todos os números, use os que consegue afirmar com honestidade — mesmo dois ou três indicadores bem apresentados colocam o currículo muito à frente da média.",
      },
      {
        question: "Como mostrar experiência em gestão de pessoas no currículo?",
        answer:
          "Com escala e com resultado. Informe quantas pessoas você lidera, quantas contratou e integrou, quantas promoveu e qual foi o efeito no turnover — que é o indicador de gestão mais lido em varejo, porque rotatividade alta custa caro e derruba a venda. Descreva também os rituais que você conduz: reunião diária de meta, feedback individual periódico, treinamento de abordagem, plano de desenvolvimento. Um bullet forte é: 'Reduzi o turnover da equipe de 62% para 28% ao ano com integração estruturada, metas individuais claras e feedback quinzenal.' Isso demonstra método, e método é o que diferencia gerente de líder improvisado.",
      },
      {
        question: "Como sair de vendedor ou subgerente para gerente de loja?",
        answer:
          "O caminho passa por acumular evidência de responsabilidade sobre resultado, não apenas sobre execução. Registre no currículo tudo o que já foi de gestão: períodos em que você respondeu pela loja na ausência do gerente (e o resultado desses períodos), abertura e fechamento, conferência de caixa e sangria, condução de recebimento e inventário, treinamento de novos vendedores, elaboração de escala. Se você assumiu interinamente e a loja bateu meta, isso é ouro — registre com número. Complementarmente, invista em leitura de indicadores e noções de DRE, que é a lacuna mais comum de quem vem da operação e trava a promoção.",
      },
      {
        question: "Preciso de faculdade para ser gerente de loja?",
        answer:
          "Não é requisito universal, e muitos gerentes chegam ao cargo pela trajetória interna, sem graduação. Dito isso, formação em Administração, Gestão Comercial ou Varejo é pedida com frequência em redes maiores e costuma ser critério de desempate, especialmente para lojas de alto faturamento e para a evolução seguinte, de gerente para supervisor ou regional. Se você não tem graduação, compense com resultados sólidos no currículo e com formações mais curtas em liderança, indicadores de varejo e gestão financeira de loja. Na prática, resultado comprovado costuma pesar mais do que diploma nessa função — mas a ausência dele pode limitar o próximo passo.",
      },
      {
        question: "Como falar de uma loja que não bateu meta?",
        answer:
          "Com transparência e contexto, sem inventar. Se você herdou uma unidade em situação ruim, isso é a favor: descreva o cenário encontrado, o que você diagnosticou, as ações que implantou e a evolução — mesmo que a meta não tenha sido atingida integralmente, uma curva de melhora é um resultado. Se houve fator externo relevante (obra no shopping, queda de fluxo na região, ruptura de fornecedor), mencione objetivamente e mostre o que você controlou apesar disso. O que enfraquece o currículo é omitir completamente números, porque o recrutador supõe o pior. Gestores experientes sabem que nem toda loja bate meta; o que avaliam é o seu método.",
      },
      {
        question: "O que é PA e conversão no varejo?",
        answer:
          "PA é a sigla de peças (ou produtos) por atendimento: quantos itens, em média, cada cliente leva por compra. Conversão é o percentual de pessoas que entram na loja e efetivamente compram, calculada sobre o fluxo medido por contador de entrada. Os dois indicadores, junto com o ticket médio, formam o tripé que explica o faturamento: mais gente comprando, comprando mais itens e itens de maior valor. Um gerente que domina esses números consegue diagnosticar onde está o problema — se é fluxo, se é abordagem, se é mix ou se é preço. Citá-los no currículo, com evolução, demonstra exatamente esse domínio.",
      },
    ],
  },
  {
    slug: "frentista",
    profession: "Frentista",
    metaTitle: "Modelo de Currículo para Frentista de Posto (Exemplo 2026)",
    h1: "Modelo de Currículo para Frentista",
    metaDescription:
      "Modelo de currículo para frentista de posto de combustível: atendimento, abastecimento, PDV, segurança, exemplo pronto, ATS e faixa salarial com periculosidade.",
    intro:
      "O frentista trabalha em uma função que combina atendimento, venda e segurança — e o currículo precisa mostrar as três. Postos de combustível avaliam agilidade no abastecimento, cortesia com o cliente, capacidade de vender produtos adicionais (aditivos, troca de óleo, loja de conveniência) e, principalmente, disciplina com procedimentos de segurança, já que a atividade envolve produtos inflamáveis. Este modelo mostra como estruturar um currículo objetivo para a função, com exemplo pronto, as palavras que aparecem na triagem e as informações que os postos mais procuram: disponibilidade de turno e histórico de conferência de caixa sem divergência.",
    sampleResume: {
      name: "Fábio Henrique Moreira",
      headline: "Frentista | Atendimento, Vendas de Aditivos e Conferência de Caixa | Turnos e escala 6x1",
      summary:
        "Frentista com 4 anos de experiência em postos de bandeira, atuando em abastecimento, atendimento ao cliente, venda de produtos e serviços adicionais e operação de PDV. Histórico de fechamento de turno sem divergência de caixa e cumprimento das normas de segurança para manuseio de inflamáveis. Disponibilidade total para turnos, incluindo noturno, e escala 6x1.",
      experience: [
        {
          role: "Frentista",
          company: "Posto Rodovia Norte — Bandeira Nacional",
          period: "Abr 2023 - Atual",
          bullets: [
            "Atendo em média 130 veículos por turno em pista com 6 bicos, com foco em agilidade e cortesia no atendimento",
            "Superei a meta de venda de aditivos e serviços adicionais em 10 dos últimos 12 meses, com destaque na equipe em 3 meses",
            "Realizo aferição de nível de óleo, água e calibragem de pneus quando solicitado, orientando o cliente sobre manutenção preventiva",
            "Opero o PDV com emissão de nota, aplicação de programas de fidelidade e conferência de todas as formas de pagamento",
            "Fecho o turno com conferência de caixa e prestação de contas, sem divergência de valores no período",
            "Cumpro rigorosamente os procedimentos de segurança da pista: proibição de fumo, desligamento do motor, aterramento e uso de EPI",
          ],
        },
        {
          role: "Frentista e Atendente de Conveniência",
          company: "Auto Posto Vila Nova",
          period: "Jul 2021 - Mar 2023",
          bullets: [
            "Atuei em pista e na loja de conveniência, com atendimento, reposição e operação de caixa",
            "Auxiliei na conferência de recebimento de combustível e no registro de medição dos tanques",
            "Realizei a limpeza e organização da pista e dos equipamentos, mantendo o padrão de imagem do posto",
            "Atendi clientes de frotas com preenchimento de requisição e conferência de documentação de abastecimento",
          ],
        },
      ],
      education: [
        {
          degree: "Ensino Médio Completo",
          institution: "EE Bairro Industrial",
          period: "Concluído em 2020",
        },
        {
          degree: "Treinamento de Segurança no Manuseio de Inflamáveis e Combate a Princípio de Incêndio",
          institution: "Treinamento interno do posto",
          period: "2023",
        },
      ],
      skills: [
        "Abastecimento e operação de bomba",
        "Atendimento ao cliente e venda adicional",
        "Operação de PDV e formas de pagamento",
        "Conferência e fechamento de caixa",
        "Calibragem, aferição de óleo e água",
        "Segurança no manuseio de inflamáveis",
        "Atendimento a frota com requisição",
        "Disponibilidade para turnos e escala 6x1",
      ],
    },
    keySkills: [
      "Abastecimento de veículos e operação de bombas",
      "Atendimento ao cliente com cortesia e agilidade",
      "Venda de aditivos, óleos e serviços adicionais",
      "Operação de PDV e múltiplas formas de pagamento",
      "Conferência de caixa e prestação de contas",
      "Calibragem de pneus e aferição de níveis",
      "Procedimentos de segurança com produtos inflamáveis",
      "Atendimento a frotas e controle de requisição",
      "Limpeza e organização da pista",
      "Disponibilidade para turnos, noturno e escala 6x1",
    ],
    atsKeywords: [
      "Frentista",
      "Posto de Combustível",
      "Abastecimento",
      "Atendimento ao Cliente",
      "Venda de Aditivos",
      "Conveniência",
      "PDV",
      "Fechamento de Caixa",
      "Prestação de Contas",
      "Calibragem",
      "Troca de Óleo",
      "Inflamáveis",
      "Segurança do Trabalho",
      "Periculosidade",
      "Frota",
      "Programa de Fidelidade",
      "Turno Noturno",
      "Escala 6x1",
      "Metas de Venda",
      "Limpeza de Pista",
    ],
    salaryNote:
      "No Brasil (2026), o frentista costuma receber entre R$ 1.700 e R$ 2.500 de salário base, com adicional de periculosidade previsto para a atividade com inflamáveis, além de adicional noturno em turnos e comissão sobre venda de aditivos, óleos e produtos de conveniência em boa parte dos postos. Postos de rodovia e de grande movimento tendem a pagar acima da média por causa do volume e da comissão. O piso e as condições específicas são definidos pela convenção coletiva da categoria na região.",
    dos: [
      "Informe a disponibilidade de turnos, incluindo noturno e escala 6x1, logo abaixo do contato.",
      "Traga números: veículos atendidos por turno, cumprimento de meta de aditivos, tempo sem divergência de caixa.",
      "Destaque o fechamento de caixa sem divergência — é um dos critérios de confiança mais avaliados.",
      "Cite o treinamento de segurança no manuseio de inflamáveis e a disciplina com os procedimentos de pista.",
      "Mencione experiência com loja de conveniência e com atendimento a frotas, que amplia as vagas possíveis.",
      "Se tem CNH, informe: alguns postos pedem para manobra de veículos e serviços internos.",
    ],
    donts: [
      "Não escreva apenas 'abastecia veículos'; a função envolve venda, caixa e segurança.",
      "Não omita a disponibilidade de turno: postos operam 24 horas e esse é o primeiro filtro.",
      "Não deixe de citar metas de venda de aditivos — é onde está boa parte da avaliação e da comissão.",
      "Não ignore a parte de segurança; postos valorizam muito quem demonstra disciplina com procedimento.",
      "Não use currículo longo: uma página objetiva é o formato ideal para a função.",
      "Não esconda experiências curtas; explique o contexto em vez de deixar lacunas.",
    ],
    faqs: [
      {
        question: "Frentista recebe adicional de periculosidade?",
        answer:
          "A atividade de abastecimento com inflamáveis é reconhecida como perigosa pela legislação trabalhista, e o adicional de periculosidade é devido nos termos da norma aplicável, calculado sobre o salário base. Na prática, isso significa que a remuneração total do frentista costuma ser superior ao que o salário base isolado sugere. Some a isso o adicional noturno para turnos e a comissão sobre venda de aditivos, óleos e produtos de conveniência, que em postos de grande movimento representa uma parcela relevante. Ao avaliar uma proposta, pergunte explicitamente como é composta a remuneração — base, adicionais e variável — para comparar com clareza entre postos.",
      },
      {
        question: "O que colocar no currículo de frentista sem experiência?",
        answer:
          "Coloque em destaque a disponibilidade total de horários, incluindo turno noturno, finais de semana e feriados — é o que os postos mais precisam e o que mais falta nos candidatos. Em seguida, informe ensino médio, residência próxima ao posto e, se tiver, CNH. Use experiências anteriores de qualquer natureza para mostrar atendimento ao público, responsabilidade com dinheiro e pontualidade. Se você já operou caixa em algum lugar, destaque. E mencione que entende a natureza da função: atendimento ágil, venda de produtos adicionais e disciplina com os procedimentos de segurança da pista. Essa clareza diferencia bastante um currículo de iniciante.",
      },
      {
        question: "Frentista precisa vender produtos além do combustível?",
        answer:
          "Sim, e essa é uma parte importante da avaliação. Boa parte da margem de um posto vem de aditivos, óleos, filtros, serviços de troca e produtos da loja de conveniência — e o frentista é quem tem contato direto com o cliente no momento certo de oferecer. Por isso, metas de venda adicional são comuns e costumam gerar comissão. No currículo, registre esse lado comercial com números: cumprimento de meta, posição na equipe, produtos com melhor desempenho. Um bullet como 'superei a meta de venda de aditivos em 10 dos últimos 12 meses' comunica exatamente o que o gerente do posto procura.",
      },
      {
        question: "Como mostrar que sou confiável com o caixa?",
        answer:
          "Com um fato objetivo: tempo sem divergência no fechamento. Escreva algo como 'Fecho o turno com conferência de caixa e prestação de contas, sem divergência de valores no período'. Complemente descrevendo a rotina — conferência de todas as formas de pagamento, controle de troco, sangria, registro no sistema e conferência com a leitura das bombas. Em uma função que movimenta dinheiro em espécie e cartões durante turnos inteiros, muitas vezes com pouca supervisão direta, essa é uma das informações que mais reduzem o risco percebido pelo empregador — e quase nenhum candidato a inclui no currículo.",
      },
      {
        question: "É obrigatório ter treinamento de segurança para trabalhar em posto?",
        answer:
          "Os postos são obrigados a treinar seus funcionários para o manuseio seguro de produtos inflamáveis e para o combate a princípio de incêndio, e esse treinamento normalmente é conduzido internamente após a contratação. Ter alguma formação prévia — brigada de incêndio, primeiros socorros, noções de segurança do trabalho — é um diferencial que acelera a admissão e sinaliza responsabilidade. No currículo, liste esses treinamentos com o ano. Igualmente importante é demonstrar no texto que você conhece e cumpre os procedimentos de pista: desligamento do motor, proibição de fumo, aterramento em caminhões-tanque e uso correto de EPI.",
      },
      {
        question: "Como é a escala de trabalho de um frentista?",
        answer:
          "A maioria dos postos opera 24 horas, com turnos que se revezam e escala frequentemente 6x1 ou 12x36, dependendo do estabelecimento e da convenção coletiva da região. Turnos noturnos são comuns e vêm com adicional. Por isso, a disponibilidade é o primeiro filtro da triagem: candidatos que só podem trabalhar em horário comercial costumam ser descartados logo no início. Deixe essa informação explícita no topo do currículo e seja honesto sobre eventuais restrições — descobrir uma incompatibilidade depois da contratação gera desligamento rápido e prejudica a sua relação com o posto e com quem indicou você.",
      },
    ],
  },
  {
    slug: "garcom",
    profession: "Garçom",
    metaTitle: "Modelo de Currículo para Garçom e Garçonete (Exemplo 2026)",
    h1: "Modelo de Currículo para Garçom",
    metaDescription:
      "Modelo de currículo para garçom e garçonete: atendimento, sistema de comanda, venda sugestiva, exemplo pronto, palavras-chave de ATS e faixa salarial.",
    intro:
      "Garçom é uma função em que a experiência específica pesa muito: atender em um restaurante à la carte, em um bar de alto volume ou em um evento são trabalhos diferentes, com ritmos e exigências distintas. O currículo precisa deixar claro qual você domina. Além disso, restaurantes valorizam duas coisas que quase ninguém registra: conhecimento do cardápio (capacidade de descrever pratos, sugerir harmonização, informar sobre alergênicos) e venda sugestiva, que aumenta o ticket da casa. Este modelo mostra como montar um currículo objetivo com esses elementos, com exemplo pronto e a lista de termos que a triagem procura.",
    sampleResume: {
      name: "Larissa Campos Ribeiro",
      headline: "Garçonete | Restaurante à La Carte e Eventos | Venda Sugestiva e Sistema de Comanda",
      summary:
        "Garçonete com 6 anos de experiência em restaurante à la carte, bar e operação de eventos, com atendimento de até 12 mesas simultâneas em serviço à francesa e americano. Domínio de sistema de comanda eletrônica, conhecimento de cardápio e carta de bebidas, e histórico de aumento de ticket médio por venda sugestiva. Noções de boas práticas de manipulação de alimentos.",
      experience: [
        {
          role: "Garçonete",
          company: "Restaurante Cantina do Porto (110 lugares)",
          period: "Fev 2022 - Atual",
          bullets: [
            "Atendo praça de até 12 mesas em serviço à la carte, com média de 90 clientes por turno em dias de pico",
            "Elevei o ticket médio da minha praça em 16% com venda sugestiva de entradas, sobremesas e harmonização de vinhos",
            "Domino o cardápio completo, incluindo ingredientes, modo de preparo, tempo de saída e informações sobre alergênicos e restrições alimentares",
            "Opero sistema de comanda eletrônica com lançamento de pedido, divisão de conta e fechamento com múltiplas formas de pagamento",
            "Realizo mise en place da praça, conferência de louças, talheres e enxoval antes da abertura",
            "Atuo na resolução de reclamações em primeira instância, com histórico de resolução na mesa sem escalar ao gerente",
          ],
        },
        {
          role: "Garçonete de Eventos e Bar",
          company: "Buffet Reserva Eventos",
          period: "Mar 2019 - Jan 2022",
          bullets: [
            "Atendi eventos corporativos e sociais de até 400 convidados, em serviço volante, americano e empratado",
            "Trabalhei no bar com preparo de drinks simples, controle de estoque de bebidas e reposição durante o evento",
            "Participei da montagem e desmontagem de salão, conforme layout definido pelo cerimonial",
            "Atuei em equipe com brigada de até 20 profissionais, seguindo a orientação do maître",
          ],
        },
      ],
      education: [
        {
          degree: "Curso de Garçom e Serviços de Restaurante",
          institution: "SENAC",
          period: "2019",
        },
        {
          degree: "Boas Práticas de Manipulação de Alimentos",
          institution: "Curso livre",
          period: "2023",
        },
        {
          degree: "Ensino Médio Completo",
          institution: "EE Cidade Alta",
          period: "Concluído em 2018",
        },
      ],
      skills: [
        "Serviço à la carte, americano e à francesa",
        "Venda sugestiva e harmonização básica",
        "Sistema de comanda eletrônica",
        "Mise en place e organização de praça",
        "Atendimento a eventos e serviço volante",
        "Conhecimento de cardápio e alergênicos",
        "Boas práticas de manipulação de alimentos",
        "Resolução de reclamações",
      ],
    },
    keySkills: [
      "Atendimento em salão e gestão de praça",
      "Tipos de serviço (à la carte, americano, à francesa, empratado)",
      "Venda sugestiva de entradas, bebidas e sobremesas",
      "Conhecimento de cardápio, ingredientes e alergênicos",
      "Operação de sistema de comanda e fechamento de conta",
      "Mise en place e organização do salão",
      "Noções de vinhos, drinks e harmonização",
      "Boas práticas de manipulação e higiene",
      "Resolução de reclamação e recuperação de serviço",
      "Trabalho em equipe sob pressão e em horários de pico",
    ],
    atsKeywords: [
      "Garçom",
      "Garçonete",
      "Atendimento em Salão",
      "À La Carte",
      "Serviço Americano",
      "Serviço à Francesa",
      "Comanda Eletrônica",
      "Mise en Place",
      "Venda Sugestiva",
      "Ticket Médio",
      "Harmonização",
      "Carta de Vinhos",
      "Bar",
      "Eventos",
      "Buffet",
      "Boas Práticas",
      "Manipulação de Alimentos",
      "Fechamento de Conta",
      "Restaurante",
      "Hotelaria",
    ],
    salaryNote:
      "No Brasil (2026), o garçom costuma receber entre R$ 1.600 e R$ 2.500 de salário base, acrescido da taxa de serviço (gorjeta) que, em casas de bom movimento, pode representar parcela significativa da remuneração mensal. Restaurantes de alto padrão, hotéis e casas com carta de vinhos tendem a pagar acima da média e a exigir mais conhecimento técnico. Eventos e buffets frequentemente contratam por diária. As regras de rateio da taxa de serviço variam por estabelecimento e por convenção coletiva — confirme antes de aceitar a vaga.",
    dos: [
      "Especifique o tipo de casa: à la carte, self-service, bar, buffet de eventos, hotel, fast casual.",
      "Informe o tamanho da operação: número de lugares, mesas por praça, clientes por turno, convidados por evento.",
      "Destaque venda sugestiva com resultado — é o que transforma o garçom em um profissional de receita.",
      "Cite o conhecimento de cardápio, incluindo alergênicos e restrições alimentares.",
      "Mencione os tipos de serviço que domina (americano, à francesa, empratado, volante).",
      "Liste cursos de manipulação de alimentos e de serviços de restaurante, que pesam na triagem.",
    ],
    donts: [
      "Não escreva apenas 'atendi clientes no restaurante' — descreva o tipo de serviço e o volume.",
      "Não omita o conhecimento de cardápio e bebidas: é o que separa o garçom do auxiliar de salão.",
      "Não deixe de citar o sistema de comanda utilizado, que reduz o tempo de treinamento.",
      "Não ignore a disponibilidade de horário: noites, finais de semana e feriados são o núcleo da operação.",
      "Não use currículo com foto e enfeites; redes e hotéis usam triagem automática.",
      "Não deixe de mencionar experiência em eventos, que amplia bastante as oportunidades.",
    ],
    faqs: [
      {
        question: "Como fazer currículo de garçom sem experiência?",
        answer:
          "Comece pelo que a casa mais precisa: disponibilidade para noites, finais de semana e feriados, além de boa apresentação e comunicação. Se você fez curso de garçom ou de boas práticas de manipulação de alimentos, coloque em destaque — são cursos curtos, baratos e muito valorizados na triagem. Use qualquer experiência anterior de atendimento ao público para demonstrar cortesia, ritmo e trabalho sob pressão. E demonstre que você entende a função escrevendo um resumo que mencione atendimento de praça, conhecimento de cardápio e venda sugestiva. Muitos restaurantes contratam iniciantes para auxiliar de salão e promovem internamente, então mencionar abertura para começar nessa posição também ajuda.",
      },
      {
        question: "O que é venda sugestiva e por que colocar no currículo?",
        answer:
          "Venda sugestiva é a prática de oferecer itens complementares ao pedido do cliente de forma natural e bem informada: uma entrada para compartilhar enquanto o prato principal não sai, uma bebida que harmoniza, uma sobremesa no fechamento. Ela aumenta diretamente o ticket médio da casa, que é o principal indicador de receita por cliente — e é justamente o que o gerente de salão avalia. Por isso, citá-la com resultado diferencia muito o currículo: 'Elevei o ticket médio da minha praça em 16% com venda sugestiva de entradas, sobremesas e harmonização.' Sem número, descreva a prática e os itens que você costuma sugerir.",
      },
      {
        question: "Qual a diferença entre serviço à francesa, americano e empratado?",
        answer:
          "No serviço à americana, o prato já sai montado da cozinha e é servido pronto ao cliente — é o mais comum em restaurantes à la carte. No serviço à francesa, o garçom apresenta a travessa ao cliente, que se serve, ou o próprio garçom serve à mesa com talher de serviço; exige mais técnica e aparece em casas de alto padrão e em eventos formais. Empratado é o termo usado principalmente em eventos, quando o prato montado é servido simultaneamente a todos os convidados. Conhecer e citar os tipos que você domina demonstra formação técnica e é um diferencial concreto em restaurantes de padrão mais elevado e em hotelaria.",
      },
      {
        question: "Preciso saber sobre vinhos para ser garçom?",
        answer:
          "Não é requisito na maioria das casas, mas é um diferencial importante e crescente. Em restaurantes com carta de vinhos, saber descrever um rótulo, sugerir harmonização com o prato escolhido e executar corretamente o serviço da garrafa aumenta o ticket e a percepção de qualidade do atendimento — e frequentemente é o que separa quem atende as praças melhores. Cursos introdutórios de vinhos e de serviço de bebidas são curtos e acessíveis, e aparecem bem no currículo. Mesmo um conhecimento básico de tipos de uva, temperatura de serviço e harmonizações clássicas já coloca você à frente da maioria dos candidatos.",
      },
      {
        question: "Como colocar experiência em eventos no currículo?",
        answer:
          "Registre como uma experiência profissional, mesmo que tenha sido por diária ou por freelance, informando o período e a empresa ou buffet. Descreva o porte dos eventos (número de convidados), os tipos de serviço executados (volante, empratado, americano), o tamanho da brigada em que atuou e as atividades além do atendimento — montagem e desmontagem de salão, apoio no bar, controle de bebidas. Se você trabalhou para vários buffets, pode agrupar em uma linha de experiência como 'Garçonete de Eventos — atuação para diversos buffets'. Essa experiência é bastante valorizada porque demonstra capacidade de trabalhar sob pressão e em equipe grande.",
      },
      {
        question: "Como é remunerada a gorjeta e devo considerá-la no salário?",
        answer:
          "A taxa de serviço cobrada pelo estabelecimento costuma ser rateada entre a equipe segundo regras próprias de cada casa e, em muitos casos, previstas em convenção coletiva. Em restaurantes de bom movimento, ela representa uma parcela significativa da remuneração mensal, às vezes comparável ao salário base. Por isso, ao avaliar uma vaga, pergunte explicitamente: qual é o base, como funciona o rateio da taxa, com que frequência é paga e qual foi a média dos últimos meses. Comparar duas propostas apenas pelo salário base pode levar a uma decisão errada, porque casas com base menor e alto movimento frequentemente pagam mais no total.",
      },
    ],
  },
  {
    slug: "auxiliar-de-cozinha",
    profession: "Auxiliar de Cozinha",
    metaTitle: "Modelo de Currículo para Auxiliar de Cozinha (Exemplo 2026)",
    h1: "Modelo de Currículo para Auxiliar de Cozinha",
    metaDescription:
      "Modelo de currículo para auxiliar de cozinha: pré-preparo, mise en place, boas práticas, APPCC, exemplo pronto, palavras-chave de ATS e faixa salarial.",
    intro:
      "Auxiliar de cozinha é a porta de entrada da gastronomia profissional e uma das funções com mais vagas abertas no país — o que significa alta concorrência e triagem rápida. O que faz um currículo se destacar não é a lista de tarefas, e sim mostrar que você conhece a organização de uma cozinha profissional: pré-preparo, mise en place, controle de temperatura, boas práticas e ritmo de praça. Este modelo mostra como escrever isso de forma objetiva, com exemplo pronto que serve tanto para restaurante à la carte quanto para cozinha industrial e refeição coletiva, além das palavras-chave que aparecem na triagem.",
    sampleResume: {
      name: "Carlos Eduardo Batista",
      headline: "Auxiliar de Cozinha | Pré-preparo, Mise en Place e Boas Práticas | Cozinha Industrial e À La Carte",
      summary:
        "Auxiliar de cozinha com 5 anos de experiência em cozinha industrial e restaurante à la carte, atuando em pré-preparo, mise en place, montagem de pratos e apoio às praças quente e fria. Domínio de boas práticas de manipulação, controle de temperatura, PVPS e higienização conforme POP. Disponibilidade para escala 6x1 e turnos.",
      experience: [
        {
          role: "Auxiliar de Cozinha",
          company: "Restaurante Sabor da Serra (180 refeições/dia)",
          period: "Jun 2023 - Atual",
          bullets: [
            "Realizo o pré-preparo diário de aproximadamente 180 refeições: cortes de legumes, higienização de hortifrúti, porcionamento de proteínas e preparo de bases",
            "Executo mise en place completo da praça fria antes do serviço, garantindo que a operação abra sem atraso",
            "Apoio a praça quente durante o serviço, com controle de tempo de saída e montagem de pratos conforme a ficha técnica",
            "Registro temperatura de câmaras, balcões e produtos preparados em planilha de controle, conforme exigência sanitária",
            "Aplico PVPS (primeiro que vence, primeiro que sai) na organização da câmara, reduzindo perdas por vencimento em cerca de 30%",
            "Executo a higienização de utensílios, bancadas e equipamentos seguindo os POPs da cozinha",
          ],
        },
        {
          role: "Auxiliar de Cozinha — Refeição Coletiva",
          company: "Empresa de Alimentação Coletiva NutriServ",
          period: "Set 2021 - Mai 2023",
          bullets: [
            "Atuei em cozinha industrial com produção de 600 refeições diárias para unidade fabril",
            "Realizei recebimento e conferência de mercadoria, com verificação de temperatura, embalagem e validade na entrada",
            "Apoiei a montagem do balcão de distribuição e a reposição durante o horário de refeição",
            "Segui integralmente as boas práticas e o manual da unidade, com uso de uniforme completo e higienização de mãos conforme procedimento",
          ],
        },
      ],
      education: [
        {
          degree: "Curso de Auxiliar de Cozinha",
          institution: "SENAC",
          period: "2021",
        },
        {
          degree: "Boas Práticas de Manipulação de Alimentos",
          institution: "Curso livre com atualização em 2024",
          period: "2024",
        },
        {
          degree: "Ensino Médio Completo",
          institution: "EE Jardim Primavera",
          period: "Concluído em 2020",
        },
      ],
      skills: [
        "Pré-preparo e cortes de legumes",
        "Mise en place de praça fria e quente",
        "Controle de temperatura e registro",
        "Boas práticas de manipulação (BPF)",
        "PVPS e controle de validade",
        "Higienização conforme POP",
        "Recebimento e conferência de mercadoria",
        "Cozinha industrial e à la carte",
      ],
    },
    keySkills: [
      "Pré-preparo, cortes e porcionamento",
      "Mise en place e organização de praça",
      "Apoio às praças quente, fria e de montagem",
      "Boas práticas de manipulação de alimentos (BPF)",
      "Controle de temperatura e registro sanitário",
      "PVPS, controle de validade e redução de perdas",
      "Higienização de utensílios, bancadas e equipamentos",
      "Recebimento e conferência de mercadoria",
      "Leitura e execução de ficha técnica",
      "Trabalho em equipe e ritmo de serviço em horário de pico",
    ],
    atsKeywords: [
      "Auxiliar de Cozinha",
      "Cozinha Industrial",
      "Pré-preparo",
      "Mise en Place",
      "Praça Quente",
      "Praça Fria",
      "Boas Práticas",
      "BPF",
      "APPCC",
      "Manipulação de Alimentos",
      "Controle de Temperatura",
      "PVPS",
      "Ficha Técnica",
      "POP",
      "Higienização",
      "Refeição Coletiva",
      "Restaurante",
      "Porcionamento",
      "Recebimento de Mercadoria",
      "Escala 6x1",
    ],
    salaryNote:
      "No Brasil (2026), o auxiliar de cozinha costuma receber entre R$ 1.600 e R$ 2.400, com adicional de insalubridade em algumas operações, adicional noturno para turnos e vale-refeição ou alimentação no local. Cozinhas industriais de grande volume, hospitais e restaurantes de padrão mais alto tendem a pagar acima da média. O piso da categoria é definido pela convenção coletiva do sindicato de hotelaria, alimentação ou refeições coletivas da região.",
    dos: [
      "Diga o tipo de cozinha em que atuou: à la carte, industrial, refeição coletiva, hospitalar, fast food.",
      "Informe o volume: número de refeições por dia ou de clientes atendidos por serviço.",
      "Use os termos técnicos da área — mise en place, pré-preparo, PVPS, POP, ficha técnica — que aparecem na triagem.",
      "Destaque o curso de boas práticas de manipulação de alimentos, que é quase obrigatório na área.",
      "Cite controle de temperatura e registros sanitários: mostra que você entende a exigência de fiscalização.",
      "Informe disponibilidade de escala e turno logo abaixo do contato.",
    ],
    donts: [
      "Não escreva apenas 'ajudei na cozinha' — descreva as etapas que você executa.",
      "Não omita o volume de produção: é o que dimensiona a sua experiência.",
      "Não deixe de citar boas práticas e higiene, que são o principal risco sanitário da operação.",
      "Não confunda cozinha industrial com à la carte no mesmo texto: os ritmos e exigências são diferentes.",
      "Não deixe de mencionar equipamentos que sabe operar (fritadeira industrial, forno combinado, processador).",
      "Não use currículo com foto e enfeites; redes e empresas de alimentação usam triagem automática.",
    ],
    faqs: [
      {
        question: "O que faz um auxiliar de cozinha?",
        answer:
          "O auxiliar de cozinha dá suporte a toda a operação de produção: recebe e confere mercadoria, higieniza hortifrúti, faz cortes e porcionamentos no pré-preparo, monta o mise en place das praças antes do serviço, apoia o cozinheiro durante o atendimento, controla temperatura de câmaras e produtos, organiza o estoque aplicando PVPS e executa a higienização de utensílios, bancadas e equipamentos conforme os POPs. Em cozinha industrial, soma-se o apoio à distribuição no balcão. É a função que sustenta a cozinha: quando o pré-preparo e o mise en place falham, o serviço inteiro atrasa — e é justamente isso que se avalia em quem contrata.",
      },
      {
        question: "Preciso de curso para ser auxiliar de cozinha?",
        answer:
          "Um curso técnico não é obrigatório, mas o curso de boas práticas de manipulação de alimentos é praticamente indispensável e frequentemente exigido, porque a atividade está sujeita à fiscalização sanitária. Ele é curto, de baixo custo e cobre higiene pessoal, contaminação cruzada, controle de temperatura e armazenamento — conteúdo cobrado no dia a dia. Um curso de auxiliar de cozinha ou de cozinheiro é um diferencial adicional e acelera a evolução para cozinheiro. No currículo, liste esses cursos em uma seção própria com instituição e ano, e informe se houve atualização recente, porque algumas empresas pedem reciclagem periódica.",
      },
      {
        question: "O que é mise en place e por que citar no currículo?",
        answer:
          "Mise en place é a preparação prévia de tudo o que a praça vai precisar durante o serviço: ingredientes cortados e porcionados, molhos e bases prontos, utensílios posicionados, equipamentos aquecidos. É o que permite que a cozinha entregue um prato em minutos durante o pico. Citar o termo no currículo mostra que você conhece o funcionamento de uma cozinha profissional, e não apenas de uma cozinha doméstica — o que já diferencia de boa parte dos candidatos. Descreva também o resultado: 'Executo mise en place completo da praça fria antes do serviço, garantindo que a operação abra sem atraso.'",
      },
      {
        question: "Como fazer currículo de auxiliar de cozinha sem experiência?",
        answer:
          "Destaque três coisas no topo: o curso de boas práticas de manipulação de alimentos (faça antes de procurar vaga, se ainda não tem), disponibilidade total de horários incluindo finais de semana, e residência próxima ao estabelecimento. Use experiências anteriores de qualquer natureza para mostrar ritmo, organização e trabalho em equipe. Se você tem experiência doméstica relevante — cozinhar para eventos, produção para venda, apoio em cozinha de igreja ou associação —, registre com honestidade e descreva o volume. E use o vocabulário certo no resumo: mostrar que você conhece termos como pré-preparo, mise en place e controle de temperatura sinaliza preparo real para a função.",
      },
      {
        question: "Qual a diferença entre cozinha industrial e restaurante à la carte?",
        answer:
          "A cozinha industrial produz grande volume com cardápio definido e horários fixos de distribuição — o desafio é escala, padronização, controle sanitário rigoroso e cumprimento de prazo. O restaurante à la carte produz sob demanda, prato a prato, e o desafio é o ritmo do serviço: vários pedidos simultâneos com tempos de saída diferentes, exigindo mise en place impecável e coordenação com o salão. As duas experiências são valiosas, mas o vocabulário e as competências enfatizadas mudam. No currículo, separe as experiências e descreva cada uma com os termos próprios; isso amplia o número de vagas em que você aparece na triagem.",
      },
      {
        question: "Como evoluir de auxiliar para cozinheiro?",
        answer:
          "Três movimentos aceleram a transição. O primeiro é dominar as praças: pedir para atuar na praça quente, aprender as fichas técnicas e assumir preparações completas, não só o pré-preparo. O segundo é a formação: um curso de cozinheiro ou de gastronomia, mesmo de curta duração, costuma ser o que destrava a promoção formal. O terceiro é a evidência no currículo: registre sempre que tiver assumido uma praça sozinho, coberto a ausência do cozinheiro, ou executado preparações do início ao fim, com o volume envolvido. Muitas casas promovem internamente, então demonstrar iniciativa e conhecimento de ficha técnica é o caminho mais direto.",
      },
    ],
  },
  {
    slug: "padeiro",
    profession: "Padeiro",
    metaTitle: "Modelo de Currículo para Padeiro (Exemplo Pronto 2026)",
    h1: "Modelo de Currículo para Padeiro",
    metaDescription:
      "Modelo de currículo para padeiro: produção de pães, fermentação, massas, confeitaria, boas práticas, exemplo pronto, palavras-chave de ATS e salário.",
    intro:
      "Padeiro é uma profissão técnica com uma peculiaridade: quase todo o conhecimento é prático, e por isso os currículos costumam ser vagos justamente onde deveriam ser precisos. Quem contrata quer saber qual a sua produção diária, que tipos de pão você produz, se domina fermentação natural, se trabalha com confeitaria e salgados, e qual equipamento sabe operar. Panificadoras, supermercados e indústrias de panificação têm rotinas bem diferentes, e o currículo precisa mostrar em qual delas você se encaixa. Este modelo traz um exemplo pronto e a estrutura que funciona na triagem, incluindo boas práticas e turno de madrugada.",
    sampleResume: {
      name: "Edvaldo Ramos de Lima",
      headline: "Padeiro | Produção de Pães, Fermentação Natural e Confeitaria | Turno de madrugada",
      summary:
        "Padeiro com 10 anos de experiência em panificadora e padaria de supermercado, com produção diária de até 1.200 pães e domínio de fermentação direta, indireta e natural. Experiência em pães especiais, massas doces, salgados e apoio à confeitaria. Operação de masseira espiral, cilindro, modeladora, câmara de fermentação e forno turbo. Boas práticas de manipulação atualizadas.",
      experience: [
        {
          role: "Padeiro",
          company: "Panificadora Trigo de Ouro",
          period: "Jan 2020 - Atual",
          bullets: [
            "Produzo em média 1.200 pães por dia (francês, bola, bengala) e cerca de 300 unidades de pães especiais e doces",
            "Conduzo o processo completo: pesagem, mistura, cilindro, divisão, modelagem, fermentação controlada e forneamento",
            "Implantei uma linha de pães de fermentação natural que hoje representa cerca de 18% do faturamento da padaria",
            "Ajusto tempo e temperatura de fermentação conforme o clima do dia, mantendo a padronização do produto ao longo do ano",
            "Reduzi as perdas de produção em cerca de 25% ao padronizar as fichas de receita e o controle de pesagem",
            "Produzo massas doces, salgados assados e apoio a confeitaria em períodos de maior demanda",
            "Realizo a higienização de equipamentos e bancadas conforme POP e mantenho os registros de controle exigidos pela vigilância",
          ],
        },
        {
          role: "Auxiliar de Padeiro",
          company: "Padaria do Supermercado Rede Sul",
          period: "Mar 2016 - Dez 2019",
          bullets: [
            "Atuei no apoio à produção de pães e no forneamento de produtos congelados da linha industrial",
            "Realizei a modelagem manual e a operação de modeladora e cilindro",
            "Fiz a reposição da vitrine e o controle de saída conforme o fluxo da loja, reduzindo sobra no fim do dia",
            "Segui as boas práticas de manipulação, com uso de uniforme completo e higienização conforme procedimento",
          ],
        },
      ],
      education: [
        {
          degree: "Curso de Panificação e Confeitaria",
          institution: "SENAI",
          period: "2016",
        },
        {
          degree: "Boas Práticas de Manipulação de Alimentos",
          institution: "Curso livre com atualização em 2024",
          period: "2024",
        },
        {
          degree: "Ensino Fundamental Completo",
          institution: "EE Bairro do Rosário",
          period: "Concluído em 2013",
        },
      ],
      skills: [
        "Produção de pão francês e pães especiais",
        "Fermentação direta, indireta e natural",
        "Masseira espiral, cilindro e modeladora",
        "Câmara de fermentação e forno turbo",
        "Massas doces e salgados assados",
        "Ficha técnica e controle de pesagem",
        "Boas práticas de manipulação",
        "Turno de madrugada",
      ],
    },
    keySkills: [
      "Produção de pães de consumo diário e especiais",
      "Processos de fermentação (direta, indireta, natural)",
      "Operação de masseira, cilindro, modeladora e divisora",
      "Câmara de fermentação, forno turbo e forno de lastro",
      "Massas doces, folhadas e salgados assados",
      "Apoio a confeitaria e finalização",
      "Ficha técnica, pesagem e padronização",
      "Controle de perdas e ajuste de produção ao giro da loja",
      "Boas práticas de manipulação e higienização",
      "Disponibilidade para turno de madrugada e escala 6x1",
    ],
    atsKeywords: [
      "Padeiro",
      "Panificação",
      "Pão Francês",
      "Pães Especiais",
      "Fermentação Natural",
      "Levain",
      "Masseira",
      "Cilindro",
      "Modeladora",
      "Câmara de Fermentação",
      "Forno Turbo",
      "Confeitaria",
      "Salgados",
      "Ficha Técnica",
      "Boas Práticas",
      "Manipulação de Alimentos",
      "Controle de Perdas",
      "Padaria",
      "Supermercado",
      "Turno de Madrugada",
    ],
    salaryNote:
      "No Brasil (2026), o padeiro costuma receber entre R$ 2.000 e R$ 3.200, com adicional noturno para o turno de madrugada, que é o mais comum na função. Padeiros com domínio de fermentação natural, pães especiais e confeitaria, além de profissionais em padarias de alto padrão e em indústrias de panificação, tendem a ficar no topo da faixa. Chefes de padaria e líderes de produção recebem acima disso. O piso é definido pela convenção coletiva da categoria na região.",
    dos: [
      "Informe a produção diária em unidades ou quilos: é o que dimensiona a sua experiência imediatamente.",
      "Liste os tipos de pão e produtos que você domina, separando consumo diário, especiais, doces e salgados.",
      "Destaque fermentação natural se você trabalha com ela — é o diferencial mais valorizado hoje.",
      "Cite os equipamentos que opera: masseira espiral, cilindro, modeladora, divisora, câmara, forno turbo.",
      "Mencione controle de perdas e padronização por ficha técnica, que interessa muito ao dono da padaria.",
      "Deixe clara a disponibilidade para turno de madrugada, que é a rotina padrão da função.",
    ],
    donts: [
      "Não escreva apenas 'produzia pães' sem dizer quais, em que volume e com qual processo.",
      "Não omita o tipo de estabelecimento: padaria de bairro, supermercado e indústria têm rotinas distintas.",
      "Não deixe de citar boas práticas e higiene: a fiscalização sanitária é uma preocupação constante.",
      "Não esconda a disponibilidade de horário; a maioria das vagas começa de madrugada.",
      "Não invente domínio de fermentação natural — é facilmente verificado em teste prático.",
      "Não deixe de mencionar confeitaria e salgados, que ampliam bastante as vagas possíveis.",
    ],
    faqs: [
      {
        question: "Como fazer currículo de padeiro?",
        answer:
          "Comece com um título que já traga a sua especialidade, como 'Padeiro | Pães Especiais, Fermentação Natural e Confeitaria'. No resumo, informe anos de experiência, produção diária média, tipos de produto e processos de fermentação que domina. Na experiência, descreva cada estabelecimento com o volume produzido, a variedade de produtos, os equipamentos operados e resultados concretos — redução de perdas, criação de linha nova, padronização por ficha técnica. Liste os cursos de panificação e de boas práticas em seção própria. Mantenha em uma página, layout simples e envie em PDF, porque redes de supermercado e indústrias usam triagem automática.",
      },
      {
        question: "Vale a pena aprender fermentação natural?",
        answer:
          "Vale muito. Pães de fermentação natural têm ticket bem mais alto, sustentam padarias de padrão superior e são a principal tendência do setor há anos — e há escassez de profissionais que dominam o processo de verdade, com manutenção de levain, controle de temperatura, tempos longos e ajuste conforme o clima. Quem domina costuma acessar as melhores vagas e as faixas salariais mais altas da profissão, além de abrir possibilidade de trabalho autônomo com margem melhor. No currículo, não basta citar: descreva o que você faz na prática — manutenção de fermento, tipos de pão produzidos e, se possível, a participação desses produtos no faturamento.",
      },
      {
        question: "Padeiro trabalha sempre de madrugada?",
        answer:
          "Na maioria das padarias, sim, pelo menos parte da equipe. A produção precisa estar pronta na abertura da loja, e a fermentação exige horas de antecedência, então turnos que começam entre 1h e 4h da manhã são a norma. Em padarias maiores e supermercados, há turnos de produção ao longo do dia para repor a vitrine, o que abre alternativas. O turno noturno costuma vir acompanhado de adicional na remuneração. Como esse é o primeiro filtro da triagem, deixe a sua disponibilidade explícita no topo do currículo — e seja honesto sobre eventuais restrições, porque a incompatibilidade aparece já na primeira semana.",
      },
      {
        question: "Preciso de curso para trabalhar como padeiro?",
        answer:
          "A profissão é aprendida majoritariamente na prática, e muitos padeiros experientes não têm formação formal. Ainda assim, um curso de panificação ajuda bastante na triagem, especialmente em redes e indústrias, e é praticamente indispensável para quem quer trabalhar com pães especiais e fermentação natural. Já o curso de boas práticas de manipulação de alimentos é exigido com frequência e cobre higiene, contaminação cruzada e controle de temperatura — conteúdo diretamente ligado à fiscalização sanitária. Se você tem experiência e nenhum curso, priorize esse: é curto, barato e destrava vagas formais imediatamente.",
      },
      {
        question: "Como mostrar produtividade no currículo de padeiro?",
        answer:
          "Use volume e variedade juntos. Por exemplo: 'Produzo em média 1.200 pães por dia (francês, bola, bengala) e cerca de 300 unidades de pães especiais e doces.' Complemente com resultados de gestão da produção: redução de perdas por padronização de receita, ajuste de produção ao giro da loja para diminuir sobra no fim do dia, criação de linha de produto com participação no faturamento. Esses dados interessam diretamente ao dono da padaria, porque perda e sobra são custos que aparecem no resultado. Quase nenhum currículo de padeiro traz esse tipo de informação, então ela diferencia com facilidade.",
      },
      {
        question: "Qual a diferença entre padeiro de padaria e de supermercado?",
        answer:
          "A padaria de bairro costuma ter variedade maior e produção mais artesanal, com o padeiro conduzindo o processo do início ao fim e frequentemente respondendo também por doces e salgados. A padaria de supermercado trabalha com volume maior, mais padronização e uso frequente de massas congeladas e pré-assadas da linha industrial, com foco em forneamento e reposição contínua da vitrine ao longo do dia. Ambas são experiências válidas, mas exigem ênfases diferentes no currículo: na primeira, destaque processo e variedade; na segunda, destaque volume, ritmo de reposição e controle de sobra. Quem tem as duas experiências deve separá-las claramente.",
      },
    ],
  },
  {
    slug: "camareira",
    profession: "Camareira",
    metaTitle: "Modelo de Currículo para Camareira de Hotel (Exemplo 2026)",
    h1: "Modelo de Currículo para Camareira",
    metaDescription:
      "Modelo de currículo para camareira de hotel: arrumação de apartamentos, produtividade, enxoval, padrão de limpeza, exemplo pronto, ATS e faixa salarial.",
    intro:
      "Na hotelaria, a camareira é responsável direta pela avaliação que o hóspede dá ao hotel — limpeza e conforto do quarto estão entre os itens mais citados em avaliações online. Quem contrata avalia três coisas objetivas: produtividade (quantos apartamentos por turno), padrão de qualidade (aprovação na inspeção da governanta) e confiabilidade, já que a função envolve acesso a pertences dos hóspedes. Currículos que dizem apenas 'fazia a limpeza dos quartos' não comunicam nenhuma dessas três. Este modelo mostra como estruturar a informação com precisão, com exemplo pronto e as palavras que a triagem hoteleira procura.",
    sampleResume: {
      name: "Rosângela Pinto da Costa",
      headline: "Camareira | Arrumação de Apartamentos e Áreas Sociais | Hotelaria",
      summary:
        "Camareira com 7 anos de experiência em hotelaria, com produtividade média de 16 apartamentos por turno em arrumação de saída e ocupado, dentro do padrão de qualidade exigido pela governança. Experiência com controle de enxoval, rouparia, reposição de frigobar e amenidades, registro de achados e perdidos e uso de produtos de limpeza conforme diluição correta.",
      experience: [
        {
          role: "Camareira",
          company: "Hotel Executivo Praça Central (140 apartamentos)",
          period: "Mai 2021 - Atual",
          bullets: [
            "Realizo a arrumação de 16 apartamentos por turno, entre saídas e ocupados, cumprindo o padrão de tempo definido pela governança",
            "Mantenho aprovação acima de 95% nas inspeções de qualidade realizadas pela governanta, sem retrabalho registrado",
            "Executo a limpeza completa conforme checklist: banheiro, enxoval, aspiração, reposição de amenidades e conferência de frigobar",
            "Realizo o controle de enxoval sujo e limpo junto à rouparia, com registro de peças danificadas e faltantes",
            "Registro e encaminho itens de achados e perdidos conforme o procedimento do hotel, com histórico sem ocorrência",
            "Utilizo produtos de limpeza na diluição correta conforme ficha técnica, reduzindo consumo e preservando o mobiliário",
            "Reporto à manutenção as ocorrências encontradas nos apartamentos (elétrica, hidráulica, mobiliário) para correção antes da próxima ocupação",
          ],
        },
        {
          role: "Auxiliar de Limpeza e Camareira",
          company: "Pousada Recanto do Vale (32 apartamentos)",
          period: "Fev 2018 - Abr 2021",
          bullets: [
            "Atuei na arrumação dos apartamentos e na limpeza das áreas sociais, incluindo recepção, corredores e área de café da manhã",
            "Apoiei o serviço de café da manhã em períodos de alta ocupação, com reposição e organização do buffet",
            "Realizei a lavagem e organização do enxoval na rouparia interna da pousada",
            "Atendi hóspedes com cortesia, encaminhando solicitações à recepção quando necessário",
          ],
        },
      ],
      education: [
        {
          degree: "Curso de Camareira em Meios de Hospedagem",
          institution: "SENAC",
          period: "2019",
        },
        {
          degree: "Ensino Médio Completo",
          institution: "EE Santa Terezinha",
          period: "Concluído em 2017",
        },
      ],
      skills: [
        "Arrumação de apartamento de saída e ocupado",
        "Padrão de limpeza e checklist de qualidade",
        "Controle de enxoval e rouparia",
        "Reposição de amenidades e frigobar",
        "Diluição correta de produtos de limpeza",
        "Achados e perdidos",
        "Comunicação com governança e manutenção",
        "Atendimento cordial ao hóspede",
      ],
    },
    keySkills: [
      "Arrumação de apartamentos (saída, ocupado e vago limpo)",
      "Execução de checklist e padrão de qualidade da governança",
      "Controle de enxoval, rouparia e reposição",
      "Reposição de amenidades, frigobar e materiais",
      "Uso correto e diluição de produtos de limpeza",
      "Limpeza de áreas sociais e de circulação",
      "Procedimento de achados e perdidos",
      "Reporte de manutenção e ocorrências no apartamento",
      "Discrição, confiabilidade e respeito à privacidade do hóspede",
      "Produtividade e gestão do tempo por apartamento",
    ],
    atsKeywords: [
      "Camareira",
      "Hotelaria",
      "Arrumação de Apartamentos",
      "Governança",
      "Governanta",
      "Enxoval",
      "Rouparia",
      "Amenidades",
      "Frigobar",
      "Checklist de Limpeza",
      "Apartamento de Saída",
      "Áreas Sociais",
      "Achados e Perdidos",
      "Produtos de Limpeza",
      "Diluição",
      "Atendimento ao Hóspede",
      "Hotel",
      "Pousada",
      "Resort",
      "Escala 6x1",
    ],
    salaryNote:
      "No Brasil (2026), a camareira costuma receber entre R$ 1.600 e R$ 2.300, com adicional de insalubridade em algumas operações, além de refeição no local e, em alguns hotéis, participação na taxa de serviço. Hotéis de categoria superior, resorts e redes internacionais tendem a pagar acima da média e a exigir padrão de qualidade mais rigoroso. Supervisoras e governantas recebem acima dessa faixa. O piso é definido pela convenção coletiva do sindicato de hotelaria da região.",
    dos: [
      "Informe a produtividade: número de apartamentos arrumados por turno, separando saídas e ocupados.",
      "Cite o porte do meio de hospedagem: número de apartamentos, categoria (hotel executivo, resort, pousada).",
      "Destaque a taxa de aprovação nas inspeções da governanta — é o indicador de qualidade da função.",
      "Mencione controle de enxoval e rouparia, que amplia o escopo além da arrumação.",
      "Registre o histórico com achados e perdidos: comunica confiabilidade de forma concreta.",
      "Cite o curso de camareira em meios de hospedagem, que é bem valorizado na triagem hoteleira.",
    ],
    donts: [
      "Não escreva apenas 'fazia a limpeza dos quartos' — descreva o padrão, o checklist e a produtividade.",
      "Não omita o porte do hotel: a rotina de uma pousada de 30 quartos e de um hotel de 300 é muito diferente.",
      "Não deixe de citar a inspeção de qualidade, que é como o trabalho é avaliado na hotelaria.",
      "Não ignore a parte de reporte de manutenção, que mostra visão de operação e não só de limpeza.",
      "Não confunda camareira com auxiliar de limpeza: descreva as rotinas específicas de hospedagem.",
      "Não deixe de informar disponibilidade para escala 6x1, feriados e alta temporada.",
    ],
    faqs: [
      {
        question: "O que faz uma camareira de hotel?",
        answer:
          "A camareira é responsável pela arrumação e higienização dos apartamentos e, em muitos hotéis, também das áreas sociais. A rotina inclui limpeza completa do quarto e do banheiro, troca e conferência do enxoval, aspiração, reposição de amenidades e do frigobar, organização do carrinho de trabalho, conferência do apartamento conforme checklist e reporte de ocorrências à manutenção. Também é dela a responsabilidade de registrar itens de achados e perdidos segundo o procedimento do hotel. O trabalho é avaliado por dois critérios objetivos: produtividade (apartamentos por turno) e qualidade (aprovação nas inspeções da governanta).",
      },
      {
        question: "Quantos apartamentos uma camareira arruma por dia?",
        answer:
          "Varia conforme a categoria do hotel, o tamanho dos apartamentos e a proporção entre saídas e ocupados — apartamentos de saída dão bem mais trabalho. Em hotéis econômicos e executivos, é comum uma faixa entre 14 e 18 apartamentos por turno; em hotéis de categoria superior e resorts, o número costuma ser menor, porque o padrão de acabamento é mais exigente. No currículo, informe a sua média real e o contexto: 'média de 16 apartamentos por turno, entre saídas e ocupados, em hotel de 140 apartamentos'. Esse dado permite ao recrutador avaliar seu ritmo, e quase nenhum currículo da área o traz.",
      },
      {
        question: "Como fazer currículo de camareira sem experiência em hotel?",
        answer:
          "Aproveite qualquer experiência de limpeza — residencial, comercial, hospitalar — e traduza para o vocabulário da hotelaria: padrão de limpeza, checklist, uso e diluição de produtos, organização de rotina, discrição em ambiente com pertences alheios. Destaque a disponibilidade para escala 6x1, feriados e alta temporada, que é essencial no setor. Se possível, faça o curso de camareira em meios de hospedagem antes de procurar vaga: é curto e coloca o seu currículo em outro patamar na triagem. E mostre no resumo que você entende a função — mencionar arrumação de saída e ocupado, enxoval e reporte de manutenção já sinaliza preparo.",
      },
      {
        question: "Como demonstrar confiabilidade no currículo de camareira?",
        answer:
          "Com fatos ligados à natureza do trabalho. O mais forte é o histórico com achados e perdidos: 'Registro e encaminho itens de achados e perdidos conforme o procedimento do hotel, com histórico sem ocorrência'. Isso comunica diretamente que você lida com pertences de hóspedes de forma íntegra, que é a maior preocupação do empregador nessa função. Complemente com a taxa de aprovação nas inspeções, tempo de casa nos empregos anteriores e menção de que pode apresentar referências. Evite escrever apenas 'sou honesta e responsável' — todo currículo diz isso, e nenhum comprova.",
      },
      {
        question: "Qual a diferença entre camareira e auxiliar de limpeza?",
        answer:
          "A camareira atua especificamente em meios de hospedagem e domina rotinas próprias do setor: arrumação de apartamento de saída e ocupado, montagem de cama com padrão do hotel, controle de enxoval junto à rouparia, reposição de amenidades e frigobar, checklist da governança e trato direto, ainda que discreto, com hóspedes. O auxiliar de limpeza atua em ambientes diversos — escritórios, escolas, hospitais, condomínios — com foco em higienização de áreas. Se você busca vaga em hotelaria, use o termo camareira no título do currículo e descreva as rotinas com o vocabulário do setor; isso muda o resultado na triagem.",
      },
      {
        question: "Como crescer na carreira dentro da hotelaria?",
        answer:
          "O caminho natural na governança é camareira, supervisora de andar e governanta, com possibilidade de migrar para outras áreas do hotel, como recepção e eventos. Três coisas aceleram esse percurso. Primeira, produtividade e qualidade consistentes, com histórico de aprovação nas inspeções. Segunda, ampliar o escopo: aprender rouparia, controle de estoque de enxoval e amenidades, escala e distribuição de andares. Terceira, formação: cursos de governança hoteleira e de gestão de equipes. No currículo, registre sempre que tiver substituído a supervisora, treinado colegas novas ou respondido pelo andar — é essa evidência que sustenta a promoção.",
      },
    ],
  },
];
