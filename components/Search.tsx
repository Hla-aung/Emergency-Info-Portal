"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, ChevronsUpDown, Check } from "lucide-react";
import { format } from "date-fns";
import { useSearchEarthquakes } from "@/lib/query/use-earthquake";
import EarthquakeDetails from "@/components/earthquake/earthquake-details";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L, { LatLngTuple, Map } from "leaflet";
import { generateCircleIcon } from "./MainMap";
import worldCountries from "world-countries/countries.json";
import { cn } from "@/lib/utils";
import { notoColorEmoji } from "@/app/fonts/fonts";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandEmpty,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
export default function SearchPage() {
  const mapRef = useRef<Map>(null);
  const t = useTranslations("SearchPage");
  const [country, setCountry] = useState<string>("");
  const [center, setCenter] = useState<LatLngTuple>([20, 0]);

  const searchQuery = useMemo(() => {
    const lat = worldCountries?.find((c) => c.name.common === country)
      ?.latlng[0];
    const lng = worldCountries?.find((c) => c.name.common === country)
      ?.latlng[1];

    if (!lat || !lng) {
      return "";
    }

    setCenter([lat, lng]);

    return country ? `latitude=${lat}&longitude=${lng}&maxradiuskm=200` : "";
  }, [country]);

  const { data, isPending } = useSearchEarthquakes(searchQuery);

  return (
    <div className="w-full relative min-h-dvh">
      <div className="absolute inset-x-0 top-0 p-5 w-full z-[500]">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              {t("title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {country ? (
                      <div className="flex items-center gap-2">
                        {/* <span className={cn(notoColorEmoji.className)}>
                          {
                            worldCountries.find(
                              (c) => c.name.common === country
                            )?.flag
                          }
                        </span> */}
                        {country}
                      </div>
                    ) : (
                      "Select a country"
                    )}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="z-[500]">
                  <Command value={country} onValueChange={setCountry}>
                    <CommandInput placeholder="Search for a country" />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {worldCountries.map((c) => (
                          <CommandItem key={c.cca2} value={c.name.common}>
                            <div className="flex items-center gap-2">
                              {/* <span className={cn(notoColorEmoji.className)}>
                                {c.flag}
                              </span> */}
                              {c.name.common}
                            </div>
                            {c.name.common === country && (
                              <Check className="ml-auto" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>
      </div>

      <MapContainer
        center={center}
        zoom={3}
        style={{
          height: "100dvh",
          width: "100%",
        }}
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={data}
          pointToLayer={(feature, latlng) => {
            return L.marker(latlng, {
              icon: generateCircleIcon({ magnitude: feature.properties.mag }),
            });
          }}
          onEachFeature={(feature, layer) => {
            layer.bindPopup(feature.properties.title);
          }}
        />
      </MapContainer>
    </div>
  );
}
