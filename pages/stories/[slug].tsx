import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BLOG_POSTS } from '../../constants';

export default function BlogPostDetail() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find(b => b.slug === slug);

  if (!post) return <div className="p-40 text-center font-serif text-2xl">Article not found.</div>;

  return (
    <article className="bg-white min-h-screen pt-24">
      <div className="h-[60vh] relative">
         <img src={post.image} className="w-full h-full object-cover" alt={post.title} />
         <div className="absolute inset-0 bg-black/30"></div>
         <div className="absolute bottom-20 left-0 right-0 max-w-4xl mx-auto px-6">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white italic leading-tight">{post.title}</h1>
         </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-20">
         <div className="flex items-center gap-6 mb-12 border-b border-slate-100 pb-12">
            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center font-bold text-sky-700">{post.author.charAt(0)}</div>
            <div>
               <p className="font-bold text-slate-900">{post.author}</p>
               <p className="text-slate-400 text-sm">{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
         </div>
         <div className="prose prose-xl prose-slate max-w-none">
            <p className="text-2xl font-serif italic text-slate-700 mb-12 border-l-8 border-sky-400 pl-8">{post.excerpt}</p>
            <div className="text-slate-700 leading-loose text-lg space-y-8">
               {post.content}
               <p>The Maldives is more than just luxury; it's a feeling of weightlessness. Whether you're flying in a seaplane or taking a slow local ferry, the views remain iconic. Planning your trip requires attention to detail—especially when it comes to transfers and weather windows.</p>
            </div>
         </div>
         <div className="mt-20 p-12 bg-sky-50 rounded-[3rem] text-center border border-sky-100">
            <h4 className="text-2xl font-serif font-bold italic mb-6">Inspired to visit?</h4>
            <Link to="/plan" className="inline-block bg-sky-600 text-white font-bold px-12 py-4 rounded-xl uppercase tracking-widest text-xs">Plan My Journey</Link>
         </div>
      </div>
    </article>
  );
}