import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import { CLOUDINARY_OPTIONS } from './cloudinary.js';

cloudinary.config(CLOUDINARY_OPTIONS);

export const uploadVideo = async (mediaPath: string, folder = "User_Posts") => {
    try {
        const options = {
            use_filename: true,
            unique_filename: true,
            overwrite: true,
            folder,
            transformation: [
                {
                    // Reduce the video bitrate to 1000k and set max resolution to 720p (1280x720)
                    bit_rate: "1000k",
                    width: 1280,
                    height: 720,
                    crop: "limit",  // Prevents stretching and keeps aspect ratio
                    quality: "auto", // Automatically determines the best quality
                    format: "mp4" // Output format
                }
            ],
        }
        const result = await cloudinary.uploader.upload(mediaPath, { resource_type: 'video',...options});
        return result;
    } catch (error) {
        console.log("error in cloudinary function",error);
    }
};

export const uploadImage = async (mediaPath: string, folder = "User_Posts") => {
    try {
        const options = {
            use_filename: true,
            unique_filename: true,
            overwrite: true,
            folder,
            transformation: [
                {
                    // Resize the image to a maximum of 800x800 pixels
                    width: 800,
                    height: 1000,
                    crop: "limit", // Ensures the image keeps its aspect ratio
                    quality: "auto:good", // Automatically adjusts quality to balance size and quality
                    format: "jpg" // Convert to JPEG to reduce size further
                }
            ],
        }
        const result = await cloudinary.uploader.upload(mediaPath, { resource_type: 'image',...options});
        return result;
    } catch (error) {
        console.log("error in cloudinary function",error);
    }
};

export const uploadProfileImage = async (mediaPath: string, folder = "User_Profile_Pic") => {
    try {
        const options = {
            use_filename: true,
            unique_filename: true,
            overwrite: true,
            folder,
            transformation: [
                {
                    // Resize the image to a maximum of 800x800 pixels
                    width: 800,
                    height: 1000,
                    crop: "limit", // Ensures the image keeps its aspect ratio
                    quality: "auto:good", // Automatically adjusts quality to balance size and quality
                    format: "jpg" // Convert to JPEG to reduce size further
                }
            ],
        }
        const result = await cloudinary.uploader.upload(mediaPath, { resource_type: 'image',...options});
        return result;
    } catch (error) {
        console.log("error in cloudinary Profile Image function",error);
    }
};