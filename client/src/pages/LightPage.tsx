import { useState, useEffect } from "react";
import { BackgroundManager } from "@/components/BackgroundManager";
import { ArrowLeft, Lock } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function LightPage() {
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    // Check if blocked by admin
    const blocked = localStorage.getItem("light_page_blocked") === "true";
    setIsBlocked(blocked);
  }, []);

  if (isBlocked) {
    return (
      <BackgroundManager condition="dtek">
        <div className="min-h-screen flex items-center justify-center p-4">
           <div className="absolute top-4 left-4 z-20">
            <Link href="/">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white bg-black/40 hover:bg-black/60 rounded-full border border-white/20 backdrop-blur-md"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
          </div>
          
          <div className="glass-panel bg-black/60 border-red-500/30 p-8 rounded-3xl text-center max-w-md backdrop-blur-xl">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
              <Lock className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Доступ тимчасово обмежено</h1>
            <p className="text-white/60 mb-6">
              Адміністратор тимчасово заблокував доступ до цього розділу. Спробуйте пізніше.
            </p>
            <Link href="/">
              <Button className="w-full bg-white text-black hover:bg-white/90 font-bold">
                Повернутись на головну
              </Button>
            </Link>
          </div>
        </div>
      </BackgroundManager>
    );
  }

  return (
    <BackgroundManager condition="dtek">
      <div className="h-screen flex flex-col relative overflow-hidden">
        {/* Navigation Header - Absolute on top */}
        <div className="absolute top-4 left-4 z-20">
          <Link href="/">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white bg-black/40 hover:bg-black/60 rounded-full border border-white/20 backdrop-blur-md"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
        </div>

        {/* Fullscreen Iframe */}
        <iframe 
          src="https://light-in-app.web.app/" 
          className="w-full h-full border-0 bg-white"
          title="Світло - Графіки відключень"
          allow="geolocation"
        />
      </div>
    </BackgroundManager>
  );
}
