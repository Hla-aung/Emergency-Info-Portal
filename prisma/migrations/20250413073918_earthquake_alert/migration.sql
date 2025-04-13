-- CreateTable
CREATE TABLE "EarthquakeAlert" (
    "id" TEXT NOT NULL,
    "lastEarthquakeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EarthquakeAlert_pkey" PRIMARY KEY ("id")
);
