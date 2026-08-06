import type { Guide } from "./types";

// Cluster "LinkedIn e marca pessoal". Pilar: `como-fazer-um-bom-linkedin`.
// A interface do LinkedIn muda com frequência — evite descrever caminhos de menu
// passo a passo e prefira descrever o que fazer, não onde clicar.
export const GUIDES_LINKEDIN: Guide[] = [
  {
    slug: "como-fazer-um-bom-linkedin",
    metaTitle: "Como Fazer um Bom LinkedIn: Guia Completo do Perfil (2026)",
    h1: "Como Fazer um Bom LinkedIn: O Guia Completo do Perfil ao Networking",
    metaDescription:
      "Como montar um perfil do LinkedIn que atrai recrutadores: foto, título, seção Sobre, experiências, competências, palavras-chave e o que publicar.",
    intro:
      "O LinkedIn é hoje a principal ferramenta de busca de talentos no Brasil corporativo — e a maioria dos perfis é uma versão pior do currículo, com o cargo no título, a seção 'Sobre' vazia e nenhuma palavra-chave. Isso importa porque recrutadores não navegam pelo LinkedIn: eles pesquisam por termos específicos e olham os primeiros resultados. Se o seu perfil não contém as palavras que eles digitam, ele simplesmente não existe naquela busca. Este guia mostra como montar cada seção do perfil com esse funcionamento em mente, o que escrever em cada campo, como aparecer nas buscas certas e como usar a plataforma sem virar produtor de conteúdo em tempo integral.",
    pillar: true,
    sections: [
      {
        heading: "Como recrutadores realmente encontram você",
        body: [
          "Antes de qualquer ajuste estético, entenda a mecânica. Recrutadores usam ferramentas de busca dentro da plataforma e digitam termos: nome do cargo, ferramenta, certificação, localidade, setor. O sistema devolve uma lista ordenada, e a decisão de clicar acontece a partir de três elementos visíveis na prévia — foto, nome e título.",
          "Isso tem duas implicações práticas. A primeira é que o seu perfil precisa conter, literalmente, as palavras que os recrutadores digitam. Se as vagas da sua área falam em 'analista de suporte' e o seu título diz 'apaixonado por tecnologia', você não aparece na busca por analista de suporte.",
          "A segunda é que a prévia decide o clique. Um título genérico ou vago, mesmo em um perfil excelente, perde para um título específico de um perfil mediano — porque o segundo é o que é aberto.",
          "Há ainda um fator de completude: perfis com todas as seções preenchidas tendem a aparecer melhor nas buscas e transmitem mais confiança. Não é preciso perseguir métricas internas da plataforma, mas vale garantir que nenhuma seção relevante fique vazia.",
          "A conclusão é direta: otimizar o LinkedIn é, em grande parte, um trabalho de escolher as palavras certas e distribuí-las nos campos que o mecanismo de busca lê — título, sobre, experiências e competências.",
        ],
        bullets: [
          "Recrutadores buscam por termos específicos; você precisa conter esses termos",
          "Foto, nome e título decidem o clique na lista de resultados",
          "Perfis completos aparecem melhor e transmitem mais confiança",
          "Otimizar LinkedIn = escolher palavras-chave e distribuí-las nos campos certos",
        ],
      },
      {
        heading: "Foto, capa e a primeira impressão",
        body: [
          "A foto de perfil é o elemento mais visível e um dos mais negligenciados. Ela não precisa ser feita por profissional, mas precisa cumprir alguns requisitos: rosto ocupando a maior parte do quadro, expressão amigável, boa iluminação, fundo neutro e roupa compatível com o padrão da sua área.",
          "Evite foto cortada de evento social, foto com outras pessoas, imagem com filtro pesado, foto muito antiga ou selfie em ambiente inadequado. Uma foto tirada com celular, de frente para uma janela, com fundo de parede lisa, resolve bem — é o cenário mais acessível e um dos melhores.",
          "A imagem de capa é um espaço grande e quase sempre desperdiçado com o padrão azul da plataforma. Use algo simples que reforce a sua área: uma imagem sóbria relacionada ao setor, uma foto sua em contexto profissional ou uma faixa com o seu posicionamento em uma frase. Não precisa ser elaborado; precisa não ser vazio.",
          "Personalize também o endereço do seu perfil, deixando-o curto e com o seu nome. Além de ficar melhor no currículo e na assinatura de e-mail, um endereço limpo transmite cuidado.",
          "Por fim, confira o nome: use o nome pelo qual você é conhecido profissionalmente, sem emojis, sem cargos anexados e sem letras maiúsculas em excesso.",
        ],
        bullets: [
          "Foto com rosto em destaque, luz frontal, fundo neutro e expressão amigável",
          "Evite foto de evento, com terceiros, com filtro pesado ou muito antiga",
          "Use a capa: qualquer coisa sóbria e relacionada à área supera o padrão vazio",
          "Personalize o endereço do perfil com o seu nome",
          "Nome limpo, sem emoji nem cargo anexado",
        ],
      },
      {
        heading: "Título: o campo mais importante do perfil",
        body: [
          "O título é a linha que aparece embaixo do seu nome em todos os lugares da plataforma — nas buscas, nos comentários, nos convites. É o campo com maior peso na sua descoberta e o mais mal utilizado.",
          "O erro mais comum é usar apenas o cargo atual ('Analista na Empresa X'). Isso desperdiça espaço e restringe a busca: você aparece só para quem procura pelo seu cargo exato. O segundo erro é o oposto, com frases motivacionais que não contêm nenhum termo pesquisável.",
          "Uma fórmula que funciona combina três blocos: função principal, especialidade ou ferramentas, e um diferencial ou segmento. Por exemplo: 'Analista de Dados | SQL, Power BI e Python | Varejo e E-commerce'. Ou, para uma função operacional: 'Técnico de Enfermagem | UTI Adulto e Emergência | COREN-SP ativo'.",
          "Se você está em busca de recolocação, pode sinalizar, mas sem que isso ocupe o título inteiro: 'Assistente Administrativo | Rotinas Fiscais e ERP TOTVS | Aberto a novas oportunidades'. O que não funciona é um título composto apenas por 'Em busca de oportunidade', porque não contém nenhuma palavra que alguém pesquisaria.",
          "Se você está em transição de carreira, use o título para o alvo, não para o passado — com honestidade sobre o momento: 'Em transição para Análise de Dados | Formação em SQL e Power BI | 8 anos em Operações de Varejo'.",
        ],
        bullets: [
          "Fórmula: função principal | especialidade ou ferramentas | segmento ou diferencial",
          "Só o cargo atual desperdiça o campo mais valioso do perfil",
          "Frase motivacional sem termo pesquisável não aparece em busca nenhuma",
          "Em busca de vaga: sinalize, mas não ocupe o título inteiro com isso",
          "Em transição: aponte o título para o alvo, com honestidade sobre o momento",
        ],
      },
      {
        heading: "A seção Sobre: como escrever e o que incluir",
        body: [
          "A seção 'Sobre' é o espaço em que você conta a sua história em primeira pessoa. Perfis com essa seção vazia perdem uma oportunidade grande: é o campo mais livre e um dos que o mecanismo de busca lê.",
          "Escreva em primeira pessoa, com naturalidade. Terceira pessoa ('João é um profissional dedicado...') soa institucional e distante. O tom deve ser o de alguém se apresentando em uma conversa profissional.",
          "Uma estrutura eficiente tem quatro partes: quem você é profissionalmente hoje, o que você faz bem com evidência concreta, os resultados ou marcos mais relevantes e o que você busca ou como te procurar. Entre três e cinco parágrafos curtos.",
          "As primeiras duas linhas são as únicas visíveis antes de o leitor clicar em 'ver mais' — então elas precisam prender. Comece pelo essencial, não por uma introdução genérica.",
          "Distribua naturalmente as palavras-chave da sua área: ferramentas, metodologias, tipos de projeto, setores. E encerre com um chamado simples: como falar com você e para que assunto ('me chame para falar sobre projetos de automação de rotinas fiscais').",
          "Evite três coisas: adjetivos sem prova, frases motivacionais de autoajuda e a lista de qualidades que aparece em todo perfil (proativo, dinâmico, comprometido).",
        ],
        bullets: [
          "Escreva em primeira pessoa, entre 3 e 5 parágrafos curtos",
          "As duas primeiras linhas são as únicas visíveis: comece pelo essencial",
          "Estrutura: quem você é, o que faz bem, resultados, o que busca",
          "Distribua palavras-chave da área de forma natural",
          "Termine com um chamado claro sobre como e para que te procurar",
        ],
      },
      {
        heading: "Experiências, competências e recomendações",
        body: [
          "A seção de experiências não deve ser uma cópia literal do currículo, mas segue a mesma lógica: resultados em vez de atribuições. A diferença é que aqui você tem mais espaço e pode contextualizar — descrever a empresa, o escopo e o desafio de cada posição em uma linha antes dos resultados.",
          "Use de três a cinco pontos por experiência recente, com números sempre que possível. Inclua também as ferramentas e os sistemas usados: eles são termos de busca frequentes e costumam ficar de fora.",
          "Não deixe posições sem descrição. Cargo e datas sozinhos não dizem nada e desperdiçam espaço indexável. Se uma experiência antiga não é relevante, mantenha-a com uma linha curta, ou reduza o histórico às posições que sustentam o seu alvo atual.",
          "Nas competências, escolha as que realmente importam para o seu objetivo e organize por prioridade — as primeiras têm mais destaque. Peça validações a colegas que possam confirmá-las de verdade; validações em massa por desconhecidos têm pouco valor.",
          "As recomendações são o elemento com maior peso de credibilidade e o menos usado. Peça a ex-gestores, colegas próximos e clientes, de forma específica: em vez de 'você pode me recomendar?', sugira o ângulo ('se puder comentar sobre o projeto de implantação que conduzimos juntos, ajudaria muito'). Recomendações genéricas ajudam pouco; recomendações concretas valem muito. E recomende de volta — é a forma mais eficiente de receber.",
        ],
        bullets: [
          "Experiências com contexto em uma linha + 3 a 5 resultados com números",
          "Cite ferramentas e sistemas: são termos de busca frequentes",
          "Nunca deixe uma posição só com cargo e datas",
          "Ordene as competências por prioridade e peça validação a quem realmente sabe",
          "Peça recomendações sugerindo o ângulo — genéricas valem pouco",
        ],
      },
      {
        heading: "Como aparecer nas buscas certas",
        body: [
          "A otimização de perfil segue a mesma lógica de um currículo compatível com triagem automática: identificar os termos que importam e usá-los nos lugares certos, sem forçar.",
          "Para descobrir os termos, leia de dez a quinze anúncios de vagas que você gostaria de ocupar e anote as palavras que se repetem: nome do cargo (e suas variações), ferramentas, metodologias, certificações, tipos de projeto e vocabulário do setor. Essa é a sua lista.",
          "Distribua esses termos em quatro lugares: título, seção 'Sobre', descrições de experiência e competências. A repetição natural entre esses campos reforça a associação sem parecer artificial. Cuidado com o excesso: parágrafos que são listas de palavras-chave prejudicam a leitura humana, que é quem decide no fim.",
          "Preencha também os campos de localidade e setor corretamente, porque muitas buscas filtram por eles. Se você busca vagas remotas em outra região, sinalize essa disponibilidade no 'Sobre' e nas preferências de vaga.",
          "Considere a versão em inglês do perfil se você busca posições internacionais ou empresas com processos em inglês — a plataforma permite manter perfis em mais de um idioma, e recrutadores estrangeiros pesquisam em inglês.",
          "Por fim, mantenha o perfil público visível. Um perfil restrito não aparece em buscas externas e reduz bastante a chance de descoberta.",
        ],
        bullets: [
          "Extraia termos de 10 a 15 anúncios de vagas do seu alvo",
          "Distribua em título, Sobre, experiências e competências",
          "Preencha localidade e setor: muitas buscas filtram por eles",
          "Perfil em inglês para processos internacionais",
          "Mantenha a visibilidade pública ativada",
        ],
      },
      {
        heading: "Atividade na plataforma: o mínimo que funciona",
        body: [
          "Não é preciso virar produtor de conteúdo para o LinkedIn ser útil. Existe um nível mínimo de atividade que gera resultado sem consumir a sua semana.",
          "O mais eficiente é comentar. Comentários relevantes em publicações de pessoas da sua área expõem o seu perfil a redes maiores que a sua e geram conversas reais. Um comentário que acrescenta uma informação ou uma experiência concreta funciona; 'ótimo conteúdo!' não funciona.",
          "Publicar é opcional, mas ajuda. Se decidir publicar, escolha o que você sabe de verdade: um problema que resolveu, um aprendizado prático, uma explicação de algo técnico em linguagem simples. Uma publicação por semana ou até por mês, consistente e útil, vale mais do que uma sequência intensa e abandonada.",
          "Conecte-se com propósito. Aceite convites de pessoas da sua área e envie convites com nota curta explicando o motivo — convites sem contexto para desconhecidos têm baixa taxa de aceite e pouca utilidade.",
          "Siga empresas do seu interesse e recrutadores do seu setor. Isso mantém você informado sobre vagas e movimentações, e aumenta a chance de aparecer para as pessoas certas.",
          "Reserve de 15 a 30 minutos por semana. Esse é o volume que a maioria dos profissionais consegue sustentar e é suficiente para manter o perfil ativo e visível.",
        ],
        bullets: [
          "Comentar é mais eficiente do que publicar — se o comentário acrescentar algo",
          "Publicar é opcional; consistência vale mais do que volume",
          "Envie convites com nota curta explicando o motivo",
          "Siga empresas-alvo e recrutadores do seu setor",
          "15 a 30 minutos por semana já sustentam um perfil ativo",
        ],
      },
      {
        heading: "Erros que afastam recrutadores",
        body: [
          "Alguns problemas são tão comuns que se tornaram invisíveis para quem os comete. O primeiro é o perfil incompleto: sem foto, sem 'Sobre', com experiências apenas listadas. Ele passa a impressão de descuido e simplesmente não aparece nas buscas.",
          "O segundo é a incoerência entre currículo e LinkedIn: cargos com nomes diferentes, datas que não batem, experiências que aparecem em um e não no outro. Recrutadores comparam os dois com frequência, e divergências levantam dúvida.",
          "O terceiro é o excesso de conteúdo pessoal e opinativo fora do contexto profissional. Não existe uma regra rígida, mas vale lembrar que o perfil é lido por quem está avaliando você para uma vaga.",
          "O quarto é o pedido de emprego direto para desconhecidos, especialmente em massa. Mensagens do tipo 'oi, tem vaga aí?' têm taxa de resposta próxima de zero. Um pedido específico de conversa sobre a área funciona muito melhor.",
          "O quinto é o título ocupado inteiramente por 'em busca de recolocação', que sinaliza o momento mas elimina os termos que fariam você ser encontrado.",
          "E o sexto, mais silencioso: abandonar o perfil por anos. Um LinkedIn com o cargo de dois empregos atrás comunica desatualização mesmo quando a pessoa está totalmente atualizada.",
        ],
        bullets: [
          "Perfil incompleto: sem foto, sem Sobre, experiências sem descrição",
          "Divergência entre currículo e LinkedIn em cargos e datas",
          "Pedido de emprego direto e em massa para desconhecidos",
          "Título ocupado só por 'em busca de recolocação'",
          "Perfil desatualizado por anos comunica estagnação",
        ],
      },
    ],
    keyTakeaways: [
      "Recrutadores pesquisam por termos específicos: se o seu perfil não contém essas palavras, ele não aparece.",
      "O título é o campo mais importante — use função, especialidade e segmento em vez de apenas o cargo atual.",
      "A seção 'Sobre' deve ser em primeira pessoa, com as duas primeiras linhas prendendo a atenção antes do 'ver mais'.",
      "Experiências precisam de resultados com números e das ferramentas usadas, que são termos de busca frequentes.",
      "Recomendações específicas são o elemento de maior credibilidade e o menos utilizado — peça sugerindo o ângulo.",
      "De 15 a 30 minutos por semana comentando e conectando com propósito já mantêm o perfil ativo e visível.",
    ],
    faqs: [
      {
        question: "O que escrever no título do LinkedIn?",
        answer:
          "Combine três blocos: função principal, especialidade ou ferramentas e um diferencial ou segmento. Por exemplo: 'Analista de Dados | SQL, Power BI e Python | Varejo e E-commerce' ou 'Técnico de Enfermagem | UTI Adulto e Emergência | COREN-SP ativo'. Evite usar apenas o cargo atual com o nome da empresa, porque isso restringe a sua descoberta a quem pesquisa exatamente aquele termo, e evite frases motivacionais sem nenhuma palavra pesquisável. Se você está em busca de recolocação, pode sinalizar ao final, mas sem ocupar o campo inteiro — um título só com 'em busca de oportunidades' elimina justamente os termos que fariam você aparecer.",
      },
      {
        question: "Preciso publicar conteúdo no LinkedIn para ser encontrado?",
        answer:
          "Não. A descoberta por recrutadores depende principalmente do perfil — título, seção 'Sobre', experiências e competências —, não de publicações. Publicar ajuda a ampliar alcance e credibilidade, mas é opcional. Se você quiser um retorno melhor com pouco esforço, comente em publicações de pessoas da sua área: comentários relevantes expõem o seu perfil a redes maiores que a sua e geram conversas reais, com custo de tempo muito menor do que produzir conteúdo. De 15 a 30 minutos por semana comentando, conectando com propósito e mantendo o perfil atualizado costuma ser suficiente.",
      },
      {
        question: "O LinkedIn substitui o currículo?",
        answer:
          "Não substitui, mas complementa e muitas vezes chega antes. A maior parte dos processos ainda pede currículo em PDF para a candidatura formal, especialmente onde há triagem automática. O LinkedIn cumpre outra função: é onde recrutadores procuram ativamente candidatos e onde acontece a checagem informal de quem se candidatou. Por isso, os dois precisam estar coerentes — cargos com os mesmos nomes, datas que batem, resultados alinhados. Divergências entre os dois documentos são notadas com frequência e levantam dúvida desnecessária. Trate o LinkedIn como a versão mais rica e contextualizada do currículo, não como uma cópia.",
      },
      {
        question: "Devo colocar todas as minhas experiências no LinkedIn?",
        answer:
          "Não necessariamente. Vale incluir as experiências que sustentam o seu objetivo atual, com descrição real de resultados, e reduzir ou resumir as que não têm relação. Empregos muito antigos ou de áreas completamente distintas podem ficar apenas com cargo, empresa e período, sem detalhamento — ou serem omitidos, se prejudicarem a clareza da sua narrativa. O que não funciona é o perfil com dez posições listadas e nenhuma descrita: além de não dizer nada, desperdiça espaço que o mecanismo de busca leria. Coerência com o currículo é o único limite: evite que uma experiência apareça em um e não no outro sem explicação.",
      },
      {
        question: "Qual é a melhor foto para o perfil do LinkedIn?",
        answer:
          "Uma foto recente, com o rosto ocupando a maior parte do quadro, expressão amigável, boa iluminação frontal, fundo neutro e roupa compatível com o padrão da sua área. Não precisa ser feita por profissional: uma foto de celular tirada de frente para uma janela, com uma parede lisa atrás, funciona muito bem. Evite fotos cortadas de eventos sociais, imagens com outras pessoas, filtros pesados, óculos escuros e fotos muito antigas. Perfis sem foto recebem consideravelmente menos visualizações, então mesmo uma foto simples é melhor do que nenhuma — e ela é um dos três elementos que decidem o clique na lista de resultados.",
      },
      {
        question: "Como pedir recomendações no LinkedIn?",
        answer:
          "Peça de forma específica e para pessoas que realmente conhecem o seu trabalho: ex-gestores, colegas próximos de projeto, clientes. Em vez de um pedido genérico, sugira o ângulo: 'Se puder comentar sobre o projeto de implantação que conduzimos juntos, especialmente sobre a parte de treinamento das equipes, ajudaria bastante.' Isso facilita a vida de quem vai escrever e produz uma recomendação concreta, que vale muito mais do que elogios vagos. Recomende de volta, de preferência antes de pedir — é a forma mais eficiente de receber. E prefira poucas recomendações fortes a muitas genéricas.",
      },
    ],
    relatedSlugs: [
      "titulo-do-linkedin",
      "resumo-do-linkedin",
      "open-to-work-linkedin",
      "networking-profissional",
      "como-fazer-um-curriculo",
    ],
  },
  {
    slug: "titulo-do-linkedin",
    metaTitle: "Título do LinkedIn: 30 Exemplos Prontos por Área (2026)",
    h1: "Título do LinkedIn: Como Escrever e 30 Exemplos por Profissão",
    metaDescription:
      "Como escrever o título do LinkedIn para aparecer nas buscas: a fórmula em 3 blocos, limite de caracteres e 30 exemplos prontos por área e por situação.",
    intro:
      "O título do LinkedIn é a linha embaixo do seu nome e, disparado, o campo mais decisivo do perfil. Ele aparece em todo lugar — nas buscas de recrutadores, nos seus comentários, nos convites que você envia — e é o que faz alguém clicar ou seguir adiante. Mesmo assim, a maioria dos perfis brasileiros usa esse espaço para repetir o cargo com o nome da empresa, o que restringe drasticamente a descoberta. Este guia mostra a fórmula que funciona, o que evitar, como adaptar o título quando você está desempregado ou em transição e traz 30 exemplos prontos organizados por área para você copiar e ajustar.",
    sections: [
      {
        heading: "Por que o título define se você é encontrado",
        body: [
          "Recrutadores encontram candidatos digitando termos em uma busca — cargo, ferramenta, certificação, especialidade. O resultado é uma lista, e o que aparece nela é: foto, nome e título. Nada mais.",
          "Isso significa que o título faz dois trabalhos ao mesmo tempo. Primeiro, ele precisa conter as palavras que fazem você aparecer na busca. Segundo, precisa ser específico o bastante para que a pessoa clique no seu perfil em vez de no de baixo.",
          "Um título que diz apenas 'Analista na Empresa X' falha nos dois: só aparece para quem busca por 'analista' de forma ampla, e não diferencia você de centenas de outros resultados. Já 'Analista Financeiro | Fluxo de Caixa, Conciliação e SAP | Indústria' aparece em cinco ou seis buscas diferentes e comunica escopo imediatamente.",
          "O título também acompanha você em toda interação na plataforma. Quando você comenta em uma publicação, é ele que aparece ao lado do seu nome — funcionando como uma apresentação constante para pessoas que ainda não te conhecem.",
        ],
        bullets: [
          "Nas buscas, só aparecem foto, nome e título — nada além disso",
          "O título precisa conter os termos pesquisados E diferenciar você",
          "Um bom título faz você aparecer em várias buscas diferentes",
          "Ele acompanha cada comentário e convite: é uma apresentação constante",
        ],
      },
      {
        heading: "A fórmula em três blocos",
        body: [
          "A estrutura mais eficiente combina três elementos separados por barras ou travessões: função principal, especialidade ou ferramentas e segmento ou diferencial.",
          "O primeiro bloco é o cargo ou a função, escrito como o mercado escreve. Use o termo mais buscado, não o nome interno da sua empresa: se a sua carteira diz 'Especialista de Processos Nível II', escreva 'Analista de Processos'. Cargos internos criativos não são pesquisados por ninguém.",
          "O segundo bloco traz as especialidades, ferramentas ou metodologias que definem o seu perfil. É aqui que entram os termos que os anúncios de vaga repetem: sistemas, linguagens, certificações, tipos de rotina. Escolha de dois a quatro — os mais relevantes para o que você busca, não todos que você conhece.",
          "O terceiro bloco diferencia: o setor em que você atua, o porte de empresa, uma certificação de peso, um resultado ou o seu posicionamento. É o que faz o clique acontecer quando dois perfis parecem parecidos.",
          "O campo comporta um número limitado de caracteres, então priorize. Se precisar cortar, mantenha sempre o primeiro bloco completo e reduza o terceiro.",
        ],
        bullets: [
          "Bloco 1: função escrita como o mercado escreve, não o cargo interno",
          "Bloco 2: de 2 a 4 especialidades, ferramentas ou metodologias",
          "Bloco 3: segmento, certificação, porte ou posicionamento",
          "Separe com barras ou travessões para leitura rápida",
          "Se precisar cortar, preserve o primeiro bloco e reduza o terceiro",
        ],
      },
      {
        heading: "30 exemplos prontos por área",
        body: [
          "Adapte os modelos abaixo às suas ferramentas e ao seu setor. Eles servem como estrutura, não como texto fixo.",
          "Administrativo e financeiro: 'Analista Administrativo | Rotinas Fiscais, Contratos e ERP TOTVS | Indústria'. 'Assistente Financeiro | Contas a Pagar e Receber, Conciliação Bancária e Excel Avançado'. 'Analista Financeiro | Fluxo de Caixa, Orçamento e SAP | Varejo'. 'Auxiliar Administrativo | Atendimento, Documentação e Controle de Planilhas'. 'Controller | Custos, Orçamento e Fechamento Contábil | Indústria de Médio Porte'.",
          "Comercial e atendimento: 'Vendedor Externo | Prospecção, Negociação e CRM | Distribuição'. 'Supervisor de Atendimento | Gestão de Equipe, SLA e Satisfação do Cliente'. 'Consultor de Vendas | Vendas Consultivas B2B | Tecnologia'. 'Operador de Telemarketing | Retenção e Vendas Ativas | Telecom'. 'Gerente de Loja | Gestão de Equipe, Metas e Visual Merchandising | Varejo de Moda'.",
          "Tecnologia e dados: 'Desenvolvedor Full Stack | React, Node.js e AWS'. 'Analista de Dados | SQL, Power BI e Python | Varejo e E-commerce'. 'Analista de Suporte | Service Desk, ITIL e Windows Server'. 'Analista de Infraestrutura | Redes, Firewall e Cloud Azure'. 'QA / Analista de Testes | Automação com Cypress e Testes de API'.",
          "Saúde: 'Enfermeira | UTI Adulto e Urgência | COREN-SP ativo'. 'Técnico de Enfermagem | Centro Cirúrgico e Emergência | COREN-MG'. 'Fisioterapeuta | Ortopedia e Reabilitação Pós-Cirúrgica | CREFITO'. 'Farmacêutico | Farmácia Clínica e Manipulação | CRF-SP'. 'Nutricionista | Nutrição Clínica e Ambulatorial | CRN-3'.",
          "Operacional e logística: 'Auxiliar de Produção | Linha de Montagem, 5S e Boas Práticas de Fabricação'. 'Almoxarife | Controle de Estoque, Inventário e WMS'. 'Motorista Carreteiro | CNH E, MOPP e Rastreamento'. 'Soldador | MIG/MAG e TIG | Qualificação em Estruturas Metálicas'. 'Operador de Empilhadeira | Elétrica e a Gás | NR-11 em dia'.",
          "Marketing, RH e educação: 'Analista de Marketing Digital | Tráfego Pago, Google Ads e Meta Ads'. 'Social Media | Produção de Conteúdo, Copy e Gestão de Comunidade'. 'Analista de RH | Recrutamento e Seleção, Onboarding e Gupy'. 'Professor de Matemática | Ensino Fundamental II e Médio | Metodologias Ativas'. 'Designer Gráfico | Identidade Visual, Social Media e Adobe Creative Suite'.",
        ],
        bullets: [
          "Use o cargo como o mercado escreve, não como a empresa chama internamente",
          "Inclua certificações e registros de conselho quando forem filtro de vaga",
          "Para funções operacionais, cite as normas e habilitações exigidas",
          "Para áreas técnicas, priorize as ferramentas mais pedidas nos anúncios",
        ],
      },
      {
        heading: "Título para quem está desempregado ou em transição",
        body: [
          "Estas são as duas situações em que a maioria dos títulos falha, justamente quando o perfil mais precisa funcionar.",
          "Se você está em busca de recolocação, o erro clássico é preencher o campo inteiro com 'em busca de oportunidades' ou 'profissional disponível para novos desafios'. Isso comunica o seu momento e elimina todos os termos que fariam alguém te encontrar — ninguém pesquisa por 'em busca de oportunidades'.",
          "A solução é manter a estrutura de três blocos e adicionar a sinalização no fim, se você quiser deixá-la explícita: 'Analista Contábil | SPED, Escrituração Fiscal e Domínio | Aberto a novas oportunidades'. Você aparece nas buscas por analista contábil e ainda sinaliza disponibilidade.",
          "Vale lembrar que a plataforma tem um recurso próprio para sinalizar disponibilidade a recrutadores, que pode ser ativado sem alterar o título. Para muita gente, essa é a melhor combinação: título otimizado por competência e disponibilidade sinalizada pelo recurso da plataforma.",
          "Em transição de carreira, aponte o título para o alvo, com honestidade sobre a origem: 'Em transição para Análise de Dados | SQL e Power BI | 8 anos em Operações de Varejo'. Isso posiciona você na busca certa, explica o movimento e transforma a experiência anterior em contexto, não em contradição.",
        ],
        bullets: [
          "Nunca use o título inteiro para dizer que está buscando emprego",
          "Mantenha os três blocos e adicione a sinalização no fim, se quiser",
          "Use o recurso de disponibilidade da plataforma em vez do título",
          "Em transição, aponte para o alvo e cite a origem como contexto",
        ],
      },
      {
        heading: "Erros comuns no título",
        body: [
          "O primeiro é o título com apenas o cargo e o nome da empresa. Ele parece profissional e é o que a plataforma preenche automaticamente, mas desperdiça o campo mais valioso do perfil.",
          "O segundo é o excesso de emojis e símbolos decorativos. Um separador visual discreto é aceitável; uma linha cheia de ícones dificulta a leitura e não acrescenta informação pesquisável.",
          "O terceiro são as frases motivacionais e os rótulos vagos: 'apaixonado por pessoas', 'transformando desafios em resultados', 'mente inquieta'. Não contêm termos de busca e ocupam espaço que teria uso melhor.",
          "O quarto é o empilhamento de palavras-chave sem sentido, do tipo 'Analista | Excel | Power BI | SQL | Python | Gestão | Liderança | Processos | Projetos | Dados'. Prejudica a leitura humana e comunica falta de foco.",
          "O quinto é usar cargos internos que ninguém pesquisa, como 'Especialista Nível III' ou nomenclaturas exclusivas da empresa.",
          "E o sexto é deixar o título desatualizado — mantendo um cargo de dois empregos atrás. Além de gerar incoerência com o currículo, comunica abandono do perfil.",
        ],
        bullets: [
          "Só cargo + empresa: desperdiça o campo mais valioso",
          "Excesso de emojis: atrapalha a leitura e não é pesquisável",
          "Frases motivacionais e rótulos vagos não aparecem em busca nenhuma",
          "Empilhar dez palavras-chave comunica falta de foco",
          "Cargos internos que ninguém pesquisa",
          "Título desatualizado gera incoerência com o currículo",
        ],
      },
      {
        heading: "Como testar e ajustar o seu título",
        body: [
          "Depois de escrever, faça três verificações simples que levam poucos minutos.",
          "A primeira é o teste da busca: pesquise na própria plataforma os termos que um recrutador usaria para encontrar alguém como você e veja se o seu perfil aparece. Se não aparecer, provavelmente falta um termo no título ou nas competências.",
          "A segunda é o teste dos anúncios: abra cinco vagas que você gostaria de ocupar e compare o vocabulário delas com o do seu título. Se as vagas dizem 'analista de suporte técnico' e você escreveu 'especialista em tecnologia', o desencontro é claro.",
          "A terceira é o teste dos cinco segundos: mostre o seu título a alguém que não conhece a sua área e pergunte o que você faz. Se a pessoa hesitar, o título está vago demais.",
          "Ajuste o título sempre que mudar de objetivo — não apenas quando mudar de emprego. Se você decidiu buscar posições com foco em outro subtema da sua área, o título deve refletir esse novo alvo antes mesmo de a experiência existir.",
          "E lembre que o título não é uma declaração permanente. Testar variações ao longo de algumas semanas e observar o volume de contatos é uma prática útil e sem custo.",
        ],
        bullets: [
          "Teste 1: busque os termos do recrutador e veja se você aparece",
          "Teste 2: compare o vocabulário do título com o de cinco anúncios reais",
          "Teste 3: mostre a alguém de fora da área e veja se entende em 5 segundos",
          "Atualize ao mudar de objetivo, não só ao mudar de emprego",
          "Testar variações ao longo do tempo é barato e informativo",
        ],
      },
    ],
    keyTakeaways: [
      "O título é o campo mais decisivo do LinkedIn: nas buscas, só aparecem foto, nome e título.",
      "Use a fórmula de três blocos: função + especialidades/ferramentas + segmento ou diferencial.",
      "Escreva a função como o mercado escreve, nunca com o nome interno do cargo da sua empresa.",
      "Desempregado: mantenha os três blocos e sinalize disponibilidade no fim — nunca use o campo inteiro para isso.",
      "Em transição: aponte o título para o alvo e cite a experiência anterior como contexto.",
      "Teste com uma busca real, compare com cinco anúncios e ajuste sempre que mudar de objetivo.",
    ],
    faqs: [
      {
        question: "Quantos caracteres o título do LinkedIn permite?",
        answer:
          "O campo tem um limite de caracteres relativamente generoso, mas na prática o que aparece nas listagens e nos comentários é bem menos do que o total permitido — frequentemente apenas a primeira parte. Por isso, a orientação prática é colocar o essencial no começo: função principal primeiro, depois especialidades e, por último, o diferencial ou segmento. Se precisar cortar, preserve sempre o primeiro bloco íntegro e reduza o terceiro. Escrever um título muito longo não é errado, mas confiar que ele será lido inteiro em todos os contextos é.",
      },
      {
        question: "Devo colocar \"em busca de oportunidades\" no título?",
        answer:
          "Pode colocar, mas nunca no lugar dos termos que fazem você ser encontrado. O erro mais comum é preencher o campo inteiro com essa frase — ninguém pesquisa por 'em busca de oportunidades', então o perfil desaparece das buscas justamente quando mais precisa aparecer. A forma correta é manter a estrutura por competência e adicionar a sinalização no fim: 'Analista Contábil | SPED e Escrituração Fiscal | Aberto a novas oportunidades'. Vale lembrar também que a plataforma oferece um recurso próprio para sinalizar disponibilidade a recrutadores, que funciona sem consumir espaço do título.",
      },
      {
        question: "Posso usar emojis no título do LinkedIn?",
        answer:
          "Com moderação. Um separador visual discreto entre os blocos é aceitável e pode até melhorar a leitura em telas pequenas. O problema é o excesso: títulos cheios de ícones dificultam a leitura, não contêm nenhuma informação pesquisável e, em contextos mais formais, transmitem uma impressão pouco profissional. Como o espaço é limitado e disputado, cada caractere gasto com decoração é um caractere a menos para um termo que poderia fazer você aparecer em uma busca. Se estiver em dúvida, a versão sem emoji é a escolha mais segura em praticamente todas as áreas.",
      },
      {
        question: "O título precisa ser igual ao meu cargo atual?",
        answer:
          "Não, e frequentemente não deve ser. O título é um campo de posicionamento, não um registro contratual — o cargo formal fica na seção de experiências. Duas situações justificam a diferença: quando o nome interno do cargo não é pesquisado por ninguém ('Especialista Nível III', nomenclaturas exclusivas da empresa), caso em que você deve usar o termo de mercado equivalente; e quando você está mirando uma posição diferente da atual, caso em que o título deve apontar para o alvo com honestidade. O limite é não inventar senioridade que você não tem, o que aparece na primeira conversa.",
      },
      {
        question: "Com que frequência devo mudar meu título?",
        answer:
          "Sempre que o seu objetivo mudar — e não apenas quando você mudar de emprego. Se você decidiu buscar posições com foco em outro subtema da sua área, ou passou a dominar uma ferramenta que aparece muito nas vagas que te interessam, o título deve refletir isso. Fora essas mudanças, revisar a cada seis meses é suficiente. Vale também tratar o título como algo testável: alterar uma variação, acompanhar por algumas semanas o volume de visualizações e contatos, e manter a versão que funcionar melhor. É um ajuste barato e reversível.",
      },
      {
        question: "O título influencia se recrutadores me encontram?",
        answer:
          "Diretamente. As buscas feitas por recrutadores dentro da plataforma consideram fortemente o conteúdo do título, e a lista de resultados exibe apenas foto, nome e título — nada mais. Isso significa que ele determina duas coisas: se você entra na lista e se alguém clica. Um perfil excelente com título genérico perde para um perfil mediano com título específico, porque o segundo é o que é aberto. Por isso, extrair os termos de dez a quinze anúncios do seu alvo e garantir que os principais estejam no título é, provavelmente, o ajuste de maior retorno em todo o perfil.",
      },
    ],
    relatedSlugs: [
      "como-fazer-um-bom-linkedin",
      "resumo-do-linkedin",
      "open-to-work-linkedin",
      "objetivo-profissional-no-curriculo",
    ],
  },
  {
    slug: "resumo-do-linkedin",
    metaTitle: "Resumo do LinkedIn (Seção Sobre): Como Escrever + Exemplos 2026",
    h1: "Resumo do LinkedIn: Como Escrever a Seção \"Sobre\" (com Exemplos)",
    metaDescription:
      "Como escrever o resumo do LinkedIn (seção Sobre): estrutura em 4 partes, tamanho ideal, palavras-chave e exemplos prontos por área e por situação.",
    intro:
      "A seção 'Sobre' é o único espaço do LinkedIn em que você escreve livremente sobre si — e é justamente a que mais gente deixa em branco. Perfis sem essa seção parecem currículos truncados: cargos e datas sem nenhuma narrativa que explique quem é a pessoa, o que faz bem e por que alguém deveria conversar com ela. Além do efeito humano, o campo é lido pelo mecanismo de busca, então deixá-lo vazio significa abrir mão de palavras-chave. Este guia mostra a estrutura em quatro partes que funciona, o tamanho ideal, como escrever as duas primeiras linhas (as únicas visíveis antes do 'ver mais') e traz exemplos completos para diferentes situações de carreira.",
    sections: [
      {
        heading: "Para que serve o resumo e por que ele não pode ficar vazio",
        body: [
          "A seção 'Sobre' cumpre três funções ao mesmo tempo. A primeira é narrativa: ela conecta as suas experiências em uma trajetória com sentido, algo que a lista de cargos não faz sozinha. Duas pessoas com os mesmos empregos podem ter histórias completamente diferentes, e é aqui que essa diferença aparece.",
          "A segunda é de descoberta: o texto é indexado pelas buscas da plataforma, então ele é um dos lugares onde as suas palavras-chave precisam estar. Um resumo bem escrito faz você aparecer em buscas que o título sozinho não cobriria.",
          "A terceira é de conversão. Quando um recrutador abre o seu perfil, é este o primeiro bloco de texto substancial que ele lê. É onde se decide se a leitura continua até as experiências ou se a aba é fechada.",
          "Deixar vazio custa as três. E o motivo mais comum para isso é a dificuldade de começar — escrever sobre si mesmo trava quase todo mundo. A solução é ter uma estrutura pronta, que é o que este guia oferece.",
        ],
        bullets: [
          "Narrativa: conecta cargos soltos em uma trajetória com sentido",
          "Descoberta: o texto é indexado e amplia as buscas em que você aparece",
          "Conversão: é o primeiro bloco de texto que um recrutador lê",
          "O motivo mais comum de estar vazio é a dificuldade de começar — use uma estrutura",
        ],
      },
      {
        heading: "A estrutura em quatro partes",
        body: [
          "Organize o texto em quatro blocos curtos, cada um com uma função clara. Isso resolve o bloqueio da página em branco e produz um resumo que funciona tanto para leitura humana quanto para busca.",
          "Primeiro bloco — quem você é hoje. Uma ou duas frases com a sua identidade profissional: área, tempo de experiência e escopo atual. É a parte que precisa estar impecável, porque é o que aparece antes do 'ver mais'.",
          "Segundo bloco — o que você faz bem, com evidência. Aqui entram as suas especialidades e as ferramentas que você domina, sempre ligadas a algo concreto. Em vez de listar competências, mostre como elas aparecem no seu trabalho.",
          "Terceiro bloco — resultados e marcos. Dois ou três feitos com número ou consequência verificável. É o que separa um resumo de um texto de intenções.",
          "Quarto bloco — o que você busca e como te procurar. Uma frase sobre a direção atual e um convite explícito ao contato: 'me chame para falar sobre projetos de automação fiscal' funciona muito melhor do que encerrar sem chamada.",
          "Entre três e cinco parágrafos curtos, com linhas em branco entre eles. Blocos densos de texto corrido são abandonados na segunda linha.",
        ],
        bullets: [
          "1. Quem você é hoje: área, tempo de experiência e escopo",
          "2. O que faz bem, com ferramentas e evidência concreta",
          "3. Dois ou três resultados com número ou consequência",
          "4. O que busca e um convite explícito ao contato",
          "3 a 5 parágrafos curtos, com respiro entre eles",
        ],
      },
      {
        heading: "As duas primeiras linhas decidem o resto",
        body: [
          "A plataforma exibe apenas as primeiras linhas do resumo antes de cortar com um 'ver mais'. Quem não clica lê só isso — e a maioria não clica se o começo não prender.",
          "Por isso, nunca comece com uma introdução de aquecimento do tipo 'Sou um profissional que acredita no poder das pessoas' ou 'Desde criança sempre fui curioso'. Esse tipo de abertura consome exatamente o espaço mais valioso do campo.",
          "Comece pelo essencial e concreto. 'Trabalho há 7 anos com logística e hoje coordeno a expedição de um centro de distribuição que movimenta 40 mil pedidos por mês.' Em uma frase, quem lê já sabe área, senioridade e escala.",
          "Outra abertura eficaz é o problema que você resolve: 'Ajudo indústrias de médio porte a reduzir perda de estoque e a organizar o inventário sem parar a operação.' Funciona especialmente bem para quem atua com consultoria, vendas ou serviços.",
          "Se você está em transição ou em busca de recolocação, nomeie isso já nas primeiras linhas, junto com a sua base: quem lê precisa entender o seu momento sem ter que deduzir.",
        ],
        bullets: [
          "Só as primeiras linhas aparecem antes do 'ver mais'",
          "Nunca abra com introdução genérica ou história de infância",
          "Abra com identidade + escala, ou com o problema que você resolve",
          "Em transição, nomeie o momento logo no começo",
        ],
      },
      {
        heading: "Exemplo completo: profissional com experiência",
        body: [
          "'Trabalho há 9 anos com rotinas fiscais e contábeis e hoje coordeno o fechamento de cinco empresas de um grupo do setor de alimentos.'",
          "'Minha atuação é bem prática: escrituração fiscal, apuração de impostos, SPED, conciliação e resposta a fiscalizações. Domino TOTVS Protheus e Excel avançado, e passei os últimos anos organizando processos que antes dependiam de planilhas paralelas e da memória de quem estava há mais tempo na casa.'",
          "'Alguns resultados que me orgulho: reduzi de 12 para 4 dias o prazo de fechamento mensal ao padronizar a conferência entre filiais; identifiquei e corrigi uma classificação fiscal incorreta em 140 itens, o que eliminou quase todo o retrabalho com notas de correção; e treinei três analistas que hoje conduzem sozinhos o fechamento das unidades menores.'",
          "'Estou sempre aberto a trocar sobre automação de rotinas fiscais e organização de fechamento em empresas com múltiplas filiais. Se for o seu tema, me chame por aqui.'",
          "Repare no que esse texto faz: abre com identidade e escopo, distribui palavras-chave reais da área sem parecer lista, entrega três resultados com números e fecha com um convite específico. Nenhum adjetivo de autoelogio aparece — e ele soa mais confiante justamente por isso.",
        ],
        bullets: [
          "Abertura com área, tempo e escala em uma frase",
          "Ferramentas e rotinas citadas em contexto, não em lista",
          "Três resultados com número no terceiro bloco",
          "Fechamento com convite específico ao contato",
        ],
      },
      {
        heading: "Exemplos para início de carreira, transição e recolocação",
        body: [
          "Início de carreira: 'Estou no último ano de Administração e venho me especializando na parte de dados e processos. Como monitora de Estatística, aprendi a explicar conteúdo técnico para quem está começando; na empresa júnior, participei de um projeto de mapeamento de processos para um comércio local, em que reorganizamos o controle de estoque e reduzimos bastante a perda por validade. Por conta própria, fiz formação em Excel avançado e Power BI porque queria tratar os dados sozinha. Busco a primeira oportunidade em rotinas administrativas com foco em controle e relatórios.'",
          "Transição de carreira: 'Passei 8 anos em operações de varejo, os últimos 3 respondendo pelos indicadores da loja — e foi aí que descobri que o que eu mais gostava era entender o porquê dos números. Fiz formação em análise de dados, aprendi SQL e Power BI e reconstruí os dashboards da operação, que hoje são usados por todas as unidades da região. O que trago de diferente é conhecer o processo por dentro: sei o que cada número significa na prática, porque eu era quem gerava aquele dado. Busco posições de analista de dados, preferencialmente em varejo ou e-commerce.'",
          "Recolocação: 'Sou analista de suporte técnico com 6 anos de experiência em service desk e infraestrutura, atuando com Windows Server, Active Directory e ITIL. Estou em busca de uma nova oportunidade desde que minha área foi reduzida em uma reestruturação, e usei esse período para concluir a certificação em [nome] e para prestar suporte a duas pequenas empresas como freelancer. Estou aberto a posições presenciais na região metropolitana e a vagas remotas.'",
          "Os três exemplos seguem a mesma estrutura, mudando apenas a matéria-prima. Repare que nenhum deles se desculpa pela situação: início de carreira não abre com 'não tenho experiência', transição não abre com 'não aguentava mais o varejo' e recolocação não abre com 'estou desempregado'.",
        ],
        bullets: [
          "Início de carreira: projetos acadêmicos e cursos tratados como experiência real",
          "Transição: nomeie o movimento e transforme o passado em diferencial",
          "Recolocação: explique o período com objetividade e mostre o que fez nele",
          "Nunca abra se desculpando pela sua situação",
        ],
      },
      {
        heading: "Palavras-chave, tom e tamanho",
        body: [
          "Sobre as palavras-chave: extraia os termos de dez a quinze anúncios de vagas do seu alvo e distribua os principais pelo texto, sempre em contexto. Ferramentas, metodologias, tipos de rotina, nomes de sistema e vocabulário do setor. O objetivo é que o texto contenha os termos sem parecer uma lista — e o teste é simples: se ler em voz alta soar estranho, está forçado.",
          "Sobre o tom: escreva em primeira pessoa. A terceira pessoa ('Maria é uma profissional experiente...') soa institucional e cria distância. Use uma linguagem próxima da que você usaria em uma conversa profissional, sem gírias e sem formalidade excessiva.",
          "Sobre o tamanho: entre 150 e 350 palavras funciona bem para a maioria dos perfis. Textos muito curtos não aproveitam o espaço nem as palavras-chave; textos muito longos raramente são lidos até o fim. Se você atua com serviços ou consultoria, pode estender um pouco, incluindo tipos de projeto e formatos de trabalho.",
          "Sobre o que evitar: adjetivos sem prova (proativo, dinâmico, comprometido), frases motivacionais, jargão corporativo esvaziado e listas de qualidades. Nenhum desses elementos comunica informação, e todos consomem a atenção de quem está lendo.",
          "E revise em voz alta antes de publicar. É o jeito mais rápido de perceber frases artificiais, repetições e trechos em que você está tentando impressionar em vez de informar.",
        ],
        bullets: [
          "Extraia termos de 10 a 15 anúncios e distribua em contexto",
          "Primeira pessoa sempre; terceira pessoa cria distância",
          "Tamanho eficiente: 150 a 350 palavras",
          "Corte adjetivos sem prova e frases motivacionais",
          "Revise lendo em voz alta antes de publicar",
        ],
      },
      {
        heading: "O que mais cabe na seção Sobre",
        body: [
          "Além do texto, o campo aceita alguns elementos que a maioria dos perfis ignora e que aumentam a chance de contato.",
          "Formas de contato: se você está em busca ativa ou trabalha com serviços, incluir um e-mail profissional no fim do texto facilita a vida de quem quer falar com você e não tem conexão direta.",
          "Uma linha de disponibilidade: modelo de trabalho aceito, região, disponibilidade para mudança ou viagem. Recrutadores filtram por isso e a informação raramente está explícita.",
          "Uma seção curta de competências principais, se fizer sentido para a sua área — cinco a oito termos ao final, separados por barras, funcionam como reforço de palavra-chave sem prejudicar o texto.",
          "Alguns perfis usam também os recursos de destaque da plataforma para anexar arquivos, links de portfólio ou publicações logo abaixo do resumo. Para áreas criativas, técnicas e comerciais, isso vale muito a pena.",
          "O que não colocar: dados pessoais sensíveis, informações de documentos, pretensão salarial e qualquer crítica a empregadores anteriores. O perfil é público e permanente de uma forma que o currículo não é.",
        ],
        bullets: [
          "E-mail profissional no fim facilita contato de quem não tem conexão",
          "Uma linha sobre modelo de trabalho, região e disponibilidade",
          "Bloco final com 5 a 8 competências-chave, se couber na sua área",
          "Anexe portfólio e materiais nos destaques logo abaixo",
          "Nunca inclua documentos, pretensão salarial ou críticas a ex-empregadores",
        ],
      },
    ],
    keyTakeaways: [
      "A seção 'Sobre' é o único campo livre do perfil e o mais deixado em branco — ela cumpre função narrativa, de busca e de conversão.",
      "Use a estrutura em quatro partes: quem você é hoje, o que faz bem com evidência, resultados e o que busca.",
      "As primeiras linhas são as únicas visíveis antes do 'ver mais': comece por identidade e escala, nunca por introdução genérica.",
      "Escreva em primeira pessoa, entre 150 e 350 palavras, com parágrafos curtos e respiro entre eles.",
      "Distribua palavras-chave extraídas de anúncios reais, sempre em contexto — se soar estranho em voz alta, está forçado.",
      "Feche com um convite explícito ao contato e, se estiver em busca ativa, inclua um e-mail profissional.",
    ],
    faqs: [
      {
        question: "Qual o tamanho ideal do resumo do LinkedIn?",
        answer:
          "Entre 150 e 350 palavras funciona bem para a maioria dos perfis, distribuídas em três a cinco parágrafos curtos com linhas em branco entre eles. Textos mais curtos que isso desperdiçam o espaço e as palavras-chave; textos muito longos raramente são lidos até o fim, especialmente porque o leitor precisa clicar em 'ver mais' para continuar. Se você atua com consultoria, serviços ou vendas, pode estender um pouco para incluir tipos de projeto, formatos de trabalho e formas de contato. O mais importante não é o número exato, e sim a densidade: cada parágrafo deve trazer informação nova, não reformular a anterior.",
      },
      {
        question: "Devo escrever o resumo em primeira ou terceira pessoa?",
        answer:
          "Primeira pessoa, na grande maioria dos casos. Textos em terceira pessoa ('Carlos é um profissional com ampla experiência...') soam institucionais, criam distância e lembram uma biografia escrita por outra pessoa — o que é justamente o oposto do que a seção propõe. O LinkedIn é uma rede de conversas profissionais, e o tom que funciona é o de alguém se apresentando. A exceção razoável é para perfis de figuras públicas ou executivos cuja biografia circula em materiais institucionais, mas mesmo aí a primeira pessoa costuma gerar mais engajamento e parecer mais acessível.",
      },
      {
        question: "O que escrever no resumo se eu não tenho experiência?",
        answer:
          "Use a mesma estrutura, trocando a matéria-prima. O primeiro bloco passa a ser a sua formação e o momento em que você está; o segundo, os projetos acadêmicos, monitoria, empresa júnior, voluntariado, freelances e cursos que você buscou por conta própria; o terceiro, os resultados desses projetos, descritos como você descreveria uma experiência profissional; e o quarto, o que você busca. O ponto mais importante é não abrir se desculpando: nunca comece com 'ainda não tenho experiência, mas...'. Comece pelo que você tem e deixe que quem lê tire as próprias conclusões sobre o que falta.",
      },
      {
        question: "Preciso colocar palavras-chave no resumo do LinkedIn?",
        answer:
          "Sim, porque o texto é lido pelas buscas da plataforma e amplia as pesquisas em que você aparece — muitas vezes cobrindo termos que não couberam no título. O método é simples: leia de dez a quinze anúncios das vagas que você quer e anote as palavras que se repetem (ferramentas, sistemas, metodologias, tipos de rotina, vocabulário do setor). Depois, distribua as principais pelo texto sempre em contexto, ligadas ao que você fez. O que não funciona é empilhar termos em uma lista no meio do texto: prejudica a leitura humana, que é quem decide no fim, e soa artificial. O teste é ler em voz alta.",
      },
      {
        question: "Posso copiar o resumo do meu currículo para o LinkedIn?",
        answer:
          "Não é o ideal. Os dois têm registros diferentes: o resumo do currículo é curto, impessoal e otimizado para triagem automática; o do LinkedIn é conversacional, em primeira pessoa, e tem espaço para contar a trajetória e convidar ao contato. Copiar um no outro produz um texto que soa seco na rede e longo demais no documento. O que deve ser igual são os fatos: cargos, datas, ferramentas e resultados precisam bater entre os dois, porque recrutadores comparam com frequência e divergências levantam dúvida. Mantenha o conteúdo coerente e adapte o tom e a extensão a cada contexto.",
      },
      {
        question: "Vale a pena colocar e-mail de contato no resumo?",
        answer:
          "Vale, especialmente se você está em busca ativa, trabalha com serviços ou tem um perfil com muitas conexões de segundo e terceiro grau. Nem todo mundo que se interessa pelo seu perfil consegue enviar mensagem direta, e ter um e-mail profissional no fim do texto remove esse atrito. Use um endereço sério, do tipo nome.sobrenome, e evite incluir telefone pessoal, que expõe você a contatos indesejados em um perfil público. Aproveite a mesma linha para informar disponibilidade — modelo de trabalho, região, abertura para mudança —, porque essa informação raramente aparece nos perfis e é exatamente o que recrutadores filtram.",
      },
    ],
    relatedSlugs: [
      "como-fazer-um-bom-linkedin",
      "titulo-do-linkedin",
      "objetivo-profissional-no-curriculo",
      "networking-profissional",
    ],
  },
  {
    slug: "open-to-work-linkedin",
    metaTitle: "Open to Work no LinkedIn: Vale a Pena Ativar? (Guia 2026)",
    h1: "Open to Work no LinkedIn: Como Usar e se Vale a Pena a Moldura",
    metaDescription:
      "Como funciona o Open to Work do LinkedIn, a diferença entre o modo visível só para recrutadores e a moldura pública, e como configurar para receber mais vagas.",
    intro:
      "O 'Open to Work' é o recurso do LinkedIn que sinaliza que você está aberto a novas oportunidades. Ele existe em duas versões bem diferentes — uma discreta, visível apenas para recrutadores, e outra pública, com a moldura verde na foto — e a escolha entre elas gera debate constante. Há quem diga que a moldura passa desespero; há quem tenha conseguido vaga justamente por causa dela. A resposta honesta depende da sua situação, e é isso que este guia detalha: como cada modo funciona, quem vê o quê, como configurar as preferências para receber vagas relevantes e o que fazer para que a sinalização realmente resulte em contato.",
    sections: [
      {
        heading: "Os dois modos: discreto e público",
        body: [
          "O recurso tem duas configurações independentes, e confundi-las é a origem da maior parte das dúvidas.",
          "O modo discreto sinaliza a sua disponibilidade apenas para recrutadores que usam as ferramentas pagas de recrutamento da plataforma. Nada aparece na sua foto, no seu título ou no seu feed. Colegas e gestores não veem o sinal nas telas normais da rede.",
          "O modo público adiciona a moldura verde com o texto 'Open to Work' ao redor da sua foto e torna a informação visível para qualquer pessoa que abra o seu perfil, incluindo a sua rede atual.",
          "Uma ressalva importante sobre o modo discreto: o LinkedIn afirma tomar medidas para não exibir o sinal a recrutadores da empresa em que você trabalha, mas não garante sigilo absoluto — informações podem circular de outras formas. Se a confidencialidade for crítica no seu caso, trate a sinalização como algo potencialmente descobrível.",
          "Em ambos os modos, você configura o mesmo conjunto de preferências: cargos desejados, localidades, modelo de trabalho e tipo de contratação. É essa configuração, mais do que a moldura, que determina a qualidade das vagas que chegam.",
        ],
        bullets: [
          "Modo discreto: visível apenas nas ferramentas pagas de recrutamento",
          "Modo público: moldura verde visível para qualquer visitante do perfil",
          "O modo discreto reduz a exposição, mas não garante sigilo absoluto",
          "As preferências configuradas são as mesmas nos dois modos",
        ],
      },
      {
        heading: "A moldura verde: vale a pena?",
        body: [
          "Essa é a pergunta mais comum sobre o recurso, e ela não tem uma resposta única — tem critérios.",
          "A favor da moldura: ela aumenta a visibilidade do sinal para toda a sua rede, incluindo ex-colegas e conhecidos que podem indicar você. Como boa parte das contratações acontece por indicação, tornar a busca conhecida amplia justamente o canal mais eficiente. Além disso, ela remove o constrangimento de avisar pessoa por pessoa.",
          "Contra a moldura: ela é permanentemente visível e, para alguns recrutadores e gestores, sinaliza urgência, o que pode enfraquecer a posição em uma eventual negociação. Também expõe a sua situação a clientes, parceiros e ao mercado do seu setor de forma indiscriminada.",
          "Na prática, três situações orientam bem a decisão. Se você está desempregado e buscando ativamente, a moldura costuma compensar: a exposição ampliada vale mais do que o risco reputacional, e a sua situação já não é segredo. Se você está empregado e buscando com discrição, o modo discreto é claramente melhor. E se você atua com clientes, consultoria ou vendas, a moldura pode gerar leitura ruim entre parceiros — nesse caso, prefira o modo discreto e comunique a busca diretamente à rede.",
          "Vale lembrar que a moldura sozinha não faz nada. Ela sinaliza; quem gera contato é o perfil otimizado e a busca ativa.",
        ],
        bullets: [
          "A favor: amplia o canal mais eficiente, que é a indicação da rede",
          "Contra: sinaliza urgência e expõe a situação de forma indiscriminada",
          "Desempregado em busca ativa: a moldura costuma compensar",
          "Empregado buscando com discrição: use o modo discreto",
          "Quem atua com clientes: prefira discreto e avise a rede diretamente",
        ],
      },
      {
        heading: "Como configurar as preferências para receber vagas relevantes",
        body: [
          "A qualidade dos contatos depende quase inteiramente do que você preenche nas preferências, e não de qual modo está ativo. Preenchimentos vagos produzem vagas irrelevantes, o que faz muita gente concluir erroneamente que o recurso não funciona.",
          "Cargos: informe de três a cinco títulos, usando os nomes que o mercado usa e incluindo variações comuns. 'Analista de Suporte', 'Analista de Suporte Técnico' e 'Analista de Service Desk' podem aparecer em vagas diferentes. Não inclua cargos muito acima ou muito abaixo do seu nível real — isso polui os resultados.",
          "Localidades: informe todas as regiões que você aceita de verdade, incluindo cidades vizinhas. Se aceita trabalho remoto, marque explicitamente, porque muitas buscas filtram por essa condição.",
          "Modelo e tipo de contratação: presencial, híbrido ou remoto; efetivo, temporário, estágio, meio período ou contrato. Ser preciso aqui reduz drasticamente o volume de contatos inúteis.",
          "Data de início: se você está disponível imediatamente, sinalize. Se está empregado e precisa cumprir aviso, informe o prazo — recrutadores usam esse dado para priorizar contatos.",
          "Revise essas preferências a cada poucas semanas. Buscas mudam de direção com frequência e configurações desatualizadas continuam atraindo o tipo errado de vaga.",
        ],
        bullets: [
          "3 a 5 cargos com os nomes que o mercado usa, incluindo variações",
          "Todas as localidades que você aceita, e marque remoto se for o caso",
          "Seja preciso no modelo e no tipo de contratação",
          "Informe a disponibilidade de início",
          "Revise as preferências a cada poucas semanas",
        ],
      },
      {
        heading: "O que fazer além de ativar o recurso",
        body: [
          "Ativar o sinal sem preparar o perfil é o erro mais comum. O recurso apenas aumenta a chance de você aparecer; o que converte é o que o recrutador encontra quando abre o seu perfil.",
          "Antes de ativar, garanta três coisas. Primeira: o título contendo os termos que os recrutadores da sua área pesquisam, e não apenas 'em busca de oportunidades'. Segunda: a seção 'Sobre' preenchida, com as suas competências e um convite ao contato. Terceira: experiências descritas com resultados, não apenas cargos e datas.",
          "Depois de ativar, complemente com ação direta. O sinal é passivo; a busca precisa ser ativa. Envie mensagens específicas para pessoas da sua rede, conecte-se com recrutadores do seu setor, acompanhe empresas-alvo e candidate-se com o currículo adaptado.",
          "Uma prática eficaz é publicar uma mensagem curta anunciando a busca de forma específica: o que você faz, o que procura, em qual região e como te ajudar. Publicações desse tipo costumam circular bem, e a especificidade é o que gera indicação — 'busco posições de analista fiscal em indústrias na região de Sorocaba' produz resultado, 'aberto a oportunidades' não produz nada.",
          "E mantenha o perfil ativo enquanto o sinal estiver ligado: comentar, interagir e atualizar experiências reforça a visibilidade nos períodos em que ela mais importa.",
        ],
        bullets: [
          "Otimize título, Sobre e experiências ANTES de ativar o sinal",
          "O recurso é passivo — combine com busca ativa e contato direto",
          "Publique um anúncio específico da busca: especificidade gera indicação",
          "Conecte-se com recrutadores do seu setor",
          "Mantenha atividade na plataforma enquanto o sinal estiver ligado",
        ],
      },
      {
        heading: "Riscos, mitos e o que dizer se perguntarem",
        body: [
          "O primeiro mito é o de que a moldura elimina candidatos automaticamente. Não há evidência de que recrutadores descartem perfis por causa dela; o que existe é uma variação de percepção individual, e ela é minoritária.",
          "O segundo é o de que o modo discreto é totalmente invisível. Ele reduz muito a exposição, mas não deve ser tratado como sigilo garantido — se a confidencialidade for crítica, considere não ativar e conduzir a busca por contatos diretos.",
          "O terceiro é o de que ativar o recurso gera vagas por si só. Ele apenas aumenta a chance de aparecer em buscas de recrutadores; sem perfil otimizado e sem busca ativa, o resultado é pequeno.",
          "Se o seu gestor ou um colega perguntar sobre a sinalização, responda com naturalidade e sem defensiva. Se você está empregado e não quer expor a busca, uma resposta honesta e neutra funciona: 'Mantenho o perfil aberto a conversas, é uma prática comum na área.' Se preferir ser direto, seja — mas esteja preparado para a conversa que vem depois.",
          "Por fim, desative o sinal quando fechar uma posição e atualize o perfil com a nova experiência. Perfis que permanecem sinalizando busca meses depois de uma contratação geram confusão e reduzem a credibilidade do sinal nas próximas vezes.",
        ],
        bullets: [
          "Não há evidência de descarte automático por causa da moldura",
          "Modo discreto reduz exposição, mas não é sigilo garantido",
          "O recurso não gera vagas sozinho: perfil e busca ativa fazem o trabalho",
          "Se perguntarem, responda com naturalidade e sem defensiva",
          "Desative ao fechar a posição e atualize o perfil",
        ],
      },
      {
        heading: "Alternativas e complementos ao Open to Work",
        body: [
          "Se você prefere não usar o recurso, ou quer reforçá-lo, há caminhos que funcionam igualmente bem e às vezes melhor.",
          "O primeiro é o título do perfil, que pode sinalizar disponibilidade de forma discreta e ainda conter os termos de busca: 'Analista Fiscal | SPED e Escrituração | Aberto a novas oportunidades'. Isso aparece em toda listagem, sem moldura.",
          "O segundo é a seção 'Sobre', onde uma linha ao final sobre disponibilidade, região e modelo de trabalho comunica exatamente o que recrutadores filtram — e sem exposição visual.",
          "O terceiro, e mais eficaz, é o contato direto com a rede. Mensagens específicas para dez ou quinze pessoas relevantes produzem mais resultado do que qualquer sinalização passiva. A chave é o pedido concreto: cargo, região, tipo de empresa.",
          "O quarto é o relacionamento com recrutadores especializados no seu setor. Conectar-se, apresentar-se brevemente e manter contato leve gera acesso a vagas que muitas vezes não chegam a ser anunciadas.",
          "O quinto é a candidatura ativa com material adaptado. Nenhuma sinalização substitui a busca sistemática — o Open to Work é um complemento, não uma estratégia.",
        ],
        bullets: [
          "Sinalizar no título: discreto e ainda otimizado para busca",
          "Uma linha de disponibilidade no fim da seção 'Sobre'",
          "Contato direto e específico com 10 a 15 pessoas da rede",
          "Relacionamento com recrutadores do setor",
          "Candidatura ativa com currículo adaptado por vaga",
        ],
      },
    ],
    keyTakeaways: [
      "O recurso tem dois modos: discreto (só para recrutadores) e público (moldura verde visível para todos).",
      "O modo discreto reduz muito a exposição, mas não deve ser tratado como sigilo garantido.",
      "Desempregado em busca ativa costuma se beneficiar da moldura; quem está empregado ou atua com clientes deve preferir o modo discreto.",
      "A qualidade dos contatos depende das preferências configuradas — cargos, localidades, modelo e tipo de contratação — e não da moldura.",
      "Otimize título, 'Sobre' e experiências antes de ativar: o recurso aumenta a exposição, mas quem converte é o perfil.",
      "O sinal é passivo — combine sempre com contato direto à rede e candidatura ativa.",
    ],
    faqs: [
      {
        question: "A moldura Open to Work prejudica minha imagem profissional?",
        answer:
          "Não há evidência de que recrutadores descartem candidatos por causa dela, e a maior parte trata a sinalização com naturalidade. O que existe é uma variação de percepção: uma minoria interpreta a moldura como sinal de urgência, o que em tese poderia enfraquecer a posição em uma negociação. Na prática, a decisão depende do contexto. Se você está desempregado e buscando ativamente, a exposição ampliada costuma valer mais do que esse risco, porque aumenta as chances de indicação — que é o canal mais eficiente de contratação. Se você está empregado ou atua diretamente com clientes e parceiros, o modo discreto é a escolha mais adequada.",
      },
      {
        question: "Meu chefe consegue ver que ativei o Open to Work?",
        answer:
          "Depende do modo. Se você escolher o modo público, com a moldura verde, qualquer pessoa que abrir o seu perfil verá — incluindo o seu gestor e colegas. Se escolher o modo discreto, o sinal aparece apenas nas ferramentas pagas de recrutamento, e o LinkedIn afirma tomar medidas para não exibi-lo a recrutadores da empresa em que você trabalha. No entanto, essa filtragem não é uma garantia absoluta: a informação pode circular por outros caminhos, especialmente em empresas que usam consultorias externas. Se a confidencialidade for crítica no seu caso, o mais seguro é não ativar e conduzir a busca por contatos diretos.",
      },
      {
        question: "O Open to Work aumenta mesmo as chances de conseguir vaga?",
        answer:
          "Aumenta a chance de você aparecer nas buscas de recrutadores que filtram por candidatos disponíveis, o que é relevante. Mas o recurso é passivo: ele sinaliza, não converte. Quem converte é o que o recrutador encontra ao abrir o seu perfil — título com os termos certos, seção 'Sobre' preenchida e experiências descritas com resultados. Por isso a ordem importa: otimize o perfil primeiro, ative o sinal depois e combine com busca ativa (contato direto com a rede, candidaturas com material adaptado, relacionamento com recrutadores do setor). Ativar o recurso e esperar é o erro mais comum e o que gera a impressão de que ele não funciona.",
      },
      {
        question: "Como configurar o Open to Work para receber vagas relevantes?",
        answer:
          "A qualidade dos contatos depende quase inteiramente das preferências que você preenche. Informe de três a cinco cargos usando os nomes que o mercado usa, incluindo variações comuns do mesmo papel, e evite incluir níveis muito acima ou abaixo do seu, o que polui os resultados. Preencha todas as localidades que você realmente aceita, marcando explicitamente a opção de trabalho remoto se ela te interessa. Seja preciso no modelo (presencial, híbrido, remoto) e no tipo de contratação (efetivo, temporário, estágio, contrato). E informe a sua disponibilidade de início. Revise essas configurações a cada poucas semanas, porque buscas mudam de direção com frequência.",
      },
      {
        question: "Posso sinalizar que busco emprego sem usar a moldura?",
        answer:
          "Pode, e para muita gente é a melhor combinação. A forma mais eficaz é usar o título do perfil, que aparece em toda listagem e busca: 'Analista Fiscal | SPED e Escrituração | Aberto a novas oportunidades'. Você sinaliza sem moldura e mantém os termos que fazem você ser encontrado. Complementarmente, inclua uma linha ao final da seção 'Sobre' informando disponibilidade, região e modelo de trabalho aceito — informação que recrutadores filtram e que raramente aparece nos perfis. E ative o modo discreto do recurso, que trabalha em segundo plano. Some a isso o contato direto com a rede, que continua sendo o canal mais produtivo.",
      },
      {
        question: "Devo desativar o Open to Work depois de conseguir emprego?",
        answer:
          "Sim, e no mesmo momento em que assinar a proposta ou começar na nova posição. Perfis que continuam sinalizando busca meses depois de uma contratação geram confusão, atraem contatos irrelevantes e reduzem a credibilidade do sinal quando você realmente precisar dele de novo. Aproveite a mesma ocasião para atualizar o perfil por completo: adicione a nova experiência, ajuste o título para o novo cargo e revise a seção 'Sobre'. Esse é justamente o momento em que a atualização é mais fácil e menos custosa, e um perfil atualizado é o que permite que oportunidades cheguem sem que você precise procurá-las.",
      },
    ],
    relatedSlugs: [
      "como-fazer-um-bom-linkedin",
      "titulo-do-linkedin",
      "recolocacao-profissional",
      "networking-profissional",
    ],
  },
  {
    slug: "networking-profissional",
    metaTitle: "Networking Profissional: Como Fazer na Prática (Guia 2026)",
    h1: "Networking Profissional: Como Construir e Usar a Sua Rede",
    metaDescription:
      "Como fazer networking profissional de verdade: mensagens que funcionam, conversas exploratórias, como pedir indicação e como manter a rede sem parecer interesseiro.",
    intro:
      "Boa parte das contratações acontece por indicação, e ainda assim networking continua sendo a atividade que os profissionais mais adiam — geralmente porque associam o termo a algo artificial: trocar cartões em eventos, puxar conversa por interesse, pedir favores a desconhecidos. Networking que funciona é quase o oposto disso. É construir relações profissionais reais ao longo do tempo, ajudar antes de precisar e pedir de forma específica quando for a hora. Este guia traz o método prático: como identificar as pessoas certas, o que escrever nas mensagens, como conduzir conversas exploratórias, como pedir indicação sem constranger ninguém e como manter uma rede viva gastando pouco tempo por semana.",
    sections: [
      {
        heading: "Por que a rede é o canal mais eficiente",
        body: [
          "Existe uma assimetria conhecida no mercado de trabalho: muitas vagas são preenchidas antes de serem anunciadas ou logo depois, com candidatos indicados. Isso acontece porque contratar é uma decisão de risco, e uma indicação de alguém confiável reduz esse risco de forma que nenhum currículo consegue.",
          "Para quem procura, isso significa duas coisas. A primeira é que concorrer apenas por portais é competir no canal mais concorrido, onde centenas de candidaturas disputam a mesma triagem automática. A segunda é que uma indicação não substitui competência, mas encurta o caminho até a conversa em que você pode demonstrá-la.",
          "Há também o efeito de informação: sua rede sabe de coisas antes de você — reestruturações, áreas que vão crescer, gestores que estão montando time. Esse tipo de informação só circula em conversa.",
          "É importante desfazer um mal-entendido: rede não é quantidade de conexões. Mil contatos que não sabem o que você faz valem menos do que trinta pessoas que conhecem o seu trabalho e lembrariam de você. O objetivo do networking não é acumular; é ser lembrado pelas pessoas certas.",
        ],
        bullets: [
          "Muitas vagas são preenchidas por indicação, antes ou logo após o anúncio",
          "Indicação reduz o risco percebido de contratar — é isso que ela compra",
          "A rede circula informação que não chega aos portais",
          "Rede não é quantidade: 30 pessoas que conhecem seu trabalho valem mais que 1.000 contatos",
        ],
      },
      {
        heading: "Quem deve estar na sua rede",
        body: [
          "Antes de sair adicionando pessoas, defina os grupos que realmente importam. Uma rede útil costuma ter quatro camadas.",
          "A primeira são os ex-colegas e ex-gestores. É o grupo mais subestimado e o mais valioso: essas pessoas já conhecem o seu trabalho, então não precisam ser convencidas de nada. Reconectar-se com quem você trabalhou há três, cinco ou dez anos costuma render mais do que qualquer contato novo.",
          "A segunda são os pares da sua área — pessoas que fazem o que você faz, em outras empresas. Elas trazem informação de mercado, referência salarial e conhecimento sobre quem está contratando.",
          "A terceira são os recrutadores especializados no seu setor. Manter contato leve com dois ou três consultores que recrutam para a sua área dá acesso a vagas que muitas vezes não são anunciadas.",
          "A quarta são as pessoas dentro das empresas em que você gostaria de trabalhar. Elas não precisam ser do seu nível nem da sua área: alguém que trabalha lá pode explicar a cultura, o processo seletivo e, eventualmente, encaminhar o seu perfil internamente.",
          "Um exercício prático: liste vinte nomes distribuídos nessas quatro camadas. Essa lista é a sua rede ativa, e é com ela que o trabalho acontece.",
        ],
        bullets: [
          "Ex-colegas e ex-gestores: já conhecem seu trabalho, não precisam ser convencidos",
          "Pares da área: informação de mercado e referência salarial",
          "Recrutadores do setor: acesso a vagas não anunciadas",
          "Pessoas dentro das empresas-alvo: cultura, processo e encaminhamento interno",
          "Monte uma lista de 20 nomes nessas quatro camadas",
        ],
      },
      {
        heading: "Como escrever mensagens que recebem resposta",
        body: [
          "A maior parte das mensagens de networking não é respondida por três motivos: são longas, são genéricas e pedem algo grande logo de cara.",
          "Uma boa mensagem de primeiro contato tem quatro elementos e cabe em cinco linhas: quem é você em uma frase, o motivo específico do contato com aquela pessoa, um pedido pequeno e claro, e uma saída fácil para quem não puder ajudar.",
          "Exemplo para uma conversa exploratória: 'Olá, [nome]. Sou analista administrativo há 6 anos e estou migrando para a área fiscal. Vi que você fez uma transição parecida e trabalha com SPED hoje. Você teria 20 minutos nas próximas semanas para eu entender como foi esse caminho? Se não der, entendo perfeitamente — de qualquer forma, obrigado.'",
          "Repare no que essa mensagem faz: é específica sobre por que aquela pessoa, pede algo pequeno (20 minutos, não um emprego) e oferece uma saída sem constrangimento. A taxa de resposta desse tipo de mensagem é surpreendentemente boa.",
          "O que evitar: mensagens que começam com o pedido de emprego, textos longos com a sua trajetória completa, mensagens em massa idênticas e currículo anexado sem contexto. Também evite convites de conexão sem nota — eles são aceitos ou ignorados sem que a pessoa saiba quem você é.",
          "Para reconectar com ex-colegas, a mensagem é ainda mais curta: retome algo específico do período em que trabalharam juntos e pergunte como a pessoa está. Só depois, em outra mensagem, fale do seu momento.",
        ],
        bullets: [
          "Cinco linhas: quem você é, por que essa pessoa, pedido pequeno, saída fácil",
          "Peça 20 minutos de conversa, nunca um emprego, no primeiro contato",
          "Nunca envie mensagens em massa idênticas nem currículo sem contexto",
          "Convites de conexão sempre com nota explicando o motivo",
          "Com ex-colegas: retome algo específico antes de falar do seu momento",
        ],
      },
      {
        heading: "A conversa exploratória: como conduzir",
        body: [
          "A conversa exploratória é o formato mais produtivo de networking e o menos utilizado. São 20 a 30 minutos em que você pede informação, não emprego — e é justamente por isso que funciona: as pessoas gostam de falar sobre o próprio trabalho e ficam desconfortáveis quando são colocadas na posição de decidir sobre a carreira de alguém.",
          "Prepare de cinco a sete perguntas e leve-as anotadas. As melhores são sobre a experiência concreta de quem está do outro lado: como é o dia a dia da função, o que ninguém conta antes de entrar, como a pessoa chegou até ali, o que ela estudaria se começasse hoje, como o mercado da área está na região e o que costuma diferenciar quem se dá bem.",
          "Não peça emprego durante a conversa. Se houver abertura, ela virá naturalmente — muita gente termina esse tipo de conversa oferecendo ajuda por conta própria. Se não vier, você ainda saiu com informação valiosa e com uma relação iniciada.",
          "Uma pergunta de encerramento vale ouro: 'tem mais alguém que você acha que eu deveria conversar?'. Ela transforma um contato em três e é a forma mais eficiente de expandir a rede.",
          "Respeite rigorosamente o tempo combinado. Se você pediu 20 minutos, encerre em 20 — mesmo que a conversa esteja boa. Isso deixa a melhor impressão possível e facilita um segundo contato.",
          "E agradeça depois, em duas linhas, contando o que você fez com a informação. Esse retorno é raro e é o que transforma uma conversa isolada em relação.",
        ],
        bullets: [
          "Peça informação, não emprego — é o que faz o formato funcionar",
          "Leve de 5 a 7 perguntas sobre a experiência concreta da pessoa",
          "Pergunte no fim: 'tem mais alguém com quem eu deveria conversar?'",
          "Respeite o tempo combinado com rigor",
          "Agradeça depois contando o que você fez com o que ouviu",
        ],
      },
      {
        heading: "Como pedir indicação sem constranger",
        body: [
          "Pedir indicação é diferente de pedir emprego, e a distinção importa. Quem indica coloca a própria reputação em jogo, então o seu trabalho é reduzir o custo e o risco desse gesto.",
          "Peça a quem conhece o seu trabalho. Pedir indicação a alguém que nunca trabalhou com você coloca a pessoa em uma posição desconfortável, e a maioria vai recusar educadamente ou fazer uma indicação morna, que ajuda pouco.",
          "Seja específico sobre a vaga: envie o link, o nome exato da posição e a empresa. Um pedido do tipo 'se souber de algo, me avisa' não gera ação, porque não há nada concreto a fazer.",
          "Facilite ao máximo. Envie um parágrafo pronto que a pessoa possa encaminhar, com uma frase sobre quem você é e por que faz sentido para aquela vaga, mais o currículo em anexo. Quanto menor o esforço, maior a chance.",
          "Dê uma saída: 'se você não se sentir confortável em indicar, sem problema nenhum — só me avisa que eu me candidato pelo processo normal'. Isso remove a pressão e, paradoxalmente, aumenta a taxa de aceite.",
          "Depois, dê retorno. Conte o que aconteceu com o processo, tenha dado certo ou não. Quem indicou investiu reputação e merece saber o desfecho — e é isso que faz a pessoa indicar você de novo no futuro.",
        ],
        bullets: [
          "Peça só a quem conhece o seu trabalho de verdade",
          "Envie a vaga específica: link, nome da posição e empresa",
          "Mande um parágrafo pronto para encaminhar, com o currículo anexo",
          "Ofereça uma saída sem constrangimento",
          "Sempre dê retorno sobre o desfecho do processo",
        ],
      },
      {
        heading: "Como manter a rede viva sem virar um trabalho",
        body: [
          "O erro estrutural do networking é usá-lo apenas quando se precisa. Uma rede acionada só em emergência responde mal, e a percepção de interesse fica evidente.",
          "A boa notícia é que manter uma rede viva custa pouco tempo. Trinta minutos por semana, distribuídos em pequenas ações, sustentam trinta relações ativas.",
          "As ações que funcionam são simples: comentar de forma relevante em publicações de pessoas da sua rede, parabenizar por mudanças de emprego e conquistas reais, compartilhar um artigo ou uma vaga com alguém para quem aquilo é útil, e responder mensagens que chegam mesmo quando não há interesse imediato.",
          "Duas práticas rendem desproporcionalmente. A primeira é ajudar antes de precisar: indicar alguém, apresentar duas pessoas que deveriam se conhecer, responder a uma dúvida técnica. Quem ajuda com frequência tem a quem recorrer depois, sem constrangimento nenhum.",
          "A segunda é o contato periódico sem pedido. Uma mensagem a cada seis meses para pessoas importantes da rede — 'lembrei de você ao ver isso, como estão as coisas por aí?' — mantém a relação viva com custo quase zero. É o oposto do contato que aparece só quando alguém está desempregado.",
          "E registre. Uma lista simples com nomes, contexto do último contato e data ajuda a manter constância sem depender da memória.",
        ],
        bullets: [
          "30 minutos por semana sustentam uma rede ativa",
          "Comente, parabenize, compartilhe o que é útil e responda mensagens",
          "Ajude antes de precisar: indicar, apresentar pessoas, tirar dúvidas",
          "Contato periódico sem pedido, a cada seis meses, mantém a relação viva",
          "Registre os contatos em uma lista simples para manter constância",
        ],
      },
      {
        heading: "Networking para quem é tímido ou está começando",
        body: [
          "Networking não exige extroversão. Boa parte do que funciona acontece por escrito, em conversas de vinte minutos e um a um — formato que costuma ser mais confortável para pessoas introvertidas do que para as extrovertidas.",
          "Se eventos presenciais são desconfortáveis, substitua por conversas individuais agendadas. Se falar em público trava, comente por escrito. Se pedir parece constrangedor, comece oferecendo: responder dúvidas em grupos da área, ajudar alguém com uma indicação, compartilhar material útil.",
          "Para quem está começando e sente que não tem nada a oferecer, vale reformular: iniciantes têm tempo, energia, disposição para tarefas que ninguém quer e uma perspectiva atualizada de formação. Além disso, o pedido de conversa exploratória não exige que você ofereça nada — ele funciona porque as pessoas gostam de falar sobre o próprio trabalho.",
          "Comece pequeno e local: professores, colegas de curso, colegas de estágio, pessoas da empresa júnior, participantes de grupos da área. Essas relações amadurecem junto com você e, em cinco anos, formam uma rede espalhada por dezenas de empresas.",
          "E lembre que consistência supera intensidade. Duas conversas por mês, mantidas por um ano, constroem uma rede real. Quinze contatos frenéticos em uma semana de desespero, não.",
        ],
        bullets: [
          "Networking eficaz acontece um a um e por escrito, não em eventos lotados",
          "Se pedir constrange, comece oferecendo ajuda",
          "Iniciantes oferecem tempo, energia e perspectiva atualizada",
          "Comece pela rede local: curso, estágio, empresa júnior, grupos da área",
          "Consistência supera intensidade: duas conversas por mês, por um ano",
        ],
      },
    ],
    keyTakeaways: [
      "Grande parte das contratações vem de indicação porque ela reduz o risco percebido de contratar — é isso que a rede compra.",
      "Rede não é quantidade: trinta pessoas que conhecem o seu trabalho valem mais do que mil conexões que não sabem o que você faz.",
      "Mensagens que funcionam têm cinco linhas: quem você é, por que aquela pessoa, um pedido pequeno e uma saída fácil.",
      "A conversa exploratória pede informação, não emprego — e a pergunta 'com quem mais eu deveria falar?' transforma um contato em três.",
      "Para pedir indicação, envie a vaga específica, um parágrafo pronto para encaminhar e ofereça uma saída sem constrangimento.",
      "Trinta minutos por semana e o hábito de ajudar antes de precisar sustentam uma rede viva sem esforço concentrado.",
    ],
    faqs: [
      {
        question: "Como fazer networking sem parecer interesseiro?",
        answer:
          "A diferença está em três coisas: frequência, especificidade e reciprocidade. Quem só aparece quando precisa de algo é percebido como interesseiro; quem mantém contato leve ao longo do tempo, não. Peça coisas pequenas e específicas — vinte minutos de conversa sobre a área, não um emprego — porque pedidos grandes logo de cara constrangem. E ofereça antes de pedir: indicar alguém, apresentar duas pessoas que deveriam se conhecer, responder uma dúvida técnica, compartilhar algo genuinamente útil. Quem ajuda com frequência recorre à rede depois sem nenhum desconforto, porque a relação já existe em duas vias.",
      },
      {
        question: "O que escrever ao adicionar alguém no LinkedIn?",
        answer:
          "Sempre envie uma nota, e mantenha-a em duas ou três linhas. Diga quem você é em uma frase, por que está se conectando com aquela pessoa especificamente e, se houver, qual é o interesse comum. Exemplo: 'Olá, [nome]. Sou analista de suporte e acompanho o conteúdo que você publica sobre infraestrutura. Estou construindo repertório na área e gostaria de acompanhar seu trabalho por aqui.' Convites sem nota são aceitos ou ignorados sem que a pessoa saiba quem você é, o que produz uma conexão vazia. E evite pedir qualquer coisa no primeiro contato — a conexão é o começo da relação, não o momento do pedido.",
      },
      {
        question: "Como pedir indicação para uma vaga?",
        answer:
          "Peça apenas a quem conhece o seu trabalho de verdade, porque quem indica coloca a própria reputação em jogo. Seja específico: envie o link da vaga, o nome exato da posição e a empresa — pedidos vagos do tipo 'se souber de algo, me avisa' não geram ação. Facilite o máximo possível, mandando um parágrafo pronto que a pessoa possa encaminhar, com uma frase sobre quem você é e por que faz sentido para aquela posição, mais o currículo em anexo. E ofereça uma saída: 'se não se sentir confortável, sem problema, eu me candidato pelo processo normal'. Isso remove a pressão e aumenta a taxa de aceite. Depois, sempre dê retorno sobre o desfecho.",
      },
      {
        question: "Vale a pena fazer networking com pessoas que eu não conheço?",
        answer:
          "Vale, desde que o pedido seja proporcional ao nível da relação. Com desconhecidos, o pedido apropriado é uma conversa exploratória de vinte minutos sobre a área — nunca um emprego ou uma indicação. Esse formato funciona porque não exige nada além de tempo e porque as pessoas costumam gostar de falar sobre o próprio trabalho. A taxa de resposta é melhor do que a maioria imagina quando a mensagem é curta, específica sobre por que aquela pessoa e oferece uma saída fácil. Ao final da conversa, a pergunta 'tem mais alguém com quem eu deveria falar?' costuma transformar um contato em dois ou três.",
      },
      {
        question: "Quanto tempo por semana devo dedicar ao networking?",
        answer:
          "Cerca de trinta minutos semanais bastam para manter uma rede viva, se distribuídos em ações pequenas: comentar de forma relevante em publicações de pessoas da sua área, parabenizar por mudanças e conquistas reais, compartilhar algo útil com alguém específico e responder mensagens que chegam. Em período de busca ativa, aumente para algumas horas semanais, incluindo contato direto com pessoas da lista e conversas exploratórias agendadas. O ponto crítico não é o volume, e sim a constância: duas conversas por mês mantidas por um ano constroem uma rede real, enquanto quinze contatos concentrados em uma semana de urgência produzem pouco.",
      },
      {
        question: "Sou tímido. Dá para fazer networking mesmo assim?",
        answer:
          "Dá, e o formato que mais funciona costuma ser justamente o mais confortável para pessoas introvertidas: conversas individuais de vinte minutos, agendadas, com perguntas preparadas. Networking eficaz acontece muito mais nesse formato e por escrito do que em eventos lotados de troca de cartões. Se pedir constrange, comece oferecendo: responda dúvidas em grupos da área, compartilhe material útil, apresente duas pessoas que deveriam se conhecer. Se falar em público trava, comente por escrito — comentários relevantes expõem o seu perfil a redes maiores que a sua e iniciam conversas de forma natural. Consistência importa mais do que desenvoltura social.",
      },
    ],
    relatedSlugs: [
      "como-fazer-um-bom-linkedin",
      "recolocacao-profissional",
      "open-to-work-linkedin",
      "transicao-de-carreira",
    ],
  },
];
