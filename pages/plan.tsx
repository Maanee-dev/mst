import React, { useState } from 'react';

export default function PlanMyTrip() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return <div className="p-40 text-center font-serif text-4xl italic">Thank you for reaching out!</div>;

  return (
    <div className="bg-slate-50 min-h-screen pt-40 pb-20 px-6">
      <div className="max-w-2xl mx-auto bg-white p-12 rounded-[3rem] shadow-2xl">
        <h1 className="text-4xl font-serif font-bold italic mb-8 text-center">Bespoke Planning</h1>
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
          <input type="text" placeholder="Full Name" className="w-full bg-slate-50 p-4 rounded-xl" required />
          <input type="email" placeholder="Email" className="w-full bg-slate-50 p-4 rounded-xl" required />
          <select className="w-full bg-slate-50 p-4 rounded-xl">
            <option>Honeymoon</option>
            <option>Family</option>
            <option>Adventure</option>
          </select>
          <button type="submit" className="w-full bg-slate-950 text-white font-bold py-5 rounded-xl uppercase tracking-widest">Request Quote</button>
        </form>
      </div>
    </div>
  );
}