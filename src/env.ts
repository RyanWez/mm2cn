import { z } from "zod";

const envSchema = z.object({
    OLLAMA_API_KEY: z.string().min(1, "OLLAMA_API_KEY is required"),
    KV_REST_API_URL: z.string().url().optional(),
    KV_REST_API_TOKEN: z.string().optional(),
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
    console.error(
        "❌ Invalid environment variables:",
        JSON.stringify(env.error.format(), null, 4)
    );
    process.exit(1);
}

export const ENV = env.data;
