import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ShieldAlert, User, AlertTriangle } from "lucide-react";

export function CopyrightModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show on every visit for demo purposes, or check localStorage for "has_seen_copyright"
    const hasSeen = localStorage.getItem("has_seen_copyright");
    if (!hasSeen) {
      setTimeout(() => setIsOpen(true), 500);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("has_seen_copyright", "true");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20 mb-2">
                <User className="w-8 h-8 text-yellow-400" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                  Погода Користувача
                </h2>
                <div className="flex items-center justify-center gap-2 text-sm text-white/60 bg-white/5 py-1 px-3 rounded-full w-fit mx-auto border border-white/5">
                  <span>Творець:</span>
                  <span className="text-yellow-400 font-bold">Артем Процко</span>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 w-full flex gap-3 items-start text-left">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-bold text-red-400 text-sm">Увага</h3>
                  <p className="text-xs text-red-200/80 leading-relaxed">
                    Копіювання, плагіат та незаконне використання дизайну чи коду суворо заборонено. Всі права захищені автором.
                  </p>
                </div>
              </div>

              <Button 
                onClick={handleClose}
                className="w-full bg-white text-black hover:bg-white/90 font-bold h-12 rounded-xl"
              >
                Зрозуміло
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
