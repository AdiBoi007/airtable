import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"

export const columnRouter = createTRPCRouter({
    listByTable: protectedProcedure
        .input(z.object({ tableId: z.string() }))
        .query(async ({ ctx, input }) => {
            const table = await ctx.db.table.findUnique({
                where: { id: input.tableId },
                include: { base: true }
            })
            if (!table || table.base.ownerId !== ctx.session.user.id) return []

            return ctx.db.column.findMany({
                where: { tableId: input.tableId },
                orderBy: { order: "asc" },
            })
        }),

    create: protectedProcedure
        .input(
            z.object({
                tableId: z.string(),
                name: z.string().min(1),
                type: z.enum(["text", "number"]), // restricted types per phase 2
            }),
        )
        .mutation(async ({ ctx, input }) => {
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

            const lastCol = await ctx.db.column.findFirst({
                where: { tableId: input.tableId },
                orderBy: { order: "desc" },
            })
            const newOrder = lastCol ? lastCol.order + 1 : 0

            return ctx.db.column.create({
                data: {
                    tableId: input.tableId,
                    name: input.name,
                    type: input.type,
                    order: newOrder,
                },
            })
        }),
})
