export { Button, type ButtonProps, buttonVariants } from "./components/Button/button";
export { Badge, type BadgeProps, badgeVariants } from "./components/Badge/badge";
export { Card, type CardProps, cardVariants } from "./components/Card/card";
export { cn } from "./utils/cn";
export { useMergeRefs, mergeRefs } from "./utils/mergeRefs";
export { useSkin, type SkinOptions } from "./hooks/useSkin";
export {
  useFluidGlassSkin,
  type FluidGlassSkinOptions,
  usePrimerSkin,
  type PrimerSkinOptions,
} from "./hooks/skins";
export {
  generateDisplacementMap,
  getOrCreateFluidGlassFilter,
  useFluidGlass,
  initFluidGlassAutoObserver,
  clearFluidGlassCache,
  buildDisplacementFilterContent,
  buildStandardFilterContent,
  buildChromaticAberrationFilterContent,
  calculateChromaticScales,
  hasChromaticAberration,
  calculateSnellDeflection,
  IOR_PRESETS,
  getMaterialNameByIor,
  generateSpecularMap,
  calculateSurfaceNormal,
  calculateLightDirection,
  calculateBlinnPhong,
  calculateFresnel,
  evalSurfaceHeight,
  evalSurfaceSlope,
  type FluidGlassOptions,
  type FluidGlassFilterConfig,
  type FluidGlassMode,
  type FluidGlassSurface,
  type DisplacementMapConfig,
  type ChromaticScales,
  type ChromaticAberration,
  type ChromaticChannelOffsets,
  type IorMaterialName,
  type SpecularOptions,
} from "./utils/fluidGlass";
