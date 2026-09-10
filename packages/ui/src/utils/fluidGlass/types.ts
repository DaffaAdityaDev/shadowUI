// packages/ui/src/utils/fluidGlass/types.ts

export type { SpecularOptions, Vec3 } from "./specular";
export type { SDF2DResult } from "./sdf";

/**
 * Lens refraction mode:
 * - "border": Refraction localized strictly to the outer curved bezel (center stays flat).
 * - "full": Continuous convex lens dome refraction across the entire surface (like clear visionOS / physical lens).
 */
export type FluidGlassMode = "full" | "border";

/**
 * Glass surface curvature profiles:
 * - "convex-squircle": Continuous squircle curvature. Softest flat-to-curve transition with no harsh interior edges.
 * - "convex-circle": Classical spherical dome arc. Tighter curvature with more prominent refractive edge.
 * - "concave": Inverted bowl profile. Diverges light rays outward for a zoom-out depression effect.
 * - "lip": Blended convex outer rim with shallow concave center dip. Used for tactile controls like switches and sliders.
 */
export type FluidGlassSurface = "convex-squircle" | "convex-circle" | "concave" | "lip";

/**
 * Configuration for physical displacement map calculations.
 */
export interface DisplacementMapConfig {
  /** Width of displacement map rendering area (pixels) */
  width?: number;
  /** Height of displacement map rendering area (pixels) */
  height?: number;
  /** Width of curved bezel zone along the glass edge (pixels) */
  bezel?: number;
  /** Corner radius of card/squircle (pixels) */
  radius?: number;
  /** Snell's Law Index of Refraction (IOR). Standard glass = 1.52 */
  ior?: number;
  /**
   * Physical thickness profile of fluid glass.
   * Values > 1.0 enhance edge splay distortion curvature.
   * Default: 1.0
   */
  thickness?: number;
  /**
   * Refraction mode:
   * - "border": Bezel only (flat middle).
   * - "full": Continuous convex lens across the whole body.
   * Default: "border"
   */
  mode?: FluidGlassMode;
  /**
   * Glass surface curvature profile:
   * - "convex-squircle": Default smooth squircle lens.
   * - "convex-circle": Spherical dome curve.
   * - "concave": Inverted bowl profile (diverging).
   * - "lip": Raised tactile rim with concave center dip.
   * Default: "convex-squircle"
   */
  surface?: FluidGlassSurface;
}

/**
 * Per-channel displacement offsets for fine-grained Chromatic Aberration tuning.
 * Allows independent control of Red, Green, and Blue light wavelength dispersion.
 */
export interface ChromaticChannelOffsets {
  /** Offset delta for Red channel (approx 700nm). */
  r?: number;
  /** Offset delta for Green channel (approx 546nm reference). */
  g?: number;
  /** Offset delta for Blue channel (approx 435nm). */
  b?: number;
  /** Alias for Red offset */
  red?: number;
  /** Alias for Green offset */
  green?: number;
  /** Alias for Blue offset */
  blue?: number;
}

/**
 * Chromatic aberration configuration:
 * - `number`: Symmetric wavelength split (Red: scale - a, Green: scale, Blue: scale + a)
 * - `ChromaticChannelOffsets`: Individual displacement delta offsets per color channel
 */
export type ChromaticAberration = number | ChromaticChannelOffsets;

/**
 * Full configuration for generating the fluid glass SVG filter.
 */
export interface FluidGlassFilterConfig extends DisplacementMapConfig {
  /** Deflection strength/displacement intensity (feDisplacementMap scale) */
  scale?: number;
  /**
   * Spectral separation intensity for RGB channels (Chromatic Aberration / Prism Dispersion).
   * Supports unified symmetric number or per-channel `{ r, g, b }` / `{ red, green, blue }` offsets.
   */
  aberration?: ChromaticAberration;
}

/**
 * Configuration options for the `useFluidGlass` React hook.
 */
export interface FluidGlassOptions {
  /** Width of the curved glass bezel zone */
  bezel?: number;
  /** Optical refraction deflection scale */
  scale?: number;
  /** Corner radius (auto-detects computed border-radius if not specified) */
  radius?: number;
  /** Snell's Law Index of Refraction (IOR) */
  ior?: number;
  /**
   * Physical thickness profile of fluid glass.
   * Default: 1.0
   */
  thickness?: number;
  /**
   * Chromatic dispersion (RGB wavelength split).
   * Supports unified number or per-channel `{ r, g, b }` offsets.
   * Default: 0 (disabled)
   */
  aberration?: ChromaticAberration;
  /**
   * Specular highlights and Fresnel reflection intensity on glass bezel (0 to 1).
   * Default: 0 (disabled)
   */
  specular?: number;
  /**
   * Width of the specular gleam line along the glass border in pixels.
   * Default: 4px
   */
  rimWidth?: number;
  /**
   * Light source direction angle in degrees (0° to 360°).
   * Default: 225° (top-left light source)
   */
  lightAngle?: number;
  /**
   * Interactive cursor position tracking as a dynamic light source.
   * Moves specular highlights dynamically based on cursor location.
   * Default: false
   */
  interactiveLight?: boolean;
  /** Enable or disable fluid glass refraction effect */
  enabled?: boolean;
  /**
   * Refraction mode:
   * - "border": localized to border rim.
   * - "full": continuous convex lens across entire card surface.
   * Default: "border"
   */
  mode?: FluidGlassMode;
  /**
   * Glass surface curvature profile:
   * - "convex-squircle": Default smooth squircle lens.
   * - "convex-circle": Spherical dome curve.
   * - "concave": Inverted bowl profile (diverging).
   * - "lip": Raised tactile rim with concave center dip.
   * Default: "convex-squircle"
   */
  surface?: FluidGlassSurface;
}
