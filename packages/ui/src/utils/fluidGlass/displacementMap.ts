// packages/ui/src/utils/fluidGlass/displacementMap.ts
import type { DisplacementMapConfig, FluidGlassMode, FluidGlassSurface } from "./types";
import { calculateSnellDeflection, IOR_PRESETS } from "./ior";
import { evalRoundedBoxSDF } from "./sdf";

/**
 * Evaluates the cross-sectional height of the glass surface at normalized position x in [0, 1].
 * x = 0 at the outer edge/border, x = 1 at the flat interior/apex.
 *
 * Implements the 4 surface functions:
 * 1. "convex-squircle": y = (1 - (1 - x)^4)^(1/4) (Continuous squircle - softest transition)
 * 2. "convex-circle": y = 1 - (1 - x)^2 (Spherical/circular dome arc)
 * 3. "concave": y = 1 - Convex(x) (Inverted bowl depression, diverges rays outward)
 * 4. "lip": y = mix(Convex(x), Concave(x), Smootherstep(x)) (Raised tactile rim with center dip)
 */
export function evalSurfaceHeight(
  x: number,
  surface: FluidGlassSurface = "convex-squircle",
): number {
  const clamped = Math.max(0, Math.min(1, x));
  switch (surface) {
    case "convex-circle":
      return 1 - Math.pow(1 - clamped, 2);
    case "concave":
      return 1 - Math.pow(Math.max(0, 1 - Math.pow(1 - clamped, 4)), 0.25);
    case "lip": {
      const cv = Math.pow(Math.max(0, 1 - Math.pow(1 - clamped, 4)), 0.25);
      const cc = 1 - cv;
      // Perlin smootherstep: 6x^5 - 15x^4 + 10x^3
      const s = clamped * clamped * clamped * (clamped * (clamped * 6 - 15) + 10);
      return cv * (1 - s) + cc * s;
    }
    case "convex-squircle":
    default:
      return Math.pow(Math.max(0, 1 - Math.pow(1 - clamped, 4)), 0.25);
  }
}

/**
 * Evaluates the surface slope / derivative at normalized position x in [0, 1].
 * Positive derivative tilts inward, negative derivative tilts outward (diverging).
 */
export function evalSurfaceSlope(
  x: number,
  surface: FluidGlassSurface = "convex-squircle",
): number {
  const clamped = Math.max(0, Math.min(1, x));
  const delta = 0.005;
  const y1 = evalSurfaceHeight(Math.max(0, clamped - delta), surface);
  const y2 = evalSurfaceHeight(Math.min(1, clamped + delta), surface);
  return (y2 - y1) / (2 * delta);
}

/**
 * Generates a Displacement Map Data URL with physical Snell's Law refraction.
 *
 * Supports two distinct modes:
 * - "border": Localized bezel ring distortion around the outer edge (center remains flat).
 * - "full": Continuous convex lens dome refraction across the entire surface (like clear optical glass).
 *
 * Supports 4 glass surface profiles:
 * - "convex-squircle": Smooth squircle bezel/dome (default).
 * - "convex-circle": Classical spherical/circular arc.
 * - "concave": Inverted bowl depression (zoom out).
 * - "lip": Raised tactile rim with center dip (switches and sliders).
 */
