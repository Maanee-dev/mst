
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, MessageSquare, Send, RotateCcw } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
  isAction?: boolean;
  action?: { label: string; path: string; isExternal?: boolean };
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Welcome to Serenity Maldives. I am Sara, your digital concierge. How may I assist your discovery today?" }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const WHATSAPP_NUMBER = "+9607259060";
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=Hello Serenity Maldives, I have an inquiry regarding...`;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userText = input.trim();
    const encodedText = encodeURIComponent(`Hello Serenity Maldives, ${userText}`);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodedText}`;
    
    // Add user message to UI for feedback before redirect
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');

    // Redirect to WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close Sara Concierge" : "Open Sara Concierge"}
        className="fixed bottom-8 right-8 z-[110] bg-slate-900 text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group flex items-center justify-center border border-white/10"
      >
        <div className="relative">
            <div className="flex items-center gap-3">
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold text-[10px] uppercase tracking-widest whitespace-nowrap">
                    Ask Sara
                </span>
                {isOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <MessageSquare className="w-6 h-6" strokeWidth={1.5} />}
            </div>
        </div>
      </button>

      <div className={`fixed bottom-24 right-4 md:bottom-28 md:right-8 z-[100] w-[calc(100%-2rem)] max-w-[380px] md:w-[400px] h-[500px] md:h-[600px] bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col transition-all duration-700 transform ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'}`}>
        <div className="bg-slate-950 p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-serif italic font-bold text-lg">S</div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif italic text-base leading-none">Sara</h3>
              </div>
              <p className="text-[8px] uppercase tracking-widest text-sky-400 font-bold mt-1">Digital Concierge</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMessages([{ role: 'model', text: "How may I assist your discovery today?" }])} 
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
              title="Reset Chat"
            >
              <RotateCcw size={16} />
            </button>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 text-white hover:bg-white/10 rounded-full transition-all flex items-center gap-2"
              aria-label="Close Chat"
            >
              <span className="text-[10px] font-black uppercase tracking-widest md:hidden">Close</span>
              <X size={20} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 p-6 space-y-4 overflow-y-auto no-scrollbar bg-[#FCFAF7]/50">
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl mb-4 flex items-center justify-between">
            <div>
              <h4 className="text-[9px] font-black text-emerald-900 uppercase tracking-widest mb-1">Direct Assistance</h4>
              <p className="text-[8px] text-emerald-700 uppercase tracking-widest font-medium">Chat with us on WhatsApp</p>
            </div>
            <a 
              href={WHATSAPP_LINK} 
              target="_blank" 
              rel="noreferrer"
              className="bg-emerald-500 text-white p-2 rounded-full shadow-lg hover:bg-emerald-600 transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-[11px] leading-relaxed ${m.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none font-medium shadow-sm'}`}>
                {m.text}
              </div>
              {m.role === 'model' && m.isAction && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {m.action && (
                    m.action.isExternal ? (
                      <a 
                        href={m.action.path} 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all flex items-center gap-2"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                      </a>
                    ) : (
                      <Link 
                        to={m.action.path}
                        className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-900 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all"
                      >
                        {m.action.label}
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-slate-100 bg-white shrink-0">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="How may I assist you?"
              className="w-full bg-slate-50 border border-slate-100 rounded-full px-6 py-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-sky-500 focus:bg-white transition-all placeholder:text-slate-300"
            />
            <button
              onClick={handleSend}
              aria-label="Send message"
              className="absolute right-2 p-3 bg-slate-900 text-white rounded-full hover:bg-sky-500 transition-all flex items-center justify-center"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-[6px] text-center text-slate-300 uppercase tracking-widest mt-4">Direct WhatsApp Assistance</p>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
