import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Store from "@/models/store.model";
import User from "@/models/user.model";

export async function GET() {
  try {
    await connectDB();
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userDoc = await User.findById(user._id).populate("storeId");
    
    if (!userDoc || !userDoc.storeId) {
      return NextResponse.json({
        success: true,
        hasStore: false,
        store: null,
      });
    }

    const store = await Store.findById(userDoc.storeId);

    return NextResponse.json({
      success: true,
      hasStore: true,
      store: store ? {
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
      } : null,
    });
  } catch (error) {
    console.error("Error checking store status:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

