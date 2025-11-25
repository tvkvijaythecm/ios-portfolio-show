import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CalendarView = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const today = new Date().getDate();

  return (
    <div className="min-h-full bg-black/80 dark:bg-gray-950/90 backdrop-blur-sm rounded-3xl p-6">
      {/* Year Header with Navigation */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => setSelectedYear(selectedYear - 1)}
          className="p-2 hover:bg-white/10 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ChevronLeft className="w-8 h-8 text-white dark:text-gray-200" />
        </button>
        
        <h2 className="text-5xl font-bold text-red-500 dark:text-red-400">{selectedYear}</h2>
        
        <button
          onClick={() => setSelectedYear(selectedYear + 1)}
          className="p-2 hover:bg-white/10 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ChevronRight className="w-8 h-8 text-white dark:text-gray-200" />
        </button>
      </div>

      <div className="h-px bg-white/20 dark:bg-gray-700 mb-8" />

      {/* Year Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8">
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, monthIndex) => {
          const isCurrentMonth = monthIndex === currentMonth && selectedYear === currentYear;
          const daysInMonth = new Date(selectedYear, monthIndex + 1, 0).getDate();
          const firstDay = new Date(selectedYear, monthIndex, 1).getDay();
          
          return (
            <div key={month} className="text-white dark:text-gray-200">
              <h3 className={`text-2xl font-bold mb-3 ${isCurrentMonth ? 'text-red-500 dark:text-red-400' : ''}`}>
                {month}
              </h3>
              <div className="grid grid-cols-7 gap-1 text-sm">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                  const day = dayIndex + 1;
                  const isToday = monthIndex === currentMonth && 
                                  day === today && 
                                  selectedYear === currentYear;
                  
                  return (
                    <div
                      key={day}
                      className={`aspect-square flex items-center justify-center rounded-full text-center ${
                        isToday 
                          ? 'bg-red-500 dark:bg-red-600 text-white font-bold' 
                          : 'text-white/80 dark:text-gray-300'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
