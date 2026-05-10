import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("123Qwe", 12);

  // 1. Admin User Create Karein
  await prisma.user.upsert({
    where: { email: "admin-01@ecme.com" },
    update: {},
    create: {
      email: "admin-01@ecme.com",
      password: passwordHash,
      userName: "Angelina Gotelli",
      avatar: "/img/avatars/thumb-1.jpg",
      role: Role.ADMIN,
    },
  });

  // 2. Ek Contact Create Karein (Mubeen Bhai)
  const contact = await prisma.contact.upsert({
    where: { email: "mubeen@ecme.com" },
    update: {},
    create: {
      name: "Mubeen Bhai",
      email: "mubeen@ecme.com",
      avatar: "/img/avatars/thumb-3.jpg",
      status: "online",
    },
  });

  // 3. Chat aur Messages Create Karein
  // Pehle check karte hain ke kya chat pehle se maujood hai
  const existingChat = await prisma.chat.findFirst({
    where: { contactId: contact.id }
  });

  if (!existingChat) {
    await prisma.chat.create({
      data: {
        contactId: contact.id,
        lastMessage: "Ji Jahanzaib, API lag gayi?",
        messages: {
          create: [
            { text: "Assalam-o-Alaikum Sir!", sender: "me" },
            { text: "Walaikum Assalam, kaise ho?", sender: "contact" },
            { text: "Main theek hoon, task par kaam kar raha hoon.", sender: "me" },
            { text: "Ji Jahanzaib, API lag gayi?", sender: "contact" },
          ],
        },
      },
    });
    console.log("Chat and Messages seeded!");
  }

  console.log("All seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });