import { Configuration, OpenAIApi } from "openai";
import { config } from "dotenv";

config();

const configuration = new Configuration({
    organization: process.env.OPENAI_ORG_ID,
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const MODELS = {
    CHAT: "gpt-3.5-turbo",
    COMPLETION: 'text-davinci-003'
}

export default openai;