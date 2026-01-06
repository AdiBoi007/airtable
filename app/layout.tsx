import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Airtable Clone",
  description: "A pixel-perfect Airtable clone UI",
  generator: 'v0.app'
}

import { NextAuthProvider } from "@/components/providers/session-provider"

import { TRPCReactProvider } from "@/trpc/client"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <NextAuthProvider>
          <TRPCReactProvider>
            {children}
          </TRPCReactProvider>
        </NextAuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
