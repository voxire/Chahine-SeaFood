"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L, { type LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

import type { Locale } from "../../../i18n";
import {
  branches,
  branchDistrict,
  branchMapsUrl,
  formatPhone,
  type Branch,
} from "@/data/branches";
import { buildContactLink } from "@/lib/whatsapp";

type Props = {
  locale: Locale;
  branchLabels: Record<string, string>;
  labels: {
    orderOnWhatsapp: string;
    openOnMap: string;
    phonePending: string;
  };
};

/**
 * Brand pin — cobalt teardrop with a warm-gold center dot. Rendered as an
 * SVG inside a Leaflet divIcon so the color stays crisp at any zoom and we
 * don't ship a binary icon.
 */
const BRAND_PIN_HTML = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42" aria-hidden="true">
  <path d="M16 0C7.2 0 0 7 0 15.7 0 26.5 14 40.6 15.3 41.8a1 1 0 0 0 1.4 0C18 40.6 32 26.5 32 15.7 32 7 24.8 0 16 0Z" fill="#0045A2"/>
  <circle cx="16" cy="15" r="6" fill="#E5B762"/>
</svg>
`;

const brandIcon = L.divIcon({
  className: "cs-branch-pin",
  html: BRAND_PIN_HTML,
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -40],
});

/** Fit the map to the supplied bounds once after mount. Re-runs if bounds change. */
function FitBounds({ bounds }: { bounds: LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, bounds]);
  return null;
}

export function BranchesMapLeaflet({
  locale,
  branchLabels,
  labels,
}: Props) {
  const bounds = useMemo<LatLngBoundsExpression>(
    () => branches.map((b) => [b.geo.lat, b.geo.lng]),
    [],
  );

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [40, 40] }}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds bounds={bounds} />

      {branches.map((branch) => (
        <Marker
          key={branch.slug}
          position={[branch.geo.lat, branch.geo.lng]}
          icon={brandIcon}
        >
          <Popup className="cs-popup">
            <BranchPopup
              branch={branch}
              locale={locale}
              name={branchLabels[branch.slug] ?? branch.slug}
              labels={labels}
            />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

type PopupProps = {
  branch: Branch;
  locale: Locale;
  name: string;
  labels: Props["labels"];
};

function BranchPopup({ branch, locale, name, labels }: PopupProps) {
  const hasPhone = Boolean(branch.phone);
  const district = branchDistrict(branch, locale);
  const mapsUrl = branchMapsUrl(branch, locale);

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="cs-popup-body">
      <p className="cs-popup-name">{name}</p>
      <p className="cs-popup-district">{district}</p>

      {hasPhone ? (
        <p className="cs-popup-phone" dir="ltr">
          {formatPhone(branch.phone)}
        </p>
      ) : (
        <p className="cs-popup-district">{labels.phonePending}</p>
      )}

      <div className="cs-popup-actions">
        {hasPhone ? (
          <a
            href={buildContactLink(branch.phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="cs-popup-cta cs-popup-cta--primary"
          >
            {labels.orderOnWhatsapp}
          </a>
        ) : null}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cs-popup-cta cs-popup-cta--ghost"
        >
          {labels.openOnMap}
        </a>
      </div>
    </div>
  );
}
