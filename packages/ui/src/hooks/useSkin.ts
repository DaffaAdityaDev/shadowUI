import * as React from "react";
import { useFluidGlassSkin, type FluidGlassSkinOptions } from "./skins/useFluidGlassSkin";
import { usePrimerSkin, type PrimerSkinOptions } from "./skins/usePrimerSkin";

export type SkinOptions = FluidGlassSkinOptions | PrimerSkinOptions | Record<string, any>;

/**
 * Skin Orchestrator Hook.
 * Acts as a dispatcher that detects the active skin and forwards configuration
 * to dedicated custom hooks for each theme (e.g. useFluidGlassSkin, usePrimerSkin).
 * 
 * UI components (Card, Button, etc.) remain 100% "Dumb Components" and do not
 * store theme logic, physics state, or parameter normalizations.
 */
export function useSkin<T extends HTMLElement = HTMLDivElement>(
  skin: string | undefined,
  skinProps?: SkinOptions,
  elementRef?: React.RefObject<T | null>
): void {
  const isFluid = skin === "fluid-glass";
  const isPrimer = skin === "primer" || !skin;

  // Delegate to dedicated theme custom hooks
  useFluidGlassSkin(elementRef ?? { current: null }, skinProps, isFluid);
  usePrimerSkin(elementRef ?? { current: null }, skinProps, isPrimer);

  // Future themes can be registered here without modifying Card or Button:
  // useCyberpunkSkin(elementRef ?? { current: null }, skinProps, skin === "cyberpunk");
}

export * from "./skins";
