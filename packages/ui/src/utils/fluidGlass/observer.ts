// packages/ui/src/utils/fluidGlass/observer.ts
import { getOrCreateFluidGlassFilter } from "./filterCache";
import { generateSpecularMap } from "./specular";

/**
 * Automatic observer for all elements containing [data-skin="fluid-glass"] on the page.
 * Supports reading data-fluid-* attributes reactively.
 */
export function initFluidGlassAutoObserver(): () => void {
  if (typeof window === "undefined") return () => {};

  const isChromium =
    typeof (window as any).chrome !== "undefined" ||
    navigator.userAgent.indexOf("Chrome") !== -1;

  if (!isChromium) return () => {};

  const observedMap = new Map<HTMLElement, ResizeObserver>();

  const observeElement = (el: HTMLElement) => {
    if (observedMap.has(el)) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const target = entry.target as HTMLElement;
        const rect = entry.contentRect;
        if (rect.width <= 0 || rect.height <= 0) continue;

        const bezel =
          Number(target.dataset.fluidBezel) ||
          Math.min(32, Math.floor(Math.min(rect.width, rect.height) / 4));
        const scale = Number(target.dataset.fluidScale) || 28;
        const ior = Number(target.dataset.fluidIor) || 1.52;
        const aberration = Number(target.dataset.fluidAberration) || 0;
        const specular = Number(target.dataset.fluidSpecular) || 0;
        const lightAngle = Number(target.dataset.fluidLightAngle) || 135;

        let radius = 28;
        const computed = window.getComputedStyle(target).borderRadius;
        if (computed) {
          const parsed = parseFloat(computed);
          if (!isNaN(parsed) && parsed >= 0) radius = parsed;
        }

        // 1. Physical Refraction
        const filterId = getOrCreateFluidGlassFilter({
          width: rect.width,
          height: rect.height,
          bezel,
          scale,
          radius,
          ior,
          aberration,
        });

        if (filterId) {
          target.style.setProperty("--ui-fluid-filter", `url(#${filterId})`);
        }

        // 2. Specular Highlights
        if (specular > 0) {
          const specularUrl = generateSpecularMap(rect.width, rect.height, bezel, radius, {
            intensity: specular,
            lightAngle,
          });
          if (specularUrl) {
            target.style.setProperty("--ui-fluid-specular", `url("${specularUrl}")`);
          }
        } else {
          target.style.removeProperty("--ui-fluid-specular");
        }
      }
    });

    observer.observe(el);
    observedMap.set(el, observer);
  };

  const scanAndObserve = () => {
    const elements = document.querySelectorAll<HTMLElement>('[data-skin="fluid-glass"]');
    elements.forEach(observeElement);
  };

  scanAndObserve();

  const mutationObserver = new MutationObserver(() => {
    scanAndObserve();
  });

  mutationObserver.observe(document.body, { childList: true, subtree: true });

  return () => {
    observedMap.forEach((obs) => obs.disconnect());
    observedMap.clear();
    mutationObserver.disconnect();
  };
}
