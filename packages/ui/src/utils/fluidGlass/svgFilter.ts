// packages/ui/src/utils/fluidGlass/svgFilter.ts
import { buildDisplacementFilterContent, buildStandardFilterContent } from "./displacementFilter";
import {
  buildChromaticAberrationFilterContent,
  hasChromaticAberration,
} from "./chromaticAberration";
import type { ChromaticAberration } from "./types";

export { buildDisplacementFilterContent, buildStandardFilterContent };
export { buildChromaticAberrationFilterContent, hasChromaticAberration };

/**
 * Factory to build complete SVG elements containing <filter> with the specified filterId.
 * Automatically chooses between single displacement filter or chromatic aberration
 * based on the aberration parameter value.
 */
export function createSvgFilterElement(
  filterId: string,
  mapUrl: string,
  width: number,
  height: number,
  scale: number,
  aberration: ChromaticAberration = 0
): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("aria-hidden", "true");

  const filterContent = hasChromaticAberration(aberration)
    ? buildChromaticAberrationFilterContent(mapUrl, width, height, scale, aberration)
    : buildDisplacementFilterContent(mapUrl, width, height, scale);

  svg.innerHTML = `
    <defs>
      <filter id="${filterId}" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
        ${filterContent}
      </filter>
    </defs>
  `;

  return svg;
}
