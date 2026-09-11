import type { RefObject } from "react";
import { useFluidGlassTheme } from "../themes/useFluidGlassTheme";
import { usePrimerTheme } from "../themes/usePrimerTheme";
import {
  parseThemeDescriptor,
  type ParsedThemeDescriptor,
  type ThemeOptions,
} from "../themeRegistry";

/**
 * Theme Orchestrator Hook with Theme Versioning Support.
 *
 * Supports both named themes and versioned iterations:
 * - theme="fluid-glass" (resolves default v1)
 * - theme="fluid-glass@2" or themeVersion="2" (resolves v2 iteration)
 * - theme="primer"
 */
export function useTheme<T extends HTMLElement = HTMLDivElement>(
  theme: string | undefined,
  themeProps?: ThemeOptions,
  elementRef?: RefObject<T | null>,
  themeVersion?: string | number,
): ParsedThemeDescriptor {
  const descriptor = parseThemeDescriptor(
    theme ? (themeVersion ? `${theme}@${themeVersion}` : theme) : undefined,
  );

  const isFluid = descriptor.name === "fluid-glass";
  const isPrimer = descriptor.name === "primer" || !descriptor.name;
  const majorVersion = descriptor.majorVersion ?? 1;

  const isFluidV1 = isFluid && majorVersion === 1;
  const isFluidV2 = isFluid && majorVersion === 2;

  const targetRef = elementRef ?? ({ current: null } as RefObject<T | null>);

  // Unconditional hook invocations conforming to React Rules of Hooks
  useFluidGlassTheme(targetRef, themeProps, isFluidV1 || isFluidV2);
  usePrimerTheme(targetRef, themeProps, isPrimer);

  return descriptor;
}
