import { env } from "../../../env"

interface ConversationDTO {
  question: string
}

export class PostTeamsUseCase {
  constructor() { }

  async execute(data: ConversationDTO) {

    const url = `${env.DIFY_API_URL}/workflows/run`;

    console.log("URL:", url);

    const generateResponse = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.DIFY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: {
          question: data.question,
        },
        response_mode: "blocking",
        user: "teams-user",
      }),
    });

    const body = await generateResponse.text();

    return body;

  }
}