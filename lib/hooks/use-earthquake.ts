import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

export const useGetEarthquakes = () => {
  const [earthquakes, setEarthquakes] = useState<EarthquakeGeoJSON | null>(
    null
  );

  useEffect(() => {
    // Register background sync
    if ("serviceWorker" in navigator && "SyncManager" in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.sync.register("fetch-earthquakes");
      });
    }

    // Listen for messages from service worker
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "EARTHQUAKE_UPDATE") {
        setEarthquakes(event.data.data);
      }
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);
    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, []);

  const query = useQuery<EarthquakeGeoJSON>({
    queryKey: ["earthquakes"],
    queryFn: async () => {
      const res = await axios.get<EarthquakeGeoJSON>(
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson"
      );
      return res.data;
    },
    refetchInterval: 1000 * 60 * 1, // 1 minute
    staleTime: 1000 * 30, // 30 seconds
  });

  return {
    ...query,
    data: earthquakes || query.data,
  };
};
