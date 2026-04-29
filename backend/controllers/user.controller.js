import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import pickUserResponse from "../utils/pickUserResponse.js";
import { env } from "../config/env.js";
import { buildProfileUpdates, getUploadedFile } from "../utils/profile.js";

const buildCookieOptions = () => ({
    maxAge: 1 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
    secure: env.nodeEnv === "production",
});

export const register = asyncHandler(async (req, res) => {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            throw new AppError("Full name, email, phone number, password, and role are required.", 400);
        }

        if (password.length < 6) {
            throw new AppError("Password must be at least 6 characters long.", 400);
        }

        const file = getUploadedFile(req, "profilePhotoFile");
        let profilePhoto = "";

        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            profilePhoto = cloudResponse.secure_url;
        }

        const user = await User.findOne({ email });
        if (user) {
            throw new AppError("User already exists with this email.", 409);
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
});
export const login = asyncHandler(async (req, res) => {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            throw new AppError("Email, password, and role are required.", 400);
        }

        let user = await User.findOne({ email });
        if (!user) {
            throw new AppError("Incorrect email or password.", 400);
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new AppError("Incorrect email or password.", 400);
        }

        // check role is correct or not
        if (role !== user.role) {
            throw new AppError("Account doesn't exist with current role.", 400);
        }

        const tokenData = {
            userId: user._id
        };
        const token = jwt.sign(tokenData, env.jwtSecret, { expiresIn: '1d' });
        user = pickUserResponse(user);

        return res.status(200).cookie("token", token, buildCookieOptions()).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        });
});
export const logout = asyncHandler(async (req, res) => {
        return res.status(200).cookie("token", "", { ...buildCookieOptions(), maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
});
export const updateProfile = asyncHandler(async (req, res) => {
        const { fullname, email, phoneNumber } = req.body;
        const resumeFile = getUploadedFile(req, "resumeFile");
        const profilePhotoFile = getUploadedFile(req, "profilePhotoFile");
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            throw new AppError("User not found.", 404);
        }

        const existingUser = await User.findOne({ email });
        if (email && existingUser && existingUser._id.toString() !== userId) {
            throw new AppError("Another account already uses this email.", 409);
        }

        const profileUpdates = buildProfileUpdates(req.body);

        if(fullname) user.fullname = fullname.trim();
        if(email) user.email = email.trim();
        if(phoneNumber) {
            const parsedPhoneNumber = Number(phoneNumber);

            if (Number.isNaN(parsedPhoneNumber)) {
                throw new AppError("Phone number must contain only numeric characters.", 400);
            }

            user.phoneNumber = parsedPhoneNumber;
        }

        user.profile = {
            ...(user.profile?.toObject?.() || {}),
            ...profileUpdates,
        };

        if(resumeFile){
            const fileUri = getDataUri(resumeFile);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: "auto",
                folder: "job-portal/resumes",
            });

            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = resumeFile.originalname;
        }

        if(profilePhotoFile){
            const fileUri = getDataUri(profilePhotoFile);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                folder: "job-portal/profile-photos",
            });

            user.profile.profilePhoto = cloudResponse.secure_url;
        }


        await user.save();
        user = pickUserResponse(user);

        return res.status(200).json({
            message:"Profile updated successfully.",
            user,
            success:true
        });
});
