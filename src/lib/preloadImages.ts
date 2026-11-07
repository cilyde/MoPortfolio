const preloadedCache = new Set<string>();

/**
 * Preloads and decodes an image into GPU/browser memory.
 * Using `img.decode()` ensures the browser has decompressed the image before it renders,
 * eliminating the visual decode stutter when the modal opens.
 */
export function preloadImage(src: string): Promise<void> {
  if (typeof window === "undefined" || !src || preloadedCache.has(src)) {
    return Promise.resolve();
  }

  preloadedCache.add(src);

  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;

    if ("decode" in img) {
      img
        .decode()
        .then(() => resolve())
        .catch(() => {
          if (img.complete) resolve();
          else img.onload = () => resolve();
        });
    } else {
      if (img.complete) resolve();
      else img.onload = () => resolve();
    }
  });
}

/**
 * Preload an array of images in the background during idle time.
 */
export function preloadAllImages(sources: string[]) {
  if (typeof window === "undefined" || !sources?.length) return;

  const run = () => {
    sources.forEach((src) => {
      preloadImage(src).catch(() => {});
    });
  };

  if ("requestIdleCallback" in window) {
    (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(run, { timeout: 3000 });
  } else {
    setTimeout(run, 800);
  }
}
