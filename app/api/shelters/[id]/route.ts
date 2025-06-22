import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateUser } from "@/lib/api/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const shelter = await prisma.shelter.findUnique({
      where: { id: id },
    });

    if (!shelter) {
      return NextResponse.json({ error: "Shelter not found" }, { status: 404 });
    }

    return NextResponse.json(shelter);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch shelter" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const authResult = await authenticateUser();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { dbUser } = authResult;

    if (!dbUser || dbUser.organizations.length === 0) {
      return NextResponse.json(
        { error: "Access denied to organization" },
        { status: 403 }
      );
    }

    const shelter = await prisma.shelter.update({
      where: { id: id, organizationId: dbUser.organizations[0].id },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const authResult = await authenticateUser();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { dbUser } = authResult;

    if (!dbUser || dbUser.organizations.length === 0) {
      return NextResponse.json(
        { error: "Access denied to organization" },
        { status: 403 }
      );
    }

    await prisma.shelter.delete({
      where: { id: id, organizationId: dbUser.organizations[0].id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete shelter" },
      { status: 500 }
    );
  }
}
