import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-20 rounded-t-[2rem] border border-b-0 border-slate-200 bg-slate-950 py-10 text-slate-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">TalentGrid</p>
          <h2 className="mt-3 text-3xl font-bold text-white">A polished hiring experience for modern teams.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Built to showcase product thinking, engineering fundamentals, and recruiter-friendly UX from the first screen.
          </p>
        </div>
        
        <div className="grid gap-6 text-sm text-slate-400 md:text-right">
          <div>
            <p className="font-semibold text-white">Platform</p>
            <p className="mt-2">Candidate discovery</p>
            <p>Employer branding</p>
            <p>Application workflows</p>
          </div>
          <div>
            <p className="font-semibold text-white">Proof of quality</p>
            <p className="mt-2">Responsive UI</p>
            <p>Real backend integration</p>
            <p>Production-ready API structure</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
