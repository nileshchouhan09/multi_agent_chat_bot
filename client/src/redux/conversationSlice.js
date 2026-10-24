import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
    name:'conversation',
    initialState:{
        conversations:[],
        selectedConversation:null
    },
    reducers:{
        setConversations:(state,action)=>{
            state.conversations = action.payload
        },
        addConversations:(state,action)=>{
            state.conversations.unshift(action.payload) // unshift will add conversation in the starting of the array and old will go at the end
        },
        setSelectConversation:(state,action)=>{
            state.selectedConversation = action.payload
        },
        setConversationTitle:(state,action)=>{
            const {title,conversationId} = action.payload;
            state.conversations = state.conversations.map((conv)=>(
                conv._id === conversationId ?( {...conv,title})
                : (conv)
            ))

            if(state.selectedConversation?._id === conversationId){
                state.selectedConversation = {...state.selectedConversation,title};
            }
        }
    }
})

export const {setConversations,addConversations,setSelectConversation,setConversationTitle} = conversationSlice.actions;
export default conversationSlice.reducer;
