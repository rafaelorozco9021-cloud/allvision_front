<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNewsStore } from '@/stores/news.store';
import SectionTitle from '@/components/home/SectionTitle.vue';
import TimeAgo from '@/components/common/TimeAgo.vue';
import SkeletonLoader from '@/components/common/SkeletonLoader.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import type { NewsItem } from '@/types/api.types';

const store = useNewsStore();
const router = useRouter();

onMounted(() => {
  store.fetchTrending();
});

function pad(n: number) {
  return n + 1 < 10 ? `0${n + 1}` : `${n + 1}`;
}
function go(item: NewsItem) {
  router.push(`/news/${item.id}`);
}
</script>

<template>
  <div class="ranking-page">
    <SectionTitle>Lo más leído</SectionTitle>

    <div v-if="store.loading && store.trending.length === 0" class="skeleton-container">
      <SkeletonLoader v-for="i in 8" :key="i" />
    </div>

    <div v-if="store.trending.length === 0 && !store.loading" class="empty-container">
      <EmptyState />
    </div>

    <ol v-if="store.trending.length > 0" class="ranking">
      <li
        v-for="(item, i) in store.trending"
        :key="item.id"
        class="ranking__item"
        role="link"
        :tabindex="0"
        @click="go(item)"
        @keydown.enter="go(item)"
      >
        <span class="ranking__rank" :class="{ 'ranking__rank--top': i === 0 }">{{ pad(i) }}</span>
        <div class="ranking__media">
          <img v-if="item.mainImage" :src="item.mainImage" :alt="item.title" class="ranking__image" loading="lazy" />
        </div>
        <div class="ranking__info">
          <span class="ranking__tag">{{ item.source }}</span>
          <h2 class="ranking__title">{{ item.title }}</h2>
          <p class="ranking__summary">{{ item.summary }}</p>
          <span class="ranking__time"><TimeAgo :datetime="item.publishedAt" /></span>
        </div>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.ranking-page {
  max-width: 920px;
  margin: 0 auto;
  padding: 1.75rem 0;
}
.ranking {
  list-style: none;
  margin: 0;
  padding: 0;
}
.ranking__item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.1rem 0;
  border-bottom: 1px solid var(--zc-border);
  cursor: pointer;
}
.ranking__item:last-child {
  border-bottom: none;
}
.ranking__rank {
  font-family: 'Roboto Condensed', 'Arial Narrow', Arial, sans-serif;
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1;
  color: #c8c8c8;
  min-width: 52px;
}
.ranking__rank--top {
  color: var(--zc-primary);
}
.ranking__media {
  width: 168px;
  height: 106px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 5px;
}
.ranking__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.ranking__item:hover .ranking__image {
  transform: scale(1.05);
}
.ranking__info {
  flex: 1;
}
.ranking__tag {
  font-family: 'Roboto Condensed', 'Arial Narrow', Arial, sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--zc-primary);
}
.ranking__title {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--zc-ink);
  margin: 0.3rem 0 0.4rem;
  cursor: pointer;
}
.ranking__item:hover .ranking__title {
  color: var(--zc-primary);
}
.ranking__summary {
  color: var(--zc-muted);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 0.4rem;
}
.ranking__time {
  font-size: 0.78rem;
  color: var(--zc-faint);
}
.skeleton-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.empty-container {
  padding: 2rem;
}
@media (max-width: 640px) {
  .ranking__media {
    width: 110px;
    height: 74px;
  }
  .ranking__rank {
    font-size: 1.8rem;
    min-width: 38px;
  }
}
</style>