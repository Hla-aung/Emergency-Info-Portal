"use client";

import { useShelters } from "@/lib/query/use-shelter";
import { generateMarkerIcon } from "@/components/MainMap";
import { useTranslations } from "next-intl";
import React from "react";
import { Marker, Popup } from "react-leaflet";
import { Check, X } from "lucide-react";
import ShelterActions from "./shelter-actions";

const ShelterMarkers = () => {
  const t = useTranslations("Shelter");

  const { data: shelters } = useShelters();

  return (
    <>
      {shelters?.map((shelter) => (
        <Marker
          key={shelter.id}
          position={[shelter.latitude, shelter.longitude]}
          icon={generateMarkerIcon({ color: "#22c55e" })}
        >
          <Popup>
            <div className="flex flex-col ">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold flex items-center gap-1">
                  {shelter.name} ({t(shelter.type)})
                  {shelter.isAvailable ? (
                    <Check className="text-green-500 size-4" />
                  ) : (
                    <X className="text-red-500 size-4" />
                  )}
                </h3>
              </div>
              <p className="!m-0 !my-0.5">
                {t("location")}: {shelter.location}
              </p>
              <p className="!m-0 !my-0.5">
                {t("phone")}: {shelter.phone}
              </p>
              <p className="!m-0 !my-0.5">
                {t("contact_name")}: {shelter.contactName}
              </p>
              <p className="!m-0 !my-0.5">
                {t("contact_phone")}: {shelter.contactPhone}
              </p>
              <p className="!m-0 !my-0.5">
                {t("capacity")}: {shelter.capacity}
              </p>
              <p className="!m-0 !my-0.5">
                {t("resources")}:{" "}
                {shelter.resourcesAvailable
                  ?.map((resource) => t(resource))
                  .join(", ")}
              </p>
              <p className="!m-0 !my-0.5">
                {t("notes")}: {shelter.notes}
              </p>
              <ShelterActions shelter={shelter} />
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default ShelterMarkers;
