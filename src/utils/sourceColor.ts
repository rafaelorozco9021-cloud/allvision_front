const PALETTE = [
  '#c8102e',
  '#b45309',
  '#047857',
  '#1d4ed8',
  '#6d28d9',
  '#0e7490',
  '#be185d',
  '#72530a',
];

export function sourceColor(source: string): string {
  if (!source) return PALETTE[0];
  let hash = 0;
  for (let i = 0; i < source.length; i++) {
    hash = (hash * 31 + source.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}

export function sourceColorSoft(color: string): string {
  return `${color}1a`;
}