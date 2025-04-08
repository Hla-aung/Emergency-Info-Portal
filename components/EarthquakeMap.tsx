"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import L, { LatLngTuple, Map } from "leaflet";
import { useGetEarthquakes } from "../hooks/useEarthquake";
import LoadingScreen from "./common/loading-screen";
import { Button } from "@/components/ui/button";
import { Info, Locate } from "lucide-react";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

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

const generateCircleIcon = ({ magnitude }: { magnitude: number }) => {
  const size = Math.pow(2, magnitude) / 2;
  const iconUrl =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
    <svg width="${size * 2}" height="${size * 2}" viewBox="0 0 ${size * 2} ${
      size * 2
    }" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size}" cy="${size}" r="${size}" fill="red" fill-opacity="0.2" stroke="white" stroke-width="0.5"/>
    </svg>
  `);

  return L.icon({
    iconUrl: iconUrl,
    iconSize: [size * 2, size * 2],
    iconAnchor: [size, size],
    popupAnchor: [0, -size],
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
  const mapRef = useRef<Map>(null);
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

  const handleLocate = () => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.locate({
        setView: true,
        maxZoom: 16,
      });

      map.on("locationfound", (e) => {
        setCenter([e.latlng.lat, e.latlng.lng]);
      });
    }
  };

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
    handleLocate();
  }, [mapRef.current]);

  if (isPending) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full relative min-h-screen">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "99vh", width: "100%" }}
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomleft" />
        <Marker
          key={"current-location"}
          position={center}
          icon={generateMarkerIcon({ color: "#2563eb" })}
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
            icon={generateCircleIcon({ magnitude: earthquake.properties.mag })}
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
        <Button
          size="icon"
          className="absolute bottom-5 right-5 z-[500] rounded-full"
          onClick={handleLocate}
        >
          <Locate />
        </Button>
        <div className="absolute top-5 right-5 z-[500]">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full"
                >
                  <Info />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="z-[500]" align="end">
                <div className="space-y-1">
                  <h1 className="font-semibold">{data?.metadata?.title}</h1>
                  <p className="text-secondary">
                    {format(data?.metadata?.generated, "PPpp")}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </MapContainer>
    </div>
  );
}
