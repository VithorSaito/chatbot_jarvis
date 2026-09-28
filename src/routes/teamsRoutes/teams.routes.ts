import { FastifyInstance } from "fastify";
import { postTeamsController } from "../../controller/teamsController/post";

export const teamRoutes = (server: FastifyInstance) => {

  server.post("/teams/messages",

    async (request, reply) => {

      const result = await postTeamsController.execute(request, reply)

      return reply.status(200).send(result);
    });

}