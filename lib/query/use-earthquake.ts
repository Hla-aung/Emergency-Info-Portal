import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetEarthquakes = () => {
  return useQuery<EarthquakeGeoJSON>({
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
};
