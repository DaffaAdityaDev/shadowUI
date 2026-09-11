// packages/ui/src/components/Badge/badge.types.ts
import type { HTMLAttributes } from "react";

export type BadgeVariant = "filled" | "outline" | "subtle";
export type BadgeTone = "default" | "danger";
export type BadgeTheme = "primer" | "fluid-glass" | (string & {});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual variant */
  variant?: BadgeVariant;
  /** Semantic color tone */
  tone?: BadgeTone;
  /** Active theme */
  theme?: BadgeTheme;
  /** Theme version iteration */
  themeVersion?: string | number;
  /** Active theme data attribute */
  "data-theme"?: string;
  /** Active theme version data attribute */
  "data-theme-version"?: string;
}
