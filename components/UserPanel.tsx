import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, LogOut, ShieldCheck, Zap, Gift } from 'lucide-react';
import { useBag } from '../context/BagContext';
import { supabase } from '../lib/supabase';

const UserPanel: React.FC = () => {
  const { likedResorts, toggleLike, items, removeItem, isUserPanelOpen, setIsUserPanelOpen, membershipTier, user } = useBag();
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
    if (user) setAuthMode('profile');
    else setAuthMode('login');
  }, [user]);

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

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error('Google login failed:', err);
      setError(err.message || 'An unexpected error occurred during Google login.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) {
        if (error.message.includes('not enabled')) {
          throw new Error('Guest login is currently disabled in the security settings. Please sign up with an email to continue.');
        }
        throw error;
      }
      
      // The auth listener in BagContext will update the user state
      onClose();
    } catch (err: any) {
      console.error('Guest login failed:', err);
      setError(err.message || 'An unexpected error occurred during guest login.');
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[700]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 h-full w-full md:max-w-md bg-white dark:bg-slate-900 z-[701] shadow-2xl flex flex-col"
          >
            {/* Minimal Close Button */}
            <div className="absolute top-8 right-8 z-[20]">
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 no-scrollbar space-y-16">
              {authMode !== 'profile' ? (
                <div className="h-full flex flex-col justify-center max-w-sm mx-auto">
                  <div className="mb-12">
                    <h3 className="text-3xl font-serif font-medium text-slate-900 dark:text-white mb-4 tracking-tight">
                      {authMode === 'login' ? 'Welcome Back.' : 'Join the Journey.'}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed max-w-[240px]">
                      {authMode === 'login' 
                        ? 'Access your curated Maldivian collection.' 
                        : 'Start your journey through the archipelago.'}
                    </p>
                  </div>

                  <form onSubmit={authMode === 'login' ? handleLogin : handleSignUp} className="space-y-6">
                    {authMode === 'signup' && (
                      <div className="space-y-2">
                        <input 
                          type="text" 
                          placeholder="Full Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="w-full bg-transparent border-b border-slate-100 dark:border-white/10 py-4 text-xs focus:border-slate-900 dark:focus:border-white transition-all outline-none placeholder:text-slate-300"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <input 
                        type="email" 
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-transparent border-b border-slate-100 dark:border-white/10 py-4 text-xs focus:border-slate-900 dark:focus:border-white transition-all outline-none placeholder:text-slate-300"
                      />
                    </div>
                    <div className="space-y-2 relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-transparent border-b border-slate-100 dark:border-white/10 py-4 text-xs focus:border-slate-900 dark:focus:border-white transition-all outline-none placeholder:text-slate-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>

                    {successMessage && (
                      <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest text-center">
                        {successMessage}
                      </p>
                    )}

                    {error && (
                      <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest text-center">
                        {error}
                      </p>
                    )}

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-[0.3em] py-6 rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-[10px] mt-8"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        authMode === 'login' ? 'Sign In' : 'Create Account'
                      )}
                    </button>
                  </form>

                  <div className="mt-12 space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-300">Or</span>
                      <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <button 
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full border border-slate-100 dark:border-white/10 text-slate-900 dark:text-white font-black uppercase tracking-[0.2em] py-5 rounded-full transition-all flex items-center justify-center gap-3 text-[9px] hover:bg-slate-50 dark:hover:bg-white/5"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                      </button>
                      
                      <button 
                        onClick={handleGuestLogin}
                        disabled={loading}
                        className="w-full text-slate-400 hover:text-slate-900 dark:hover:text-white font-black uppercase tracking-[0.2em] py-2 transition-all text-[9px]"
                      >
                        Continue as Guest
                      </button>
                    </div>

                    <div className="flex flex-col gap-4 pt-4">
                      {authMode === 'login' && (
                        <button 
                          onClick={handleForgotPassword}
                          className="text-[8px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          Forgot Password?
                        </button>
                      )}
                      <button 
                        onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                        className="text-[8px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        {authMode === 'login' ? "Create an Account" : "Back to Sign In"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-16">
                  {/* Minimal Profile Info */}
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-serif text-xl font-bold">
                        {(user.user_metadata?.full_name?.[0] || user.email?.[0] || 'G').toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-xl font-serif font-medium text-slate-900 dark:text-white tracking-tight">
                          {user.is_anonymous ? 'Guest Explorer' : (user.user_metadata?.full_name || 'Explorer')}
                        </h2>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            {user.is_anonymous ? 'Anonymous' : user.email}
                          </p>
                          {!user.is_anonymous && (
                            <span className="text-[7px] font-black text-sky-500 uppercase tracking-widest border border-sky-500/20 px-2 py-0.5 rounded-full">
                              {membershipTier}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="text-slate-300 hover:text-red-500 transition-colors p-2"
                      title="Logout"
                    >
                      <LogOut size={18} strokeWidth={1.5} />
                    </button>
                  </div>

                  {/* Member Benefits - Minimalist */}
                  {!user?.is_anonymous && (
                    <section>
                      <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 mb-8">Privileges</h3>
                      <div className="space-y-4">
                        <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-slate-100 dark:border-white/5">
                          <div className="flex justify-between items-start mb-6">
                            <Zap size={20} className="text-sky-500" />
                            <span className="text-[8px] font-black text-sky-500 uppercase tracking-widest">Active</span>
                          </div>
                          <p className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2">15% Saving</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                            Applied to all direct inquiries.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-[1.5rem] border border-slate-100 dark:border-white/5">
                            <ShieldCheck size={14} className="text-emerald-500 mb-3" />
                            <h5 className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Priority</h5>
                          </div>
                          <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-[1.5rem] border border-slate-100 dark:border-white/5">
                            <Gift size={14} className="text-purple-500 mb-3" />
                            <h5 className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Rewards</h5>
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Liked Destinations - Minimalist */}
                  <section>
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">Collection</h3>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{likedResorts.length} Items</span>
                    </div>

                    {likedResorts.length === 0 ? (
                      <div className="py-12 text-center border border-dashed border-slate-100 dark:border-white/5 rounded-[2rem]">
                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Archive Empty</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-6">
                        {likedResorts.map((resort) => (
                          <div key={resort.id} className="group flex items-center gap-5">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 flex-shrink-0">
                              <img 
                                src={resort.image && resort.image.length > 10 ? resort.image : 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80&w=1200'} 
                                alt={resort.name} 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[7px] font-black text-sky-500 uppercase tracking-widest block mb-1">
                                {resort.atoll}
                              </span>
                              <h4 className="text-sm font-serif font-bold text-slate-900 dark:text-white truncate group-hover:text-sky-500 transition-colors">{resort.name}</h4>
                            </div>
                            <button 
                              onClick={() => toggleLike(resort)}
                              className="p-2 text-slate-200 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* Bucket Items - Minimalist */}
                  <section>
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">Bucket</h3>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{items.length} Items</span>
                    </div>

                    {items.length === 0 ? (
                      <div className="py-12 text-center border border-dashed border-slate-100 dark:border-white/5 rounded-[2rem]">
                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">No Selections</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {items.map((item) => (
                          <div key={item.id} className="group flex items-center gap-5">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 flex-shrink-0">
                              <img 
                                src={item.image && item.image.length > 10 ? item.image : 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80&w=1200'} 
                                alt={item.name} 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                                {item.type.replace('_', ' ')}
                              </span>
                              <h4 className="text-sm font-serif font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
                            </div>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-slate-200 hover:text-red-500 transition-colors"
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
