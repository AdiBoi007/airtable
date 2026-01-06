import { createTRPCRouter } from "@/server/api/trpc"
import { baseRouter } from "@/server/api/routers/base"
import { tableRouter } from "@/server/api/routers/table"
import { columnRouter } from "@/server/api/routers/column"
import { rowRouter } from "@/server/api/routers/row"
import { viewRouter } from "@/server/api/routers/view"
import { aiRouter } from "@/server/api/routers/ai"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    base: baseRouter,
    table: tableRouter,
    column: columnRouter,
    row: rowRouter,
    view: viewRouter,
    ai: aiRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
