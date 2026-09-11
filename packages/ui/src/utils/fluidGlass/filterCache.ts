import { generateDisplacementMap } from "./displacementMap";
import { createSvgFilterElement } from "./svgFilter";
import type {
  ChromaticAberration,
  FluidGlassFilterConfig,
  FluidGlassMode,
  FluidGlassSurface,
} from "./types";

// In-memory cache to prevent duplicate SVG filter generation for similar element dimensions
const filterCache = new Map<string, string>();

/**
 * Retrieves or creates a hidden DOM container to host SVG <defs>.
 */
export function getSvgDefsContainer(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  let container = document.getElementById("shadowui-fluid-glass-defs");

  if (!container) {
    container = document.createElement("div");
    container.id = "shadowui-fluid-glass-defs";
    container.style.cssText =
      "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;z-index:-9999;";
    document.body.appendChild(container);
  }
  return container;
}

/**
 * Clears all cached filters and removes SVG defs from the DOM if necessary.
 */
export function clearFluidGlassCache(): void {
  filterCache.clear();
  if (typeof document !== "undefined") {
    const container = document.getElementById("shadowui-fluid-glass-defs");
    if (container) {
      container.innerHTML = "";
    }
  }
}

/**
 * Retrieves or creates an SVG filter with cached feDisplacementMap.
 * Supports invocation via configuration object or positional parameters.
 */
export function getOrCreateFluidGlassFilter(config: FluidGlassFilterConfig): string;
export function getOrCreateFluidGlassFilter(
  width: number,
  height: number,
  bezel?: number,
  scale?: number,
  radius?: number,
  ior?: number,
  aberration?: ChromaticAberration,
  thickness?: number,
  mode?: FluidGlassMode,
  surface?: FluidGlassSurface,
): string;
export function getOrCreateFluidGlassFilter(
  widthOrConfig: number | FluidGlassFilterConfig,
  height = 300,
  bezel = 32,
  scale = 28,
  radius = 28,
  ior = 1.52,
  aberration: ChromaticAberration = 0,
  thickness = 1.0,
  mode: FluidGlassMode = "border",
  surface: FluidGlassSurface = "convex-squircle",
): string {
  if (typeof document === "undefined") return "";

  let w = 0;
  let h = 0;
  let b = bezel;
  let s = scale;
  let r = radius;
  let i = ior;
  let a: ChromaticAberration = aberration;
  let t = thickness;
  let m: FluidGlassMode = mode;
  let surf: FluidGlassSurface = surface;

  if (typeof widthOrConfig === "object" && widthOrConfig !== null) {
    w = widthOrConfig.width ?? 0;
    h = widthOrConfig.height ?? 0;
    b = widthOrConfig.bezel ?? 32;
    s = widthOrConfig.scale ?? 28;
    r = widthOrConfig.radius ?? 28;
    i = widthOrConfig.ior ?? 1.52;
    a = widthOrConfig.aberration ?? 0;
    t = widthOrConfig.thickness ?? 1.0;
    m = widthOrConfig.mode ?? "border";
    surf = widthOrConfig.surface ?? "convex-squircle";
  } else {
    w = widthOrConfig;
    h = height;
    b = bezel;
    s = scale;
    r = radius;
    i = ior;
    a = aberration;
    t = thickness;
    m = mode;
    surf = surface;
  }

  if (w <= 0 || h <= 0) return "";

  // Round to nearest intervals to maximize cache hits during dynamic resizing
  const roundedW = Math.max(16, Math.round(w / 4) * 4);
  const roundedH = Math.max(16, Math.round(h / 4) * 4);
  const roundedB = Math.max(8, Math.round(b / 2) * 2);
  const roundedR = Math.max(0, Math.round(r / 2) * 2);
  const roundedS = Math.round(s);
  const roundedI = Math.round(i * 100);
  const roundedT = Math.round(t * 10);
  const modeKey = m === "full" ? "_mf" : "_mb";
  const surfKey = `_s${surf.slice(0, 3)}`;

  // Serialize aberration (number or per-channel object)
  let abKey = "_a0";
  if (typeof a === "number") {
    abKey = `_a${Math.max(0, Math.round(a))}`;
  } else if (typeof a === "object" && a !== null) {
    const ar = Math.round(a.r ?? a.red ?? 0);
    const ag = Math.round(a.g ?? a.green ?? 0);
    const ab = Math.round(a.b ?? a.blue ?? 0);
    abKey = `_a${ar}_${ag}_${ab}`;
  }

  const cacheKey = `${roundedW}x${roundedH}_b${roundedB}_r${roundedR}_s${roundedS}_i${roundedI}${abKey}_t${roundedT}${modeKey}${surfKey}`;
  if (filterCache.has(cacheKey)) {
    return filterCache.get(cacheKey)!;
  }

  const filterId = `shadowui_fg_${cacheKey}`;
  const mapUrl = generateDisplacementMap(roundedW, roundedH, roundedB, roundedR, i, t, m, surf);

  const container = getSvgDefsContainer();
  if (container) {
    const svg = createSvgFilterElement(filterId, mapUrl, roundedW, roundedH, roundedS, a);
    container.appendChild(svg);
  }

  filterCache.set(cacheKey, filterId);
  return filterId;
}
