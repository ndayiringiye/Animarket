 const upload = async (req, res) => {
  try {
    const { animalId } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const animal = await Animal.findById(animalId);
    if (!animal) {
      return res.status(404).json({
        success: false,
        message: "Animal not found",
      });
    }

    const results = await uploadMultipleFiles(
      req.files,
      `animarket/animals/${animalId}`
    );

    const images = [];
    const videos = [];

    results.forEach((file) => {
      if (file.resource_type === "image") {
        images.push({
          url: file.url,
          public_id: file.public_id,
        });
      }

      if (file.resource_type === "video") {
        videos.push({
          url: file.url,
          public_id: file.public_id,
        });
      }
    });

    animal.images.push(...images);
    animal.videos.push(...videos);
    animal.updatedAt = Date.now();

    await animal.save();

    return res.status(200).json({
      success: true,
      message: "Media uploaded to Cloudinary successfully",
      data: {
        images,
        videos,
        animalId: animal._id,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
};

export  {upload};