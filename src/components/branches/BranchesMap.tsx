"use client";

import dynamic from "next/dynamic";
import clsx from "clsx";

import type { Locale } from "../../../i18n";

type Props = {
  locale: Locale;
  /** Pre-translated branch labels, keyed by slug. Passed in from the server
   *  page so the inner Leaflet component doesn't need its own translation
   *  context (next-intl server hooks don't work inside client components). */
  branchLabels: Record<string, string>;
  labels: {
    orderOnWhatsapp: string;
    openOnMap: string;
    phonePending: string;
  };
  className?: string;
};

/**
 * Dynamically imported map. Leaflet touches `window` at module import time,
 * so we must disable SSR. The outer wrapper is a server-renderable-but-
 * client-component shell that handles layout + loading state; the inner
 * file (BranchesMap.leaflet.tsx) is only loaded in the browser.
 */
const MapInner = dynamic(
  () =>
    import("./BranchesMap.leaflet").then((m) => m.BranchesMapLeaflet),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-cs-surface-2">
        <span className="text-sm text-cs-text-muted">Loading map…</span>
      </div>
    ),
  },
);

export function BranchesMap(props: Props) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-xl border border-cs-text/10 bg-cs-surface-2",
        props.className,
      )}
    >
      <MapInner {...props} />
    </div>
  );
}
