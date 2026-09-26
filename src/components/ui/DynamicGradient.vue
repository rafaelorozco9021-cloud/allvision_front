<template>
  <div class="dynamic-gradient" :style="gradientStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  color1?: string;
  color2?: string;
}>();

const gradientStyle = computed(() => ({
  background: `linear-gradient(135deg, ${props.color1 || '#6366f1'}, ${props.color2 || '#ec4899'})`,
}));
</script>

<style scoped>
.dynamic-gradient {
  border-radius: 16px;
  transition: background 0.8s ease;
}
</style>
