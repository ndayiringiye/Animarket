import Joi from "joi";

export const createVeterinaryServiceJobSchema = Joi.object({
  title: Joi.string().required().max(150),
  description: Joi.string().max(500),
  serviceType: Joi.string()
    .enum(["vaccination", "checkup", "treatment", "consultation", "emergency", "follow_up", "surgery", "health_certificate"])
    .required(),
  animalId: Joi.string().required(),
  requesterId: Joi.string().required(),
  requesterRole: Joi.string().enum(["farmer", "seller", "customer"]).required(),
  location: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    latitude: Joi.number(),
    longitude: Joi.number(),
  }),
  estimatedCost: Joi.number().required().min(0),
  serviceDate: Joi.date().required(),
  estimatedDuration: Joi.string(),
  notes: Joi.string().max(1000),
});

export const acceptVeterinaryJobSchema = Joi.object({
  veterinarianId: Joi.string().required(),
  veterinarianName: Joi.string().required(),
  finalCost: Joi.number().min(0),
});

export const completeVeterinaryJobSchema = Joi.object({
  completionDate: Joi.date().required(),
  veterinarianNotes: Joi.string().required().max(1000),
  finalCost: Joi.number().min(0),
});

export const createVeterinaryAgreementSchema = Joi.object({
  title: Joi.string().required().max(150),
  description: Joi.string().max(500),
  serviceJobId: Joi.string().required(),
  veterinarianId: Joi.string().required(),
  veterinarianName: Joi.string().required(),
  veterinarianLicense: Joi.string(),
  clientId: Joi.string().required(),
  clientName: Joi.string().required(),
  clientRole: Joi.string().enum(["farmer", "seller", "customer"]).required(),
  animalId: Joi.string().required(),
  animalName: Joi.string(),
  animalType: Joi.string(),
  serviceType: Joi.string()
    .enum(["vaccination", "checkup", "treatment", "consultation", "emergency", "follow_up", "surgery", "health_certificate"])
    .required(),
  diagnosis: Joi.string().max(1000),
  treatmentPlan: Joi.string().max(1000),
  serviceCost: Joi.number().required().min(0),
  paymentMethod: Joi.string().enum(["bank_transfer", "mobile_money", "cash", "card"]).required(),
  followUpRequired: Joi.boolean(),
  followUpDate: Joi.date(),
});

export const signAgreementSchema = Joi.object({
  agreementId: Joi.string().required(),
  signature: Joi.string().required(),
  userId: Joi.string().required(),
});

export const recordPaymentSchema = Joi.object({
  agreementId: Joi.string().required(),
  amount: Joi.number().required().min(0),
  paymentMethod: Joi.string()
    .enum(["bank_transfer", "mobile_money", "cash", "card"])
    .required(),
  transactionId: Joi.string(),
});

export const recordVaccinationSchema = Joi.object({
  agreementId: Joi.string().required(),
  vaccineName: Joi.string().required(),
  vaccineBatch: Joi.string(),
  vaccinationDate: Joi.date().required(),
  nextVaccinationDate: Joi.date(),
});

export const updateHealthStatusSchema = Joi.object({
  agreementId: Joi.string().required(),
  healthStatus: Joi.string()
    .enum(["healthy", "treated", "monitored", "requires_care"])
    .required(),
  notes: Joi.string().max(1000),
});
