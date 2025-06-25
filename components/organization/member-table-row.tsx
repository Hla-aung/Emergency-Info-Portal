import React from "react";
import { TableCell, TableRow } from "../ui/table";
import {
  OrganizationMember,
  useRemoveOrganizationMember,
} from "@/lib/query/use-organization-dashboard";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Crown,
  Loader2,
  MoreHorizontal,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const MemberTableRow = ({
  member,
  organizationId,
}: {
  member: OrganizationMember;
  organizationId: string;
}) => {
  const t = useTranslations("Dashboard");
  const queryClient = useQueryClient();

  const { mutate: removeMember, isPending } =
    useRemoveOrganizationMember(organizationId);

  const handleRemoveMember = () => {
    removeMember(member.user.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["organization-dashboard", organizationId],
        });
      },
      onError: () => {
        toast.error(t("memberRemoveFailed"));
      },
    });
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
  return (
    <TableRow key={member.id}>
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8 relative">
            <AvatarFallback>
              {getInitials(member.user.firstName, member.user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">
                {member.user.firstName && member.user.lastName
                  ? `${member.user.firstName} ${member.user.lastName}`
                  : t("unnamedUser")}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {member.user.firstName && member.user.lastName
                ? member.user.email
                : ""}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">{member.user.email}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex">{getRoleIcon(member.role)}</div>
          {getRoleBadge(member.role)}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          {formatDate(member.createdAt)}
        </div>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHorizontal className="h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleRemoveMember} disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {t("removeMember")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default MemberTableRow;
