import { motion } from "framer-motion";
import { CurrentWeather, getWeatherIcon } from "@/lib/weather-data";
import { Wind, Droplets } from "lucide-react";

interface WeatherDisplayProps {
  weather: CurrentWeather;
}

export function WeatherDisplay({ weather }: WeatherDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center text-white pt-10 pb-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg mb-2">{weather.city}</h1>
        <div className="flex items-center justify-center gap-4">
          <div className="p-2 bg-white/20 backdrop-blur-md rounded-full">
            {getWeatherIcon(weather.condition, "w-16 h-16 md:w-24 md:h-24 text-primary")}
          </div>
          <span className="text-6xl md:text-8xl font-black tracking-tighter drop-shadow-xl">
            {weather.temp}°
          </span>
        </div>
        <p className="text-xl md:text-2xl font-medium mt-2 drop-shadow-md opacity-90 capitalize">
          {weather.description}
        </p>
      </motion.div>

      <div className="flex gap-4 mt-8">
        <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold">
          <Wind className="w-4 h-4" />
          <span>{weather.windSpeed} м/с</span>
        </div>
        <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold">
          <Droplets className="w-4 h-4" />
          <span>{weather.humidity}%</span>
        </div>
      </div>
    </div>
  );
}
