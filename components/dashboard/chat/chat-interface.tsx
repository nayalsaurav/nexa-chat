"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { User, Bot } from "lucide-react";
import { RaceCard } from "@/components/dashboard/chat/race-card";
import { WeatherCard } from "@/components/dashboard/chat/weather-card";
import { StockCard } from "@/components/dashboard/chat/stock-card";
import { F1MatchOutput, WeatherOutput, StockPriceOutput } from "@/types";
import { DefaultChatTransport, UIMessage } from "ai";
import { useRouter } from "next/navigation";
import { AnimatedText } from "./animate-text";
import { EmptyChatState } from "./empty-chat-state";
import { ChatForm } from "./chat-form";

interface ChatInterfaceProps {
  id: string;
  initialMessages: UIMessage[];
  initialTitle: string;
}

export function ChatInterface({
  id,
  initialMessages,
  initialTitle,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const router = useRouter();
  const { messages, sendMessage, status } = useChat({
    id,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onFinish: () => {
      if (initialTitle === "New Chat") {
        router.refresh();
      }
    },
  });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const pending = sessionStorage.getItem("initialMessage");
    if (pending) {
      sessionStorage.removeItem("initialMessage");
      sendMessage({ text: pending });
    }
  }, []);

  const isLoading = status === "streaming" || status === "submitted";

  const handleSubmit = () => {
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  if (messages.length === 0) {
    return (
      <EmptyChatState>
        <ChatForm
          input={input}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          variant="centered"
        />
      </EmptyChatState>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      <div className="flex-1 overflow-y-auto no-scrollbar px-2 py-4 md:px-4 md:py-6 space-y-6 max-w-4xl w-full mx-auto">
        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                isUser ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div
                className={`flex items-center justify-center h-10 w-10 rounded-full shadow-md ${
                  isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {isUser ? <User size={18} /> : <Bot size={18} />}
              </div>

              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-3 py-2 md:px-4 md:py-3 text-sm shadow-md whitespace-pre-wrap ${
                  isUser
                    ? "bg-primary text-primary-foreground rounded-bl-none"
                    : "bg-card text-card-foreground rounded-br-none border border-border"
                }`}
              >
                {(message.parts ?? []).map((part, i) => {
                  switch (part.type) {
                    case "text": {
                      const shouldAnimate =
                        !isUser &&
                        status === "streaming" &&
                        message ===
                          messages.filter((m) => m.role === "assistant").at(-1);
                      return (
                        <AnimatedText
                          key={`${message.id}-${i}`}
                          text={part.text}
                          animate={shouldAnimate}
                        />
                      );
                    }

                    case "tool-weather": {
                      if (!part.output) return null;
                      return (
                        <WeatherCard
                          key={`${message.id}-${i}`}
                          weatherData={part.output as WeatherOutput}
                        />
                      );
                    }

                    case "tool-f1Matches": {
                      if (!part.output) return null;

                      return (
                        <RaceCard
                          key={`${message.id}-${i}`}
                          raceData={part.output as F1MatchOutput}
                        />
                      );
                    }

                    case "tool-stockPrice": {
                      if (!part.output) return null;
                      return (
                        <StockCard
                          key={`${message.id}-${i}`}
                          stockData={part.output as StockPriceOutput}
                        />
                      );
                    }

                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          );
        })}

        {(status === "submitted" || status === "streaming") && (
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted text-foreground">
              <Bot size={18} />
            </div>
            <div className="bg-card text-card-foreground border border-border px-4 py-3 rounded-2xl rounded-br-none shadow-md text-sm animate-pulse">
              Thinking...
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted text-foreground">
              <Bot size={18} />
            </div>
            <div className="bg-card text-card-foreground border border-border px-4 py-3 rounded-2xl rounded-br-none shadow-md text-sm">
              Something went wrong. Please try again.
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatForm
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
