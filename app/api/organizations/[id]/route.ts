import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { isAuthenticated, getUser } = getKindeServerSession();
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { kindeId: user.id },
      include: {
        organizations: {
          where: {
            organizationId: params.id,
          },
          include: {
            organization: true,
          },
        },
      },
    });

    if (!dbUser || dbUser.organizations.length === 0) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const userRole = dbUser.organizations[0].role;
    const organization = dbUser.organizations[0].organization;

    // Get organization details with shelters
    const organizationWithShelters = await prisma.organization.findUnique({
      where: { id: params.id },
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
        where: { organizationId: params.id },
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
        orderBy: { createdAt: "desc" },
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
