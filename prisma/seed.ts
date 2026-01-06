import { PrismaClient } from "@prisma/client"
import { faker } from "@faker-js/faker"

const prisma = new PrismaClient()

async function main() {
    console.log("Start seeding ...")

    // Create a default user if none exists (for local dev)
    const user = await prisma.user.upsert({
        where: { email: "user@example.com" },
        update: {},
        create: {
            email: "user@example.com",
            name: "Demo User",
            image: "https://github.com/shadcn.png",
        },
    })

    // Create 1 Base
    const base = await prisma.base.create({
        data: {
            name: "Project Tracker",
            ownerId: user.id,
        },
    })

    // Create 1 Table
    const table = await prisma.table.create({
        data: {
            name: "Tasks",
            baseId: base.id,
        },
    })

    // Create 6 Columns
    const colTypes = ["text", "text", "number", "text", "number", "text"]
    const colNames = ["Task Name", "Status", "Priority", "Assignee", "Estimated Hours", "Notes"]

    for (let i = 0; i < 6; i++) {
        await prisma.column.create({
            data: {
                tableId: table.id,
                name: colNames[i],
                type: colTypes[i],
                order: i,
            },
        })
    }

    // Create 50 Rows
    console.log("Creating 50 rows...")
    const rowsData = []

    // Use explicit typing for the array to avoid TS error, or just any
    const columns: any[] = await prisma.column.findMany({ where: { tableId: table.id } })

    for (let i = 0; i < 50; i++) {
        const rowData: Record<string, string | number> = {}

        columns.forEach((col) => {
            let val: string | number = ""
            if (col.name === "Task Name") val = faker.hacker.verb() + " " + faker.hacker.noun()
            else if (col.name === "Status") val = faker.helpers.arrayElement(["Todo", "In Progress", "Done", "Blocked"])
            else if (col.name === "Priority") val = faker.number.int({ min: 1, max: 5 })
            else if (col.name === "Assignee") val = faker.person.fullName()
            else if (col.name === "Estimated Hours") val = faker.number.int({ min: 1, max: 40 })
            else if (col.name === "Notes") val = faker.lorem.sentence()

            rowData[col.id] = val
        })

        rowsData.push({
            tableId: table.id,
            data: rowData,
        })
    }

    await prisma.row.createMany({
        data: rowsData,
    })

    console.log("Seeding finished.")
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
