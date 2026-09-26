<template>
  <div class="empty-state">
    <svg class="empty-icon" viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="var(--zc-primary)" stroke-width="1.5" aria-hidden="true">
      <path d="M4 5h16v14H4z" />
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="7" y1="12" x2="17" y2="12" />
      <line x1="7" y1="15" x2="13" y2="15" />
    </svg>
    <h3 class="empty-title">No se encontraron noticias</h3>
    <p class="empty-message">{{ message || 'Ajusta tus filtros o vuelve más tarde.' }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ message?: string }>();
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
}
.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}
.empty-title {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--zc-ink);
  margin-bottom: 0.5rem;
}
.empty-message {
  color: var(--zc-muted);
}
</style>