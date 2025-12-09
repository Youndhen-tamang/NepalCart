import { getAuthUser, requireSeller } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Store from "@/models/store.model";
import User from "@/models/user.model";


export async function POST(request) {
  
  try {
    await connectDB();
    const user  = await getAuthUser();
    if(!requireSeller(user)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if(user.storeId) return NextResponse.json({ message: "Store Already exists" }, { status: 400 });
    const body =  request.json()
    const {name,username,email,phone,address,description} =body;
    
    const store =await Store.create({
      owner:user._id,
      name,
      username,
      email,
      phone,
      address,
      description

    })

    await User.findByIdAndUpdate(user._id,{
      storeId : store._id
    })
    return NextResponse.json({ success: true, store }, { status: 201 });

  } catch (error) {
    console.log("error in Store Creation ")
    return NextResponse.json({ success: false, message:error.message }, { status: 400 });

  }
}