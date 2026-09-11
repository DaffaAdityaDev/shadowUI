// packages/ui/src/components/Button/button.tsx
import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./button.variants";
import type { ButtonProps } from "./button.types";

export { buttonVariants, type ButtonVariants } from "./button.variants";
export type { ButtonProps, ButtonTheme } from "./button.types";

/**
 * Button Component.
 *
 * Supports Slot polymorphism (asChild), loading state, icons, and semantic styling
 * connected to theme CSS tokens.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      tone,
      theme,
      "data-theme": dataTheme,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...rest
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;
    const resolvedTheme = theme ?? dataTheme;

    return (
      <Comp
        ref={ref}
        data-theme={resolvedTheme}
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
  },
);

Button.displayName = "Button";
