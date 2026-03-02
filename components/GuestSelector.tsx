import React, { useState, useRef, useEffect } from 'react';
import { Plus, Minus, Users, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GuestSelectorProps {
  adults: number;
  children: number;
  onChange: (adults: number, children: number) => void;
}

const GuestSelector: React.FC<GuestSelectorProps> = ({ adults, children, onChange }) => {
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

  const totalGuests = adults + children;

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl pl-16 pr-6 py-5 text-sm focus:ring-2 focus:ring-sky-500 transition-all text-slate-900 dark:text-white flex items-center justify-between group"
      >
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors">
          <Users size={18} />
        </div>
        <span className="truncate">
          {adults} {adults === 1 ? 'Adult' : 'Adults'}
          {children > 0 && `, ${children} ${children === 1 ? 'Child' : 'Children'}`}
        </span>
        <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-white/5 p-6 z-50"
          >
            <div className="space-y-6">
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Adults</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ages 13+</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onChange(Math.max(1, adults - 1), children)}
                    className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold text-slate-900 dark:text-white w-4 text-center">{adults}</span>
                  <button
                    type="button"
                    onClick={() => onChange(adults + 1, children)}
                    className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Children</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ages 0-12</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onChange(adults, Math.max(0, children - 1))}
                    className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold text-slate-900 dark:text-white w-4 text-center">{children}</span>
                  <button
                    type="button"
                    onClick={() => onChange(adults, children + 1)}
                    className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full mt-6 py-3 bg-sky-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-sky-600 transition-colors"
            >
              Apply Selection
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GuestSelector;
