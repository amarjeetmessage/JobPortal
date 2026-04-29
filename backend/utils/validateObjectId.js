import mongoose from "mongoose";
import AppError from "./AppError.js";

const validateObjectId = (value, resourceName = "Resource") => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new AppError(`${resourceName} id is invalid.`, 400);
    }
};

export default validateObjectId;
