import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
  title: "NepalCart - Admin",
  description: "NepalCart - Admin",
};

export default function RootAdminLayout({ children }) {
  return (
    <>
      <AdminLayout>{children}</AdminLayout>
    </>
  );
}
