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

            // Use nested writes for atomic and fast creation
            const table = await ctx.db.table.create({
                data: {
                    baseId: input.baseId,
                    name: input.name,
                    columns: {
                        create: [
                            { name: "Name", type: "text", order: 0 },
                            { name: "Notes", type: "text", order: 1 },
                            { name: "Status", type: "text", order: 2 },
                        ]
                    },
                    views: {
                        create: {
                            name: "Grid view",
                            config: { type: "grid" }
                        }
                    }
                },
            })

            return table
        }),
})
