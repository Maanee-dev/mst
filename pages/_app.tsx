import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const WhatsAppButton = () => (
  <a 
    href="https://wa.me/9607259060" 
    target="_blank" 
    rel="noopener noreferrer"
    className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group flex items-center gap-3"
  >
    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold text-xs uppercase tracking-widest whitespace-nowrap">
      Chat with an Expert
    </span>
    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" width="24" height="24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-2.652 0-5.147 1.03-7.02 2.905-1.873 1.874-2.901 4.37-2.903 7.027-.001 2.03.543 4.154 1.61 5.9l-.311 1.137-.79 2.884 2.953-.776 1.061-.28zM17.446 14.5c-.32-.16-1.891-.932-2.185-1.039-.293-.108-.507-.16-.721.16-.214.32-.826 1.039-1.013 1.252-.186.213-.373.24-.693.08-.32-.16-1.353-.499-2.577-1.591-.951-.848-1.593-1.895-1.78-2.214-.187-.32-.02-.492.14-.651.144-.143.32-.373.48-.56.16-.186.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.721-1.737-.986-2.378-.258-.626-.519-.541-.721-.551-.186-.01-.399-.011-.613-.011s-.56.08-.853.4c-.293.32-1.12 1.093-1.12 2.665 0 1.573 1.146 3.092 1.306 3.306.16.213 2.256 3.444 5.466 4.829.763.329 1.36.525 1.824.672.766.243 1.463.209 2.013.127.613-.092 1.891-.773 2.158-1.52.267-.746.267-1.386.187-1.52-.08-.134-.293-.213-.613-.373z" />
    </svg>
  </a>
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen flex flex-col selection:bg-sky-100 selection:text-sky-900 bg-[#FCFAF7]">
      <Head>
        <title>Serenity Maldives | Where Nature Embraces Luxury</title>
        <meta name="description" content="A curated portal for the most tranquil and luxurious stays in the Maldives. Discover your serene escape." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}