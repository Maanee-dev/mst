import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const paymentImgClass = "h-4 md:h-5 w-auto object-contain grayscale brightness-0 opacity-30 group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100 dark:invert dark:opacity-10 dark:group-hover:invert-0 dark:group-hover:opacity-100 transition-all duration-700 ease-in-out select-none pointer-events-none";

  return (
    <footer className="bg-white dark:bg-slate-950 pt-32 pb-16 border-t border-slate-100 dark:border-white/5 transition-colors duration-700">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Top Section: Branding & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32">
          <div className="lg:col-span-4">
            <Link to="/" className="text-3xl font-serif font-medium text-slate-900 dark:text-white tracking-[0.2em] uppercase block mb-8">
              SERENITY
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] leading-[2.5] uppercase tracking-[0.3em] font-medium max-w-sm">
              A bespoke boutique agency born from the southern frontier of the archipelago. We curate silence and luxury for the discerning traveler.
            </p>
          </div>
          
          <div className="lg:col-span-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-12 bg-slate-50 dark:bg-slate-900/50 p-10 md:p-16 rounded-[3rem] border border-slate-100 dark:border-white/5 transition-colors">
            <div className="max-w-md">
              <h4 className="text-2xl font-serif font-medium text-slate-950 dark:text-white mb-4">The Digital Dispatch</h4>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest font-bold">Receive seasonal privileges and editorial updates directly.</p>
            </div>
            <form className="w-full md:w-auto flex-1 max-w-sm flex items-center relative group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="YOUR EMAIL" 
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-full px-8 py-5 text-[10px] font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all dark:text-white placeholder:text-slate-200"
              />
              <button className="absolute right-2 bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-6 py-3.5 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-sky-500 dark:hover:bg-sky-400 transition-colors">Join</button>
            </form>
          </div>
        </div>

        {/* Middle Section: Detailed Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 md:gap-20 mb-32 border-b border-slate-50 dark:border-white/5 pb-24 transition-colors">
          
          {/* Column 1: Company */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-900 dark:text-white">Agency</h4>
            <ul className="space-y-4 text-slate-500 dark:text-slate-500 text-[10px] uppercase font-bold tracking-widest">
              <li><Link to="/about" className="hover:text-sky-500 transition-colors">Our Heritage</Link></li>
              <li><Link to="/stories" className="hover:text-sky-500 transition-colors">The Journal</Link></li>
              <li><Link to="/contact" className="hover:text-sky-500 transition-colors">Connect</Link></li>
              <li><Link to="/careers" className="hover:text-sky-500 transition-colors opacity-40 cursor-not-allowed">Careers</Link></li>
            </ul>
          </div>

          {/* Column 2: Portfolio */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-900 dark:text-white">Portfolio</h4>
            <ul className="space-y-4 text-slate-500 dark:text-slate-500 text-[10px] uppercase font-bold tracking-widest">
              <li><Link to="/stays" className="hover:text-sky-500 transition-colors">Luxury Resorts</Link></li>
              <li><Link to="/stays?type=GUEST_HOUSE" className="hover:text-sky-500 transition-colors">Guest Houses</Link></li>
              <li><Link to="/stays?type=LIVEABOARD" className="hover:text-sky-500 transition-colors">Liveaboards</Link></li>
              <li><Link to="/offers" className="hover:text-sky-500 transition-colors">Exclusives</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-900 dark:text-white">Governance</h4>
            <ul className="space-y-4 text-slate-500 dark:text-slate-500 text-[10px] uppercase font-bold tracking-widest">
              <li><Link to="/terms" className="hover:text-sky-500 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-sky-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/faq" className="hover:text-sky-500 transition-colors">Travel FAQ</Link></li>
              <li><Link to="/safety" className="hover:text-sky-500 transition-colors opacity-40 cursor-not-allowed">Safety Protocols</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-900 dark:text-white">Social</h4>
            <ul className="space-y-4 text-slate-500 dark:text-slate-500 text-[10px] uppercase font-bold tracking-widest">
              <li><a href="#" className="hover:text-sky-500 transition-colors">Instagram Feed</a></li>
              <li><a href="#" className="hover:text-sky-500 transition-colors">WhatsApp Direct</a></li>
              <li><a href="#" className="hover:text-sky-500 transition-colors">Twitter (X)</a></li>
              <li><a href="#" className="hover:text-sky-500 transition-colors">LinkedIn</a></li>
            </ul>
          </div>

          {/* Column 5: Office Location */}
          <div className="space-y-8 col-span-2 md:col-span-1">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-900 dark:text-white">Our Office</h4>
            <div className="text-slate-400 dark:text-slate-600 text-[10px] leading-relaxed uppercase tracking-widest space-y-4 font-medium">
              <p>
                Faith, S.feydhoo<br />
                Addu City, 19040<br />
                Republic of Maldives
              </p>
              <div className="pt-4 border-t border-slate-50 dark:border-white/5 space-y-1">
                <p className="text-slate-500 dark:text-slate-400 font-bold">Mon — Fri</p>
                <p>09:00 — 18:00 (GMT+5)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Compliance & Payments */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
          
          <div className="order-3 lg:order-1 text-center lg:text-left">
            <p className="text-slate-300 dark:text-slate-700 text-[9px] font-bold uppercase tracking-[0.5em] mb-4">
              © 2026 Maldives Serenity Travels. Reg No: SP02722025.
            </p>
            <p className="text-slate-200 dark:text-slate-800 text-[8px] font-bold uppercase tracking-[0.4em]">
              Licensed by Ministry of Tourism: MOT.01.RS.TA.25.PJ0482
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 order-1 lg:order-2 group transition-colors">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Visa_Inc._logo_%282005%E2%80%932014%29.svg/1920px-Visa_Inc._logo_%282005%E2%80%932014%29.svg.png?20170118154621" alt="Visa" className={paymentImgClass} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className={paymentImgClass} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="Amex" className={paymentImgClass} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className={paymentImgClass} />
          </div>

          <div className="order-2 lg:order-3">
             <span className="text-sky-500/30 dark:text-sky-400/10 text-[40px] font-serif select-none">Perspective.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;