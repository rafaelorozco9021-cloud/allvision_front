<template>
  <time :datetime="datetime" class="time-ago">
    {{ formattedTime }}
  </time>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';

dayjs.extend(relativeTime);
dayjs.locale('es');

const props = defineProps<{ datetime: string }>();

const formattedTime = computed(() => dayjs(props.datetime).fromNow());
</script>

<style scoped>
.time-ago {
  color: inherit;
  font-size: 0.78rem;
}
</style>