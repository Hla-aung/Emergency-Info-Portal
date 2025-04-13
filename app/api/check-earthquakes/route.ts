import { NextResponse } from "next/server";
import webpush from "web-push";
import {
  getAllSubscriptionsFromDB,
  getLastEarthquakeId,
  updateLastEarthquakeId,
} from "@/lib/db";

export async function POST() {
  try {
    const usgsURL =
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson";
    const r = await fetch(usgsURL);
    const json = await r.json();

    const latest = json.features?.[0];
    const lastId = await getLastEarthquakeId();

    if (!latest || latest.id === lastId) {
      return NextResponse.json({ message: "No new earthquakes" });
    }

    await updateLastEarthquakeId(latest.id);

    const title = "🌍 Earthquake Alert";
    const body = `Magnitude ${latest.properties.mag} earthquake detected near ${latest.properties.place}`;

    const payload = JSON.stringify({
      title,
      body,
      tag: "earthquake-alert",
      url: "/",
    });

    // Set VAPID keys
    webpush.setVapidDetails(
      `mailto:${process.env.WEB_PUSH_EMAIL}`,
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );

    const subscriptions = await getAllSubscriptionsFromDB();
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            payload
          );
          return { success: true, endpoint: sub.endpoint };
        } catch (err) {
          console.error("Failed to send notification", err);
          return { success: false, endpoint: sub.endpoint, error: err };
        }
      })
    );

    const failedSubscriptions = results
      .filter(
        (result): result is PromiseRejectedResult =>
          result.status === "rejected"
      )
      .map((result) => result.reason);

    return NextResponse.json({
      message: "Notification sent",
      id: latest.id,
      failedSubscriptions,
    });
  } catch (error) {
    console.error("Error checking earthquakes:", error);
    return NextResponse.json(
      { error: "Failed to check earthquakes" },
      { status: 500 }
    );
  }
}
