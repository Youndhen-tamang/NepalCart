import GuestRoute from "@/components/authentication/GuestRoute";
import Login from "@/components/authentication/Login";


export default function LoginPage(){
    return(
        <>
        <GuestRoute>
            <Login/>
        </GuestRoute>
        </>
    )
}