-- CreateEnum
CREATE TYPE "ShelterType" AS ENUM ('TEMPORARY', 'PERMANENT', 'MEDICAL', 'EVACUATION');

-- CreateEnum
CREATE TYPE "ShelterResource" AS ENUM ('FOOD', 'WATER', 'MEDICAL', 'BLANKETS', 'TOILETS', 'INTERNET', 'ELECTRICITY');

-- CreateTable
CREATE TABLE "Shelter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "contactName" TEXT,
    "contactPhone" TEXT,
    "type" "ShelterType" NOT NULL,
    "capacity" INTEGER NOT NULL,
    "currentOccupancy" INTEGER NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isAccessible" BOOLEAN,
    "notes" TEXT,
    "resourcesAvailable" "ShelterResource"[],
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shelter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Shelter_type_idx" ON "Shelter"("type");

-- CreateIndex
CREATE INDEX "Shelter_isAvailable_idx" ON "Shelter"("isAvailable");

-- CreateIndex
CREATE INDEX "Shelter_latitude_longitude_idx" ON "Shelter"("latitude", "longitude");
