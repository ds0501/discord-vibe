import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { WelcomeDashboard } from "@/components/server/welcome-dashboard";

export default async function ServersPage() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  if (!(await isAuthenticated())) redirect("/login");
  const user = await getUser();
  if (!user?.id) redirect("/login");

  const name = user.given_name || user.email?.split("@")[0] || "유저";

  return <WelcomeDashboard userName={name} />;
}
