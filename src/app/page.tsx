import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const { isAuthenticated } = getKindeServerSession();
  const authenticated = await isAuthenticated();

  if (authenticated) {
    redirect("/servers");
  } else {
    redirect("/login");
  }
}
