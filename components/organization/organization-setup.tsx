"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCreateOrganization,
  useJoinOrganization,
} from "@/lib/query/use-organization";
import { ArrowRight, Building2, Loader2, Plus, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface OrganizationSetupProps {
  onComplete?: () => void;
}

export function OrganizationSetup({ onComplete }: OrganizationSetupProps) {
  const t = useTranslations("Organization");
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("create");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationPhone, setOrganizationPhone] = useState("");
  const [organizationId, setOrganizationId] = useState("");

  const createOrganization = useCreateOrganization();
  const joinOrganization = useJoinOrganization();

  const handleCreateOrganization = async () => {
    if (!organizationName.trim()) return;

    try {
      await createOrganization.mutateAsync({
        action: "create",
        organizationName: organizationName.trim(),
        organizationPhone: organizationPhone.trim(),
      });

      onComplete?.();
      router.push(`/dashboard`);
    } catch (error) {
      console.error("Failed to create organization:", error);
    }
  };

  const handleJoinOrganization = async () => {
    if (!organizationId.trim()) return;

    try {
      await joinOrganization.mutateAsync({
        action: "join",
        organizationId: organizationId.trim(),
      });

      onComplete?.();
      router.push(`/dashboard`);
    } catch (error) {
      console.error("Failed to join organization:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>{t("setupTitle")}</CardTitle>
          <CardDescription>{t("setupDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t("createNew")}
              </TabsTrigger>
              <TabsTrigger value="join" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t("joinExisting")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-5 mt-5">
              <div className="space-y-2">
                <label htmlFor="org-name" className="text-sm font-medium">
                  {t("organizationName")}
                </label>
                <Input
                  id="org-name"
                  placeholder={t("organizationNamePlaceholder")}
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  disabled={createOrganization.isPending}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="org-phone" className="text-sm font-medium">
                  {t("organizationPhone")}
                </label>
                <Input
                  id="org-phone"
                  placeholder={t("organizationPhonePlaceholder")}
                  value={organizationPhone}
                  onChange={(e) => setOrganizationPhone(e.target.value)}
                  disabled={createOrganization.isPending}
                />
              </div>

              {createOrganization.error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {createOrganization.error.message || t("createError")}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleCreateOrganization}
                disabled={
                  !organizationName.trim() || createOrganization.isPending
                }
                className="w-full"
              >
                {createOrganization.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("creating")}
                  </>
                ) : (
                  <>
                    {t("createOrganization")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="join" className="space-y-4 mt-5">
              <div className="space-y-2">
                <label htmlFor="org-id" className="text-sm font-medium">
                  {t("organizationId")}
                </label>
                <Input
                  id="org-id"
                  placeholder={t("organizationIdPlaceholder")}
                  value={organizationId}
                  onChange={(e) => setOrganizationId(e.target.value)}
                  disabled={joinOrganization.isPending}
                />
                <p className="text-xs text-muted-foreground">
                  {t("organizationIdHelp")}
                </p>
              </div>

              {joinOrganization.error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {joinOrganization.error.message || t("joinError")}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleJoinOrganization}
                disabled={!organizationId.trim() || joinOrganization.isPending}
                className="w-full"
              >
                {joinOrganization.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("joining")}
                  </>
                ) : (
                  <>
                    {t("joinOrganization")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
