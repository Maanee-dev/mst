import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, LogOut, Chrome } from 'lucide-react';
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
      setError(err.message === 'Invalid login credentials' 
        ? 'Invalid email or password.' 
        : err.message);
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
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;
      if (data.session) onClose();
      else {
        setSuccessMessage('Check your email to confirm your account.');
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
      // Ensure we are using the correct method for anonymous sign in
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        console.error('Guest login error:', error);
        throw error;
      }
      console.log('Guest login success:', data);
      onClose();
    } catch (err: any) {
      setError(`Guest login failed: ${err.message}`);
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
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[700]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-slate-950 z-[701] flex flex-col border-l border-slate-100 dark:border-white/5"
          >
            {/* Minimal Header */}
            <div className="px-6 py-6 flex items-center justify-between">
              <h2 className="text-xs font-medium uppercase tracking-widest text-slate-400">
                {user ? 'Account' : 'Sign In'}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-full transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-8 no-scrollbar">
              {authMode !== 'profile' ? (
                <div className="space-y-8 py-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-light text-slate-900 dark:text-white">
                      {authMode === 'login' ? 'Welcome' : 'Create Account'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {authMode === 'login' ? 'Sign in to your account' : 'Join our community'}
                    </p>
                  </div>

                  <form onSubmit={authMode === 'login' ? handleLogin : handleSignUp} className="space-y-3">
                    {authMode === 'signup' && (
                      <input 
                        type="text" 
                        placeholder="Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-lg py-3 px-4 text-sm focus:ring-1 focus:ring-slate-200 transition-all"
                      />
                    )}
                    <input 
                      type="email" 
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-lg py-3 px-4 text-sm focus:ring-1 focus:ring-slate-200 transition-all"
                    />
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-lg py-3 px-4 text-sm focus:ring-1 focus:ring-slate-200 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-tighter text-slate-400"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>

                    {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
                    {successMessage && <p className="text-[10px] text-emerald-500 font-medium">{successMessage}</p>}

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium uppercase tracking-widest py-3 rounded-lg transition-opacity disabled:opacity-50 mt-2"
                    >
                      {loading ? '...' : (authMode === 'login' ? 'Sign In' : 'Register')}
                    </button>
                  </form>

                  <div className="space-y-3">
                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-slate-100 dark:border-white/5"></div>
                      <span className="flex-shrink mx-4 text-[10px] text-slate-300 uppercase tracking-widest">or</span>
                      <div className="flex-grow border-t border-slate-100 dark:border-white/5"></div>
                    </div>

                    <button 
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="w-full border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 text-xs font-medium uppercase tracking-widest py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Chrome size={14} />
                      Google
                    </button>

                    <button 
                      onClick={handleGuestLogin}
                      disabled={loading}
                      className="w-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[10px] font-medium uppercase tracking-widest py-2 transition-all"
                    >
                      Continue as Guest
                    </button>
                  </div>

                  <div className="pt-4 text-center">
                    <button 
                      onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                      className="text-[10px] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-widest"
                    >
                      {authMode === 'login' ? "New here? Create account" : "Have an account? Sign In"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-10 py-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-xl font-light text-slate-900 dark:text-white">
                        {user.is_anonymous ? 'Guest' : (user.user_metadata?.full_name || 'Explorer')}
                      </h3>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                        {user.is_anonymous ? 'Anonymous Session' : user.email}
                      </p>
                    </div>
                    <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <LogOut size={18} />
                    </button>
                  </div>

                  <section className="space-y-6">
                    <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-400">Liked</h4>
                    {likedResorts.length === 0 ? (
                      <p className="text-xs text-slate-300 italic">No favorites yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {likedResorts.map((resort) => (
                          <div key={resort.id} className="flex items-center justify-between group">
                            <span className="text-sm text-slate-600 dark:text-slate-300 font-light">{resort.name}</span>
                            <button onClick={() => toggleLike(resort)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <section className="space-y-6">
                    <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-400">Bucket</h4>
                    {items.length === 0 ? (
                      <p className="text-xs text-slate-300 italic">Bucket is empty.</p>
                    ) : (
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between group">
                            <span className="text-sm text-slate-600 dark:text-slate-300 font-light">{item.name}</span>
                            <button onClick={() => removeItem(item.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all">
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
