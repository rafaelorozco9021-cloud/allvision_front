import { ref } from 'vue';

export function useColorExtraction(imageUrl: string) {
  const colors = ref<{ primary: string; secondary: string; accent: string } | null>(null);
  const loading = ref(false);

  async function extract() {
    if (!imageUrl) return;
    loading.value = true;
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
      });

      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      const primary = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

      const sizer = Math.min(img.naturalWidth, img.naturalHeight);
      const sampleCanvas = document.createElement('canvas');
      sampleCanvas.width = 5;
      sampleCanvas.height = 5;
      const sCtx = sampleCanvas.getContext('2d')!;
      sCtx.drawImage(img, 0, 0, sizer, sizer, 0, 0, 5, 5);
      const imageData = sCtx.getImageData(0, 0, 5, 5).data;
      const palette: string[] = [];
      for (let i = 0; i < imageData.length; i += 4) {
        const hex = `#${imageData[i].toString(16).padStart(2, '0')}${imageData[i + 1].toString(16).padStart(2, '0')}${imageData[i + 2].toString(16).padStart(2, '0')}`;
        if (!palette.includes(hex)) palette.push(hex);
      }

      colors.value = {
        primary,
        secondary: palette[1] || primary,
        accent: palette[2] || primary,
      };
    } catch {
      colors.value = null;
    } finally {
      loading.value = false;
    }
  }

  return { colors, loading, extract };
}

export function useReducedMotion() {
  const prefersReducedMotion = ref(false);
  if (typeof window !== 'undefined') {
    prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return prefersReducedMotion;
}
