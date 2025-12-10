import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Store from "@/models/store.model";
import User from "@/models/user.model";
import CreateStoreForm from "@/components/store/CreateStoreForm";
import Loading from "@/components/Loading";

async function getStoreStatus() {
  try {
    await connectDB();
    const user = await getAuthUser();

    if (!user) {
      console.log("No authenticated user found");
      return { hasStore: false, store: null, status: null };
    }

    console.log("Checking store status for user:", user._id);

    const userDoc = await User.findById(user._id);

    if (!userDoc) {
      console.log("User document not found");
      return { hasStore: false, store: null, status: null };
    }

    if (!userDoc.storeId) {
      console.log("User has no storeId");
      return { hasStore: false, store: null, status: null };
    }

    console.log("User has storeId:", userDoc.storeId);

    const store = await Store.findById(userDoc.storeId);

    if (!store) {
      console.log("Store not found for storeId:", userDoc.storeId);
      return { hasStore: false, store: null, status: null };
    }

    console.log("Store found:", store._id, "Status:", store.status);

    return {
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
    console.error("Error stack:", error.stack);
    return { hasStore: false, store: null, status: null };
  }
}

export default async function CreateStorePage() {
  const storeStatus = await getStoreStatus();

  // If store is approved, redirect to store dashboard
  if (storeStatus.hasStore && storeStatus.status === "approved") {
    redirect("/store");
  }

  // If store exists but is pending/rejected, show status message
  if (storeStatus.hasStore) {
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
          {storeStatus.status === "pending" && (
            <p className="text-sm text-slate-400">
              Redirecting to dashboard in{" "}
              <span className="font-semibold">5 seconds</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  // Show the form if no store exists
  return <CreateStoreForm initialStatus={storeStatus} />;
}
