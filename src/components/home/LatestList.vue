<template>
  <div v-if="news.length" class="latest">
    <div
      v-for="item in news"
      :key="item.id"
      class="latest__row"
      role="link"
      :tabindex="0"
      @click="go(item)"
      @keydown.enter="go(item)"
    >
      <time class="latest__clock">{{ clock(item.publishedAt) }}</time>
      <span class="latest__tag">{{ item.source }}</span>
      <h3 class="latest__title">{{ item.title }}</h3>
      <span class="latest__arrow" aria-hidden="true">→</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import type { NewsItem } from '@/types/api.types';

defineProps<{ news: NewsItem[] }>();
const router = useRouter();

function clock(datetime: string) {
  return dayjs(datetime).format('HH:mm');
}
function go(item: NewsItem) {
  router.push(`/news/${item.id}`);
}
</script>

<style scoped>
.latest__row {
  display: grid;
  grid-template-columns: 64px 140px 1fr 20px;
  align-items: baseline;
  gap: 1rem;
  padding: 0.8rem 0.5rem;
  border-bottom: 1px solid var(--zc-border);
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s, transform 0.15s;
}
.latest__row:last-child {
  border-bottom: none;
}
.latest__row:hover {
  background: var(--zc-surface);
}
.latest__clock {
  font-family: var(--font-condensed);
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--zc-primary);
}
.latest__tag {
  font-family: var(--font-condensed);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.75rem;
  color: var(--zc-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.latest__title {
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: 1.02rem;
  line-height: 1.4;
  color: var(--zc-ink);
  margin: 0;
  transition: color 0.15s;
}
.latest__row:hover .latest__title {
  color: var(--zc-primary);
}
.latest__arrow {
  justify-self: end;
  color: var(--zc-faint);
  font-size: 1.05rem;
  transition: transform 0.15s, color 0.15s;
}
.latest__row:hover .latest__arrow {
  color: var(--zc-primary);
  transform: translateX(3px);
}

@media (max-width: 720px) {
  .latest__row {
    grid-template-columns: 58px 1fr 16px;
  }
  .latest__tag {
    display: none;
  }
}
</style>