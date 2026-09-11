// packages/ui/src/utils/fluidGlass/index.ts

// 1. Domain Types
export type {
  DisplacementMapConfig,
  FluidGlassFilterConfig,
  FluidGlassOptions,
  FluidGlassMode,
  FluidGlassSurface,
  ChromaticAberration,
  ChromaticChannelOffsets,
} from "./types";

// 2. Physics & Optical Material IOR (Snell's Law)
export {
  IOR_PRESETS,
  getMaterialNameByIor,
  calculateSnellDeflection,
  type IorMaterialName,
} from "./ior";

// 3. Inigo Quilez 2D Signed Distance Field (SDF) & Gradients
export { evalRoundedBoxSDF, type SDF2DResult } from "./sdf";

// 4. Texture Map Generation (Rounded Squircle 2D SDF Canvas)
export { generateDisplacementMap, evalSurfaceHeight, evalSurfaceSlope } from "./displacementMap";

// 5. Standard Single-Channel Displacement Filter
export { buildDisplacementFilterContent, buildStandardFilterContent } from "./displacementFilter";

// 6. Chromatic Aberration (Prism RGB Spectral Dispersion)
export {
  buildChromaticAberrationFilterContent,
  calculateChromaticScales,
  hasChromaticAberration,
  type ChromaticScales,
} from "./chromaticAberration";

// 7. Specular Highlights & Fresnel Reflection
export {
  generateSpecularMap,
  calculateSurfaceNormal,
  calculateLightDirection,
  calculateBlinnPhong,
  calculateFresnel,
  type SpecularOptions,
  type Vec3,
} from "./specular";

// 8. SVG Filter Assembly Orchestrator
export { createSvgFilterElement } from "./svgFilter";

// 9. Caching Strategy & DOM Defs Container Management
export {
  getOrCreateFluidGlassFilter,
  getSvgDefsContainer,
  clearFluidGlassCache,
} from "./filterCache";

// 10. React Integration Hook
export { useFluidGlass } from "./useFluidGlass";

// 11. Declarative DOM Auto-Observer
export { initFluidGlassAutoObserver } from "./observer";
