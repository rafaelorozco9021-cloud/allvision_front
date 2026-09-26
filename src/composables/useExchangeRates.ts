import { ref } from 'vue';

export interface CurrencyRate {
  code: string;
  label: string;
  /** Pesos colombianos por 1 unidad de la moneda. */
  cop: number | null;
}

const API_URL = 'https://open.er-api.com/v6/latest/USD';
const REFRESH_MS = 30 * 60 * 1000;

const CURRENCIES: Array<{ code: string; label: string }> = [
  { code: 'USD', label: 'Dólar' },
  { code: 'EUR', label: 'Euro' },
  { code: 'GBP', label: 'Libra' },
  { code: 'BRL', label: 'Real' },
  { code: 'MXN', label: 'Peso mex.' },
  { code: 'VES', label: 'Bolívar' },
];

// Estado compartido entre montajes
const rates = ref<CurrencyRate[]>(CURRENCIES.map((c) => ({ ...c, cop: null })));
const updatedAt = ref<Date | null>(null);
const error = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;
let fetching = false;

export function formatCOP(value: number): string {
  const decimals = value >= 1000 ? 0 : 2;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

async function load() {
  if (fetching) return;
  fetching = true;
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.result !== 'success' || !data.rates?.COP) throw new Error('Bad payload');
    const copPerUsd: number = data.rates.COP;
    rates.value = CURRENCIES.map((c) => {
      if (c.code === 'USD') return { ...c, cop: copPerUsd };
      const perUsd: number | undefined = data.rates[c.code];
      return { ...c, cop: perUsd ? copPerUsd / perUsd : null };
    });
    updatedAt.value = new Date();
    error.value = false;
  } catch {
    error.value = true;
  } finally {
    fetching = false;
  }
}

export function useExchangeRates() {
  if (!timer) {
    load();
    timer = setInterval(load, REFRESH_MS);
  }
  return { rates, updatedAt, error, refresh: load };
}
