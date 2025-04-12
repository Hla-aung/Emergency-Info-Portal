import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const subscriptions = await prisma.pushSubscription.findMany();

    return NextResponse.json(subscriptions, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const subscription = await request.json();

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json(
        { error: "Invalid subscription data" },
        { status: 400 }
      );
    }

    const { endpoint, keys } = subscription;

    // Check if subscription already exists
    const existingSubscription = await prisma.pushSubscription.findUnique({
      where: { endpoint },
    });

    if (existingSubscription) {
      return NextResponse.json(
        { message: "Subscription already exists" },
        { status: 200 }
      );
    }

    // Create new subscription
    const newSubscription = await prisma.pushSubscription.create({
      data: {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId: null,
      },
    });

    return NextResponse.json(
      {
        message: "Subscription saved successfully",
        subscription: newSubscription,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving subscription:", error);
    return NextResponse.json(
      { error: "Failed to save subscription" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { endpoint } = await request.json();

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint is required" },
        { status: 400 }
      );
    }

    await prisma.pushSubscription.delete({
      where: { endpoint },
    });

    return NextResponse.json(
      { message: "Subscription deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete subscription" },
      { status: 500 }
    );
  }
}
