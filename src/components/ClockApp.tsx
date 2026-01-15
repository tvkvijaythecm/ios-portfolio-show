import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const ClockApp = () => {
  const [theme, setTheme] = useState('light');
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Calculate rotation degrees
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = ((minutes * 60 + seconds) / 3600) * 360;
  const hourDeg = ((hours % 12) * 3600 + minutes * 60 + seconds) / (12 * 3600) * 360; 

  const isDark = theme === 'dark';
  
  // Dynamic Styles based on Theme
  const styles = {
    bg: isDark ? 'bg-[#212529]' : 'bg-[#E0E5EC]',
    text: isDark ? 'text-[#f8f9fa] drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]' : 'text-[#4D5B7C]',
    textDim: isDark ? 'text-[#adb5bd]' : 'text-[#A3B1C6]',
    border: isDark ? 'border-[#212529]' : 'border-[#E0E5EC]',
    
    shadowOut: isDark 
      ? 'shadow-[10px_10px_20px_rgba(0,0,0,0.5),-10px_-10px_20px_rgba(255,255,255,0.06)]' 
      : 'shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]',
      
    shadowIn: isDark
      ? 'shadow-[inset_5px_5px_10px_rgba(0,0,0,0.5),inset_-5px_-5px_10px_rgba(255,255,255,0.06)]'
      : 'shadow-[inset_6px_6px_10px_rgb(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.5)]',
    
    handHour: isDark ? 'bg-[#dee2e6]' : 'bg-[#4D5B7C]',
    handMin: isDark ? 'bg-[#adb5bd]' : 'bg-[#7D8CA5]',
    handSec: isDark ? 'bg-[#ff6b6b]' : 'bg-[#FF5A5F]', 
    
    toggleBtn: isDark 
      ? 'bg-[#212529] text-yellow-400' 
      : 'bg-[#E0E5EC] text-slate-400 hover:text-orange-500',
      
    markerMain: isDark ? 'bg-[#dee2e6]' : 'bg-[#4D5B7C]',
    markerSub: isDark ? 'bg-[#495057]' : 'bg-[#A3B1C6]',
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center transition-colors duration-500 ease-in-out ${styles.bg}`}>
      
      {/* Main Container */}
      <div className="relative flex flex-col items-center gap-12 p-8">
        
        {/* Theme Toggle */}
        <div className="absolute top-0 right-0 p-6 md:static md:p-0 md:mb-8 w-full flex justify-end md:justify-center">
            <button 
              onClick={toggleTheme}
              className={`p-4 rounded-full transition-all duration-300 ${styles.shadowOut} ${styles.toggleBtn} active:${styles.shadowIn} hover:scale-105`}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={24} /> : <Moon size={24} />}
            </button>
        </div>

        {/* Clock Face */}
        <div 
          className={`relative w-72 h-72 md:w-96 md:h-96 rounded-full flex items-center justify-center transition-all duration-500 ${styles.shadowOut} ${styles.border} border-8`}
        >
          {/* Inner Ring */}
          <div className={`absolute w-[88%] h-[88%] rounded-full ${styles.shadowIn} opacity-100 pointer-events-none transition-all duration-500`}></div>

          {/* Clock Numbers */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-full h-full text-center pt-5 font-bold text-xl md:text-2xl transition-colors duration-300 ${styles.textDim}`}
              style={{ transform: `rotate(${i * 30}deg)` }}
            >
              <span 
                className="inline-block" 
                style={{ transform: `rotate(-${i * 30}deg)` }}
              >
                {i === 0 ? 12 : i}
              </span>
            </div>
          ))}

          {/* Minute Ticks */}
          {[...Array(60)].map((_, i) => {
            if (i % 5 === 0) return null; 
            return (
              <div
                key={i}
                className="absolute w-full h-full flex justify-center pt-2"
                style={{ transform: `rotate(${i * 6}deg)` }}
              >
                <div className={`w-0.5 h-1.5 rounded-full ${styles.markerSub}`}></div>
              </div>
            );
          })}

          {/* Hands Container */}
          <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-xl">
             
             {/* Center Pin */}
            <div className={`absolute z-30 w-6 h-6 rounded-full ${styles.bg} ${styles.shadowOut} flex items-center justify-center border-2 ${styles.border}`}>
               <div className={`w-2 h-2 rounded-full ${styles.handSec}`}></div>
            </div>

            {/* Hour Hand */}
            <div
              className={`absolute z-10 w-2 md:w-3 h-[26%] bottom-[50%] origin-bottom rounded-full ${styles.handHour}`}
              style={{ transform: `rotate(${hourDeg}deg)` }}
            ></div>

            {/* Minute Hand */}
            <div
              className={`absolute z-20 w-1.5 md:w-2 h-[40%] bottom-[50%] origin-bottom rounded-full ${styles.handMin}`}
              style={{ transform: `rotate(${minuteDeg}deg)` }}
            ></div>

            {/* Second Hand */}
            <div
              className={`absolute z-20 w-0.5 md:w-1 h-[48%] bottom-[50%] origin-bottom rounded-full ${styles.handSec}`}
              style={{ transform: `rotate(${secondDeg}deg)` }}
            >
               {/* Counterweight */}
               <div className={`absolute top-[100%] left-1/2 -translate-x-1/2 w-1 md:w-1.5 h-6 ${styles.handSec} rounded-b-full`}></div>
            </div>

          </div>
        </div>

        {/* Digital Display */}
        <div className={`flex flex-col items-center justify-center px-10 py-5 rounded-3xl ${styles.shadowOut} transition-all duration-500`}>
            <div className={`text-4xl md:text-5xl font-mono tracking-widest font-bold transition-colors duration-300 ${styles.text}`}>
                {time.toLocaleTimeString([], { hour12: false })}
            </div>
            <div className={`text-sm md:text-base mt-2 font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${styles.textDim}`}>
                {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ClockApp;