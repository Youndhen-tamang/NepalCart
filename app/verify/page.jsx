import GuestRoute from "@/components/authentication/GuestRoute";
import VerifyCode from "@/components/authentication/Verification";


export default function verifyPage(){
  return(
    <>
    <GuestRoute>
    <VerifyCode/>
    </GuestRoute>

    </>
  )
}