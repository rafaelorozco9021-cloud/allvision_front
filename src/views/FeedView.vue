<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useNewsStore } from '@/stores/news.store';
import NewsCard from '@/components/news/NewsCard.vue';
import FilterBar from '@/components/home/FilterBar.vue';
import SectionTitle from '@/components/home/SectionTitle.vue';
import SkeletonLoader from '@/components/common/SkeletonLoader.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import { useInfiniteScroll } from '@/composables/useInfiniteScroll';
import { categoryLabel } from '@/utils/categories';

const store = useNewsStore();
const route = useRoute();
const sentinelRef = ref<HTMLElement | null>(null);

const sourcesForFilter = ['El Tiempo', 'El Heraldo', 'El Espectador', 'Zona Cero', 'Semana', 'La Patilla', 'El Nacional', 'Noticia al Dia'];

const activeCat = computed(() => (route.query.cat as string) || '');
const pageTitle = computed(() => (activeCat.value ? categoryLabel(activeCat.value) : 'Noticias'));

function applyCatFromRoute() {
  store.setFilter('category', activeCat.value);
  store.fetchNews(true);
}

onMounted(applyCatFromRoute);
watch(() => route.query.cat, applyCatFromRoute);

const { setup } = useInfiniteScroll(() => {
  if (!store.loading && store.hasMore) store.fetchNews(false);
}, true);

onMounted(() => {
  if (sentinelRef.value) setup(sentinelRef.value);
});
</script>

<template>
  <div class="feed-page">
    <SectionTitle>{{ pageTitle }}</SectionTitle>
    <FilterBar :sources="sourcesForFilter" @refresh="store.fetchNews(true)" />

    <div v-if="store.filteredNews.length === 0 && !store.loading" class="empty-container">
      <EmptyState />
    </div>

    <div v-if="store.filteredNews.length > 0" class="feed-grid">
      <NewsCard
        v-for="(news, i) in store.filteredNews"
        :key="news.id"
        :news="news"
        :variant="i === 0 ? 'large' : 'default'"
      />
    </div>

    <div v-if="store.loading" class="skeleton-container">
      <SkeletonLoader v-for="i in 6" :key="i" />
    </div>

    <div v-if="store.error" class="error-container">
      <ErrorState :message="store.error" @retry="store.fetchNews(true)" />
    </div>

    <div ref="sentinelRef" class="scroll-sentinel"></div>
  </div>
</template>

<style scoped>
.feed-page {
  padding: 1.8rem 0;
}
.feed-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.75rem 1.5rem;
  padding: 1.25rem 0;
}
.skeleton-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1.25rem 0;
}
.scroll-sentinel {
  height: 1px;
  width: 100%;
}
</style>