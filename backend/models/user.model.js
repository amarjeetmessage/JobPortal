import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
    school: { type: String, trim: true },
    degree: { type: String, trim: true },
    fieldOfStudy: { type: String, trim: true },
    startYear: { type: String, trim: true },
    endYear: { type: String, trim: true },
    grade: { type: String, trim: true },
    description: { type: String, trim: true },
}, { _id: false });

const experienceSchema = new mongoose.Schema({
    company: { type: String, trim: true },
    title: { type: String, trim: true },
    employmentType: { type: String, trim: true },
    location: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    currentlyWorking: { type: Boolean, default: false },
    summary: { type: String, trim: true },
    achievements: [{ type: String, trim: true }],
}, { _id: false });

const projectSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    role: { type: String, trim: true },
    techStack: [{ type: String, trim: true }],
    link: { type: String, trim: true },
    summary: { type: String, trim: true },
}, { _id: false });

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['student','recruiter'],
        required:true
    },
    profile:{
        bio:{type:String, default:""},
        headline:{type:String, default:""},
        location:{type:String, default:""},
        website:{type:String, default:""},
        linkedinUrl:{type:String, default:""},
        githubUrl:{type:String, default:""},
        portfolioUrl:{type:String, default:""},
        currentCompany:{type:String, default:""},
        currentPosition:{type:String, default:""},
        experienceLevel:{type:String, default:""},
        totalExperience:{type:String, default:""},
        salaryExpectation:{type:String, default:""},
        noticePeriod:{type:String, default:""},
        openToWork:{type:Boolean, default:true},
        skills:[{type:String}],
        languages:[{type:String}],
        strengths:[{type:String}],
        achievements:[{type:String}],
        certifications:[{type:String}],
        preferredJobTypes:[{type:String}],
        preferredLocations:[{type:String}],
        education:[educationSchema],
        experience:[experienceSchema],
        projects:[projectSchema],
        resume:{type:String}, // URL to resume file
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'}, 
        profilePhoto:{
            type:String,
            default:""
        }
    },
},{timestamps:true});

userSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.model('User', userSchema);
