import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateUser } from "@/lib/api/auth";

export async function PATCH(
  request: Request,
  {
    params,
  }: { params: Promise<{ id: string; shelterId: string; occupantId: string }> }
) {
  try {
    const { id, shelterId, occupantId } = await params;
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

    // Check if occupant exists and belongs to the organization
    const occupant = await prisma.occupant.findUnique({
      where: {
        id: occupantId,
        shelterId,
        organizationId: id,
      },
    });

    if (!occupant) {
      return NextResponse.json(
        { error: "Occupant not found" },
        { status: 404 }
      );
    }

    // Update occupant
    const updatedOccupant = await prisma.occupant.update({
      where: { id: occupantId },
      data: {
        ...body,
        age: body.age ? parseInt(body.age) : undefined,
      },
    });

    // If checking out, update shelter's current occupancy
    if (body.isCheckedIn === false && occupant.isCheckedIn) {
      // Count current checked-in occupants (the occupant has already been updated to checked-out)
      const currentOccupants = await prisma.occupant.count({
        where: {
          shelterId,
          isCheckedIn: true,
        },
      });

      await prisma.shelter.update({
        where: { id: shelterId },
        data: {
          currentOccupancy: currentOccupants,
        },
      });
    }

    return NextResponse.json(updatedOccupant);
  } catch (error) {
    console.error("Error updating occupant:", error);
    return NextResponse.json(
      { error: "Failed to update occupant" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  {
    params,
  }: { params: Promise<{ id: string; shelterId: string; occupantId: string }> }
) {
  try {
    const { id, shelterId, occupantId } = await params;

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

    // Check if occupant exists and belongs to the organization
    const occupant = await prisma.occupant.findUnique({
      where: {
        id: occupantId,
        shelterId,
        organizationId: id,
      },
    });

    if (!occupant) {
      return NextResponse.json(
        { error: "Occupant not found" },
        { status: 404 }
      );
    }

    // Delete occupant
    await prisma.occupant.delete({
      where: { id: occupantId },
    });

    // Update shelter's current occupancy if occupant was checked in
    if (occupant.isCheckedIn) {
      const currentOccupants = await prisma.occupant.count({
        where: {
          shelterId,
          isCheckedIn: true,
        },
      });

      await prisma.shelter.update({
        where: { id: shelterId },
        data: {
          currentOccupancy: currentOccupants,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting occupant:", error);
    return NextResponse.json(
      { error: "Failed to delete occupant" },
      { status: 500 }
    );
  }
}
