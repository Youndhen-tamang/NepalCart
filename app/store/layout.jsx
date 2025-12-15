import StoreLayout from "@/components/store/StoreLayout";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/connectDB";
import { getAuthUser } from "@/lib/auth";
import User from "@/models/user.model";
export const metadata = {
  title: "NepalCart - Store Dashboard",
  description: "NepalCart - Store Dashboard",
};

export default async function RootAdminLayout({ children }) {
  await connectDB();
  const user = await getAuthUser();

  if (!user) redirect("/login");

  if (user.role !== "seller") redirect("/customer");

  const userDoc = await User.findById(user._id || user.id);

  if (!userDoc || !userDoc.storeId) {
    redirect("/create-store");
  }

  return (
    <>
      <StoreLayout>{children}</StoreLayout>
    </>
  );
}
