import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function getCurrentUser() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const authenticated = await isAuthenticated();
  if (!authenticated) return null;
  return getUser();
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    throw new Error("Unauthorized");
  }
  return user;
}
