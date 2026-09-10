// packages/ui/src/utils/fluidGlass/sdf.ts

export interface SDF2DResult {
  /**
   * Standard Signed Distance Field value.
   * < 0 inside the shape, 0 at outline boundary, > 0 outside.
   */
  signedDistance: number;
  /**
   * Inward distance from the edge boundary (0 at outer edge, positive towards center).
   * Negative if outside the shape.
   */
  distFromEdge: number;
  /**
   * Inward 2D normal unit vector pointing towards center [dirX, dirY].
   */
  dirX: number;
  dirY: number;
  /**
   * Outward 2D gradient vector pointing away from center.
   */
  gradX: number;
  gradY: number;
}

/**
 * Evaluates Inigo Quilez 2D Rounded Box (Squircle) Signed Distance Field & Gradient.
 *
 * Formula:
 *   q = |p| - (b - r)
 *   d = length(max(q, 0)) + min(max(qx, qy), 0) - r
 *
 * Yields continuous distances across curved corners and straight edges,
 * as well as curvature normal vectors for optical refraction and specular lighting.
 *
 * @param x Pixel X coordinate (0 to width)
 * @param y Pixel Y coordinate (0 to height)
 * @param halfW Half canvas width (width / 2)
 * @param halfH Half canvas height (height / 2)
 * @param radius Squircle corner radius
 */
export function evalRoundedBoxSDF(
  x: number,
  y: number,
  halfW: number,
  halfH: number,
  radius: number
): SDF2DResult {
  // Corner radius capped at half of smallest dimension
  const effectiveR = Math.max(0, Math.min(radius, halfW, halfH));
  const innerW = halfW - effectiveR;
  const innerH = halfH - effectiveR;

  // Coordinates relative to center (symmetrical quadrant)
  const px = Math.abs(x - halfW + 0.5);
  const py = Math.abs(y - halfH + 0.5);

  const qx = px - innerW;
  const qy = py - innerH;

  const dxMax = Math.max(0, qx);
  const dyMax = Math.max(0, qy);
  const distOutsideInner = Math.hypot(dxMax, dyMax);

  let distFromEdge = 0;
  let dirX = 0;
  let dirY = 0;

  if (distOutsideInner > 0.0001) {
    // Continuous along curved corners and outer straight edges
    distFromEdge = effectiveR - distOutsideInner;
    dirX = -(dxMax / distOutsideInner);
    dirY = -(dyMax / distOutsideInner);
  } else {
    // Inside the flat box area
    distFromEdge = effectiveR + Math.min(-qx, -qy);
    if (-qx < -qy) {
      dirX = -1;
      dirY = 0;
    } else {
      dirX = 0;
      dirY = -1;
    }
  }

  // Adjust vector directions based on original quadrant
  if (x < halfW) dirX = -dirX;
  if (y < halfH) dirY = -dirY;

  return {
    signedDistance: -distFromEdge,
    distFromEdge,
    dirX,
    dirY,
    gradX: -dirX,
    gradY: -dirY,
  };
}
