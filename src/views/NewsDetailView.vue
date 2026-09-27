<template>
  <div class="article-page">
    <div v-if="news" class="article">
      <!-- Migas de pan -->
      <nav class="article__crumbs" aria-label="Migas de pan">
        <router-link to="/" class="article__crumb">Portada</router-link>
        <span class="article__crumb-sep" aria-hidden="true">/</span>
        <router-link to="/feed" class="article__crumb">Noticias</router-link>
        <span class="article__crumb-sep" aria-hidden="true">/</span>
        <router-link
          v-if="news.category && news.category !== 'generales'"
          :to="{ path: '/feed', query: { cat: news.category } }"
          class="article__crumb"
        >{{ catLabel }}</router-link>
        <span v-if="news.category && news.category !== 'generales'" class="article__crumb-sep" aria-hidden="true">/</span>
        <span class="article__crumb article__crumb--current">{{ news.source }}</span>
      </nav>

      <!-- Cabecera del artículo -->
      <header class="article__head">
        <div class="article__kicker" :style="{ '--kicker-color': accent }">
          <span class="article__kicker-rule" aria-hidden="true"></span>
          <a v-if="news.sourceUrl" :href="news.sourceUrl" target="_blank" rel="noopener" class="article__kicker-link">{{ news.source }} ↗</a>
          <span v-else>{{ news.source }}</span>
        </div>
        <h1 class="article__title">{{ news.title }}</h1>
        <div class="article__byline">
          <span class="article__byline-item"><TimeAgo :datetime="news.publishedAt" /></span>
          <span v-if="news.sourceCount > 1" class="article__byline-item">{{ news.sourceCount }} fuentes consultadas</span>
          <span v-if="news.socialMetrics?.shares" class="article__byline-item">{{ news.socialMetrics.shares }} compartidos</span>
        </div>
      </header>

      <!-- Imagen principal (miniatura unica) -->
      <figure v-if="activeImage" class="article__figure">
        <img :src="activeImage" :alt="news.title" class="article__image" @error="hideThumb" />
        <figcaption class="article__caption">Imagen: {{ news.source }}</figcaption>
      </figure>
      <figure v-else class="article__figure article__figure--empty">
        <ImageUnavailable
          size="lg"
          :blocked="news.imagesBlocked"
          :source="news.source"
          :url="news.url"
        />
      </figure>

      <!-- Cuerpo -->
      <div class="article__body">
        <p class="article__summary">{{ news.summary }}</p>
        <p class="article__source-note">
          Esta información fue publicada originalmente por <strong>{{ news.source }}</strong> en
          <a :href="news.url" target="_blank" rel="noopener" class="article__inline-link">el artículo original</a>.
        </p>

        <div class="article__share">
          <span class="article__share-label">Compartir</span>
          <a
            v-for="net in shareLinks"
            :key="net.name"
            :href="net.url"
            target="_blank"
            rel="noopener"
            class="article__share-btn"
            :title="`Compartir en ${net.name}`"
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
              <path :d="net.path" />
            </svg>
          </a>
          <button type="button" class="article__share-btn article__share-btn--copy" title="Copiar enlace" @click="copyLink">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
          <span v-if="copied" class="article__share-copied" role="status">Enlace copiado</span>
        </div>
      </div>

      <a :href="news.url" target="_blank" rel="noopener" class="article__original">
        Leer más en {{ news.source }}
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </a>

      <!-- Cobertura: otros medios con la misma historia -->
      <section v-if="othersCoverage.length" class="article__coverage">
        <h2 class="article__coverage-title">Esta historia también la cubren</h2>
        <ul class="article__coverage-list">
          <li v-for="c in othersCoverage" :key="c.id" class="article__coverage-item">
            <a :href="c.url" target="_blank" rel="noopener" class="article__coverage-link">
              <span class="article__coverage-source">{{ c.source }} ↗</span>
              <span class="article__coverage-headline">{{ c.title }}</span>
            </a>
          </li>
        </ul>
      </section>

      <!-- Relacionadas -->
      <section v-if="related.length" class="article__related">
        <h2 class="article__related-title">Te puede interesar</h2>
        <div class="article__related-grid">
          <NewsCard v-for="item in related" :key="item.id" :news="item" />
        </div>
      </section>
    </div>

    <div v-if="!news && store.loading" class="article__loading">
      <div class="article__loading-block article__loading-block--title"></div>
      <div class="article__loading-block article__loading-block--img"></div>
      <div class="article__loading-block article__loading-block--text"></div>
    </div>
    <div v-if="store.error && !news" class="article__loading">
      <ErrorState :message="store.error" @retry="load" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useNewsStore } from '@/stores/news.store';
