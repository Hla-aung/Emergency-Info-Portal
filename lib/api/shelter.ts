import axios from "axios";
import { Shelter, ShelterType, ShelterResource } from "@prisma/client";
import { ApiManager } from "./axios";

export interface CreateShelterDto {
  name: string;
  location: string;
  phone: string;
  contactName?: string;
  contactPhone?: string;
  type: ShelterType;
  capacity: number;
  isAvailable?: boolean;
  isAccessible?: boolean;
  notes?: string;
  resourcesAvailable?: ShelterResource[];
  latitude: number;
  longitude: number;
  organizationId: string;
}

export interface UpdateShelterDto extends Partial<CreateShelterDto> {
  currentOccupancy?: number;
}

export interface SearchSheltersQuery {
  type?: ShelterType;
  isAvailable?: boolean;
  hasResources?: ShelterResource[];
  location?: string;
}

export const shelterApi = {
  createShelter: async (data: CreateShelterDto) => {
    const response = await ApiManager.post<Shelter>(`/shelters`, data);
    return response.data;
  },

  getShelters: async (query?: SearchSheltersQuery) => {
    const params = new URLSearchParams();
    if (query?.type) params.append("type", query.type);
    if (query?.isAvailable !== undefined)
      params.append("isAvailable", query.isAvailable.toString());
    if (query?.hasResources?.length)
      params.append("hasResources", query.hasResources.join(","));
    if (query?.location) params.append("location", query.location);

    const response = await ApiManager.get<Shelter[]>(
      `/shelters?${params.toString()}`
    );
    return response.data;
  },

  getShelterById: async (id: string) => {
    const response = await ApiManager.get<Shelter>(`/shelters/${id}`);
    return response.data;
  },

  updateShelter: async (
    organizationId: string,
    id: string,
    data: UpdateShelterDto
  ) => {
    const response = await ApiManager.patch<Shelter>(
      `/organizations/${organizationId}/shelters/${id}`,
      data
    );
    return response.data;
  },

  deleteShelter: async (organizationId: string, id: string) => {
    await ApiManager.delete(`/organizations/${organizationId}/shelters/${id}`);
  },

  updateShelterOccupancy: async (id: string, occupancy: number) => {
    const response = await ApiManager.patch<Shelter>(
      `/shelters/${id}/occupancy`,
      { occupancy }
    );
    return response.data;
  },
};
