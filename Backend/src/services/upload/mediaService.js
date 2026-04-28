import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// Upload single file
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

        // IMPORTANT: return full metadata
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type,
        });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

// Upload multiple files
export const uploadMultipleFiles = async (files, folder) => {
  return Promise.all(
    files.map((file) => uploadToCloudinary(file, folder))
  );
};