import { ChatInterface } from "@/components/dashboard/chat/chat-interface";
import { db } from "@/database";
import { messages, conversation } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { UIMessage } from "ai";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MessageSquareOff } from "lucide-react";
import { NewChatButton } from "@/components/dashboard/chat/new-chat-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return redirect("/login");
  }
  const [existingConv] = await db
    .select()
    .from(conversation)
    .where(
      and(eq(conversation.id, id), eq(conversation.userId, session.user.id)),
    );

  if (!existingConv) {
    return (
      <section className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-4 text-center px-4">
        <MessageSquareOff size={48} className="text-muted-foreground" />
        <h1 className="text-xl font-semibold text-foreground">
          Conversation not found
        </h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          This conversation doesn&apos;t exist or you don&apos;t have access to
          it.
        </p>
        <NewChatButton />
      </section>
    );
  }

  const existingMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id));
  const initialMessages = existingMessages.map(
    (msg) =>
      ({
        id: msg.id,
        role: msg.role,
        parts: msg.parts,
      }) as unknown as UIMessage,
  );

  return (
    <ChatInterface
      id={id}
      initialMessages={initialMessages}
      initialTitle={existingConv.title}
    />
  );
}
