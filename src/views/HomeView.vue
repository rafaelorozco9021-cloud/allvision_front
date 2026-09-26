<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useNewsStore } from '@/stores/news.store';
import { useInfiniteScroll } from '@/composables/useInfiniteScroll';
import { useReducedMotion } from '@/composables/useColorExtraction';
import FeaturedStory from '@/components/home/FeaturedStory.vue';
import MostReadSidebar from '@/components/home/MostReadSidebar.vue';
import SectionTitle from '@/components/home/SectionTitle.vue';
import LatestList from '@/components/home/LatestList.vue';
import NewsletterSignup from '@/components/home/NewsletterSignup.vue';
import NewsCard from '@/components/news/NewsCard.vue';
import SkeletonLoader from '@/components/common/SkeletonLoader.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import type { NewsItem } from '@/types/api.types';

const store = useNewsStore();
const sentinelRef = ref<HTMLElement | null>(null);
const prefersReducedMotion = useReducedMotion();

onMounted(() => {
  store.fetchNews(true);
  store.fetchTrending();
});

const { setup } = useInfiniteScroll(() => {
  if (!store.loading && store.hasMore) store.fetchNews(false);
}, !prefersReducedMotion.value);

onMounted(() => {
  if (sentinelRef.value) setup(sentinelRef.value);
});

const featured = computed(() => store.trending[0] || store.filteredNews[0]);

const pool = computed(() => store.filteredNews.filter((n) => n.id !== featured.value?.id));

const featureGrid = computed(() => pool.value.slice(0, 5));

const latest = computed(() => pool.value.slice(5, 11));

const imperdibles = computed<NewsItem[]>(() => {
  const base = store.trending.filter((n) => n.id !== featured.value?.id);
  return base.length >= 4 ? base.slice(0, 4) : pool.value.slice(11, 15);
});
</script>

<template>
  <div>
    <div v-if="store.error && store.filteredNews.length === 0" class="error-row">
      <ErrorState :message="store.error" @retry="store.fetchNews(true)" />
    </div>

    <div v-if="!store.error || store.filteredNews.length > 0">
      <!-- Portada: destacado + rail lateral -->
      <section class="home-top">
        <div class="home-top__main">
          <FeaturedStory :news="featured" />
        </div>
        <aside class="home-top__side">
          <MostReadSidebar :news="store.trending.slice(0, 7)" />
        </aside>
      </section>

      <!-- Esqueletos de carga -->
      <section v-if="store.loading && pool.length === 0" class="skeleton-row">
        <SkeletonLoader v-for="i in 6" :key="i" />
      </section>

      <!-- Destacadas: 1 grande + 4 -->
      <section v-if="featureGrid.length" class="home-section">
        <SectionTitle>Destacadas</SectionTitle>
        <div class="feature-grid">
          <NewsCard :key="featureGrid[0].id" :news="featureGrid[0]" variant="large" />
          <NewsCard v-for="news in featureGrid.slice(1)" :key="news.id" :news="news" />
        </div>
      </section>

      <!-- Lo último: digest cronológico -->
      <section v-if="latest.length" class="home-section">
        <SectionTitle>
          Lo último
          <template #extra>
            <router-link to="/feed" class="section-seeall">Ver todas →</router-link>
          </template>
        </SectionTitle>
        <div class="latest-card">
          <LatestList :news="latest" />
        </div>
      </section>

      <!-- Imperdibles: tarjetas verticales -->
      <section v-if="imperdibles.length" class="home-section">
        <SectionTitle>Imperdibles</SectionTitle>
        <div class="imperdibles-grid">
          <NewsCard v-for="news in imperdibles" :key="news.id" :news="news" variant="tall" />
        </div>
      </section>

      <!-- Sin resultados -->
      <section v-if="pool.length === 0 && !store.loading" class="home-section">
        <SectionTitle>Noticias</SectionTitle>
        <EmptyState />
      </section>

      <NewsletterSignup />
    </div>

    <div ref="sentinelRef" class="scroll-sentinel"></div>
  </div>
</template>

<style scoped>
.home-top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 2.25rem;
  padding: 1.9rem 0;
}
.home-section {
  padding: 0.75rem 0 1.6rem;
  border-top: 1px solid var(--zc-hair);
  margin-top: 0.5rem;
}
.home-section .section-title {
  margin-top: 1rem;
}
.section-seeall {
  font-family: var(--font-condensed);
  font-weight: 700;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--zc-primary);
  text-decoration: none;
  white-space: nowrap;
}
.section-seeall:hover {
  color: var(--zc-primary-strong);
  text-decoration: underline;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 1.6rem 1.5rem;
}
.feature-grid > :first-child {
  grid-column: span 2;
}

.imperdibles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 1.5rem;
}

.latest-card {
  background: var(--zc-bg);
  border: 1px solid var(--zc-border);
  border-radius: 10px;
  padding: 0.4rem 1.1rem;
  box-shadow: var(--zc-shadow-sm);
}

.skeleton-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}
.error-row {
  padding: 2rem 0;
}
.scroll-sentinel {
  height: 1px;
  width: 100%;
}

@media (max-width: 1000px) {
  .feature-grid > :first-child {
    grid-column: span 1;
  }
}
@media (max-width: 960px) {
  .home-top {
    grid-template-columns: 1fr;
  }
}
</style>