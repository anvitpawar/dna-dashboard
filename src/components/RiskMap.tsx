"use client";

import React from "react";
import { MapContainer, TileLayer, Circle, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const cityCoordinates: Record<string, [number, number]> = {
  Delhi: [28.6139, 77.209],
  Mumbai: [19.076, 72.8777],
  Bangalore: [12.9716, 77.5946],
};

interface RiskMapProps {
  riskCities: { city: string; probability: number }[];
}

export default function RiskMap({ riskCities }: RiskMapProps) {
  return (
    <MapContainer
      center={[22.9734, 78.6569]}
      zoom={5}
      className="h-[500px] w-full rounded-xl"
      attributionControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {riskCities.map((city, idx) => (
        <Circle
          key={idx}
          center={cityCoordinates[city.city]}
          radius={city.probability * 1000}
          pathOptions={{ fillColor: "red", color: "red", fillOpacity: 0.4 }}
        >
          <Tooltip>
            {city.city}: {city.probability}%
          </Tooltip>
        </Circle>
      ))}
    </MapContainer>
  );
}