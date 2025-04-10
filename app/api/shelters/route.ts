import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { ShelterResource, ShelterType } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as ShelterType;
    const isAvailable = searchParams.get("isAvailable");
    const hasResources = searchParams
      .get("hasResources")
      ?.split(",") as ShelterResource[];
    const location = searchParams.get("location");

    const where = {
      ...(type && { type: type }),
      ...(isAvailable !== null && { isAvailable: isAvailable === "true" }),
      ...(hasResources && {
        resourcesAvailable: {
          hasSome: hasResources,
        },
      }),
    };

    const shelters = await prisma.shelter.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(shelters);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch shelters" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const shelter = await prisma.shelter.create({
      data: {
        ...body,
        resourcesAvailable: body.resourcesAvailable || [],
      },
    });

    return NextResponse.json(shelter);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create shelter" },
      { status: 500 }
    );
  }
}
