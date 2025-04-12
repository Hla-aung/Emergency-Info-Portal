import { ApiManager } from "./axios";

export interface CreatePushSubscriptionDto {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userId?: string;
}

export interface PushSubscription {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const pushSubscriptionApi = {
  createPushSubscription: async (data: CreatePushSubscriptionDto) => {
    const response = await ApiManager.post<PushSubscription>(
      `/push-subscriptions`,
      JSON.stringify(data)
    );
    return response.data;
  },
  getPushSubscriptions: async () => {
    const response = await ApiManager.get<PushSubscription[]>(
      `/push-subscriptions`
    );
    return response.data;
  },
  deletePushSubscription: async ({ endpoint }: { endpoint: string }) => {
    const response = await ApiManager.delete<void>(`/push-subscriptions`, {
      data: {
        endpoint,
      },
    });
    return response.data;
  },
};
