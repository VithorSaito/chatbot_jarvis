import "dotenv/config";
import z from "zod";

export const env = z
  .object({
    PORT: z.string(),
    DIFY_API_URL: z.string(),
    DIFY_API_KEY: z.string(),
    NODE_TLS_REJECT_UNAUTHORIZED: z.string()
  })
  .parse(process.env);