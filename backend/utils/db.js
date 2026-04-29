import mongoose from "mongoose";
import { env } from "../config/env.js";

const connectDB = async () => {
    await mongoose.connect(env.mongoUri, {
        serverSelectionTimeoutMS: 10000,
    });
    console.log("mongodb connected successfully");
}
export default connectDB;
