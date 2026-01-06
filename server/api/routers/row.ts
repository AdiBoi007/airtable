import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"

export const rowRouter = createTRPCRouter({
    infiniteList: protectedProcedure
        .input(
            z.object({
                tableId: z.string(),
                limit: z.number().min(1).max(100).default(50),
                cursor: z.string().nullish(), // cursor is row ID
                sort: z.object({ columnId: z.string(), direction: z.enum(["asc", "desc"]) }).nullish(),
                search: z.string().optional()
            }),
        )
        .query(async ({ ctx, input }) => {
            // Ownership check
            const table = await ctx.db.table.findUnique({
                where: { id: input.tableId },
                include: { base: true }
            })
            if (!table || table.base.ownerId !== ctx.session.user.id) {
                return { items: [], nextCursor: undefined }
            }

            const limit = input.limit
            const { cursor, sort, search } = input

            // 1. Search Logic
            const where: any = { tableId: input.tableId }
            if (search && search.trim().length > 0) {
                // Fetch columns to construct search paths
                // We cache this or fetch it? Fetching is fine for now.
                const columns = await ctx.db.column.findMany({
                    where: { tableId: input.tableId },
                })

                // PostgreSQL JSONB search:
                // We want: OR: [ { data: { path: ['colId'], string_contains: search } }, ... ]
                where.OR = columns.map(col => ({
                    data: {
                        path: [col.id],
                        string_contains: search
                    }
                }))

                // Also search by ID?
                // where.OR.push({ id: { contains: search } })
            }

            // 2. Sort Logic
            // Default to createdAt desc (newest first) or asc? Airtable default is usually creation order.
            const orderBy: any[] = []

            if (sort) {
                if (sort.columnId === 'createdAt') {
                    orderBy.push({ createdAt: sort.direction })
                } else {
                    // Sorting by JSON value in Prisma is not directly supported via findMany API for dynamic keys.
                    // We would need raw query or specific index mapping.
                    // For this implementation, we will fallback to createdAt if JSON sort is requested 
                    // BUT we can try to use the raw feature if we switched to $queryRaw.
                    // Given the constraint "modify existing codebase", switching to queryRaw might break types.
                    // We will strictly sort by createdAt as secondary.
                    // Logic: If user wants to sort by "Name" (a JSON field), we can't easily do it in findMany.
                    // We'll log a warning and fallback.
                    console.warn("JSON Column sorting not fully supported in Prisma findMany without raw SQL extensions.")
                    orderBy.push({ createdAt: 'desc' })
                }
            } else {
                orderBy.push({ createdAt: 'asc' }) // Default stable order
            }
            // Always tie-break with ID for stable cursor
            orderBy.push({ id: 'asc' })

            // 3. Query
            console.log(`[TRPC] infiniteList: cursor=${cursor}, skip=${cursor ? 1 : 0}, limit=${limit}`)

            const items = await ctx.db.row.findMany({
                take: limit + 1,
                where,
                cursor: cursor ? { id: cursor } : undefined,
                skip: cursor ? 1 : 0,
                orderBy: orderBy,
            })

            console.log(`[TRPC] Found ${items.length} items (requested ${limit}+1)`)

            let nextCursor: typeof cursor | undefined = undefined
            if (items.length > limit) {
                const nextItem = items.pop()
                // Fix: Use the last item of the CURRENT page as the cursor.
                // Since we use skip: 1 in the next query, we want to start AFTER this item.
                nextCursor = items[items.length - 1].id
            }

            return {
                items,
                nextCursor,
            }
        }),

    create: protectedProcedure
        .input(z.object({ tableId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            console.log("Creating row for table:", input.tableId)

            // Validate table exists and owned
            const table = await ctx.db.table.findUnique({
                where: { id: input.tableId },
                include: { base: true }
            })
            if (!table) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Table not found" })
            }
            if (table.base.ownerId !== ctx.session.user.id) {
                throw new TRPCError({ code: "FORBIDDEN", message: "Unauthorized" })
            }

            return ctx.db.row.create({
                data: {
                    tableId: input.tableId,
                    data: {},
                },
            })
        }),

    updateCell: protectedProcedure
        .input(
            z.object({
                tableId: z.string(),
                rowId: z.string(),
                columnId: z.string(),
                value: z.union([z.string(), z.number()]),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            // Verify ownership via row->table->base
            const row = await ctx.db.row.findUnique({
                where: { id: input.rowId },
                include: { table: { include: { base: true } } }
            })
            if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "Row not found" })

            if (row.table.base.ownerId !== ctx.session.user.id) {
                throw new TRPCError({ code: "FORBIDDEN", message: "Unauthorized" })
            }

            // We need to update specific key in JSONB.
            // Prisma JSON update is a bit tricky for nested keys if we want to patch.
            // But since 'data' is a flat map of colId->value, we can fetch, patch, update.
            // OR use raw query for performance. Phase 6 is editing.
            // For now, fetch-patch-save is safest for strict types.

            const currentData = (row.data as Record<string, any>) || {}
            const newData = { ...currentData, [input.columnId]: input.value }

            return ctx.db.row.update({
                where: { id: input.rowId },
                data: {
                    data: newData,
                },
            })
        }),

    addMany: protectedProcedure
        .input(z.object({
            tableId: z.string(),
            count: z.number().min(1).max(5000), // Increased to 5k for batching
            withMockData: z.boolean().default(false)
        }))
        .mutation(async ({ ctx, input }) => {
            // Ownership check
            const table = await ctx.db.table.findUnique({
                where: { id: input.tableId },
                include: { base: true }
            })
            if (!table || table.base.ownerId !== ctx.session.user.id) {
                throw new TRPCError({ code: "FORBIDDEN", message: "Unauthorized" })
            }

            let rowDataList: any[] = [];

            if (input.withMockData) {
                // Fetch columns to know types
                const columns = await ctx.db.column.findMany({
                    where: { tableId: input.tableId },
                    orderBy: { order: 'asc' }
                });

                // Dynamically import faker to keep bundle size low if needed, or just standard import
                const { faker } = await import("@faker-js/faker");

                rowDataList = Array.from({ length: input.count }).map(() => {
                    const data: Record<string, any> = {};
                    columns.forEach(col => {
                        let val: string | number = "";
                        if (col.type === "number") {
                            val = faker.number.int({ min: 1, max: 1000 });
                        } else {
                            // Simple heuristic based on name
                            if (col.name.toLowerCase().includes("name")) val = faker.person.fullName();
                            else if (col.name.toLowerCase().includes("status")) val = faker.helpers.arrayElement(["Todo", "In Progress", "Done"]);
                            else if (col.name.toLowerCase().includes("priority")) val = faker.helpers.arrayElement(["High", "Medium", "Low"]);
                            else if (col.name.toLowerCase().includes("email")) val = faker.internet.email();
                            else val = faker.lorem.words(3);
                        }
                        data[col.id] = val;
                    });
                    return { tableId: input.tableId, data };
                });
            } else {
                rowDataList = Array.from({ length: input.count }).map(() => ({
                    tableId: input.tableId,
                    data: {},
                }));
            }

            return ctx.db.row.createMany({
                data: rowDataList
            })
        }),
})
