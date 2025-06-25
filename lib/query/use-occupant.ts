import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { occupantApi, UpdateOccupantDto } from "@/lib/api/occupant";
import { OccupantFormData } from "../schemas/occupant";

export const useOccupants = (organizationId: string, shelterId: string) => {
  return useQuery({
    queryKey: ["occupants", organizationId, shelterId],
    queryFn: () => occupantApi.getOccupants(organizationId, shelterId),
    enabled: !!organizationId && !!shelterId,
  });
};

export const useCreateOccupant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      shelterId,
      data,
    }: {
      organizationId: string;
      shelterId: string;
      data: OccupantFormData;
    }) => occupantApi.createOccupant(organizationId, shelterId, data),
    onSuccess: (_, { organizationId, shelterId }) => {
      // Invalidate and refetch occupants
      queryClient.invalidateQueries({
        queryKey: ["occupants", organizationId, shelterId],
      });
      // Invalidate shelter data to update occupancy
      queryClient.invalidateQueries({
        queryKey: ["shelter", shelterId],
      });
      queryClient.invalidateQueries({
        queryKey: ["shelters"],
      });
    },
  });
};

export const useUpdateOccupant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      shelterId,
      occupantId,
      data,
    }: {
      organizationId: string;
      shelterId: string;
      occupantId: string;
      data: UpdateOccupantDto;
    }) =>
      occupantApi.updateOccupant(organizationId, shelterId, occupantId, data),
    onSuccess: (_, { organizationId, shelterId }) => {
      // Invalidate and refetch occupants
      queryClient.invalidateQueries({
        queryKey: ["occupants", organizationId, shelterId],
      });
      // Invalidate shelter data to update occupancy
      queryClient.invalidateQueries({
        queryKey: ["shelter", shelterId],
      });
      queryClient.invalidateQueries({
        queryKey: ["shelters"],
      });
    },
  });
};

export const useDeleteOccupant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      shelterId,
      occupantId,
    }: {
      organizationId: string;
      shelterId: string;
      occupantId: string;
    }) => occupantApi.deleteOccupant(organizationId, shelterId, occupantId),
    onSuccess: (_, { organizationId, shelterId }) => {
      // Invalidate and refetch occupants
      queryClient.invalidateQueries({
        queryKey: ["occupants", organizationId, shelterId],
      });
      // Invalidate shelter data to update occupancy
      queryClient.invalidateQueries({
        queryKey: ["shelter", shelterId],
      });
      queryClient.invalidateQueries({
        queryKey: ["shelters"],
      });
    },
  });
};
