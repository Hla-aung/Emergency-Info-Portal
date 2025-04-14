import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useReverseGeocoding = (lat: number, lng: number) => {
  return useQuery({
    queryKey: ["reverse-geocoding", lat, lng],
    queryFn: async () => {
      const res = await axios.get<NominatimResponse>(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      return res.data;
    },
  });
};
