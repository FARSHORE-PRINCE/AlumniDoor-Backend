import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    role: { 
        type: String, 
        enum: ["STUDENT", "MENTOR", "ALUMNI"],
        default: "STUDENT", 
    },
    fullName: {
        type: String,
        required: true,
        trim: true, 
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,

    },
    phone: {
        type: Number,
        required: true,
        unique: true,
        trim: true,
    },
    profilePhoto: {
        type: String,// use a server [by multer only], not a third party service like Cloudinary url.
        required: true,

    },
    degree: {
        type: String,
        required: true,

    },
    graduationYear: {
        type: Number,
        required: true,

    },
    currentProfession: {
        type: String,
        required: true,

    },
    linkedIn: {
        type: String,// linkedIn url

    },
    password: {
        type: String,
        required: [true, "Password is required"],

    },
    refreshToken:{
        type: String,
    }
    },
    {
        timestamps: true
    }
);

export const User = mongoose.model("User", userSchema);