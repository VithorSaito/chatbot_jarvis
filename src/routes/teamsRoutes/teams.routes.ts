import { FastifyInstance } from "fastify";

export const teamRoutes = (server: FastifyInstance) => {

  server.post("/teams/messages", async (request, reply) => {
    console.log("Recebi algo do Teams!");

    const enable = true

    console.log(request.body);

    return reply.status(200).send();
  });

}