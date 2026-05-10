import { Request, Response } from "express";
import mongoose from "mongoose";
import { Chat, Contact, Message } from "../models/Chat.model";
import type { IChat, IContact, IMessage } from "../models/Chat.model";
import { asyncHandler } from "../middleware/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { getIO } from "../lib/socket";

// ─── Types ────────────────────────────────────────────────────────────────────

type PopulatedChat = Omit<IChat, "contactId"> & {
  _id: mongoose.Types.ObjectId;
  contactId: IContact & { _id: mongoose.Types.ObjectId };
  updatedAt: Date;
};

// ─── Transform helpers ────────────────────────────────────────────────────────

function mapChat(chat: PopulatedChat) {
  const contact = chat.contactId;
  return {
    id: chat._id.toString(),
    name: contact?.name ?? "Unknown",
    userId: contact?._id?.toString() ?? "",
    avatar: contact?.avatar ?? "/img/avatars/thumb-1.jpg",
    unread: 0,
    time: Math.floor(new Date(chat.updatedAt).getTime() / 1000), // Unix seconds
    lastConversation: chat.lastMessage ?? "",
    muted: chat.muted ?? false,
    chatType: chat.chatType ?? "personal",
    groupId: "",
  };
}

function mapMessage(msg: IMessage & { _id: mongoose.Types.ObjectId }) {
  const isMyMessage = msg.sender === "me";
  return {
    id: msg._id.toString(),
    sender: {
      id: isMyMessage ? "me" : msg.sender,
      name: isMyMessage ? "You" : msg.sender,
      avatarImageUrl: "/img/avatars/thumb-1.jpg",
    },
    content: msg.text,
    timestamp: Math.floor(new Date(msg.timestamp).getTime() / 1000),
    type: "regular" as const,
    isMyMessage,
    showAvatar: !isMyMessage,
  };
}

function mapContact(contact: IContact & { _id: mongoose.Types.ObjectId }) {
  return {
    id: contact._id.toString(),
    name: contact.name,
    email: contact.email,
    img: contact.avatar ?? "/img/avatars/thumb-1.jpg",
    role: contact.role ?? "User",
    lastOnline: Date.now(),
    status: contact.status ?? "offline",
    title: contact.title ?? "",
    personalInfo: { birthday: "", phoneNumber: "" },
    members: [],
  };
}

function assertValidObjectId(id: string, label = "ID"): void {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `Invalid ${label}: '${id}'`);
  }
}

// ─── Controllers ──────────────────────────────────────────────────────────────

export const getChats = asyncHandler(async (_req: Request, res: Response) => {
  const chats = await Chat.find()
    .populate("contactId")
    .sort({ updatedAt: -1 })
    .lean();

  return res.sendSuccess(
    (chats as unknown as PopulatedChat[]).map(mapChat),
    "Chats fetched"
  );
});

export const createChat = asyncHandler(async (req: Request, res: Response) => {
  const { contactId } = req.body;
  assertValidObjectId(contactId, "contactId");

  const contact = await Contact.findById(contactId);
  if (!contact) throw new ApiError(404, "Contact not found");

  const existing = await Chat.findOne({ contactId }).populate("contactId");
  if (existing) {
    return res.sendSuccess(
      mapChat(existing as unknown as PopulatedChat),
      "Chat already exists"
    );
  }

  const chat = await Chat.create({ contactId, chatType: "personal" });
  const populated = await chat.populate("contactId");

  return res.sendSuccess(
    mapChat(populated as unknown as PopulatedChat),
    "Chat created",
    201
  );
});

export const getConversation = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  assertValidObjectId(id, "chat ID");

  const chat = await Chat.findById(id);
  if (!chat) throw new ApiError(404, "Conversation not found");

  const messages = await Message.find({ chatId: id })
    .sort({ timestamp: 1 })
    .lean();

  return res.sendSuccess(
    {
      id,
      conversation: (messages as unknown as (IMessage & { _id: mongoose.Types.ObjectId })[]).map(
        mapMessage
      ),
    },
    "Conversation fetched"
  );
});

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { text, sender = "me" } = req.body;

  assertValidObjectId(id, "chat ID");
  if (!text?.trim()) throw new ApiError(400, "Message text is required");

  const chat = await Chat.findById(id);
  if (!chat) throw new ApiError(404, "Chat not found");

  const message = await Message.create({
    chatId: id,
    text: text.trim(),
    sender,
  });

  await Chat.findByIdAndUpdate(id, {
    lastMessage: text.trim(),
    updatedAt: new Date(),
  });

  const mapped = mapMessage(message as unknown as IMessage & { _id: mongoose.Types.ObjectId });

  // Broadcast to all clients in the chat room
  getIO().to(id).emit("new_message", { chatId: id, message: mapped });

  return res.sendSuccess(mapped, "Message sent", 201);
});

export const getContacts = asyncHandler(async (_req: Request, res: Response) => {
  const contacts = await Contact.find().lean();
  return res.sendSuccess(
    (contacts as unknown as (IContact & { _id: mongoose.Types.ObjectId })[]).map(
      mapContact
    ),
    "Contacts fetched"
  );
});

export const getContactDetails = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  assertValidObjectId(id, "contact ID");

  const contact = await Contact.findById(id).lean();
  if (!contact) throw new ApiError(404, "Contact not found");

  return res.sendSuccess(
    {
      userDetails: mapContact(
        contact as unknown as IContact & { _id: mongoose.Types.ObjectId }
      ),
      media: { images: [], files: [], links: [] },
    },
    "Contact details fetched"
  );
});
