-- CreateEnum
CREATE TYPE "DamageSeverity" AS ENUM ('MINOR', 'MODERATE', 'SEVERE', 'CRITICAL');

-- CreateEnum
CREATE TYPE "DamageType" AS ENUM ('PERSON', 'STRUCTURAL', 'INFRASTRUCTURE', 'UTILITIES', 'ROADS', 'BRIDGES', 'BUILDINGS', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "DamageReport" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "damageType" "DamageType" NOT NULL,
    "severity" "DamageSeverity" NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "estimatedCost" DOUBLE PRECISION,
    "affectedArea" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "isPeopleDamaged" BOOLEAN NOT NULL DEFAULT false,
    "numberOfPeopleDamaged" INTEGER,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "photos" TEXT[],
    "notes" TEXT,
    "reporterName" TEXT,
    "reporterEmail" TEXT,
    "reporterPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DamageReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DamageReport_status_idx" ON "DamageReport"("status");

-- CreateIndex
CREATE INDEX "DamageReport_severity_idx" ON "DamageReport"("severity");

-- CreateIndex
CREATE INDEX "DamageReport_damageType_idx" ON "DamageReport"("damageType");

-- CreateIndex
CREATE INDEX "DamageReport_createdAt_idx" ON "DamageReport"("createdAt");

-- CreateIndex
CREATE INDEX "DamageReport_isUrgent_idx" ON "DamageReport"("isUrgent");

-- CreateIndex
CREATE INDEX "DamageReport_isPeopleDamaged_idx" ON "DamageReport"("isPeopleDamaged");

-- CreateIndex
CREATE INDEX "DamageReport_numberOfPeopleDamaged_idx" ON "DamageReport"("numberOfPeopleDamaged");
