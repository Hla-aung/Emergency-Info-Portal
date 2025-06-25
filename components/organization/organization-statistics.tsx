"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Building2, Users, MapPin, TrendingUp } from "lucide-react";
import { OrganizationStatistics as Stats } from "@/lib/query/use-organization-dashboard";

interface OrganizationStatisticsProps {
  statistics: Stats;
}

export function OrganizationStatistics({
  statistics,
}: OrganizationStatisticsProps) {
  const t = useTranslations("Dashboard");

  const stats = [
    {
      title: t("totalShelters"),
      value: statistics.totalShelters,
      description: t("totalSheltersDescription"),
      icon: Building2,
      color: "text-blue-600",
    },
    {
      title: t("availableShelters"),
      value: statistics.availableShelters,
      description: t("availableSheltersDescription"),
      icon: MapPin,
      color: "text-green-600",
    },
    {
      title: t("totalCapacity"),
      value: statistics.totalCapacity,
      description: t("totalCapacityDescription"),
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: t("occupancyRate"),
      value: `${statistics.occupancyRate.toFixed(1)}%`,
      description: t("occupancyRateDescription"),
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              {stat.title === t("occupancyRate") && (
                <Progress value={statistics.occupancyRate} className="mt-2" />
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
