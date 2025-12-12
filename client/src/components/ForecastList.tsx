import { DailyForecast, getWeatherIcon } from "@/lib/weather-data";
import { motion } from "framer-motion";

interface ForecastListProps {
  forecast: DailyForecast[];
}

export function ForecastList({ forecast }: ForecastListProps) {
  return (
    <div className="w-full max-w-md mx-auto mt-6 px-4 pb-24">
      <h3 className="text-white font-bold text-lg mb-4 drop-shadow-md">Прогноз на тиждень</h3>
      <div className="flex flex-col gap-3">
        {forecast.map((day, index) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel p-4 rounded-2xl flex items-center justify-between text-white"
          >
            <span className="font-semibold w-24">{day.day}</span>
            <div className="flex items-center gap-2">
              {getWeatherIcon(day.condition, "w-6 h-6")}
              <span className="text-sm opacity-80">{day.precipProb > 0 ? `${day.precipProb}%` : ""}</span>
            </div>
            <div className="flex gap-4 w-24 justify-end">
              <span className="font-bold">{day.temp}°</span>
              <span className="opacity-70 text-sm">{day.windSpeed} м/с</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
