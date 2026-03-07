import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Chrome, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/');
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email: email.trim().toLowerCase(), 
        password 
      });
      if (error) throw error;
      navigate('/');
    } catch (err: any) {
      setError(err.message);
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
        options: { redirectTo: window.location.origin },
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
      if (data.session) navigate('/');
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

  const handleGuestLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      navigate('/');
    } catch (err: any) {
      setError(`Guest login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center px-6 py-12">
      <SEO title="Sign In | Maldives Serenity Travels" description="Access your personalized Maldivian collection." />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-12"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <button 
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={14} /> Back to Home
          </button>
          <h1 className="text-4xl font-serif font-light text-slate-900 dark:text-white tracking-tight">
            {authMode === 'login' ? 'Welcome' : 'Join Us'}
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-[0.2em]">
            {authMode === 'login' ? 'Sign in to your account' : 'Start your Maldivian journey'}
          </p>
        </div>

        <div className="space-y-8">
          <form onSubmit={authMode === 'login' ? handleLogin : handleSignUp} className="space-y-4">
            {authMode === 'signup' && (
              <input 
                type="text" 
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-xl py-4 px-6 text-sm focus:ring-1 focus:ring-slate-200 transition-all"
              />
            )}
            <input 
              type="email" 
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-xl py-4 px-6 text-sm focus:ring-1 focus:ring-slate-200 transition-all"
            />
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-xl py-4 px-6 text-sm focus:ring-1 focus:ring-slate-200 transition-all"
            />

            {error && <p className="text-[10px] text-red-500 font-medium text-center">{error}</p>}
            {successMessage && <p className="text-[10px] text-emerald-500 font-medium text-center">{successMessage}</p>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold uppercase tracking-[0.3em] py-5 rounded-xl transition-opacity disabled:opacity-50"
            >
              {loading ? '...' : (authMode === 'login' ? 'Sign In' : 'Register')}
            </button>
          </form>

          <div className="space-y-4">
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-100 dark:border-white/5"></div>
              <span className="flex-shrink mx-4 text-[8px] text-slate-300 uppercase tracking-[0.4em]">or</span>
              <div className="flex-grow border-t border-slate-100 dark:border-white/5"></div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-[0.3em] py-5 rounded-xl transition-all flex items-center justify-center gap-3"
            >
              <Chrome size={16} />
              Continue with Google
            </button>

            <button 
              onClick={handleGuestLogin}
              disabled={loading}
              className="w-full text-slate-400 hover:text-slate-900 dark:hover:text-white text-[9px] font-bold uppercase tracking-[0.4em] py-2 transition-all"
            >
              Continue as Guest
            </button>
          </div>

          <div className="pt-8 text-center">
            <button 
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              className="text-[10px] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-[0.3em]"
            >
              {authMode === 'login' ? "New here? Create account" : "Have an account? Sign In"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