export function generateDisplacementMap(
  widthOrConfig: number | DisplacementMapConfig = 300,
  height = 300,
  bezel = 32,
  radius = 28,
  ior = 1.52,
  thickness = 1.0,
  mode: FluidGlassMode = "border",
  surface: FluidGlassSurface = "convex-squircle",
): string {
  if (typeof document === "undefined") return "";

  let w = 300;
  let h = 300;
  let b = bezel;
  let r = radius;
  let n = ior;
  let t = thickness;
  let m: FluidGlassMode = mode;
  let surf: FluidGlassSurface = surface;

  if (typeof widthOrConfig === "object" && widthOrConfig !== null) {
    w = widthOrConfig.width ?? 300;
    h = widthOrConfig.height ?? 300;
    b = widthOrConfig.bezel ?? 32;
    r = widthOrConfig.radius ?? 28;
    n = widthOrConfig.ior ?? 1.52;
    t = widthOrConfig.thickness ?? 1.0;
    m = widthOrConfig.mode ?? "border";
    surf = widthOrConfig.surface ?? "convex-squircle";
  } else {
    w = widthOrConfig;
    h = height;
    b = bezel;
    r = radius;
    n = ior;
    t = thickness;
    m = mode;
    surf = surface;
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, w);
  canvas.height = Math.max(1, h);
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const imgData = ctx.createImageData(canvas.width, canvas.height);
  const data = imgData.data;

  const halfW = canvas.width / 2;
  const halfH = canvas.height / 2;
  // Corner radius cannot exceed half width or height
  const effectiveR = Math.max(0, Math.min(r, halfW, halfH));
  // Bezel width for border mode
  const effectiveB = effectiveR > 0 ? Math.min(b, effectiveR) : Math.min(b, halfW, halfH);

  // Physical thickness affects lens surface slope (splay curvature)
  const safeThickness = Math.max(0.1, Math.min(3.0, t));
  const maxAngle = Math.min(1.2, 0.75 * safeThickness);
  const safeIor = Math.max(1.0, n);
  // Reference deflection angle at standard glass IOR 1.52 for normalization
  const refDelta = calculateSnellDeflection(maxAngle, IOR_PRESETS.GLASS);
  const refTan = Math.tan(refDelta) || 0.001;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const idx = (y * canvas.width + x) * 4;

      // Evaluate Signed Distance Field & 2D normal curvature direction
      const { distFromEdge, dirX, dirY } = evalRoundedBoxSDF(x, y, halfW, halfH, effectiveR);

      let dx = 0;
      let dy = 0;

      if (distFromEdge >= 0) {
        if (m === "full") {
          // --- FULL CONTINUOUS CONVEX/CONCAVE/LIP LENS DOME (Smooth Physical Optics) ---
          const cx = x - halfW;
          const cy = y - halfH;
          const distCenter = Math.hypot(cx, cy);

          // Normalized squircle radial progress (0.0 at optical apex/center to 1.0 at outer boundary)
          const rho = distCenter > 0 ? distCenter / (distCenter + distFromEdge) : 0;
          const clampedRho = Math.min(1.0, rho);
          const distFromSideNorm = 1.0 - clampedRho;

          // Slope of chosen 3D surface profile
          const rawSlope = evalSurfaceSlope(distFromSideNorm, surf);
          // Soft edge blend prevents hard pixel boundary tearing
          const edgeBlend = Math.sqrt(Math.max(0, 1.0 - Math.pow(clampedRho, 4)));
          const slope = Math.max(-2.5, Math.min(2.5, rawSlope)) * edgeBlend;

          const theta1 = maxAngle * Math.abs(slope);
          const delta = calculateSnellDeflection(theta1, safeIor);
          const intensity = (Math.tan(delta) / refTan) * Math.sign(slope);

          // Radial vector pointing outward from center
          const radX = distCenter > 0 ? cx / distCenter : 0;
          const radY = distCenter > 0 ? cy / distCenter : 0;

          // Convex displaces inward towards center (zoom in), concave displaces outward (zoom out)
          dx = -radX * intensity;
          dy = -radY * intensity;
        } else {
          // --- BORDER BEZEL ONLY ---
          if (distFromEdge < effectiveB) {
            const distFromSideNorm = distFromEdge / effectiveB;
            const rawSlope = evalSurfaceSlope(distFromSideNorm, surf);
            // Smooth falloff along bezel
            const falloff = Math.sin(Math.PI * distFromSideNorm);
            const slope = Math.max(-2.5, Math.min(2.5, rawSlope)) * falloff;

            const theta1 = maxAngle * Math.abs(slope);
            const delta = calculateSnellDeflection(theta1, safeIor);
            const intensity = (Math.tan(delta) / refTan) * Math.sign(slope);

            dx = dirX * intensity;
            dy = dirY * intensity;
          }
        }
      }

      // Encode displacement vector (-1 to 1) into RGB colors (0 to 255)
      data[idx + 0] = Math.round(128 + dx * 127); // R = X axis
      data[idx + 1] = Math.round(128 + dy * 127); // G = Y axis
      data[idx + 2] = 128; // B = Neutral
      data[idx + 3] = 255; // A = 100%
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL();
}
