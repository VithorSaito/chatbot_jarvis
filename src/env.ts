import "dotenv/config";
import z from "zod";

export const env = z
  .object({
    PORT: z.string(),
  })
  .parse(process.env);