// packages/ui/src/utils/splitThemeProps.ts

export interface SplitThemePropsResult {
  /**
   * Safe HTML attributes to spread directly onto the DOM element without React attribute leakage warnings.
   */
  domProps: Record<string, any>;
  /**
   * Extracted theme-specific options to pass into `useTheme` / theme hooks.
   */
  themeOptions: Record<string, any>;
}

/**
 * Splits incoming component props into safe HTML DOM attributes and theme-specific options.
 *
 * Automatically detects:
 * - Direct encapsulated props: `themeProps`, `themeOptions`
 * - Theme-prefixed flat props: e.g. `fluid*`, `cyber*`, `clay*`
 * - Theme-specific aliases: e.g. `mode`, `surface` when theme is 'fluid-glass'
 *
 * This keeps presentational components (Card, Button, Badge) 100% agnostic to theme details
 * and guarantees zero DOM attribute leakage.
 */
export function splitThemeProps(
  props: Record<string, any>,
  themeName?: string,
): SplitThemePropsResult {
  const domProps: Record<string, any> = {};
  const themeOptions: Record<string, any> = {
    ...props.themeProps,
    ...props.themeOptions,
  };

  const isFluidGlass = themeName === "fluid-glass";

  for (const [key, value] of Object.entries(props)) {
    if (key === "themeProps" || key === "themeOptions") {
      continue;
    }

    // Check if key is a theme-specific prop
    const isThemeProp =
      key.startsWith("fluid") || (isFluidGlass && (key === "mode" || key === "surface"));

    if (isThemeProp) {
      // Normalize key (e.g. "fluidIor" -> "ior")
      const normalizedKey =
        key.startsWith("fluid") && key.length > 5
          ? key.charAt(5).toLowerCase() + key.slice(6)
          : key;

      themeOptions[normalizedKey] = value;
      themeOptions[key] = value;
    } else {
      domProps[key] = value;
    }
  }

  return { domProps, themeOptions };
}
