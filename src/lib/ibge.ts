export interface BrazilianState {
  uf: string;
  name: string;
}

export const BRAZILIAN_STATES: BrazilianState[] = [
  { uf: "AC", name: "Acre" },
  { uf: "AL", name: "Alagoas" },
  { uf: "AM", name: "Amazonas" },
  { uf: "AP", name: "Amapá" },
  { uf: "BA", name: "Bahia" },
  { uf: "CE", name: "Ceará" },
  { uf: "DF", name: "Distrito Federal" },
  { uf: "ES", name: "Espírito Santo" },
  { uf: "GO", name: "Goiás" },
  { uf: "MA", name: "Maranhão" },
  { uf: "MG", name: "Minas Gerais" },
  { uf: "MS", name: "Mato Grosso do Sul" },
  { uf: "MT", name: "Mato Grosso" },
  { uf: "PA", name: "Pará" },
  { uf: "PB", name: "Paraíba" },
  { uf: "PE", name: "Pernambuco" },
  { uf: "PI", name: "Piauí" },
  { uf: "PR", name: "Paraná" },
  { uf: "RJ", name: "Rio de Janeiro" },
  { uf: "RN", name: "Rio Grande do Norte" },
  { uf: "RO", name: "Rondônia" },
  { uf: "RR", name: "Roraima" },
  { uf: "RS", name: "Rio Grande do Sul" },
  { uf: "SC", name: "Santa Catarina" },
  { uf: "SE", name: "Sergipe" },
  { uf: "SP", name: "São Paulo" },
  { uf: "TO", name: "Tocantins" },
];

const citiesCache = new Map<string, string[]>();

export async function fetchCitiesByUF(uf: string): Promise<string[]> {
  if (!uf) return [];
  if (citiesCache.has(uf)) return citiesCache.get(uf)!;
  try {
    const res = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { nome: string }[];
    const cities = data
      .map((c) => c.nome)
      .sort((a, b) => a.localeCompare(b, "pt-BR"));
    citiesCache.set(uf, cities);
    return cities;
  } catch {
    return [];
  }
}
