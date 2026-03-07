import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingBag, User, Trash2, LogOut, Mail, Lock, UserPlus, LogIn, Sparkles } from 'lucide-react';
import { useBag } from '../context/BagContext';
import { supabase } from '../lib/supabase';

const UserPanel: React.FC = () => {
  const { likedResorts, toggleLike, items, removeItem, isUserPanelOpen, setIsUserPanelOpen } = useBag();
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
      if (user) setAuthMode('profile');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) setAuthMode('profile');
      else setAuthMode('login');
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const processedEmail = email.trim().toLowerCase();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: processedEmail, 
        password 
      });
      if (error) throw error;
      onClose();
    } catch (err: any) {
      if (err.message === 'Invalid login credentials') {
        setError('Invalid email or password.');
      } else if (err.message === 'Email not confirmed') {
        setError('Please confirm your email address.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
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
        onClose();
      } else {
        setSuccessMessage('Account created! Please check your email for a confirmation link.');
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[700]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#0a0a0a] z-[701] shadow-2xl flex flex-col"
          >
            {/* Minimal Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors z-10"
            >
              <X size={18} />
            </button>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
              {authMode !== 'profile' ? (
                <div className="h-full flex flex-col justify-center">
                  <div className="mb-10">
                    <h3 className="text-3xl font-serif font-light text-slate-900 dark:text-white mb-3">
                      {authMode === 'login' ? 'Sign In' : 'Create Account'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {authMode === 'login' 
                        ? 'Access your curated collection.' 
                        : 'Begin your journey with us.'}
                    </p>
                  </div>

                  {/* Discounted Membership Badge */}
                  <div className="mb-8 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 flex items-start gap-3">
                    <Sparkles className="text-amber-500 mt-0.5" size={16} />
                    <div>
                      <h4 className="text-xs font-bold text-amber-900 dark:text-amber-500 uppercase tracking-widest mb-1">Members Only</h4>
                      <p className="text-xs text-amber-700 dark:text-amber-400/80">Sign in to unlock exclusive discounted membership rates on all stays and experiences.</p>
                    </div>
                  </div>

                  <form onSubmit={authMode === 'login' ? handleLogin : handleSignUp} className="space-y-5">
                    {authMode === 'signup' && (
                      <div>
                        <input 
                          type="text" 
                          placeholder="Full Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-3 text-sm focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors placeholder:text-slate-400"
                        />
                      </div>
                    )}
                    <div>
                      <input 
                        type="email" 
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-3 text-sm focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors placeholder:text-slate-400"
                      />
                    </div>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-3 text-sm focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors placeholder:text-slate-400 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>

                    {successMessage && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        {successMessage}
                      </p>
                    )}

                    {error && (
                      <p className="text-xs text-red-500">
                        {error}
                      </p>
                    )}

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold uppercase tracking-[0.2em] py-4 rounded-none transition-all hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 mt-4"
                    >
                      {loading ? 'Processing...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
                    </button>
                  </form>

                  <div className="mt-8">
                    <div className="relative flex items-center justify-center mb-8">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
                      </div>
                      <span className="relative bg-white dark:bg-[#0a0a0a] px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Or continue with
                      </span>
                    </div>

                    <button 
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="w-full bg-transparent border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold uppercase tracking-[0.1em] py-4 rounded-none transition-all hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-center gap-3 mb-4"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                          <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                          <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                          <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                          <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                        </g>
                      </svg>
                      Google
                    </button>

                    <button 
                      onClick={handleGuestLogin}
                      disabled={loading}
                      className="w-full bg-transparent text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-[0.1em] py-4 transition-all hover:text-slate-900 dark:hover:text-white"
                    >
                      Continue as Guest
                    </button>
                  </div>

                  <div className="mt-auto pt-8 flex flex-col gap-4 text-center">
                    {authMode === 'login' && (
                      <button 
                        onClick={handleForgotPassword}
                        className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                    <button 
                      onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                      className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  {/* Profile Header */}
                  <div className="mb-12 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-serif font-light text-slate-900 dark:text-white mb-1">
                        {user.is_anonymous ? 'Guest' : (user.user_metadata?.full_name || 'Explorer')}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {user.is_anonymous ? 'Anonymous Session' : user.email}
                      </p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>

                  {/* Liked Destinations */}
                  <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white">Liked Destinations</h3>
                    </div>

                    {likedResorts.length === 0 ? (
                      <div className="py-8 border-t border-slate-100 dark:border-white/5">
                        <p className="text-xs text-slate-400">
                          No saved destinations yet.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {likedResorts.map((resort) => (
                          <div key={resort.id} className="group relative aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <img 
                              src={resort.image && resort.image.length > 10 ? resort.image : 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80&w=1200'} 
                              alt={resort.name} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                              <div>
                                <h4 className="text-sm font-serif text-white">{resort.name}</h4>
                              </div>
                              <button 
                                onClick={() => toggleLike(resort)}
                                className="text-white/70 hover:text-white transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* Bucket Items */}
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white">In Your Bucket</h3>
                    </div>

                    {items.length === 0 ? (
                      <div className="py-8 border-t border-slate-100 dark:border-white/5">
                        <p className="text-xs text-slate-400">
                          Your bucket is empty.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 py-4 border-b border-slate-100 dark:border-white/5 last:border-0">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                              <img 
                                src={item.image && item.image.length > 10 ? item.image : 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80&w=1200'} 
                                alt={item.name} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-serif text-slate-900 dark:text-white truncate">{item.name}</h4>
                              <span className="text-[10px] text-slate-500 uppercase tracking-widest block mt-1">
                                {item.type.replace('_', ' ')}
                              </span>
                            </div>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                              <Trash2 size={16} />
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
