import { useEffect } from "react";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import Nav from "./Nav";
import { getMessage } from "../features/getMessages";
import { useDispatch, useSelector } from "react-redux";
import { setArtifacts, setMessages } from "../redux/MessageSlice";

const ChatArea = () => {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();
  useEffect(() => {
    const getMsg = async () => {
      try {
        if (selectedConversation) {
          if (selectedConversation.title === "New Chat") return;
          const data = await getMessage(selectedConversation?._id);
          dispatch(setMessages(Array.isArray(data) ? data : []));
          const latestArtifactMessage = [...data]
            .reverse()
            .find((msg) => msg.artifacts && msg.artifacts.length > 0);
          dispatch(setArtifacts(latestArtifactMessage?.artifacts || []));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getMsg();
  }, [selectedConversation?._id, dispatch]);
  return (
    <div className="flex-1 flex flex-col min-w-0  ">
      <Nav />
      <MessageList></MessageList>
      <ChatInput></ChatInput>
    </div>
  );
};

export default ChatArea;
