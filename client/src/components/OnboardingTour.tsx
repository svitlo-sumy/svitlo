import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Step {
  target: string; // data-testid
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    target: "button-location",
    title: "📍 Локація",
    description: "Натисніть на назву міста, щоб змінити його або знайти своє поточне розташування.",
  },
  {
    target: "button-light-page",
    title: "💡 Графіки відключень",
    description: "Натисніть на лампочку, щоб перевірити актуальні графіки відключень світла.",
  },
  {
    target: "forecast-list",
    title: "📅 Прогноз на тиждень",
    description: "Прокрутіть вниз, щоб побачити детальний прогноз погоди на найближчі дні.",
  }
];

export function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Clear previous tour state for testing if needed, or check normal flag
    const hasSeenTour = localStorage.getItem("has_seen_tour");
    if (!hasSeenTour) {
      setTimeout(() => setIsVisible(true), 1000);
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isVisible && STEPS[currentStep]) {
      const updatePosition = () => {
        const element = document.querySelector(`[data-testid="${STEPS[currentStep].target}"]`);
        if (element) {
          const rect = element.getBoundingClientRect();
          setTargetRect(rect);
          
          // Smooth scroll to element if it's off screen
          const isInViewport = (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
          );

          if (!isInViewport) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      };

      updatePosition();
      // Update on resize/scroll
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [currentStep, isVisible]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeTour();
    }
  };

  const completeTour = () => {
    setIsVisible(false);
    localStorage.setItem("has_seen_tour", "true");
  };

  if (!isVisible || !targetRect) return null;

  const step = STEPS[currentStep];

  // Calculate tooltip position
  // Default to bottom, flip to top if too close to bottom edge
  const isBottom = targetRect.bottom > window.innerHeight - 200;
  const tooltipTop = isBottom 
    ? targetRect.top - 10 
    : targetRect.bottom + 10;
    
  // Center horizontally relative to target, but clamp to screen edges
  const tooltipLeft = Math.max(16, Math.min(window.innerWidth - 320 - 16, targetRect.left + (targetRect.width / 2) - 160));

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Dark overlay with hole punch effect using SVG mask would be ideal, but simple semi-transparent overlay works for mockup */}
      <div className="absolute inset-0 bg-black/70 pointer-events-auto transition-opacity duration-500" onClick={completeTour} />

      {/* Spotlight highlight ring */}
      <motion.div 
        layoutId="spotlight"
        className="absolute rounded-lg border-2 border-yellow-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]"
        initial={false}
        animate={{
          top: targetRect.top - 8,
          left: targetRect.left - 8,
          width: targetRect.width + 16,
          height: targetRect.height + 16,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      />

      {/* Tooltip Card */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="absolute pointer-events-auto w-[320px]"
        style={{
          top: isBottom ? undefined : tooltipTop,
          bottom: isBottom ? window.innerHeight - targetRect.top + 20 : undefined,
          left: isMobile ? '50%' : tooltipLeft,
          translateX: isMobile ? '-50%' : 0,
        }}
      >
        <div className="bg-white text-black p-5 rounded-2xl shadow-2xl relative mx-4 border border-white/20">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 h-6 w-6 hover:bg-black/5 text-gray-400 hover:text-gray-900" 
            onClick={completeTour}
          >
            <X className="w-4 h-4" />
          </Button>
          
          <h3 className="font-bold text-lg mb-2 text-primary flex items-center gap-2">
            {step.title}
          </h3>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">{step.description}</p>
          
          <div className="flex justify-between items-center mt-auto">
            <div className="flex gap-1.5">
              {STEPS.map((_, idx) => (
                <motion.div 
                  key={idx} 
                  animate={{ 
                    backgroundColor: idx === currentStep ? '#EAB308' : '#E5E7EB',
                    scale: idx === currentStep ? 1.2 : 1
                  }}
                  className="w-2 h-2 rounded-full"
                />
              ))}
            </div>
            <Button 
              onClick={handleNext} 
              size="sm" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6"
            >
              {currentStep === STEPS.length - 1 ? "Готово" : "Далі"}
            </Button>
          </div>
          
          {/* Arrow */}
          <div 
            className={`absolute w-4 h-4 bg-white rotate-45 border-l border-t border-white/20 transform -translate-x-1/2 left-1/2 ${
              isBottom ? "-bottom-2 border-b border-r border-t-0 border-l-0" : "-top-2"
            }`} 
          />
        </div>
      </motion.div>
    </div>
  );
}
