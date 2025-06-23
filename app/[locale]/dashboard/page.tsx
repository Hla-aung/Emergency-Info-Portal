"use client";

import { useOrganizationContext } from "@/context/organization-context";
import { OrganizationDashboard } from "@/components/organization/organization-dashboard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { currentOrganization } = useOrganizationContext();

  if (!currentOrganization) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-5">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">
            No Organization Selected
          </h2>
          <p className="text-muted-foreground">
            Please create or join an organization to view the dashboard.
          </p>
        </div>
        <Button onClick={() => router.push("/organization-setup")}>
          Create or Join Organization
        </Button>
      </div>
    );
  }

  return <OrganizationDashboard organizationId={currentOrganization.id} />;
}
