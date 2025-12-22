import { connectDB } from "@/lib/connectDB";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardModules from "@/components/customer/DashboardModules";
import { getCustomerdata } from "@/fetch/customer.server";

export default async function CustomerDashboard() {
  await connectDB();
  const user = await getAuthUser();
  const customer = await getCustomerdata(user.id);
  console.log("fronted end custoemr fetch",customer)
  if (!user) redirect("/login");
  if (user.role !== "customer") redirect("/");

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-white border border-slate-200 rounded-xl p-5">
        <p className="text-sm text-slate-600">Customer Dashboard</p>
        <h1 className="text-2xl font-semibold text-slate-800 mt-1">
          Hello, {customer?.name || "there"} — manage your NepalCart account here.
        </h1>
      </div>
      <DashboardModules />
    </div>
  );
}
