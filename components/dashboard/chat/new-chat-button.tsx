"use client";

import { useRouter } from "next/navigation";
import { generateConversation } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function NewChatButton() {
  const router = useRouter();

  async function handleClick() {
    const id = await generateConversation();
    router.push(`/dashboard/chat/${id}`);
  }

  return (
    <Button onClick={handleClick} className="mt-2 gap-2">
      <Plus size={16} />
      New Chat
    </Button>
  );
}