import TimeAgo from '@/components/common/TimeAgo.vue';
import ImageUnavailable from '@/components/news/ImageUnavailable.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import NewsCard from '@/components/news/NewsCard.vue';
import { sourceColor } from '@/utils/sourceColor';
import { categoryLabel } from '@/utils/categories';

const route = useRoute();
const store = useNewsStore();
const activeIndex = ref(0);
const copied = ref(false);

const news = computed(() => store.selectedNews);
const accent = computed(() => sourceColor(news.value?.source || ''));
const catLabel = computed(() => categoryLabel(news.value?.category));

const gallery = computed(() => {
  const imgs = news.value?.images?.filter(Boolean) || [];
  if (imgs.length > 0) return imgs.slice(0, 3);
  return news.value?.mainImage ? [news.value.mainImage] : [];
});
const activeImage = computed(() => gallery.value[activeIndex.value] || gallery.value[0]);

const related = computed(() => store.trending.filter((n) => n.id !== news.value?.id).slice(0, 3));
const othersCoverage = computed(() =>
  store.coverage.filter((c) => c.id !== news.value?.id),
);

const shareUrl = computed(() => {
  return typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
});
const shareText = computed(() => (news.value ? encodeURIComponent(news.value.title) : ''));

const shareLinks = computed(() => [
  {
    name: 'Facebook',
    url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl.value}`,
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    name: 'X',
    url: `https://twitter.com/intent/tweet?text=${shareText.value}&url=${shareUrl.value}`,
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    name: 'WhatsApp',
    url: `https://wa.me/?text=${encodeURIComponent(news.value?.title || '')}%20${shareUrl.value}`,
    path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413',
  },
]);

async function copyLink() {
  if (typeof navigator === 'undefined') return;
  await navigator.clipboard.writeText(window.location.href);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}

async function load() {
  const id = route.params.id as string;
  activeIndex.value = 0;
  store.selectedNews = null;
  await store.fetchNewsDetail(id);
  if (store.trending.length === 0) {
    store.fetchTrending();
  }
  if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
}

function hideThumb(e: Event) {
  (e.target as HTMLImageElement).style.display = 'none';
}

onMounted(load);
// Al navegar entre noticias (relacionadas, ticker) el componente se reutiliza:
// hay que recargar el resumen con el nuevo id.
watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId && newId !== oldId) load();
  },
);
</script>

<style scoped>
.article-page {
  padding: 1.6rem 0 2rem;
}
.article {
  max-width: 800px;
  margin: 0 auto;
}

/* Migas de pan */
.article__crumbs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-condensed);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--zc-faint);
  margin-bottom: 1.4rem;
}
.article__crumb {
  color: var(--zc-muted);
  text-decoration: none;
  padding: 0.2rem 0;
}
.article__crumb:hover {
  color: var(--zc-primary);
}
.article__crumb--current {
  color: var(--zc-ink);
  font-weight: 700;
}
.article__crumb-sep {
  color: var(--zc-border-strong);
}

/* Cabecera */
.article__head {
  margin-bottom: 1.5rem;
}
.article__kicker {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.85rem;
  font-family: var(--font-condensed);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-size: 0.78rem;
  color: var(--kicker-color, var(--zc-primary));
}
.article__kicker-rule {
  width: 32px;
  height: 3px;
  background: var(--kicker-color, var(--zc-primary));
}
.article__kicker-link {
  color: inherit;
  text-decoration: none;
}
.article__kicker-link:hover {
  text-decoration: underline;
}
.article__title {
  font-family: var(--font-serif);
  font-size: clamp(1.7rem, 4.5vw, 2.6rem);
  font-weight: 700;
  line-height: 1.18;
  letter-spacing: -0.4px;
  color: var(--zc-ink);
  margin: 0 0 1rem;
}
.article__byline {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.83rem;
  color: var(--zc-muted);
  padding-top: 1rem;
  border-top: 1px solid var(--zc-border);
}
.article__byline-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

