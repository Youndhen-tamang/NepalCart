import Login from "@/components/authentication/Login";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const user = await getAuthUser();
    console.log("this is token to comfirm",user)
    if(user){
        redirect('/')
    }
  return (
    <>
      <Login />
    </>
  );
}
