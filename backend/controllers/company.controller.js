import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import validateObjectId from "../utils/validateObjectId.js";

export const registerCompany = asyncHandler(async (req, res) => {
        const { companyName } = req.body;
        if (!companyName) {
            throw new AppError("Company name is required.", 400);
        }

        let company = await Company.findOne({ name: companyName });
        if (company) {
            throw new AppError("A company with this name already exists.", 409);
        }

        company = await Company.create({
            name: companyName.trim(),
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });
});
export const getCompany = asyncHandler(async (req, res) => {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId }).sort({ createdAt: -1 }).lean();

        return res.status(200).json({
            companies,
            success:true
        });
});
// get company by id
export const getCompanyById = asyncHandler(async (req, res) => {
        const companyId = req.params.id;
        validateObjectId(companyId, "Company");

        const company = await Company.findById(companyId);
        if (!company) {
            throw new AppError("Company not found.", 404);
        }

        return res.status(200).json({
            company,
            success: true
        });
});
export const updateCompany = asyncHandler(async (req, res) => {
        const { name, description, website, location } = req.body;
 
        const file = req.file;
        validateObjectId(req.params.id, "Company");

        const updateData = { name, description, website, location };

        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            updateData.logo = cloudResponse.secure_url;
        }

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            throw new AppError("Company not found.", 404);
        }

        return res.status(200).json({
            message:"Company information updated.",
            company,
            success:true
        });
});
