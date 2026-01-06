"use client"

import { signIn, useSession } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AirtableLogo } from "@/components/icons/airtable-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Use a simple Google icon SVG
function GoogleIcon() {
    return (
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
            />
            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
            />
            <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21.81-.63z"
                fill="#FBBC05"
            />
            <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
            />
        </svg>
    )
}

function AppleIcon() {
    return (
        <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 24 24">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.02 3.65-1.06 1.68-.05 3.03 1.16 3.9 1.59-3.21 2.05-2.58 7.42 1.37 8.52-.5 1.4-1.21 2.5-2.14 3.45-.61.64-1.28 1.19-1.86.73zM12.03 7.25c-.25-2.11 1.25-3.79 3.09-4.25.41 2.61-2.09 4.31-3.09 4.25z" />
        </svg>
    )
}

import { Suspense } from "react"
// ... keep imports but add Suspense logic

function LoginForm() {
    // ... logic from original LoginPage
    const { data: session, status } = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"
    const [email, setEmail] = useState("")

    useEffect(() => {
        if (status === "authenticated") {
            router.replace(callbackUrl)
        }
    }, [status, router, callbackUrl])

    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl })
    }

    if (status === "loading") {
        return <div className="flex min-h-screen items-center justify-center bg-white"><div className="text-sm text-gray-500">Loading...</div></div>
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4 font-sans text-slate-900">
            <div className="w-full max-w-[400px] space-y-8">
                {/* Logo */}
                <div className="flex justify-center">
                    <AirtableLogo className="h-12 w-12" />
                </div>

                {/* Heading */}
                <h1 className="text-center text-[32px] font-bold tracking-tight text-[#111111]">
                    Welcome to Airtable
                </h1>

                {/* Form Container */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-semibold text-[#111111]">
                            Work email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@company.com"
                            className="h-12 rounded-lg border-gray-300 px-4 text-base focus-visible:ring-1 focus-visible:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <Button
                        className="h-12 w-full rounded-lg bg-[#5B89F7] text-[15px] font-semibold text-white hover:bg-[#4a78e6]"
                        onClick={() => { }} // Dummy for now
                    >
                        Continue with email
                    </Button>

                    {/* Divider */}
                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="mx-4 text-sm text-gray-500">or</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* Social Logins */}
                    <div className="space-y-3">
                        <Button
                            variant="outline"
                            className="flex h-12 w-full items-center justify-center rounded-full border border-gray-300 bg-white text-[15px] font-semibold text-[#111111] hover:bg-gray-50"
                            onClick={handleGoogleLogin}
                        >
                            <GoogleIcon />
                            Continue with Google
                        </Button>

                        <Button
                            variant="outline"
                            className="flex h-12 w-full items-center justify-center rounded-full border border-gray-300 bg-white text-[15px] font-semibold text-gray-400 hover:bg-white hover:text-gray-400 cursor-not-allowed opacity-60"
                            disabled
                        >
                            <AppleIcon />
                            Continue with Apple
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-white"><div className="text-sm text-gray-500">Loading...</div></div>}>
            <LoginForm />
        </Suspense>
    )
}
