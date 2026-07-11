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
4. **Conteúdo:** CV fictício compacto com 3 erros clássicos (rascunho abaixo,
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

## Sequência da animação

Timeline única do anime.js com `loop` + `alternate`:

1. **Estado "com erros"** (~2,2 s): folha mostra os 3 textos errados; um
   sublinhado ondulado vermelho (estilo corretor ortográfico) surge sob cada
   um, de cima para baixo.
2. **Transição** (~0,8 s, cascata de ~250 ms entre os 3 erros, de cima para
   baixo): palavras erradas recuam em profundidade (z para trás, opacidade
   ~25%); palavras corrigidas entram por cima via `splitText` +
   `stagger(~30ms, { from: 'random' })` — camada verde-esmeralda com contorno
   pontilhado. A folha dá leve rotação 3D (~6°) durante a troca.
3. **Estado "corrigido"** (~2,8 s): correções assentadas sobre os originais
   apagados.
4. `alternate` desfaz a transição e o ciclo recomeça.

Estado inicial via CSS: erros visíveis, overlays com opacidade 0 — sem JS a
folha parece um CV normal (aceitável, é decorativa).

## Acessibilidade e performance

- **`prefers-reduced-motion: reduce`:** não cria timeline; aplica direto o
  estado final estático (correções visíveis, originais apagados).
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
  hover do TiltCard, e emulação de `prefers-reduced-motion`.
