import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import { featuredCategories } from '@/data/demoJobs';

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <section className='my-20'>
            <div className='mb-6 flex items-end justify-between gap-4'>
                <div>
                    <p className='text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700'>Featured tracks</p>
                    <h2 className='mt-2 text-3xl font-bold text-slate-900'>Popular hiring lanes</h2>
                </div>
                <p className='max-w-xl text-sm text-slate-500'>
                    Quick-launch searches recruiters use most often when they need relevant pipelines fast.
                </p>
            </div>
            <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
                {
                    featuredCategories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => searchJobHandler(cat)}
                            className="group rounded-[1.5rem] border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100"
                        >
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-xs font-semibold uppercase tracking-[0.24em] text-slate-400'>Search lane</p>
                                    <h3 className='mt-3 text-xl font-bold text-slate-900'>{cat}</h3>
                                </div>
                                <span className='rounded-full bg-emerald-50 p-3 text-emerald-700 transition group-hover:bg-emerald-500 group-hover:text-white'>
                                    <ArrowUpRight className='h-5 w-5' />
                                </span>
                            </div>
                            <p className='mt-4 text-sm leading-6 text-slate-500'>
                                Launch a filtered search for {cat.toLowerCase()} roles and surface the strongest candidates faster.
                            </p>
                        </button>
                    ))
                }
            </div>
        </section>
    )
}

export default CategoryCarousel
