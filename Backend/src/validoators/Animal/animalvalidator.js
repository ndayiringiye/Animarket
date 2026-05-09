import Joi from "joi";

export const animalIsVerified = Joi.object({
  name: Joi.string().min(2).max(50).required(),

  type: Joi.string()
    .valid("cow", "goat", "pig", "sheep", "chicken")
    .required(),

  gender: Joi.string()
    .valid("male", "female")
    .required(),

  owner: Joi.string().required(),

  price: Joi.number().positive().required(),

  currency: Joi.string().default("RWF"),

  location: Joi.object({
    country: Joi.string(),
    province: Joi.string(),
    district: Joi.string(),
    sector: Joi.string(),
    cell: Joi.string(),
    village: Joi.string(),
    latitude: Joi.number(),
    longitude: Joi.number()
  }).required(),

  age: Joi.number().min(0).required(),

  breed: Joi.string().allow("", null),

  weight: Joi.number().positive().required(),

  health: Joi.object({
    vaccinated: Joi.boolean(),
    vaccinationRecords: Joi.array().items(Joi.object({
      vaccineName: Joi.string(),
      date: Joi.date(),
      verifiedByVet: Joi.boolean(),
      vaccinationProof: Joi.string().valid("image", "video", "pdf", "text"),
      vaccinationProofUrl: Joi.string(),
      vaccinationProofPublicId: Joi.string(),
      extention: Joi.string().valid("png", "jpg", "jpeg", "mp4", "pdf", "text")
    })),
    diseasesHistory: Joi.array().items(Joi.string()),
    lastCheckupDate: Joi.date(),
    healthStatus: Joi.string().valid("excellent", "good", "fair", "poor")
  }).required(),

  isAvailable: Joi.boolean().default(true),

  previousOwners: Joi.array().items(Joi.string()).default([]),

  previousOwnerName: Joi.string().allow("", null),

  previousOwnerPhone: Joi.string().allow("", null),

  previousOwnerType: Joi.string().allow("", null),

  previousOwnerAgreementPhoto: Joi.string().allow("", null),

  previousOwnerIdType: Joi.string().allow("", null),

  previousOwnerIdNumber: Joi.string().allow("", null),

  previousOwnerIdPhoto: Joi.string().allow("", null),

  previousOwnerGender: Joi.string().valid("male", "female").allow(null),

  previousOwnerAge: Joi.number().min(0).allow(null),

  images: Joi.array().items(Joi.string().uri()).default([]),

  videos: Joi.array().items(Joi.string().uri()).default([])
});