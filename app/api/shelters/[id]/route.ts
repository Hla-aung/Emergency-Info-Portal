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
