import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  supabase,
  getOrganizationChannel,
  REALTIME_EVENTS,
} from "@/lib/supabase";
import { authenticateUser } from "@/lib/api/auth";

export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticateUser();

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { kindeUser } = authResult;

    // Check if user exists in our database
    const dbUser = await prisma.user.findUnique({
      where: { kindeId: kindeUser.id },
    });

    const { action, organizationId, organizationName } = await req.json();

    if (action === "create") {
      // Create new organization
      if (!organizationName) {
        return NextResponse.json(
          { error: "Organization name is required" },
          { status: 400 }
        );
      }

      const organization = await prisma.organization.create({
        data: {
          kindeOrgId: `org_${Date.now()}`, // You might want to get this from Kinde API
          name: organizationName,
          displayName: organizationName,
          users: {
            create: {
              userId: dbUser.id,
              role: "OWNER",
            },
          },
        },
        include: {
          users: {
            include: {
              user: true,
            },
          },
        },
      });

      return NextResponse.json({ organization });
    }

    if (action === "join") {
      // Join existing organization
      if (!organizationId) {
        return NextResponse.json(
          { error: "Organization ID is required" },
          { status: 400 }
        );
      }

      const organization = await prisma.organization.findUnique({
        where: { kindeOrgId: organizationId },
      });

      if (!organization) {
        return NextResponse.json(
          { error: "Organization not found" },
          { status: 404 }
        );
      }

      // Check if user is already a member
      const existingMembership = await prisma.userOrganization.findUnique({
        where: {
          userId_organizationId: {
            userId: dbUser.id,
            organizationId: organization.id,
          },
        },
      });

      if (existingMembership) {
        return NextResponse.json(
          { error: "User is already a member of this organization" },
          { status: 400 }
        );
      }

      // Add user to organization
      const newMembership = await prisma.userOrganization.create({
        data: {
          userId: dbUser.id,
          organizationId: organization.id,
          role: "MEMBER",
        },
        include: {
          user: true,
        },
      });

      // Broadcast real-time event for member join
      try {
        const channel = supabase.channel(
          getOrganizationChannel(organization.id)
        );

        await channel.send({
          type: "broadcast",
          event: REALTIME_EVENTS.MEMBER_JOINED,
          payload: {
            type: REALTIME_EVENTS.MEMBER_JOINED,
            organizationId: organization.id,
            data: {
              member: {
                id: newMembership.id,
                email: newMembership.user.email,
                firstName: newMembership.user.firstName,
                lastName: newMembership.user.lastName,
                role: newMembership.role,
                joinedAt: newMembership.createdAt.toISOString(),
              },
            },
            timestamp: new Date().toISOString(),
          },
        });
      } catch (broadcastError) {
        console.error("Failed to broadcast member join event:", broadcastError);
        // Don't fail the request if broadcasting fails
      }

      return NextResponse.json({
        message: "Successfully joined organization",
        organization,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Organization API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateUser();

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { kindeUser } = authResult;

    const userWithOrganizations = await prisma.user.findUnique({
      where: { kindeId: kindeUser.id },
      include: {
        organizations: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!userWithOrganizations) {
      return NextResponse.json({ organizations: [] });
    }

    return NextResponse.json({
      organizations: userWithOrganizations.organizations.map((uo) => ({
        ...uo.organization,
        role: uo.role,
      })),
    });
  } catch (error) {
    console.error("Get organizations error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
