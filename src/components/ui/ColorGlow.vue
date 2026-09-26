<template>
  <div class="color-glow" :style="glowStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  color?: string;
  intensity?: number;
}>();

const glowStyle = computed(() => ({
  boxShadow: `0 0 ${props.intensity || 20}px ${props.color || '#6366f1'}44, 0 0 ${(props.intensity || 20) * 2}px ${props.color || '#6366f1'}22`,
}));
</script>

<style scoped>
.color-glow {
  transition: box-shadow 0.5s ease;
}
</style>
