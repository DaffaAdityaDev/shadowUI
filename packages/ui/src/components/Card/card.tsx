// packages/ui/src/components/Card/card.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { useMergeRefs } from "../../utils/mergeRefs";
import { useSkin, type SkinOptions } from "../../hooks/useSkin";
import type { ChromaticAberration } from "../../utils/fluidGlass/types";

export const cardVariants = cva(
  [
    "transition-all duration-200",
    "text-[var(--ui-text-contrast)]",
    "rounded-[var(--ui-radius)]",
  ],
  {
    variants: {
      skin: {
        primer: [
          "bg-[var(--ui-surface-base)]",
          "border-[var(--ui-border)]",
          "shadow-[var(--ui-shadow)]",
        ],
        "fluid-glass": [
          "[background:var(--ui-fluid-specular,none),var(--ui-surface-base,rgba(255,255,255,0.08))]",
          "[background-size:100%_100%,auto]",
          "[background-repeat:no-repeat,repeat]",
          "[border:var(--ui-border,1px_solid_rgba(255,255,255,0.15))]",
          "[box-shadow:var(--ui-shadow,0_8px_32px_rgba(0,0,0,0.25))]",
          "[backdrop-filter:var(--ui-fluid-filter,)_blur(var(--ui-backdrop-blur,16px))_saturate(var(--ui-backdrop-saturate,180%))]",
          "[-webkit-backdrop-filter:var(--ui-fluid-filter,)_blur(var(--ui-backdrop-blur,16px))_saturate(var(--ui-backdrop-saturate,180%))]",
        ],
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-6",
        lg: "p-8",
      },
      interactive: {
        true: [
          "cursor-pointer",
          "hover:-translate-y-0.5",
        ],
        false: "",
      },
    },
    compoundVariants: [
      {
        skin: "primer",
        interactive: true,
        className: [
          "hover:bg-[var(--ui-surface-hover)]",
          "hover:shadow-[var(--ui-shadow-hover)]",
          "active:bg-[var(--ui-surface-active)]",
        ],
      },
      {
        skin: "fluid-glass",
        interactive: true,
        className: [
          "hover:[background:var(--ui-fluid-specular,none),var(--ui-surface-hover,rgba(255,255,255,0.15))]",
          "hover:[box-shadow:var(--ui-shadow-hover,0_12px_40px_rgba(0,0,0,0.35))]",
          "active:[background:var(--ui-fluid-specular,none),var(--ui-surface-active,rgba(255,255,255,0.2))]",
        ],
      },
    ],
    defaultVariants: {
      skin: "primer",
      padding: "md",
      interactive: false,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof cardVariants>, "skin"> {
  /** Active skin/theme choice ("primer" | "fluid-glass") */
  skin?: "primer" | "fluid-glass" | (string & {});
  "data-skin"?: string;

  /** Modular skin configuration (for advanced/generic skin usage) */
  skinProps?: SkinOptions;
  skinOptions?: SkinOptions;

  // Direct optical props for developer convenience
  fluidBezel?: number;
  fluidScale?: number;
  fluidIor?: number;
  fluidThickness?: number;
  fluidRimWidth?: number;
  fluidAberration?: ChromaticAberration;
  fluidSpecular?: number;
  fluidLightAngle?: number;
  fluidInteractiveLight?: boolean;
  fluidMode?: "full" | "border";
  mode?: "full" | "border";
  fluidSurface?: "convex-squircle" | "convex-circle" | "concave" | "lip";
  surface?: "convex-squircle" | "convex-circle" | "concave" | "lip";
}

/**
 * Card Component (100% Dumb Presentational Component).
 * Purely acts as a DOM renderer and CVA styling layer.
 * All side-effects, dynamic loaders, and event tracking are modularly handled by the `useSkin` hook.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      padding,
      interactive,
      skin = "primer",
      "data-skin": dataSkin,
      skinProps,
      skinOptions,
      fluidBezel,
      fluidScale,
      fluidIor,
      fluidThickness,
      fluidRimWidth,
      fluidAberration,
      fluidSpecular,
      fluidLightAngle,
      fluidInteractiveLight,
      fluidMode,
      mode,
      fluidSurface,
      surface,
      style,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs(internalRef, forwardedRef);

    const effectiveSkin = (skin ?? dataSkin ?? "primer") as "primer" | "fluid-glass";

    // Consolidate options without executing logic or mutations inside Card
    const combinedSkinProps: SkinOptions = {
      bezel: fluidBezel,
      scale: fluidScale,
      ior: fluidIor,
      thickness: fluidThickness,
      rimWidth: fluidRimWidth,
      aberration: fluidAberration,
      specular: fluidSpecular,
      lightAngle: fluidLightAngle,
      interactiveLight: fluidInteractiveLight,
      mode: fluidMode ?? mode,
      surface: fluidSurface ?? surface,
      ...skinOptions,
      ...skinProps,
    };

    // Inject runtime skin effects (ResizeObserver, SVG Filter, Canvas Specular) via hook
    useSkin(effectiveSkin, combinedSkinProps, internalRef);

    return (
      <div
        ref={mergedRef}
        data-skin={effectiveSkin}
        data-interactive={interactive ? "true" : undefined}
        className={cn(cardVariants({ skin: effectiveSkin, padding, interactive, className }))}
        style={style}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
