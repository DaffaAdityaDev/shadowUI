// packages/ui/src/components/Badge/badge.tsx
import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { badgeVariants } from "./badge.variants";
import type { BadgeProps } from "./badge.types";

export { badgeVariants, type BadgeVariants } from "./badge.variants";
export * from "./badge.types";

/**
 * Badge Component.
 *
 * Clean presentational badge tag supporting subtle, solid, and outline variants
 * dynamically themed via CSS variables.
 */
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
    ref,
  ) => {
    const effectiveTheme = theme ?? dataTheme;
    const effectiveVersion = themeVersion ? String(themeVersion) : dataThemeVersion;

    return (
      <span
        ref={ref}
        data-theme={effectiveTheme}
        data-theme-version={effectiveVersion}
        className={cn(badgeVariants({ variant, tone }), className)}
        {...rest}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";
