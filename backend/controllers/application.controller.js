import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import validateObjectId from "../utils/validateObjectId.js";

export const applyJob = asyncHandler(async (req, res) => {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            throw new AppError("Job id is required.", 400);
        }

        validateObjectId(jobId, "Job");

        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            throw new AppError("You have already applied for this job.", 409);
        }

        // check if the jobs exists
        const job = await Job.findById(jobId);
        if (!job) {
            throw new AppError("Job not found.", 404);
        }
        // create a new application
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId,
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:"Job applied successfully.",
            success:true
        });
});
export const getAppliedJobs = asyncHandler(async (req,res) => {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });

        return res.status(200).json({
            application,
            success:true
        });
});
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = asyncHandler(async (req,res) => {
        const jobId = req.params.id;
        validateObjectId(jobId, "Job");

        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            throw new AppError("Job not found.", 404);
        }

        return res.status(200).json({
            job, 
            success:true
        });
});
export const updateStatus = asyncHandler(async (req,res) => {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            throw new AppError("Status is required.", 400);
        }

        validateObjectId(applicationId, "Application");

        // find the application by applicantion id
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            throw new AppError("Application not found.", 404);
        }

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });
});
