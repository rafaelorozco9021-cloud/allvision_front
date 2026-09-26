<template>
  <header class="site-header">
    <!-- Última hora: cinta fija -->
    <div v-if="tickerItems.length" class="ticker">
      <div class="ticker__inner">
        <span class="ticker__label">Última hora</span>
        <div class="ticker__viewport">
          <ul class="ticker__track" :class="{ 'ticker__track--static': reduced }">
            <li v-for="(item, i) in tickerLoop" :key="`a-${item.id}-${i}`" class="ticker__item" role="link" :tabindex="0" @click="go(item)" @keydown.enter="go(item)">
              <span class="ticker__time"><TimeAgo :datetime="item.publishedAt" /></span>
              <span class="ticker__title">{{ item.title }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Masthead -->
    <div class="masthead">
      <div class="masthead__side masthead__left">
        <span class="masthead__date">{{ today }}</span>
        <span class="masthead__tagline">Noticias y actualidad en tiempo real</span>
      </div>
      <router-link to="/" class="masthead__logo">AllVision</router-link>
      <div class="masthead__side masthead__right">
        <SocialLinks />
        <a href="#newsletter" class="masthead__subscribe">Suscribirse</a>
      </div>
    </div>

    <!-- Navegación pegajosa -->
    <div class="navwrap">
      <div class="navwrap__inner">
        <nav class="nav" :class="{ 'nav--open': menuOpen }">
          <router-link to="/" class="nav__link">Portada</router-link>
          <router-link to="/feed" class="nav__link">Noticias</router-link>
          <router-link to="/trending" class="nav__link">Lo más leído</router-link>
          <span class="nav__sep" aria-hidden="true"></span>
          <button
            v-for="cat in categories"
            :key="cat.key || 'all'"
            class="nav__link nav__link--cat"
            :class="{ 'nav__link--active-cat': activeCat === cat.key }"
            @click="goCat(cat.key)"
          >
            {{ cat.label }}
          </button>
          <a href="#newsletter" class="nav__cta">Suscríbete</a>
        </nav>

        <form class="navsearch" role="search" @submit.prevent="search">
          <svg class="navsearch__icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input v-model="query" class="navsearch__input" type="search" placeholder="Buscar noticias…" aria-label="Buscar noticias" />
        </form>

        <button class="navburger" :aria-expanded="menuOpen" aria-label="Menú" @click="menuOpen = !menuOpen">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <!-- Cinta de monedas -->
    <CurrencyTicker />
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SocialLinks from '@/components/common/SocialLinks.vue';
import CurrencyTicker from '@/components/common/CurrencyTicker.vue';
import TimeAgo from '@/components/common/TimeAgo.vue';
import { useNewsStore } from '@/stores/news.store';
import { NEWS_CATEGORIES } from '@/utils/categories';
import type { NewsItem } from '@/types/api.types';

const router = useRouter();
const route = useRoute();
const store = useNewsStore();
const menuOpen = ref(false);
const query = ref('');
const reduced = ref(false);

const categories = NEWS_CATEGORIES;
const activeCat = computed(() =>
  route.path === '/feed' ? ((route.query.cat as string) || '') : '###',
);

const today = new Date().toLocaleDateString('es-CO', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const tickerItems = computed<NewsItem[]>(() => store.trending.slice(0, 8));
const tickerLoop = computed<NewsItem[]>(() => {
  const base = tickerItems.value;
  return base.length ? [...base, ...base] : [];
});

onMounted(() => {
  if (typeof window !== 'undefined') {
    reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  if (store.trending.length === 0) {
    store.fetchTrending();
  }
  window.addEventListener('resize', closeOnDesktop);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', closeOnDesktop);
});

function closeOnDesktop() {
  if (window.innerWidth > 900) menuOpen.value = false;
}

function search() {
  if (!query.value.trim()) return;
  store.setFilter('search', query.value.trim());
  router.push('/feed');
  menuOpen.value = false;
}

function go(item: NewsItem) {
  router.push(`/news/${item.id}`);
}

function goCat(key: string) {
  store.setFilter('category', key);
  router.push(key ? { path: '/feed', query: { cat: key } } : '/feed');
  menuOpen.value = false;
}
</script>

<style scoped>
.site-header {
  background: var(--zc-bg);
}

/* Cinta de última hora -------- */
.ticker {
  background: var(--zc-dark);
  border-bottom: 2px solid var(--zc-primary);
}
.ticker__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: stretch;
  min-height: 72px;
}
.ticker__label {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: var(--zc-primary);
  color: #fff;
  font-family: var(--font-condensed);
  font-weight: 700;
  font-size: 1.05rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  padding: 0 1rem;
  flex-shrink: 0;
}
.ticker__label::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: blink 1.4s infinite;
}
.ticker__viewport {
  flex: 1;
  overflow: hidden;
  position: relative;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 3%, #000 97%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 3%, #000 97%, transparent);
}
.ticker__track {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  white-space: nowrap;
  width: max-content;
  animation: ticker 60s linear infinite;
}
.ticker:hover .ticker__track,
.ticker__track:hover {
  animation-play-state: paused;
}
.ticker__track--static {
  animation: none;
  white-space: normal;
}
.ticker__item {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0 1.5rem;
  font-size: 2rem;
  line-height: 1.5;
  color: #e2e6ea;
  cursor: pointer;
  border-right: 1px solid #33393f;
}
.ticker__item:hover {
  color: #fff;
  background: var(--zc-dark-2);
}
.ticker__time {
  font-family: var(--font-condensed);
  color: var(--zc-primary);
  font-weight: 700;
  letter-spacing: 0.5px;
  font-size: 1rem;
  text-transform: uppercase;
}
.ticker__title {
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 46ch;
}

@keyframes ticker {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
}

/* Masthead ------------------- */
.masthead {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem 1rem;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
}
.masthead__logo {
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: clamp(2rem, 5vw, 3.1rem);
  letter-spacing: -1.5px;
  color: var(--zc-ink);
  text-decoration: none;
  line-height: 1;
  text-transform: uppercase;
}
.masthead__logo::after {
  content: '.';
  color: var(--zc-primary);
}
.masthead__side {
  display: flex;
  flex-direction: column;
}
.masthead__date {
  font-family: var(--font-condensed);
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--zc-muted);
}
.masthead__tagline {
  font-size: 0.74rem;
  color: var(--zc-faint);
  margin-top: 0.2rem;
}
.masthead__right {
  align-items: flex-end;
}
.masthead__subscribe {
  margin-top: 0.6rem;
  font-family: var(--font-condensed);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--zc-primary);
  text-decoration: none;
}
.masthead__subscribe:hover {
  color: var(--zc-primary-strong);
  text-decoration: underline;
}

