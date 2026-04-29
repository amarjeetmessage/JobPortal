import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import { env, validateEnv } from "./config/env.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";

dotenv.config({});
validateEnv();

const app = express();
app.set("trust proxy", 1);

// middleware
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({extended:true, limit: "1mb"}));
app.use(cookieParser());

app.use(cors({
    origin: env.clientUrl,
    credentials:true
}));

app.get("/health", (req, res) => {
    return res.status(200).json({
        message: "Server is healthy.",
        success: true,
    });
});

// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
    await connectDB();
    app.listen(env.port,()=>{
        console.log(`Server running at port ${env.port}`);
    });
};

startServer().catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
});
