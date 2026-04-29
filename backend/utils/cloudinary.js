import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
import { env } from "../config/env.js";
dotenv.config();

cloudinary.config({
    cloud_name:env.cloudinaryCloudName,
    api_key:env.cloudinaryApiKey,
    api_secret:env.cloudinaryApiSecret
});
export default cloudinary;
