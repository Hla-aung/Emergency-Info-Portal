"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  useMapEvents,
  GeoJSON,
} from "react-leaflet";
import L, { LatLngTuple, Map } from "leaflet";
import { useGetEarthquakes } from "@/lib/query/use-earthquake";
import LoadingScreen from "./common/loading-screen";
import { Button } from "@/components/ui/button";
import { Filter, Info, Locate, TestTube } from "lucide-react";
import EarthquakeDrawer from "./earthquake/earthquake-drawer";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import ShelterDialog from "./shelter/shelter-dialog";
import { useTranslations } from "next-intl";
import ShelterMarkers from "./shelter/shelter-markers";
import plateBoundaries from "@/data/plate_boundaries.json";
import { useOrganizationContext } from "@/context/organization-context";
import { useSearchParams } from "next/navigation";
import AddDamageReportDialog from "./damage-reports/add-damage-report-dialog";
import AddDialog from "./common/add-dialog";
import DamageReportsMarkers from "./damage-reports/damage-reports-markers";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "./ui/dropdown-menu";

export const generateMarkerIcon = ({
  color = "#E74C3C",
}: {
  color?: string;
}) => {
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

export const generateCircleIcon = ({ magnitude }: { magnitude: number }) => {
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

const MapClickHandler = ({
  onClick,
}: {
  onClick: (latlng: LatLngTuple) => void;
}) => {
  useMapEvents({
    click: (e) => {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

export default function MainMap() {
  const mapRef = useRef<Map>(null);
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const { currentOrganization } = useOrganizationContext();
  const [center, setCenter] = useState<LatLngTuple>([21.975, 96.083]);
  const [clickedPosition, setClickedPosition] = useState<LatLngTuple | null>(
    null
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isShelterDialogOpen, setIsShelterDialogOpen] = useState(false);
  const [isDamageReportDialogOpen, setIsDamageReportDialogOpen] =
    useState(false);

  const [showShelters, setShowShelters] = useState(true);
  const [showDamageReports, setShowDamageReports] = useState(true);

  const t = useTranslations("HomePage");

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
    handleLocate({});
  }, [mapRef.current]);

  const handleMapClick = (latlng: LatLngTuple) => {
    setClickedPosition(latlng);
    setIsAddDialogOpen(true);
    //setIsShelterDialogOpen(true);
  };

  if (isPending) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full relative min-h-dvh">
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
        <GeoJSON
          data={plateBoundaries as GeoJSON.GeoJsonObject}
          attribution="Plate Boundaries"
          style={{
            color: "red",
            weight: 1,
            opacity: 0.5,
          }}
          interactive={false}
        />
        <ZoomControl position="topleft" />
        <MapClickHandler onClick={handleMapClick} />
        {/* {clickedPosition && (
          <Marker
            position={clickedPosition}
            icon={generateMarkerIcon({ color: "#22c55e" })}
          >
            <Popup>
              <div>
                <h3 className="font-bold mb-3">
                  {t("add_shelter")} / {t("add_damage_report")}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsShelterDialogOpen(true)}
                >
                  {t("add_shelter")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDamageReportDialogOpen(true)}
                >
                  {t("add_damage_report")}
                </Button>
              </div>
            </Popup>
          </Marker>
        )} */}
        {showShelters && <ShelterMarkers />}
        {showDamageReports && <DamageReportsMarkers />}
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
      </MapContainer>
      {/* <EarthquakeDrawer /> */}
      <Button
        size="icon"
        className="absolute bottom-10 right-5 z-[500] rounded-full"
        onClick={() => handleLocate({ maxZoom: 10 })}
      >
        <Locate />
      </Button>
      {/* <Popover>
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
      </Popover> */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-5 right-5 z-[500] rounded-full"
          >
            <Filter />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-fit z-[500]">
          <DropdownMenuCheckboxItem
            checked={showShelters}
            onCheckedChange={setShowShelters}
          >
            Show Shelters
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showDamageReports}
            onCheckedChange={setShowDamageReports}
          >
            Show Damage Reports
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {clickedPosition && (
        <AddDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          setAddShelter={setIsShelterDialogOpen}
          setAddDamageReport={setIsDamageReportDialogOpen}
        />
      )}
      {clickedPosition && currentOrganization?.id && (
        <ShelterDialog
          open={isShelterDialogOpen}
          onOpenChange={setIsShelterDialogOpen}
          position={clickedPosition}
        />
      )}
      {clickedPosition && isDamageReportDialogOpen && (
        <AddDamageReportDialog
          open={isDamageReportDialogOpen}
          onOpenChange={setIsDamageReportDialogOpen}
          position={clickedPosition}
        />
      )}
      {q === "add-shelter" && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[200px] bg-primary z-[500] rounded border border-primary/20 p-2">
          <p className=" text-xs text-primary-foreground">
            Click on the map to select a location and add a new shelter
          </p>
        </div>
      )}
    </div>
  );
}
