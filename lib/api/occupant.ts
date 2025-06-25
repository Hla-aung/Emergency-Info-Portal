import { ApiManager } from "./axios";
import { OccupantFormData } from "@/lib/schemas/occupant";

export interface Occupant extends OccupantFormData {
  id: string;
  checkInTime: string;
  checkOutTime?: string;
  isCheckedIn: boolean;
  shelterId: string;
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOccupantDto extends OccupantFormData {
  shelterId: string;
  organizationId: string;
}

export interface UpdateOccupantDto extends Partial<OccupantFormData> {
  isCheckedIn?: boolean;
  checkOutTime?: string;
}

class OccupantApi {
  async getOccupants(
    organizationId: string,
    shelterId: string
  ): Promise<Occupant[]> {
    const response = await ApiManager.get(
      `/organizations/${organizationId}/shelters/${shelterId}/occupants`
    );
    return response.data;
  }

  async createOccupant(
    organizationId: string,
    shelterId: string,
    data: OccupantFormData
  ): Promise<Occupant> {
    const response = await ApiManager.post(
      `/organizations/${organizationId}/shelters/${shelterId}/occupants`,
      data
    );
    return response.data;
  }

  async updateOccupant(
    organizationId: string,
    shelterId: string,
    occupantId: string,
    data: UpdateOccupantDto
  ): Promise<Occupant> {
    const response = await ApiManager.patch(
      `/organizations/${organizationId}/shelters/${shelterId}/occupants/${occupantId}`,
      data
    );
    return response.data;
  }

  async deleteOccupant(
    organizationId: string,
    shelterId: string,
    occupantId: string
  ): Promise<void> {
    await ApiManager.delete(
      `/organizations/${organizationId}/shelters/${shelterId}/occupants/${occupantId}`
    );
  }
}

export const occupantApi = new OccupantApi();
