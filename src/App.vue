<template>
  <div class="app-layout">
    <AppHeader />
    <main class="app-main">
      <RouterView />
    </main>
    <AppFooter />
    <BackToTop />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import BackToTop from '@/components/common/BackToTop.vue';
</script>

<style>
.app-layout {
  min-height: 100vh;
  background: var(--zc-bg);
  color: var(--zc-body);
  font-family: var(--font-sans);
  display: flex;
  flex-direction: column;
}
.app-layout > .site-header {
  flex-shrink: 0;
}
.app-main {
  flex: 1;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
</style>