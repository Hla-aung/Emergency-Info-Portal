"use client";

import { PushSubscriptionProvider } from "@/context/push-subscription-context";
import { OrganizationProvider } from "@/context/organization-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <KindeProvider>
      <QueryClientProvider client={queryClient}>
        <OrganizationProvider>
          <PushSubscriptionProvider>{children}</PushSubscriptionProvider>
        </OrganizationProvider>
      </QueryClientProvider>
    </KindeProvider>
  );
}
