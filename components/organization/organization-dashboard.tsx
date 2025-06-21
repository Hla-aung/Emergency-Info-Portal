"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  MapPin,
  Phone,
  Calendar,
  Crown,
  Shield,
  User,
  Plus,
  Wifi,
} from "lucide-react";
import { useOrganizationDashboard } from "@/lib/query/use-organization-dashboard";
import { useRealtimeOrganizationMembers } from "@/hooks/use-realtime-organization-members";
import { ShelterStatusTable } from "./shelter-status-table";
import { OrganizationMembers } from "./organization-members";
import { OrganizationStatistics } from "./organization-statistics";
import { RealtimeNotification } from "@/components/common/realtime-notification";
import { OrganizationMember } from "@/lib/query/use-organization-dashboard";

interface OrganizationDashboardProps {
  organizationId: string;
}

export function OrganizationDashboard({
  organizationId,
}: OrganizationDashboardProps) {
  const t = useTranslations("Dashboard");
  const { data, isLoading, error } = useOrganizationDashboard(organizationId);
  const { members: realtimeMembers, isLoading: membersLoading } =
    useRealtimeOrganizationMembers(organizationId);
  const [activeTab, setActiveTab] = useState("overview");
  const previousMembersRef = useRef<OrganizationMember[]>([]);

  // Track previous members for notifications
  useEffect(() => {
    if (realtimeMembers.length > 0) {
      previousMembersRef.current = realtimeMembers;
    }
  }, [realtimeMembers]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Building2 className="mx-auto h-8 w-8 animate-pulse text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {t("loadingDashboard")}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Building2 className="mx-auto h-8 w-8 text-destructive" />
          <p className="mt-2 text-sm text-destructive">
            {t("errorLoadingDashboard")}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { organization, userRole, statistics } = data;
  // Use realtime members if available, otherwise fall back to static data
  const members =
    realtimeMembers.length > 0 ? realtimeMembers : data.members || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Realtime Notifications */}
      <RealtimeNotification
        previousMembers={previousMembersRef.current}
        currentMembers={members}
        organizationName={organization.displayName || organization.name}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {organization.displayName || organization.name}
          </h1>
          <p className="text-muted-foreground">{t("organizationDashboard")}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {userRole === "OWNER" && <Crown className="h-3 w-3 mr-1" />}
            {userRole === "ADMIN" && <Shield className="h-3 w-3 mr-1" />}
            {userRole === "MEMBER" && <User className="h-3 w-3 mr-1" />}
            {t(userRole.toLowerCase())}
          </Badge>
          {/* Realtime indicator */}
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Wifi className="h-3 w-3 mr-1" />
            {t("live")}
          </Badge>
        </div>
      </div>

      {/* Statistics Cards */}
      <OrganizationStatistics statistics={statistics} />

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
          <TabsTrigger value="shelters">{t("shelters")}</TabsTrigger>
          {(userRole === "OWNER" || userRole === "ADMIN") && (
            <TabsTrigger value="members">{t("members")}</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Shelters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {t("recentShelters")}
                </CardTitle>
                <CardDescription>
                  {t("recentSheltersDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {organization.shelters.slice(0, 5).map((shelter) => (
                  <div
                    key={shelter.id}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <div>
                      <p className="font-medium">{shelter.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {shelter.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={shelter.isAvailable ? "default" : "secondary"}
                      >
                        {shelter.isAvailable
                          ? t("available")
                          : t("unavailable")}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {shelter.currentOccupancy}/{shelter.capacity}
                      </p>
                    </div>
                  </div>
                ))}
                {organization.shelters.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    {t("noShelters")}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {t("quickActions")}
                </CardTitle>
                <CardDescription>
                  {t("quickActionsDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  {t("addShelter")}
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  {t("inviteMember")}
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  {t("contactSupport")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="shelters" className="space-y-4">
          <ShelterStatusTable shelters={organization.shelters} />
        </TabsContent>

        {(userRole === "OWNER" || userRole === "ADMIN") && (
          <TabsContent value="members" className="space-y-4">
            <OrganizationMembers
              members={members}
              isLoading={membersLoading}
              isRealtime={true}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
