import React, { useEffect, useState } from 'react';
import SEO from '../components/SEO';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-parchment dark:bg-slate-950 min-h-screen selection:bg-sky-100 selection:text-sky-900 overflow-x-hidden transition-colors duration-700">
      <SEO 
        title="Contact | Initiate the Dialogue" 
        description="Connect with our Maldivian travel specialists. Reach us via WhatsApp or our inquiry form for bespoke holiday planning in the archipelago."
      />

      {/* Cinematic Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1506953823976-52e1bdc0149a?auto=format&fit=crop&q=80&w=1920" 
            className="w-full h-full object-cover" 
            alt="Maldives Water"
          />
          <div className="absolute inset-0 bg-slate-950/40" />
        </div>
        <div className="relative z-10 text-center px-6 reveal active">
          <span className="text-[10px] font-black text-sky-400 uppercase tracking-[1.2em] mb-12 block">Dialogue</span>
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif font-bold text-white tracking-tighter leading-none">
            Initiate <br /> Contact.
          </h1>
          <div className="h-px w-24 bg-amber-400 mx-auto mt-12 mb-12"></div>
          <p className="text-white text-[11px] font-bold uppercase tracking-[0.5em] max-w-xl mx-auto opacity-90">
             Our specialists are available for bespoke <br className="hidden md:block"/> consultations and itinerary refinement.
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-32 md:py-48 grid grid-cols-1 lg:grid-cols-12 gap-24">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-24 reveal">
          <div className="space-y-12">
            <div>
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest block mb-4 transition-colors">Immediate Assistance</span>
              <div className="space-y-6">
                <a href="https://wa.me/9607259060" target="_blank" rel="noreferrer" className="flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:bg-slate-950 dark:group-hover:bg-white transition-all duration-500">
                    <svg className="w-5 h-5 group-hover:text-white dark:group-hover:text-slate-950 transition-colors fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-2.652 0-5.147 1.03-7.02 2.905-1.873 1.874-2.901 4.37-2.903 7.027-.001 2.03.543 4.154 1.61 5.9l-.311 1.137-.79 2.884 2.953-.776 1.061-.28z"/></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-900 dark:text-white transition-colors">+960 725 9060</span>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest transition-colors">General Inquiries</span>
                  </div>
                </a>
                <a href="https://wa.me/9607775678" target="_blank" rel="noreferrer" className="flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:bg-slate-950 dark:group-hover:bg-white transition-all duration-500">
                    <svg className="w-5 h-5 group-hover:text-white dark:group-hover:text-slate-950 transition-colors fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-2.652 0-5.147 1.03-7.02 2.905-1.873 1.874-2.901 4.37-2.903 7.027-.001 2.03.543 4.154 1.61 5.9l-.311 1.137-.79 2.884 2.953-.776 1.061-.28z"/></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-900 dark:text-white transition-colors">+960 777 5678</span>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest transition-colors">Bespoke Concierge</span>
                  </div>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest block mb-4 transition-colors">Digital Inquiry</span>
                <p className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em] transition-colors">info@maldives-serenitytravels.com</p>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest block mb-4 transition-colors">Global Office</span>
                <p className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em] leading-loose transition-colors">
                  Faith, S.feydhoo<br />
                  Addu City, Maldives
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="lg:col-span-7 reveal delay-300">
          {submitted ? (
            <div className="bg-white dark:bg-slate-900 rounded-[4rem] p-20 text-center shadow-2xl border border-slate-50 dark:border-white/5 transition-colors duration-700">
              <h2 className="text-4xl font-serif font-bold mb-6 text-slate-900 dark:text-white">Inquiry Received.</h2>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] leading-loose mb-12 transition-colors">Our specialists will review your vision and contact you within 24 hours.</p>
              <button onClick={() => setSubmitted(false)} className="text-[10px] font-black text-sky-500 uppercase tracking-[0.6em] border-b border-sky-100 dark:border-sky-900 pb-2">Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[4rem] p-12 md:p-20 shadow-2xl border border-slate-50 dark:border-white/5 space-y-12 transition-colors duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-4 transition-colors">Full Identity</label>
                  <input type="text" required className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-full px-8 py-5 text-[11px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-sky-500 transition-all placeholder:text-slate-200 dark:placeholder:text-slate-700 dark:text-white" placeholder="NAME" />
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-4 transition-colors">Email Channel</label>
                  <input type="email" required className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-full px-8 py-5 text-[11px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-sky-500 transition-all placeholder:text-slate-200 dark:placeholder:text-slate-700 dark:text-white" placeholder="EMAIL" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-4 transition-colors">Your Vision</label>
                <textarea rows={6} className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-[2.5rem] px-8 py-6 text-[11px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-sky-500 transition-all placeholder:text-slate-200 dark:placeholder:text-slate-700 dark:text-white resize-none" placeholder="TELL US ABOUT YOUR ATOL JOURNEY..."></textarea>
              </div>
              <button type="submit" className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black py-7 rounded-full text-[11px] uppercase tracking-[0.8em] hover:bg-sky-500 dark:hover:bg-sky-400 transition-all duration-700 shadow-2xl">
                Dispatch Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;