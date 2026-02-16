import { streamText, UIMessage, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";
import { getWeather, getF1Matches, getStockPrice } from "@/lib/tools";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

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

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
