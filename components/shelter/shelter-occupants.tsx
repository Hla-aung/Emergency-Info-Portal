"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus } from "lucide-react";
import { AddOccupantDialog } from "./add-occupant-dialog";
import { OccupantsList } from "./occupants-list";
import { useTranslations } from "next-intl";

interface ShelterOccupantsProps {
  organizationId: string;
  shelterId: string;
  shelterName: string;
  shelterCapacity: number;
  currentOccupancy: number;
}

export function ShelterOccupants({
  organizationId,
  shelterId,
  shelterName,
  shelterCapacity,
  currentOccupancy,
}: ShelterOccupantsProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const t = useTranslations("Shelter");

  const handleOccupantAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const occupancyPercentage = Math.round(
    (currentOccupancy / shelterCapacity) * 100
  );
  const isAtCapacity = currentOccupancy >= shelterCapacity;
  const isNearCapacity = occupancyPercentage >= 80;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <CardTitle>{t("shelterOccupants")}</CardTitle>
          </div>
          <AddOccupantDialog
            organizationId={organizationId}
            shelterId={shelterId}
            onOccupantAdded={handleOccupantAdded}
            shelterCapacity={shelterCapacity}
            currentOccupancy={currentOccupancy}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">{currentOccupancy}</span>{" "}
              {t("ofOccupants")}{" "}
              <span className="font-medium">{shelterCapacity}</span>{" "}
              {t("occupants")}
            </div>
            <Badge
              variant={
                isAtCapacity
                  ? "destructive"
                  : isNearCapacity
                  ? "secondary"
                  : "default"
              }
            >
              {occupancyPercentage}% {t("occupantsFull")}
            </Badge>
          </div>

          {isAtCapacity && (
            <div className="text-sm text-red-600 font-medium">
              {t("shelterAtFullCapacity")}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <OccupantsList
          organizationId={organizationId}
          shelterId={shelterId}
          refreshTrigger={refreshTrigger}
        />
      </CardContent>
    </Card>
  );
}
