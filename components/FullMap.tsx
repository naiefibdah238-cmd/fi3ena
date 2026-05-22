"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, MutableRefObject } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import { Store, Category, CATEGORY_COLORS } from "@/lib/utils";

function createCategoryIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:32px;height:32px;
      background:${color};
      border:3px solid white;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
  });
}

const userDotIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:22px;height:22px;">
      <div style="
        position:absolute;inset:0;
        background:#3B82F6;opacity:0.25;
        border-radius:50%;
        animation:gps-pulse 1.8s ease-out infinite;
      "></div>
      <div style="
        position:absolute;top:50%;left:50%;
        transform:translate(-50%,-50%);
        width:14px;height:14px;
        background:#2563EB;
        border:3px solid white;
        border-radius:50%;
        box-shadow:0 2px 6px rgba(37,99,235,0.5);
      "></div>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function FlyController({
  mapRef,
}: {
  mapRef: MutableRefObject<{ flyTo: (lat: number, lng: number) => void } | null>;
}) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = { flyTo: (lat, lng) => map.flyTo([lat, lng], 17) };
  }, [map, mapRef]);
  return null;
}

interface Props {
  stores: Store[];
  categories: Category[];
  onSelectStore: (store: Store) => void;
  userLocation: { coords: [number, number]; accuracy: number } | null;
  mapRef: MutableRefObject<{ flyTo: (lat: number, lng: number) => void } | null>;
}

const UMM_AL_FAHM: [number, number] = [32.5167, 35.1531];

export default function FullMap({
  stores,
  onSelectStore,
  userLocation,
  mapRef,
}: Props) {
  return (
    <>
      <style>{`
        @keyframes gps-pulse {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(3.5); opacity: 0; }
        }
      `}</style>

      <MapContainer
        center={UMM_AL_FAHM}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyController mapRef={mapRef} />

        {stores.map((store) => {
          const color = CATEGORY_COLORS[store.category] ?? "#C75B3C";
          return (
            <Marker
              key={store.id}
              position={[store.lat, store.lng]}
              icon={createCategoryIcon(color)}
              eventHandlers={{ click: () => onSelectStore(store) }}
            />
          );
        })}

        {userLocation && (
          <>
            {/* Accuracy radius circle */}
            <Circle
              center={userLocation.coords}
              radius={userLocation.accuracy}
              pathOptions={{
                color: "#3B82F6",
                fillColor: "#3B82F6",
                fillOpacity: 0.08,
                weight: 1,
              }}
            />
            {/* Pulsing user dot */}
            <Marker
              position={userLocation.coords}
              icon={userDotIcon}
              zIndexOffset={1000}
            />
          </>
        )}
      </MapContainer>
    </>
  );
}
