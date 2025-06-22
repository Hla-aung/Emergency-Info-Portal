"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Edit,
  Trash2,
} from "lucide-react";
import { useOrganizationContext } from "@/context/organization-context";
import { ShelterOccupants } from "@/components/shelter/shelter-occupants";
import ShelterEditDialog from "@/components/shelter/shelter-edit-dialog";
import ShelterDeleteDialog from "@/components/shelter/shelter-delete-dialog";
import { useShelter } from "@/lib/query/use-shelter";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function ShelterDetailsPage() {
  const params = useParams();
  const t = useTranslations("Shelter");
  const { currentOrganization } = useOrganizationContext();
  const shelterId = params.shelterId as string;

  const { data: shelter, isLoading, error } = useShelter(shelterId);

  const getShelterTypeColor = (type: string) => {
    switch (type) {
      case "TEMPORARY":
        return "bg-yellow-100 text-yellow-800";
      case "PERMANENT":
        return "bg-green-100 text-green-800";
      case "MEDICAL":
        return "bg-red-100 text-red-800";
      case "EVACUATION":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadge = () => {
    if (!shelter?.isAvailable) {
      return <Badge variant="secondary">{t("unavailable")}</Badge>;
    }
    if (shelter.currentOccupancy >= shelter.capacity) {
      return <Badge variant="destructive">{t("full")}</Badge>;
    }
    if (shelter.currentOccupancy > shelter.capacity * 0.8) {
      return (
        <Badge variant="outline" className="text-orange-600">
          {t("nearlyFull")}
        </Badge>
      );
    }
    return <Badge variant="default">{t("is_available")}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error || !shelter) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">{t("shelterNotFound")}</h1>
          <p className="text-muted-foreground mb-4">
            {t("shelterNotFoundDescription")}
          </p>
          <Link href="/dashboard">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("backToDashboard")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const occupancyPercentage = Math.round(
    (shelter.currentOccupancy / shelter.capacity) * 100
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden md:block">{t("back")}</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {shelter.name}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ShelterEditDialog shelter={shelter} />
          <ShelterDeleteDialog shelter={shelter} />
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
          <TabsTrigger value="occupants">{t("occupants")}</TabsTrigger>
          <TabsTrigger value="details">{t("details")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("basicInfo")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {t("shelter_type")}
                  </span>
                  <Badge className={getShelterTypeColor(shelter.type)}>
                    {t(shelter.type)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t("status")}</span>
                  {getStatusBadge()}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t("capacity")}</span>
                  <span className="text-sm">
                    {shelter.currentOccupancy}/{shelter.capacity}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      occupancyPercentage >= 100
                        ? "bg-red-500"
                        : occupancyPercentage >= 80
                        ? "bg-orange-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  {occupancyPercentage}% full
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("contactInfo")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {shelter.contactName && (
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">
                      {shelter.contactName}
                    </div>
                  </div>
                )}
                {shelter.contactPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">{shelter.contactPhone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm">{shelter.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{shelter.location}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {shelter.resourcesAvailable &&
            shelter.resourcesAvailable.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t("availableResources")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {shelter.resourcesAvailable.map((resource) => (
                      <Badge key={resource} variant="outline">
                        {t(resource)}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          {shelter.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("notes")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{shelter.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="occupants" className="space-y-4">
          {currentOrganization?.id && (
            <ShelterOccupants
              organizationId={currentOrganization.id}
              shelterId={shelter.id}
              shelterName={shelter.name}
              shelterCapacity={shelter.capacity}
              currentOccupancy={shelter.currentOccupancy}
            />
          )}
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("detailedInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">
                      {t("shelterId")}
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {shelter.id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      {t("createdAt")}
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(shelter.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      {t("lastUpdated")}
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(shelter.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">
                      {t("coordinates")}
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {shelter.latitude}, {shelter.longitude}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      {t("accessibility")}
                    </label>
                    <div className="flex items-center gap-2">
                      {shelter.isAccessible ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm">
                        {shelter.isAccessible
                          ? t("accessible")
                          : t("notAccessible")}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      {t("organization")}
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {currentOrganization?.name || t("noOrganization")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
