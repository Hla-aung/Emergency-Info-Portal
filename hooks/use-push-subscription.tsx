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
          // Check if subscription is expired or about to expire (within 5 minutes)
          const isExpired =
            sub.expirationTime &&
            Date.now() > sub.expirationTime - 5 * 60 * 1000;

          if (isExpired) {
            // Unsubscribe from expired subscription
            await sub.unsubscribe();
            deletePushSubscription({ endpoint: sub.endpoint });

            // Create new subscription
            const newSub = await reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            });

            // Save new subscription to database
            createPushSubscription({
              endpoint: newSub.endpoint,
              keys: {
                p256dh: btoa(
                  String.fromCharCode.apply(
                    null,
                    Array.from(new Uint8Array(newSub.getKey("p256dh")))
                  )
                ),
                auth: btoa(
                  String.fromCharCode.apply(
                    null,
                    Array.from(new Uint8Array(newSub.getKey("auth")))
                  )
                ),
              },
            });

            setSubscription(newSub);
            setIsSubscribed(true);
          } else {
            setSubscription(sub);
            setIsSubscribed(true);
          }
        }
        setRegistration(reg);
      });
    }
  }, [createPushSubscription, deletePushSubscription]);
};
