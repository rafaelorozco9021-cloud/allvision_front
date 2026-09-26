<template>
  <transition name="backtop">
    <button
      v-if="visible"
      class="backtop"
      type="button"
      aria-label="Volver arriba"
      title="Volver arriba"
      @click="scrollTop"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    </button>
  </transition>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const visible = ref(false);

function onScroll() {
  visible.value = window.scrollY > 600;
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll));
</script>

<style scoped>
.backtop {
  position: fixed;
  right: 1.4rem;
  bottom: 1.4rem;
  z-index: 80;
  width: 46px;
  height: 46px;
  border: none;
  border-radius: 50%;
  background: var(--zc-primary);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--zc-shadow-lg);
  transition: background 0.15s, transform 0.15s;
}
.backtop:hover {
  background: var(--zc-primary-strong);
  transform: translateY(-2px);
}
.backtop-enter-active,
.backtop-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}
.backtop-enter-from,
.backtop-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>