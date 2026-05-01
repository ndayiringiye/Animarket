import Animal from "../../models/animals/AnimalModel.js";
import { animalIsVerified } from "../../validoators/Animal/animalvalidator.js";
import { uploadToCloudinary, uploadMultipleFiles } from "../upload/mediaService.js";
import cloudinary from "../../config/cloudinary.js";

// ─── CREATE ───────────────────────────────────────────────────────────────────
export const createAnimal = async (req, res) => {
  const {
    name, type, gender, age, owner, price, currency,
    health, location, weight, breed, previousOwners,
    images, videos,
    previousOwnerName, previousOwnerPhone, previousOwnerAgreementPhoto,
    previousOwnerIdType, previousOwnerIdNumber, previousOwnerIdPhoto,
    previousOwnerGender, previousOwnerAge,
  } = req.body;

  if (!name || !type || !gender || !age || !owner || !price || !currency || !location || !health || !weight) {
    return res.status(400).json({
      status: 400,
      error: "All required animal details must be provided.",
    });
  }

  try {
    const { error } = animalIsVerified.validate(req.body);
    if (error) {
      return res.status(400).json({ status: 400, error: error.details[0].message });
    }

    // Handle file uploads to Cloudinary
    let uploadedImages = [];
    let uploadedImagesPublicIds = [];
    let uploadedVideos = [];
    let uploadedVideosPublicIds = [];
    let uploadedAgreementPhoto = null;
    let uploadedAgreementPhotoPublicId = null;
    let uploadedIdPhoto = null;
    let uploadedIdPhotoPublicId = null;

    try {
      // Upload images
      if (req.files?.images && req.files.images.length > 0) {
        const imageUploads = await uploadMultipleFiles(req.files.images, "animarket/animals/images");
        uploadedImages = imageUploads.map(upload => upload.url);
        uploadedImagesPublicIds = imageUploads.map(upload => upload.public_id);
      }

      // Upload videos
      if (req.files?.videos && req.files.videos.length > 0) {
        const videoUploads = await uploadMultipleFiles(req.files.videos, "animarket/animals/videos");
        uploadedVideos = videoUploads.map(upload => upload.url);
        uploadedVideosPublicIds = videoUploads.map(upload => upload.public_id);
      }

      // Upload previous owner agreement photo
      if (req.files?.previousOwnerAgreementPhoto && req.files.previousOwnerAgreementPhoto.length > 0) {
        const agreementUpload = await uploadToCloudinary(req.files.previousOwnerAgreementPhoto[0], "animarket/animals/agreements");
        uploadedAgreementPhoto = agreementUpload.url;
        uploadedAgreementPhotoPublicId = agreementUpload.public_id;
      }

      // Upload previous owner ID photo
      if (req.files?.previousOwnerIdPhoto && req.files.previousOwnerIdPhoto.length > 0) {
        const idUpload = await uploadToCloudinary(req.files.previousOwnerIdPhoto[0], "animarket/animals/ids");
        uploadedIdPhoto = idUpload.url;
        uploadedIdPhotoPublicId = idUpload.public_id;
      }

      // Handle vaccination records with file uploads
      let processedHealth = { ...health };
      if (health.vaccinationRecords && health.vaccinationRecords.length > 0) {
        processedHealth.vaccinationRecords = await Promise.all(
          health.vaccinationRecords.map(async (record, index) => {
            const processedRecord = { ...record };

            // Check if there's a vaccination proof file for this record
            if (req.files?.vaccinationProofs && req.files.vaccinationProofs[index]) {
              const proofUpload = await uploadToCloudinary(
                req.files.vaccinationProofs[index],
                "animarket/animals/vaccination_proofs"
              );
              processedRecord.vaccinationProofUrl = proofUpload.url;
              processedRecord.vaccinationProofPublicId = proofUpload.public_id;
            }

            return processedRecord;
          })
        );
      }

      const animal = await Animal.create({
        name, type, gender, age, owner, price,
        currency: currency || "RWF",
        health: processedHealth,
        location, weight, breed,
        previousOwners: previousOwners || [],
        images: uploadedImages,
        imagesPublicIds: uploadedImagesPublicIds,
        videos: uploadedVideos,
        videosPublicIds: uploadedVideosPublicIds,
        previousOwnerName, previousOwnerPhone,
        previousOwnerAgreementPhoto: uploadedAgreementPhoto,
        previousOwnerAgreementPhotoPublicId: uploadedAgreementPhotoPublicId,
        previousOwnerIdType, previousOwnerIdNumber,
        previousOwnerIdPhoto: uploadedIdPhoto,
        previousOwnerIdPhotoPublicId: uploadedIdPhotoPublicId,
        previousOwnerGender, previousOwnerAge,
      });

      return res.status(201).json({
        status: 201,
        message: "Animal created successfully.",
        data: animal,
      });
    } catch (uploadError) {
      return res.status(500).json({
        status: 500,
        message: "File upload failed.",
        error: uploadError.message,
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Animal creation failed.",
      error: err.message,
    });
  }
};

// ─── READ ALL ─────────────────────────────────────────────────────────────────
export const getAllAnimals = async (req, res) => {
  try {
    const { type, gender, health, minPrice, maxPrice, location, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (type)     filter.type     = type;
    if (gender)   filter.gender   = gender;
    if (health)   filter.health   = health;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Animal.countDocuments(filter);
    const animals = await Animal.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: 200,
      message: "Animals fetched successfully.",
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: animals,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Failed to fetch animals.",
      error: err.message,
    });
  }
};

