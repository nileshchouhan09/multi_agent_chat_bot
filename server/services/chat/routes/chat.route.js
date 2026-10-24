import {Router} from "express";
import { createConversation, getConversations, getMessages, saveMessage, updateConversation } from "../controllers/chat.controller.js";

const router = Router();

router.get("/create-conversation",createConversation)
router.get("/get-conversations",getConversations)
router.post("/save-message",saveMessage)
router.get("/get-message/:conversationId",getMessages)
router.post("/update-conversation",updateConversation)


export default router;