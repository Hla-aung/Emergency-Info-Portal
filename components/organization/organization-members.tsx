"use client";

import { useState } from "react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  Crown,
  Shield,
  User,
  Mail,
  Calendar,
  Plus,
  MoreHorizontal,
  Wifi,
  Loader2,
} from "lucide-react";
import { OrganizationMember } from "@/lib/query/use-organization-dashboard";
import { InviteMemberDialog } from "./invite-member-dialog";
import { useOrganizationContext } from "@/context/organization-context";

interface OrganizationMembersProps {
  members: OrganizationMember[];
  isLoading?: boolean;
  isRealtime?: boolean;
}

export function OrganizationMembers({
  members,
  isLoading = false,
  isRealtime = false,
}: OrganizationMembersProps) {
  const t = useTranslations("Dashboard");
  const { currentOrganization } = useOrganizationContext();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

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

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (lastName) {
      return lastName[0].toUpperCase();
    }
    return "U";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const roleCounts = members.reduce((acc, member) => {
    acc[member.role] = (acc[member.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {t("loadingMembers")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Member Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalMembers")}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              {isRealtime && <Wifi className="h-3 w-3 text-green-500" />}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
            <p className="text-xs text-muted-foreground">
              {t("totalMembersDescription")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("owners")}</CardTitle>
            <Crown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts.OWNER || 0}</div>
            <p className="text-xs text-muted-foreground">
              {t("ownersDescription")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admins")}</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts.ADMIN || 0}</div>
            <p className="text-xs text-muted-foreground">
              {t("adminsDescription")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("members")}
            </CardTitle>
            <User className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts.MEMBER || 0}</div>
            <p className="text-xs text-muted-foreground">
              {t("membersDescription")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <div className="flex md:items-center justify-between flex-col md:flex-row gap-5">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t("organizationMembers")}
                {isRealtime && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    <Wifi className="h-3 w-3 mr-1" />
                    {t("live")}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {t("organizationMembersDescription")}
              </CardDescription>
            </div>
            <Button onClick={() => setInviteDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t("inviteMember")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("member")}</TableHead>
                <TableHead>{t("email")}</TableHead>
                <TableHead>{t("role")}</TableHead>
                <TableHead>{t("joinedDate")}</TableHead>
                <TableHead>{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {getInitials(
                            member.user.firstName,
                            member.user.lastName
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {member.user.firstName && member.user.lastName
                            ? `${member.user.firstName} ${member.user.lastName}`
                            : t("unnamedUser")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {member.user.firstName && member.user.lastName
                            ? member.user.email
                            : ""}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {member.user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="hidden md:flex">
                        {getRoleIcon(member.role)}
                      </div>
                      {getRoleBadge(member.role)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {formatDate(member.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invite Member Dialog */}
      <InviteMemberDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        organizationId={currentOrganization?.kindeOrgId || ""}
        organizationName={
          currentOrganization?.displayName || currentOrganization?.name
        }
      />
    </div>
  );
}
