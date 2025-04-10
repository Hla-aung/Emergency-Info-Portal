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
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

// Handle background sync for earthquake data
self.addEventListener("sync", (event) => {
  if (event.tag === "fetch-earthquakes") {
    event.waitUntil(fetchEarthquakeData());
  }
});

// Function to fetch earthquake data
async function fetchEarthquakeData() {
  try {
    const response = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson"
    );
    const data = await response.json();

    // Broadcast the data to all clients
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: "EARTHQUAKE_UPDATE",
        data: data,
      });
    });

    // Check for significant earthquakes and send push notification
    const significantQuakes = data.features.filter(
      (quake: any) => quake.properties.mag >= 4.0
    );

    if (significantQuakes.length > 0) {
      const latestQuake = significantQuakes[0];
      await self.registration.showNotification("Significant Earthquake Alert", {
        body: `Magnitude ${latestQuake.properties.mag} earthquake detected near ${latestQuake.properties.place}`,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
        data: {
          url: "/earthquakes",
          quakeId: latestQuake.id,
        },
        tag: "earthquake-alert",
        requireInteraction: true,
      });
    }
  } catch (error) {
    console.error("Error fetching earthquake data:", error);
  }
}

// Handle push notifications
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();

    // If it's an earthquake notification, use custom format
    if (data.type === "earthquake") {
      event.waitUntil(
        self.registration.showNotification("Earthquake Alert", {
          body: data.message,
          icon: "/icons/icon-192x192.png",
          badge: "/icons/icon-192x192.png",

          data: {
            url: data.url || "/earthquakes",
            quakeId: data.quakeId,
          },
          tag: "earthquake-alert",

          requireInteraction: true,
        })
      );
    } else {
      // Handle other types of notifications
      event.waitUntil(
        self.registration.showNotification(data.title || "New Notification", {
          body: data.body || "You have a new notification",
          icon: "/icons/icon-192x192.png",
          badge: "/icons/icon-192x192.png",

          data: {
            url: data.url || "/",
          },
          tag: data.tag || "default-tag",

          requireInteraction: true,
        })
      );
    }
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
