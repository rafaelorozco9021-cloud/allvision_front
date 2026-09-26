<template>
  <div class="filter-bar">
    <SearchBar :query="searchQuery" @update:query="updateSearch" />
    <select class="filter-select" v-model="selectedSource" @change="emit('source-change', selectedSource)">
      <option value="">Todas las fuentes</option>
      <option v-for="src in sources" :key="src" :value="src">{{ src }}</option>
    </select>
    <button class="filter-btn" @click="emit('refresh')">↻ Refrescar</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import SearchBar from './SearchBar.vue';

defineProps<{ sources: string[] }>();
const emit = defineEmits<{
  (e: 'source-change', v: string): void;
  (e: 'refresh'): void;
  (e: 'search', v: string): void;
}>();

const searchQuery = ref('');
const selectedSource = ref('');

watch(searchQuery, (val) => emit('search', val));
watch(selectedSource, (val) => emit('source-change', val));

function updateSearch(val: string) {
  searchQuery.value = val;
  emit('search', val);
}
</script>

<style scoped>
.filter-bar {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
  padding: 1rem 0;
}
.filter-select {
  padding: 0.6rem 0.9rem;
  border-radius: 4px;
  border: 1px solid var(--zc-border);
  background: var(--zc-bg);
  color: var(--zc-body);
  font-size: 0.9rem;
  font-family: Roboto, Arial, sans-serif;
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s;
}
.filter-select:focus {
  border-color: var(--zc-primary);
}
.filter-btn {
  padding: 0.6rem 1.1rem;
  border: 1px solid var(--zc-primary);
  border-radius: 4px;
  background: transparent;
  color: var(--zc-primary);
  cursor: pointer;
  font-weight: 700;
  font-family: 'Roboto Condensed', 'Arial Narrow', Arial, sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.85rem;
  transition: all 0.15s;
}
.filter-btn:hover {
  background: var(--zc-primary);
  color: white;
}
</style>