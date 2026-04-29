import React, { useState } from 'react'
import { ArrowRight, Search, Sparkles, TrendingUp } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
import { heroMetrics } from '@/data/demoJobs';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <section className='relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_30%),radial-gradient(circle_at_right,_rgba(245,158,11,0.16),_transparent_28%),linear-gradient(135deg,_#f8fafc_0%,_#ecfeff_52%,_#fff7ed_100%)] px-6 py-10 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] md:px-10 md:py-14'>
            <div className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent' />
            <div className='grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]'>
                <div className='space-y-7'>
                    <div className='inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm backdrop-blur'>
                        <Sparkles className='h-4 w-4' />
                        Built for standout recruiting teams
                    </div>
                    <div className='space-y-4'>
                        <h1 className='max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl'>
                            Hire faster with a job platform that feels premium from the first click.
                        </h1>
                        <p className='max-w-2xl text-base leading-7 text-slate-600 md:text-lg'>
                            Discover high-signal engineering and product talent, showcase opportunities beautifully, and move candidates through a cleaner funnel.
                        </p>
                    </div>
                    <div className='flex flex-col gap-3 rounded-[1.5rem] border border-white/70 bg-white/80 p-3 shadow-lg shadow-slate-200/70 backdrop-blur md:flex-row md:items-center'>
                        <div className='flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3'>
                            <Search className='h-5 w-5 text-slate-400' />
                            <input
                                type="text"
                                placeholder='Search roles, skills, companies, or locations'
                                onChange={(e) => setQuery(e.target.value)}
                                className='w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 md:text-base'
                            />
                        </div>
                        <Button onClick={searchJobHandler} className="h-12 rounded-2xl bg-slate-900 px-6 text-sm font-semibold text-white hover:bg-slate-800 md:px-7">
                            Explore roles
                            <ArrowRight className='ml-2 h-4 w-4' />
                        </Button>
                    </div>
                    <div className='grid gap-3 sm:grid-cols-3'>
                        {
                            heroMetrics.map((metric) => (
                                <div key={metric.label} className='rounded-[1.4rem] border border-white/70 bg-white/75 p-4 shadow-md shadow-slate-200/70 backdrop-blur'>
                                    <p className='text-2xl font-extrabold text-slate-900'>{metric.value}</p>
                                    <p className='mt-1 text-sm text-slate-500'>{metric.label}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className='relative'>
                    <div className='absolute -left-10 top-10 h-28 w-28 rounded-full bg-emerald-300/30 blur-3xl' />
                    <div className='absolute -right-6 bottom-0 h-32 w-32 rounded-full bg-amber-300/40 blur-3xl' />
                    <div className='relative rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300/40'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm uppercase tracking-[0.24em] text-emerald-300/80'>Recruiter cockpit</p>
                                <h2 className='mt-2 text-2xl font-bold'>Today’s hiring pulse</h2>
                            </div>
                            <div className='rounded-2xl bg-white/10 p-3'>
                                <TrendingUp className='h-6 w-6 text-emerald-300' />
                            </div>
                        </div>
                        <div className='mt-8 grid gap-4'>
                            <div className='rounded-[1.5rem] border border-white/10 bg-white/5 p-4'>
                                <div className='flex items-center justify-between text-sm text-slate-300'>
                                    <span>Qualified candidates</span>
                                    <span>184</span>
                                </div>
                                <div className='mt-3 h-2 rounded-full bg-white/10'>
                                    <div className='h-2 w-[78%] rounded-full bg-gradient-to-r from-emerald-400 to-cyan-300' />
                                </div>
                            </div>
                            <div className='grid gap-4 sm:grid-cols-2'>
                                <div className='rounded-[1.5rem] border border-white/10 bg-white/5 p-4'>
                                    <p className='text-sm text-slate-400'>Time to shortlist</p>
                                    <p className='mt-3 text-3xl font-bold'>2.4 days</p>
                                    <p className='mt-2 text-sm text-emerald-300'>32% faster this week</p>
                                </div>
                                <div className='rounded-[1.5rem] border border-white/10 bg-white/5 p-4'>
                                    <p className='text-sm text-slate-400'>Offer acceptance</p>
                                    <p className='mt-3 text-3xl font-bold'>81%</p>
                                    <p className='mt-2 text-sm text-amber-300'>Premium employer branding</p>
                                </div>
                            </div>
                            <div className='rounded-[1.5rem] border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-slate-200'>
                                Recruiter-ready demo content is preloaded so the product looks polished even before real hiring data ramps up.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
