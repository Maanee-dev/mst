
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RESORTS } from '../constants';
import { supabase, mapResort } from '../lib/supabase';

const MaldivesGallery: React.FC = () => {
  const [shuffledImages, setShuffledImages] = useState<{url: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase.from('resorts').select('*');
        if (error) throw error;

        let resorts = RESORTS;
        if (data && data.length > 0) {
          resorts = data.map(item => mapResort(item));
        }

        const allImages = resorts.flatMap(resort => 
          resort.images.map(img => ({ url: img, name: resort.name }))
        );
        
        setShuffledImages([...allImages].sort(() => 0.5 - Math.random()));
      } catch (err) {
        console.error("Gallery fetch error:", err);
        const allImages = RESORTS.flatMap(resort => 
          resort.images.map(img => ({ url: img, name: resort.name }))
        );
        setShuffledImages([...allImages].sort(() => 0.5 - Math.random()));
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('active');
        });
      }, { threshold: 0.1 });
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
      return () => observer.disconnect();
    }
  }, [loading]);
  
  const row1 = shuffledImages.slice(0, 12);
  const row2 = shuffledImages.slice(12, 24);

  const maldivesTexts = [
    "1,200 Islands of Pure Serenity",
    "Turquoise Lagoons & White Sands",
    "Luxury Overwater Living",
    "Vibrant Coral Reefs",
    "Unforgettable Sunsets",
    "A Sanctuary for Marine Life",
    "Pristine Nature",
    "Bespoke Island Escapes"
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden border-t border-slate-100 dark:border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 mb-16 reveal">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-12 h-[1px] bg-sky-500"></div>
          <span className="text-[10px] font-bold text-sky-500 uppercase tracking-[1.2em]">Maldives Gallery</span>
        </div>
        <h2 className="text-4xl md:text-6xl lg:text-8xl font-serif font-medium text-slate-950 dark:text-white tracking-tighter leading-none">
          Island Perspectives<span className="text-sky-500">.</span>
        </h2>
      </div>

      <div className="space-y-16">
        {/* Row 1: Left to Right */}
        <div className="relative flex overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing">
          <motion.div 
            className="flex gap-8 whitespace-nowrap px-6"
            animate={{ x: [-2500, 0] }}
            transition={{ 
              duration: 80, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {[...row1, ...row1].map((img, i) => {
              const skipGrayscale = ['JOALI Maldives', 'The Nautilus Maldives', 'NH Collection Maldives Reethi Resort'].includes(img.name);
              return (
                <div key={i} className="relative w-80 md:w-[450px] aspect-[16/10] flex-shrink-0 group overflow-hidden rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-white/5">
                  <img 
                    src={img.url} 
                    alt={img.name} 
                    className={`w-full h-full object-cover transition-all duration-1000 scale-110 group-hover:scale-100 ${skipGrayscale ? '' : 'grayscale group-hover:grayscale-0'}`}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700"></div>
                  <div className="absolute bottom-8 left-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-[10px] font-bold text-white uppercase tracking-[0.4em] bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">
                      {img.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Text Marquee Section */}
        <div className="py-16 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-white/5 relative">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
              <span className="text-[20vw] font-serif font-bold uppercase tracking-tighter">Maldives</span>
           </div>
           <div className="flex overflow-hidden relative z-10">
             <motion.div 
               className="flex whitespace-nowrap gap-32 items-center"
               animate={{ x: [0, -2500] }}
               transition={{ 
                 duration: 60, 
                 repeat: Infinity, 
                 ease: "linear" 
               }}
             >
                {maldivesTexts.map((text, i) => (
                  <span key={i} className="text-4xl md:text-6xl lg:text-7xl font-serif italic text-slate-300 dark:text-slate-700 uppercase tracking-[0.1em]">{text}</span>
                ))}
                {/* Duplicate for loop */}
                {maldivesTexts.map((text, i) => (
                  <span key={`dup-${i}`} className="text-4xl md:text-6xl lg:text-7xl font-serif italic text-slate-300 dark:text-slate-700 uppercase tracking-[0.1em]">{text}</span>
                ))}
             </motion.div>
           </div>
        </div>

        {/* Row 2: Right to Left */}
        <div className="relative flex overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing">
          <motion.div 
            className="flex gap-8 whitespace-nowrap px-6"
            animate={{ x: [0, -2500] }}
            transition={{ 
              duration: 80, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {[...row2, ...row2].map((img, i) => {
              const skipGrayscale = ['JOALI Maldives', 'The Nautilus Maldives', 'NH Collection Maldives Reethi Resort'].includes(img.name);
              return (
                <div key={i} className="relative w-80 md:w-[450px] aspect-[16/10] flex-shrink-0 group overflow-hidden rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-white/5">
                  <img 
                    src={img.url} 
                    alt={img.name} 
                    className={`w-full h-full object-cover transition-all duration-1000 scale-110 group-hover:scale-100 ${skipGrayscale ? '' : 'grayscale group-hover:grayscale-0'}`}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700"></div>
                  <div className="absolute bottom-8 left-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-[10px] font-bold text-white uppercase tracking-[0.4em] bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">
                      {img.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-32 text-center reveal">
        <div className="w-16 h-[1px] bg-sky-500 mx-auto mb-12"></div>
        <p className="text-slate-500 dark:text-slate-400 text-xl md:text-3xl leading-relaxed font-serif italic mb-12">
          "The Maldives is not just a destination; it's a state of mind. A place where time slows down, and the only rhythm that matters is the gentle lap of waves against the shore."
        </p>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.8em]">Discover the Serenity</span>
      </div>
    </section>
  );
};

export default MaldivesGallery;
