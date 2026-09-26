export interface NewsItem {
  id: string;
  canonicalUrl: string;
  title: string;
  summary: string;
  mainImage: string;
  images: string[] | null;
  url: string;
  source: string;
  sourceUrl: string | null;
  category: string | null;
  originalTitle: string | null;
  publishedAt: string;
  viralScore: number;
  sourceCount: number;
  socialMetrics: { shares?: number; likes?: number; comments?: number } | null;
}

export interface NewsListResponse {
  news: NewsItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TrendingResponse {
  trending: NewsItem[];
}

export interface CoverageItem {
  id: string;
  title: string;
  source: string;
  sourceUrl: string | null;
  url: string;
  publishedAt: string;
}

export interface CoverageResponse {
  coverage: CoverageItem[];
}

export interface ScraperResult {
  scraped: number;
  errors: string[];
}

export interface FilterState {
  source: string;
  category: string;
  search: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  text: string;
}
