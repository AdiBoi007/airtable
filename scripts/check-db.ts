import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

async function main() {
    const bases = await db.base.findMany()
    console.log('Bases:', bases)

    const tables = await db.table.findMany()
    console.log('Tables:', tables)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })
