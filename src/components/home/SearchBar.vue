<template>
  <div class="search-bar">
    <svg class="search-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
    <input
      :value="query"
      @input="$emit('update:query', ($event.target as HTMLInputElement).value)"
      class="search-input"
      type="text"
      placeholder="Buscar noticias..."
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{ query: string }>();
defineEmits<{ (e: 'update:query', v: string): void }>();
</script>

<style scoped>
.search-bar {
  width: 100%;
  max-width: 340px;
  position: relative;
}
.search-icon {
  position: absolute;
  left: 0.65rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--zc-faint);
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.4rem;
  border-radius: 4px;
  border: 1px solid var(--zc-border);
  background: var(--zc-bg);
  color: var(--zc-body);
  font-size: 0.9rem;
  font-family: Roboto, Arial, sans-serif;
  outline: none;
  transition: border-color 0.15s;
}
.search-input::placeholder {
  color: var(--zc-faint);
}
.search-input:focus {
  border-color: var(--zc-primary);
}
</style>