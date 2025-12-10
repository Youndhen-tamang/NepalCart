import { NextResponse } from "next/server";
import { getAuthUser, requireSeller } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Store from "@/models/store.model";
import User from "@/models/user.model";

export async function POST(request) {
  try {
    await connectDB();
    const user = await getAuthUser();

    if (!user) {
      console.log("Store creation failed: No authenticated user");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // JWT payload uses `id`; mongoose docs use `_id`
    const userId = user._id || user.id;

    console.log("Store creation attempt by user:", userId, "Role:", user.role);

    // Check if user already has a store
    const userDoc = await User.findById(userId);
    if (userDoc && userDoc.storeId) {
      console.log(
        "Store creation failed: User already has a store:",
        userDoc.storeId
      );
      return NextResponse.json(
        { success: false, message: "Store Already exists" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, username, email, phone, address, description, bannerImage } =
      body;

    console.log("Store creation data:", {
      name,
      username,
      email,
      phone,
      address,
      description,
      hasBannerImage: !!bannerImage,
    });

    // Validate required fields
    if (!name || !username || !email || !phone || !address || !description) {
      console.log("Store creation failed: Missing required fields");
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingStore = await Store.findOne({ username });
    if (existingStore) {
      console.log("Store creation failed: Username already exists:", username);
      return NextResponse.json(
        { success: false, message: "Username already taken" },
        { status: 400 }
      );
    }

    const store = await Store.create({
      owner: userId,
      name,
      username,
      email,
      phone,
      address,
      description,
      bannerImage: bannerImage || "",
    });

    console.log("Store created successfully:", store._id);

    await User.findByIdAndUpdate(userId, {
      storeId: store._id,
      // Optionally update role to seller when store is created
      // role: "seller"
    });

    console.log("User updated with storeId:", store._id);

    return NextResponse.json({ success: true, store }, { status: 201 });
  } catch (error) {
    console.error("Error in Store Creation:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create store" },
      { status: 400 }
    );
  }
}
