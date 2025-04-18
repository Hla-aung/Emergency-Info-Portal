import { PushSubscriptionContext } from "@/context/push-subscription-context";
import {
  useCreatePushSubscription,
  useDeletePushSubscription,
} from "@/lib/query/use-push-subscriptions";
import { use, useEffect } from "react";

// Check if the user has a push subscription and if it is expired, create a new one
export const useCheckPushSubscription = () => {
  const context = use(PushSubscriptionContext);

  if (!context) {
    throw new Error("PushSubscriptionContext not found");
  }

  const { setIsSubscribed, setSubscription, setRegistration } = context;

  const { mutate: createPushSubscription } = useCreatePushSubscription();
  const { mutate: deletePushSubscription } = useDeletePushSubscription();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.serwist !== undefined
    ) {
      // run only in browser
      navigator.serviceWorker.ready.then(async (reg) => {
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          setSubscription(sub);
          setIsSubscribed(true);
        }
        setRegistration(reg);
      });
    }
  }, [createPushSubscription, deletePushSubscription]);
};
