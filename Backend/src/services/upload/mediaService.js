import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// Upload single file (image or video)
export const uploadToCloudinary = (file, folder = "animarket") => {
  return new Promise((resolve, reject) => {
    const resourceType = file.mimetype.startsWith("video")
      ? "video"
      : "image";

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

// Upload multiple files
export const uploadMultipleFiles = async (files, folder) => {
  const uploads = files.map((file) => uploadToCloudinary(file, folder));
  return Promise.all(uploads);
};