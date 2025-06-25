"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building2, Crown, Shield, User, ChevronDown } from "lucide-react";
import { useOrganizationContext } from "@/context/organization-context";
import { OrganizationSelector } from "./organization-selector";

export function OrganizationSwitcher() {
  const t = useTranslations("Organization");
  const { currentOrganization, organizations, setCurrentOrganization } =
    useOrganizationContext();
  const [showSelector, setShowSelector] = useState(false);

  if (!currentOrganization) {
    return null;
  }

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

  if (organizations.length <= 1) {
    return (
      <Card className="p-3">
        <CardContent className="p-0">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {currentOrganization.displayName || currentOrganization.name}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                {getRoleIcon(currentOrganization.role)}
                {getRoleBadge(currentOrganization.role)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span className="truncate">
                {currentOrganization.displayName || currentOrganization.name}
              </span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {organizations.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => setCurrentOrganization(org)}
              className="flex items-center space-x-2"
            >
              <div className="flex items-center space-x-2 flex-1">
                <Building2 className="h-4 w-4" />
                <div className="flex-1 min-w-0">
                  <p className="truncate">{org.displayName || org.name}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getRoleIcon(org.role)}
                    {getRoleBadge(org.role)}
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem onClick={() => setShowSelector(true)}>
            <span className="text-primary">Switch Organization</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <OrganizationSelector
              onSelect={(org) => {
                setCurrentOrganization(org);
                setShowSelector(false);
              }}
              selectedOrganizationId={currentOrganization.id}
            />
            <Button
              variant="outline"
              onClick={() => setShowSelector(false)}
              className="w-full mt-4"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
