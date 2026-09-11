// packages/ui/src/hooks/themes/useFluidGlassTheme.ts
import { useEffect, type RefObject } from "react";
import type { FluidGlassMode, FluidGlassSurface } from "../../utils/fluidGlass/types";
import type { FluidGlassThemeOptions } from "./useFluidGlassTheme.types";

export type { FluidGlassThemeOptions };

/**
 * Dedicated Custom Hook for the "fluid-glass" Theme.
 * All logic, parameter normalization, and optical physics side-effects are isolated here,
 * without cluttering UI components or other theme hooks.
 */
export function useFluidGlassTheme<T extends HTMLElement = HTMLDivElement>(
  elementRef: RefObject<T | null>,
  options?: FluidGlassThemeOptions,
  enabled: boolean = true,
): void {
  const rawAberration = options?.aberration ?? options?.fluidAberration ?? 0;
  const aberrationKey =
    typeof rawAberration === "object" && rawAberration !== null
      ? `${rawAberration.r ?? rawAberration.red ?? 0}_${rawAberration.g ?? rawAberration.green ?? 0}_${rawAberration.b ?? rawAberration.blue ?? 0}`
      : String(rawAberration);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const isChromium =
      typeof (window as any).chrome !== "undefined" || navigator.userAgent.indexOf("Chrome") !== -1;

    if (!isChromium) return;

    const el = elementRef?.current;
    if (!el) return;

    let disposed = false;
    let ro: ResizeObserver | null = null;
    let rafId: number | null = null;
    let onPointerMove: ((e: PointerEvent) => void) | null = null;
    let onPointerLeave: (() => void) | null = null;

    // Normalize parameters specific to Fluid Glass
    const bezel = options?.bezel ?? options?.fluidBezel;
    const scale = options?.scale ?? options?.fluidScale ?? 36;
    const ior = options?.ior ?? options?.fluidIor ?? 2.5;
    const thickness = options?.thickness ?? options?.fluidThickness ?? 1.2;
    const rimWidth = options?.rimWidth ?? options?.fluidRimWidth ?? 4;
    const aberration = options?.aberration ?? options?.fluidAberration ?? 0;
    const specular = options?.specular ?? options?.fluidSpecular ?? 0.85;
    const lightAngle = options?.lightAngle ?? options?.fluidLightAngle ?? 225;
    const interactiveLight = options?.interactiveLight ?? options?.fluidInteractiveLight ?? true;
    const mode: FluidGlassMode = options?.mode ?? options?.fluidMode ?? "full";
    const surface: FluidGlassSurface =
      options?.surface ?? options?.fluidSurface ?? "convex-squircle";

    // 0. Optical Material Clarity (Blur, Opacity, Saturation overrides)
    const blur = options?.blur ?? options?.fluidBlur;
    const opacity = options?.opacity ?? options?.fluidOpacity;
    const saturate = options?.saturate ?? options?.fluidSaturate;

    if (blur !== undefined) {
      el.style.setProperty("--ui-backdrop-blur", `${blur}px`);
    }
    if (opacity !== undefined) {
      const alpha = opacity <= 1 ? opacity : opacity / 100;
      el.style.setProperty("--ui-surface-base", `rgba(255, 255, 255, ${alpha})`);
    }
    if (saturate !== undefined) {
      el.style.setProperty("--ui-backdrop-saturate", `${saturate}%`);
    }

    // Dynamically lazy-load Fluid Glass physics engine (0 byte overhead for non-fluid users)
    import("../../utils/fluidGlass").then(
      ({ getOrCreateFluidGlassFilter, generateSpecularMap }) => {
        if (disposed || !elementRef?.current) return;

        const currentEl = elementRef.current;
        let lastBezel = 32;
        let lastRadius = 28;

        const updateFilter = (overrideAngle?: number) => {
          if (!elementRef?.current || disposed) return;
          const target = elementRef.current;
          const rect = target.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) return;

          const dynamicBezel =
            bezel ?? Math.min(36, Math.floor(Math.min(rect.width, rect.height) / 4));
          lastBezel = dynamicBezel;

          let radius = options?.radius ?? 28;
          if (options?.radius === undefined) {
            const computed = window.getComputedStyle(target).borderRadius;
            if (computed) {
              const parsed = parseFloat(computed);
              if (!isNaN(parsed) && parsed >= 0) radius = parsed;
            }
          }
          lastRadius = radius;

          // 1. Physical Refraction & Chromatic Aberration
          const filterId = getOrCreateFluidGlassFilter({
            width: rect.width,
            height: rect.height,
            bezel: dynamicBezel,
            scale,
            radius,
            ior,
            thickness,
            aberration,
            mode,
            surface,
          });

          if (filterId && elementRef.current) {
            elementRef.current.style.setProperty("--ui-fluid-filter", `url(#${filterId})`);
          }

          // 2. Specular Highlights & Fresnel Reflection
          if (specular > 0) {
            const specularUrl = generateSpecularMap(rect.width, rect.height, dynamicBezel, radius, {
              intensity: specular,
              thickness,
              rimWidth,
              lightAngle: overrideAngle !== undefined ? overrideAngle : lightAngle,
              mode,
            });
            if (specularUrl && elementRef.current) {
              elementRef.current.style.setProperty("--ui-fluid-specular", `url("${specularUrl}")`);
            }
          } else if (elementRef.current) {
            elementRef.current.style.removeProperty("--ui-fluid-specular");
          }
        };

        updateFilter();

        // 3. Interactive Cursor Light Tracking
        onPointerMove = (e: PointerEvent) => {
          if (!elementRef?.current || specular <= 0) return;
          const target = elementRef.current;
          const rect = target.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
          let deg = (rad * 180) / Math.PI;
          if (deg < 0) deg += 360;

          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            const specularUrl = generateSpecularMap(
              rect.width,
              rect.height,
              lastBezel,
              lastRadius,
              {
                intensity: specular,
                thickness,
                rimWidth,
                lightAngle: deg,
                mode,
              },
            );
            if (specularUrl && elementRef?.current) {
              elementRef.current.style.setProperty("--ui-fluid-specular", `url("${specularUrl}")`);
            }
          });
        };

        onPointerLeave = () => {
          if (rafId) cancelAnimationFrame(rafId);
          updateFilter(lightAngle);
        };

        if (interactiveLight && specular > 0) {
          currentEl.addEventListener("pointermove", onPointerMove, { passive: true });
          currentEl.addEventListener("pointerleave", onPointerLeave, { passive: true });
        }

        ro = new ResizeObserver(() => updateFilter());
        ro.observe(currentEl);
      },
    );

    return () => {
      disposed = true;
      if (ro) ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      if (onPointerMove && el) el.removeEventListener("pointermove", onPointerMove);
      if (onPointerLeave && el) el.removeEventListener("pointerleave", onPointerLeave);
      if (el) {
        el.style.removeProperty("--ui-fluid-filter");
        el.style.removeProperty("--ui-fluid-specular");
        if (blur !== undefined) el.style.removeProperty("--ui-backdrop-blur");
        if (opacity !== undefined) el.style.removeProperty("--ui-surface-base");
        if (saturate !== undefined) el.style.removeProperty("--ui-backdrop-saturate");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    enabled,
    elementRef,
    options?.bezel,
    options?.fluidBezel,
    options?.scale,
    options?.fluidScale,
    options?.ior,
    options?.fluidIor,
    options?.thickness,
    options?.fluidThickness,
    options?.rimWidth,
    options?.fluidRimWidth,
    aberrationKey,
    options?.specular,
    options?.fluidSpecular,
    options?.lightAngle,
    options?.fluidLightAngle,
    options?.interactiveLight,
    options?.fluidInteractiveLight,
    options?.radius,
    options?.mode,
    options?.fluidMode,
    options?.surface,
    options?.fluidSurface,
    options?.blur,
    options?.fluidBlur,
    options?.opacity,
    options?.fluidOpacity,
    options?.saturate,
    options?.fluidSaturate,
  ]);
}
