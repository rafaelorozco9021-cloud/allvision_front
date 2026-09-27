import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { NewsItem, NewsListResponse, TrendingResponse, CoverageItem, CoverageResponse } from '@/types/api.types';
import apiClient from '@/services/api-client';

export const useNewsStore = defineStore('news', () => {
  const news = ref<NewsItem[]>([]);
  const trending = ref<NewsItem[]>([]);
  const selectedNews = ref<NewsItem | null>(null);
  const coverage = ref<CoverageItem[]>([]);
  const filters = ref<{ source: string; category: string; search: string }>({ source: '', category: '', search: '' });
  const loading = ref(false);
  const error = ref<string | null>(null);
  const total = ref(0);
  const page = ref(0);
  const hasMore = ref(true);

  const filteredNews = computed(() => {
    let result = [...news.value];
    if (filters.value.source) {
      result = result.filter((n) => n.source === filters.value.source);
    }
    if (filters.value.search) {
      const q = filters.value.search.toLowerCase();
      result = result.filter(
        (n) => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q),
      );
    }
    return result.sort((a, b) => b.sourceCount - a.sourceCount || b.viralScore - a.viralScore);
  });

  async function fetchNews(reset = false) {
    loading.value = true;
    error.value = null;
    try {
      const p = reset ? 0 : page.value;
      const { news: items, total: totalCount } = (await apiClient.get('/news', {
        params: {
          limit: 20,
          page: p,
          source: filters.value.source || undefined,
          category: filters.value.category && filters.value.category !== 'generales' ? filters.value.category : undefined,
        },
      })) as unknown as NewsListResponse;
      if (reset) {
        news.value = items;
      } else {
        // Deduplica por id. El backend ya pagina con un orden estable, pero
        // si dos disparos de scroll se cruzan antes de resolver, la misma
        // pagina se anade dos veces y la nota aparece repetida en el feed.
        const vistos = new Set(news.value.map((n) => n.id));
        const nuevos = items.filter((n) => !vistos.has(n.id));
        news.value = [...news.value, ...nuevos];
      }
      total.value = totalCount;
      page.value = p + 1;
      hasMore.value = news.value.length < totalCount;
    } catch (e: any) {
      error.value = e.message || 'Failed to load news';
    } finally {
      loading.value = false;
    }
  }

  async function fetchTrending() {
    try {
      const { trending: items } = (await apiClient.get('/news/trending')) as unknown as TrendingResponse;
      trending.value = items;
    } catch (e: any) {
      console.error(e);
    }
  }

  async function fetchNewsDetail(id: string) {
    loading.value = true;
    coverage.value = [];
    try {
      selectedNews.value = (await apiClient.get(`/news/${id}`)) as NewsItem;
      try {
        const res = (await apiClient.get(`/news/${id}/coverage`)) as CoverageResponse;
        coverage.value = res.coverage || [];
      } catch {
        coverage.value = [];
      }
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  }

  async function triggerScraper(source?: string) {
    const params = source ? { sourceName: source } : {};
    return apiClient.post('/scraper/run', params);
  }

  function setFilter(key: string, value: string) {
    (filters.value as any)[key] = value;
  }

  function clearFilters() {
    filters.value = { source: '', category: '', search: '' };
  }

  return {
    news,
    trending,
    selectedNews,
    coverage,
    filters,
    loading,
    error,
    total,
    page,
    hasMore,
    filteredNews,
    fetchNews,
    fetchTrending,
    fetchNewsDetail,
    triggerScraper,
    setFilter,
    clearFilters,
  };
});
