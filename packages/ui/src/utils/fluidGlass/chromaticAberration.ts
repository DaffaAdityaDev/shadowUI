// packages/ui/src/utils/fluidGlass/chromaticAberration.ts
import type { ChromaticAberration } from "./types";

export interface ChromaticScales {
  scaleRed: number;
  scaleGreen: number;
  scaleBlue: number;
}

/**
 * Checks whether chromatic aberration is active (non-zero dispersion).
 */
export function hasChromaticAberration(aberration?: ChromaticAberration): boolean {
  if (!aberration) return false;
  if (typeof aberration === "number") return aberration > 0;
  const r = aberration.r ?? aberration.red ?? 0;
  const g = aberration.g ?? aberration.green ?? 0;
  const b = aberration.b ?? aberration.blue ?? 0;
  return r !== 0 || g !== 0 || b !== 0;
}

/**
 * Calculates separate displacement scales for Red, Green, and Blue wavelengths.
 * Supports both unified symmetric dispersion and independent per-channel offsets.
 *
 * - Symmetric mode (number):
 *   - Red (λ ~ 700nm): Long wavelength, lower deflection -> scale - aberration
 *   - Green (λ ~ 546nm): Median Fraunhofer reference -> scale
 *   - Blue (λ ~ 435nm): Short wavelength, higher deflection -> scale + aberration
 *
 * - Per-channel mode ({ r, g, b } or { red, green, blue }):
 *   - Each channel is adjusted by its specific delta offset from base scale.
 */
export function calculateChromaticScales(
  scale: number,
  aberration: ChromaticAberration = 0,
): ChromaticScales {
  if (typeof aberration === "number") {
    return {
      scaleRed: Math.max(0, Math.round(scale - aberration)),
      scaleGreen: Math.max(0, Math.round(scale)),
      scaleBlue: Math.max(0, Math.round(scale + aberration)),
    };
  }

  const rOffset = aberration.r ?? aberration.red ?? 0;
  const gOffset = aberration.g ?? aberration.green ?? 0;
  const bOffset = aberration.b ?? aberration.blue ?? 0;

  return {
    scaleRed: Math.max(0, Math.round(scale + rOffset)),
    scaleGreen: Math.max(0, Math.round(scale + gOffset)),
    scaleBlue: Math.max(0, Math.round(scale + bOffset)),
  };
}

/**
 * Builds SVG filter content for Chromatic Aberration (Prism RGB Spectral Dispersion).
 *
 * Techniques:
 * 1. 3x independent feDisplacementMap nodes with differing Red, Green, and Blue scales.
 * 2. 3x feColorMatrix nodes isolating R, G, B color channels from SourceGraphic.
 * 3. 2x feBlend nodes (mode "screen") for additive recombination without color banding.
 */
export function buildChromaticAberrationFilterContent(
  mapUrl: string,
  width: number,
  height: number,
  scale: number,
  aberration: ChromaticAberration,
): string {
  const { scaleRed, scaleGreen, scaleBlue } = calculateChromaticScales(scale, aberration);

  return `
    <feImage href="${mapUrl}" result="displacementMap" width="${width}" height="${height}" />

    <!-- 1. RED CHANNEL: Long wavelength dispersion (scale = ${scaleRed}) -->
    <feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="${scaleRed}" xChannelSelector="R" yChannelSelector="G" result="redDisplaced" />
    <feColorMatrix in="redDisplaced" type="matrix" values="
      1 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0
      0 0 0 1 0" result="redChannel" />

    <!-- 2. GREEN CHANNEL: Median reference (scale = ${scaleGreen}) -->
    <feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="${scaleGreen}" xChannelSelector="R" yChannelSelector="G" result="greenDisplaced" />
    <feColorMatrix in="greenDisplaced" type="matrix" values="
      0 0 0 0 0
      0 1 0 0 0
      0 0 0 0 0
      0 0 0 1 0" result="greenChannel" />

    <!-- 3. BLUE CHANNEL: Short wavelength dispersion (scale = ${scaleBlue}) -->
    <feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="${scaleBlue}" xChannelSelector="R" yChannelSelector="G" result="blueDisplaced" />
    <feColorMatrix in="blueDisplaced" type="matrix" values="
      0 0 0 0 0
      0 0 0 0 0
      0 0 1 0 0
      0 0 0 1 0" result="blueChannel" />

    <!-- 4. ADDITIVE RECOMBINATION (Screen Blending) -->
    <feBlend mode="screen" in="redChannel" in2="greenChannel" result="rgCombined" />
    <feBlend mode="screen" in="rgCombined" in2="blueChannel" result="rgbFinal" />
  `.trim();
}
