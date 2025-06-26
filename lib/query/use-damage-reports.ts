import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  damageReportsApi,
  CreateDamageReportDto,
  UpdateDamageReportDto,
  DamageReportsQuery,
} from "@/lib/api/damage-reports";

export const useDamageReports = (query?: DamageReportsQuery) => {
  return useQuery({
    queryKey: ["damage-reports", query],
    queryFn: () => damageReportsApi.getDamageReports(query),
  });
};

export const useDamageReport = (id: string) => {
  return useQuery({
    queryKey: ["damage-report", id],
    queryFn: () => damageReportsApi.getDamageReport(id),
    enabled: !!id,
  });
};

export const useCreateDamageReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDamageReportDto) =>
      damageReportsApi.createDamageReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["damage-reports"] });
      queryClient.invalidateQueries({ queryKey: ["damage-report-statistics"] });
    },
  });
};

export const useUpdateDamageReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDamageReportDto }) =>
      damageReportsApi.updateDamageReport(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["damage-reports"] });
      queryClient.invalidateQueries({ queryKey: ["damage-report", id] });
      queryClient.invalidateQueries({ queryKey: ["damage-report-statistics"] });
    },
  });
};

export const useDeleteDamageReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => damageReportsApi.deleteDamageReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["damage-reports"] });
      queryClient.invalidateQueries({ queryKey: ["damage-report-statistics"] });
    },
  });
};

export const useDamageReportStatistics = (
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ["damage-report-statistics", startDate, endDate],
    queryFn: () =>
      damageReportsApi.getDamageReportStatistics(startDate, endDate),
  });
};

export const useAddDamageReportComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { damageReportId: string; comment: string }) =>
      damageReportsApi.addDamageReportComment(
        data.damageReportId,
        data.comment
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["damage-reports"] });
    },
  });
};
