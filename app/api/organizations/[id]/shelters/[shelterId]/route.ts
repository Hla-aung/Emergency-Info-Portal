import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateUser } from "@/lib/api/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; shelterId: string }> }
) {
  try {
    const { id, shelterId } = await params;

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

    const shelter = await prisma.shelter.findUnique({
      where: { id: shelterId, organizationId: id },
      include: {
        occupants: {
          orderBy: {
            checkInTime: "asc",
          },
        },
      },
    });

    return NextResponse.json(shelter);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get shelter" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; shelterId: string }> }
) {
  try {
    const { id, shelterId } = await params;
    const body = await request.json();

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

    // Validate required fields
    if (!body.firstName) {
      return NextResponse.json(
        { error: "First name is required" },
        { status: 400 }
      );
    }

    // Check if shelter exists and belongs to the organization
    const shelter = await prisma.shelter.findUnique({
      where: { id: shelterId, organizationId: id },
    });

    if (!shelter) {
      return NextResponse.json({ error: "Shelter not found" }, { status: 404 });
    }

    // Check if shelter has capacity
    const currentOccupants = await prisma.occupant.count({
      where: {
        shelterId,
        isCheckedIn: true,
      },
    });

    if (currentOccupants >= shelter.capacity) {
      return NextResponse.json(
        { error: "Shelter is at full capacity" },
        { status: 400 }
      );
    }

    // Create new occupant
    const occupant = await prisma.occupant.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        age: body.age ? parseInt(body.age) : null,
        gender: body.gender,
        phone: body.phone,
        emergencyContact: body.emergencyContact,
        emergencyContactPhone: body.emergencyContactPhone,
        medicalConditions: body.medicalConditions,
        specialNeeds: body.specialNeeds,
        shelterId,
        organizationId: id,
      },
    });

    // Update shelter's current occupancy
    await prisma.shelter.update({
      where: { id: shelterId },
      data: {
        currentOccupancy: currentOccupants + 1,
      },
    });

    return NextResponse.json(occupant, { status: 201 });
  } catch (error) {
    console.error("Error creating occupant:", error);
    return NextResponse.json(
      { error: "Failed to create occupant" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; shelterId: string }> }
) {
  try {
    const { id, shelterId } = await params;
    const body = await request.json();

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

    const shelter = await prisma.shelter.update({
      where: { id: shelterId, organizationId: id },
      data: {
        ...body,
        resourcesAvailable: body.resourcesAvailable || undefined,
      },
    });

    return NextResponse.json(shelter);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update shelter" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; shelterId: string }> }
) {
  try {
    const { id, shelterId } = await params;

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

    await prisma.shelter.delete({
      where: { id: shelterId, organizationId: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete shelter" },
      { status: 500 }
    );
  }
}
