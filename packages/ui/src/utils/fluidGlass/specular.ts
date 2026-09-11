// packages/ui/src/utils/fluidGlass/specular.ts
import { evalRoundedBoxSDF } from "./sdf";
import type { FluidGlassMode } from "./types";

export interface SpecularOptions {
  /**
   * Incident light angle on the 2D plane in degrees (0° to 360°).
   * 0° = Right, 90° = Bottom, 180° = Left, 225° = Top-Left, 270° = Top, 315° = Top-Right.
   * Default: 225° (standard top-left ambient light source).
   */
  lightAngle?: number;
  /**
   * Light elevation angle relative to surface plane in degrees (0° horizontal to 90° normal).
   * Default: 50°
   */
  lightElevation?: number;
  /**
   * Specular highlight brightness intensity (0 to 1).
   * Default: 0.75
   */
  intensity?: number;
  /**
   * Physical glass thickness (affects reflection curve slope).
   * Default: 1.0
   */
  thickness?: number;
  /**
   * Width of the specular gleam line along the glass border in pixels.
   * Default 4px gives a sharp and precise gleam along the outer border,
   * without obscuring text/image content inside the card.
   * Default: 4
   */
  rimWidth?: number;
  /**
   * Blinn-Phong shininess exponent. Higher values produce sharp, focused highlights.
   * Default: 28
   */
  shininess?: number;
  /**
   * Fresnel reflection strength at glancing angles (0 to 1).
   * Default: 0.35
   */
  fresnel?: number;
  /**
   * Specular mode:
   * - "border": Edge rim gleam only.
   * - "full": Full continuous surface specular sheen and dome reflection.
   * Default: "border"
   */
  mode?: FluidGlassMode;
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/**
 * Calculates normalized 3D light vector from 2D plane angle and elevation.
 */
export function calculateLightDirection(angleDeg: number, elevationDeg = 50): Vec3 {
  const radAngle = (angleDeg * Math.PI) / 180;
  const radElevation = (elevationDeg * Math.PI) / 180;

  const cosElev = Math.cos(radElevation);
  const sinElev = Math.sin(radElevation);

  const lx = -Math.cos(radAngle) * cosElev;
  const ly = -Math.sin(radAngle) * cosElev;
  const lz = sinElev;

  const len = Math.hypot(lx, ly, lz) || 1;
  return { x: lx / len, y: ly / len, z: lz / len };
}

/**
 * Computes 3D surface normal vector from 2D curvature direction and surface slope angle.
 */
export function calculateSurfaceNormal(dirX: number, dirY: number, theta: number): Vec3 {
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);

  const nx = -dirX * sinTheta;
  const ny = -dirY * sinTheta;
  const nz = cosTheta;

  const len = Math.hypot(nx, ny, nz) || 1;
  return { x: nx / len, y: ny / len, z: nz / len };
}

/**
 * Calculates Blinn-Phong specular reflection intensity:
 * I_spec = (N · H)^shininess
 */
export function calculateBlinnPhong(
  normal: Vec3,
  lightDir: Vec3,
  viewDir: Vec3,
  shininess: number,
): number {
  // Halfway vector H = normalize(L + V)
  const hx = lightDir.x + viewDir.x;
  const hy = lightDir.y + viewDir.y;
  const hz = lightDir.z + viewDir.z;
  const len = Math.hypot(hx, hy, hz) || 1;

  const normHx = hx / len;
  const normHy = hy / len;
  const normHz = hz / len;

  const nDotH = Math.max(0, normal.x * normHx + normal.y * normHy + normal.z * normHz);
  return Math.pow(nDotH, shininess);
}

/**
 * Calculates Fresnel reflection coefficient using Schlick's approximation:
 * F(θ) = F0 + (1 - F0) * (1 - N · V)^5
 */
export function calculateFresnel(normal: Vec3, viewDir: Vec3, f0 = 0.04): number {
  const nDotV = Math.max(
    0,
    Math.min(1, normal.x * viewDir.x + normal.y * viewDir.y + normal.z * viewDir.z),
  );
  return f0 + (1 - f0) * Math.pow(1 - nDotV, 5);
}

// Memory cache for generated specular textures
const specularCache = new Map<string, string>();

/**
 * Generates transparent Specular Highlight & Reflection Data URL based on
 * physical Blinn-Phong and Schlick's Fresnel calculations.
 */
