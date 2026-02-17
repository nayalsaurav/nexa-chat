"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateConversation } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export function DashboardChatInput() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    try {
      const id = await generateConversation();
      sessionStorage.setItem("initialMessage", input.trim());
      router.push(`/dashboard/chat/${id}`);
    } catch {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          placeholder="Start a new conversation..."
          disabled={loading}
          className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm disabled:opacity-50"
        />
        <Button
          type="submit"
          variant="default"
          disabled={loading || !input.trim()}
        >
          <Send size={16} className={loading ? "animate-pulse" : ""} />
        </Button>
      </div>
    </form>
  );
}
