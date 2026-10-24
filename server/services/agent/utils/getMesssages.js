import axios from "axios";


export const getMessages = async (conversationId) =>{
    try {
        console.log(conversationId)
        const {data}  =   await axios.get(`${process.env.CHAT_SERVICE_URL}/get-message/${conversationId}`);
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}