<template>
  <div v-if="visible.length" class="fx">
    <div class="fx__inner">
      <span class="fx__label">Monedas</span>
      <div class="fx__viewport">
        <ul class="fx__track">
          <li v-for="(r, i) in loop" :key="`${r.code}-${i}`" class="fx__item">
            <span class="fx__code">{{ r.label }}</span>
            <span class="fx__value">{{ formatCOP(r.cop!) }}</span>
          </li>
        </ul>
      </div>
      <span v-if="updatedAt" class="fx__updated" :title="updatedAt.toLocaleString('es-CO')">
        {{ updatedText }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useExchangeRates, formatCOP } from '@/composables/useExchangeRates';

const { rates, updatedAt } = useExchangeRates();

const visible = computed(() => rates.value.filter((r) => r.cop !== null));
const loop = computed(() => [...visible.value, ...visible.value]);

const updatedText = computed(() => {
  if (!updatedAt.value) return '';
  const mins = Math.max(0, Math.round((Date.now() - updatedAt.value.getTime()) / 60000));
  return mins < 1 ? 'ahora mismo' : `hace ${mins} min`;
});
</script>

<style scoped>
.fx {
  background: #0c2b1f;
  border-bottom: 2px solid #16a34a;
}
.fx__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: stretch;
  min-height: 68px;
}
.fx__label {
  display: inline-flex;
  align-items: center;
  background: #16a34a;
  color: #fff;
  font-family: var(--font-condensed);
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  padding: 0 0.9rem;
  flex-shrink: 0;
}
.fx__viewport {
  flex: 1;
  overflow: hidden;
  position: relative;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 3%, #000 97%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 3%, #000 97%, transparent);
}
.fx__track {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  white-space: nowrap;
  width: max-content;
  animation: fx-ticker 40s linear infinite;
}
.fx:hover .fx__track {
  animation-play-state: paused;
}
.fx__item {
  display: inline-flex;
  align-items: baseline;
  gap: 0.6rem;
  padding: 0 1.4rem;
  font-size: 1.9rem;
  line-height: 1.5;
  color: #e2e6ea;
  border-right: 1px solid #1d4030;
}
.fx__code {
  font-family: var(--font-condensed);
  color: #4ade80;
  font-weight: 700;
  letter-spacing: 0.5px;
  font-size: 1rem;
  text-transform: uppercase;
}
.fx__value {
  font-weight: 600;
}
.fx__updated {
  display: inline-flex;
  align-items: center;
  font-size: 0.85rem;
  color: #86c9a6;
  padding-left: 0.8rem;
  flex-shrink: 0;
  white-space: nowrap;
}
@media (max-width: 640px) {
  .fx__inner {
    min-height: 50px;
  }
  .fx__item {
    font-size: 1.1rem;
  }
}
@keyframes fx-ticker {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
</style>
