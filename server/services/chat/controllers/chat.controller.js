import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const createConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const conversation = await Conversation.create({
      userId: userId,
    });
    return res.status(201).json({
      message: "Conversation created successfully",
      conversation,
    });
  } catch (error) {
    console.error(`Error in createConversation: ${error}`);
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const conversations = await Conversation.find({ userId: userId }).sort({
      updatedAt: -1,
    });
    return res.status(200).json({
      conversations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `GetConversations error ${error}`,
    });
  }
};

export const saveMessage = async (req, res) => {
  try {
    const { conversationId, role, content,images=[],artifacts} = req.body;
    const message = await Message.create({
      conversationId: conversationId,
      role: role,
      content: content,
      images,
      artifacts
    });
    return res.status(201).json({
      message: "Message saved successfully",
      message,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `SaveMessage error ${error}`,
    });
  }
};

export const updateConversation = async (req, res) => {
  try {
    const { id, title } = req.body;

    const conversation = await Conversation.findByIdAndUpdate(
      id,
      { title },
       { returnDocument: "after" }
    );

    res.status(200).json({
      message: "Conversation updated successfully",
      conversation,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `UpdateConversation error ${error}`,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const messages = await Message.find({
      conversationId: conversationId,
    });

    
    return res.status(200).json({
      messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `GetMessages error ${error}`,
    });
  }
};
