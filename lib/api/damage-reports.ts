import { ApiManager } from "./axios";
import { DamageType, DamageSeverity, ReportStatus } from "@prisma/client";

export interface DamageReport {
  id: string;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  damageType: DamageType;
  severity: DamageSeverity;
  status: ReportStatus;
  estimatedCost?: number;
  affectedArea?: string;
  priority: number;
  isPeopleDamaged: boolean;
  numberOfPeopleDamaged?: number;
  isUrgent: boolean;
  photos: string[];
  notes?: string;
  reporterName?: string;
  reporterEmail?: string;
  reporterPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDamageReportDto {
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  damageType: DamageType;
  severity: DamageSeverity;
  status?: ReportStatus;
  estimatedCost?: number;
  affectedArea?: string;
  priority?: number;
  isPeopleDamaged?: boolean;
  numberOfPeopleDamaged?: number;
  isUrgent?: boolean;
  photos?: string[];
  notes?: string;
  reporterName?: string;
  reporterEmail?: string;
  reporterPhone?: string;
}

export interface UpdateDamageReportDto extends Partial<CreateDamageReportDto> {}

export interface DamageReportsQuery {
  damageType?: DamageType;
  severity?: DamageSeverity;
  status?: ReportStatus;
  isUrgent?: boolean;
  isPeopleDamaged?: boolean;
  limit?: number;
  offset?: number;
}

export interface DamageReportsResponse {
  damageReports: DamageReport[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface DamageReportStatistics {
  overview: {
    totalReports: number;
    urgentReports: number;
    peopleDamagedReports: number;
    recentReports: number;
    totalEstimatedCost: number;
    averageEstimatedCost: number;
    totalPeopleDamaged: number;
    averagePeoplePerReport: number;
  };
  byDamageType: Array<{
    damageType: DamageType;
    count: number;
  }>;
  bySeverity: Array<{
    severity: DamageSeverity;
    count: number;
  }>;
  byStatus: Array<{
    status: ReportStatus;
    count: number;
  }>;
}

export const damageReportsApi = {
  getDamageReports: async (
    query?: DamageReportsQuery
  ): Promise<DamageReportsResponse> => {
    const params = new URLSearchParams();

    if (query?.damageType) params.append("damageType", query.damageType);
    if (query?.severity) params.append("severity", query.severity);
    if (query?.status) params.append("status", query.status);
    if (query?.isUrgent !== undefined)
      params.append("isUrgent", query.isUrgent.toString());
    if (query?.isPeopleDamaged !== undefined)
      params.append("isPeopleDamaged", query.isPeopleDamaged.toString());
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.offset) params.append("offset", query.offset.toString());

    const response = await ApiManager.get(
      `/damage-reports?${params.toString()}`
    );
    return response.data;
  },

  getDamageReport: async (id: string): Promise<DamageReport> => {
    const response = await ApiManager.get(`/damage-reports/${id}`);
    return response.data;
  },

  createDamageReport: async (
    data: CreateDamageReportDto
  ): Promise<DamageReport> => {
    const response = await ApiManager.post("/damage-reports", data);
    return response.data;
  },

  updateDamageReport: async (
    id: string,
    data: UpdateDamageReportDto
  ): Promise<DamageReport> => {
    const response = await ApiManager.patch(`/damage-reports/${id}`, data);
    return response.data;
  },

  deleteDamageReport: async (id: string): Promise<void> => {
    await ApiManager.delete(`/damage-reports/${id}`);
  },

  getDamageReportStatistics: async (
    startDate?: string,
    endDate?: string
  ): Promise<DamageReportStatistics> => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await ApiManager.get(
      `/damage-reports/statistics?${params.toString()}`
    );
    return response.data;
  },
};
