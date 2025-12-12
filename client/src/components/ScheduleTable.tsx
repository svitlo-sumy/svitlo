import { motion } from "framer-motion";

interface TimeBlock {
  start: string;
  end: string;
}

interface QueueSchedule {
  id: string; // "1.1", "1.2", etc.
  blocks: TimeBlock[];
  totalHours: number;
}

// Generate schedule that mimics the image style for a specific queue group
// In a real app, this would come from the API
const generateScheduleForQueue = (): QueueSchedule[] => {
  const queues = ["1.1", "1.2", "2.1", "2.2", "3.1", "3.2", "4.1", "4.2", "5.1", "5.2", "6.1", "6.2"];
  
  return queues.map(id => {
    // Generate semi-random blocks to look realistic
    const blocks: TimeBlock[] = [];
    let totalMinutes = 0;
    
    // Pattern 1: 00-02, 06-10, 12-16, 18-22 (Heavy)
    // Pattern 2: 02-04, 08-12, 14-18, 20-24 (Shifted)
    // Pattern 3: 04-08, 10-14, 16-20, 22-24 (Shifted)
    
    const pattern = parseInt(id.replace('.', '')) % 3;
    
    if (pattern === 0) {
      blocks.push({ start: "02:00", end: "04:00" });
      blocks.push({ start: "08:00", end: "12:00" });
      blocks.push({ start: "14:00", end: "18:00" });
      blocks.push({ start: "20:00", end: "24:00" });
      totalMinutes = 14 * 60;
    } else if (pattern === 1) {
      blocks.push({ start: "00:00", end: "02:00" });
      blocks.push({ start: "06:00", end: "10:00" });
      blocks.push({ start: "12:00", end: "16:00" });
      blocks.push({ start: "18:00", end: "22:00" });
      totalMinutes = 14 * 60;
    } else {
      blocks.push({ start: "04:00", end: "08:00" });
      blocks.push({ start: "10:00", end: "14:00" });
      blocks.push({ start: "16:00", end: "20:00" });
      blocks.push({ start: "22:00", end: "24:00" });
      totalMinutes = 14 * 60;
    }

    return {
      id,
      blocks,
      totalHours: Math.round(totalMinutes / 60)
    };
  });
};

interface ScheduleTableProps {
  date: string;
  region: string;
}

export function ScheduleTable({ date, region }: ScheduleTableProps) {
  const schedule = generateScheduleForQueue();

  return (
    <div className="w-full overflow-hidden rounded-xl bg-[#F0C086] border-4 border-[#E6A665] shadow-xl font-sans">
      {/* Header */}
      <div className="bg-[#FFD699] p-4 text-center border-b-4 border-[#E6A665] flex items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border-2 border-[#E6A665]">
           <span className="text-xl">💡</span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-wide">
          Світло {region} — графік відключень на <span className="bg-black/10 px-2 rounded">{date}</span>
        </h2>
      </div>

      {/* Grid Container */}
      <div className="p-2 md:p-4 bg-[#E8B476]/50 space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
        {schedule.map((row) => (
          <motion.div 
            key={row.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row gap-2 md:gap-4 items-stretch"
          >
            {/* Queue Label */}
            <div className="bg-[#D98E56] text-white font-bold py-3 px-4 rounded-lg md:w-32 flex items-center justify-center shadow-sm shrink-0">
              Черга {row.id}
            </div>

            {/* Time Blocks */}
            <div className="flex-1 flex flex-wrap gap-2 items-center min-h-[50px]">
              {row.blocks.map((block, idx) => (
                <div 
                  key={idx}
                  className="bg-[#FFE5B4] text-black font-bold py-2 px-3 rounded-md border border-[#D98E56]/30 shadow-sm text-sm whitespace-nowrap flex-1 md:flex-none text-center min-w-[100px]"
                >
                  {block.start}-{block.end}
                </div>
              ))}
            </div>

            {/* Total Time */}
            <div className="bg-[#D98E56] text-white font-bold py-2 px-4 rounded-lg md:w-32 flex items-center justify-center shadow-sm text-sm shrink-0">
              {row.totalHours} год 00 хв
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="bg-[#D98E56] p-2 text-center text-white/80 text-xs font-medium">
        Графік може змінюватись в залежності від ситуації в енергосистемі
      </div>
    </div>
  );
}
