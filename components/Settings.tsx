"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrganizationContext } from "@/context/organization-context";
import { PushSubscriptionContext } from "@/context/push-subscription-context";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  useCreatePushSubscription,
  useDeletePushSubscription,
} from "@/lib/query/use-push-subscriptions";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { Bell, Building2, Globe, Loader2 } from "lucide-react";
import { Locale, useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import type { MouseEventHandler } from "react";
import { use, useTransition } from "react";

export default function Settings() {
  const t = useTranslations("Settings");

  const { isAuthenticated } = useKindeAuth();

  const context = use(PushSubscriptionContext);

  if (!context) {
    return null;
  }

  const {
    isSubscribed,
    setIsSubscribed,
    subscription,
    setSubscription,
    registration,
    setRegistration,
  } = context;

  const { currentOrganization } = useOrganizationContext();

  const {
    mutate: createPushSubscription,
    isPending: isCreatingPushSubscription,
  } = useCreatePushSubscription();
  const {
    mutate: deletePushSubscription,
    isPending: isDeletingPushSubscription,
  } = useDeletePushSubscription();

  const subscribeButtonOnClick: MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
      throw new Error("Environment variables supplied not sufficient.");
    }
    if (!registration) {
      console.error("No SW registration available.");
      return;
    }
    event.preventDefault();

    // Request permission for iOS
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.error("Permission not granted for push notifications");
      return;
    }

    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });

    // Save subscription to database
    createPushSubscription({
      endpoint: sub.endpoint,
      keys: {
        p256dh: btoa(
          String.fromCharCode.apply(
            null,
            Array.from(new Uint8Array(sub.getKey("p256dh")))
          )
        ),
        auth: btoa(
          String.fromCharCode.apply(
            null,
            Array.from(new Uint8Array(sub.getKey("auth")))
          )
        ),
      },
    });

    // For iOS, we need to ensure the service worker is active
    if (registration.active) {
      registration.active.postMessage({
        type: "PUSH_SUBSCRIPTION",
        subscription: sub.toJSON(),
      });
    }

    setSubscription(sub);
    setIsSubscribed(true);
  };

  const unsubscribeButtonOnClick: MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    if (!subscription) {
      console.error("Web push not subscribed");
      return;
    }
    event.preventDefault();
    await subscription.unsubscribe();

    deletePushSubscription({
      endpoint: subscription.endpoint,
    });

    // Notify service worker about unsubscription
    if (registration.active) {
      registration.active.postMessage({
        type: "PUSH_UNSUBSCRIBE",
      });
    }

    setSubscription(null);
    setIsSubscribed(false);
  };

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();

  function onSelectChange(value: Locale) {
    const nextLocale = value;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale }
      );
    });
  }

  return (
    <div className="container p-5 lg:p-12 space-y-5 lg:space-y-8 mx-auto">
      <div>
        <h1 className="text-3xl font-bold">{t("settings")}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 w-full">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Building2 className="h-5 w-5" />

            <CardTitle>{t("organization")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                router.push("/organization-setup");
              }}
              className="w-full"
              disabled={!!currentOrganization || !isAuthenticated}
            >
              {t("create_organization")}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Bell className="h-5 w-5" />

            <CardTitle>{t("notifications")}</CardTitle>
          </CardHeader>
          <CardContent>
            {isSubscribed ? (
              <Button onClick={unsubscribeButtonOnClick} className="w-full">
                {isDeletingPushSubscription ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("disable_noti")
                )}
              </Button>
            ) : (
              <Button onClick={subscribeButtonOnClick} className="w-full">
                {isCreatingPushSubscription ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("enable_noti")
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Globe className="h-5 w-5" />

            <CardTitle>{t("language")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={locale}
              onValueChange={onSelectChange}
              defaultValue={locale}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("language")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t("english")}</SelectItem>
                <SelectItem value="my">{t("myanmar")}</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
