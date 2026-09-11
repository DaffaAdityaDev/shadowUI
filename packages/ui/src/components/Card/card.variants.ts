// packages/ui/src/components/Card/card.variants.ts
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { primerCardVariants } from "./themes/primer";
import { fluidGlassCardVariants } from "./themes/fluid-glass";
import type { CardPadding, CardTheme, CardVariant } from "./card.types";

/**
 * Base layout variants shared by all Card themes (padding, structural defaults).
 */
export const cardBaseVariants = cva(
  ["transition-all duration-200", "text-[var(--ui-text-contrast)]", "rounded-[var(--ui-radius)]"],
  {
    variants: {
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-6",
        lg: "p-8",
      },
      interactive: {
        true: ["cursor-pointer", "hover:-translate-y-0.5", "active:translate-y-0"],
        false: "",
      },
      theme: {
        primer: "",
        "fluid-glass": "",
      },
      variant: {
        filled: "",
        outline: "",
        ghost: "",
      },
    },
    defaultVariants: {
      padding: "md",
      interactive: false,
      variant: "filled",
    },
  },
);

export type CardBaseVariants = VariantProps<typeof cardBaseVariants>;

export interface CardVariantOptions {
  theme?: CardTheme;
  variant?: CardVariant;
  padding?: CardPadding;
  interactive?: boolean;
  className?: string;
}

/**
 * Theme dispatcher for Card variants.
 * Dynamically resolves the active theme's variant implementation (Primer, Fluid Glass, etc.)
 * alongside universal base layout classes.
 */
export function cardVariants(options?: CardVariantOptions): string {
  const {
    theme = "primer",
    variant = "filled",
    padding = "md",
    interactive = false,
    className,
  } = options ?? {};

  const resolvedTheme = theme;
  const baseClass = cardBaseVariants({ padding, interactive });

  let themeClass = "";
  if (resolvedTheme === "fluid-glass") {
    themeClass = fluidGlassCardVariants({ variant, interactive });
  } else {
    // Default fallback to Primer
    themeClass = primerCardVariants({ variant, interactive });
  }

  return cn(baseClass, themeClass, className);
}

export type CardVariants = VariantProps<typeof cardBaseVariants>;
