// packages/ui/src/utils/fluidGlass/displacementFilter.ts

/**
 * Builds standard SVG filter content (single monochromatic refraction).
 * Highly lightweight (only 2 nodes: feImage + feDisplacementMap) with maximal GPU performance.
 */
export function buildDisplacementFilterContent(
  mapUrl: string,
  width: number,
  height: number,
  scale: number
): string {
  return `
    <feImage href="${mapUrl}" result="displacementMap" width="${width}" height="${height}" />
    <feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="${scale}" xChannelSelector="R" yChannelSelector="G" />
  `.trim();
}

/**
 * Backward-compatible alias for buildDisplacementFilterContent.
 */
export const buildStandardFilterContent = buildDisplacementFilterContent;
