"use client";

import { useOrganizationContext } from "@/context/organization-context";
import { OrganizationDashboard } from "@/components/organization/organization-dashboard";

export default function DashboardPage() {
  const { currentOrganization } = useOrganizationContext();

  if (!currentOrganization) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">
            No Organization Selected
          </h2>
          <p className="text-muted-foreground">
            Please select an organization to view the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return <OrganizationDashboard organizationId={currentOrganization.id} />;
}
