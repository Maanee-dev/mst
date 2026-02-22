
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BlogPost, StoryCategory } from '../types';
import { BLOG_POSTS } from '../constants';
import SEO from '../components/SEO';

const Stories: React.FC = () => {
  const [stories, setStories] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<StoryCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('stories')
          .select('*')
          .order('date', { ascending: false });
        
        if (data && data.length > 0) {
          setStories(data as BlogPost[]);
        } else {
          setStories(BLOG_POSTS as BlogPost[]);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setStories(BLOG_POSTS as BlogPost[]);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [stories, activeCategory, searchQuery]);

  const categories: (StoryCategory | 'All')[] = ['All', 'Dispatch', 'Guide', 'Update', 'Tip'];

  const filteredStories = useMemo(() => {
    return stories.filter(post => {
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [stories, activeCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    if (activeCategory !== 'All' || searchQuery) return null;
    return filteredStories.find(p => p.is_featured) || filteredStories[0];
  }, [filteredStories, activeCategory, searchQuery]);

  return (
    <div className="bg-parchment dark:bg-slate-950 min-h-screen transition-colors duration-700">
      <SEO 
        title="The Serenity Journal | Maldivian Travel Insights" 
        description="A dynamic editorial archive of Maldivian heritage, luxury insights, and travel intelligence. Read our dispatches on seaplane arrivals, atoll guides, and bespoke luxury updates."
      />

      {/* Cinematic Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1510011564758-29df30730163?auto=format&fit=crop&q=80&w=1920" 
            className="w-full h-full object-cover" 
            alt="Maldives Aerial"
          />
          <div className="absolute inset-0 bg-slate-950/40" />
        </div>
        <div className="relative z-10 text-center px-6 reveal active">
          <span className="text-[10px] font-bold text-sky-400 mb-12 block tracking-[1em] uppercase">The Journal</span>
          <h1 className="text-6xl md:text-5xl lg:text-8xl xl:text-9xl font-serif font-bold text-white tracking-tighter italic leading-none">Perspective</h1>
          <div className="h-px w-24 bg-amber-400 mx-auto mt-12 mb-12"></div>
          <p className="text-white text-[11px] font-bold max-w-xl mx-auto uppercase tracking-[0.5em] leading-[2.5] opacity-90">
             Editorial dispatches from the heart of the archipelago.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 lg:px-12">
        
        {/* Filter & Search Bar */}
        <div className="mb-24 flex flex-col md:flex-row justify-between items-center gap-12 border-b border-slate-100 dark:border-white/5 pb-12 reveal transition-colors">
          <div className="flex flex-wrap justify-center gap-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] font-bold uppercase tracking-[0.4em] transition-all pb-2 border-b-2 ${activeCategory === cat ? 'border-sky-500 text-slate-900 dark:text-white' : 'border-transparent text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                {cat}s
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <input 
              type="text"
              placeholder="SEARCH ARCHIVES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-2 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-slate-950 dark:focus:border-white text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-40 text-center reveal active">
             <div className="w-10 h-10 border-2 border-slate-100 dark:border-white/5 border-t-sky-500 rounded-full animate-spin mx-auto mb-8"></div>
             <p className="text-[9px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest">Accessing records...</p>
          </div>
        ) : filteredStories.length > 0 ? (
          <>
            {/* Featured Hero Post */}
            {featuredPost && (
              <div className="mb-48">
                <Link to={`/stories/${featuredPost.slug}`} className="group flex flex-col reveal active">
                  <div className="relative overflow-hidden rounded-[3rem] md:rounded-[5rem] shadow-sm group-hover:shadow-2xl transition-all duration-1000 aspect-[21/9] mb-16 bg-slate-100 dark:bg-slate-900">
                     <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover transition-transform duration-[4s] ease-out group-hover:scale-105" />
                     <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-transparent transition-colors duration-1000"></div>
                     <div className="absolute top-10 left-10">
                        <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur px-6 py-2 rounded-full text-[9px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.4em] shadow-sm transition-colors border dark:border-white/5">
                           Featured {featuredPost.category}
                        </span>
                     </div>
                  </div>
                  <div className="max-w-4xl mx-auto text-center">
                    <span className="text-slate-500 dark:text-slate-600 font-bold text-[9px] uppercase tracking-[0.6em] mb-6 block">
                      {new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <h2 className="text-4xl md:text-7xl font-serif font-bold text-slate-900 dark:text-white mb-8 group-hover:italic transition-all duration-700 leading-[1.1] transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium opacity-90 mb-10 text-lg md:text-xl transition-colors">
                      {featuredPost.excerpt}
                    </p>
                  </div>
                </Link>
              </div>
            )}

            {/* Stories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24">
              {filteredStories.filter(p => p.id !== (featuredPost ? featuredPost.id : null)).map((post, idx) => (
                <Link 
                  key={post.id} 
                  to={`/stories/${post.slug}`} 
                  className="group flex flex-col reveal"
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm group-hover:shadow-xl transition-all duration-1000 aspect-[4/5] mb-10 bg-slate-100 dark:bg-slate-900">
                     <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-[4s] ease-out group-hover:scale-110" />
                     <div className="absolute top-6 left-6">
                        <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-1.5 rounded-full text-[8px] font-bold text-slate-900 dark:text-white uppercase tracking-widest shadow-sm transition-colors border dark:border-white/5">
                           {post.category}
                        </span>
                     </div>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-600 font-bold text-[8px] uppercase tracking-[0.4em] mb-4 block">
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4 group-hover:italic transition-all duration-500 leading-tight transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium opacity-90 line-clamp-2 transition-colors">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="py-40 text-center reveal active">
             <h3 className="text-3xl font-serif font-bold italic text-slate-900 dark:text-white mb-6 transition-colors">No archives found.</h3>
             <button onClick={() => {setActiveCategory('All'); setSearchQuery('');}} className="text-sky-500 dark:text-sky-400 font-bold uppercase tracking-widest text-[10px] border-b border-sky-200 dark:border-sky-800 transition-colors">Reset Filters</button>
          </div>
        )}
      </div>

      <section className="py-48 bg-white dark:bg-slate-950 border-t border-slate-50 dark:border-white/5 transition-colors duration-700">
         <div className="max-w-4xl mx-auto px-6 text-center reveal">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-950 dark:text-white italic mb-12 transition-colors">The Archives</h2>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-[0.5em] mb-20 leading-loose transition-colors">
               Access our full collection of Maldivian dispatches <br className="hidden md:block"/> and photographic journals.
            </p>
            <div className="flex flex-wrap justify-center gap-10">
               {['Aesthetics', 'Heritage', 'Sustainability', 'Cuisine'].map(tag => (
                 <button key={tag} className="text-[9px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-[0.4em] hover:text-slate-950 dark:hover:text-white transition-colors border-b border-transparent hover:border-slate-950 dark:hover:border-white pb-2">
                   {tag}
                 </button>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default Stories;
