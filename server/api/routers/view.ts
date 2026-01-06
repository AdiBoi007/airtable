import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"

export const viewRouter = createTRPCRouter({
    listByTable: protectedProcedure
        .input(z.object({ tableId: z.string() }))
        .query(async ({ ctx, input }) => {
            // Check ownership via relation
            const table = await ctx.db.table.findUnique({
                where: { id: input.tableId },
                include: { base: true }
            })
            if (!table || table.base.ownerId !== ctx.session.user.id) return []

            return ctx.db.view.findMany({
                where: { tableId: input.tableId },
                orderBy: { createdAt: "asc" },
            })
        }),

    create: protectedProcedure
        .input(z.object({ tableId: z.string(), name: z.string().min(1), type: z.string().default("grid") }))
        .mutation(async ({ ctx, input }) => {
            // Validate table exists and owned by user
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

            // Default config
            const config = {
                sort: [],
                filter: [],
                hiddenColumns: []
            }
            return ctx.db.view.create({
                data: {
                    tableId: input.tableId,
                    name: input.name,
                    config,
                },
            })
        }),

    update: protectedProcedure
        .input(z.object({ viewId: z.string(), config: z.any() }))
        .mutation(async ({ ctx, input }) => {
            // Verify ownership first
            const view = await ctx.db.view.findUnique({
                where: { id: input.viewId },
                include: { table: { include: { base: true } } }
            })
            if (!view) {
                throw new TRPCError({ code: "NOT_FOUND", message: "View not found" })
            }
            if (view.table.base.ownerId !== ctx.session.user.id) {
                throw new TRPCError({ code: "FORBIDDEN", message: "Unauthorized" })
            }

            return ctx.db.view.update({
                where: { id: input.viewId },
                data: { config: input.config }
            })
        })
})
