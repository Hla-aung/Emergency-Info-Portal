import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const shelter = await prisma.shelter.findUnique({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    // const supabase = createRouteHandlerClient({ cookies });
    // const {
    //   data: { session },
    // } = await supabase.auth.getSession();

    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const body = await request.json();
    const shelter = await prisma.shelter.update({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    // const supabase = createRouteHandlerClient({ cookies });
    // const {
    //   data: { session },
    // } = await supabase.auth.getSession();

    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    await prisma.shelter.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete shelter" },
      { status: 500 }
    );
  }
}
