"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Crown, Shield, User, Check } from "lucide-react";
import { useOrganizations } from "@/lib/query/use-organization";

interface OrganizationSelectorProps {
  onSelect?: (organization: any) => void;
  selectedOrganizationId?: string;
}

export function OrganizationSelector({
  onSelect,
  selectedOrganizationId,
}: OrganizationSelectorProps) {
  const t = useTranslations("Organization");
  const { data, isLoading, error } = useOrganizations();
  const [selectedOrg, setSelectedOrg] = useState<string | null>(
    selectedOrganizationId || null
  );

  useEffect(() => {
    if (selectedOrganizationId) {
      setSelectedOrg(selectedOrganizationId);
    }
  }, [selectedOrganizationId]);

  const handleSelectOrganization = (organization: any) => {
    setSelectedOrg(organization.id);
    onSelect?.(organization);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "OWNER":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "ADMIN":
        return <Shield className="h-4 w-4 text-blue-500" />;
      case "MEMBER":
        return <User className="h-4 w-4 text-gray-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "OWNER":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            {t("owner")}
          </Badge>
        );
      case "ADMIN":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {t("admin")}
          </Badge>
        );
      case "MEMBER":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            {t("member")}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Building2 className="mx-auto h-8 w-8 animate-pulse text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {t("loadingOrganizations")}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Building2 className="mx-auto h-8 w-8 text-destructive" />
            <p className="mt-2 text-sm text-destructive">
              {t("errorLoadingOrganizations")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const organizations = data?.organizations || [];

  if (organizations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Building2 className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              {t("noOrganizations")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">{t("selectOrganization")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("selectOrganizationDescription")}
        </p>
      </div>

      <div className="grid gap-3">
        {organizations.map((organization) => (
          <Card
            key={organization.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedOrg === organization.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleSelectOrganization(organization)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">
                      {organization.displayName || organization.name}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      {getRoleIcon(organization.role)}
                      {getRoleBadge(organization.role)}
                    </div>
                  </div>
                </div>

                {selectedOrg === organization.id && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedOrg && (
        <div className="pt-4">
          <Button
            className="w-full"
            onClick={() =>
              onSelect?.(organizations.find((org) => org.id === selectedOrg))
            }
          >
            {t("continueWithSelected")}
          </Button>
        </div>
      )}
    </div>
  );
}