/* Navegación pegajosa --------- */
.navwrap {
  position: sticky;
  top: 0;
  z-index: 60;
  background: var(--zc-bg);
  border-top: 1px solid var(--zc-border);
  border-bottom: 1px solid var(--zc-border);
  box-shadow: 0 1px 0 rgba(16, 20, 24, 0.04);
}
.navwrap__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.nav {
  display: flex;
  align-items: center;
  gap: 0.15rem;
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.nav::-webkit-scrollbar {
  display: none;
}
.nav__link {
  font-family: var(--font-condensed);
  font-size: 0.92rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--zc-ink);
  text-decoration: none;
  padding: 0.8rem 0.65rem;
  border-bottom: 3px solid transparent;
  transition: color 0.15s, border-color 0.15s;
  white-space: nowrap;
}
.nav__link:hover,
.nav__link.router-link-active {
  color: var(--zc-primary);
  border-bottom-color: var(--zc-primary);
}
.nav__link--cat {
  font-weight: 500;
  color: var(--zc-muted);
  font-size: 0.84rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-family: inherit;
}
.nav__link--cat:hover {
  color: var(--zc-primary);
  border-bottom-color: transparent;
}
.nav__link--active-cat {
  color: var(--zc-primary);
  border-bottom-color: var(--zc-primary);
}
.nav__link--active-cat:hover {
  border-bottom-color: var(--zc-primary);
}
.nav__sep {
  width: 1px;
  height: 18px;
  background: var(--zc-border-strong);
  margin: 0 0.4rem;
  flex-shrink: 0;
}
.nav__cta {
  margin-left: auto;
  flex-shrink: 0;
  font-family: var(--font-condensed);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #fff;
  background: var(--zc-primary);
  padding: 0.45rem 0.95rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background 0.15s;
}
.nav__cta:hover {
  background: var(--zc-primary-strong);
}

.navsearch {
  position: relative;
  flex-shrink: 0;
  margin-left: 0.5rem;
}
.navsearch__icon {
  position: absolute;
  left: 0.7rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--zc-faint);
  pointer-events: none;
}
.navsearch__input {
  width: 190px;
  padding: 0.5rem 0.8rem 0.5rem 2.1rem;
  border: 1px solid var(--zc-border);
  border-radius: 999px;
  background: var(--zc-surface);
  font-size: 0.85rem;
  font-family: var(--font-sans);
  color: var(--zc-body);
  outline: none;
  transition: border-color 0.15s, width 0.2s ease;
}
.navsearch__input::placeholder {
  color: var(--zc-faint);
}
.navsearch__input:focus {
  border-color: var(--zc-primary);
  width: 230px;
  background: var(--zc-bg);
}

.navburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 42px;
  height: 42px;
  border: 1px solid var(--zc-border);
  background: var(--zc-bg);
  border-radius: 6px;
  cursor: pointer;
  padding: 0 10px;
  flex-shrink: 0;
}
.navburger span {
  height: 2px;
  background: var(--zc-ink);
  border-radius: 2px;
  transition: transform 0.2s;
}

@media (max-width: 900px) {
  .navburger {
    display: inline-flex;
  }
  .nav__cta {
    display: none;
  }
  .nav {
    display: none;
    flex-direction: column;
    align-items: stretch;
    overflow: visible;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--zc-bg);
    border-top: 1px solid var(--zc-border);
    border-bottom: 1px solid var(--zc-border);
    box-shadow: var(--zc-shadow-lg);
    padding: 0.5rem 0;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
  }
  .nav--open {
    display: flex;
  }
  .nav__link {
    padding: 0.75rem 1.5rem;
    border-bottom: none;
    border-left: 3px solid transparent;
  }
  .nav__link.router-link-active,
  .nav__link:hover {
    border-bottom: none;
    border-left-color: var(--zc-primary);
    background: var(--zc-hair);
  }
  .nav__sep {
    display: none;
  }
  .navsearch {
    margin-left: auto;
  }
  .navsearch__input,
  .navsearch__input:focus {
    width: 150px;
  }
}

@media (max-width: 640px) {
  .ticker__inner {
    min-height: 52px;
  }
  .ticker__item {
    font-size: 1.15rem;
  }
  .ticker__label {
    font-size: 0.8rem;
  }
  .masthead {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
  }
  .masthead__side {
    align-items: center;
  }
  .masthead__left {
    order: 2;
  }
  .masthead__logo {
    order: 1;
  }
  .masthead__right {
    order: 3;
  }
  .ticker__label {
    padding: 0 0.7rem;
  }
}
</style>