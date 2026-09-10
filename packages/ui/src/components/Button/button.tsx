import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

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
      // filled
      {
        variant: "filled",
        tone: "default",
        class:
          "[background:var(--ui-btn-filled-bg)] text-[var(--ui-btn-filled-text)]",
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
        class:
          "text-[var(--ui-btn-ghost-text)] hover:[background:var(--ui-btn-ghost-hover)]",
      },
      {
        variant: "ghost",
        tone: "danger",
        class:
          "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 focus-visible:ring-red-500",
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
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  skin?: "primer" | "fluid-glass";
  "data-skin"?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      tone,
      skin,
      "data-skin": dataSkin,
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

    return (
      <Comp
        ref={ref}
        data-skin={skin ?? dataSkin}
        className={cn(buttonVariants({ variant, size, tone }), className)}
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
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
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