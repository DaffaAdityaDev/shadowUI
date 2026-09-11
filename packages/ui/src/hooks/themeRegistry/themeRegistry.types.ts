// packages/ui/src/hooks/themeRegistry/themeRegistry.types.ts
import type { RefObject } from "react";
import type { FluidGlassThemeOptions } from "../themes/useFluidGlassTheme.types";
import type { PrimerThemeOptions } from "../themes/usePrimerTheme.types";

export type ThemeHook<T extends HTMLElement = any, TOptions = any> = (
  elementRef: RefObject<T | null>,
  options?: TOptions,
  enabled?: boolean,
) => void;

export interface ThemeRegistration<TOptions = any> {
  name: string;
  majorVersion: number;
  version?: string;
  hook: ThemeHook<any, TOptions>;
  metadata?: Record<string, unknown>;
  isDefault?: boolean;
}

export interface ParsedThemeDescriptor {
  name: string;
  version?: string;
  majorVersion?: number;
}

export type ThemeOptions = FluidGlassThemeOptions | PrimerThemeOptions | Record<string, any>;
