import { Router } from "express";
import {
  getChats,
  getConversation,
  getContacts,
  getContactDetails,
  sendMessage,
  createChat,
} from "../controllers/chat.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/chats", getChats);
router.post("/chats", createChat);
router.get("/conversation/:id", getConversation);
router.post("/conversation/:id/message", sendMessage);
router.get("/contacts", getContacts);
router.get("/contacts/:id", getContactDetails);

export default router;
