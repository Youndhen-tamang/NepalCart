"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Loading from "../Loading";
import verifyCode from "@/fetch/verifyCode";

export default function VerifyCode() {
    const router = useRouter();
    const params = useSearchParams();
    const email = params.get("email");

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");

        const data = await verifyCode({ email, code });
        setLoading(false);

        if (!data.success) {
            setMsg(data.message);
            return;
        }

        router.push(data.redirectTo);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl">

                {/* Logo Section */}
                <div className="flex flex-col items-center mb-6">
                    <h1 className="relative text-6xl mb-10 font-semibold text-slate-700">
                        <span className="text-green-600">go</span>cart
                        <span className="text-green-600 text-5xl leading-0">.</span>

                        <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                            plus
                        </p>
                    </h1>

                    <h2 className="text-3xl font-bold text-slate-700">Verify your Email</h2>
                    <p className="text-sm text-gray-500 text-center">
                        We&#39;ve sent a 6&#45;digit verification code to&#58;
                        <br />
                        <span className="font-semibold">{email}</span>
                    </p>
                </div>

                {msg && <p className="text-red-500 text-sm mb-4">{msg}</p>}

                <form onSubmit={handleVerify} className="space-y-5">
                    <input
                        type="text"
                        placeholder="Enter verification code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold transition shadow-md"
                    >
                        {loading ? <Loading /> : "Verify Code"}
                    </button>
                </form>

                <p className="mt-6 text-sm text-gray-500 text-center">
                    Didn&#39;t receive the code&#63;
                    <span className="text-green-600 font-semibold cursor-pointer hover:underline ml-1">
                        Resend
                    </span>
                </p>
            </div>
        </div>
    );
}