/* Imagen (miniatura unica contenida) */
.article__figure {
  margin: 0 0 1.2rem;
  max-width: 460px;
}
/* Sin fotografia: el placeholder ocupa el ancho completo del bloque. */
.article__figure--empty {
  max-width: 100%;
}
.article__image {
  width: 100%;
  max-height: 260px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
  box-shadow: var(--zc-shadow-sm);
}
.article__caption {
  font-size: 0.75rem;
  color: var(--zc-faint);
  padding: 0.5rem 0.2rem 0;
  font-style: italic;
}

/* Cuerpo */
.article__body {
  margin-top: 1.25rem;
}
.article__summary {
  font-family: var(--font-serif);
  font-size: 1.13rem;
  line-height: 1.8;
  color: var(--zc-body);
  margin: 0 0 1.4rem;
}
.article__summary::first-letter {
  float: left;
  font-family: var(--font-serif);
  font-size: 3.4rem;
  line-height: 1;
  font-weight: 700;
  color: var(--zc-primary);
  padding-right: 0.5rem;
}
.article__source-note {
  font-size: 0.88rem;
  color: var(--zc-muted);
  border-left: 3px solid var(--zc-border-strong);
  padding-left: 0.9rem;
  margin: 0 0 1.6rem;
}
.article__inline-link {
  color: var(--zc-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* Compartir */
.article__share {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 1rem 0;
  border-top: 1px solid var(--zc-border);
  border-bottom: 1px solid var(--zc-border);
  margin-bottom: 1.6rem;
}
.article__share-label {
  font-family: var(--font-condensed);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--zc-muted);
  margin-right: 0.4rem;
}
.article__share-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--zc-border);
  color: var(--zc-muted);
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.article__share-btn:hover {
  background: var(--zc-primary);
  border-color: var(--zc-primary);
  color: #fff;
}
.article__share-copied {
  font-size: 0.8rem;
  color: #047857;
  font-weight: 600;
  margin-left: 0.3rem;
}

/* Botón original */
.article__original {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: #fff;
  background: var(--zc-primary);
  font-family: var(--font-condensed);
  font-size: 0.88rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  padding: 0.75rem 1.3rem;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.15s;
  margin-bottom: 2.5rem;
}
.article__original:hover {
  background: var(--zc-primary-strong);
}

/* Cobertura en otros medios */
.article__coverage {
  margin-top: 2rem;
  border: 1px solid var(--zc-border);
  border-radius: 8px;
  padding: 1.1rem 1.25rem;
  background: var(--zc-surface);
}
.article__coverage-title {
  font-family: var(--font-condensed);
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--zc-ink);
  margin: 0 0 0.8rem;
}
.article__coverage-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.article__coverage-link {
  display: flex;
  align-items: baseline;
  gap: 0.7rem;
  text-decoration: none;
}
.article__coverage-link:hover .article__coverage-headline {
  color: var(--zc-primary);
  text-decoration: underline;
}
.article__coverage-source {
  font-family: var(--font-condensed);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--zc-primary);
  white-space: nowrap;
}
.article__coverage-headline {
  font-size: 0.9rem;
  color: var(--zc-body);
  line-height: 1.45;
}

/* Relacionadas */
.article__related {
  border-top: 2px solid var(--zc-ink);
  padding-top: 1.4rem;
}
.article__related-title {
  font-family: var(--font-condensed);
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--zc-ink);
  margin: 0 0 1.2rem;
}
.article__related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
}

/* Carga */
.article__loading {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  padding: 2rem 0;
}
.article__loading-block {
  background: var(--zc-surface);
  border-radius: 8px;
}
.article__loading-block--title {
  height: 36px;
  width: 72%;
}
.article__loading-block--img {
  height: 300px;
  width: 100%;
}
.article__loading-block--text {
  height: 120px;
  width: 100%;
}
</style>