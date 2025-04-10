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
    type: "Point";
  };
  type: "Feature";
}

interface EarthquakeGeoJSON {
  type: "FeatureCollection";
  features: Earthquake[];
  metadata: {
    generated: number;
    url: string;
    title: string;
    api: string;
    count: number;
    status: string;
  };
  bbox: [number, number, number, number, number, number];
}
