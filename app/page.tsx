import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Dashboard from "@/components/home/dashboard"

export const dynamic = "force-dynamic"


export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth")
  }

  return <Dashboard />
}
