import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_ACCESS_SECRET;

export default async function GuestRoute({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  console.log("check the token",token)
  if (token) {
    try {
      const decode = jwt.verify(token, JWT_SECRET);
      const role = decode.role;

      if (role === "admin") return redirect("/admin");
      if (role === "seller") return redirect("/store");
      if (role === "customer") return redirect("/customer");
      return redirect("/"); 
    } catch (err) {
      console.log("Invalid token, let them continue");
    }
  }

  return children;
}
