"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

const navItems = [
  { href: "/customer", label: "Dashboard" },
  { href: "/customer#orders", label: "Orders" },
  { href: "/customer#addresses", label: "Addresses" },
  { href: "/customer#wishlist", label: "Wishlist" },
  { href: "/customer#support", label: "Support" },
];

export default function CustomerLayout({ user, children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-6">
          <p className="text-sm text-slate-500">Welcome back</p>
          <h1 className="text-3xl font-semibold text-slate-800">
            {user?.name || "Customer"}
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[220px,1fr] gap-6">
          <aside className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <nav className="flex flex-col">
              {navItems.map((item) => {
                const active =
                  item.href === "/customer"
                    ? pathname === "/customer"
                    : pathname.startsWith("/customer");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-3 text-sm font-medium border-b border-slate-100 last:border-b-0 hover:bg-slate-50 ${
                      active ? "text-green-600" : "text-slate-600"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main className="min-h-[70vh]">{children}</main>
        </div>
      </div>
    </div>
  );
}
