export interface NewsCategory {
  key: string;
  label: string;
}

/** Taxonomia del backend (category-classifier). 'generales' = sin filtro. */
export const NEWS_CATEGORIES: NewsCategory[] = [
  { key: '', label: 'Generales' },
  { key: 'politica', label: 'Política' },
  { key: 'judiciales', label: 'Judiciales' },
  { key: 'sucesos', label: 'Sucesos' },
  { key: 'tecnologia', label: 'Tecnología' },
  { key: 'economia', label: 'Economía' },
  { key: 'deportes', label: 'Deportes' },
  { key: 'opinion', label: 'Opinión' },
  { key: 'mundo', label: 'Mundo' },
];

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  NEWS_CATEGORIES.map((c) => [c.key || 'generales', c.label]),
);

export function categoryLabel(key?: string | null): string {
  if (!key) return 'Generales';
  return CATEGORY_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1);
}
