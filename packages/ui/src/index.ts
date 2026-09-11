// Components
export {
  Button,
  type ButtonProps,
  type ButtonTheme,
  buttonVariants,
  type ButtonVariants,
} from "./components/Button";
export {
  Badge,
  type BadgeProps,
  type BadgeTheme,
  type BadgeVariant,
  type BadgeTone,
  badgeVariants,
  type BadgeVariants,
} from "./components/Badge";
export {
  Card,
  type CardProps,
  type CardTheme,
  type CardVariant,
  type CardPadding,
  cardVariants,
  cardBaseVariants,
} from "./components/Card";

// Utilities
export { cn } from "./utils/cn";
export { useMergeRefs, mergeRefs } from "./utils/mergeRefs";
export { splitThemeProps, type SplitThemePropsResult } from "./utils/splitThemeProps";

// Theme Orchestration
export { useTheme } from "./hooks/useTheme";
export {
  type ThemeOptions,
  registerTheme,
  getRegisteredTheme,
  listRegisteredThemes,
  parseThemeDescriptor,
  type ThemeRegistration,
  type ParsedThemeDescriptor,
  type ThemeHook,
} from "./hooks/themeRegistry";

// Theme-specific hooks
export {
  useFluidGlassTheme,
  type FluidGlassThemeOptions,
  usePrimerTheme,
  type PrimerThemeOptions,
} from "./hooks/themes";

// Optical Engine (Fluid Glass Physics & Shaders)
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
