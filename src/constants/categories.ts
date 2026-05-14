export const PRODUCT_CATEGORIES = [
  'Medicamentos',
  'Descartáveis',
  'Equipamentos',
  'Ortopedia',
  'Odontologia',
  'Cuidados e Bem-Estar',
] as const;

// Catalog includes "Todos" as first option
export const CATALOG_CATEGORIES = ['Todos', ...PRODUCT_CATEGORIES] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
