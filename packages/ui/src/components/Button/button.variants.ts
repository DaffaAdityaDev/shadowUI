// packages/ui/src/components/Button/button.variants.ts
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Universal token-driven Button variants.
 *
 * Defines semantic variants (filled, outline, ghost) and sizes/tones.
 * Styling is driven by theme CSS tokens (--ui-btn-filled-bg, --ui-btn-outline-border, etc.)
 * allowing any theme or dark mode to style buttons automatically.
 */
export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 select-none cursor-pointer",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[border-radius:var(--ui-radius)]",
    "[backdrop-filter:blur(var(--ui-backdrop-blur))_saturate(var(--ui-backdrop-saturate))]",
    "[-webkit-backdrop-filter:blur(var(--ui-backdrop-blur))_saturate(var(--ui-backdrop-saturate))]",
  ],
  {
    variants: {
      variant: {
        filled: [
          "[box-shadow:var(--ui-btn-filled-shadow)]",
          "hover:opacity-95 hover:-translate-y-0.5",
          "active:translate-y-0",
        ],
        outline: ["border", "hover:-translate-y-0.5", "active:translate-y-0"],
        ghost: ["bg-transparent", "active:scale-95"],
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-12 px-6 text-lg",
      },
      tone: {
        default: "",
        danger: "",
      },
    },
    compoundVariants: [
      // filled
      {
        variant: "filled",
        tone: "default",
        class: "[background:var(--ui-btn-filled-bg)] text-[var(--ui-btn-filled-text)]",
      },
      {
        variant: "filled",
        tone: "danger",
        class:
          "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white focus-visible:ring-red-500",
      },
      // outline
      {
        variant: "outline",
        tone: "default",
        class:
          "[background:var(--ui-btn-outline-bg)] [border-color:var(--ui-btn-outline-border)] text-[var(--ui-btn-outline-text)] hover:[background:var(--ui-btn-outline-hover)]",
      },
      {
        variant: "outline",
        tone: "danger",
        class:
          "border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 focus-visible:ring-red-500",
      },
      // ghost
      {
        variant: "ghost",
        tone: "default",
        class: "text-[var(--ui-btn-ghost-text)] hover:[background:var(--ui-btn-ghost-hover)]",
      },
      {
        variant: "ghost",
        tone: "danger",
        class: "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 focus-visible:ring-red-500",
      },
    ],
    defaultVariants: {
      variant: "filled",
      size: "md",
      tone: "default",
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
