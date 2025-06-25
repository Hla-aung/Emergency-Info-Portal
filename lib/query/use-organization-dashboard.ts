import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiManager } from "@/lib/api/axios";

export interface OrganizationMember {
  id: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    createdAt: string;
  };
}

export interface OrganizationShelter {
  id: string;
  name: string;
  location: string;
  phone: string;
  contactName?: string;
  contactPhone?: string;
  type: "TEMPORARY" | "PERMANENT" | "MEDICAL" | "EVACUATION";
  capacity: number;
  currentOccupancy: number;
  isAvailable: boolean;
  isAccessible?: boolean;
  notes?: string;
  resourcesAvailable: string[];
  latitude: number;
  longitude: number;
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationStatistics {
  totalShelters: number;
  availableShelters: number;
  totalCapacity: number;
  totalOccupancy: number;
  occupancyRate: number;
}

export interface OrganizationDashboardData {
  organization: {
    id: string;
    kindeOrgId: string;
    name: string;
    displayName?: string;
    createdAt: string;
    updatedAt: string;
    shelters: OrganizationShelter[];
  };
  userRole: "OWNER" | "ADMIN" | "MEMBER";
  statistics: OrganizationStatistics;
  members?: OrganizationMember[];
}

export const useOrganizationDashboard = (organizationId: string) => {
  return useQuery({
    queryKey: ["organization-dashboard", organizationId],
    queryFn: async (): Promise<OrganizationDashboardData> => {
      const response = await ApiManager.get(`/organizations/${organizationId}`);
      return response.data;
    },
    enabled: !!organizationId,
    refetchInterval: 1000 * 60,
  });
};

export const useRemoveOrganizationMember = (organizationId: string) => {
  return useMutation({
    mutationFn: async (memberId: string) => {
      const response = await ApiManager.delete(
        `/organizations/${organizationId}/members/${memberId}`
      );
      return response.data;
    },
    mutationKey: ["remove-organization-member", organizationId],
  });
};
