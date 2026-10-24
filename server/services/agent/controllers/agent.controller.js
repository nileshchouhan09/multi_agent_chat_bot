import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessage } from "../config/memory.js";
import redis from "../../../shared/redis/redis.js";

export const agent = async (req, res) => {
  const { prompt, conversationId, agent: agentType } = req.body;

  if (!prompt?.trim() || !conversationId) {
    return res.status(400).json({
      success: false,
      answer: "Please provide a prompt and conversation ID.",
      error: "INVALID_REQUEST",
    });
  }

  try {
    // Save user message
    await axios.post(
      `${process.env.CHAT_SERVICE_URL}/save-message`,
      {
        conversationId,
        role: "user",
        content: prompt,
      },
      { timeout: 10000 }
    );

    // Run AI graph
    const result = await graph.invoke({
      prompt,
      conversationId,
      agent: agentType,
    });

    const response =
      typeof result?.aiResponse === "string"
        ? result.aiResponse
        : result?.aiResponse?.content;

    if (typeof response !== "string" || !response.trim()) {
      return res.status(502).json({
        success: false,
        answer:
          "I couldn't generate a response this time. Please try again.",
        error: "EMPTY_AI_RESPONSE",
      });
    }

    // Save assistant response to memory
    await addMessage({
      conversationId,
      role: "user",
      content: prompt,
    });

    await addMessage({
      conversationId,
      role: "assistant",
      content: response,
    });

    // Persist assistant response
    await axios.post(
      `${process.env.CHAT_SERVICE_URL}/save-message`,
      {
        conversationId,
        role: "assistant",
        content: response,
        images: result?.images,
        artifacts: result?.artifacts,
      },
      { timeout: 10000 }
    );

    return res.status(200).json({
      success: true,
      answer: response,
      images: result?.images,
      artifacts: result?.artifacts,
    });
  } catch (error) {
    console.error("Agent error:", error.message);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        answer:
          "Sorry, I couldn't complete your request right now. Please try again.",
        error: "AGENT_REQUEST_FAILED",
      });
    }
  }
};