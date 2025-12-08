import DashboardMainLayout from "@/components/store/Mainlayout";
import { getAuthUser, requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  if (!requireRole(user, ["seller"])) {
    redirect("/customer");
  }

  return <DashboardMainLayout />;
}
