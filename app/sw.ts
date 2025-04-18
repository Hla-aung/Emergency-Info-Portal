import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    clients: Clients;
  }
  interface NotificationOptions {
    actions?: Array<{ action: string; title: string }>;
    vibrate?: number[];
    renotify?: boolean;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher: ({ request }) => {
          return request.destination === "document";
        },
      },
    ],
  },
});

const resubscribeToPush = async () => {
  const sub = await self.registration.pushManager.getSubscription();
  if (sub) {
    await sub.unsubscribe();
    await fetch("/api/push-subscriptions", {
      method: "DELETE",
      body: JSON.stringify({
        endpoint: sub.endpoint,
      }),
    });
  }
  const newSub = await self.registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  });
  await fetch("/api/push-subscriptions", {
    method: "POST",
    body: JSON.stringify({
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
    }),
  });
};

// Handle push notifications
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title || "New Notification", {
        body: data.body || "You have a new notification",
        icon: "/android-chrome-192x192.png",
        badge: "/android-chrome-192x192.png",
        data: {
          url: self.location.href.includes("/my")
            ? "/my" + data.url
            : "/en" + data.url,
        },
        tag: data.tag || "default-tag",

        actions: [
          {
            action: "view",
            title: "View",
          },
        ],
        renotify: true,
      })
    );

    event.waitUntil(resubscribeToPush());
  }
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "view" || event.action === "open") {
    const url = event.notification.data.url;
    event.waitUntil(
      self.clients.matchAll({ type: "window" }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
      })
    );
  }
});

serwist.addEventListeners();
