// packages/ui/src/components/Card/themes/primer/v1/primer.types.ts
import type { BaseCardProps } from "../../../card.types";
import type { PrimerThemeOptions } from "../../../../../hooks/themes/usePrimerTheme";

export type PrimerCardVariant = "filled" | "outline" | "ghost";

export interface PrimerCardProps extends BaseCardProps {
  /** Active theme choice: Primer (Clean, solid, subtle border) */
  theme?: "primer";
  /** Semantic visual variant */
  variant?: PrimerCardVariant;
  /** Modular theme configuration for primer */
  themeOptions?: PrimerThemeOptions;
  /** Alias for themeOptions */
  themeProps?: PrimerThemeOptions;
}
