// Define the Earthquake type
interface Earthquake {
  id: string;
  properties: {
    mag: number;
    time: number;
    place: string;
    title: string;
    alert?: string | null;
    tsunami?: number;
    felt?: number | null;
    sig?: number;
  };
  geometry: {
    coordinates: [number, number, number]; // [longitude, latitude, depth]
  };
}
