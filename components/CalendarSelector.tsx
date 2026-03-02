import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';

interface CalendarSelectorProps {
  range: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}

const CalendarSelector: React.FC<CalendarSelectorProps> = ({ range, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayDate = range?.from 
    ? `${format(range.from, 'MMM d')}${range.to ? ` - ${format(range.to, 'MMM d')}` : ''}`
    : 'Select Dates';

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl pl-16 pr-6 py-5 text-sm focus:ring-2 focus:ring-sky-500 transition-all text-slate-900 dark:text-white flex items-center justify-between group"
      >
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors">
          <Calendar size={18} />
        </div>
        <span className="truncate">{displayDate}</span>
        <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 md:left-auto md:right-0 mt-2 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-white/5 p-6 z-50 min-w-[320px]"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.4em]">Select Dates</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X size={16} />
              </button>
            </div>
            
            <div className="calendar-container">
              <DayPicker
                mode="range"
                selected={range}
                onSelect={onChange}
                numberOfMonths={1}
                disabled={{ before: new Date() }}
                className="border-none"
                modifiersClassNames={{
                  selected: 'bg-sky-500 text-white rounded-full',
                  range_start: 'bg-sky-500 text-white rounded-l-full',
                  range_end: 'bg-sky-500 text-white rounded-r-full',
                  range_middle: 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400',
                }}
              />
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
              <button
                type="button"
                onClick={() => onChange(undefined)}
                className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="py-3 px-8 bg-sky-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-sky-600 transition-colors"
              >
                Apply
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .rdp {
          --rdp-cell-size: 40px;
          --rdp-accent-color: #0ea5e9;
          --rdp-background-color: #e0f2fe;
          margin: 0;
        }
        .rdp-day_selected, .rdp-day_selected:focus, .rdp-day_selected:hover {
          background-color: var(--rdp-accent-color);
          color: white;
        }
        .dark .rdp-day_selected:focus, .dark .rdp-day_selected:hover {
          background-color: var(--rdp-accent-color);
        }
        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
          background-color: #f1f5f9;
        }
        .dark .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
          background-color: #1e293b;
        }
        .rdp-nav_button {
          color: #94a3b8;
        }
        .rdp-head_cell {
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #94a3b8;
        }
        .rdp-day {
          font-size: 12px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default CalendarSelector;
