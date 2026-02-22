import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { RESORTS } from '../../constants';
import { AccommodationType } from '../../types';
import ResortCard from '../../components/ResortCard';

export default function Stays() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';
  
  const [filterQuery, setFilterQuery] = useState(initialQuery);
  const [stayType, setStayType] = useState<AccommodationType>(AccommodationType.RESORT);
  const [selectedAtoll, setSelectedAtoll] = useState<string>('All');

  const atolls = useMemo(() => {
    const set = new Set(RESORTS.filter(r => r.type === stayType).map(r => r.atoll));
    return ['All', ...Array.from(set)];
  }, [stayType]);

  const filteredStays = useMemo(() => {
    return RESORTS.filter(stay => {
      const matchesType = stay.type === stayType;
      const matchesSearch = stay.name.toLowerCase().includes(filterQuery.toLowerCase()) || 
                            stay.atoll.toLowerCase().includes(filterQuery.toLowerCase());
      const matchesAtoll = selectedAtoll === 'All' || stay.atoll === selectedAtoll;
      return matchesType && matchesSearch && matchesAtoll;
    });
  }, [stayType, filterQuery, selectedAtoll]);

  return (
    <div className="bg-slate-50 min-h-screen pt-24">
      <div className={`transition-all duration-700 py-24 px-4 text-white text-center relative overflow-hidden ${stayType === AccommodationType.RESORT ? 'bg-sky-950' : 'bg-teal-950'}`}>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 italic">
            {stayType === AccommodationType.RESORT ? 'Luxury Resorts' : 'Local Guest Houses'}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-center -mt-24 mb-16 relative z-20">
          <div className="bg-white/95 backdrop-blur-xl p-2 rounded-3xl shadow-2xl border border-slate-100 flex gap-2">
            <button 
              onClick={() => setStayType(AccommodationType.RESORT)}
              className={`px-10 py-4 rounded-2xl text-xs font-bold transition-all uppercase tracking-[0.2em] ${stayType === AccommodationType.RESORT ? 'bg-sky-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Private Resorts
            </button>
            <button 
              onClick={() => setStayType(AccommodationType.GUEST_HOUSE)}
              className={`px-10 py-4 rounded-2xl text-xs font-bold transition-all uppercase tracking-[0.2em] ${stayType === AccommodationType.GUEST_HOUSE ? 'bg-teal-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Local Islands
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredStays.map(stay => (
            <ResortCard key={stay.id} resort={stay} />
          ))}
        </div>
      </div>
    </div>
  );
}