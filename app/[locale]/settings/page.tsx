"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { usePathname, useRouter } from "@/i18n/navigation";
import { ApiManager } from "@/lib/api/axios";
import {
  useCreatePushSubscription,
  useDeletePushSubscription,
  usePushSubscriptions,
} from "@/lib/hooks/use-push-subscriptions";
import { Bell, Globe, Loader2 } from "lucide-react";
import { Locale, useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import type { MouseEventHandler } from "react";
import { useEffect, useState, useTransition } from "react";

export default function Settings() {
  const t = useTranslations("Settings");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  usePushSubscriptions();

  const {
    mutate: createPushSubscription,
    isPending: isCreatingPushSubscription,
  } = useCreatePushSubscription();
  const {
    mutate: deletePushSubscription,
    isPending: isDeletingPushSubscription,
  } = useDeletePushSubscription();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.serwist !== undefined
    ) {
      // run only in browser
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          if (
            sub &&
            !(
              sub.expirationTime &&
              Date.now() > sub.expirationTime - 5 * 60 * 1000
            )
          ) {
            setSubscription(sub);
            setIsSubscribed(true);
          }
        });
        setRegistration(reg);
      });
    }
  }, []);

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

  const sendNotificationButtonOnClick: MouseEventHandler<
    HTMLButtonElement
  > = async (event) => {
    event.preventDefault();

    if (!subscription) {
      alert("Web push not subscribed");
      return;
    }

    try {
      await ApiManager.post("/notification", JSON.stringify({ subscription }));
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "TimeoutError") {
          console.error("Timeout: It took too long to get the result.");
        } else if (err.name === "AbortError") {
          console.error(
            "Fetch aborted by user action (browser stop button, closing tab, etc.)"
          );
        } else if (err.name === "TypeError") {
          console.error("The AbortSignal.timeout() method is not supported.");
        } else {
          // A network error, or some other problem.
          console.error(`Error: type: ${err.name}, message: ${err.message}`);
        }
      } else {
        console.error(err);
      }
      alert("An error happened.");
    }
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
            <Bell className="h-5 w-5" />

            <CardTitle>{t("notifications")}</CardTitle>
          </CardHeader>
          <CardContent>
            {isSubscribed ? (
              <Button onClick={unsubscribeButtonOnClick}>
                {isDeletingPushSubscription ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("disable_noti")
                )}
              </Button>
            ) : (
              <Button onClick={subscribeButtonOnClick}>
                {isCreatingPushSubscription ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("enable_noti")
                )}
              </Button>
            )}
            {isSubscribed && (
              <Button
                onClick={sendNotificationButtonOnClick}
                className="w-full mt-3"
              >
                Send Noti Test
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
