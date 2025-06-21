import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
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

    const { action, organizationId, organizationName } = await req.json();

    // Check if user exists in our database
    let dbUser = await prisma.user.findUnique({
      where: { kindeId: user.id },
    });

    if (!dbUser) {
      // Create user if doesn't exist
      dbUser = await prisma.user.create({
        data: {
          kindeId: user.id,
          email: user.email || "",
          firstName: user.given_name || null,
          lastName: user.family_name || null,
        },
      });
    }

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
      await prisma.userOrganization.create({
        data: {
          userId: dbUser.id,
          organizationId: organization.id,
          role: "MEMBER",
        },
      });

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
          include: {
            organization: true,
          },
        },
      },
    });

    if (!dbUser) {
      return NextResponse.json({ organizations: [] });
    }

    return NextResponse.json({
      organizations: dbUser.organizations.map((uo) => ({
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
