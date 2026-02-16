"use server";

import { auth } from "@/lib/auth";
import { db } from "@/database";
import { conversation } from "@/database/schema";
import { revalidatePath } from "next/cache";

export async function generateConversation() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const [newConversation] = await db
    .insert(conversation)
    .values({
      userId: session.user.id,
      title: "New Chat",
    })
    .returning();

  if (!newConversation) {
    throw new Error("Failed to create conversation");
  }

  revalidatePath("/dashboard", "layout");

  return newConversation.id;
}
