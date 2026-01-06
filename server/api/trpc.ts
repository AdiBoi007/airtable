import { initTRPC, TRPCError } from "@trpc/server"
import { type CreateNextContextOptions } from "@trpc/server/adapters/next"
import { getServerSession } from "next-auth"
import superjson from "superjson"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/server/db"

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */

type CreateContextOptions = {
    session: Awaited<ReturnType<typeof getServerSession>> | null
}

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
export const createInnerTRPCContext = (opts: CreateContextOptions) => {
    return {
        session: opts.session,
        db,
    }
}

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
// MOCKED DEMO USER CONTEXT
export const createTRPCContext = async (_opts: any) => {
    // Always return a demo session
    return createInnerTRPCContext({
        session: {
            user: {
                id: "demo_user_id",
                name: "Demo User",
                email: "demo@example.com",
                image: ""
            },
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
        }
    })
}

/**
 * 2. INITIALIZATION
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError: error.cause instanceof z.ZodError ? error.cause.flatten() : null,
            },
        }
    },
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

/**
 * Protected procedure - now just a pass-through since we always have a demo user
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
    return next({
        ctx: {
            // We know session.user is present because we mocked it
            session: { ...ctx.session, user: ctx.session!.user },
        },
    })
})
