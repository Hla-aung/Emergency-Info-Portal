import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetEarthquakes = () => {
  return useQuery({
    queryKey: ["earthquakes"],
    queryFn: async () => {
      const res = await axios.get(
        `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2025-03-01&minlatitude=9&maxlatitude=30&minlongitude=90&maxlongitude=110`
      );
      return res.data;
    },
    refetchInterval: 1000 * 60 * 1,
  });
};
