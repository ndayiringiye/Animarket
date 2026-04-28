import { uploadMultipleFiles } from "../../services/upload/mediaService.js";
import Animal from "../../models/Animal.js";

export const uploadMedia = async (req, res) => {
  try {
    const { animalId } = req.params;

    // 1. Validate files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    // 2. Validate animal
    const animal = await Animal.findById(animalId);
    if (!animal) {
      return res.status(404).json({
        success: false,
        message: "Animal not found",
      });
    }

    // 3. Upload files to Cloudinary
    const results = await uploadMultipleFiles(
      req.files,
      `animarket/animals/${animalId}`
    );

    // 4. Separate images and videos
    const images = [];
    const videos = [];

    results.forEach((file) => {
      if (file.resource_type === "image") {
        images.push(file.secure_url);
      } else if (file.resource_type === "video") {
        videos.push(file.secure_url);
      }
    });

    // 5. Update animal document
    animal.images.push(...images);
    animal.videos.push(...videos);
    animal.updatedAt = Date.now();

    await animal.save();

    // 6. Response
    return res.status(200).json({
      success: true,
      message: "Media uploaded successfully",
      data: {
        images,
        videos,
        animalId: animal._id,
      },
    });

  } catch (error) {
    console.error("Upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
};