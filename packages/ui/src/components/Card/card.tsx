// packages/ui/src/components/Card/card.tsx
import { forwardRef, useRef } from "react";
import { cn } from "../../utils/cn";
import { useMergeRefs } from "../../utils/mergeRefs";
import { splitThemeProps } from "../../utils/splitThemeProps";
import { useTheme } from "../../hooks/useTheme";
import { cardVariants } from "./card.variants";
import type { CardProps } from "./card.types";

export { cardVariants, cardBaseVariants } from "./card.variants";
export * from "./card.types";
export * from "./themes";

/**
 * Card Component.
 *
 * Pure presentational component that delegates styling to theme-specific variants
 * (Primer, Fluid Glass, etc.) and runtime effects to `useTheme`.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>((props, forwardedRef) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(internalRef, forwardedRef);

  const {
    className,
    padding,
    interactive,
    variant = "filled",
    theme = "primer",
    themeVersion,
    "data-theme": dataTheme,
    "data-theme-version": dataThemeVersion,
    style,
    children,
    ...rest
  } = props as Record<string, any>;

  const resolvedTheme = theme ?? dataTheme ?? "primer";
  const resolvedVersion = themeVersion ?? dataThemeVersion;

  // Agnostically separate theme-specific options from safe HTML DOM attributes
  const { domProps, themeOptions } = splitThemeProps(rest, resolvedTheme);

  // Inject runtime theme effects and resolve theme descriptor & version
  const descriptor = useTheme(resolvedTheme, themeOptions, internalRef, resolvedVersion);

  return (
    <div
      ref={mergedRef}
      data-theme={descriptor.name}
      data-theme-version={descriptor.majorVersion}
      data-variant={variant}
      data-interactive={interactive ? "true" : undefined}
      className={cn(
        cardVariants({ theme: descriptor.name, variant, padding, interactive, className }),
      )}
      style={style}
      {...domProps}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";
