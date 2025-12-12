import { Cloud, CloudRain, CloudSnow, Moon, Sun, Wind, CloudLightning, CloudDrizzle } from "lucide-react";

export type WeatherType = "sunny" | "cloudy" | "rainy" | "snowy" | "night" | "stormy";

export interface DailyForecast {
  day: string;
  temp: number;
  condition: WeatherType;
  windSpeed: number;
  precipProb: number;
  date: string; // Add date for better mapping
}

export interface CurrentWeather {
  temp: number;
  condition: WeatherType;
  description: string;
  city: string;
  windSpeed: number;
  humidity: number;
  isDay: boolean; // Helper to force day/night visuals
}

// Default fallback
export const DEFAULT_WEATHER: CurrentWeather = {
  temp: 0,
  condition: "sunny",
  description: "Завантаження...",
  city: "Київ",
  windSpeed: 0,
  humidity: 0,
  isDay: true
};

// Open-Meteo WMO Weather interpretation codes
// https://open-meteo.com/en/docs
const getWeatherCondition = (code: number, isDay: number): WeatherType => {
  if (!isDay) return "night";
  
  if (code === 0 || code === 1) return "sunny";
  if (code === 2 || code === 3) return "cloudy";
  if ([45, 48].includes(code)) return "cloudy"; // Fog
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "rainy";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snowy";
  if ([95, 96, 99].includes(code)) return "stormy";
  
  return "sunny";
};

const getWeatherDescription = (code: number): string => {
  const codes: Record<number, string> = {
    0: "Чисте небо",
    1: "Переважно ясно",
    2: "Мінлива хмарність",
    3: "Похмуро",
    45: "Туман",
    48: "Туман паморозь",
    51: "Слабка мряка",
    53: "Помірна мряка",
    55: "Густа мряка",
    56: "Крижана мряка",
    57: "Густа крижана мряка",
    61: "Слабкий дощ",
    63: "Помірний дощ",
    65: "Сильний дощ",
    66: "Крижаний дощ",
    67: "Сильний крижаний дощ",
    71: "Слабкий сніг",
    73: "Помірний сніг",
    75: "Сильний сніг",
    77: "Сніжні зерна",
    80: "Слабка злива",
    81: "Помірна злива",
    82: "Сильна злива",
    85: "Слабкий снігопад",
    86: "Сильний снігопад",
    95: "Гроза",
    96: "Гроза з градом",
    99: "Сильна гроза з градом"
  };
  return codes[code] || "Невідомо";
};

export async function fetchWeather(lat: number, lon: number, cityName: string): Promise<{ current: CurrentWeather, forecast: DailyForecast[] }> {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: "temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m",
      daily: "weather_code,temperature_2m_max,precipitation_probability_max,wind_speed_10m_max",
      timezone: "auto",
      forecast_days: "7"
    });

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
    const data = await response.json();

    if (!data || !data.current || !data.daily) {
      throw new Error("Invalid API response");
    }

    const current: CurrentWeather = {
      temp: Math.round(data.current.temperature_2m),
      condition: getWeatherCondition(data.current.weather_code, data.current.is_day),
      description: getWeatherDescription(data.current.weather_code),
      city: cityName,
      windSpeed: Math.round(data.current.wind_speed_10m),
      humidity: data.current.relative_humidity_2m,
      isDay: !!data.current.is_day
    };

    const forecast: DailyForecast[] = data.daily.time.map((dateStr: string, index: number) => {
      const date = new Date(dateStr);
      const today = new Date();
      let dayName = new Intl.DateTimeFormat('uk-UA', { weekday: 'long' }).format(date);
      
      // Capitalize first letter
      dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

      if (date.getDate() === today.getDate()) dayName = "Сьогодні";
      
      return {
        day: dayName,
        date: dateStr,
        temp: Math.round(data.daily.temperature_2m_max[index]),
        condition: getWeatherCondition(data.daily.weather_code[index], 1), // Forecast icons always day style
        windSpeed: Math.round(data.daily.wind_speed_10m_max[index]),
        precipProb: data.daily.precipitation_probability_max[index]
      };
    });

    return { current, forecast };
  } catch (error) {
    console.error("Weather fetch error:", error);
    return { 
      current: { ...DEFAULT_WEATHER, description: "Помилка оновлення" }, 
      forecast: [] 
    };
  }
}

export async function searchCity(query: string): Promise<{ name: string, lat: number, lon: number } | null> {
  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=uk&format=json`);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return {
        name: data.results[0].name,
        lat: data.results[0].latitude,
        lon: data.results[0].longitude
      };
    }
    return null;
  } catch (error) {
    console.error("City search error:", error);
    return null;
  }
}

export const getWeatherIcon = (condition: WeatherType, className?: string) => {
  switch (condition) {
    case "sunny": return <Sun className={className} />;
    case "cloudy": return <Cloud className={className} />;
    case "rainy": return <CloudDrizzle className={className} />;
    case "stormy": return <CloudLightning className={className} />;
    case "snowy": return <CloudSnow className={className} />;
    case "night": return <Moon className={className} />;
    default: return <Sun className={className} />;
  }
};
