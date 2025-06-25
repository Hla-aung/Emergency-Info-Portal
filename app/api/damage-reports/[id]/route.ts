import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DamageType, DamageSeverity, ReportStatus } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const damageReport = await prisma.damageReport.findUnique({
      where: { id },
    });

    if (!damageReport) {
      return NextResponse.json(
        { error: "Damage report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(damageReport);
  } catch (error) {
    console.error("Error fetching damage report:", error);
    return NextResponse.json(
      { error: "Failed to fetch damage report" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if damage report exists
    const existingReport = await prisma.damageReport.findUnique({
      where: { id },
    });

    if (!existingReport) {
      return NextResponse.json(
        { error: "Damage report not found" },
        { status: 404 }
      );
    }

    // Validate enum values if provided
    if (body.damageType) {
      const validDamageTypes = Object.values(DamageType);
      if (!validDamageTypes.includes(body.damageType)) {
        return NextResponse.json(
          { error: "Invalid damage type" },
          { status: 400 }
        );
      }
    }

    if (body.severity) {
      const validSeverities = Object.values(DamageSeverity);
      if (!validSeverities.includes(body.severity)) {
        return NextResponse.json(
          { error: "Invalid severity level" },
          { status: 400 }
        );
      }
    }

    if (body.status) {
      const validStatuses = Object.values(ReportStatus);
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
    }

    // Update damage report
    const updatedReport = await prisma.damageReport.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.description && { description: body.description }),
        ...(body.location && { location: body.location }),
        ...(body.latitude !== undefined && { latitude: body.latitude }),
        ...(body.longitude !== undefined && { longitude: body.longitude }),
        ...(body.damageType && { damageType: body.damageType }),
        ...(body.severity && { severity: body.severity }),
        ...(body.status && { status: body.status }),
        ...(body.estimatedCost !== undefined && {
          estimatedCost: body.estimatedCost,
        }),
        ...(body.affectedArea !== undefined && {
          affectedArea: body.affectedArea,
        }),
        ...(body.priority !== undefined && { priority: body.priority }),
        ...(body.isPeopleDamaged !== undefined && {
          isPeopleDamaged: body.isPeopleDamaged,
        }),
        ...(body.numberOfPeopleDamaged !== undefined && {
          numberOfPeopleDamaged: body.numberOfPeopleDamaged,
        }),
        ...(body.isUrgent !== undefined && { isUrgent: body.isUrgent }),
        ...(body.photos && { photos: body.photos }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.reporterName !== undefined && {
          reporterName: body.reporterName,
        }),
        ...(body.reporterEmail !== undefined && {
          reporterEmail: body.reporterEmail,
        }),
        ...(body.reporterPhone !== undefined && {
          reporterPhone: body.reporterPhone,
        }),
      },
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error("Error updating damage report:", error);
    return NextResponse.json(
      { error: "Failed to update damage report" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if damage report exists
    const existingReport = await prisma.damageReport.findUnique({
      where: { id },
    });

    if (!existingReport) {
      return NextResponse.json(
        { error: "Damage report not found" },
        { status: 404 }
      );
    }

    // Delete damage report
    await prisma.damageReport.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Damage report deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting damage report:", error);
    return NextResponse.json(
      { error: "Failed to delete damage report" },
      { status: 500 }
    );
  }
}
