import React from 'react'
import { Button } from './ui/button'
import { ArrowUpRight, Bookmark, Building2, MapPin } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const Job = ({job}) => {
    const navigate = useNavigate();

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference/(1000*24*60*60));
    }
    
    return (
        <div className='rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70'>
            <div className='flex items-center justify-between'>
                <p className='text-sm font-medium text-slate-500'>{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
                <Button variant="outline" className="rounded-full border-slate-200 text-slate-500" size="icon"><Bookmark className='h-4 w-4' /></Button>
            </div>

            <div className='my-4 flex items-center gap-3'>
                <Button className="h-14 w-14 rounded-2xl border-slate-200 bg-slate-50 p-0" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='flex items-center gap-2 text-lg font-semibold text-slate-900'><Building2 className='h-4 w-4 text-slate-400' />{job?.company?.name}</h1>
                    <p className='mt-1 flex items-center gap-2 text-sm text-slate-500'><MapPin className='h-4 w-4' />{job?.location || "India"}</p>
                </div>
            </div>

            <div>
                <h1 className='my-2 text-xl font-bold text-slate-900'>{job?.title}</h1>
                <p className='line-clamp-3 text-sm leading-6 text-slate-600'>{job?.description}</p>
            </div>
            <div className='mt-5 flex flex-wrap items-center gap-2'>
                <Badge className={'rounded-full bg-cyan-50 px-3 py-1 font-bold text-cyan-700 hover:bg-cyan-50'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'rounded-full bg-amber-50 px-3 py-1 font-bold text-amber-700 hover:bg-amber-50'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'rounded-full bg-emerald-50 px-3 py-1 font-bold text-emerald-700 hover:bg-emerald-50'} variant="ghost">{job?.salary} LPA</Badge>
            </div>
            <div className='mt-5 flex items-center gap-3'>
                <Button onClick={()=> navigate(`/description/${job?._id}`)} variant="outline" className="rounded-xl border-slate-300">Details</Button>
                <Button className="rounded-xl bg-slate-900 text-white hover:bg-slate-800">Save for later <ArrowUpRight className='ml-2 h-4 w-4' /></Button>
            </div>
        </div>
    )
}

export default Job
