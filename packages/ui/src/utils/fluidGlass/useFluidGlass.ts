// packages/ui/src/utils/fluidGlass/useFluidGlass.ts
import { useRef, useEffect } from "react";
import { getOrCreateFluidGlassFilter } from "./filterCache";
import { generateSpecularMap } from "./specular";
import type { FluidGlassOptions } from "./types";

/**
 * React hook to automatically apply Fluid Glass Refraction to an element ref.
 * Supports Chromatic Aberration, Specular Highlights, and Continuous Convex Lens mode.
 */
export function useFluidGlass<T extends HTMLElement = HTMLDivElement>(
  options: FluidGlassOptions = {},
) {
  const {
    bezel = 32,
    scale = 28,
    radius,
    ior = 1.52,
    thickness = 1.0,
    rimWidth = 4,
    aberration = 0,
    specular = 0,
    lightAngle = 225,
    interactiveLight = false,
    enabled = true,
    mode = "border",
  } = options;

  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const el = elementRef.current;
    if (!el) return;

    // Check Chromium support (only Chromium renders SVG filters inside backdrop-filter)
    const isChromium =
      typeof (window as any).chrome !== "undefined" || navigator.userAgent.indexOf("Chrome") !== -1;

    if (!isChromium) {
      return;
    }

    let lastBezel = 32;
    let lastRadius = 28;
    let rafId: number | null = null;

    const updateFilter = (overrideAngle?: number) => {
      if (!elementRef.current) return;
      const rect = elementRef.current.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const dynamicBezel = Math.min(bezel, Math.floor(Math.min(rect.width, rect.height) / 4));
      lastBezel = dynamicBezel;

      let effectiveRadius = radius ?? 28;
      if (radius === undefined) {
        const computed = window.getComputedStyle(elementRef.current).borderRadius;
        if (computed) {
          const parsed = parseFloat(computed);
          if (!isNaN(parsed) && parsed >= 0) effectiveRadius = parsed;
        }
      }
      lastRadius = effectiveRadius;

      // 1. Physical Refraction & Chromatic Aberration
      const filterId = getOrCreateFluidGlassFilter({
        width: rect.width,
        height: rect.height,
        bezel: dynamicBezel,
        scale,
        radius: effectiveRadius,
        ior,
        thickness,
        aberration,
        mode,
      });

      if (filterId) {
        elementRef.current.style.setProperty("--ui-fluid-filter", `url(#${filterId})`);
      }

      // 2. Specular Highlights & Reflection
      if (specular > 0) {
        const currentAngle = overrideAngle !== undefined ? overrideAngle : lightAngle;
        const specularUrl = generateSpecularMap(
          rect.width,
          rect.height,
          dynamicBezel,
          effectiveRadius,
          {
            intensity: specular,
            thickness,
            rimWidth,
            lightAngle: currentAngle,
            mode,
          },
        );
        if (specularUrl) {
          elementRef.current.style.setProperty("--ui-fluid-specular", `url("${specularUrl}")`);
        }
      } else {
        elementRef.current.style.removeProperty("--ui-fluid-specular");
      }
    };

    updateFilter();

    // 3. Interactive Cursor Light Tracking
    const handlePointerMove = (e: PointerEvent) => {
      if (!elementRef.current || specular <= 0) return;
      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      let deg = (rad * 180) / Math.PI;
      if (deg < 0) deg += 360;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const specularUrl = generateSpecularMap(rect.width, rect.height, lastBezel, lastRadius, {
          intensity: specular,
          thickness,
          rimWidth,
          lightAngle: deg,
          mode,
        });
        if (specularUrl && elementRef.current) {
          elementRef.current.style.setProperty("--ui-fluid-specular", `url("${specularUrl}")`);
        }
      });
    };

    const handlePointerLeave = () => {
      if (rafId) cancelAnimationFrame(rafId);
      updateFilter(lightAngle);
    };

    if (interactiveLight && specular > 0) {
      el.addEventListener("pointermove", handlePointerMove, { passive: true });
      el.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    }

    const resizeObserver = new ResizeObserver(() => {
      updateFilter();
    });

    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerleave", handlePointerLeave);
      if (el) {
        el.style.removeProperty("--ui-fluid-filter");
        el.style.removeProperty("--ui-fluid-specular");
      }
    };
  }, [
    bezel,
    scale,
    radius,
    ior,
    thickness,
    rimWidth,
    aberration,
    specular,
    lightAngle,
    interactiveLight,
    enabled,
    mode,
  ]);

  return elementRef;
}
