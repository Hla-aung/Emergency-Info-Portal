import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DamageType, DamageSeverity, ReportStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build date filter
    const dateFilter = {
      ...(startDate &&
        endDate && {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
    };

    // Get total counts
    const totalReports = await prisma.damageReport.count({
      where: dateFilter,
    });

    const urgentReports = await prisma.damageReport.count({
      where: {
        ...dateFilter,
        isUrgent: true,
      },
    });

    const peopleDamagedReports = await prisma.damageReport.count({
      where: {
        ...dateFilter,
        isPeopleDamaged: true,
      },
    });

    // Get counts by damage type
    const damageTypeStats = await prisma.damageReport.groupBy({
      by: ["damageType"],
      where: dateFilter,
      _count: {
        damageType: true,
      },
    });

    // Get counts by severity
    const severityStats = await prisma.damageReport.groupBy({
      by: ["severity"],
      where: dateFilter,
      _count: {
        severity: true,
      },
    });

    // Get counts by status
    const statusStats = await prisma.damageReport.groupBy({
      by: ["status"],
      where: dateFilter,
      _count: {
        status: true,
      },
    });

    // Get recent reports (last 7 days)
    const recentReports = await prisma.damageReport.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // Get total estimated cost
    const costStats = await prisma.damageReport.aggregate({
      where: {
        ...dateFilter,
        estimatedCost: {
          not: null,
        },
      },
      _sum: {
        estimatedCost: true,
      },
      _avg: {
        estimatedCost: true,
      },
      _count: {
        estimatedCost: true,
      },
    });

    // Get total people damaged
    const peopleStats = await prisma.damageReport.aggregate({
      where: {
        ...dateFilter,
        numberOfPeopleDamaged: {
          not: null,
        },
      },
      _sum: {
        numberOfPeopleDamaged: true,
      },
      _avg: {
        numberOfPeopleDamaged: true,
      },
    });

    // Format the statistics
    const statistics = {
      overview: {
        totalReports,
        urgentReports,
        peopleDamagedReports,
        recentReports,
        totalEstimatedCost: costStats._sum.estimatedCost || 0,
        averageEstimatedCost: costStats._avg.estimatedCost || 0,
        totalPeopleDamaged: peopleStats._sum.numberOfPeopleDamaged || 0,
        averagePeoplePerReport: peopleStats._avg.numberOfPeopleDamaged || 0,
      },
      byDamageType: damageTypeStats.map((stat) => ({
        damageType: stat.damageType,
        count: stat._count.damageType,
      })),
      bySeverity: severityStats.map((stat) => ({
        severity: stat.severity,
        count: stat._count.severity,
      })),
      byStatus: statusStats.map((stat) => ({
        status: stat.status,
        count: stat._count.status,
      })),
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error("Error fetching damage report statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch damage report statistics" },
      { status: 500 }
    );
  }
}
