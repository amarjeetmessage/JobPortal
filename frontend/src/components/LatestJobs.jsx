import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux'; 
import { demoJobs } from '@/data/demoJobs';

const LatestJobs = () => {
    const {allJobs} = useSelector(store=>store.job);
    const featuredJobs = allJobs.length > 0 ? allJobs.slice(0,6) : demoJobs;
   
    return (
        <section className='my-20'>
            <div className='mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
                <div>
                    <p className='text-sm font-semibold uppercase tracking-[0.24em] text-amber-700'>Live market view</p>
                    <h1 className='mt-2 text-4xl font-bold text-slate-900'><span className='text-emerald-700'>Latest & top</span> opportunities</h1>
                </div>
                <p className='max-w-2xl text-sm leading-6 text-slate-500'>
                    The homepage now falls back to curated sample roles, so recruiters and interviewers always see a strong marketplace instead of an empty state.
                </p>
            </div>
            <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
                {
                    featuredJobs.map((job) => <LatestJobCards key={job._id} job={job}/>)
                }
            </div>
        </section>
    )
}

export default LatestJobs
