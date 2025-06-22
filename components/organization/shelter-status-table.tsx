"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MapPin, Phone, Users, Calendar, Edit, Eye } from "lucide-react";
import { OrganizationShelter } from "@/lib/query/use-organization-dashboard";

interface ShelterStatusTableProps {
  shelters: OrganizationShelter[];
}

export function ShelterStatusTable({ shelters }: ShelterStatusTableProps) {
  const t = useTranslations("Dashboard");

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

  const getStatusBadge = (
    isAvailable: boolean,
    currentOccupancy: number,
    capacity: number
  ) => {
    if (!isAvailable) {
      return <Badge variant="secondary">{t("unavailable")}</Badge>;
    }
    if (currentOccupancy >= capacity) {
      return <Badge variant="destructive">{t("full")}</Badge>;
    }
    if (currentOccupancy > capacity * 0.8) {
      return (
        <Badge variant="outline" className="text-orange-600">
          {t("nearlyFull")}
        </Badge>
      );
    }
    return <Badge variant="default">{t("available")}</Badge>;
  };

  if (shelters.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("shelters")}</CardTitle>
          <CardDescription>{t("noSheltersDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t("noShelters")}</p>
            <Button className="mt-4">
              <MapPin className="h-4 w-4 mr-2" />
              {t("addFirstShelter")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {t("shelterStatus")}
        </CardTitle>
        <CardDescription>{t("shelterStatusDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("shelterName")}</TableHead>
              <TableHead>{t("location")}</TableHead>
              <TableHead>{t("type")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("occupancy")}</TableHead>
              <TableHead>{t("contact")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shelters.map((shelter) => (
              <TableRow key={shelter.id}>
                <TableCell className="font-medium">{shelter.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 max-w-[200px]">
                    {shelter.location}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getShelterTypeColor(shelter.type)}>
                    {t(shelter.type.toLowerCase())}
                  </Badge>
                </TableCell>
                <TableCell>
                  {getStatusBadge(
                    shelter.isAvailable,
                    shelter.currentOccupancy,
                    shelter.capacity
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {shelter.currentOccupancy}/{shelter.capacity}
                  </div>
                </TableCell>
                <TableCell>
                  {shelter.contactName && (
                    <div className="text-sm">
                      <p className="font-medium">{shelter.contactName}</p>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {shelter.contactPhone || shelter.phone}
                      </div>
                    </div>
                  )}
                  {!shelter.contactName && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {shelter.phone}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
