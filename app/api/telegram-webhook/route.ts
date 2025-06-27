import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN as string
);

export default async function handler(request: NextRequest) {
  if (request.method !== "POST") {
    return new NextResponse("Method not allowed", { status: 405 });
  }

  try {
    const body = await request.json();
    const { message } = body;

    if (message.text && message.text === "/start") {
      const chatId = message.chat.id;
      const username = message.from?.username;

      const user = await prisma.telegramUser.findUnique({
        where: {
          chatId: chatId.toString(),
        },
      });

      if (!user) {
        await prisma.telegramUser.create({
          data: {
            chatId: chatId.toString(),
            username,
          },
        });
      }

      await bot.sendMessage(
        chatId,
        `Hello, ${username}! Welcome to the Emergency Info Portal. You will be notified when there is an emergency in your area.`
      );
    }
    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Error", { status: 500 });
  }
}
