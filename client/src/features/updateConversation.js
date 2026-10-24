import api from "../../utils/axios"


export const updateConversation = async (payload)=>{
    try {
        const {data } = await api.post("/api/chat/update-conversation",payload);
        console.log(data,"update ");
        return data.conversation;
    } catch (error) {
        console.log(error);
        return []
    }
}