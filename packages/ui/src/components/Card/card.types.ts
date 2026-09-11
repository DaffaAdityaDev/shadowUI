// packages/ui/src/components/Card/card.types.ts
import type { HTMLAttributes } from "react";
import type { PrimerCardProps } from "./themes/primer";
import type { FluidGlassCardProps } from "./themes/fluid-glass";

export type CardTheme = "primer" | "fluid-glass" | (string & {});

export type CardVariant = "filled" | "outline" | "ghost";
export type CardPadding = "none" | "sm" | "md" | "lg";

/**
 * Base Card properties shared across all themes (DOM attributes & layout props).
 */
export interface BaseCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Padding scale */
  padding?: CardPadding;
  /** Enables hover elevation and pointer cursor */
  interactive?: boolean;
  /** Theme version iteration (e.g. "1", "2", or inline "fluid-glass@2") */
  themeVersion?: string | number;
  /** Active theme data attribute */
  "data-theme"?: string;
  /** Active theme version data attribute */
  "data-theme-version"?: string;
}

/**
 * Generic / Custom theme fallback properties.
 */
export interface GenericCardProps extends BaseCardProps {
  /** Custom theme name */
  theme?: string & {};
  /** Semantic visual variant */
  variant?: CardVariant;
  /** Modular theme configuration */
  themeOptions?: Record<string, any>;
  /** Alias for themeOptions */
  themeProps?: Record<string, any>;
  [key: string]: any;
}

/**
 * Discriminated union of CardProps per theme.
 *
 * When `theme="fluid-glass"`, TypeScript suggests optical props (fluidBezel, fluidIor, etc.).
 * When `theme="primer"` (or default), only Primer-relevant options are suggested.
 */
export type CardProps = PrimerCardProps | FluidGlassCardProps | GenericCardProps;
