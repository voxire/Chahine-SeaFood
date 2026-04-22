"use client";

import { useEffect, useState } from "react";

import { branches } from "@/data/branches";
import { haversineKm, nearestBranchSlug } from "@/lib/geo";
import { LebanonMap } from "./LebanonMap";

export type BranchesSceneProps = {
  /**
   * Localized branch display names keyed by slug. Passed down from the
   * server section so the client island doesn't need to re-hydrate the
   * entire i18n bundle.
   */
  branchNames: Record<string, string>;
  /** "Nearest to you" label, already localized. */
  nearestLabel: string;
  /** "Finding your nearest branch…" label while geolocation resolves. */
  locatingLabel: string;
  /** "Stylised silhouette, not to scale" caption. */
  mapDisclaimer: string;
};

/**
 * Client island for the BranchesTeaser — handles the optional
 * geolocation lookup, the pulse highlight on the Lebanon silhouette,
 * and the status readout below it.
 *
 * Privacy & UX:
 *   - We ONLY call `navigator.geolocation.getCurrentPosition` after
 *     mount (never on the server), once per page-view.
 *   - If the user denies or the API is unavailable, we silently show
 *     the map in a neutral state with no highlight — we never nag.
 *   - The "locating…" label is only shown while the request is in
 *     flight and `permissions.query` says "prompt". If we can detect
 *     an already-denied state, we skip the label entirely so first-
 *     render doesn't flash a misleading message.
 */
export function BranchesScene({
  branchNames,
  nearestLabel,
  locatingLabel,
  mapDisclaimer,
}: BranchesSceneProps) {
  type Status =
    | { kind: "idle" }
    | { kind: "locating" }
    | { kind: "found"; slug: string; distanceKm: number }
    | { kind: "unavailable" };

  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const geo = navigator.geolocation;
    if (!geo) {
      setStatus({ kind: "unavailable" });
      return;
    }

    // Peek at the permission state where supported, so we can skip the
    // "locating" flash when the user has already denied permission.
    let cancelled = false;
    const start = async () => {
      try {
        const perm = await navigator.permissions?.query({
          name: "geolocation" as PermissionName,
        });
        if (cancelled) return;
        if (perm?.state === "denied") {
          setStatus({ kind: "unavailable" });
          return;
        }
      } catch {
        /* permissions API not supported — fall through and try anyway */
      }

      setStatus({ kind: "locating" });
      geo.getCurrentPosition(
        (pos) => {
          if (cancelled) return;
          const origin = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          const slug = nearestBranchSlug(origin, branches);
          if (!slug) {
            setStatus({ kind: "unavailable" });
            return;
          }
          const match = branches.find((b) => b.slug === slug);
          const distance = match ? haversineKm(origin, match.geo) : 0;
          setStatus({ kind: "found", slug, distanceKm: distance });
        },
        () => {
          if (cancelled) return;
          setStatus({ kind: "unavailable" });
        },
        // 7s is generous — long enough for slow devices, short enough
        // that we don't leave the status label dangling if GPS fails.
        { enableHighAccuracy: false, timeout: 7000, maximumAge: 5 * 60 * 1000 },
      );
    };

    start();
    return () => {
      cancelled = true;
    };
  }, []);

  const highlightSlug = status.kind === "found" ? status.slug : null;

  return (
    <div className="relative flex flex-col items-center">
      {/* Lebanon silhouette + pins. Capped at ~420px so it doesn't fight
          the branch list on desktop. */}
      <div className="relative w-full max-w-[320px]">
        <LebanonMap
          branchNames={branchNames}
          highlightSlug={highlightSlug}
          className="block h-auto w-full text-cs-blue-deep"
        />
        <p className="mt-3 text-center text-[11px] uppercase tracking-[0.2em] text-cs-text-muted">
          {mapDisclaimer}
        </p>
      </div>

      {/* Status readout — swaps between locating / found / unavailable.
          `aria-live="polite"` so screen readers announce the nearest-
          branch match when geolocation resolves. */}
      <div
        role="status"
        aria-live="polite"
        className="mt-4 min-h-[28px] text-center text-sm text-cs-text-muted"
      >
        {status.kind === "locating" && <span>{locatingLabel}</span>}
        {status.kind === "found" && (
          <span>
            <span className="font-display text-xs uppercase tracking-[0.2em] text-cs-gold">
              {nearestLabel}:{" "}
            </span>
            <span className="text-cs-blue-deep">
              {branchNames[status.slug] ?? status.slug}
            </span>
            <span className="ml-2 text-cs-text-muted">
              · {status.distanceKm.toFixed(1)} km
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
