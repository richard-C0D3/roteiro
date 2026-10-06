import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./style.css";
import { BASE, DIAS, PARAGENS, ROTULO_ACESSO, type Dia, type Paragem } from "./roteiro";
import { obterRota, type Ponto, type Rota } from "./routing";

const semAnimacao = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Estado ----------
let diaAtivo: number | null = null; // null = todos os dias
const rotas = new Map<number, Rota>();
const grupos = new Map<number, L.LayerGroup>();
const marcadores = new Map<Paragem, L.Marker>();

const elDias = document.getElementById("dias")!;
const elResumo = document.getElementById("resumo")!;
const elParagens = document.getElementById("paragens")!;

// ---------- Mapa ----------
const mapa = L.map("mapa", { zoomControl: false }).setView([39.95, 4.08], 10);
L.control.zoom({ position: "bottomright" }).addTo(mapa);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(mapa);

const corDoDia = (n: number) => DIAS.find((d) => d.numero === n)?.cor ?? "#333";
const paragensDoDia = (n: number) => PARAGENS.filter((p) => p.dia === n);

function pontosDeCarro(n: number): Ponto[] {
  const carro = paragensDoDia(n).filter((p) => p.acesso === "carro");
  return BASE ? [BASE, ...carro, BASE] : carro;
}

