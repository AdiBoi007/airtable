import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

async function main() {
    console.log("Attempting to create table with transaction...")

    // Create a base first if needed, or pick existing
    const base = await db.base.findFirst()
    if (!base) {
        console.error("No base found to attach table to.")
        return
    }

    try {
        const result = await db.$transaction(async (tx) => {
            const table = await tx.table.create({
                data: {
                    baseId: base.id,
                    name: "Debug Table " + Date.now(),
                },
            })
            console.log("Table created:", table.id)

            // Create default columns
            await tx.column.createMany({
                data: [
                    { tableId: table.id, name: "Name", type: "text", order: 0 },
                    { tableId: table.id, name: "Notes", type: "text", order: 1 },
                    { tableId: table.id, name: "Status", type: "text", order: 2 },
                ]
            })
            console.log("Columns created")

            // Create default view
            await tx.view.create({
                data: {
                    tableId: table.id,
                    name: "Grid view",
                    // type: "grid", // REMOVED as per fix
                    config: { type: "grid" },
                }
            })
            console.log("View created")

            return table
        })
        console.log("Transaction success:", result)
    } catch (e) {
        console.error("Transaction failed:")
        console.error(e)
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })
