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
import { Info, Locate, TestTube } from "lucide-react";
import { format } from "date-fns";
import EarthquakeDrawer from "./earthquake/earthquake-drawer";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

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
  const color =
    magnitude < 2
      ? "#22c55e"
      : magnitude < 4
      ? "#eab308"
      : magnitude < 6
      ? "#f97316"
      : "#ef4444";
  const iconUrl =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
    <svg width="${size * 2}" height="${size * 2}" viewBox="0 0 ${size * 2} ${
      size * 2
    }" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size}" cy="${size}" r="${size}" fill="${color}" fill-opacity="0.5" stroke="white" stroke-width="0.5"/>
    </svg>
  `);

  return L.icon({
    iconUrl: iconUrl,
    iconSize: [size * 2, size * 2],
    iconAnchor: [size, size],
    popupAnchor: [0, -size],
  });
};

export default function MainMap() {
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

  const handleLocate = ({ maxZoom = 3 }: { maxZoom?: number }) => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.locate({
        setView: true,
        maxZoom: maxZoom,
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

        // Send notifications for the last 3 new earthquakes
        newQuakes.slice(0, 3).forEach((quake) => {
          sendPushNotification(quake);
        });
      }

      setPreviousQuakes(data.features);
      setEarthquakes(data.features);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    handleLocate({});
  }, [mapRef.current]);

  if (isPending) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full relative min-h-screen">
      <MapContainer
        center={center}
        zoom={3}
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
      </MapContainer>
      <EarthquakeDrawer />
      <Button
        size="icon"
        className="absolute bottom-5 right-5 z-[500] rounded-full"
        onClick={() => handleLocate({ maxZoom: 16 })}
      >
        <Locate />
      </Button>
      <Button
        size="icon"
        className="absolute bottom-28 right-5 z-[500] rounded-full"
        onClick={() =>
          sendPushNotification({
            properties: {
              mag: 5,
              place: "109 km ESE of Kimbe, Papua New Guinea",
              time: 1744188276904,

              felt: null,

              alert: null,

              tsunami: 0,
              sig: 385,

              title: "M 5.0 - 109 km ESE of Kimbe, Papua New Guinea",
            },
            geometry: {
              coordinates: [150.9665, -6.0935, 10],
            },
            id: "us6000q4w4",
          })
        }
      >
        <TestTube />
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-5 right-5 z-[500] rounded-full"
          >
            <Info />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-fit z-[500]">
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span
                className={`inline-block size-3 rounded-full bg-green-500`}
              />
              <p>Magnitude &lt; 2</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block size-3 rounded-full bg-yellow-500`}
              />
              <p>Magnitude &lt; 4</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block size-3 rounded-full bg-orange-500`}
              />
              <p>Magnitude &lt; 6</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-block size-3 rounded-full bg-red-500`} />
              <p>Magnitude &gt;= 6</p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
