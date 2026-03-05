import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useBag } from '../context/BagContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import CalendarSelector from './CalendarSelector';
import GuestSelector from './GuestSelector';

interface BagProps {
  isOpen: boolean;
  onClose: () => void;
}

const Bag: React.FC<BagProps> = ({ isOpen, onClose }) => {
  const { 
    items, 
    removeItem, 
    clearBag, 
    totalItems, 
    startDate, 
    endDate, 
    adults, 
    childrenCount, 
    setStartDate, 
    setEndDate, 
    setAdults, 
    setChildrenCount
  } = useBag();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const handleStartExploring = () => {
    onClose();
    navigate('/discovery');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('inquiries').insert({
        inquiry_type: 'bulk_bag',
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        notes: formData.notes,
        metadata: {
          items: items.map(i => ({ id: i.id, type: i.type, name: i.name })),
          startDate,
          endDate,
          adults,
          childrenCount
        }
      });

      if (error) throw error;
      
      setIsSubmitted(true);
      setTimeout(() => {
        clearBag();
        onClose();
        navigate('/thank-you', { 
          state: { 
            itemName: 'Your Curated Selection',
            type: 'bulk'
          } 
        });
      }, 2000);
    } catch (err) {
      console.error('Inquiry failed:', err);
      alert('We encountered an error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[400]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-claude-bg dark:bg-claude-bg-dark z-[401] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-claude-border dark:border-claude-border-dark flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-claude-accent" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-claude-text dark:text-claude-text-dark">Your Selection ({totalItems})</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-claude-bg dark:hover:bg-claude-bg-dark rounded-full transition-colors">
                <X size={20} className="text-claude-secondary" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-claude-bg dark:bg-claude-bg-dark rounded-full flex items-center justify-center text-claude-secondary/20">
                    <ShoppingBag size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-claude-secondary mb-2">Your bag is empty.</h3>
                    <p className="text-[9px] font-bold text-claude-secondary uppercase tracking-widest leading-loose">
                      Explore our stays and experiences to curate your perfect Maldivian escape.
                    </p>
                  </div>
                  <button 
                    onClick={handleStartExploring}
                    className="text-[10px] font-black text-claude-accent uppercase tracking-widest border-b border-claude-accent pb-1"
                  >
                    Start Exploring
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Item List */}
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-4 group">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-claude-bg dark:bg-claude-bg-dark">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="pr-2">
                              <span className="text-[8px] font-black text-claude-accent uppercase tracking-widest block mb-1">{item.type}</span>
                              <h4 className="text-sm font-serif font-bold text-claude-text dark:text-claude-text-dark leading-tight break-words">{item.name}</h4>
                            </div>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="p-1 text-claude-secondary/30 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          {item.price && (
                            <p className="text-[9px] font-bold text-claude-secondary uppercase tracking-widest mt-2">
                              {typeof item.price === 'number' ? `From US$ ${item.price.toLocaleString()}` : item.price}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Inquiry Form */}
                  {!isSubmitted ? (
                    <div className="pt-8 border-t border-claude-border dark:border-claude-border-dark">
                      <h3 className="text-[10px] font-black text-claude-text dark:text-claude-text-dark uppercase tracking-[0.4em] mb-6">Request Bulk Quote</h3>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                          <CalendarSelector 
                            range={{ from: startDate, to: endDate }}
                            onChange={(range) => {
                              setStartDate(range?.from);
                              setEndDate(range?.to);
                            }}
                          />
                          <GuestSelector 
                            adults={adults}
                            children={childrenCount}
                            onChange={(a, c) => {
                              setAdults(a);
                              setChildrenCount(c);
                            }}
                          />
                        </div>
                        <input 
                          required
                          type="text" 
                          placeholder="FULL NAME" 
                          className="w-full bg-claude-bg dark:bg-claude-bg-dark border-none rounded-2xl px-6 py-4 text-[10px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-claude-accent transition-all"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                        <input 
                          required
                          type="email" 
                          placeholder="EMAIL ADDRESS" 
                          className="w-full bg-claude-bg dark:bg-claude-bg-dark border-none rounded-2xl px-6 py-4 text-[10px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-claude-accent transition-all"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                        <input 
                          type="tel" 
                          placeholder="PHONE NUMBER" 
                          className="w-full bg-claude-bg dark:bg-claude-bg-dark border-none rounded-2xl px-6 py-4 text-[10px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-claude-accent transition-all"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                        <textarea 
                          placeholder="SPECIAL REQUESTS OR NOTES..." 
                          rows={3}
                          className="w-full bg-claude-bg dark:bg-claude-bg-dark border-none rounded-2xl px-6 py-4 text-[10px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-claude-accent transition-all resize-none"
                          value={formData.notes}
                          onChange={e => setFormData({...formData, notes: e.target.value})}
                        />
                        <button 
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-claude-text dark:bg-claude-text-dark text-white dark:text-claude-text py-5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-claude-accent hover:text-white transition-all shadow-xl flex items-center justify-center gap-3"
                        >
                          {isSubmitting ? 'Dispatching...' : (
                            <>
                              Request Quote <ArrowRight size={14} />
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="pt-8 border-t border-claude-border dark:border-claude-border-dark text-center">
                      <div className="w-16 h-16 bg-claude-accent/10 text-claude-accent rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={32} />
                      </div>
                      <h4 className="text-xl font-serif font-bold text-claude-text dark:text-claude-text-dark mb-2">Inquiry Dispatched.</h4>
                      <p className="text-[9px] font-bold text-claude-secondary uppercase tracking-widest leading-loose">
                        Our travel curators will contact you shortly with a bespoke proposal.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Bag;
