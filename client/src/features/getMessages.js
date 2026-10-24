import api from "../../utils/axios"


export const getMessage = async(id)=>{
    try {
        const {data} = await api.get(`/api/chat/get-message/${id}`)
        return data.messages;
    } catch (error) {
        console.log(error);
        return []
    }
}