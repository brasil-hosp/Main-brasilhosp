import type { Product } from "@/types/product";

// Normaliza: minúsculas + remove acentos (PT: "válvula"->"valvula", "respiratório"->"respiratorio").
const norm = (s: string): string =>
  (s || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

// Texto pesquisável do produto: nome + descrição (specs) + categoria + subcategoria.
const haystack = (p: Product): string =>
  norm(`${p.name} ${p.description || ""} ${p.category || ""} ${p.subcategory || ""}`);

/**
 * Busca por TOKENS com AND: cada palavra do termo precisa aparecer em algum campo
 * (nome OU descrição/specs OU categoria/subcategoria), sem acento e com substring (parcial).
 * Resolve frases que cruzam campos — onde o Fuse falhava:
 *   "valvula red cil ar comprimido" -> VALVULA RED CIL (nome) + "AR COMPRIMIDO" (specs)
 *   "umidificador portatil"         -> UMIDIFICADOR... (nome) + "PORTATIL" (specs)
 */
export const searchProducts = (products: Product[], term: string): Product[] => {
  const tokens = norm(term).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return products;
  return products.filter((p) => {
    const text = haystack(p);
    return tokens.every((t) => text.includes(t));
  });
};
