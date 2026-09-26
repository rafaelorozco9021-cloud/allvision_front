<template>
  <div class="error-state">
    <svg class="error-icon" viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="var(--zc-primary)" stroke-width="1.6" aria-hidden="true">
      <path d="M12 3 2.5 20h19z" />
      <line x1="12" y1="9" x2="12" y2="13.5" />
      <circle cx="12" cy="17" r="0.6" fill="var(--zc-primary)" />
    </svg>
    <h3 class="error-title">Algo salió mal</h3>
    <p class="error-message">{{ message }}</p>
    <button class="error-btn" @click="$emit('retry')">Reintentar</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ message?: string }>();
defineEmits(['retry']);
</script>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
}
.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}
.error-title {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--zc-ink);
  margin-bottom: 0.5rem;
}
.error-message {
  color: var(--zc-muted);
  margin-bottom: 1.5rem;
}
.error-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  background: var(--zc-primary);
  color: #fff;
  cursor: pointer;
  font-size: 0.95rem;
  font-family: 'Roboto Condensed', 'Arial Narrow', Arial, sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: background 0.15s;
}
.error-btn:hover {
  background: var(--zc-primary-dark);
}
</style>