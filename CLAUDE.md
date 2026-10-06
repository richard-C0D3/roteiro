# Menorca em 8 dias — contexto do projeto

Página web em TypeScript que mostra um roteiro de férias em Menorca num mapa
OpenStreetMap, com rotas de carro calculadas por dia. Projeto pessoal, sem backend.
O utilizador fala português (PT-PT); textos da interface e comentários em português.

## Stack

- Vite 5 + TypeScript (strict), sem framework (DOM direto)
- Leaflet 1.9 para o mapa, tiles de `tile.openstreetmap.org`
- OSRM (servidor público `router.project-osrm.org`) para rotas de carro
- Fontes Google: Young Serif (títulos) e Figtree (texto)

Comandos: `npm install`, `npm run dev`, `npm run build` (faz `tsc` + `vite build` para `dist/`).

## Estrutura

- `index.html` — esqueleto: painel lateral (`#dias`, `#resumo`, `#paragens`) e `#mapa`
- `src/roteiro.ts` — **fonte de verdade dos dados**: tipos `Paragem`, `Dia`, `Acesso`;
  arrays `DIAS` (número, título, cor) e `PARAGENS` (41 locais); constante `BASE`
- `src/routing.ts` — `obterRota(pontos)`: chama o OSRM, devolve `Rota`
  (coords, km, minutos, `aproximada`); cache em `localStorage` (prefixo `menorca-rota:`,
  chave = coordenadas); se falhar, devolve linha reta com estimativa a 50 km/h
- `src/main.ts` — mapa, um `L.LayerGroup` por dia, marcadores `divIcon` numerados,
  seleção de dia ("Todos" ou 1–8), lista clicável, resumo de km/tempo
- `src/style.css` — tokens de cor em `:root` (`--cal`, `--mar`, `--agua`, `--mares`,
  `--pedra`, `--linha`); cada dia passa a sua cor via variável CSS `--cor`;
  layout empilhado (mapa em cima) abaixo de 800px

## Regras de negócio

- **Base**: residência em Son Bou (`BASE` em `roteiro.ts`, coordenada aproximada
  39.9012, 4.0745). Todos os dias começam e terminam na base; `pontosDeCarro()` em
  `main.ts` faz `[BASE, ...paragens de carro, BASE]`.
- **Acesso** de cada paragem: `carro` entra na rota; `pe` (a pé desde a paragem
  anterior), `barco` (só de barco, passeio a partir de Cala Galdana no dia 3) e
  `vista` (Far de l'Illa de l'Aire, ilhota) aparecem no mapa com marcador vazado
  mas **não entram na rota de carro**.
- A ordem das paragens dentro de cada dia é a ordem do array e é intencional
  (vem do roteiro original do utilizador). Não reordenar sem pedido.
- Pedidos ao OSRM são feitos em série (um dia de cada vez) para respeitar o
  servidor público. Rota aproximada é desenhada a tracejado e avisada no resumo.

## Estado e pontos em aberto

- As coordenadas dos 41 locais foram estimadas, não vieram do roteiro original
  (um RTF só com nome, dia e descrição). Devem ser verificadas, sobretudo os
  parques de estacionamento das calas (Turqueta, Macarella, Mitjana, Pilar,
  Algaiarens, Presili).
- O projeto ainda não foi corrido com dependências instaladas; o TypeScript foi
  validado apenas com um stub do Leaflet. Primeiro passo: `npm install && npm run build`
  e corrigir o que aparecer.
- Ideias possíveis (não pedidas ainda): links de navegação por paragem,
  exportar GPX por dia, editar a ordem por arrastar, servidor OSRM próprio.
