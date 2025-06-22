-- CreateTable
CREATE TABLE "Occupant" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "age" INTEGER,
    "gender" TEXT,
    "phone" TEXT,
    "emergencyContact" TEXT,
    "emergencyContactPhone" TEXT,
    "medicalConditions" TEXT,
    "specialNeeds" TEXT,
    "checkInTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkOutTime" TIMESTAMP(3),
    "isCheckedIn" BOOLEAN NOT NULL DEFAULT true,
    "shelterId" TEXT NOT NULL,
    "organizationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Occupant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Occupant_shelterId_idx" ON "Occupant"("shelterId");

-- CreateIndex
CREATE INDEX "Occupant_organizationId_idx" ON "Occupant"("organizationId");

-- CreateIndex
CREATE INDEX "Occupant_isCheckedIn_idx" ON "Occupant"("isCheckedIn");

-- CreateIndex
CREATE INDEX "Occupant_checkInTime_idx" ON "Occupant"("checkInTime");

-- AddForeignKey
ALTER TABLE "Occupant" ADD CONSTRAINT "Occupant_shelterId_fkey" FOREIGN KEY ("shelterId") REFERENCES "Shelter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Occupant" ADD CONSTRAINT "Occupant_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
