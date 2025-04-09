export async function subscribeToPushNotifications() {
  try {
    // Check if push notifications are supported
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      throw new Error("Push notifications are not supported in this browser");
    }

    const registration = await navigator.serviceWorker.ready;

    // Check if we already have a subscription
    const existingSubscription =
      await registration.pushManager.getSubscription();
    if (existingSubscription) {
      return existingSubscription;
    }

    // Request permission for iOS
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Permission not granted for push notifications");
    }

    // Subscribe with VAPID key
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });

    // For iOS, we need to ensure the service worker is active
    if (registration.active) {
      registration.active.postMessage({
        type: "PUSH_SUBSCRIPTION",
        subscription: subscription.toJSON(),
      });
    }

    return subscription;
  } catch (error) {
    console.error("Error subscribing to push notifications:", error);
    throw error;
  }
}

export async function unsubscribeFromPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();

      // Notify service worker about unsubscription
      if (registration.active) {
        registration.active.postMessage({
          type: "PUSH_UNSUBSCRIBE",
        });
      }
    }
  } catch (error) {
    console.error("Error unsubscribing from push notifications:", error);
    throw error;
  }
}
