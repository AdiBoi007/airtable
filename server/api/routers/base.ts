import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

export const baseRouter = createTRPCRouter({
    list: protectedProcedure.query(async ({ ctx }) => {
        // For now, return all bases owned by user.
        return ctx.db.base.findMany({
            where: {
                ownerId: ctx.session.user.id,
            },
            orderBy: { createdAt: "desc" },
        })
    }),

    create: protectedProcedure
        .input(z.object({ name: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            // Ensure Demo User exists to satisfy Foreign Key constraint
            await ctx.db.user.upsert({
                where: { id: ctx.session.user.id },
                update: {},
                create: {
                    id: ctx.session.user.id,
                    name: ctx.session.user.name,
                    email: ctx.session.user.email,
                }
            })

            // Execute sequentially to avoid transaction timeouts
            const base = await ctx.db.base.create({
                data: {
                    name: input.name,
                    ownerId: ctx.session.user.id,
                },
            })

            // Create default table
            const table = await ctx.db.table.create({
                data: {
                    baseId: base.id,
                    name: "Table 1",
                }
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

            return {
                ...base,
                defaultTableId: table.id
            }
        }),
})
