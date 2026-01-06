import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "@/server/db"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    session: ({ session, user, token }) => {
      if (session.user) {
        if (user?.id) {
          // @ts-ignore
          session.user.id = user.id
        } else if (token?.sub) {
          // @ts-ignore
          session.user.id = token.sub
        }
      }
      return session
    },
  },
}
