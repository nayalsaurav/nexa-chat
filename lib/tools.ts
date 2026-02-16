import { tool } from "ai";
import { z } from "zod";
import { normalizeWeather } from "./utils";

export const getWeather = tool({
  description: "Get the weather in a location (fahrenheit)",
  inputSchema: z.object({
    location: z.string().describe("The location to get the weather for"),
  }),
  execute: async ({ location }) => {
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${location}&days=7&hour=0&aqi=no&alerts=no&astro=0`,
      );

      if (!res.ok) throw new Error("Failed to fetch weather data");

      const data = await res.json();

      return normalizeWeather(data);
    } catch (error) {
      console.error("Weather API Error:", error);
      return { error: "Unable to fetch weather data." };
    }
  },
});

export const getF1Matches = tool({
  description: "Get next F1 match race",
  inputSchema: z.object({}),
  execute: async () => {
    try {
      const res = await fetch(
        "https://api.jolpi.ca/ergast/f1/current/next.json",
        { cache: "no-store" },
      );

      if (!res.ok) throw new Error("Failed to fetch F1 data");

      const data = await res.json();

      const race = data?.MRData?.RaceTable?.Races?.[0];

      if (!race) {
        return { message: "No upcoming race found." };
      }

      const raceDateUTC = new Date(`${race.date}T${race.time}`);

      return {
        season: race.season,
        round: race.round,
        raceName: race.raceName,

        circuit: {
          name: race.Circuit.circuitName,
          locality: race.Circuit.Location.locality,
          country: race.Circuit.Location.country,
          lat: Number(race.Circuit.Location.lat),
          long: Number(race.Circuit.Location.long),
        },

        race: {
          dateUTC: raceDateUTC.toISOString(),
          localDate: raceDateUTC.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          localTime: raceDateUTC.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },

        sessions: {
          fp1: race.FirstPractice
            ? `${race.FirstPractice.date}T${race.FirstPractice.time}`
            : null,
          fp2: race.SecondPractice
            ? `${race.SecondPractice.date}T${race.SecondPractice.time}`
            : null,
          fp3: race.ThirdPractice
            ? `${race.ThirdPractice.date}T${race.ThirdPractice.time}`
            : null,
          qualifying: race.Qualifying
            ? `${race.Qualifying.date}T${race.Qualifying.time}`
            : null,
        },
      };
    } catch {
      return { error: "Unable to fetch F1 race data." };
    }
  },
});

export const getStockPrice = tool({
  description: "Get current stock price for a symbol",
  inputSchema: z.object({
    symbol: z.string().describe("Stock ticker symbol (e.g., AAPL)"),
  }),
  execute: async ({ symbol }) => {
    try {
      const res = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_KEY}`,
      );

      if (!res.ok) throw new Error("Failed to fetch stock data");

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
    } catch (error) {
      console.error("Stock API Error:", error);
      return { error: "Unable to fetch stock data." };
    }
  },
});
