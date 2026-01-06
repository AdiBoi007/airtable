import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"

export const tableRouter = createTRPCRouter({
    // Router for table operations
    listByBase: protectedProcedure
        .input(z.object({ baseId: z.string() }))
        .query(async ({ ctx, input }) => {
            const base = await ctx.db.base.findUnique({
                where: { id: input.baseId },
            })
            if (!base || base.ownerId !== ctx.session.user.id) {
                return []
            }

            return ctx.db.table.findMany({
                where: { baseId: input.baseId },
                orderBy: { createdAt: "asc" },
            })
        }),

    create: protectedProcedure
        .input(z.object({ baseId: z.string(), name: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            console.log("Creating table for base:", input.baseId)

            const base = await ctx.db.base.findUnique({ where: { id: input.baseId } })
            if (!base) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Base not found" })
            }
            if (base.ownerId !== ctx.session.user.id) {
                throw new TRPCError({ code: "FORBIDDEN", message: "Unauthorized" })
            }

            // Execute sequentially for better performance on non-pooled connections
            const table = await ctx.db.table.create({
                data: {
                    baseId: input.baseId,
                    name: input.name,
                },
            })

            // Create default columns
            await ctx.db.column.createMany({
                data: [
                    { tableId: table.id, name: "Name", type: "text", order: 0 },
                    { tableId: table.id, name: "Notes", type: "text", order: 1 },
                    { tableId: table.id, name: "Status", type: "text", order: 2 },
                ]
            })

            // Create default view
            await ctx.db.view.create({
                data: {
                    tableId: table.id,
                    name: "Grid view",
                    config: { type: "grid" },
                }
            })

            return table
        }),
})