export function generateSpecularMap(
  width: number,
  height: number,
  _bezel = 32,
  radius = 28,
  options: SpecularOptions = {},
): string {
  if (typeof document === "undefined" || width <= 0 || height <= 0) return "";

  const {
    lightAngle = 225,
    lightElevation = 50,
    intensity = 0.75,
    thickness = 1.0,
    rimWidth = 4,
    shininess = 28,
    fresnel = 0.35,
    mode = "border",
  } = options;

  if (intensity <= 0) return "";

  // Round parameters to maximize cache hits
  const roundedW = Math.max(16, Math.round(width / 4) * 4);
  const roundedH = Math.max(16, Math.round(height / 4) * 4);
  const roundedR = Math.max(0, Math.round(radius / 2) * 2);
  const normalizedAngle = ((lightAngle % 360) + 360) % 360;
  const roundedA = Math.round(normalizedAngle / 5) * 5;
  const roundedInt = Math.round(intensity * 100);
  const roundedThick = Math.round(thickness * 10);
  const safeThickness = Math.max(0.1, Math.min(3.0, thickness));

  // Focus specular gleam along outer glass perimeter (2px - 6px)
  const safeRimWidth = Math.max(1.5, Math.min(12, rimWidth * Math.sqrt(safeThickness)));
  const roundedRim = Math.round(safeRimWidth * 10);
  const modeKey = mode === "full" ? "_mf" : "_mb";

  const cacheKey = `${roundedW}x${roundedH}_r${roundedR}_a${roundedA}_i${roundedInt}_t${roundedThick}_rw${roundedRim}${modeKey}`;
  if (specularCache.has(cacheKey)) {
    return specularCache.get(cacheKey)!;
  }

  const canvas = document.createElement("canvas");
  canvas.width = roundedW;
  canvas.height = roundedH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const imgData = ctx.createImageData(canvas.width, canvas.height);
  const data = imgData.data;

  const halfW = canvas.width / 2;
  const halfH = canvas.height / 2;
  const effectiveR = Math.max(0, Math.min(roundedR, halfW, halfH));

  const maxAngle = Math.min(1.2, 0.75 * safeThickness);
  const lightDir = calculateLightDirection(roundedA, lightElevation);
  const viewDir: Vec3 = { x: 0, y: 0, z: 1 }; // Observer views straight along Z-axis

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const idx = (y * canvas.width + x) * 4;

      // Evaluate Signed Distance Field & 2D normal curvature direction
      const { distFromEdge, dirX, dirY } = evalRoundedBoxSDF(x, y, halfW, halfH, effectiveR);

      if (distFromEdge < 0) continue;

      let rimHighlight = 0;
      let surfaceSheen = 0;

      // 1. Sharp Outer Border Rim Gleam
      if (distFromEdge < safeRimWidth) {
        const u = distFromEdge / safeRimWidth;
        const theta1 = maxAngle * Math.sin(Math.PI * u);
        const normal = calculateSurfaceNormal(dirX, dirY, theta1);
        const spec = calculateBlinnPhong(normal, lightDir, viewDir, shininess);
        const fres = calculateFresnel(normal, viewDir);
        const fresnelGlint = Math.max(0, fres - 0.04);
        const falloff = Math.sin(Math.PI * u);

        rimHighlight = (spec * intensity + fresnelGlint * fresnel * intensity) * falloff;
      }

      // 2. Full Surface Dome Specular Sheen (when mode === "full")
      if (mode === "full") {
        const cx = x - halfW;
        const cy = y - halfH;
        const distCenter = Math.hypot(cx, cy);
        const rho = distCenter > 0 ? distCenter / (distCenter + distFromEdge) : 0;
        const clampedRho = Math.min(1.0, rho);
        const profile = clampedRho * Math.sqrt(Math.max(0, 1.0 - Math.pow(clampedRho, 4)));
        const theta1 = maxAngle * profile;

        const radX = distCenter > 0 ? cx / distCenter : 0;
        const radY = distCenter > 0 ? cy / distCenter : 0;

        // Surface normal tilts outward from apex (center) down towards boundary
        const normal = calculateSurfaceNormal(-radX, -radY, theta1);
        const spec = calculateBlinnPhong(normal, lightDir, viewDir, Math.max(10, shininess * 0.45));
        const fres = calculateFresnel(normal, viewDir);
        const fresGlint = Math.max(0, fres - 0.04);

        surfaceSheen = (spec * 0.4 + fresGlint * 0.25) * intensity;
      }

      const totalHighlight = Math.min(1, rimHighlight + surfaceSheen);

      if (totalHighlight > 0.005) {
        const alpha = Math.round(totalHighlight * 255);
        data[idx + 0] = 255; // Red
        data[idx + 1] = 255; // Green
        data[idx + 2] = 255; // Blue
        data[idx + 3] = alpha; // Alpha
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const dataUrl = canvas.toDataURL();
  specularCache.set(cacheKey, dataUrl);
  return dataUrl;
}
