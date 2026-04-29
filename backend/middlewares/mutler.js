import multer from "multer";
import AppError from "../utils/AppError.js";
import { env } from "../config/env.js";

const storage = multer.memoryStorage();
const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
    "application/pdf",
]);

export const singleUpload = multer({
    storage,
    limits: {
        fileSize: env.maxFileSizeBytes,
    },
    fileFilter: (req, file, cb) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
            return cb(new AppError("Only JPG, PNG, WEBP, and PDF files are allowed.", 400));
        }

        cb(null, true);
    }
}).single("file");

export const profileAssetUpload = multer({
    storage,
    limits: {
        fileSize: env.maxFileSizeBytes,
    },
    fileFilter: (req, file, cb) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
            return cb(new AppError("Only JPG, PNG, WEBP, and PDF files are allowed.", 400));
        }

        cb(null, true);
    }
}).fields([
    { name: "file", maxCount: 1 },
    { name: "profilePhotoFile", maxCount: 1 },
    { name: "resumeFile", maxCount: 1 },
]);
