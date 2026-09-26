<template>
  <div class="trending-badge" :style="{ background: color }">
    <span class="trending-dot"></span>
    <span class="trending-label">Trending</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ color?: string }>();
</script>

<style scoped>
.trending-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.trending-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: white;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