// ─── READ ONE ─────────────────────────────────────────────────────────────────
export const getAnimalById = async (req, res) => {
  const { id } = req.params;

  try {
    const animal = await Animal.findById(id);
    if (!animal) {
      return res.status(404).json({ status: 404, error: "Animal not found." });
    }

    return res.status(200).json({
      status: 200,
      message: "Animal fetched successfully.",
      data: animal,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Failed to fetch animal.",
      error: err.message,
    });
  }
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
export const updateAnimal = async (req, res) => {
  const { id } = req.params;

  // Strip out fields that should never be mass-updated
  const { _id, __v, createdAt, ...updates } = req.body;

  try {
    const animal = await Animal.findById(id);
    if (!animal) {
      return res.status(404).json({ status: 404, error: "Animal not found." });
    }

    // Handle file uploads to Cloudinary
    let updateData = { ...updates };

    try {
      // Handle new images upload
      if (req.files?.images && req.files.images.length > 0) {
        const imageUploads = await uploadMultipleFiles(req.files.images, "animarket/animals/images");
        updateData.images = [...(animal.images || []), ...imageUploads.map(upload => upload.url)];
        updateData.imagesPublicIds = [...(animal.imagesPublicIds || []), ...imageUploads.map(upload => upload.public_id)];
      }

      // Handle new videos upload
      if (req.files?.videos && req.files.videos.length > 0) {
        const videoUploads = await uploadMultipleFiles(req.files.videos, "animarket/animals/videos");
        updateData.videos = [...(animal.videos || []), ...videoUploads.map(upload => upload.url)];
        updateData.videosPublicIds = [...(animal.videosPublicIds || []), ...videoUploads.map(upload => upload.public_id)];
      }

      // Handle previous owner agreement photo update
      if (req.files?.previousOwnerAgreementPhoto && req.files.previousOwnerAgreementPhoto.length > 0) {
        const agreementUpload = await uploadToCloudinary(req.files.previousOwnerAgreementPhoto[0], "animarket/animals/agreements");
        updateData.previousOwnerAgreementPhoto = agreementUpload.url;
        updateData.previousOwnerAgreementPhotoPublicId = agreementUpload.public_id;
      }

      // Handle previous owner ID photo update
      if (req.files?.previousOwnerIdPhoto && req.files.previousOwnerIdPhoto.length > 0) {
        const idUpload = await uploadToCloudinary(req.files.previousOwnerIdPhoto[0], "animarket/animals/ids");
        updateData.previousOwnerIdPhoto = idUpload.url;
        updateData.previousOwnerIdPhotoPublicId = idUpload.public_id;
      }

      // Handle vaccination records updates with file uploads
      if (updates.health?.vaccinationRecords && updates.health.vaccinationRecords.length > 0) {
        updateData.health = { ...updates.health };
        updateData.health.vaccinationRecords = await Promise.all(
          updates.health.vaccinationRecords.map(async (record, index) => {
            const processedRecord = { ...record };

            // Check if there's a vaccination proof file for this record
            if (req.files?.vaccinationProofs && req.files.vaccinationProofs[index]) {
              const proofUpload = await uploadToCloudinary(
                req.files.vaccinationProofs[index],
                "animarket/animals/vaccination_proofs"
              );
              processedRecord.vaccinationProofUrl = proofUpload.url;
              processedRecord.vaccinationProofPublicId = proofUpload.public_id;
            }

            return processedRecord;
          })
        );
      }

      const updated = await Animal.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        status: 200,
        message: "Animal updated successfully.",
        data: updated,
      });
    } catch (uploadError) {
      return res.status(500).json({
        status: 500,
        message: "File upload failed during update.",
        error: uploadError.message,
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Failed to update animal.",
      error: err.message,
    });
  }
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
export const deleteAnimal = async (req, res) => {
  const { id } = req.params;

  try {
    const animal = await Animal.findById(id);
    if (!animal) {
      return res.status(404).json({ status: 404, error: "Animal not found." });
    }

    // Delete all associated media from Cloudinary
    try {
      // Delete images
      if (animal.imagesPublicIds && animal.imagesPublicIds.length > 0) {
        await Promise.all(
          animal.imagesPublicIds.map(publicId =>
            cloudinary.uploader.destroy(publicId)
          )
        );
      }

      // Delete videos
      if (animal.videosPublicIds && animal.videosPublicIds.length > 0) {
        await Promise.all(
          animal.videosPublicIds.map(publicId =>
            cloudinary.uploader.destroy(publicId, { resource_type: 'video' })
          )
        );
      }

      // Delete agreement photo
      if (animal.previousOwnerAgreementPhotoPublicId) {
        await cloudinary.uploader.destroy(animal.previousOwnerAgreementPhotoPublicId);
      }

      // Delete ID photo
      if (animal.previousOwnerIdPhotoPublicId) {
        await cloudinary.uploader.destroy(animal.previousOwnerIdPhotoPublicId);
      }

      // Delete vaccination proof files
      if (animal.health?.vaccinationRecords) {
        await Promise.all(
          animal.health.vaccinationRecords
            .filter(record => record.vaccinationProofPublicId)
            .map(record => cloudinary.uploader.destroy(record.vaccinationProofPublicId))
        );
      }
    } catch (cloudinaryError) {
      console.error("Error deleting media from Cloudinary:", cloudinaryError);
      // Continue with animal deletion even if media cleanup fails
    }

    await Animal.findByIdAndDelete(id);

    return res.status(200).json({
      status: 200,
      message: "Animal and associated media deleted successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Failed to delete animal.",
      error: err.message,
    });
  }
};

// ─── DELETE SPECIFIC MEDIA ────────────────────────────────────────────────────
export const deleteAnimalMedia = async (req, res) => {
  const { id } = req.params;
  const { mediaType, mediaIndex, vaccinationRecordIndex } = req.body;

  try {
    const animal = await Animal.findById(id);
    if (!animal) {
      return res.status(404).json({ status: 404, error: "Animal not found." });
    }

    let publicIdToDelete = null;
    let updateQuery = {};

    switch (mediaType) {
      case 'image':
        if (mediaIndex >= 0 && mediaIndex < animal.imagesPublicIds.length) {
          publicIdToDelete = animal.imagesPublicIds[mediaIndex];
          updateQuery = {
            $unset: {
              [`images.${mediaIndex}`]: 1,
              [`imagesPublicIds.${mediaIndex}`]: 1
            }
          };
          // Remove null values after unset
          await Animal.findByIdAndUpdate(id, {
            $pull: { images: null, imagesPublicIds: null }
          });
        }
        break;

      case 'video':
        if (mediaIndex >= 0 && mediaIndex < animal.videosPublicIds.length) {
          publicIdToDelete = animal.videosPublicIds[mediaIndex];
          updateQuery = {
            $unset: {
              [`videos.${mediaIndex}`]: 1,
              [`videosPublicIds.${mediaIndex}`]: 1
            }
          };
          await Animal.findByIdAndUpdate(id, {
            $pull: { videos: null, videosPublicIds: null }
          });
        }
        break;

      case 'agreementPhoto':
        publicIdToDelete = animal.previousOwnerAgreementPhotoPublicId;
        updateQuery = {
          $unset: {
            previousOwnerAgreementPhoto: 1,
            previousOwnerAgreementPhotoPublicId: 1
          }
        };
        break;

      case 'idPhoto':
        publicIdToDelete = animal.previousOwnerIdPhotoPublicId;
        updateQuery = {
          $unset: {
            previousOwnerIdPhoto: 1,
            previousOwnerIdPhotoPublicId: 1
          }
        };
        break;

      case 'vaccinationProof':
        if (vaccinationRecordIndex >= 0 &&
            animal.health?.vaccinationRecords?.[vaccinationRecordIndex]?.vaccinationProofPublicId) {
          publicIdToDelete = animal.health.vaccinationRecords[vaccinationRecordIndex].vaccinationProofPublicId;
          updateQuery = {
            $unset: {
              [`health.vaccinationRecords.${vaccinationRecordIndex}.vaccinationProofUrl`]: 1,
              [`health.vaccinationRecords.${vaccinationRecordIndex}.vaccinationProofPublicId`]: 1
            }
          };
        }
        break;

      default:
        return res.status(400).json({
          status: 400,
          error: "Invalid media type. Use: image, video, agreementPhoto, idPhoto, or vaccinationProof"
        });
    }

    if (publicIdToDelete) {
      try {
        const resourceType = mediaType === 'video' ? 'video' : 'image';
        await cloudinary.uploader.destroy(publicIdToDelete, { resource_type: resourceType });
      } catch (cloudinaryError) {
        console.error("Error deleting media from Cloudinary:", cloudinaryError);
        return res.status(500).json({
          status: 500,
          message: "Failed to delete media from cloud storage",
          error: cloudinaryError.message,
        });
      }
    }

    const updatedAnimal = await Animal.findByIdAndUpdate(id, updateQuery, { new: true });

    return res.status(200).json({
      status: 200,
      message: "Media deleted successfully.",
      data: updatedAnimal,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Failed to delete media.",
      error: err.message,
    });
  }
};
