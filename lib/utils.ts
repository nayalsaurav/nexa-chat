import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizeWeather = (data: any) => {
  return {
    location: `${data.location.name}, ${data.location.country}`,
    localTime: data.location.localtime,

    current: {
      tempC: data.current.temp_c,
      tempF: data.current.temp_f,
      condition: data.current.condition.text,
      icon: `https:${data.current.condition.icon}`,
      feelsLikeC: data.current.feelslike_c,
      humidity: data.current.humidity,
      uv: data.current.uv,
    },

    daily: data.forecast.forecastday.map((day: any) => ({
      date: day.date,
      maxC: day.day.maxtemp_c,
      minC: day.day.mintemp_c,
      maxF: day.day.maxtemp_f,
      minF: day.day.mintemp_f,
      condition: day.day.condition.text,
      icon: `https:${day.day.condition.icon}`,
      rainChance: day.day.daily_chance_of_rain,
    })),
  };
};
