import {
  Code2,
  Globe,
  MessageSquare,
  Mic,
  Paperclip,
  Send,
  Zap
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createConversation } from "../features/createConversation";
import sendMessage from "../features/sendMessage";
import { updateConversation } from "../features/updateConversation";
import {
  addConversations,
  setConversationTitle,
  setSelectConversation,
} from "../redux/conversationSlice";
import {
  addMessage,
  setArtifacts,
  setIsGenerating,
  setMessages,
} from "../redux/MessageSlice";
import { useRef } from "react";

const ChatInput = () => {
  const [value, setValue] = useState("");
  const [seletectAgent, setSelectAgent] = useState("Auto");
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);
  const dispatch = useDispatch();
  const scrollEventRef = useRef(0);
  const handleSendMessage = async () => {
    let conversation = selectedConversation;
    if (!conversation) {
      const convo = await createConversation();
      dispatch(setSelectConversation(convo));
      dispatch(addConversations(convo));
      conversation = convo;
    }
    if (conversation?.title == "New Chat") {
      const convo = await updateConversation({
        id: conversation?._id,
        title: value.trim(),
      });
      conversation = convo;
      dispatch(
        setConversationTitle({
          conversationId: conversation._id,
          title: value.slice(0, 40),
        }),
      );
    }

    const payload = {
      prompt: value.trim(),
      conversationId: conversation?._id,
      agent: seletectAgent.toLowerCase(),
    };

    dispatch(
      setMessages([...messages, { role: "user", content: value.trim() }]),
    );
    window.dispatchEvent(new Event("user-message-sent"));
    setValue("");
    dispatch(setIsGenerating(true));
    const data = await sendMessage(payload);
    dispatch(setIsGenerating(false));

    console.log(data);
    dispatch(
      addMessage({
        role: "assistant",
        content: data.answer,
        images: data.images,
      }),
    );
    dispatch(setArtifacts(data.artifacts || []));
  };

  const agents = [
    {
      id: "auto",
      icon: Zap,
      label: "Auto",
    },
    {
      id: "chat",
      icon: MessageSquare,
      label: "Chat",
    },
    {
      id: "coding",
      icon: Code2,
      label: "Coding",
    },
    // {
    //   id: "pdf",
    //   icon: FileText,
    //   label: "PDF",
    // },
    // {
    //   id: "ppt",
    //   icon: Presentation,
    //   label: "PPT",
    // },
    // {
    //   id: "image",
    //   icon: Image,
    //   label: "Image",
    // },
    {
      id: "search",
      icon: Globe,
      label: "Search",
    },
  ];

  return (
    <div className="w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/[0.06]  bg-[#0d0f14]">
      <div className="flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 py-3.5 pb-3 ">
        <div className="flex w-[80%] gap-2 pr-2 flex-wrap">
          {agents.map((agent, i) => {
            const isActive = seletectAgent === agent.label;
            const Icon = agent.icon;
            return (
              <div
                key={i}
                onClick={() => setSelectAgent(agent.label)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border tranistion-all cursor-pointer
              
                ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-[0_1px_8px_rgba(99,102,241,.35)]"
                    : "bg-white/3 text-slate-400 border-white/6 hover:bg-white/6 hover:text-white-[0.07] "
                }
              
              `}
              >
                <Icon
                  size={14}
                  className={isActive ? "text-white" : "text-slate-500"}
                />
                {agent.label}
              </div>
            );
          })}
        </div>

        <textarea
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();

              if (value.trim()) {
                handleSendMessage();
              }
            }
          }}
          value={value}
          placeholder="Ask anything"
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed scrollbar-none [&::-webkit-scrollbar]:hidden disabled:opacity-50"
          rows={3}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 ">
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.06] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer ">
              <Paperclip size={16} />
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.06] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer ">
              <Mic size={16} />
            </button>
          </div>
          <button
            disabled={!value}
            onClick={handleSendMessage}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border-none cursor-pointer transition-all duration-150 ${value.trim() ? " bg-gradient-to-br from-indigo-500 to-violet-700 hover:opacity-90 text-white" : " bg-white/[0.06] text-slate-600 cursor-not-allowed"}`}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
