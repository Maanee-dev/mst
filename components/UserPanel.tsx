import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingBag, User, Trash2, LogOut, Chrome, ShieldCheck, Zap, Star } from 'lucide-react';
import { useBag } from '../context/BagContext';
import { supabase } from '../lib/supabase';

const UserPanel: React.FC = () => {
  const { likedResorts, toggleLike, items, removeItem, isUserPanelOpen, setIsUserPanelOpen, isMember, setIsMember } = useBag();
  const [user, setUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'profile'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const onClose = () => {
    setIsUserPanelOpen(false);
    setSuccessMessage(null);
    setError(null);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        setAuthMode('profile');
        setIsMember(!user.is_anonymous);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        setAuthMode('profile');
        setIsMember(!currentUser.is_anonymous);
      } else {
        setAuthMode('login');
        setIsMember(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [setIsMember]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const processedEmail = email.trim().toLowerCase();
    console.log('Attempting login for:', processedEmail);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: processedEmail, 
        password 
      });
      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      console.log('Login successful:', data.user?.email);
      onClose();
    } catch (err: any) {
      if (err.message === 'Invalid login credentials') {
        setError('Invalid email or password. If you haven\'t created an account, please use the "Sign Up" tab. If you have, ensure your email is confirmed.');
      } else if (err.message === 'Email not confirmed') {
        setError('Please confirm your email address. Check your inbox for the confirmation link.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email address first.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      alert('Password reset link sent to your email!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    setError(null);
    const processedEmail = email.trim().toLowerCase();
    try {
      const { data, error } = await supabase.auth.signUp({
        email: processedEmail,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) throw error;
      
      if (data.session) {
        // Email confirmation is disabled, user is logged in
        onClose();
      } else {
        setSuccessMessage('Account created! Please check your email for a confirmation link before signing in.');
        setAuthMode('login');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthMode('login');
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isUserPanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[700]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-full md:max-w-md bg-white dark:bg-slate-950 z-[701] shadow-2xl flex flex-col"
          >
            {/* Close Button - Minimalistic Floating */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar pt-20">
              {authMode !== 'profile' ? (
                <div className="h-full flex flex-col">
                  <div className="mb-10">
                    <h3 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-3">
                      {authMode === 'login' ? 'Welcome Back' : 'Join Serenity'}
                    </h3>
                    <p className="text-sm text-slate-400 font-light leading-relaxed">
                      {authMode === 'login' 
                        ? 'Sign in to access your curated Maldivian collection and member privileges.' 
                        : 'Create an account to unlock exclusive benefits and long-term rewards.'}
                    </p>
                  </div>

                  <form onSubmit={authMode === 'login' ? handleLogin : handleSignUp} className="space-y-4">
                    {authMode === 'signup' && (
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Full Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl py-4 px-6 text-sm focus:ring-1 focus:ring-sky-500/30 transition-all placeholder:text-slate-300"
                        />
                      </div>
                    )}
                    <div className="relative">
                      <input 
                        type="email" 
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl py-4 px-6 text-sm focus:ring-1 focus:ring-sky-500/30 transition-all placeholder:text-slate-300"
                      />
                    </div>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl py-4 px-6 text-sm focus:ring-1 focus:ring-sky-500/30 transition-all placeholder:text-slate-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-500 transition-colors"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>

                    {successMessage && (
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100/50 dark:border-emerald-900/20">
                        <p className="text-[10px] font-bold text-emerald-600 text-center uppercase tracking-widest">
                          {successMessage}
                        </p>
                      </div>
                    )}

                    {error && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100/50 dark:border-red-900/20">
                        <p className="text-[10px] font-bold text-red-500 text-center uppercase tracking-widest">
                          {error}
                        </p>
                      </div>
                    )}

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-[11px]"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          {authMode === 'login' ? 'Sign In' : 'Create Account'}
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">Or continue with</span>
                      <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                      >
                        <Chrome size={16} />
                        Google
                      </button>
                      <button 
                        onClick={handleGuestLogin}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                      >
                        <User size={16} />
                        Guest
                      </button>
                    </div>

                    <div className="pt-6 flex flex-col gap-3 text-center">
                      {authMode === 'login' && (
                        <button 
                          onClick={handleForgotPassword}
                          className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          Forgot Password?
                        </button>
                      )}
                      <button 
                        onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                        className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                  {/* Minimal Profile Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-sky-500 flex items-center justify-center text-white text-xl font-bold shadow-xl shadow-sky-500/20">
                        {user.user_metadata?.full_name?.[0] || user.email?.[0].toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
                          {user.user_metadata?.full_name || 'Explorer'}
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {user.is_anonymous ? 'Guest Session' : 'Member'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>

                  {/* Member Benefits System */}
                  <section className={`rounded-[2rem] p-6 border transition-all ${isMember ? 'bg-sky-50 dark:bg-sky-900/50 border-sky-100 dark:border-sky-500/30' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-white/5 opacity-80'}`}>
                    <div className="flex items-center gap-3 mb-6">
                      <ShieldCheck size={18} className={isMember ? 'text-sky-500' : 'text-slate-400'} />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">
                        {isMember ? 'Member Privileges' : 'Unlock Privileges'}
                      </h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isMember ? 'bg-sky-500/10 text-sky-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                          <Zap size={14} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">Instant 15% Discount</h4>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            {isMember ? 'Applied automatically to all member bookings.' : 'Register to receive an instant discount on your first booking.'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isMember ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                          <Star size={14} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">Long-term Rewards</h4>
                          <p className="text-[10px] text-slate-400 leading-relaxed">Earn points for every stay to unlock complimentary seaplane transfers.</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Liked Destinations */}
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Heart size={16} className="text-red-500" fill="currentColor" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">Liked</h3>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{likedResorts.length}</span>
                    </div>

                    {likedResorts.length === 0 ? (
                      <div className="py-10 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-3xl">
                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Empty Collection</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {likedResorts.map((resort) => (
                          <div key={resort.id} className="group relative aspect-square rounded-2xl overflow-hidden">
                            <img 
                              src={resort.image} 
                              alt={resort.name} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3">
                              <h4 className="text-[10px] font-bold text-white truncate">{resort.name}</h4>
                            </div>
                            <button 
                              onClick={() => toggleLike(resort)}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white/40 hover:text-red-500 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* Bucket Items */}
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <ShoppingBag size={16} className="text-sky-500" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">Bucket</h3>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{items.length}</span>
                    </div>

                    {items.length === 0 ? (
                      <div className="py-10 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-3xl">
                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Empty Bucket</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl group">
                            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
                              <p className="text-[8px] font-black text-sky-500 uppercase tracking-widest">{item.type}</p>
                            </div>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserPanel;
