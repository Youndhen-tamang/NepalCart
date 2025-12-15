// app/create-store/page.jsx  (or wherever your CreateStorePage lives)

import { redirect } from "next/navigation";
import { getAuthUser, requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Store from "@/models/store.model";
import User from "@/models/user.model";
import CreateStoreForm from "@/components/store/CreateStoreForm";

async function getStoreStatus() {
  try {
    await connectDB();
    const user = await getAuthUser();

    if (!user) {
      return { user: null, hasStore: false, store: null, status: null };
    }

    // requireRole will check user's role from payload
    if (!requireRole(user, ["seller"])) {
      // authenticated but not a seller
      return { user, hasStore: false, store: null, status: null, notSeller: true };
    }

    const userId = user._id || user.id;
    const userDoc = await User.findById(userId);

    if (!userDoc || !userDoc.storeId) {
      return { user, hasStore: false, store: null, status: null };
    }

    const store = await Store.findById(userDoc.storeId);
    if (!store) {
      return { user, hasStore: false, store: null, status: null };
    }

    return {
      user,
      hasStore: true,
      store: {
        id: store._id,
        name: store.name,
        username: store.username,
        description: store.description,
        email: store.email,
        phone: store.phone,
        address: store.address,
        bannerImage: store.bannerImage,
        status: store.status,
        createdAt: store.createdAt,
      },
      status: store.status || null,
    };
  } catch (error) {
    console.error("Error fetching store status:", error);
    return { user: null, hasStore: false, store: null, status: null };
  }
}

export default async function CreateStorePage() {
  const storeStatus = await getStoreStatus();

  // Not authenticated -> redirect to login
  if (!storeStatus.user) {
    redirect("/login");
  }

  // Authenticated but not a seller -> redirect to customer area
  if (storeStatus.notSeller) {
    redirect("/customer");
  }

  // Seller who already has a store -> redirect to dashboard
  if (storeStatus.hasStore) {
    // If store is approved, send to store dashboard
    if (storeStatus.status === "approved") {
      redirect("/store");
    }

    // If store exists but pending/rejected — show status message (server render)
    const statusMessages = {
      pending:
        "Your store application is pending approval. We'll notify you once it's reviewed.",
      rejected:
        "Your store application was rejected. Please contact support for more information.",
      approved: "Your store has been approved!",
    };

    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-700 mb-4">
            Store Application Status
          </h2>
          <p className="text-lg text-slate-500 mb-6">
            {statusMessages[storeStatus.status] || "Unknown status"}
          </p>
        </div>
      </div>
    );
  }

  // Seller without a store -> show the client form
  return <CreateStoreForm initialStatus={storeStatus} />;
}
