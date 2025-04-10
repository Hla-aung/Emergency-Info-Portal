"use client";

import { useShelters } from "@/lib/hooks/use-shelter";
import { generateMarkerIcon } from "@/components/MainMap";
import { useTranslations } from "next-intl";
import React from "react";
import { Marker, Popup } from "react-leaflet";
import { Check, X } from "lucide-react";

const ShelterMarkers = () => {
  const t = useTranslations("Shelter");

  const {
    data: shelters,
    isPending: isSheltersPending,
    isSuccess: isSheltersSuccess,
  } = useShelters();

  return (
    <>
      {shelters?.map((shelter) => (
        <Marker
          key={shelter.id}
          position={[shelter.latitude, shelter.longitude]}
          icon={generateMarkerIcon({ color: "#22c55e" })}
        >
          <Popup>
            <div className="flex flex-col">
              <h3 className="font-bold flex items-center gap-1">
                {shelter.isAvailable ? (
                  <Check className="text-green-500 size-4" />
                ) : (
                  <X className="text-red-500 size-4" />
                )}
                {shelter.name} ({t(shelter.type)})
              </h3>
              <p className="!m-0">
                {t("location")}: {shelter.location}
              </p>
              <p className="!m-0">
                {t("phone")}: {shelter.phone}
              </p>
              <p className="!m-0">
                {t("contact_name")}: {shelter.contactName}
              </p>
              <p className="!m-0">
                {t("contact_phone")}: {shelter.contactPhone}
              </p>
              <p className="!m-0">
                {t("capacity")}: {shelter.capacity}
              </p>
              <p className="!m-0">
                {t("resources")}:{" "}
                {shelter.resourcesAvailable
                  ?.map((resource) => t(resource))
                  .join(", ")}
              </p>
              <p className="!m-0">
                {t("notes")}: {shelter.notes}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default ShelterMarkers;
