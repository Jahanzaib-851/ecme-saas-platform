import mongoose, { Schema, Document, Model } from "mongoose";

// ─── Contact ────────────────────────────────────────────────────────────────
export interface IContact extends Document {
  name: string;
  email: string;
  avatar: string | null;
  status: "online" | "offline" | "busy";
  title: string;
  role: string;
}

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    avatar: { type: String, default: null },
    status: { type: String, enum: ["online", "offline", "busy"], default: "offline" },
    title: { type: String, default: "" },
    role: { type: String, default: "User" },
  },
  { timestamps: true }
);

// ─── Chat ────────────────────────────────────────────────────────────────────
export interface IChat extends Document {
  contactId: mongoose.Types.ObjectId;
  lastMessage: string | null;
  unread: number;
  muted: boolean;
  chatType: "personal" | "groups";
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    contactId: { type: Schema.Types.ObjectId, ref: "Contact", required: true },
    lastMessage: { type: String, default: null },
    unread: { type: Number, default: 0 },
    muted: { type: Boolean, default: false },
    chatType: { type: String, enum: ["personal", "groups"], default: "personal" },
  },
  { timestamps: true }
);

// ─── Message ─────────────────────────────────────────────────────────────────
export interface IMessage extends Document {
  chatId: mongoose.Types.ObjectId;
  text: string;
  sender: string; // "me" | contact name
  timestamp: Date;
}

const messageSchema = new Schema<IMessage>({
  chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true, index: true },
  text: { type: String, required: true },
  sender: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Contact: Model<IContact> = mongoose.model<IContact>("Contact", contactSchema);
export const Chat: Model<IChat> = mongoose.model<IChat>("Chat", chatSchema);
export const Message: Model<IMessage> = mongoose.model<IMessage>("Message", messageSchema);
