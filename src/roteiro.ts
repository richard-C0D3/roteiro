/**
 * Dados do roteiro.
 *
 * acesso:
 *  - "carro"  → entra na rota de carro do dia
 *  - "pe"     → chega-se a pé a partir da paragem anterior (não entra na rota)
 *  - "barco"  → só acessível de barco (não entra na rota)
 *  - "vista"  → ponto que se vê de terra, sem acesso direto (ex.: farol na ilhota)
 *
 * As coordenadas são aproximadas (parque de estacionamento ou centro do local).
 * Convém confirmá-las antes da viagem.
 */

export type Acesso = "carro" | "pe" | "barco" | "vista";

export interface Paragem {
  nome: string;
  dia: number;
  zona: string;
  descricao: string;
  lat: number;
  lon: number;
  acesso: Acesso;
}

export interface Dia {
  numero: number;
  titulo: string;
  cor: string;
  /** Indicações do dia (aparecem no resumo quando o dia está selecionado). */
  notas?: string[];
}

/**
 * Opcional: o teu alojamento. Se preencheres, cada dia começa e termina aqui.
 * Exemplo: { nome: "Hotel", lat: 39.9998, lon: 3.8420 }
 */
export const BASE: { nome: string; lat: number; lon: number } | null = {
  nome: "Residência em Son Bou",
  lat: 39.9012,
  lon: 4.0745,
};

export const DIAS: Dia[] = [
  { numero: 1, titulo: "Ciutadella e oeste", cor: "#00798C" },
  {
    numero: 2,
    titulo: "As grandes calas do sul",
    cor: "#D1495B",
    notas: ["Conhecer várias calas sem passar horas em cada uma."],
  },
  {
    numero: 3,
    titulo: "Passeio de barco pela costa sul",
    cor: "#C99A2E",
    notas: [
      "Preferência: saída de Cala Galdana.",
      "Procurar um passeio que passe por Mitjana, Trebalúger, Fustam, Escorxada, Binigaus, Santo Tomás, Macarella/Macarelleta e Turqueta.",
      "Se o mar estiver bom, este pode ser um dos melhores dias da viagem.",
      "Se houver vento ou mar desfavorável, trocar este dia com o dia 8.",
    ],
  },
  { numero: 4, titulo: "Norte selvagem", cor: "#30638E" },
  { numero: 5, titulo: "Mahón e sudeste", cor: "#6A994E" },
  { numero: 6, titulo: "Es Grau, Favàritx e nordeste", cor: "#8E5BA8" },
  { numero: 7, titulo: "Centro e praias diferentes", cor: "#E36414" },
  {
    numero: 8,
    titulo: "Dia flexível",
    cor: "#2B2D42",
    notas: [
      "Repetir a praia de que mais se gostou (Macarella, Turqueta ou Mitjana).",
      "Alternativa: Cala Pilar + Algaiarens + Cala Morell.",
      "Alternativa: interior, Es Mercadal e Alaior + património talaiótico.",
      "Alternativa: fazer o passeio de barco, se o dia 3 tiver vento.",
      "Não preencher demasiado este dia: usar para adaptar a viagem ao tempo.",
    ],
  },
];

