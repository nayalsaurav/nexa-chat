import { tool } from "ai";
import { z } from "zod";
import { normalizeWeather } from "./utils";

export const getWeather = tool({
  description: "Get the weather in a location (fahrenheit)",
  inputSchema: z.object({
    location: z.string().describe("The location to get the weather for"),
  }),
  execute: async ({ location }) => {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${location}&days=7&hour=0&aqi=no&alerts=no&astro=0`,
    );

    const data = await res.json();

    return normalizeWeather(data);
  },
});

export const getF1Matches = tool({
  description: "Get the F1 matches",
  inputSchema: z.object({}),
  execute: async () => {
    const matches = [
      {
        name: "Bahrain Grand Prix",
        date: "2022-03-20",
      },
      {
        name: "Saudi Arabian Grand Prix",
        date: "2022-03-27",
      },
      {
        name: "Australian Grand Prix",
        date: "2022-04-10",
      },
    ];

    return {
      matches,
    };
  },
});

export const getStockPrice = tool({
  description: "Get current stock price for a symbol",
  inputSchema: z.object({
    symbol: z.string().describe("Stock ticker symbol (e.g., AAPL)"),
  }),
  execute: async ({ symbol }) => {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_KEY}`,
    );

    const data = await res.json();
    const quote = data["Global Quote"];

    return {
      symbol: quote["01. symbol"],
      price: Number(quote["05. price"]),
      change: Number(quote["09. change"]),
      changePercent: Number(quote["10. change percent"].replace("%", "")),
      volume: Number(quote["06. volume"]),
      previousClose: Number(quote["08. previous close"]),
      latestTradingDay: quote["07. latest trading day"],
    };
  },
});
