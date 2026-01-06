
import { z } from "zod";
import OpenAI from "openai";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// Initialize OpenAI client
// Note: It automatically looks for process.env.OPENAI_API_KEY
// We initialize lazily to avoid crashing on import if env var is missing during dev

export const aiRouter = createTRPCRouter({
    chat: publicProcedure
        .input(z.object({
            message: z.string(),
            history: z.array(z.object({
                role: z.enum(["user", "assistant", "system"]),
                content: z.string()
            })).optional() // Phase 2: send history
        }))
        .mutation(async ({ input }) => {
            try {
                // Initialize OpenAI client dynamically to handle missing env vars gracefully
                const apiKey = process.env.OPENAI_API_KEY;
                if (!apiKey) {
                    throw new Error("Missing OpenAI API Key. Please add it to your .env file.");
                }
                const openai = new OpenAI({ apiKey });

                const messages: any[] = [
                    { role: "system", content: "You are Omni, a helpful AI assistant built into an Airtable clone. You help users manage their data, create tables, and analyze information. Be concise and friendly." },
                    ...(input.history || []),
                    { role: "user", content: input.message }
                ];

                const completion = await openai.chat.completions.create({
                    messages: messages,
                    model: "gpt-3.5-turbo", // Cost effective for basic chat
                });

                return {
                    message: completion.choices[0].message.content || "Sorry, I couldn't generate a response."
                };
            } catch (error: any) {
                console.error("OpenAI API Error:", error);
                throw new Error("Failed to communicate with AI service: " + error.message);
            }
        }),
});
