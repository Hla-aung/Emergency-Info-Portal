import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { ShelterResource, ShelterType } from "@prisma/client";
import { authenticateUser } from "@/lib/api/auth";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Ensure organizationId is provided
    if (!body.organizationId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    const authResult = await authenticateUser();

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { kindeUser } = authResult;

    // Check if user exists in our database
    const dbUser = await prisma.user.findUnique({
      where: { kindeId: kindeUser.id },
      include: {
        organizations: true,
      },
    });

    if (!dbUser || dbUser.organizations.length === 0) {
      return NextResponse.json(
        { error: "Access denied to organization" },
        { status: 403 }
      );
    }

    const shelter = await prisma.shelter.create({
      data: {
        ...body,
        resourcesAvailable: body.resourcesAvailable || [],
      },
    });

    return NextResponse.json(shelter);
  } catch (error) {
    console.error("Create shelter error:", error);
    return NextResponse.json(
      { error: "Failed to create shelter" },
      { status: 500 }
    );
  }
}
