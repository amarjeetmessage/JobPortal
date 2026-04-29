import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, Building2, MapPin } from 'lucide-react'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();

    return (
        <div onClick={()=> navigate(`/description/${job._id}`)} className='group cursor-pointer rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/70'>
            <div className='flex items-start justify-between gap-4'>
                <div>
                    <div className='inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600'>
                        <Building2 className='h-3.5 w-3.5' />
                        {job?.company?.name}
                    </div>
                    <p className='mt-3 flex items-center gap-2 text-sm text-slate-500'>
                        <MapPin className='h-4 w-4' />
                        {job?.location || "India"}
                    </p>
                </div>
                <span className='rounded-full border border-slate-200 p-2 text-slate-500 transition group-hover:border-emerald-300 group-hover:bg-emerald-50 group-hover:text-emerald-700'>
                    <ArrowUpRight className='h-4 w-4' />
                </span>
            </div>
            <div>
                <h1 className='mt-5 text-xl font-bold text-slate-900'>{job?.title}</h1>
                <p className='mt-3 line-clamp-3 text-sm leading-6 text-slate-600'>{job?.description}</p>
            </div>
            <div className='mt-5 flex flex-wrap items-center gap-2'>
                <Badge className={'rounded-full bg-cyan-50 px-3 py-1 font-bold text-cyan-700 hover:bg-cyan-50'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'rounded-full bg-amber-50 px-3 py-1 font-bold text-amber-700 hover:bg-amber-50'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'rounded-full bg-emerald-50 px-3 py-1 font-bold text-emerald-700 hover:bg-emerald-50'} variant="ghost">{job?.salary} LPA</Badge>
            </div>
        </div>
    )
}

export default LatestJobCards
