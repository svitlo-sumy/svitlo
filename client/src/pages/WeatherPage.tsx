import { useState, useEffect } from "react";
import { BackgroundManager } from "@/components/BackgroundManager";
import { WeatherDisplay } from "@/components/WeatherDisplay";
import { ForecastList } from "@/components/ForecastList";
import { OnboardingTour } from "@/components/OnboardingTour";
import { CopyrightModal } from "@/components/CopyrightModal";
import { DEFAULT_WEATHER, fetchWeather, searchCity, CurrentWeather, DailyForecast } from "@/lib/weather-data";
import { Lightbulb, MapPin, Search, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function WeatherPage() {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather>(DEFAULT_WEATHER);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [locationName, setLocationName] = useState("Київ");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load
  useEffect(() => {
    loadWeatherData(50.45, 30.52, "Київ");
  }, []);

  const loadWeatherData = async (lat: number, lon: number, name: string) => {
    setIsLoading(true);
    const data = await fetchWeather(lat, lon, name);
    setCurrentWeather(data.current);
    setForecast(data.forecast);
    setLocationName(name);
    setIsLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    const city = await searchCity(searchQuery);
    
    if (city) {
      await loadWeatherData(city.lat, city.lon, city.name);
      setIsSearchOpen(false);
      setSearchQuery("");
    } else {
      alert("Місто не знайдено"); // Simple feedback
      setIsLoading(false);
    }
  };

  const toggleDayNight = () => {
    setCurrentWeather(prev => ({
      ...prev,
      condition: prev.condition === "sunny" ? "night" : "sunny"
    }));
  };

  return (
    <BackgroundManager condition={currentWeather.condition}>
      <div className="min-h-screen flex flex-col relative">
        <CopyrightModal />
        <OnboardingTour />
        {/* Header */}
        <header className="p-4 flex justify-between items-center z-20">
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/20 gap-2 font-heading"
                data-testid="button-location"
              >
                <MapPin className="w-5 h-5" />
                {locationName}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Введіть місто</DialogTitle>
              </DialogHeader>
              <div className="flex gap-2">
                <Input 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Назва міста..."
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Link href="/light">
            <Button 
              size="icon" 
              className="rounded-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 shadow-[0_0_20px_rgba(250,204,21,0.6)] border-2 border-yellow-200"
              data-testid="button-light-page"
            >
              <Lightbulb className="w-6 h-6 fill-current" />
            </Button>
          </Link>
        </header>

        {/* Debug Controls */}
        <div className="absolute top-16 right-4 flex flex-col gap-2 z-20">
             <div onClick={toggleDayNight} className="w-8 h-8 opacity-0 cursor-pointer" title="Toggle Day/Night" />
        </div>

        {/* Main Content */}
        <main className="flex-1 transition-opacity duration-500" style={{ opacity: isLoading ? 0.5 : 1 }}>
          <WeatherDisplay weather={currentWeather} />
          <div data-testid="forecast-list">
            <ForecastList forecast={forecast} />
          </div>
        </main>
        
        <footer className="p-4 text-center text-white/60 text-xs z-20 pb-8">
          Творець: Артем Процко
        </footer>
      </div>
    </BackgroundManager>
  );
}
