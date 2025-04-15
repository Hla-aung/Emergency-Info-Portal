import { createContext, useState } from "react";

interface PushSubscriptionContextType {
  isSubscribed: boolean;
  setIsSubscribed: (isSubscribed: boolean) => void;
  subscription: PushSubscription | null;
  setSubscription: (subscription: PushSubscription | null) => void;
  registration: ServiceWorkerRegistration | null;
  setRegistration: (registration: ServiceWorkerRegistration | null) => void;
}

const PushSubscriptionContext =
  createContext<PushSubscriptionContextType | null>(null);

const PushSubscriptionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  return (
    <PushSubscriptionContext
      value={{
        isSubscribed,
        setIsSubscribed,
        subscription,
        setSubscription,
        registration,
        setRegistration,
      }}
    >
      {children}
    </PushSubscriptionContext>
  );
};

export { PushSubscriptionContext, PushSubscriptionProvider };
