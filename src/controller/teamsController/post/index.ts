import { postTeamsUseCase } from "../../../service/teamsUseCase/post";
import { PostTeamsController } from "./postTeams.controller";

export const postTeamsController = new PostTeamsController(postTeamsUseCase)