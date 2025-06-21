import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiManager } from "@/lib/api/axios";

export interface Organization {
  id: string;
  kindeOrgId: string;
  name: string;
  displayName?: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationData {
  action: "create";
  organizationName: string;
}

export interface JoinOrganizationData {
  action: "join";
  organizationId: string;
}

export const useOrganizations = () => {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: async (): Promise<{ organizations: Organization[] }> => {
      const response = await ApiManager.get("/organizations");
      return response.data;
    },
  });
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOrganizationData) => {
      const response = await ApiManager.post("/organizations", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
};

export const useJoinOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: JoinOrganizationData) => {
      const response = await ApiManager.post("/organizations", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
};
