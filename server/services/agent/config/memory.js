import redis from "../../../shared/redis/redis.js"
import { getMessages } from "../utils/getMesssages.js"

export const getMemory = async (conversationId)=>{
    try {
        const key = `messages-${conversationId}`
        const cached =  await redis.get(key)
        if(cached){
            return JSON.parse(cached)
        }
        const messages = await  getMessages(conversationId);
        await redis.set(key,JSON.stringify(messages),"EX",24*60*60)
        return messages;  
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const addMessage = async ({ conversationId, role, content }) => {
  try {
    const key = `messages-${conversationId}`;
    const rawMessages = await redis.get(key);

    const messages = rawMessages ? JSON.parse(rawMessages) : [];
    messages?.messages?.push({ role, content });

    if (messages.length >= 20) {
      messages.shift();
    }

    await redis.set(key, JSON.stringify(messages), "EX", 24 * 60 * 60);
  } catch (error) {
    console.log(error);
  }
};