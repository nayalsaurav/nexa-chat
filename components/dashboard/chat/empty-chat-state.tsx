import { Bot } from "lucide-react";
import Image from "next/image";

interface EmptyChatStateProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function EmptyChatState({
  title = "How can I help you?",
  subtitle = "Ask me anything — I can help with weather, F1 races, stock prices, and much more.",
  children,
}: EmptyChatStateProps) {
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
      {children}
    </div>
  );
}
