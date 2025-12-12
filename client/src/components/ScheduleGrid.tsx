import { motion } from "framer-motion";

interface ScheduleHour {
  hour: number;
  status: "on" | "off" | "possible";
}

interface DaySchedule {
  day: string;
  hours: ScheduleHour[];
}

// Helper to generate mock schedule
const generateMockSchedule = (): DaySchedule[] => {
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
  return days.map(day => ({
    day,
    hours: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      // Random mock pattern: 4 hours on, 4 hours off
      status: Math.random() > 0.6 ? "off" : Math.random() > 0.8 ? "possible" : "on"
    }))
  }));
};

export function ScheduleGrid() {
  const schedule = generateMockSchedule();
  const currentHour = new Date().getHours();
  const currentDayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1; // Mon=0, Sun=6

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[600px] bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10">
        
        {/* Legend */}
        <div className="flex gap-4 mb-4 text-xs text-white justify-end">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white rounded-sm"></div>
            <span>Є світло</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500/50 rounded-sm border border-white/20"></div>
            <span>Можливо</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-800 rounded-sm border border-white/10"></div>
            <span>Немає</span>
          </div>
        </div>

        {/* Header (Hours) */}
        <div className="flex mb-2 ml-8">
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="flex-1 text-center text-[10px] text-white/60">
              {i}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex flex-col gap-2">
          {schedule.map((day, dayIndex) => (
            <div key={day.day} className={`flex items-center ${dayIndex === currentDayIndex ? 'bg-white/5 rounded-lg py-1 -mx-1 px-1' : ''}`}>
              <div className="w-8 text-xs font-bold text-white shrink-0">{day.day}</div>
              <div className="flex-1 flex gap-[2px]">
                {day.hours.map((hour) => (
                  <motion.div
                    key={hour.hour}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (dayIndex * 24 + hour.hour) * 0.005 }}
                    className={`
                      h-8 flex-1 rounded-sm relative group
                      ${hour.status === 'on' ? 'bg-white' : ''}
                      ${hour.status === 'possible' ? 'bg-gray-500/50 border border-white/20' : ''}
                      ${hour.status === 'off' ? 'bg-gray-800 border border-white/10' : ''}
                      ${dayIndex === currentDayIndex && hour.hour === currentHour ? 'ring-2 ring-yellow-400 z-10' : ''}
                    `}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-[10px] p-1 rounded whitespace-nowrap z-20 pointer-events-none">
                      {hour.hour}:00 - {hour.status === 'on' ? 'Світло є' : hour.status === 'off' ? 'Відключення' : 'Можливе відключення'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
