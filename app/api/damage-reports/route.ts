import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DamageType, DamageSeverity, ReportStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Query parameters
    const damageType = searchParams.get("damageType") as DamageType;
    const severity = searchParams.get("severity") as DamageSeverity;
    const status = searchParams.get("status") as ReportStatus;
    const isUrgent = searchParams.get("isUrgent");
    const isPeopleDamaged = searchParams.get("isPeopleDamaged");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    // Build where clause
    const where = {
      ...(damageType && { damageType }),
      ...(severity && { severity }),
      ...(status && { status }),
      ...(isUrgent !== null && { isUrgent: isUrgent === "true" }),
      ...(isPeopleDamaged !== null && {
        isPeopleDamaged: isPeopleDamaged === "true",
      }),
    };

    // Build pagination
    const take = limit ? parseInt(limit) : 50;
    const skip = offset ? parseInt(offset) : 0;

    const damageReports = await prisma.damageReport.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take,
      skip,
    });

    // Get total count for pagination
    const totalCount = await prisma.damageReport.count({ where });

    return NextResponse.json({
      damageReports,
      pagination: {
        total: totalCount,
        limit: take,
        offset: skip,
        hasMore: skip + take < totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching damage reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch damage reports" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (
      !body.title ||
      !body.description ||
      !body.location ||
      !body.damageType ||
      !body.severity
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, description, location, damageType, severity",
        },
        { status: 400 }
      );
    }

    // Validate enum values
    const validDamageTypes = Object.values(DamageType);
    const validSeverities = Object.values(DamageSeverity);

    if (!validDamageTypes.includes(body.damageType)) {
      return NextResponse.json(
        { error: "Invalid damage type" },
        { status: 400 }
      );
    }

    if (!validSeverities.includes(body.severity)) {
      return NextResponse.json(
        { error: "Invalid severity level" },
        { status: 400 }
      );
    }

    // Create damage report
    const damageReport = await prisma.damageReport.create({
      data: {
        title: body.title,
        description: body.description,
        location: body.location,
        latitude: body.latitude || null,
        longitude: body.longitude || null,
        damageType: body.damageType,
        severity: body.severity,
        status: body.status || "PENDING",
        estimatedCost: body.estimatedCost || null,
        affectedArea: body.affectedArea || null,
        priority: body.priority || 1,
        isPeopleDamaged: body.isPeopleDamaged || false,
        numberOfPeopleDamaged: body.numberOfPeopleDamaged || null,
        isUrgent: body.isUrgent || false,
        photos: body.photos || [],
        notes: body.notes || null,
        reporterName: body.reporterName || null,
        reporterEmail: body.reporterEmail || null,
        reporterPhone: body.reporterPhone || null,
      },
    });

    return NextResponse.json(damageReport, { status: 201 });
  } catch (error) {
    console.error("Error creating damage report:", error);
    return NextResponse.json(
      { error: "Failed to create damage report" },
      { status: 500 }
    );
  }
}
