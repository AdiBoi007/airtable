"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

// Mock session to avoid CLIENT_FETCH_ERROR when auth is disabled
const mockSession = {
    expires: "2099-01-01T00:00:00.000Z",
    user: {
        id: "cmk13rex2000011ugxiyqjmkc", // Matches seed user ID
        name: "Demo User",
        email: "demo@example.com",
        image: null,
    },
}

export function NextAuthProvider({ children }: { children: React.ReactNode }) {
    // If we want to use real auth later, remove the `session` prop
    return <NextAuthSessionProvider session={mockSession}>{children}</NextAuthSessionProvider>
}
