"use client";

import { useEffect, useCallback, useState } from "react";
import {
  getOrganizationChannel,
  OrganizationEvent,
  REALTIME_EVENTS,
  supabase,
} from "@/lib/supabase";
import { OrganizationMember } from "@/lib/query/use-organization-dashboard";

interface UseOrganizationRealtimeProps {
  organizationId: string;
  onMemberJoined?: (member: OrganizationMember) => void;
  onMemberLeft?: (memberId: string) => void;
  onRoleChanged?: (memberId: string, newRole: string) => void;
}

export function useOrganizationRealtime({
  organizationId,
  onMemberJoined,
  onMemberLeft,
  onRoleChanged,
}: UseOrganizationRealtimeProps) {
  //   const [channel, setChannel] = useState<ReturnType<
  //     typeof supabase.channel
  //   > | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const handleEvent = useCallback(
    (event: OrganizationEvent) => {
      switch (event.type) {
        case REALTIME_EVENTS.MEMBER_JOINED:
          if (onMemberJoined && event.data.member) {
            onMemberJoined({
              id: event.data.member.id,
              role: event.data.member.role,
              createdAt: event.data.member.createdAt,
              user: {
                id: event.data.member.id,
                email: event.data.member.email,
                firstName: event.data.member.firstName,
                lastName: event.data.member.lastName,
                createdAt: event.data.member.createdAt,
              },
            });
          }
          break;
        case REALTIME_EVENTS.MEMBER_LEFT:
          if (onMemberLeft && event.data.memberId) {
            onMemberLeft(event.data.memberId);
          }
          break;
        case REALTIME_EVENTS.ROLE_CHANGED:
          if (onRoleChanged && event.data.memberId && event.data.newRole) {
            onRoleChanged(event.data.memberId, event.data.newRole);
          }
          break;
        default:
          console.log("Unknown real-time event type:", event.type);
      }
    },
    [onMemberJoined]
  );

  useEffect(() => {
    if (!organizationId) {
      return;
    }

    const newChannel = supabase.channel(getOrganizationChannel(organizationId));

    newChannel
      .on("broadcast", { event: "*" }, (payload) => {
        const event: OrganizationEvent = {
          ...payload.payload,
          timestamp: new Date().toISOString(),
        };
        handleEvent(event);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          console.log("Connected to organization channel");
          setIsConnected(true);
        }
      });

    return () => {
      supabase.removeChannel(newChannel);
    };
  }, [organizationId]);

  return { isConnected };
}
