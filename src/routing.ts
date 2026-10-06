/**
 * Rotas de carro com o OSRM (motor de rotas sobre dados OpenStreetMap).
 * O servidor público de demonstração é gratuito mas tem limites;
 * para uso intensivo, aloja o teu próprio OSRM ou usa outro fornecedor.
 */

export interface Ponto {
  lat: number;
  lon: number;
}

export interface Rota {
  coords: [number, number][];
  distanciaKm: number;
  duracaoMin: number;
  /** true quando o serviço falhou e a linha é reta entre pontos */
  aproximada: boolean;
}

interface OsrmResposta {
  code: string;
  routes: {
    distance: number;
    duration: number;
    geometry: { coordinates: [number, number][] };
  }[];
}

const OSRM_URL = "https://router.project-osrm.org/route/v1/driving";
const PREFIXO_CACHE = "menorca-rota:";

function lerCache(chave: string): Rota | null {
  try {
    const bruto = localStorage.getItem(PREFIXO_CACHE + chave);
    return bruto ? (JSON.parse(bruto) as Rota) : null;
  } catch {
    return null;
  }
}

function gravarCache(chave: string, rota: Rota): void {
  try {
    localStorage.setItem(PREFIXO_CACHE + chave, JSON.stringify(rota));
  } catch {
    /* armazenamento cheio ou indisponível: segue sem cache */
  }
}

function haversineKm(a: Ponto, b: Ponto): number {
  const R = 6371;
  const rad = (g: number) => (g * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function rotaReta(pontos: Ponto[]): Rota {
  let km = 0;
  for (let i = 1; i < pontos.length; i++) km += haversineKm(pontos[i - 1], pontos[i]);
  return {
    coords: pontos.map((p) => [p.lat, p.lon]),
    distanciaKm: km,
    duracaoMin: (km / 50) * 60, // estimativa a 50 km/h
    aproximada: true,
  };
}

export async function obterRota(pontos: Ponto[]): Promise<Rota> {
  if (pontos.length < 2) {
    return { coords: pontos.map((p) => [p.lat, p.lon]), distanciaKm: 0, duracaoMin: 0, aproximada: false };
  }

  const coordStr = pontos.map((p) => `${p.lon.toFixed(5)},${p.lat.toFixed(5)}`).join(";");
  const emCache = lerCache(coordStr);
  if (emCache) return emCache;

  try {
    const resp = await fetch(`${OSRM_URL}/${coordStr}?overview=full&geometries=geojson`);
    if (!resp.ok) throw new Error(`OSRM respondeu ${resp.status}`);
    const dados = (await resp.json()) as OsrmResposta;
    if (dados.code !== "Ok" || dados.routes.length === 0) throw new Error(`OSRM: ${dados.code}`);

    const r = dados.routes[0];
    const rota: Rota = {
      coords: r.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
      distanciaKm: r.distance / 1000,
      duracaoMin: r.duration / 60,
      aproximada: false,
    };
    gravarCache(coordStr, rota);
    return rota;
  } catch (erro) {
    console.warn("Rota indisponível, a usar linha reta:", erro);
    return rotaReta(pontos);
  }
}
