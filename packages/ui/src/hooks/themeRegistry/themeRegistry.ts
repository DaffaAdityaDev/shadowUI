import { usePrimerTheme } from "../themes/usePrimerTheme";
import { useFluidGlassTheme } from "../themes/useFluidGlassTheme";
import type { ThemeRegistration, ThemeHook, ParsedThemeDescriptor } from "./themeRegistry.types";

const registry = new Map<string, ThemeRegistration>();

function createThemeKey(name: string, majorVersion: number): string {
  return `${name}@v${majorVersion}`;
}

export function parseThemeDescriptor(
  themeNameOrDescriptor?: string,
  versionArg?: string | number,
): ParsedThemeDescriptor {
  const fallback: ParsedThemeDescriptor = { name: "primer", version: "1", majorVersion: 1 };
  if (!themeNameOrDescriptor) return fallback;

  let name = themeNameOrDescriptor;
  let parsedMajor = 1;

  const atIndex = themeNameOrDescriptor.indexOf("@");
  if (atIndex !== -1) {
    name = themeNameOrDescriptor.slice(0, atIndex);
    const rawVersion = themeNameOrDescriptor.slice(atIndex + 1);
    const versionMatch = rawVersion.match(/^v?(\d+)/i);
    parsedMajor = versionMatch ? parseInt(versionMatch[1], 10) : 1;
  } else if (versionArg !== undefined) {
    const versionMatch = String(versionArg).match(/^v?(\d+)/i);
    parsedMajor = versionMatch ? parseInt(versionMatch[1], 10) : 1;
  }

  const validMajor = Number.isFinite(parsedMajor) && parsedMajor > 0 ? parsedMajor : 1;

  return {
    name,
    version: String(validMajor),
    majorVersion: validMajor,
  };
}

export function registerTheme(
  name: string,
  majorVersion: number,
  hook: ThemeHook,
  metadata?: Record<string, unknown>,
): void {
  const key = createThemeKey(name, majorVersion);
  registry.set(key, { name, majorVersion, version: String(majorVersion), hook, metadata });
}

export function getRegisteredTheme(
  name: string,
  majorVersion: number = 1,
): ThemeRegistration | undefined {
  const key = createThemeKey(name, majorVersion);
  return registry.get(key);
}

export function listRegisteredThemes(): string[] {
  return Array.from(registry.keys());
}

// Built-in theme registrations
registerTheme("primer", 1, usePrimerTheme);
registerTheme("fluid-glass", 1, useFluidGlassTheme);
