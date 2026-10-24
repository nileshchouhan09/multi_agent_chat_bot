import { ChatGroq } from "@langchain/groq"
import { ChatGoogle } from "@langchain/google";
import { ChatOpenRouter } from "@langchain/openrouter";
import dotenv from "dotenv"
dotenv.config()


const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    // other params...
})




const gemini = new ChatGoogle({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-3.7-flash",
});


const openRouter = new ChatOpenRouter({
  model: "deepseek/deepseek-chat",
  temperature: 0,
  maxTokens: 8192,
  apiKey: process.env.OPEN_ROUTER_API_KEY,
  // other params...
});

export const getModel = (agent)=>{
    switch (agent) {
        case "chat":
            return groq;
        case "search":
            return gemini;
        case "coding":
            return openRouter;
        case "pdf":
            return gemini;
        case "ppt":
            return gemini;
        case "imageGen":
            return gemini;
        default:
            return groq;
    }
}