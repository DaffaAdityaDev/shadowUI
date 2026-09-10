// packages/ui/src/utils/fluidGlass/ior.ts

/**
 * Standard physical Index of Refraction (IOR) values.
 * Based on Snell's Law (n1 * sin(θ1) = n2 * sin(θ2)).
 */
export const IOR_PRESETS = {
  AIR: 1.0,
  WATER: 1.33,
  GLASS: 1.52,
  CRYSTAL: 1.8,
  DIAMOND: 2.42,
} as const;

export type IorMaterialName = "Air" | "Water" | "Glass" | "Crystal" | "Diamond";

/**
 * Gets material name label corresponding to an IOR value.
 */
export function getMaterialNameByIor(ior: number): IorMaterialName {
  if (ior < 1.1) return "Air";
  if (ior < 1.4) return "Water";
  if (ior < 1.65) return "Glass";
  if (ior < 2.0) return "Crystal";
  return "Diamond";
}

/**
 * Calculates light deflection angle based on Snell's Law.
 *
 * @param theta1 Incident angle in radians
 * @param ior Medium refractive index (n2), assuming n1 = 1.0 (air)
 * @returns Deflection angle (delta = theta1 - theta2) in radians
 */
export function calculateSnellDeflection(theta1: number, ior: number): number {
  const safeIor = Math.max(1.0, ior);
  const sinTheta2 = Math.min(Math.sin(theta1) / safeIor, 0.999);
  const theta2 = Math.asin(sinTheta2);
  return theta1 - theta2;
}
