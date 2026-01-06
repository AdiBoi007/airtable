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
/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (_opts: { req?: Request, res?: any }) => {
    // In App Router, we use getServerSession without req/res
    let session = null
    try {
        session = await getServerSession(authOptions)
    } catch (e) {
        console.error("Error getting session in trpc context:", e)
        // If session fetch fails (e.g. DB timeout), throw 500 instead of 401
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to retrieve session",
            cause: e
        })
    }

    return createInnerTRPCContext({
        session,
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
 * Protected procedure
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
    }
    return next({
        ctx: {
            // infers the `session` as non-nullable
            session: { ...ctx.session, user: ctx.session.user },
        },
    })
})
