import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";

export interface AuthenticatedUser {
  kindeUser: any;
}

export async function authenticateUser(): Promise<
  AuthenticatedUser | NextResponse
> {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUser();
  if (!user || !user.id) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return {
    kindeUser: user,
  };
}
