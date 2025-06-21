"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Users, UserPlus, UserMinus, Shield } from "lucide-react";
import { OrganizationMember } from "@/lib/query/use-organization-dashboard";

interface RealtimeNotificationProps {
  previousMembers: OrganizationMember[];
  currentMembers: OrganizationMember[];
  organizationName?: string;
}

export function RealtimeNotification({
  previousMembers,
  currentMembers,
  organizationName,
}: RealtimeNotificationProps) {
  const t = useTranslations("Dashboard");

  useEffect(() => {
    if (previousMembers.length === 0 || currentMembers.length === 0) return;

    // Check for new members
    const newMembers = currentMembers.filter(
      (currentMember) =>
        !previousMembers.some(
          (prevMember) => prevMember.id === currentMember.id
        )
    );

    // Check for removed members
    const removedMembers = previousMembers.filter(
      (prevMember) =>
        !currentMembers.some(
          (currentMember) => currentMember.id === prevMember.id
        )
    );

    // Check for role changes
    const roleChangedMembers = currentMembers.filter((currentMember) => {
      const prevMember = previousMembers.find(
        (prev) => prev.id === currentMember.id
      );
      return prevMember && prevMember.role !== currentMember.role;
    });

    // Show notifications
    newMembers.forEach((member) => {
      const memberName =
        member.user.firstName && member.user.lastName
          ? `${member.user.firstName} ${member.user.lastName}`
          : member.user.email;

      toast.success(
        <div className="flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-green-500" />
          <div>
            <p className="font-medium">{t("newMemberJoined")}</p>
            <p className="text-sm text-muted-foreground">
              {memberName} {t("joinedOrganization")}
            </p>
          </div>
        </div>,
        {
          duration: 5000,
          description: `${memberName} joined ${
            organizationName || t("organization")
          }`,
        }
      );
    });

    removedMembers.forEach((member) => {
      const memberName =
        member.user.firstName && member.user.lastName
          ? `${member.user.firstName} ${member.user.lastName}`
          : member.user.email;

      toast.info(
        <div className="flex items-center gap-2">
          <UserMinus className="h-4 w-4 text-blue-500" />
          <div>
            <p className="font-medium">{t("memberLeft")}</p>
            <p className="text-sm text-muted-foreground">
              {memberName} {t("leftOrganization")}
            </p>
          </div>
        </div>,
        {
          duration: 5000,
          description: `${memberName} left ${
            organizationName || t("organization")
          }`,
        }
      );
    });

    roleChangedMembers.forEach((member) => {
      const memberName =
        member.user.firstName && member.user.lastName
          ? `${member.user.firstName} ${member.user.lastName}`
          : member.user.email;

      toast.info(
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-purple-500" />
          <div>
            <p className="font-medium">{t("roleChanged")}</p>
            <p className="text-sm text-muted-foreground">
              {memberName} {t("roleChangedTo")} {t(member.role.toLowerCase())}
            </p>
          </div>
        </div>,
        {
          duration: 5000,
          description: `${memberName}'s role changed to ${t(
            member.role.toLowerCase()
          )}`,
        }
      );
    });
  }, [previousMembers, currentMembers, organizationName, t]);

  return null; // This component doesn't render anything
}
