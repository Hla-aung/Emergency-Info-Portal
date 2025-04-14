import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  pushSubscriptionApi,
  CreatePushSubscriptionDto,
} from "@/lib/api/push-subscriptions";

export const usePushSubscriptions = () => {
  return useQuery({
    queryKey: ["push-subscriptions"],
    queryFn: () => pushSubscriptionApi.getPushSubscriptions(),
  });
};

export const useCreatePushSubscription = () => {
  return useMutation({
    mutationFn: (data: CreatePushSubscriptionDto) =>
      pushSubscriptionApi.createPushSubscription(data),
  });
};

export const useDeletePushSubscription = () => {
  return useMutation({
    mutationFn: (data: { endpoint: string }) =>
      pushSubscriptionApi.deletePushSubscription(data),
  });
};
