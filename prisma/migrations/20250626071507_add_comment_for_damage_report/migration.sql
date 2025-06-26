-- CreateTable
CREATE TABLE "DamageReportComment" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "damageReportId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DamageReportComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DamageReportComment" ADD CONSTRAINT "DamageReportComment_damageReportId_fkey" FOREIGN KEY ("damageReportId") REFERENCES "DamageReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