function icone(numero: number, cor: string, acesso: Paragem["acesso"]): L.DivIcon {
  const leve = acesso !== "carro" ? " pino--leve" : "";
  return L.divIcon({
    className: "pino-wrap",
    html: `<span class="pino${leve}" style="--cor:${cor}">${numero}</span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

function construirGrupo(dia: Dia): L.LayerGroup {
  const grupo = L.layerGroup();
  paragensDoDia(dia.numero).forEach((p, i) => {
    const m = L.marker([p.lat, p.lon], { icon: icone(i + 1, dia.cor, p.acesso), title: p.nome })
      .bindPopup(
        `<strong>${p.nome}</strong><br>${p.descricao}<br><em>Dia ${dia.numero}, ${ROTULO_ACESSO[p.acesso]}</em>`,
      )
      .addTo(grupo);
    marcadores.set(p, m);
  });
  return grupo;
}

function desenharRota(n: number, rota: Rota): void {
  const grupo = grupos.get(n);
  if (!grupo || rota.coords.length < 2) return;
  const opcoes = rota.aproximada ? { dashArray: "6 8" } : {};
  // contorno branco primeiro, linha colorida por cima (os marcadores ficam sempre acima)
  L.polyline(rota.coords, { color: "#fff", weight: 8, opacity: 0.9, ...opcoes }).addTo(grupo);
  L.polyline(rota.coords, { color: corDoDia(n), weight: 4.5, opacity: 0.95, ...opcoes }).addTo(grupo);
}

// ---------- Formatação ----------
function fmtDuracao(min: number): string {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return h > 0 ? `${h} h ${String(m).padStart(2, "0")}` : `${m} min`;
}

// ---------- Interface ----------
function renderDias(): void {
  elDias.innerHTML = "";
  const opcoes: { valor: number | null; rotulo: string; cor: string }[] = [
    { valor: null, rotulo: "Todos", cor: "var(--mar)" },
    ...DIAS.map((d) => ({ valor: d.numero, rotulo: `Dia ${d.numero}`, cor: d.cor })),
  ];
  for (const o of opcoes) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "dia";
    b.textContent = o.rotulo;
    b.style.setProperty("--cor", o.cor);
    b.setAttribute("aria-pressed", String(diaAtivo === o.valor));
    b.addEventListener("click", () => selecionarDia(o.valor));
    elDias.appendChild(b);
  }
}

function renderResumo(): void {
  if (diaAtivo === null) {
    const prontas = [...rotas.values()];
    const km = prontas.reduce((s, r) => s + r.distanciaKm, 0);
    const min = prontas.reduce((s, r) => s + r.duracaoMin, 0);
    const aCarregar = DIAS.length - prontas.length;
    elResumo.innerHTML = `
      <h2>A ilha toda</h2>
      <p>${PARAGENS.length} locais em ${DIAS.length} dias.
      ${BASE ? `Todos os dias partem e terminam em Son Bou. ` : ""}${prontas.length ? `Cerca de ${Math.round(km)} km e ${fmtDuracao(min)} ao volante no total.` : ""}
      ${aCarregar > 0 ? `<span class="nota">A calcular ${aCarregar} rota${aCarregar > 1 ? "s" : ""}…</span>` : ""}</p>`;
    return;
  }
  const dia = DIAS.find((d) => d.numero === diaAtivo)!;
  const rota = rotas.get(dia.numero);
  const info = rota
    ? `${rota.distanciaKm.toFixed(1)} km, cerca de ${fmtDuracao(rota.duracaoMin)} de condução.`
    : `<span class="nota">A calcular a rota…</span>`;
  const partida = BASE ? `<span class="nota">Ida e volta desde ${BASE.nome}.</span>` : "";
  const aviso = rota?.aproximada
    ? `<span class="nota">Serviço de rotas indisponível: valores em linha reta.</span>`
    : "";
  elResumo.innerHTML = `<h2 style="--cor:${dia.cor}">${dia.titulo}</h2><p>${info} ${partida} ${aviso}</p>`;
}

function renderParagens(): void {
  elParagens.innerHTML = "";
  const dias = diaAtivo === null ? DIAS : DIAS.filter((d) => d.numero === diaAtivo);

  for (const dia of dias) {
    if (diaAtivo === null) {
      const cab = document.createElement("li");
      cab.className = "cabecalho-dia";
      cab.style.setProperty("--cor", dia.cor);
      cab.innerHTML = `<button type="button">Dia ${dia.numero}<span>${dia.titulo}</span></button>`;
      cab.querySelector("button")!.addEventListener("click", () => selecionarDia(dia.numero));
      elParagens.appendChild(cab);
    }
    paragensDoDia(dia.numero).forEach((p, i) => {
      const li = document.createElement("li");
      li.className = `paragem paragem--${p.acesso}`;
      li.style.setProperty("--cor", dia.cor);
      li.innerHTML = `
        <button type="button">
          <span class="num">${i + 1}</span>
          <span class="texto">
            <span class="nome">${p.nome}</span>
            <span class="desc">${p.descricao}</span>
          </span>
          ${p.acesso !== "carro" ? `<span class="acesso">${ROTULO_ACESSO[p.acesso]}</span>` : ""}
        </button>`;
      li.querySelector("button")!.addEventListener("click", () => focarParagem(p));
      elParagens.appendChild(li);
    });
  }
}

function focarParagem(p: Paragem): void {
  if (diaAtivo !== null && diaAtivo !== p.dia) selecionarDia(p.dia);
  if (semAnimacao) mapa.setView([p.lat, p.lon], 14);
  else mapa.flyTo([p.lat, p.lon], 14, { duration: 0.8 });
  marcadores.get(p)?.openPopup();
}

function selecionarDia(n: number | null): void {
  diaAtivo = n;
  grupos.forEach((g, num) => {
    const visivel = n === null || n === num;
    if (visivel && !mapa.hasLayer(g)) g.addTo(mapa);
    if (!visivel && mapa.hasLayer(g)) mapa.removeLayer(g);
  });

  const pts = (n === null ? PARAGENS : paragensDoDia(n)).map((p) => L.latLng(p.lat, p.lon));
  if (pts.length) {
    const limites = L.latLngBounds(pts);
    if (semAnimacao) mapa.fitBounds(limites, { padding: [40, 40], maxZoom: 13 });
    else mapa.flyToBounds(limites, { padding: [40, 40], duration: 0.8, maxZoom: 13 });
  }

  renderDias();
  renderResumo();
  renderParagens();
}

// ---------- Arranque ----------
for (const dia of DIAS) {
  const g = construirGrupo(dia);
  grupos.set(dia.numero, g);
  g.addTo(mapa);
}
if (BASE) {
  L.marker([BASE.lat, BASE.lon], {
    icon: L.divIcon({ className: "pino-wrap", html: `<span class="pino pino--base">⌂</span>`, iconSize: [30, 30], iconAnchor: [15, 15] }),
    title: BASE.nome,
  }).bindPopup(`<strong>${BASE.nome}</strong>`).addTo(mapa);
}
selecionarDia(null);

// Pedidos em série para respeitar o servidor público do OSRM
(async () => {
  for (const dia of DIAS) {
    const rota = await obterRota(pontosDeCarro(dia.numero));
    rotas.set(dia.numero, rota);
    desenharRota(dia.numero, rota);
    renderResumo();
  }
})();
