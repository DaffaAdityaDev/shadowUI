// packages/ui/src/components/Badge/badge.variants.ts
import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva(
  [
    "inline-flex items-center px-2.5 py-0.5 text-xs font-semibold transition-all duration-150 select-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2",
    "[border-radius:calc(var(--ui-radius)*1.5)]",
    "[backdrop-filter:blur(var(--ui-backdrop-blur))_saturate(var(--ui-backdrop-saturate))]",
    "[-webkit-backdrop-filter:blur(var(--ui-backdrop-blur))_saturate(var(--ui-backdrop-saturate))]",
  ],
  {
    variants: {
      variant: {
        filled: "",
        outline: "border",
        subtle: "border",
      },
      tone: {
        default: "",
        danger: "",
      },
    },
    compoundVariants: [
      // Filled
      {
        variant: "filled",
        tone: "default",
        class:
          "[background:var(--ui-btn-filled-bg)] text-[var(--ui-btn-filled-text)] [box-shadow:var(--ui-btn-filled-shadow)]",
      },
      {
        variant: "filled",
        tone: "danger",
        class: "bg-red-600 text-white shadow-sm",
      },
      // Outline
      {
        variant: "outline",
        tone: "default",
        class:
          "[border-color:var(--ui-btn-outline-border)] text-[var(--ui-btn-outline-text)] [background:var(--ui-btn-outline-bg)]",
      },
      {
        variant: "outline",
        tone: "danger",
        class: "border-red-500 text-red-600 [background:var(--ui-btn-outline-bg)]",
      },
      // Subtle
      {
        variant: "subtle",
        tone: "default",
        class:
          "[background:var(--ui-badge-subtle-bg)] text-[var(--ui-badge-subtle-text)] [border-color:var(--ui-border-color)]",
      },
      {
        variant: "subtle",
        tone: "danger",
        class:
          "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50",
      },
    ],
    defaultVariants: {
      variant: "filled",
      tone: "default",
    },
  },
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
