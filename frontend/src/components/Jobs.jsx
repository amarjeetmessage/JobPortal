import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { demoJobs } from '@/data/demoJobs';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const jobsSource = allJobs.length > 0 ? allJobs : demoJobs;
    const [filterJobs, setFilterJobs] = useState(jobsSource);

    useEffect(() => {
        if (searchedQuery) {
            const filteredJobs = jobsSource.filter((job) => {
                return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchedQuery.toLowerCase())
            })
            setFilterJobs(filteredJobs)
        } else {
            setFilterJobs(jobsSource)
        }
    }, [jobsSource, searchedQuery]);

    return (
        <div>
            <Navbar />
            <div className='mx-auto mt-5 max-w-7xl px-4'>
                <div className='flex gap-5'>
                    <div className='w-20%'>
                        <FilterCard />
                    </div>
                    {
                        filterJobs.length <= 0 ? <span>Job not found</span> : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Jobs
