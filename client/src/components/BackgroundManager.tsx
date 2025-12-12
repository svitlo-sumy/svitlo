import { motion } from "framer-motion";
import { WeatherType } from "@/lib/weather-data";
import sunBg from "@assets/generated_images/sunny_day_sky_background.png";
import nightBg from "@assets/generated_images/starry_night_sky_background.png";
import rainBg from "@assets/generated_images/rainy_weather_background.png";
import snowBg from "@assets/generated_images/snowy_weather_background.png";
import dtekBg from "@assets/generated_images/electric_utility_repair_background.png";

interface BackgroundManagerProps {
  condition?: WeatherType | "dtek";
  children: React.ReactNode;
}

export function BackgroundManager({ condition = "sunny", children }: BackgroundManagerProps) {
  let bgImage = sunBg;
  
  switch (condition) {
    case "sunny": bgImage = sunBg; break;
    case "night": bgImage = nightBg; break;
    case "rainy": bgImage = rainBg; break;
    case "snowy": bgImage = snowBg; break;
    case "dtek": bgImage = dtekBg; break;
    default: bgImage = sunBg;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <motion.div
        key={condition}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-black/20" /> {/* Overlay for readability */}
      </motion.div>
      
      <div className="relative z-10 h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
