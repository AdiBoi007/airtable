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
            // Use nested writes to create everything in one go (Base -> Table -> Columns + View)
            const base = await ctx.db.base.create({
                data: {
                    name: input.name,
                    ownerId: ctx.session.user.id,
                    tables: {
                        create: {
                            name: "Table 1",
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
                        }
                    }
                },
                include: {
                    tables: {
                        take: 1
                    }
                }
            })

            return {
                ...base,
                defaultTableId: base.tables[0].id
            }
        }),
})
