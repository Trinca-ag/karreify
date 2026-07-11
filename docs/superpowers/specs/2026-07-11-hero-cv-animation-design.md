# Design — Animação "IA corrige o currículo" no hero da home

- **Data:** 2026-07-11
- **Status:** aprovado no brainstorm
- **Referência visual:** demo "accessible" do SplitText do anime.js
  (https://animejs.com/documentation/text/splittext/textsplitter-settings/accessible/)

## Objetivo

Substituir o vídeo "Análise de currículo.mp4" do hero da home por uma animação
de um currículo em pt-BR onde os textos errados são sobrepostos pelas versões
corrigidas — comunicando "a IA corrige seu currículo" logo na primeira dobra.

## Decisões travadas no brainstorm

1. **Visual:** camada sobreposta fiel ao demo do anime.js — o texto corrigido
   flutua por cima do errado em verde com contorno pontilhado, palavras
   animando em profundidade. Alterna errado ↔ corrigido em loop (sem botão).
2. **Escopo:** substitui o vídeo nas **duas** instâncias do hero
   (mobile ~linha 737 e desktop ~linha 780 de `src/app/page.tsx`).
   Os 7 spotlights continuam com `VideoMockup` intocado; o arquivo
   "Análise de currículo.mp4" permanece em `/public/videos` (o spotlight de
   análise também o usa).
3. **Moldura:** folha de papel clara (sem mockup de browser), contraste forte
   com o fundo escuro. `TiltCard` e badges flutuantes ("Score A+",
   "IA Analisou") mantidos como estão.
4. **Conteúdo:** CV fictício compacto com 4 erros clássicos (rascunho abaixo,
   ajustável depois).
5. **Lib:** anime.js v4 (`npm i animejs`) — `splitText`, `createTimeline`,
   `stagger`. Nova dependência, tree-shakeable, importada só no componente.

## Componente

`src/components/ui/ResumeFixMockup.tsx` — client component, **sem props**
(conteúdo e timings internos; YAGNI). anime.js roda apenas no client
(`useEffect`); o SSR entrega a folha no estado inicial "com erros".

Integração em `src/app/page.tsx` (server component, sem mudança de natureza):
trocar `<VideoMockup src=… url=… />` por `<ResumeFixMockup />` dentro dos
mesmos wrappers (`TiltCard` + badges) nos dois pontos do hero. O import de
`VideoMockup` permanece (spotlights).

## A folha de currículo

- Fundo off-white, cantos arredondados, sombra forte, proporção retrato
  ≈ 1:1.3, largura máxima ~26rem (não estoura a altura do hero).
- Conteúdo híbrido para legibilidade em tamanho pequeno: texto real apenas
  nas frases que recebem correção; o resto vira barras cinza (skeleton),
  como documento "greeked".

| Seção | Texto errado (camada base) | Correção (camada sobreposta) |
|---|---|---|
| Cabeçalho | "Mariana Souza — Analista de Marketing" + barras de contato | (sem correção) |
| Resumo | "Busco uma oportunidade na área para crescer profissionalmente." | "Analista de marketing com 5 anos de experiência em growth e CRM." |
| Experiência | "Responsável pelas vendas da empresa." | "Aumentei as vendas em 32% em 12 meses liderando time de 6." |
| Habilidades | "Organisação e trabalho em equipe" | "Organização, liderança e trabalho em equipe." |
| Formação | "Fiz faculdade de administração." | "Bacharelado em Administração — concluído em 2019." |

## Sequência da animação

> Histórico: v1 assentava a correção por cima do erro (ficou com sobras);
> v2 replicou a explosão 3D do demo accessible (rotateY 45°, caixinhas
> vermelhas, correção atrás) — Gustavo viu e não gostou do 3D na folha.
> v3 (atual, 2026-07-11): troca suave sem 3D, a pedido dele — "os textos
> errados saindo e os novos entrando, surgindo com esse tom de verde".

Timeline única do anime.js com `loop` + `alternate`:

1. **Estado "com erros"** (~2,6 s): folha mostra os 4 textos errados; um
   sublinhado ondulado vermelho (estilo corretor ortográfico) surge sob
   cada um, de cima para baixo.
2. **Troca** (cascata de ~250 ms entre os 4 erros, de cima para baixo):
   as palavras erradas SAEM — sobem ~0.45rem desvanecendo, em ordem
   aleatória (`stagger(24, { from: 'random' })`, ~500 ms) — e as palavras
   corrigidas ENTRAM por baixo no mesmo lugar (~+200 ms, sobem de 0.5rem,
   ~600 ms, `stagger(26)`), em verde-esmeralda (text-emerald-700), sem
   contorno. Sem rotação, sem profundidade.
3. **Estado "corrigido"** (~2,6 s): só a versão verde visível (o errado
   está a opacidade 0 — sem sobras por construção).
4. `alternate` desfaz a troca e o ciclo recomeça.

Estado inicial via CSS: erros visíveis, overlays com opacidade 0 — sem JS a
folha parece um CV normal (aceitável, é decorativa).

## Acessibilidade e performance

- **`prefers-reduced-motion`:** decisão do Gustavo (2026-07-11): a animação
  roda para TODOS, sem checagem — é decoração `aria-hidden` e a vitrine do
  produto no hero (no Windows, "Efeitos de animação" desligado ativa o
  reduce e esconderia a animação). O fallback estático .cv-static foi
  removido.
- Container inteiro com `aria-hidden` (mesmo tratamento do vídeo atual):
  decoração com CV fictício, leitor de tela não narra. O clone acessível do
  `splitText` fica no default (sem custo).
- `IntersectionObserver` pausa/retoma a timeline fora do viewport (mesmo
  padrão do `VideoMockup`).
- Saldo de peso: hero deixa de carregar um MP4; entra ~20 KB de JS.

## Verificação

- `npm run type-check` e `npm run lint` (build completo local falha por chave
  Firebase redigida — não é critério).
- Verificação visual no dev server: desktop e viewport mobile, loop completo,
  hover do TiltCard.
