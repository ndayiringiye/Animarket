import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";

// Upload single file
const uploadToCloudinaryOnce = (file, folder = "animarket", timeoutMs = 120000) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      return reject(new Error("No file buffer available for Cloudinary upload."));
    }

    const resourceType = file.mimetype.startsWith("video")
      ? "video"
      : file.mimetype.startsWith("image")
      ? "image"
      : "raw";

    const timeout = setTimeout(() => {
      reject(new Error("Cloudinary upload timed out."));
    }, timeoutMs);

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        clearTimeout(timeout);
        if (error) return reject(error);

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type,
        });
      }
    );

    stream.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

export const uploadToCloudinary = async (file, folder = "animarket", timeoutMs = 120000, retries = 1) => {
  try {
    return await uploadToCloudinaryOnce(file, folder, timeoutMs);
  } catch (error) {
    if (retries > 0 && /timeout/i.test(error.message)) {
      console.warn(`Cloudinary upload timeout, retrying once for ${folder}`);
      return uploadToCloudinary(file, folder, timeoutMs, retries - 1);
    }
    throw error;
  }
};

// Upload multiple files
export const uploadMultipleFiles = async (files, folder) => {
  const results = await Promise.allSettled(
    files.map((file) => uploadToCloudinary(file, folder))
  );

  const rejected = results.filter((result) => result.status === "rejected");
  if (rejected.length > 0) {
    throw new Error(rejected.map((result) => result.reason?.message || String(result.reason)).join("; "));
  }

  return results.map((result) => result.value);
};