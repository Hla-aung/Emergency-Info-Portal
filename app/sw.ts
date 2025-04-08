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

// Register background sync
self.addEventListener("sync", (event) => {
  if (event.tag === "fetch-earthquakes") {
    event.waitUntil(fetchEarthquakes());
  }
});

// Function to fetch earthquake data
async function fetchEarthquakes() {
  try {
    const response = await fetch(
      // "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2025-03-01&minlatitude=9&maxlatitude=30&minlongitude=90&maxlongitude=110"
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson"
    );
    const data = await response.json();

    // Send message to all clients with new earthquake data
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: "EARTHQUAKE_UPDATE",
        data: data,
      });
    });

    // Check for new earthquakes and send notifications
    const registration = await self.registration;
    const cache = await caches.open("earthquake-cache");
    const cachedResponse = await cache.match("earthquakes");
    let previousQuakes = [];

    if (cachedResponse) {
      const cachedData = await cachedResponse.json();
      previousQuakes = cachedData.features || [];
    }

    const newQuakes = data.features.filter((quake: any) => {
      return !previousQuakes.some((oldQuake: any) => oldQuake.id === quake.id);
    });

    // Send notifications for new earthquakes
    for (const quake of newQuakes) {
      await registration.showNotification("New Earthquake Alert!", {
        body: `${quake.properties.title} - Magnitude: ${quake.properties.mag}`,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
        data: {
          url: "/",
          earthquake: quake,
        },
      });
    }

    // Update cache
    await cache.put("earthquakes", new Response(JSON.stringify(data)));
  } catch (error) {
    console.error("Error in background sync:", error);
  }
}

// Handle push notifications
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || "You have a new notification",
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
      vibrate: [100, 50, 100],
      data: {
        url: data.url || "/",
      },
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || "New Notification",
        options
      )
    );
  }
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === event.notification.data.url && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(event.notification.data.url);
      }
    })
  );
});

serwist.addEventListeners();
