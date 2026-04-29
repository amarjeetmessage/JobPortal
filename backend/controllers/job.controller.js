import { Job } from "../models/job.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import validateObjectId from "../utils/validateObjectId.js";

// admin post krega job
export const postJob = asyncHandler(async (req, res) => {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            throw new AppError("All job fields are required.", 400);
        }

        validateObjectId(companyId, "Company");

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(",").map((item) => item.trim()).filter(Boolean),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: Number(experience),
            position: Number(position),
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
});
// student k liye
export const getAllJobs = asyncHandler(async (req, res) => {
        const keyword = req.query.keyword || "";
        const page = Math.max(Number(req.query.page || 1), 1);
        const limit = Math.min(Math.max(Number(req.query.limit || 12), 1), 50);
        const skip = (page - 1) * limit;
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { location: { $regex: keyword, $options: "i" } },
            ]
        };
        const [jobs, total] = await Promise.all([
            Job.find(query)
                .populate({
                    path: "company"
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Job.countDocuments(query),
        ]);

        return res.status(200).json({
            jobs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
            success: true
        });
});
// student
export const getJobById = asyncHandler(async (req, res) => {
        const jobId = req.params.id;
        validateObjectId(jobId, "Job");

        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if (!job) {
            throw new AppError("Job not found.", 404);
        }

        return res.status(200).json({ job, success: true });
});
// admin kitne job create kra hai abhi tk
export const getAdminJobs = asyncHandler(async (req, res) => {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company'
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            jobs,
            success: true
        });
});
