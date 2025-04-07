"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { LatLngTuple } from "leaflet";
import { useGetEarthquakes } from "../hooks/useEarthquake";
import LoadingScreen from "./common/loading-screen";

const generateMarkerIcon = ({ color = "#E74C3C" }: { color?: string }) => {
  const iconUrl =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
    <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.4 0 0 5.4 0 12C0 21 12 36 12 36C12 36 24 21 24 12C24 5.4 18.6 0 12 0Z" fill="${color}"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>
  `);

  return L.icon({
    iconUrl: iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

export interface Earthquake {
  id: string;
  properties: {
    title: string;
    mag: number;
    time: number;
  };
  geometry: {
    coordinates: [number, number, number];
  };
}

export default function EarthquakeMap() {
  const [center, setCenter] = useState<LatLngTuple>([21.975, 96.083]);
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [previousQuakes, setPreviousQuakes] = useState<Earthquake[]>([]);

  const sendPushNotification = async (earthquake: Earthquake) => {
    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration.active) {
        registration.active.postMessage({
          type: "PUSH",
          title: "New Earthquake Alert!",
          body: `${earthquake.properties.title} - Magnitude: ${earthquake.properties.mag}`,
          url: "/",
        });
      }
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  };

  const { data, isPending, isSuccess } = useGetEarthquakes();

  useEffect(() => {
    if (isSuccess) {
      if (previousQuakes.length > 0) {
        const newQuakes = data.features.filter((quake) => {
          return !previousQuakes.some((oldQuake) => oldQuake.id === quake.id);
        });

        newQuakes.forEach((quake) => {
          sendPushNotification(quake);
        });
      }

      setPreviousQuakes(data.features);
      setEarthquakes(data.features);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter([position.coords.latitude, position.coords.longitude]);
      });
    } else {
      setCenter([21.975, 96.083]);
    }
  }, []);

  if (isPending) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen w-full">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "99vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          key={"current-location"}
          position={center}
          icon={generateMarkerIcon({ color: "#1c31d4" })}
        >
          <Popup>
            <div>
              <h3 className="font-bold">Your current location</h3>
            </div>
          </Popup>
        </Marker>
        {earthquakes?.map((earthquake) => (
          <Marker
            key={earthquake.id}
            position={[
              earthquake.geometry.coordinates[1],
              earthquake.geometry.coordinates[0],
            ]}
            icon={generateMarkerIcon({ color: "#E74C3C" })}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{earthquake.properties.title}</h3>
                <p>Magnitude: {earthquake.properties.mag}</p>
                <p>
                  Time: {new Date(earthquake.properties.time).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
