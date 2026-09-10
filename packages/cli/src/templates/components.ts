// packages/cli/src/templates/components.ts

export interface ComponentTemplate {
  name: string;
  filename: string;
  description: string;
  code: string;
}

export const TEMPLATES: Record<string, ComponentTemplate> = {
  card: {
    name: "card",
    filename: "card.tsx",
    description: "Card component with smart skin injection and clean presentation",
    code: `import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { useSkin, useMergeRefs, type SkinOptions } from "@shadoworg/shadowui";

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
  /** Pilihan tema / skin aktif ("primer" | "fluid-glass") */
  skin?: "primer" | "fluid-glass" | (string & {});
  "data-skin"?: string;

  /** Konfigurasi modular skin (untuk advance/generic skin usage) */
  skinProps?: SkinOptions;
  skinOptions?: SkinOptions;

  // Direct optical props untuk kemudahan DX
  fluidBezel?: number;
  fluidScale?: number;
  fluidIor?: number;
  fluidThickness?: number;
  fluidRimWidth?: number;
  fluidAberration?: number | { r?: number; g?: number; b?: number; red?: number; green?: number; blue?: number };
  fluidSpecular?: number;
  fluidLightAngle?: number;
  fluidInteractiveLight?: boolean;
  fluidMode?: "full" | "border";
  fluidSurface?: "convex-squircle" | "convex-circle" | "concave" | "lip";
}

/**
 * Card Component (100% Dumb Presentational Component).
 * Murni bertindak sebagai renderer DOM & CVA styling.
 * Seluruh side-effects, dynamic loader, dan event tracking ditangani secara modular oleh hook useSkin.
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
      fluidSurface,
      style,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs(internalRef, forwardedRef);

    const effectiveSkin = (skin ?? dataSkin ?? "primer") as "primer" | "fluid-glass";

    // Gabungkan opsi tanpa kalkulasi logika atau mutasi di dalam Card
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
      mode: fluidMode,
      surface: fluidSurface,
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
`,
  },
  button: {
    name: "button",
    filename: "button.tsx",
    description: "Interactive button component conforming to theme design tokens",
    code: `import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-[var(--ui-radius)] cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none",
  {
    variants: {
      variant: {
        filled: "bg-[var(--ui-btn-filled-bg)] text-[var(--ui-btn-filled-text)] shadow-[var(--ui-btn-filled-shadow)] hover:opacity-90 active:scale-98",
        outline: "border border-[var(--ui-btn-outline-border)] bg-[var(--ui-btn-outline-bg)] text-[var(--ui-btn-outline-text)] hover:bg-[var(--ui-btn-outline-hover)]",
        ghost: "bg-transparent text-[var(--ui-btn-ghost-text)] hover:bg-[var(--ui-btn-ghost-hover)]",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-12 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  skin?: "primer" | "fluid-glass";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, skin = "primer", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        data-skin={skin}
        className={buttonVariants({ variant, size, className })}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
`,
  },
  badge: {
    name: "badge",
    filename: "badge.tsx",
    description: "Badge tag component with subtle, solid, and outline variants",
    code: `import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-colors",
  {
    variants: {
      variant: {
        subtle: "bg-[var(--ui-badge-subtle-bg,rgba(255,255,255,0.15))] text-[var(--ui-badge-subtle-text,#ffffff)] border border-[var(--ui-badge-subtle-border,rgba(255,255,255,0.2))]",
        solid: "bg-indigo-600 text-white shadow-sm",
        outline: "border border-white/30 text-white",
      },
    },
    defaultVariants: {
      variant: "subtle",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  skin?: "primer" | "fluid-glass";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, skin = "primer", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        data-skin={skin}
        className={badgeVariants({ variant, className })}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
`,
  },
};
