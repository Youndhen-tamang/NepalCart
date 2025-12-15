import { redirect } from "next/navigation";
import { connectDB } from "@/lib/connectDB";
import { getAuthUser } from "@/lib/auth";
import CustomerLayout from "@/components/customer/CustomerLayout";

export const metadata = {
  title: "NepalCart - Customer Dashboard",
  description: "Customer dashboard for orders, wishlist, and profile.",
};

export default async function CustomerRootLayout({ children }) {
  await connectDB();
  const user = await getAuthUser();

  if (!user) redirect("/login");
  if (user.role !== "customer") redirect("/");

  return <CustomerLayout user={user}>{children}</CustomerLayout>;
}
