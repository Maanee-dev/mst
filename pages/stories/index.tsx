import React from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../../constants';

export default function Stories() {
  return (
    <div className="bg-white min-h-screen pt-32">
       <div className="max-w-7xl mx-auto px-6 py-20">
          <h1 className="text-6xl font-serif font-bold italic mb-20 text-center">The Journal</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            {BLOG_POSTS.map(post => (
              <Link key={post.id} to={`/stories/${post.slug}`} className="group space-y-6">
                <div className="h-96 overflow-hidden rounded-[3rem] shadow-xl">
                   <img src={post.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={post.title} />
                </div>
                <div>
                   <span className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px]">{post.date}</span>
                   <h2 className="text-3xl font-serif font-bold italic mt-4 group-hover:text-sky-600 transition-colors">{post.title}</h2>
                   <p className="text-slate-600 mt-4 leading-relaxed line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
       </div>
    </div>
  );
}