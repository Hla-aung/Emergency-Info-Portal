"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useOrganizations } from "@/lib/query/use-organization";

export function useOrganizationSetup() {
  const { isAuthenticated } = useKindeBrowserClient();
  const { data: organizationsData, isLoading } = useOrganizations();
  const router = useRouter();
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const organizations = organizationsData?.organizations || [];

      // If user is authenticated but has no organizations, they need setup
      if (organizations.length === 0) {
        setNeedsSetup(true);

        // Redirect to organization setup page if not already there
        const currentPath = window.location.pathname;
        if (!currentPath.includes("/organization-setup")) {
          router.push("/organization-setup");
        }
      } else {
        setNeedsSetup(false);
      }
    }
  }, [isAuthenticated, isLoading, organizationsData, router]);

  return {
    needsSetup,
    isLoading,
    organizations: organizationsData?.organizations || [],
  };
}
