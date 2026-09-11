// packages/ui/src/hooks/themes/useFluidGlassTheme.types.ts
import type {
  ChromaticAberration,
  FluidGlassOptions,
  FluidGlassMode,
  FluidGlassSurface,
} from "../../utils/fluidGlass/types";

export interface FluidGlassThemeOptions extends FluidGlassOptions {
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
  fluidSurface?: FluidGlassSurface;
  fluidBlur?: number;
  blur?: number;
  fluidOpacity?: number;
  opacity?: number;
  fluidSaturate?: number;
  saturate?: number;
  [key: string]: any;
}
