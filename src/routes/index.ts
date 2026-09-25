import { FastifyInstance } from "fastify";
import { teamRoutes } from "./teamsRoutes/teams.routes";

export const routes = (server: FastifyInstance) => {

  server.register(teamRoutes)

}