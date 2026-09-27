<template>
  <div class="noimg" :class="[`noimg--${size}`, { 'noimg--flat': flat }]">
    <svg
      class="noimg__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.6" />
      <path d="M21 15.5l-4.6-4.3a1.6 1.6 0 0 0-2.2 0L4 20.5" />
      <line x1="3" y1="3" x2="21" y2="21" />
    </svg>

    <p class="noimg__title">Imagen no disponible</p>
    <p v-if="!compact" class="noimg__reason">
      {{
        blocked
          ? `${source} no autoriza la reproducción de sus fotografías.`
          : 'Esta nota no tiene imagen asociada.'
      }}
    </p>
    <a
      v-if="!compact && url"
      :href="url"
      target="_blank"
      rel="noopener"
      class="noimg__link"
      @click.stop
    >Ver en {{ source }} ↗</a>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    /** La fuente tiene prohibida la republicacion de fotos. */
    blocked?: boolean;
    /** Medio, para explicar el motivo y ofrecer el enlace al original. */
    source?: string;
    url?: string;
    /** 'sm' para miniaturas de tarjeta, 'md' para hHero, 'lg' para el detalle. */
    size?: 'sm' | 'md' | 'lg';
    /** Oculta el parrafo de motivo: util en espacios muy pequenos. */
    compact?: boolean;
    /** Sin marco: para fondos que ya tienen su propio contenedor. */
    flat?: boolean;
  }>(),
  { size: 'md', source: '', url: '' },
);
</script>

<style scoped>
.noimg {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  text-align: center;
  width: 100%;
  height: 100%;
  padding: 0.75rem 0.6rem;
  color: var(--zc-faint);
  /* Trama diagonal muy suave: sugiere "espacio reservado" sin gritar. */
  background-color: var(--zc-surface);
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(16, 20, 24, 0.022) 0 6px,
    transparent 6px 12px
  );
  border: 1px solid var(--zc-border);
  border-radius: inherit;
}
.noimg--flat {
  border: none;
  background-image: none;
}
.noimg__icon {
  width: 26px;
  height: 26px;
  color: var(--zc-border-strong);
  margin-bottom: 0.1rem;
}
.noimg__title {
  margin: 0;
  font-family: var(--font-condensed);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--zc-muted);
  line-height: 1.2;
}
.noimg__reason {
  margin: 0;
  font-size: 0.7rem;
  line-height: 1.45;
  color: var(--zc-faint);
  max-width: 30ch;
}
.noimg__link {
  font-family: var(--font-condensed);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--zc-primary);
  text-decoration: none;
  margin-top: 0.1rem;
}
.noimg__link:hover {
  text-decoration: underline;
}

/* sm: miniaturas de tarjeta (132x96), solo el titulo */
.noimg--sm {
  padding: 0.4rem 0.35rem;
  gap: 0.2rem;
}
.noimg--sm .noimg__icon {
  width: 19px;
  height: 19px;
}
.noimg--sm .noimg__title {
  font-size: 0.63rem;
  letter-spacing: 0.06em;
}

/* md: heros y listados medianos */
.noimg--md .noimg__icon {
  width: 30px;
  height: 30px;
}

/* lg: detalle de la nota */
.noimg--lg {
  padding: 2.25rem 1.5rem;
  gap: 0.6rem;
  border-radius: 6px;
}
.noimg--lg .noimg__icon {
  width: 44px;
  height: 44px;
  margin-bottom: 0.3rem;
}
.noimg--lg .noimg__title {
  font-size: 0.95rem;
}
.noimg--lg .noimg__reason {
  font-size: 0.85rem;
  max-width: 40ch;
}
.noimg--lg .noimg__link {
  font-size: 0.8rem;
  margin-top: 0.25rem;
}
</style>
