<template>
  <div class="sidebar">
    <section class="sidebar__block">
      <h3 class="sidebar__title">Lo más leído</h3>
      <ol v-if="news.length" class="mostread">
        <li
          v-for="(item, i) in news"
          :key="item.id"
          class="mostread__item"
          role="link"
          :tabindex="0"
          @click="go(item)"
          @keydown.enter="go(item)"
        >
          <span class="mostread__rank" :class="{ 'mostread__rank--top': i === 0 }">{{ pad(i + 1) }}</span>
          <div class="mostread__info">
            <h4 class="mostread__headline">{{ truncate(item.title, 95) }}</h4>
            <span class="mostread__time"><TimeAgo :datetime="item.publishedAt" /></span>
          </div>
        </li>
      </ol>
      <p v-else class="mostread__empty">Sin noticias destacadas en este momento.</p>
      <router-link v-if="news.length" to="/trending" class="sidebar__more">Ver ranking completo →</router-link>
    </section>

    <aside class="sidebar__card sidebar__card--social">
      <h4 class="sidebar__card-title">Síguenos</h4>
      <p class="sidebar__card-text">La actualidad también pasa por nuestras redes.</p>
      <SocialLinks large />
    </aside>

    <aside class="sidebar__card sidebar__card--newsletter">
      <h4 class="sidebar__card-title">Boletín</h4>
      <p class="sidebar__card-text">Recibe cada mañana lo más importante del día.</p>
      <a href="#newsletter" class="sidebar__card-btn">Quiero suscribirme</a>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import TimeAgo from '@/components/common/TimeAgo.vue';
import SocialLinks from '@/components/common/SocialLinks.vue';
import type { NewsItem } from '@/types/api.types';

defineProps<{ news: NewsItem[] }>();
const router = useRouter();

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}
function truncate(text: string, max: number) {
  return text.length > max ? text.substring(0, max).trim() + '…' : text;
}
function go(item: NewsItem) {
  router.push(`/news/${item.id}`);
}
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.sidebar__block {
  background: var(--zc-bg);
  border: 1px solid var(--zc-border);
  border-radius: 10px;
  padding: 1.1rem 1.2rem;
  box-shadow: var(--zc-shadow-sm);
}
.sidebar__title {
  font-family: var(--font-condensed);
  font-size: 1.05rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--zc-ink);
  margin: 0 0 0.75rem;
  padding: 0 0 0.6rem;
  border-bottom: 3px solid var(--zc-primary);
  display: inline-block;
}
.mostread {
  list-style: none;
  margin: 0;
  padding: 0;
}
.mostread__item {
  display: flex;
  gap: 0.85rem;
  padding: 0.72rem 0;
  border-bottom: 1px solid var(--zc-hair);
  cursor: pointer;
  align-items: baseline;
}
.mostread__item:last-of-type {
  border-bottom: none;
}
.mostread__rank {
  font-family: var(--font-condensed);
  font-weight: 700;
  font-size: 1.55rem;
  line-height: 1;
  color: #c9c9d1;
  min-width: 32px;
}
.mostread__rank--top {
  color: var(--zc-primary);
}
.mostread__info {
  flex: 1;
  min-width: 0;
}
.mostread__headline {
  font-family: var(--font-serif);
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--zc-ink);
  margin: 0 0 0.25rem;
  transition: color 0.15s;
}
.mostread__item:hover .mostread__headline {
  color: var(--zc-primary);
}
.mostread__time {
  font-size: 0.72rem;
  color: var(--zc-faint);
}
.mostread__empty {
  color: var(--zc-muted);
  font-size: 0.9rem;
}
.sidebar__more {
  display: inline-block;
  margin-top: 0.7rem;
  font-family: var(--font-condensed);
  font-weight: 700;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--zc-primary);
  text-decoration: none;
}
.sidebar__more:hover {
  color: var(--zc-primary-strong);
  text-decoration: underline;
}

.sidebar__card {
  border-radius: 10px;
  padding: 1.1rem 1.2rem;
}
.sidebar__card--social {
  background: var(--zc-ink);
  color: #dfe3e7;
}
.sidebar__card--newsletter {
  background: var(--zc-primary);
  color: #fff;
}
.sidebar__card-title {
  font-family: var(--font-condensed);
  font-size: 0.98rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0 0 0.4rem;
  color: #fff;
}
.sidebar__card-text {
  font-size: 0.85rem;
  margin: 0 0 1rem;
  opacity: 0.92;
}
.sidebar__card-btn {
  display: inline-block;
  font-family: var(--font-condensed);
  font-weight: 700;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--zc-ink);
  background: #fff;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  text-decoration: none;
  transition: transform 0.15s;
}
.sidebar__card-btn:hover {
  transform: translateY(-1px);
}
</style>