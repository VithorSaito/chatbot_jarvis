import { FastifyInstance } from "fastify";
import { teamsSchema } from "./schemas";

export const teamRoutes = (server: FastifyInstance) => {

  server.post("/teams/messages",
    // {
    //   schema: teamsSchema.chat
    // },
    async (request, reply) => {
      console.log("Recebi algo do Teams!");

      const data = teamsSchema.chat.body.parse(request.body)

      console.log(data)

      return reply.status(200).send();
    });

}