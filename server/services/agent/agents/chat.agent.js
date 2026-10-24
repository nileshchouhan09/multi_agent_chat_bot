import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/llmModel.js";
import { getMemory } from "../config/memory.js";

export const chatAgent = async (state) => {
  const llm = getModel("chat");

  const searchContext = state.searchResults ?
  `Web Search Results:
  ${JSON.stringify(state.searchResults)}
  Answer the user using the above search results.
  `
  : 
  "";

  const systemPrompt = `You are Cortex AI, an intelligent and helpful AI assistant.
  ${searchContext}
  if searchContext exists:

  - Use search results to answer.
  - Do not mention internal tools.

     Rules:
    - for simple questions, greeting, and short queries, respond naturally in plain text.
    - For technical, educational, coding, or detailed topics, use clean Markdown

Formatting Rules:
- Use # for main titles and ## for section headings.
- Always leave a blank line after every heading.
- Never place a heading and its content on the same line.
- Use numbered lists for step-by-step instructions.
- Use bullet points for unordered lists.
- Use fenced code blocks with the appropriate language tag when providing code.
- Keep paragraphs short, clear, and easy to read.
- Avoid large walls of text.
- Use Markdown formatting consistently.
- Be concise, structured, and easy to understand.
- Adapt the level of detail to the user's question; do not add unnecessary information.
    `;
   
  const history = await getMemory(state.conversationId);
   console.log(history)
 
  const messages = [
    new SystemMessage(systemPrompt)
  ]

  history?.messages.forEach((msg) => {
  if (!msg.content) return;

  if (msg.role === "user") {
    messages.push(new HumanMessage(msg.content));
  }

  if (msg.role === "assistant") {
    messages.push(new AIMessage(msg.content));
  }
});
  
  messages.push(new HumanMessage(state.prompt))

  const response = await llm.invoke(messages);

  return {
    ...state,
    aiResponse: response,
  };
};
