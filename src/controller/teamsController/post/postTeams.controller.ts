import { FastifyReply, FastifyRequest } from 'fastify'
import { teamsSchema } from '../../../routes/teamsRoutes/schemas'
import { PostTeamsUseCase } from '../../../service/teamsUseCase/post/postTeams.usecase'
export class PostTeamsController {
  constructor(private postTeamsUseCase: PostTeamsUseCase) { }

  async execute(request: FastifyRequest, reply: FastifyReply) {

    const data = teamsSchema.chat.body.parse(request.body)

    const response = await this.postTeamsUseCase.execute({ question: data.text })

    return reply.send({
      type: "message",
      text: response,
    });
  }
}