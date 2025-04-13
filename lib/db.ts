import { prisma } from "./prisma";

export async function getAllSubscriptionsFromDB() {
  return prisma.pushSubscription.findMany();
}

export async function getLastEarthquakeId() {
  const alert = await prisma.earthquakeAlert.findFirst();
  return alert?.lastEarthquakeId || null;
}

export async function updateLastEarthquakeId(id: string) {
  const alert = await prisma.earthquakeAlert.findFirst();

  if (alert) {
    return prisma.earthquakeAlert.update({
      where: { id: alert.id },
      data: { lastEarthquakeId: id },
    });
  } else {
    return prisma.earthquakeAlert.create({
      data: { lastEarthquakeId: id },
    });
  }
}
