"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Phone,
  Calendar,
  AlertTriangle,
  Heart,
  Clock,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useOccupants, useUpdateOccupant } from "@/lib/query/use-occupant";

interface OccupantsListProps {
  organizationId: string;
  shelterId: string;
  refreshTrigger: number;
}

export function OccupantsList({
  organizationId,
  shelterId,
  refreshTrigger,
}: OccupantsListProps) {
  const t = useTranslations("Shelter");
  const {
    data: occupants = [],
    isLoading,
    error,
  } = useOccupants(organizationId, shelterId);
  const { mutate: updateOccupant, isPending: isUpdating } = useUpdateOccupant();

  const handleCheckOut = (occupantId: string) => {
    updateOccupant(
      {
        organizationId,
        shelterId,
        occupantId,
        data: {
          isCheckedIn: false,
          checkOutTime: new Date().toISOString(),
        },
      },
      {
        onSuccess: () => {
          toast.success(t("occupantCheckedOutSuccess"));
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : t("failedToCheckOutOccupant")
          );
        },
      }
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getGenderLabel = (gender?: string) => {
    switch (gender) {
      case "male":
        return t("male");
      case "female":
        return t("female");
      case "other":
        return t("other");
      case "prefer-not-to-say":
        return t("preferNotToSay");
      default:
        return t("notSpecified");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h3 className="text-lg font-medium mb-2">Error loading occupants</h3>
          <p className="text-muted-foreground">{t("failedToFetchOccupants")}</p>
        </CardContent>
      </Card>
    );
  }

  if (occupants.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">{t("noOccupantsYet")}</h3>
          <p className="text-muted-foreground">{t("noOccupantsDescription")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {occupants.map((occupant) => (
        <Card key={occupant.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">
                      {occupant.firstName} {occupant.lastName}
                    </h3>
                    <Badge
                      variant={occupant.isCheckedIn ? "default" : "secondary"}
                    >
                      {occupant.isCheckedIn ? t("checkedIn") : t("checkedOut")}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    {occupant.age && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{occupant.age} years old</span>
                      </div>
                    )}
                    {occupant.gender && (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{getGenderLabel(occupant.gender)}</span>
                      </div>
                    )}
                    {occupant.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{occupant.phone}</span>
                      </div>
                    )}
                    {occupant.emergencyContact && (
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4" />
                        <span>{occupant.emergencyContact}</span>
                      </div>
                    )}
                  </div>

                  {(occupant.medicalConditions || occupant.specialNeeds) && (
                    <div className="space-y-1">
                      {occupant.medicalConditions && (
                        <div className="text-sm">
                          <span className="font-medium">Medical:</span>{" "}
                          {occupant.medicalConditions}
                        </div>
                      )}
                      {occupant.specialNeeds && (
                        <div className="text-sm">
                          <span className="font-medium">Special Needs:</span>{" "}
                          {occupant.specialNeeds}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Checked in: {formatDate(occupant.checkInTime)}</span>
                    {occupant.checkOutTime && (
                      <>
                        <span>•</span>
                        <span>
                          Checked out: {formatDate(occupant.checkOutTime)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                {occupant.isCheckedIn && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCheckOut(occupant.id)}
                    disabled={isUpdating}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="h-3 w-3" />
                    <span>{t("checkOut")}</span>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
