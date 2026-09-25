import { FastifyInstance } from "fastify";
import { env } from "./env";
import { routes } from "./routes";

export async function BootStrep(server: FastifyInstance) {

  routes(server)

  server.listen({ port: Number(env.PORT), host: "0.0.0.0", }, () => {

    console.log(`Servidor rodando na porta ${env.PORT}`)
  })

}