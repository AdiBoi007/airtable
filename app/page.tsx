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

  // Debug Mode: Nuke the Dashboard to prove updates are working and inspect session
  return (
    <div className="p-10 font-mono">
      <h1 className="text-4xl text-red-600 font-bold mb-4">DEBUG MODE ACTIVE</h1>
      <p className="mb-4">If you see this, the deployment UPDATED.</p>
      <div className="bg-gray-100 p-4 rounded text-sm break-all">
        <strong>Server Session Data:</strong>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
    </div>
  )
}

