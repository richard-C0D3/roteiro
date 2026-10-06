# Menorca em 8 dias

Página em TypeScript (Vite + Leaflet) com o roteiro no mapa OpenStreetMap
e rotas de carro por dia calculadas com o OSRM.

## Correr

    npm install
    npm run dev

Para gerar a versão estática: `npm run build` (fica em `dist/`).

## Editar

- `src/roteiro.ts` — locais, coordenadas, cores dos dias e alojamento (`BASE`).
- Locais com `acesso: "pe" | "barco" | "vista"` aparecem no mapa mas não entram na rota de carro.
- `src/routing.ts` — chamada ao OSRM, com cache no navegador e linha reta se o serviço falhar.
