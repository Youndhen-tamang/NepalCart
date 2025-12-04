import GuestRoute from "@/components/authentication/GuestRoute";
import Register from "@/components/authentication/Register";


export default function RegisterPage(){
  return(
    <>
    <GuestRoute>
    <Register/>
    </GuestRoute>
    </>
  )
}