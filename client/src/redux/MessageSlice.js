import { createSlice } from "@reduxjs/toolkit";

const MessageSlice = createSlice({
    name:'message',
    initialState:{
        messages:[],
        artifacts:[],
        isGenerating:false
     
    },
    reducers:{
        setMessages:(state,action)=>{
            state.messages = action.payload
        },
        addMessage:(state,action)=>{
            state.messages.push(action.payload)
        },
        setArtifacts:(state,action)=>{
            state.artifacts = action.payload
        },
        setIsGenerating:(state,action)=>{
            state.isGenerating = action.payload
        }
     
    }
})

export const {setMessages,addMessage,setArtifacts,setIsGenerating} = MessageSlice.actions;
export default MessageSlice.reducer;
