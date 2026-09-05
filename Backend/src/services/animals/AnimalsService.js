import Animal from "../../models/animals/AnimalModel.js";
import User from "../../models/users/UserModel.js";
import { animalIsVerified } from "../../validoators/Animal/animalvalidator.js";
import { uploadToCloudinary, uploadMultipleFiles } from "../upload/mediaService.js";
import cloudinary from "../../config/cloudinary.js";

const safeUploadMultipleFiles = async (files, folder) => {
  try {
    return await uploadMultipleFiles(files, folder);
  } catch (error) {
    console.error(`Media upload failed for ${folder}:`, error.message);
    return [];
  }
};

const safeUploadToCloudinary = async (file, folder) => {
  try {
    return await uploadToCloudinary(file, folder);
  } catch (error) {
    console.error(`Single upload failed for ${folder}:`, error.message);
    return null;
  }
};

export const createAnimal = async (req) => {
  let {
    name, type, gender, age, owner, price, currency,
    health, location, weight, breed, previousOwners,
    previousOwnerName, previousOwnerPhone,
    previousOwnerType, previousOwnerIdNumber,
    previousOwnerGender, previousOwnerAge,
  } = req.body;

  console.log('Original req.body.location:', typeof req.body.location, req.body.location);
  console.log('Original req.body.health:', typeof req.body.health, req.body.health);

  // Parse JSON strings
  if (typeof health === 'string') health = JSON.parse(health);
  if (typeof location === 'string') location = JSON.parse(location);
  if (typeof previousOwners === 'string') {
    try {
      previousOwners = JSON.parse(previousOwners);
      // If parsed as array of strings, set to empty array since model expects objects
      if (Array.isArray(previousOwners) && previousOwners.length > 0 && typeof previousOwners[0] === 'string') {
        previousOwners = [];
      }
    } catch (parseError) {
      previousOwners = [];
    }
  }

  console.log('Parsed location:', typeof location, location);
  console.log('Parsed health:', typeof health, health);

  // Parse numbers
  age = parseInt(age, 10);
  price = parseFloat(price);
  weight = parseFloat(weight);

  // Update req.body with parsed values for validation
  req.body.health = health;
  req.body.location = location;
  req.body.previousOwners = previousOwners;
  req.body.age = age;
  req.body.price = price;
  req.body.weight = weight;

  console.log('Updated req.body.location:', typeof req.body.location, req.body.location);
  console.log('Updated req.body.health:', typeof req.body.health, req.body.health);

  if (!name || !type || !gender || !age || !owner || !price || !currency || !location || !health || !weight) {
    throw new Error("All required animal details must be provided.");
  }

  const { error } = animalIsVerified.validate(req.body);
  if (error) {
    throw new Error(error.details[0].message);
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

  // Upload images
  if (req.files?.image && req.files.image.length > 0) {
    const imageUploads = await safeUploadMultipleFiles(req.files.image, "animarket/animals/images");
    uploadedImages = imageUploads.map(upload => upload.url);
    uploadedImagesPublicIds = imageUploads.map(upload => upload.public_id);
  }

  // Upload videos
  if (req.files?.video && req.files.video.length > 0) {
    const videoUploads = await safeUploadMultipleFiles(req.files.video, "animarket/animals/videos");
    uploadedVideos = videoUploads.map(upload => upload.url);
    uploadedVideosPublicIds = videoUploads.map(upload => upload.public_id);
  }

  // Upload previous owner agreement photo
  if (req.files?.previousOwnerAgreement && req.files.previousOwnerAgreement.length > 0) {
    const agreementUpload = await safeUploadToCloudinary(req.files.previousOwnerAgreement[0], "animarket/animals/agreements");
    if (agreementUpload) {
      uploadedAgreementPhoto = agreementUpload.url;
      uploadedAgreementPhotoPublicId = agreementUpload.public_id;
    }
  }

  // Upload previous owner ID photo
  if (req.files?.previousOwnerIdPhoto && req.files.previousOwnerIdPhoto.length > 0) {
    const idUpload = await safeUploadToCloudinary(req.files.previousOwnerIdPhoto[0], "animarket/animals/ids");
    if (idUpload) {
      uploadedIdPhoto = idUpload.url;
      uploadedIdPhotoPublicId = idUpload.public_id;
    }
  }

  // Handle vaccination records with file uploads
  let processedHealth = { ...health };
  if (health.vaccinationRecords && health.vaccinationRecords.length > 0) {
    processedHealth.vaccinationRecords = await Promise.all(
      health.vaccinationRecords.map(async (record, index) => {
        const processedRecord = { ...record };

        // Check if there's a vaccination proof file for this record
        if (req.files?.vaccinationProofs && req.files.vaccinationProofs[index]) {
          const proofUpload = await safeUploadToCloudinary(
            req.files.vaccinationProofs[index],
            "animarket/animals/vaccination_proofs"
          );
          if (proofUpload) {
            processedRecord.vaccinationProofUrl = proofUpload.url;
            processedRecord.vaccinationProofPublicId = proofUpload.public_id;
          }
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
    previousOwnerIdType: previousOwnerType,
    previousOwnerIdNumber,
    previousOwnerIdPhoto: uploadedIdPhoto,
    previousOwnerIdPhotoPublicId: uploadedIdPhotoPublicId,
    previousOwnerGender, previousOwnerAge,
  });

  return animal;
};

// ─── READ ALL ─────────────────────────────────────────────────────────────────
export const getAllAnimals = async (query) => {
  const { type, gender, health, minPrice, maxPrice, location, owned, page = 1, limit = 20 } = query;

  const filter = {};
  if (type)     filter.type     = type;
  if (gender)   filter.gender   = gender;
  if (health)   filter.health   = health;
  if (location) filter.location = { $regex: location, $options: "i" };
  if (owned === "true") {
    filter.owner = { $in: await User.distinct("_id") };
  }
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

  return {
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: animals,
  };
};

// ─── READ ONE ─────────────────────────────────────────────────────────────────
export const getAnimalById = async (id) => {
  const animal = await Animal.findById(id);
  if (!animal) {
    throw new Error("Animal not found.");
  }

  return animal;
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
export const updateAnimal = async (id, req) => {
  // Strip out fields that should never be mass-updated
  let { _id, __v, createdAt, ...updates } = req.body;

  // Parse JSON strings
  if (typeof updates.health === 'string') updates.health = JSON.parse(updates.health);
  if (typeof updates.location === 'string') updates.location = JSON.parse(updates.location);
  if (typeof updates.previousOwners === 'string') updates.previousOwners = [updates.previousOwners];

  const animal = await Animal.findById(id);
  if (!animal) {
    throw new Error("Animal not found.");
  }

  // Handle file uploads to Cloudinary
  let updateData = { ...updates };

  // Handle new images upload
  if (req.files?.image && req.files.image.length > 0) {
    const imageUploads = await uploadMultipleFiles(req.files.image, "animarket/animals/images");
    updateData.images = [...(animal.images || []), ...imageUploads.map(upload => upload.url)];
    updateData.imagesPublicIds = [...(animal.imagesPublicIds || []), ...imageUploads.map(upload => upload.public_id)];
  }

  // Handle new videos upload
  if (req.files?.video && req.files.video.length > 0) {
    const videoUploads = await uploadMultipleFiles(req.files.video, "animarket/animals/videos");
    updateData.videos = [...(animal.videos || []), ...videoUploads.map(upload => upload.url)];
    updateData.videosPublicIds = [...(animal.videosPublicIds || []), ...videoUploads.map(upload => upload.public_id)];
  }

  // Handle previous owner agreement photo update
  if (req.files?.previousOwnerAgreement && req.files.previousOwnerAgreement.length > 0) {
    const agreementUpload = await uploadToCloudinary(req.files.previousOwnerAgreement[0], "animarket/animals/agreements");
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

  return updated;
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
export const deleteAnimal = async (id) => {
  const animal = await Animal.findById(id);
  if (!animal) {
    throw new Error("Animal not found.");
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
