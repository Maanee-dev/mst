
import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase.ts';
import { Experience } from '../types.ts';
import { EXPERIENCES } from '../constants.ts';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO.tsx';

/**
 * Experiences Page: Refactored for scalability with a filterable editorial grid.
 */
const Experiences: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Adventure', 'Wellness', 'Water Sports', 'Relaxation', 'Culture', 'Culinary'];

  useEffect(() => {
    const fetchExperiences = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('experiences')
          .select('*, resorts(id, name, slug)')
          .order('created_at', { ascending: true });
        
        if (data && data.length > 0) {
          const mapped = data.map(item => ({
            ...item,
            resortName: item.resorts?.name,
            resortSlug: item.resorts?.slug,
            resortId: item.resorts?.id
          })) as Experience[];
          setExperiences(mapped);
        } else {
          setExperiences(EXPERIENCES);
        }
      } catch (err) {
        console.error('Experience fetch error:', err);
        setExperiences(EXPERIENCES);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, experiences, activeCategory]);

  const filteredExperiences = useMemo(() => {
    if (activeCategory === 'All') return experiences;
    return experiences.filter(exp => exp.category === activeCategory);
  }, [experiences, activeCategory]);

  const spotlightExperience = useMemo(() => {
    return filteredExperiences.length > 0 ? filteredExperiences[0] : null;
  }, [filteredExperiences]);

  const gridExperiences = useMemo(() => {
    return filteredExperiences.length > 1 ? filteredExperiences.slice(1) : (activeCategory !== 'All' ? filteredExperiences : []);
  }, [filteredExperiences, activeCategory]);

  return (
    <div className="bg-parchment dark:bg-slate-950 min-h-screen selection:bg-sky-100 selection:text-sky-900 transition-colors duration-700">
      <SEO 
        title="Curated Maldives Experiences | Bespoke Adventures & Journeys" 
        description="Browse our collection of curated Maldivian experiences. From deep-sea diving and whale shark safaris to private island wellness retreats, discover the archipelago's unique perspective."
        keywords={['Maldives adventures', 'luxury excursions Maldives', 'whale shark safari', 'Maldives surfing', 'bespoke travel Maldives']}
        image="https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&q=80&w=1200"
      />

      {/* Cinematic Header */}
      <section className="relative h-[50vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80&w=1920" 
            className="w-full h-full object-cover" 
            alt="Maldives Adventures"
          />
          <div className="absolute inset-0 bg-slate-950/40" />
        </div>
        <div className="relative z-10 text-center px-6 reveal active">
          <span className="text-[10px] font-bold text-sky-400 mb-8 block tracking-[1em] uppercase">The Perspective</span>
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif font-bold text-white tracking-tighter italic leading-none">Curated Living</h1>
          <div className="h-px w-20 bg-amber-400 mx-auto mt-10 mb-10"></div>
          <p className="text-white text-[10px] font-bold max-w-xl mx-auto uppercase tracking-[0.5em] leading-loose opacity-80">
            A registry of movement, silence, and discovery.
          </p>
        </div>
      </section>

      {/* Category Navigation */}
      <nav className="sticky top-20 md:top-24 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 overflow-x-auto no-scrollbar transition-all duration-700">
         <div className="max-w-7xl mx-auto px-6 py-6 md:py-8 flex justify-start md:justify-center items-center gap-8 md:gap-16">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] transition-all whitespace-nowrap pb-2 border-b-2 ${activeCategory === cat ? 'border-sky-500 text-slate-950 dark:text-white' : 'border-transparent text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                {cat}
              </button>
            ))}
         </div>
      </nav>

      <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24 md:py-32">
        {loading ? (
          <div className="py-40 text-center flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-slate-100 dark:border-white/5 border-t-sky-500 rounded-full animate-spin mb-8"></div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em]">Consulting the Archive...</p>
          </div>
        ) : filteredExperiences.length > 0 ? (
          <div className="space-y-32 md:space-y-48">
            
            {/* 1. SPOTLIGHT EXPERIENCE */}
            {spotlightExperience && (
              <section className="reveal">
                 <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-center">
                    <div className="lg:w-3/5 relative aspect-[16/9] w-full rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-2xl group bg-slate-100 dark:bg-slate-900 transition-all">
                       <img src={spotlightExperience.image} className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105" alt={spotlightExperience.title} />
                       <div className="absolute inset-0 bg-slate-950/15"></div>
                       <div className="absolute top-10 left-10">
                          <span className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-6 py-2 rounded-full text-[9px] font-black text-slate-950 dark:text-white uppercase tracking-[0.4em] shadow-lg transition-colors border dark:border-white/5">
                            Spotlight Journey
                          </span>
                       </div>
                    </div>
                    <div className="lg:w-2/5">
                       <span className="text-sky-500 font-bold uppercase tracking-[1em] text-[10px] mb-8 block">{spotlightExperience.category}</span>
                       <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-slate-950 dark:text-white mb-10 leading-[1.1] italic tracking-tight transition-colors">
                         {spotlightExperience.title}
                       </h2>
                       <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl leading-[2] mb-12 font-medium opacity-85 italic transition-colors">
                         {spotlightExperience.description}
                       </p>
                       
                       <div className="flex flex-wrap items-center gap-8">
                          <Link to="/plan" className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold px-10 py-5 rounded-full text-[10px] uppercase tracking-[0.4em] hover:bg-sky-500 dark:hover:bg-sky-400 transition-all shadow-xl">
                            Request Journey
                          </Link>
                          {spotlightExperience.resortSlug && (
                            <Link to={`/stays/${spotlightExperience.resortSlug}`} className="text-[10px] font-black text-slate-400 dark:text-slate-600 hover:text-slate-950 dark:hover:text-white uppercase tracking-[0.4em] transition-colors flex items-center gap-3">
                               <span>Host: {spotlightExperience.resortName}</span>
                               <span className="text-lg">→</span>
                            </Link>
                          )}
                       </div>
                    </div>
                 </div>
              </section>
            )}

            {/* 2. THE GRID */}
            {gridExperiences.length > 0 && (
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-20">
                {gridExperiences.map((exp, idx) => (
                  <div key={exp.id} className="reveal group" style={{ transitionDelay: `${idx * 100}ms` }}>
                    <div className="relative aspect-[1/1] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden mb-10 shadow-sm transition-all duration-1000 group-hover:shadow-2xl bg-slate-100 dark:bg-slate-900">
                      <img src={exp.image} alt={exp.title} className="w-full h-full object-cover transition-transform duration-[6s] group-hover:scale-110" />
                      <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-transparent transition-colors"></div>
                      
                      {/* Overlaid Resort Badge */}
                      {exp.resortName && (
                        <div className="absolute top-6 left-6">
                           <Link to={`/stays/${exp.resortSlug}`} className="bg-white/95 dark:bg-slate-900/95 backdrop-blur px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-900 dark:text-white shadow-sm border border-white/20 dark:border-white/5 hover:bg-sky-500 dark:hover:bg-sky-400 hover:text-white transition-all">
                              {exp.resortName}
                           </Link>
                        </div>
                      )}

                      <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                         <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-slate-950 dark:text-white shadow-2xl transition-colors">
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                         </div>
                      </div>
                    </div>
                    
                    <div className="px-4">
                       <div className="flex justify-between items-center mb-4">
                          <span className="text-[8px] font-black text-sky-500 uppercase tracking-widest block mb-4">{exp.category}</span>
                       </div>
                       <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-950 dark:text-white mb-6 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors tracking-tight italic leading-tight transition-colors">
                         {exp.title}
                       </h3>
                       <p className="text-slate-500 dark:text-slate-400 text-[12px] leading-[1.8] mb-10 opacity-80 line-clamp-3 transition-colors">
                         {exp.description}
                       </p>
                       <div className="h-px w-10 bg-slate-200 dark:bg-white/10 group-hover:w-full group-hover:bg-sky-500 transition-all duration-1000"></div>
                       <div className="mt-6 flex justify-between items-center">
                          <Link to="/plan" className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-transparent hover:border-slate-900 dark:hover:border-white pb-1 transition-all">
                            Book Experience
                          </Link>
                          {exp.resortSlug && (
                            <Link to={`/stays/${exp.resortSlug}`} className="text-[8px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest hover:text-slate-950 dark:hover:text-white transition-colors">
                              View Sanctuary
                            </Link>
                          )}
                       </div>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>
        ) : (
          <div className="py-40 text-center reveal active">
             <h3 className="text-3xl font-serif font-bold italic text-slate-900 dark:text-white mb-6 transition-colors">No archives found.</h3>
             <button onClick={() => setActiveCategory('All')} className="text-sky-500 dark:text-sky-400 font-black uppercase tracking-[0.4em] text-[10px] border-b border-sky-100 dark:border-sky-900 pb-2">Reset Filter</button>
          </div>
        )}
      </main>

      {/* Logistics & Arrivals Section */}
      <section className="py-32 md:py-64 bg-white dark:bg-slate-950 transition-colors duration-700 reveal">
         <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
            <div className="lg:col-span-5">
               <span className="text-[10px] font-bold text-sky-500 uppercase tracking-[1em] mb-12 block">Private Transit</span>
               <h3 className="text-5xl md:text-7xl font-serif font-bold text-slate-950 dark:text-white italic mb-12 leading-tight transition-colors">Elevated Arrivals.</h3>
               <p className="text-slate-500 dark:text-slate-400 text-lg leading-[2] mb-16 opacity-90 transition-colors">
                  From chartered seaplanes to luxury yacht transfers and private jet handling at Velana International. We manage the mechanics of your arrival so you can remain in the moment.
               </p>
               <ul className="space-y-6 text-[11px] font-bold uppercase tracking-[0.4em] text-slate-950 dark:text-white transition-colors">
                  <li className="flex items-center gap-4"><span className="w-4 h-px bg-amber-400"></span> Private Jet Handling</li>
                  <li className="flex items-center gap-4"><span className="w-4 h-px bg-amber-400"></span> Luxury Yacht Charter</li>
                  <li className="flex items-center gap-4"><span className="w-4 h-px bg-amber-400"></span> VIP Terminal Access</li>
               </ul>
            </div>
            <div className="lg:col-span-7 aspect-[16/10] rounded-[4rem] overflow-hidden shadow-2xl bg-slate-100 dark:bg-slate-900 dark:shadow-slate-900/50 transition-colors">
               <img src="https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80&w=1200" alt="Private Seaplane" className="w-full h-full object-cover" />
            </div>
         </div>
      </section>

      {/* CTA Footer */}
      <section className="py-48 bg-slate-950 text-white relative overflow-hidden text-center">
         <div className="absolute inset-0 opacity-[0.05] flex items-center justify-center pointer-events-none">
            <h2 className="text-[40vw] font-serif italic whitespace-nowrap">Vision</h2>
         </div>
         <div className="max-w-4xl mx-auto px-6 relative z-10 reveal">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-[1em] mb-12 block">Bespoke Curation</span>
            <h3 className="text-6xl md:text-9xl font-serif font-bold mb-16 italic tracking-tighter">Your Journey <br /> Starts Here.</h3>
            <Link to="/plan" className="inline-block bg-white text-slate-950 font-black px-16 py-7 rounded-full hover:bg-sky-500 dark:hover:bg-sky-400 transition-all duration-700 uppercase tracking-[0.5em] text-[10px] shadow-2xl">
               Consult An Expert
            </Link>
         </div>
      </section>
    </div>
  );
};

export default Experiences;
