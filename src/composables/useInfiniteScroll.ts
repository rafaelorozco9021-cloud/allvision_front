import { onUnmounted } from 'vue';

export function useInfiniteScroll(callback: () => void, enabled = true) {
  let observer: IntersectionObserver | null = null;

  function setup(target: HTMLElement | null) {
    if (!target || !enabled) return;
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          callback();
        }
      },
      { threshold: 0.1, rootMargin: '200px' },
    );
    observer.observe(target);
  }

  function disconnect() {
    observer?.disconnect();
  }

  onUnmounted(disconnect);

  return { setup, disconnect };
}
