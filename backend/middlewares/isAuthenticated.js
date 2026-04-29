import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const isAuthenticated = asyncHandler(async (req, res, next) => {
        const token = req.cookies.token;
        if (!token) {
            throw new AppError("User not authenticated.", 401);
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY);
        if(!decode){
            throw new AppError("Invalid token.", 401);
        }

        req.id = decode.userId;
        next();
    }
);
export default isAuthenticated;
