import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { authenticateUser } from "@/lib/api/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const { id, memberId } = await params;

    if (!memberId) {
      return NextResponse.json(
        { error: "Member ID is required" },
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
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const userRole = dbUser.organizations[0].role;

    // Only OWNER or ADMIN can remove members
    if (userRole !== "OWNER" && userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Check if the member exists in the organization
    const memberToRemove = await prisma.userOrganization.findFirst({
      where: {
        userId: memberId,
        organizationId: id,
      },
      include: {
        user: true,
      },
    });

    if (!memberToRemove) {
      return NextResponse.json(
        { error: "Member not found in organization" },
        { status: 404 }
      );
    }

    // Prevent OWNER from removing themselves (at least one OWNER should remain)
    if (
      memberToRemove.role === "OWNER" &&
      memberToRemove.userId === dbUser.id
    ) {
      return NextResponse.json(
        { error: "Cannot remove yourself as the organization owner" },
        { status: 400 }
      );
    }

    // Prevent removing the last OWNER
    if (memberToRemove.role === "OWNER") {
      const ownerCount = await prisma.userOrganization.count({
        where: {
          organizationId: id,
          role: "OWNER",
        },
      });

      if (ownerCount <= 1) {
        return NextResponse.json(
          { error: "Cannot remove the last owner from the organization" },
          { status: 400 }
        );
      }
    }

    // Remove the member from the organization
    await prisma.userOrganization.delete({
      where: {
        id: memberToRemove.id,
      },
    });

    return NextResponse.json({
      message: "Member removed successfully",
      removedMember: {
        id: memberToRemove.user.id,
        email: memberToRemove.user.email,
        firstName: memberToRemove.user.firstName,
        lastName: memberToRemove.user.lastName,
        role: memberToRemove.role,
      },
    });
  } catch (error) {
    console.error("Remove member error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
