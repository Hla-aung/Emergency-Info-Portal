"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useOrganizations } from "@/lib/query/use-organization";

interface Organization {
  id: string;
  kindeOrgId: string;
  name: string;
  displayName?: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  createdAt: string;
  updatedAt: string;
}

interface OrganizationContextType {
  currentOrganization: Organization | null;
  setCurrentOrganization: (org: Organization | null) => void;
  organizations: Organization[];
  isLoading: boolean;
  error: any;
  refetch: () => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useKindeBrowserClient();
  const [currentOrganization, setCurrentOrganization] =
    useState<Organization | null>(null);

  const { data, isLoading, error, refetch } = useOrganizations();
  const organizations = data?.organizations || [];

  // Set the first organization as current if none is selected
  useEffect(() => {
    if (organizations.length > 0 && !currentOrganization) {
      setCurrentOrganization(organizations[0]);
    }
  }, [organizations, currentOrganization]);

  // Clear current organization when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentOrganization(null);
    }
  }, [isAuthenticated]);

  const value: OrganizationContextType = {
    currentOrganization,
    setCurrentOrganization,
    organizations,
    isLoading,
    error,
    refetch,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganizationContext() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      "useOrganization must be used within an OrganizationProvider"
    );
  }
  return context;
}
