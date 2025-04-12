import { prisma } from "./prisma";

export async function getAllSubscriptionsFromDB() {
  return prisma.pushSubscription.findMany();
}
