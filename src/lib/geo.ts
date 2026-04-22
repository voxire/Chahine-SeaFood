/**
 * Small geography helpers for the BranchesTeaser. Kept framework-free
 * so both the server (SEO metadata, rendering pin positions) and the
 * client (geolocation nearest-branch detection) share one math pass.
 */

/**
 * Bounding box that tightly contains mainland Lebanon. Numbers are
 * approximate — they're used for projection onto the stylized SVG
 * silhouette, not for real cartography. Tuned so Naqoura, Tripoli,
 * and the Bekaa bulge all land comfortably inside the viewBox.
 */
export const LEBANON_BBOX = {
  latMin: 33.03,
  latMax: 34.72,
  lngMin: 35.07,
  lngMax: 36.66,
} as const;

/**
 * SVG viewBox the silhouette is authored in. Any change here must be
 * mirrored in `components/branches/LebanonMap.tsx` — they're paired.
 */
export const LEBANON_VIEWBOX = { width: 300, height: 480 } as const;

/**
 * Project a (lat, lng) pair onto the Lebanon SVG viewBox using a flat
 * linear map. Accurate enough for placing a ~8px branch dot at the
 * scale we render the silhouette.
 */
export function projectToLebanon(lat: number, lng: number): { x: number; y: number } {
  const { latMin, latMax, lngMin, lngMax } = LEBANON_BBOX;
  const { width, height } = LEBANON_VIEWBOX;
  const x = ((lng - lngMin) / (lngMax - lngMin)) * width;
  // SVG y grows downward; flip so higher lat is higher on screen.
  const y = ((latMax - lat) / (latMax - latMin)) * height;
  return { x, y };
}

/**
 * Great-circle distance between two points on Earth, in kilometres.
 * The Haversine formula. Good to the nearest km at Lebanon's scale.
 */
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371; // mean Earth radius, km
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

/**
 * Return the branch slug whose coordinates are closest to `origin`.
 * `branches` is any array with `slug` and a `geo` sub-object — typed
 * structurally so both the production `Branch` type and a mocked
 * subset can be passed in.
 */
export function nearestBranchSlug<
  B extends { slug: string; geo: { lat: number; lng: number } },
>(origin: { lat: number; lng: number }, list: readonly B[]): string | null {
  if (list.length === 0) return null;
  let best = list[0];
  let bestD = haversineKm(origin, list[0].geo);
  for (let i = 1; i < list.length; i++) {
    const d = haversineKm(origin, list[i].geo);
    if (d < bestD) {
      bestD = d;
      best = list[i];
    }
  }
  return best.slug;
}
