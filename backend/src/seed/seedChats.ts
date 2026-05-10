/**
 * Run with: npx ts-node src/seed/seedChats.ts
 * Seeds demo contacts, chats and messages into MongoDB.
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Contact, Chat, Message } from "../models/Chat.model";

const MONGO_URI = process.env.MONGO_URI!;

const contacts = [
  { name: "Sarah Johnson", email: "sarah@ecme.dev", avatar: "/img/avatars/thumb-2.jpg", status: "online", title: "Product Designer", role: "Designer" },
  { name: "Marcus Lee", email: "marcus@ecme.dev", avatar: "/img/avatars/thumb-3.jpg", status: "busy", title: "Backend Engineer", role: "Engineer" },
  { name: "Aisha Patel", email: "aisha@ecme.dev", avatar: "/img/avatars/thumb-4.jpg", status: "offline", title: "Marketing Lead", role: "Marketing" },
  { name: "Tom Rivera", email: "tom@ecme.dev", avatar: "/img/avatars/thumb-5.jpg", status: "online", title: "DevOps Engineer", role: "Engineering" },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // Clear existing data
  await Message.deleteMany({});
  await Chat.deleteMany({});
  await Contact.deleteMany({});

  for (const contactData of contacts) {
    const contact = await Contact.create(contactData);
    const chat = await Chat.create({
      contactId: contact._id,
      lastMessage: "Hey! How are you?",
      chatType: "personal",
    });

    await Message.insertMany([
      { chatId: chat._id, text: "Hey! How are you?", sender: contact.name, timestamp: new Date(Date.now() - 3600000) },
      { chatId: chat._id, text: "I'm doing great, thanks!", sender: "me", timestamp: new Date(Date.now() - 3000000) },
      { chatId: chat._id, text: "Ready for the meeting later?", sender: contact.name, timestamp: new Date(Date.now() - 1800000) },
    ]);

    console.log(`✅ Seeded chat with ${contact.name}`);
  }

  await mongoose.disconnect();
  console.log("🎉 Seed complete!");
}

seed().catch(console.error);
