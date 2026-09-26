<template>
  <div class="section-head">
    <h2 class="section-title">
      <span class="section-title__mark" aria-hidden="true"></span>
      <slot>{{ title }}</slot>
    </h2>
    <slot name="extra" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title?: string }>();
</script>

<style scoped>
.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.section-title {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  font-family: var(--font-condensed);
  font-size: 1.25rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--zc-ink);
  margin: 0;
}
.section-title__mark {
  width: 9px;
  height: 26px;
  background: var(--zc-primary);
  flex-shrink: 0;
}
</style>