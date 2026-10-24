
import { useSelector } from "react-redux";
import { useEffect, useLayoutEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import GeneratingAnimation from "./GeneratingAnimation";

const MessageList = () => {
  const { selectedConversation } = useSelector(
    (state) => state.conversation
  );

  const { messages, isGenerating } = useSelector(
    (state) => state.message
  );

  const bottomRef = useRef(null);
  const previousConversationRef = useRef(null);
  const shouldScrollOnOpenRef = useRef(true);

  const conversationId =
    selectedConversation?._id ??
    selectedConversation?.id ??
    selectedConversation;

  // Scroll to the bottom when opening or switching conversations.
  // useLayoutEffect runs after React updates the DOM.
  useLayoutEffect(() => {
    if (!selectedConversation) {
      previousConversationRef.current = null;
      shouldScrollOnOpenRef.current = true;
      return;
    }

    if (previousConversationRef.current !== conversationId) {
      previousConversationRef.current = conversationId;
      shouldScrollOnOpenRef.current = true;
    }

    if (!shouldScrollOnOpenRef.current || !messages?.length) {
      return;
    }

    bottomRef.current?.scrollIntoView({
      behavior: "auto",
      block: "end",
    });

    shouldScrollOnOpenRef.current = false;
  }, [conversationId, selectedConversation, messages]);

  // Scroll when the user sends a message, but not when the
  // assistant response is added.
  useEffect(() => {
    const handleUserMessageSent = () => {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      });
    };

    window.addEventListener(
      "user-message-sent",
      handleUserMessageSent
    );

    return () => {
      window.removeEventListener(
        "user-message-sent",
        handleUserMessageSent
      );
    };
  }, []);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {messages?.length === 0 || !selectedConversation ? (
        <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[20px] font-semibold text-slate-200 tracking-tight">
              CortexAI
            </h1>

            <p className="text-[15px] font-semibold text-slate-400 tracking-tight">
              How can I help you
            </p>

            <p className="text-[15px] font-semibold text-slate-400 tracking-tight">
              Ask me anything - code, ideas, explanations, or just a quick question
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-1">
            {[
              "Build Netflix clone",
              "Explain Redis",
              "Build a dashboard",
            ].map((item, index) => (
              <button
                className="text-[12px] text-slate-400 bg-white/[0.04] border border-white/[0.07] px-3 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-slate-200 transition-colors duration-150 cursor-pointer"
                key={index}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {messages?.map((msg, index) => (
            <div key={index}>
              <MessageBubble
                role={msg?.role}
                content={msg?.content}
                images={msg?.images}
              />
            </div>
          ))}

          {isGenerating && <GeneratingAnimation />}

          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};

export default MessageList;
