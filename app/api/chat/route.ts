import { streamText, UIMessage, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";
import { getWeather, getF1Matches, getStockPrice } from "@/lib/tools";
import { db } from "@/database";
import { messages as messagesTable, conversation } from "@/database/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const {
      messages,
      id: conversationId,
    }: { messages: UIMessage[]; id?: string } = await req.json();

    if (!conversationId) {
      return new Response("Conversation ID required", { status: 400 });
    }

    const [existingConv] = await db
      .select()
      .from(conversation)
      .where(
        and(
          eq(conversation.id, conversationId),
          eq(conversation.userId, session.user.id),
        ),
      );

    if (!existingConv) {
      return new Response("Conversation not found or unauthorized", {
        status: 404,
      });
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "user") {
      await db.insert(messagesTable).values({
        conversationId,
        role: "user",
        parts: lastMessage.parts,
      });
    }

    const result = streamText({
      model: google("gemini-2.5-flash"),
      messages: await convertToModelMessages(messages),
      system: `
            You are a versatile AI assistant. 
            You have two modes of operation:
            1. General Assistant: Write essays, answer questions, and engage in creative tasks.
            2. Tool Specialist: Use the provided tools (weather, F1 match, stock price) only when specific real-time data is needed.
`,
      tools: {
        weather: getWeather,
        f1Matches: getF1Matches,
        stockPrice: getStockPrice,
      },
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      onFinish: async ({ messages: allMessages }) => {
        const newMessages = allMessages.slice(messages.length);
        for (const msg of newMessages) {
          await db.insert(messagesTable).values({
            conversationId,
            role: msg.role as "assistant" | "tool",
            parts: msg.parts,
          });
        }
        const [conv] = await db
          .select({ title: conversation.title })
          .from(conversation)
          .where(eq(conversation.id, conversationId));

        if (conv && conv.title === "New Chat") {
          const firstUserMessage = messages
            .filter((m) => m.role === "user")
            .at(0)
            ?.parts.find((p) => p.type === "text")?.text;
          if (firstUserMessage) {
            await db
              .update(conversation)
              .set({ title: firstUserMessage.slice(0, 20) })
              .where(eq(conversation.id, conversationId));
          }
        }
      },
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
