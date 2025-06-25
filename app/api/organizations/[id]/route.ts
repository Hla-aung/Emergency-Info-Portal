import { authenticateUser } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const userRole = dbUser.organizations[0].role;

    // Get organization details with shelters
    const organizationWithShelters = await prisma.organization.findUnique({
      where: { id: id },
      include: {
        shelters: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!organizationWithShelters) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // If user is OWNER or ADMIN, also include members
    let members = null;
    if (userRole === "OWNER" || userRole === "ADMIN") {
      members = await prisma.userOrganization.findMany({
        where: { organizationId: id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      });
    }

    // Calculate shelter statistics
    const totalShelters = organizationWithShelters.shelters.length;
    const availableShelters = organizationWithShelters.shelters.filter(
      (shelter) => shelter.isAvailable
    ).length;
    const totalCapacity = organizationWithShelters.shelters.reduce(
      (sum, shelter) => sum + shelter.capacity,
      0
    );
    const totalOccupancy = organizationWithShelters.shelters.reduce(
      (sum, shelter) => sum + shelter.currentOccupancy,
      0
    );

    return NextResponse.json({
      organization: organizationWithShelters,
      userRole,
      statistics: {
        totalShelters,
        availableShelters,
        totalCapacity,
        totalOccupancy,
        occupancyRate:
          totalCapacity > 0 ? (totalOccupancy / totalCapacity) * 100 : 0,
      },
      members,
    });
  } catch (error) {
    console.error("Get organization details error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
