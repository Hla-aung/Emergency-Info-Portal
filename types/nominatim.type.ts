interface NominatimResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  place_rank: string;
  category: string;
  type: string;
  importance: string;
  addresstype: string;
  display_name: string;
  name: string;
  address: Partial<{
    house_number: string;
    house_name: string;
    road: string;
    village: string;
    state_district: string;
    state: string;
    postcode: string;
    city: string;
    town: string;
    country: string;
    country_code: string;
  }>;
  boundingbox: string[];
}
