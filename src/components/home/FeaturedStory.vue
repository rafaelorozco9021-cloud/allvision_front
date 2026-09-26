<template>
  <article v-if="news" class="hero-feature" role="link" :tabindex="0" @click="go" @keydown.enter="go">
    <div class="hero-feature__media">
      <img v-if="news.mainImage" :src="news.mainImage" :alt="news.title" class="hero-feature__image" />
      <div v-else class="hero-feature__placeholder"></div>
      <span class="hero-feature__badge">
        <span class="hero-feature__badge-dot" aria-hidden="true"></span>
        Destacada
      </span>
    </div>

    <div class="hero-feature__body">
      <div class="hero-feature__kicker" :style="{ '--kicker-color': accent }">
        <span class="hero-feature__rule" aria-hidden="true"></span>
        <span class="hero-feature__tag">{{ news.source }}</span>
      </div>
      <h2 class="hero-feature__title">{{ news.title }}</h2>
      <p class="hero-feature__summary">{{ news.summary }}</p>
      <div class="hero-feature__meta">
        <span class="hero-feature__meta-item"><TimeAgo :datetime="news.publishedAt" /></span>
        <span v-if="news.sourceCount > 1" class="hero-feature__meta-item">{{ news.sourceCount }} fuentes</span>
        <span v-if="news.socialMetrics?.shares" class="hero-feature__meta-item">{{ news.socialMetrics.shares }} compartidos</span>
      </div>
      <span class="hero-feature__read">Leer noticia
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import TimeAgo from '@/components/common/TimeAgo.vue';
import { sourceColor } from '@/utils/sourceColor';
import type { NewsItem } from '@/types/api.types';

const props = defineProps<{ news?: NewsItem }>();
const router = useRouter();

const accent = computed(() => sourceColor(props.news?.source || ''));

function go() {
  if (props.news) router.push(`/news/${props.news.id}`);
}
</script>

<style scoped>
.hero-feature {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  gap: 1.9rem;
  cursor: pointer;
  align-items: center;
}

.hero-feature__media {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background: var(--zc-surface);
  box-shadow: var(--zc-shadow-sm);
}
.hero-feature__image {
  width: 100%;
  height: 100%;
  min-height: 380px;
  max-height: 480px;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}
.hero-feature:hover .hero-feature__image {
  transform: scale(1.03);
}
.hero-feature__placeholder {
  width: 100%;
  min-height: 380px;
  background: linear-gradient(120deg, var(--zc-hair), var(--zc-surface));
}
.hero-feature__badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(16, 20, 24, 0.82);
  color: #fff;
  font-family: var(--font-condensed);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  backdrop-filter: blur(4px);
}
.hero-feature__badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--zc-primary);
  animation: blink 1.6s infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.hero-feature__kicker {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.9rem;
}
.hero-feature__rule {
  width: 30px;
  height: 3px;
  background: var(--kicker-color, var(--zc-primary));
  flex-shrink: 0;
}
.hero-feature__tag {
  font-family: var(--font-condensed);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--kicker-color, var(--zc-primary));
  font-size: 0.8rem;
}
.hero-feature__title {
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: clamp(1.55rem, 3vw, 2.35rem);
  line-height: 1.18;
  color: var(--zc-ink);
  letter-spacing: -0.3px;
  margin: 0 0 0.9rem;
}
.hero-feature:hover .hero-feature__title {
  color: var(--zc-primary-strong);
}
.hero-feature__summary {
  color: var(--zc-muted);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 1.1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.hero-feature__meta {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  border-top: 1px solid var(--zc-border);
  padding-top: 0.9rem;
  margin-bottom: 1.1rem;
}
.hero-feature__meta-item {
  font-size: 0.8rem;
  color: var(--zc-muted);
}
.hero-feature__read {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-condensed);
  font-weight: 700;
  font-size: 0.86rem;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #fff;
  background: var(--zc-ink);
  padding: 0.6rem 1.1rem;
  border-radius: 5px;
  transition: background 0.15s, transform 0.15s;
}
.hero-feature:hover .hero-feature__read {
  background: var(--zc-primary);
}
.hero-feature__read svg {
  transition: transform 0.2s;
}
.hero-feature:hover .hero-feature__read svg {
  transform: translateX(3px);
}

@media (max-width: 900px) {
  .hero-feature {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  .hero-feature__image,
  .hero-feature__placeholder {
    min-height: 260px;
  }
}
</style>