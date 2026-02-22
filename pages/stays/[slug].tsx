import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { RESORTS } from '../../constants';

export default function ResortDetail() {
  const { slug } = useParams();
  const resort = RESORTS.find(r => r.slug === slug);

  if (!resort) return <div className="p-40 text-center font-serif text-2xl">Resort not found.</div>;

  return (
    <div className="bg-white min-h-screen pt-24">
      <section className="h-[70vh] relative overflow-hidden">
        <img src={resort.images[0]} className="w-full h-full object-cover" alt={resort.name} />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-12 left-12 text-white">
           <h1 className="text-6xl font-serif font-bold italic">{resort.name}</h1>
           <p className="text-xl uppercase tracking-[0.4em] mt-4">{resort.atoll}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-24">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
            <div className="lg:col-span-2">
               <p className="text-3xl font-serif font-bold italic border-l-8 border-sky-500 pl-12 py-4 mb-12">
                 "{resort.uvp}"
               </p>
               <div className="text-slate-600 text-xl leading-relaxed mb-12">
                 {resort.description}
               </div>
               <div className="grid grid-cols-2 gap-8">
                  {resort.features.map(f => (
                    <div key={f} className="flex items-center gap-4">
                       <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                       <span className="font-bold text-slate-800">{f}</span>
                    </div>
                  ))}
               </div>
            </div>
            <div className="bg-slate-900 text-white p-12 rounded-[3rem] h-fit sticky top-32">
               <h3 className="text-2xl font-serif font-bold italic mb-6">Plan Your Trip</h3>
               <p className="text-slate-400 mb-8">Let our specialists handle everything from flights to VIP transfers.</p>
               <Link to="/plan" className="block w-full bg-sky-600 text-center py-5 rounded-2xl font-bold uppercase tracking-widest text-xs">
                 Book Now
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
}