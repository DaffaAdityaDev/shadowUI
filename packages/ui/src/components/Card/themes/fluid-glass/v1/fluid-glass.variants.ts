// packages/ui/src/components/Card/themes/fluid-glass/v1/fluid-glass.variants.ts
import { cva, type VariantProps } from "class-variance-authority";

export const fluidGlassCardVariants = cva(
  ["transition-all duration-200", "text-[var(--ui-text-contrast)]", "rounded-[var(--ui-radius)]"],
  {
    variants: {
      variant: {
        filled: [
          "[background:var(--ui-fluid-specular,none),var(--ui-surface-base,rgba(255,255,255,0.08))]",
          "[background-size:100%_100%,auto]",
          "[background-repeat:no-repeat,repeat]",
          "[border:var(--ui-border,1px_solid_rgba(255,255,255,0.15))]",
          "[box-shadow:var(--ui-shadow,0_8px_32px_rgba(0,0,0,0.25))]",
          "[backdrop-filter:var(--ui-fluid-filter,)_blur(var(--ui-backdrop-blur,16px))_saturate(var(--ui-backdrop-saturate,180%))]",
          "[-webkit-backdrop-filter:var(--ui-fluid-filter,)_blur(var(--ui-backdrop-blur,16px))_saturate(var(--ui-backdrop-saturate,180%))]",
        ],
        outline: [
          "bg-transparent",
          "[border:var(--ui-border,1px_solid_rgba(255,255,255,0.35))]",
          "[box-shadow:inset_0_1px_1px_rgba(255,255,255,0.3)]",
          "[backdrop-filter:var(--ui-fluid-filter,)_blur(var(--ui-backdrop-blur,8px))]",
          "[-webkit-backdrop-filter:var(--ui-fluid-filter,)_blur(var(--ui-backdrop-blur,8px))]",
        ],
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
          "hover:[background:var(--ui-fluid-specular,none),var(--ui-surface-hover,rgba(255,255,255,0.15))]",
          "hover:[box-shadow:var(--ui-shadow-hover,0_12px_40px_rgba(0,0,0,0.35))]",
          "active:[background:var(--ui-fluid-specular,none),var(--ui-surface-active,rgba(255,255,255,0.2))]",
        ],
      },
      {
        variant: "outline",
        interactive: true,
        className: [
          "hover:[background:var(--ui-fluid-specular,none),rgba(255,255,255,0.08)]",
          "hover:[border-color:rgba(255,255,255,0.5)]",
          "active:[background:rgba(255,255,255,0.12)]",
        ],
      },
      {
        variant: "ghost",
        interactive: true,
        className: [
          "hover:[background:var(--ui-fluid-specular,none),var(--ui-surface-base,rgba(255,255,255,0.08))]",
          "hover:[border-color:var(--ui-border,1px_solid_rgba(255,255,255,0.15))]",
          "hover:[backdrop-filter:var(--ui-fluid-filter,)_blur(var(--ui-backdrop-blur,12px))]",
          "hover:[-webkit-backdrop-filter:var(--ui-fluid-filter,)_blur(var(--ui-backdrop-blur,12px))]",
          "active:[background:var(--ui-surface-hover,rgba(255,255,255,0.15))]",
        ],
      },
    ],
    defaultVariants: {
      variant: "filled",
      interactive: false,
    },
  },
);

export type FluidGlassCardVariants = VariantProps<typeof fluidGlassCardVariants>;