export const PARAGENS: Paragem[] = [
  // Dia 1
  { nome: "Ciutadella (centro histórico)", dia: 1, zona: "Centro", descricao: "Centro histórico, Catedral, Plaça des Born, ruas antigas e porto. Almoço/jantar em Ciutadella", lat: 40.001, lon: 3.839, acesso: "carro" },
  { nome: "Pont d'en Gil", dia: 1, zona: "Oeste", descricao: "Ao final da tarde, para o pôr do sol nas falésias", lat: 40.0137, lon: 3.7952, acesso: "carro" },

  // Dia 2
  { nome: "Cala en Turqueta", dia: 2, zona: "Sul", descricao: "Grande cala selvagem", lat: 39.9334, lon: 3.915, acesso: "carro" },
  { nome: "Cala Macarella", dia: 2, zona: "Sul", descricao: "Grande cala selvagem", lat: 39.9374, lon: 3.9381, acesso: "carro" },
  { nome: "Cala Macarelleta", dia: 2, zona: "Sul", descricao: "Acesso a pé desde Macarella", lat: 39.9353, lon: 3.9349, acesso: "pe" },
  { nome: "Cala Mitjana", dia: 2, zona: "Sul", descricao: "Grande cala selvagem", lat: 39.9311, lon: 3.9711, acesso: "carro" },
  { nome: "Cala Mitjaneta", dia: 2, zona: "Sul", descricao: "Pequena enseada ao lado de Mitjana", lat: 39.9306, lon: 3.9688, acesso: "pe" },

  // Dia 3
  { nome: "Cala Galdana", dia: 3, zona: "Sul", descricao: "Saída preferida do passeio de barco", lat: 39.9367, lon: 3.9578, acesso: "carro" },
  { nome: "Cala Trebaluger", dia: 3, zona: "Sul", descricao: "Apenas acessível por barco", lat: 39.9256, lon: 3.9897, acesso: "barco" },
  { nome: "Cala Fustam", dia: 3, zona: "Sul", descricao: "Praia muito isolada", lat: 39.923, lon: 3.999, acesso: "barco" },
  { nome: "Cala Escorxada", dia: 3, zona: "Sul", descricao: "Praia intocada", lat: 39.9208, lon: 4.006, acesso: "barco" },
  { nome: "Santo Tomás", dia: 3, zona: "Sul", descricao: "Zona com hotéis e serviços", lat: 39.915, lon: 4.038, acesso: "carro" },
  { nome: "Binigaus", dia: 3, zona: "Sul", descricao: "Praia nudista selvagem", lat: 39.914, lon: 4.023, acesso: "pe" },
  { nome: "Son Bou", dia: 3, zona: "Sul", descricao: "A maior praia de Menorca", lat: 39.899, lon: 4.075, acesso: "carro" },

  // Dia 4
  { nome: "Monte Toro", dia: 4, zona: "Centro", descricao: "O ponto mais alto de Menorca", lat: 39.9871, lon: 4.1123, acesso: "carro" },
  { nome: "Platja de Cavalleria", dia: 4, zona: "Norte", descricao: "Areia vermelha", lat: 40.0569, lon: 4.0697, acesso: "carro" },
  { nome: "Far de Cavalleria", dia: 4, zona: "Norte", descricao: "Farol nas falésias", lat: 40.0889, lon: 4.0911, acesso: "carro" },
  { nome: "Binimel·là", dia: 4, zona: "Norte", descricao: "Acesso a pé para Pregonda", lat: 40.05, lon: 4.049, acesso: "carro" },
  { nome: "Cala Pregonda", dia: 4, zona: "Norte", descricao: "Paisagem lunar", lat: 40.0545, lon: 4.0396, acesso: "pe" },
  { nome: "Cala Morell", dia: 4, zona: "Noroeste", descricao: "Se houver tempo/energia. Necrópole e enseada", lat: 40.054, lon: 3.881, acesso: "carro" },

  // Dia 5
  { nome: "Maó", dia: 5, zona: "Leste", descricao: "Centro histórico, mercado e porto", lat: 39.8885, lon: 4.2658, acesso: "carro" },
  { nome: "Fortaleza de La Mola", dia: 5, zona: "Leste", descricao: "Fortaleza histórica, se houver interesse em história", lat: 39.882, lon: 4.31, acesso: "carro" },
  { nome: "Cales Fonts", dia: 5, zona: "Leste", descricao: "Antigo porto de pescadores", lat: 39.872, lon: 4.288, acesso: "carro" },
  { nome: "Binibeca Vell", dia: 5, zona: "Sudeste", descricao: "O famoso povoado branco", lat: 39.8227, lon: 4.227, acesso: "carro" },
  { nome: "Punta Prima", dia: 5, zona: "Sudeste", descricao: "Praia com vista para a Illa de l'Aire", lat: 39.813, lon: 4.281, acesso: "carro" },
  { nome: "Far de l'Illa de l'Aire", dia: 5, zona: "Sudeste", descricao: "Farol na ilha em frente, se der", lat: 39.802, lon: 4.293, acesso: "vista" },

  // Dia 6
  { nome: "Parc Natural de s'Albufera des Grau", dia: 6, zona: "Nordeste", descricao: "Reserva natural", lat: 39.948, lon: 4.234, acesso: "carro" },
  { nome: "Es Grau", dia: 6, zona: "Nordeste", descricao: "Vila piscatória e praia calma", lat: 39.948, lon: 4.266, acesso: "carro" },
  { nome: "Cala Tortuga", dia: 6, zona: "Nordeste", descricao: "Praia selvagem da reserva", lat: 39.964, lon: 4.268, acesso: "pe" },
  { nome: "Cala Presili", dia: 6, zona: "Nordeste", descricao: "Praia com vista para o farol", lat: 39.976, lon: 4.282, acesso: "carro" },
  { nome: "Far de Favàritx", dia: 6, zona: "Nordeste", descricao: "Farol rodeado de rocha escura", lat: 39.9967, lon: 4.2672, acesso: "carro" },

  // Dia 7
  { nome: "Torre d'en Galmés", dia: 7, zona: "Centro", descricao: "Povoado talaiótico, o maior da ilha", lat: 39.922, lon: 4.058, acesso: "carro" },
  { nome: "Arenal d'en Castell", dia: 7, zona: "Nordeste", descricao: "Baía circular com águas calmas", lat: 40.02, lon: 4.179, acesso: "carro" },
  { nome: "Son Parc", dia: 7, zona: "Nordeste", descricao: "Praia com sistema de dunas", lat: 40.028, lon: 4.172, acesso: "carro" },
  { nome: "Cala en Porter", dia: 7, zona: "Centro sul", descricao: "Praia entre falésias altas", lat: 39.871, lon: 4.13, acesso: "carro" },
  { nome: "Cova d'en Xoroi", dia: 7, zona: "Centro sul", descricao: "Ao final do dia, bar nas falésias para o pôr do sol", lat: 39.868, lon: 4.134, acesso: "carro" },

  // Dia 8
  { nome: "Cala Pilar", dia: 8, zona: "Norte", descricao: "Alternativa com Algaiarens e Cala Morell. Praia dourada de acesso difícil", lat: 40.051, lon: 3.987, acesso: "carro" },
  { nome: "Algaiarens", dia: 8, zona: "Norte", descricao: "Alternativa com Cala Pilar e Cala Morell. Duas praias de areia branca", lat: 40.049, lon: 3.917, acesso: "carro" },
  { nome: "Es Mercadal", dia: 8, zona: "Interior", descricao: "Alternativa de interior. Vila tradicional gastronómica", lat: 39.99, lon: 4.093, acesso: "carro" },
  { nome: "Alaior", dia: 8, zona: "Interior", descricao: "Alternativa de interior. Vila conhecida pelos queijos", lat: 39.93, lon: 4.14, acesso: "carro" },
];

export const ROTULO_ACESSO: Record<Acesso, string> = {
  carro: "de carro",
  pe: "a pé",
  barco: "só de barco",
  vista: "vê-se de terra",
};
