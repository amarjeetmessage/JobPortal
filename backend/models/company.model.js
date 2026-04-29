import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String, 
    },
    website:{
        type:String 
    },
    location:{
        type:String 
    },
    logo:{
        type:String // URL to company logo
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true})

companySchema.index({ userId: 1, createdAt: -1 });
companySchema.index({ name: 1 }, { unique: true });

export const Company = mongoose.model("Company", companySchema);
