"use client";

import { useEffect, MutableRefObject } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  CircleMarker,
  useMap,
} from "react-leaflet";
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

function FlyController({
  mapRef,
}: {
  mapRef: MutableRefObject<{ flyTo: (lat: number, lng: number) => void } | null>;
}) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = {
      flyTo: (lat, lng) => map.flyTo([lat, lng], 16),
    };
  }, [map, mapRef]);
  return null;
}

interface Props {
  stores: Store[];
  categories: Category[];
  onSelectStore: (store: Store) => void;
  userLocation: [number, number] | null;
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
        const markerIcon = createCategoryIcon(color);
        return (
          <Marker
            key={store.id}
            position={[store.lat, store.lng]}
            icon={markerIcon}
            eventHandlers={{ click: () => onSelectStore(store) }}
          />
        );
      })}

      {userLocation && (
        <CircleMarker
          center={userLocation}
          radius={10}
          pathOptions={{
            color: "#3B82F6",
            fillColor: "#60A5FA",
            fillOpacity: 0.8,
          }}
        />
      )}
    </MapContainer>
  );
}
