"use client";

import { Button } from "@/components/ui/button";

interface ChatFormProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  variant?: "centered" | "docked";
}

export function ChatForm({
  input,
  onInputChange,
  onSubmit,
  isLoading,
  variant = "docked",
}: ChatFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className={
        variant === "centered"
          ? "w-full max-w-2xl"
          : "border-t border-border bg-background/70 backdrop-blur-md p-2 md:p-4"
      }
    >
      <div
        className={
          variant === "centered" ? "flex gap-3" : "max-w-4xl mx-auto flex gap-3"
        }
      >
        <input
          value={input}
          onChange={(e) => onInputChange(e.currentTarget.value)}
          placeholder={
            variant === "centered"
              ? "Start a new conversation..."
              : "Type your message..."
          }
          className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
        />
        <Button
          type="submit"
          variant="default"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </div>
    </form>
  );
}
