// packages/ui/src/components/Card/themes/primer/v1/primer.variants.ts
import { cva, type VariantProps } from "class-variance-authority";

export const primerCardVariants = cva(
  ["transition-all duration-200", "text-[var(--ui-text-contrast)]", "rounded-[var(--ui-radius)]"],
  {
    variants: {
      variant: {
        filled: [
          "bg-[var(--ui-surface-base)]",
          "border-[var(--ui-border)]",
          "shadow-[var(--ui-shadow)]",
        ],
        outline: ["bg-transparent", "border-[var(--ui-border)]", "shadow-none"],
        ghost: ["bg-transparent", "border-transparent", "shadow-none"],
      },
      interactive: {
        true: ["cursor-pointer", "hover:-translate-y-0.5", "active:translate-y-0"],
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "filled",
        interactive: true,
        className: [
          "hover:bg-[var(--ui-surface-hover)]",
          "hover:shadow-[var(--ui-shadow-hover)]",
          "active:bg-[var(--ui-surface-active)]",
        ],
      },
      {
        variant: "outline",
        interactive: true,
        className: ["hover:bg-[var(--ui-surface-hover)]", "active:bg-[var(--ui-surface-active)]"],
      },
      {
        variant: "ghost",
        interactive: true,
        className: ["hover:bg-[var(--ui-surface-hover)]", "active:bg-[var(--ui-surface-active)]"],
      },
    ],
    defaultVariants: {
      variant: "filled",
      interactive: false,
    },
  },
);

export type PrimerCardVariants = VariantProps<typeof primerCardVariants>;
