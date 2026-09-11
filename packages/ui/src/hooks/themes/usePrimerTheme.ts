// packages/ui/src/hooks/themes/usePrimerTheme.ts
import type { RefObject } from "react";
import type { PrimerThemeOptions } from "./usePrimerTheme.types";

export type { PrimerThemeOptions };

/**
 * Dedicated Custom Hook for the "primer" Theme (Default Clean CSS Theme).
 * Pure CSS presentation with zero canvas/SVG runtime calculation overhead.
 */
export function usePrimerTheme<T extends HTMLElement = HTMLDivElement>(
  _elementRef: RefObject<T | null>,
  _options?: PrimerThemeOptions,
  _enabled: boolean = true,
): void {
  // Primer is a pure CSS theme with zero JavaScript runtime side-effects.
}
