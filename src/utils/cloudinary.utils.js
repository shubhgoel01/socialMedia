import dotenv from "dotenv"
import fs from "fs"
dotenv.config()

import {v2 as cloudinary} from 'cloudinary';
cloudinary.config({ 
        cloud_name: 'realbeast', 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

import ApiError from "./apiError.utils.js";

const uploadOnCloudinary = async (localFileUrl) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(localFileUrl,{resource_type: "auto"})
        fs.unlinkSync(localFileUrl);
        console.log("File uploaded on cloudinary", uploadResult)

        return uploadResult
    } catch (error) {
        fs.unlinkSync(localFileUrl);
        console.log("upload to cloudinary failed", error)
        throw new ApiError(500, "unable to upload files", new Error("File upload to cloudinary failed"), "uploadOnCloudinary: cloudinary.utils.js")
    } 
}

const deleteFromCloudinary = async (public_id, resource_type) => {
    try {
        const response = await cloudinary.uploader.destroy(public_id, {
            resource_type: resource_type
        });
    } catch (error) {
        throw new ApiError(500, "unable to delete files", error, "deleteFromCloudinary: cloudinary.utils.js")
    }
}

export {uploadOnCloudinary, deleteFromCloudinary} 