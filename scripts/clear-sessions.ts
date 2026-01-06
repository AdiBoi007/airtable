
import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

async function main() {
    console.log("Cleaning up sessions...")
    try {
        await db.session.deleteMany({})
        console.log("Sessions cleared.")
        // Optional: clear accounts if needed, but session clear is usually enough to force re-login
    } catch (e) {
        console.error("Error clearing sessions:", e)
    } finally {
        await db.$disconnect()
    }
}

main()
