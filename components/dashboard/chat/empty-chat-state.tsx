import { Bot, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface EmptyChatStateProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  onPromptClick?: (prompt: string) => void;
}

export function EmptyChatState({
  title = "How can I help you?",
  subtitle = "Ask me anything — I can help with weather, F1 races, stock prices, and much more.",
  children,
  onPromptClick,
}: EmptyChatStateProps) {
  const dummyPrompts = [
    {
      title: "Get F1 match",
      prompt: "When is the next F1 race?",
    },
    {
      title: "Weather in Delhi",
      prompt: "What is the weather in Delhi, India?",
    },
    {
      title: "Stock price of AAPL",
      prompt: "Get stock price of AAPL",
    },
    {
      title: "Essay on AI",
      prompt: "Generate an essay of 1000 words on AI",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] px-4 gap-8">
      <section className="text-center space-y-3">
        <div className="flex justify-center">
          <div className="bg-black rounded-full overflow-hidden">
            <Image
              src="/robot.gif"
              alt="Logo"
              width={75}
              height={75}
              unoptimized
              className="mix-blend-screen"
            />
          </div>
        </div>
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">
          {title}
        </h1>
        <p className="text-muted-foreground text-sm max-w-md">{subtitle}</p>
      </section>

      {onPromptClick && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          {dummyPrompts.map((item, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
              onClick={() => onPromptClick(item.prompt)}
            >
              <span className="text-sm font-medium">{item.title}</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Button>
          ))}
        </div>
      )}

      {children}
    </div>
  );
}
