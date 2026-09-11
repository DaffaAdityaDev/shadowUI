// packages/ui/src/components/Card/themes/fluid-glass/v1/fluid-glass.types.ts
import type { BaseCardProps } from "../../../card.types";
import type { FluidGlassThemeOptions } from "../../../../../hooks/themes/useFluidGlassTheme";
import type {
  ChromaticAberration,
  FluidGlassMode,
  FluidGlassSurface,
} from "../../../../../utils/fluidGlass/types";

export type FluidGlassCardVariant = "filled" | "outline" | "ghost";

export interface FluidGlassCardProps extends BaseCardProps {
  /** Active theme choice: Fluid Glass (Glassmorphic, refraction, specular lighting) */
  theme?: "fluid-glass";
  /** Semantic visual variant */
  variant?: FluidGlassCardVariant;
  /** Modular theme configuration for fluid glass */
  themeOptions?: FluidGlassThemeOptions;
  /** Alias for themeOptions */
  themeProps?: FluidGlassThemeOptions;

  // Dedicated optical props for Fluid Glass theme
  fluidBezel?: number;
  fluidScale?: number;
  fluidIor?: number;
  fluidThickness?: number;
  fluidRimWidth?: number;
  fluidAberration?: ChromaticAberration;
  fluidSpecular?: number;
  fluidLightAngle?: number;
  fluidInteractiveLight?: boolean;
  fluidMode?: FluidGlassMode;
  mode?: FluidGlassMode;
  fluidSurface?: FluidGlassSurface;
  surface?: FluidGlassSurface;

  // Optical Material Clarity & Tint Props
  /** Backdrop blur in pixels (0px for crystal clear glass, 16px for frosted). Default: 0px */
  fluidBlur?: number;
  /** Surface tint opacity in percentage (0 to 100) or decimal (0 to 1). Default: 6% */
  fluidOpacity?: number;
  /** Backdrop saturation percentage. Default: 150% */
  fluidSaturate?: number;
}
