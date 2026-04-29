import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { demoJobs } from '@/data/demoJobs';

const Browse = () => {
    useGetAllJobs();
    const {allJobs} = useSelector(store=>store.job);
    const jobsToRender = allJobs.length > 0 ? allJobs : demoJobs;
    const dispatch = useDispatch();

    useEffect(()=>{
        return ()=>{
            dispatch(setSearchedQuery(""));
        }
    },[])

    return (
        <div>
            <Navbar />
            <div className='mx-auto my-10 max-w-7xl px-4'>
                <h1 className='my-10 text-xl font-bold text-slate-900'>Search Results ({jobsToRender.length})</h1>
                <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
                    {
                        jobsToRender.map((job) => {
                            return (
                                <Job key={job._id} job={job}/>
                            )
                        })
                    }
                </div>

            </div>
        </div>
    )
}

export default Browse
