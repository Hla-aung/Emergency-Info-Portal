"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { OrganizationMember } from "@/lib/query/use-organization-dashboard";

export const useRealtimeOrganizationMembers = (organizationId: string) => {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!organizationId) return;

    let mounted = true;

    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch initial members data with user information
        const { data: initialMembers, error: fetchError } = await supabase
          .from("UserOrganization")
          .select(
            `
            id,
            role,
            createdAt,
            userId,
            User(
              id,
              email,
              firstName,
              lastName,
              createdAt
            )
          `
          )
          .eq("organizationId", organizationId)
          .order("createdAt", { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        if (mounted) {
          // Transform the data to match OrganizationMember interface
          const transformedMembers: OrganizationMember[] = (
            initialMembers || []
          )
            .filter(
              (member: any) =>
                member.User &&
                Array.isArray(member.User) &&
                member.User.length > 0
            )
            .map((member: any) => {
              const user = member.User[0]; // Get the first user from the array
              return {
                id: member.id,
                role: member.role,
                createdAt: member.createdAt,
                user: {
                  id: user.id,
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  createdAt: user.createdAt,
                },
              };
            });

          setMembers(transformedMembers);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch members"
          );
          setIsLoading(false);
        }
      }
    };

    // Set up realtime subscription
    const channel = supabase
      .channel(`organization-members-${organizationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "UserOrganization",
          filter: `organizationId=eq.${organizationId}`,
        },
        async (payload) => {
          if (!mounted) return;

          if (payload.eventType === "INSERT") {
            // New member joined - fetch the complete member data
            const { data: newMemberData, error: fetchError } = await supabase
              .from("UserOrganization")
              .select(
                `
                id,
                role,
                createdAt,
                userId,
                User(
                  id,
                  email,
                  firstName,
                  lastName,
                  createdAt
                )
              `
              )
              .eq("id", payload.new.id)
              .single();

            if (
              !fetchError &&
              newMemberData &&
              newMemberData.User &&
              Array.isArray(newMemberData.User) &&
              newMemberData.User.length > 0
            ) {
              const user = newMemberData.User[0];
              const newMember: OrganizationMember = {
                id: newMemberData.id,
                role: newMemberData.role,
                createdAt: newMemberData.createdAt,
                user: {
                  id: user.id,
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  createdAt: user.createdAt,
                },
              };
              setMembers((prev) => [newMember, ...prev]);
            }
          } else if (payload.eventType === "DELETE") {
            // Member left
            const deletedMemberId = payload.old.id;
            setMembers((prev) =>
              prev.filter((member) => member.id !== deletedMemberId)
            );
          } else if (payload.eventType === "UPDATE") {
            // Member role updated - fetch the updated member data
            const { data: updatedMemberData, error: fetchError } =
              await supabase
                .from("UserOrganization")
                .select(
                  `
                id,
                role,
                createdAt,
                userId,
                User(
                  id,
                  email,
                  firstName,
                  lastName,
                  createdAt
                )
              `
                )
                .eq("id", payload.new.id)
                .single();

            if (
              !fetchError &&
              updatedMemberData &&
              updatedMemberData.User &&
              Array.isArray(updatedMemberData.User) &&
              updatedMemberData.User.length > 0
            ) {
              const user = updatedMemberData.User[0];
              const updatedMember: OrganizationMember = {
                id: updatedMemberData.id,
                role: updatedMemberData.role,
                createdAt: updatedMemberData.createdAt,
                user: {
                  id: user.id,
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  createdAt: user.createdAt,
                },
              };
              setMembers((prev) =>
                prev.map((member) =>
                  member.id === updatedMember.id ? updatedMember : member
                )
              );
            }
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          fetchMembers();
        }
      });

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [organizationId]);

  return { members, isLoading, error };
};
