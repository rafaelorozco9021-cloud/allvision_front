<template>
  <article
    class="news-card"
    :class="[`news-card--${variant}`]"
    :style="{ '--card-accent': accent }"
    role="link"
    :tabindex="0"
    @click="navigate"
    @keydown.enter="navigate"
  >
    <div class="news-card__media">
      <img
        v-if="news.mainImage"
        :src="news.mainImage"
        :alt="news.title"
        class="news-card__image"
        loading="lazy"
        @error="handleImageError"
      />
      <div v-else class="news-card__placeholder"></div>
      <span
        v-if="news.sourceCount > 1"
        class="news-card__rep"
        :title="`Esta noticia aparecio en ${news.sourceCount} medios`"
      >×{{ news.sourceCount }}</span>
    </div>

    <div class="news-card__body">
      <div class="news-card__meta">
        <a
          v-if="news.sourceUrl"
          :href="news.sourceUrl"
          target="_blank"
          rel="noopener"
          class="news-card__tag"
          @click.stop
          :title="`Ver portada de ${news.source}`"
        >{{ news.source }} ↗</a>
        <span v-else class="news-card__tag">{{ news.source }}</span>
        <span class="news-card__dot" aria-hidden="true"></span>
        <span class="news-card__time"><TimeAgo :datetime="news.publishedAt" /></span>
      </div>
      <h3 class="news-card__title">{{ truncate(news.title, limit) }}</h3>
      <a :href="news.url" target="_blank" rel="noopener" class="news-card__readmore" @click.stop>
        Leer más →
      </a>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import TimeAgo from '@/components/common/TimeAgo.vue';
import { sourceColor } from '@/utils/sourceColor';
import type { NewsItem } from '@/types/api.types';

const props = withDefaults(
  defineProps<{
    news: NewsItem;
    variant?: 'default' | 'large' | 'tall' | 'compact';
  }>(),
  { variant: 'default' },
);

const router = useRouter();

const accent = computed(() => sourceColor(props.news.source));
const limit = computed(() => (props.variant === 'large' ? 140 : 100));

function truncate(text: string, maxLen: number) {
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen).trim() + '…';
}

function handleImageError(e: Event) {
  (e.target as HTMLImageElement).style.display = 'none';
}

function navigate() {
  router.push(`/news/${props.news.id}`);
}
</script>

<style scoped>
.news-card {
  --card-accent: var(--zc-primary);
  display: flex;
  flex-direction: row;
  gap: 0.9rem;
  align-items: flex-start;
  cursor: pointer;
  overflow: hidden;
  padding-top: 3px;
  border-top: 3px solid var(--card-accent);
}
.news-card__media {
  overflow: hidden;
  border-radius: 5px;
  width: 132px;
  height: 96px;
  flex-shrink: 0;
  background: var(--zc-surface);
  position: relative;
}
.news-card__rep {
  position: absolute;
  top: 8px;
  left: 8px;
  background: var(--zc-primary);
  color: #fff;
  font-family: 'Roboto Condensed', 'Arial Narrow', Arial, sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 2px 9px;
  border-radius: 999px;
  letter-spacing: 0.5px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
}
.news-card__body {
  flex: 1;
  padding: 0.7rem 0.1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
}

/* variantes ------------------------------------------------ */
/* Todas las variantes usan miniatura fija a la izquierda (postura conservadora: 1 sola foto) */
.news-card--default,
.news-card--tall,
.news-card--large,
.news-card--compact {
  flex-direction: row;
  gap: 0.9rem;
  align-items: flex-start;
}
.news-card--default .news-card__media,
.news-card--tall .news-card__media,
.news-card--large .news-card__media,
.news-card--compact .news-card__media {
  aspect-ratio: auto;
  width: 132px;
  height: 96px;
  flex-shrink: 0;
}
.news-card--tall .news-card__title {
  font-size: 0.95rem;
}

/* grande: ocupa 2 columnas en grids editoriales pero mantiene miniatura */
.news-card--large .news-card__title {
  font-size: clamp(1.2rem, 1.6vw, 1.45rem);
  line-height: 1.25;
}

/* compacto hereda el layout base de miniatura */
.news-card--compact .news-card__body {
  padding-top: 0.15rem;
}
.news-card--compact .news-card__title {
  font-size: 0.92rem;
  line-height: 1.35;
}

/* imagen */
.news-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}
.news-card:hover .news-card__image {
  transform: scale(1.04);
}
.news-card__placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, var(--zc-hair), var(--zc-surface));
}

/* meta + título */
.news-card__meta {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.72rem;
  color: var(--zc-faint);
}
.news-card__tag {
  font-family: 'Roboto Condensed', 'Arial Narrow', Arial, sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--zc-primary);
  text-decoration: none;
}
a.news-card__tag:hover {
  text-decoration: underline;
}
.news-card__readmore {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--zc-primary);
  text-decoration: none;
  align-self: flex-start;
}
.news-card__readmore:hover {
  text-decoration: underline;
}
.news-card__dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--zc-border-strong);
}
.news-card__time {
  white-space: nowrap;
}
.news-card__title {
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: 1.02rem;
  line-height: 1.35;
  color: var(--zc-ink);
  margin: 0;
  cursor: pointer;
  transition: color 0.15s;
}
.news-card:hover .news-card__title {
  color: var(--card-accent);
}
</style>