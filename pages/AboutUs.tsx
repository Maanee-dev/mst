
import React, { useEffect } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const AboutUs: React.FC = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-parchment dark:bg-slate-950 min-h-screen selection:bg-sky-100 selection:text-sky-900 overflow-x-hidden transition-colors duration-700">
      <SEO 
        title="About Us | The Curators of Maldivian Luxury" 
        description="Serenity Maldives is a boutique travel agency defined by perspective. Discover our heritage in Addu City and our mission to curate the silence and luxury of the archipelago."
      />

      {/* Cinematic Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=1920" 
            className="w-full h-full object-cover" 
            alt="Maldives Island Life"
          />
          <div className="absolute inset-0 bg-slate-950/40" />
        </div>
        <div className="relative z-10 text-center px-6 reveal active">
          <span className="text-[10px] font-black text-sky-500 uppercase tracking-[1.2em] mb-12 block">Our Origin</span>
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif font-bold text-white tracking-tighter italic leading-none">
            Defined by <br /> Perspective.
          </h1>
          <div className="h-px w-24 bg-amber-400 mx-auto mt-12 mb-12"></div>
          <p className="text-white text-[11px] font-bold uppercase tracking-[0.5em] leading-[2.8] max-w-xl mx-auto opacity-90">
            A boutique agency born from the southern frontier of the archipelago, <br className="hidden md:block"/> dedicated to the art of the bespoke journey.
          </p>
        </div>
      </section>

      {/* Split Narrative */}
      <section className="py-24 md:py-48 bg-white dark:bg-slate-950 border-y border-slate-50 dark:border-white/5 transition-colors">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="reveal">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl group bg-slate-100 dark:bg-slate-900 transition-colors">
              <img 
                src="https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110" 
                alt="Maldives Seascape"
              />
            </div>
          </div>
          <div className="reveal delay-300">
            <span className="text-sky-500 font-black uppercase tracking-[1em] text-[10px] mb-12 block">The Philosophy</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-950 dark:text-white italic mb-12 tracking-tight transition-colors">Curating the Silence.</h2>
            <div className="space-y-8 text-slate-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed font-medium italic opacity-90 transition-colors">
              <p>
                In a world that never stops talking, we found luxury in the spaces between the words. At Serenity Maldives, we believe that the true essence of travel is not found in the destination, but in the perspective you gain while there.
              </p>
              <p>
                Headquartered in Addu City, we operate at the southern frontier of the archipelago. This distance gives us a unique lens through which we view Maldivian hospitality—one that prioritizes privacy, heritage, and the profound beauty of the untouched.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-24 md:py-48 px-6 lg:px-12 bg-parchment dark:bg-slate-950 transition-colors duration-700">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            { title: 'Bespoke Integrity', desc: 'We do not believe in automated bookings. Every itinerary is a hand-crafted narrative, reviewed by experts who know the atolls by heart.' },
            { title: 'Local Heritage', desc: 'Based in Addu City, we honor the Maldivian spirit. We bridge the gap between world-class luxury and authentic local soul.' },
            { title: 'Silent Luxury', desc: 'Luxury is not loud. It is the perfect seaplane connection, the specific vintage on your deck, and the absence of any worry.' }
          ].map((val, i) => (
            <div key={i} className="reveal" style={{ transitionDelay: `${i * 150}ms` }}>
              <span className="text-amber-500 font-serif italic text-4xl mb-8 block transition-colors">0{i+1}.</span>
              <h3 className="text-2xl font-serif font-bold text-slate-950 dark:text-white mb-6 transition-colors">{val.title}</h3>
              <p className="text-slate-500 dark:text-slate-500 text-[11px] font-bold uppercase tracking-[0.3em] leading-loose transition-colors">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Location Section */}
      <section className="py-24 md:py-48 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] flex items-center justify-center pointer-events-none">
          <h2 className="text-[30vw] font-serif italic -rotate-12 translate-y-1/2">Addu</h2>
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 reveal">
          <span className="text-sky-400 font-black uppercase tracking-[1em] text-[10px] mb-12 block">Our Anchor</span>
          <h3 className="text-4xl md:text-7xl font-serif font-bold italic mb-12 tracking-tighter">Faith, Feydhoo.</h3>
          <p className="text-slate-400 text-sm md:text-lg font-medium leading-loose mb-16 opacity-80 uppercase tracking-[0.4em]">
            Located in the southern-most atoll, our headquarters <br className="hidden md:block"/> at S.feydhoo serve as our gateway to the infinite blue.
          </p>
          <div className="h-px w-24 bg-white/20 mx-auto"></div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-48 text-center bg-white dark:bg-slate-950 transition-colors duration-700">
        <div className="max-w-4xl mx-auto px-6 reveal">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-950 dark:text-white italic mb-12 tracking-tight transition-colors">Begin Your Narrative.</h2>
          <Link to="/plan" className="inline-block bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black px-16 py-7 rounded-full hover:bg-sky-500 dark:hover:bg-sky-400 transition-all duration-700 shadow-2xl uppercase tracking-[0.8em] text-[10px]">
            Initiate Planning
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
