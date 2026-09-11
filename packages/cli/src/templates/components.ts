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
    description: "Card component with token-based multi-theming and dynamic theme injection",
    code: `import { forwardRef, useRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { useTheme, useMergeRefs, type ThemeOptions } from "@shadoworg/shadowui";

export const cardVariants = cva(
  [
    "transition-all duration-200",
    "text-[var(--ui-text-contrast)]",
    "rounded-[var(--ui-radius)]",
  ],
  {
    variants: {
      variant: {
        filled: [
          "[background:var(--ui-fluid-specular,none),var(--ui-surface-base)]",
          "[border:var(--ui-border)]",
          "[box-shadow:var(--ui-shadow)]",
          "[backdrop-filter:var(--ui-fluid-filter,)_blur(var(--ui-backdrop-blur,0px))_saturate(var(--ui-backdrop-saturate,100%))]",
          "[-webkit-backdrop-filter:var(--ui-fluid-filter,)_blur(var(--ui-backdrop-blur,0px))_saturate(var(--ui-backdrop-saturate,100%))]",
        ],
        outline: [
          "bg-transparent",
          "[border:var(--ui-border)]",
          "shadow-none",
        ],
        ghost: [
          "bg-transparent",
          "border-transparent",
          "shadow-none",
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
          "active:translate-y-0",
        ],
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "filled",
        interactive: true,
        className: [
          "hover:[background:var(--ui-fluid-specular,none),var(--ui-surface-hover)]",
          "hover:[box-shadow:var(--ui-shadow-hover)]",
          "active:[background:var(--ui-fluid-specular,none),var(--ui-surface-active)]",
        ],
      },
      {
        variant: "outline",
        interactive: true,
        className: [
          "hover:bg-[var(--ui-surface-hover)]",
          "active:bg-[var(--ui-surface-active)]",
        ],
      },
      {
        variant: "ghost",
        interactive: true,
        className: [
          "hover:bg-[var(--ui-surface-hover)]",
          "active:bg-[var(--ui-surface-active)]",
        ],
      },
    ],
    defaultVariants: {
      variant: "filled",
      padding: "md",
      interactive: false,
    },
  }
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  theme?: string;
  themeVersion?: string | number;
  "data-theme"?: string;
  "data-theme-version"?: string;
  themeOptions?: ThemeOptions;
  themeProps?: ThemeOptions;
  [key: string]: any;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      padding,
      interactive,
      variant = "filled",
      theme,
      themeVersion,
      "data-theme": dataTheme,
      "data-theme-version": dataThemeVersion,
      themeProps,
      themeOptions,
      style,
      children,
      ...rest
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs(internalRef, forwardedRef);
    const resolvedTheme = theme ?? dataTheme ?? "primer";
    const resolvedVersion = themeVersion ?? dataThemeVersion;

    const descriptor = useTheme(
      resolvedTheme,
      { ...themeOptions, ...themeProps },
      internalRef,
      resolvedVersion
    );

    return (
      <div
        ref={mergedRef}
        data-theme={descriptor.name}
        data-theme-version={descriptor.majorVersion}
        data-variant={variant}
        data-interactive={interactive ? "true" : undefined}
        className={cardVariants({ variant, padding, interactive, className })}
        style={style}
        {...rest}
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
    code: `import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

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
        outline: [
          "border",
          "hover:-translate-y-0.5",
          "active:translate-y-0",
        ],
        ghost: [
          "bg-transparent",
          "active:scale-95",
        ],
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
      {
        variant: "filled",
        tone: "default",
        class: "[background:var(--ui-btn-filled-bg)] text-[var(--ui-btn-filled-text)]",
      },
      {
        variant: "filled",
        tone: "danger",
        class: "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white focus-visible:ring-red-500",
      },
      {
        variant: "outline",
        tone: "default",
        class: "[background:var(--ui-btn-outline-bg)] [border-color:var(--ui-btn-outline-border)] text-[var(--ui-btn-outline-text)] hover:[background:var(--ui-btn-outline-hover)]",
      },
      {
        variant: "outline",
        tone: "danger",
        class: "border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 focus-visible:ring-red-500",
      },
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
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  theme?: string;
  themeVersion?: string | number;
  "data-theme"?: string;
  "data-theme-version"?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      tone,
      theme,
      themeVersion,
      "data-theme": dataTheme,
      "data-theme-version": dataThemeVersion,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...rest
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;
    const resolvedTheme = theme ?? dataTheme;
    const resolvedVersion = themeVersion ?? dataThemeVersion;

    return (
      <Comp
        ref={ref}
        data-theme={resolvedTheme}
        data-theme-version={resolvedVersion}
        className={buttonVariants({ variant, size, tone, className })}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...rest}
      >
        {loading ? (
          <svg
            className="animate-spin -ml-0.5 mr-1.5 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </Comp>
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
    code: `import { forwardRef, type HTMLAttributes } from "react";
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
      {
        variant: "filled",
        tone: "default",
        class: "[background:var(--ui-btn-filled-bg)] text-[var(--ui-btn-filled-text)] [box-shadow:var(--ui-btn-filled-shadow)]",
      },
      {
        variant: "filled",
        tone: "danger",
        class: "bg-red-600 text-white shadow-sm",
      },
      {
        variant: "outline",
        tone: "default",
        class: "[border-color:var(--ui-btn-outline-border)] text-[var(--ui-btn-outline-text)] [background:var(--ui-btn-outline-bg)]",
      },
      {
        variant: "outline",
        tone: "danger",
        class: "border-red-500 text-red-600 [background:var(--ui-btn-outline-bg)]",
      },
      {
        variant: "subtle",
        tone: "default",
        class: "[background:var(--ui-badge-subtle-bg)] text-[var(--ui-badge-subtle-text)] [border-color:var(--ui-border-color)]",
      },
      {
        variant: "subtle",
        tone: "danger",
        class: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50",
      },
    ],
    defaultVariants: {
      variant: "filled",
      tone: "default",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  theme?: string;
  themeVersion?: string | number;
  "data-theme"?: string;
  "data-theme-version"?: string;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      tone,
      theme,
      themeVersion,
      "data-theme": dataTheme,
      "data-theme-version": dataThemeVersion,
      children,
      ...rest
    },
    ref
  ) => {
    const resolvedTheme = theme ?? dataTheme;
    const resolvedVersion = themeVersion
      ? String(themeVersion)
      : dataThemeVersion;

    return (
      <span
        ref={ref}
        data-theme={resolvedTheme}
        data-theme-version={resolvedVersion}
        className={badgeVariants({ variant, tone, className })}
        {...rest}
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
