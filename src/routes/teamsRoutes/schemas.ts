import z from "zod"

export const teamsSchema = {
  chat: {
    body: z.object({
      text: z.string()
    })
  }
}