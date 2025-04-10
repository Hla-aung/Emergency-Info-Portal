import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  shelterApi,
  CreateShelterDto,
  UpdateShelterDto,
  SearchSheltersQuery,
} from "@/lib/api/shelter";

export const useShelters = (query?: SearchSheltersQuery) => {
  return useQuery({
    queryKey: ["shelters", query],
    queryFn: () => shelterApi.getShelters(query),
  });
};

export const useShelter = (id: string) => {
  return useQuery({
    queryKey: ["shelter", id],
    queryFn: () => shelterApi.getShelterById(id),
    enabled: !!id,
  });
};

export const useCreateShelter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShelterDto) => shelterApi.createShelter(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shelters"] });
    },
  });
};

export const useUpdateShelter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateShelterDto }) =>
      shelterApi.updateShelter(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["shelters"] });
      queryClient.invalidateQueries({ queryKey: ["shelter", id] });
    },
  });
};

export const useDeleteShelter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => shelterApi.deleteShelter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shelters"] });
    },
  });
};

export const useUpdateShelterOccupancy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, occupancy }: { id: string; occupancy: number }) =>
      shelterApi.updateShelterOccupancy(id, occupancy),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["shelters"] });
      queryClient.invalidateQueries({ queryKey: ["shelter", id] });
    },
  });
};
