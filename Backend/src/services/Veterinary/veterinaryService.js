import VeterinaryServiceJob from "../../models/Veterinary/veterinaryServiceJobModel.js";
import VeterinaryAgreement from "../../models/Veterinary/veterinaryAgreementModel.js";
import QRCodeTracking from "../../models/Veterinary/qrCodeTrackingModel.js";
import Animal from "../../models/animals/AnimalModel.js";
import User from "../../models/users/UserModel.js";
import QRCode from "qrcode";
import crypto from "crypto";
import { sendVeterinaryRequestNotification } from "../emails/emailService.js";

// Create Veterinary Service Job (Post a job)
export const createVeterinaryServiceJob = async (req, res) => {
  try {
    const {
      title,
      description,
      serviceType,
      animalId,
      requesterId,
      requesterRole,
      location,
      estimatedCost,
      serviceDate,
      estimatedDuration,
      notes,
    } = req.body;

    // Check if animal exists
    const animal = await Animal.findById(animalId);
    if (!animal) {
      return res.status(404).json({
        message: "Animal not found",
        status: 404,
      });
    }

    // Check if animal is vaccinated (if requesting vaccination service)
    if (serviceType === "vaccination" && animal.health.vaccinated) {
      return res.status(400).json({
        message: "This animal is already vaccinated",
        status: 400,
      });
    }

    // Check if requester exists
    const requester = await User.findById(requesterId);
    if (!requester) {
      return res.status(404).json({
        message: "Requester not found",
        status: 404,
      });
    }

    // Create service job
    const serviceJob = await VeterinaryServiceJob.create({
      title,
      description,
      serviceType,
      animal: animalId,
      animalName: animal.name,
      animalType: animal.type,
      animalHealth: animal.health.healthStatus,
      animalImage: animal.images?.[0],
      animalLocation: animal.location,
      requester: requesterId,
      requesterRole,
      location,
      estimatedCost,
      serviceDate,
      estimatedDuration,
      notes,
      status: "posted",
    });

    const admins = await User.find({ role: "admin" }).select("email");
    const adminEmails = admins.map((admin) => admin.email).filter(Boolean);
    if (adminEmails.length > 0) {
      try {
        await Promise.all(adminEmails.map((email) => sendVeterinaryRequestNotification({
          email,
          customerName: requester.name,
          customerPhone: requester.phone,
          animalName: animal.name,
          animalLocation: animal.location,
          animalImage: animal.images?.[0],
          preferredDate: serviceDate,
          notes,
        })));
      } catch (error) {
        console.error("Veterinary request notification failed:", error.message);
      }
    }

    return res.status(201).json({
      message: "Veterinary service job posted successfully",
      status: 201,
      data: serviceJob,
    });
  } catch (error) {
    console.error("Create veterinary service job error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Get all service jobs
export const getAllServiceJobs = async (req, res) => {
  try {
    const { status, serviceType, animalId, veterinarianId } = req.query;
    const { page = 1, limit = 10 } = req.query;

    let query = {};
    if (status) query.status = status;
    if (serviceType) query.serviceType = serviceType;
    if (animalId) query.animal = animalId;
    if (veterinarianId) query.assignedVeterinarian = veterinarianId;

    const jobs = await VeterinaryServiceJob.find(query)
      .populate("animal", "name type breed images location")
      .populate("requester", "name email phone")
      .populate("assignedVeterinarian", "name email")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await VeterinaryServiceJob.countDocuments(query);

    return res.status(200).json({
      message: "Service jobs retrieved successfully",
      status: 200,
      count: jobs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: jobs,
    });
  } catch (error) {
    console.error("Get service jobs error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Accept Veterinary Service Job
export const acceptVeterinaryJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { veterinarianId, veterinarianName, finalCost } = req.body;

    const serviceJob = await VeterinaryServiceJob.findById(jobId);
    if (!serviceJob) {
      return res.status(404).json({
        message: "Service job not found",
        status: 404,
      });
    }

    if (serviceJob.status !== "posted") {
      return res.status(400).json({
        message: "Only posted jobs can be accepted",
        status: 400,
      });
    }

    const veterinarian = await User.findById(veterinarianId);
    if (!veterinarian || veterinarian.role !== "veterinary") {
      return res.status(404).json({
        message: "Veterinarian not found",
        status: 404,
      });
    }

    const updatedJob = await VeterinaryServiceJob.findByIdAndUpdate(
      jobId,
      {
        assignedVeterinarian: veterinarianId,
        veterinarianName: veterinarianName || veterinarian.name,
        veterinarianEmail: veterinarian.email,
        finalCost: finalCost || serviceJob.estimatedCost,
        status: "accepted",
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Service job accepted successfully",
      status: 200,
      data: updatedJob,
    });
  } catch (error) {
    console.error("Accept service job error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Complete Service Job
export const completeVeterinaryJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { completionDate, veterinarianNotes, finalCost } = req.body;

    const serviceJob = await VeterinaryServiceJob.findById(jobId);
    if (!serviceJob) {
      return res.status(404).json({
        message: "Service job not found",
        status: 404,
      });
    }

    if (serviceJob.status !== "accepted" && serviceJob.status !== "in_progress") {
      return res.status(400).json({
        message: "Only accepted or in-progress jobs can be completed",
        status: 400,
      });
    }

    const updatedJob = await VeterinaryServiceJob.findByIdAndUpdate(
      jobId,
      {
        status: "completed",
        completionDate: completionDate || new Date(),
        veterinarianNotes,
        finalCost: finalCost || serviceJob.finalCost,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Service job completed successfully",
      status: 200,
      data: updatedJob,
    });
  } catch (error) {
    console.error("Complete service job error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Create Veterinary Agreement
export const createVeterinaryAgreement = async (req, res) => {
  try {
    const {
      title,
      description,
      serviceJobId,
      veterinarianId,
      veterinarianName,
      veterinarianLicense,
      clientId,
      clientName,
      clientRole,
      animalId,
      animalName,
      animalType,
      serviceType,
      diagnosis,
      treatmentPlan,
      serviceCost,
      paymentMethod,
      followUpRequired,
      followUpDate,
    } = req.body;

    // Verify service job exists
    const serviceJob = await VeterinaryServiceJob.findById(serviceJobId);
    if (!serviceJob) {
      return res.status(404).json({
        message: "Service job not found",
        status: 404,
      });
    }

    // Verify veterinarian and client exist
    const veterinarian = await User.findById(veterinarianId);
    const client = await User.findById(clientId);

    if (!veterinarian || !client) {
      return res.status(404).json({
        message: "Veterinarian or client not found",
        status: 404,
      });
    }

    const agreement = await VeterinaryAgreement.create({
      title,
      description,
      serviceJob: serviceJobId,
      veterinarian: veterinarianId,
      veterinarianName: veterinarianName || veterinarian.name,
      veterinarianLicense,
      client: clientId,
      clientName: clientName || client.name,
      clientRole,
      animal: animalId,
      animalName,
      animalType,
      serviceType,
      diagnosis,
      treatmentPlan,
      serviceCost,
      "paymentTerms.paymentMethod": paymentMethod,
      followUpRequired,
      followUpDate,
      status: "draft",
      createdBy: veterinarianId,
    });

    return res.status(201).json({
      message: "Veterinary agreement created successfully",
      status: 201,
      data: agreement,
    });
  } catch (error) {
    console.error("Create veterinary agreement error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Sign Agreement
export const signAgreement = async (req, res) => {
  try {
    const { agreementId } = req.params;
    const { signature, userId } = req.body;

    const agreement = await VeterinaryAgreement.findById(agreementId);
    if (!agreement) {
      return res.status(404).json({
        message: "Agreement not found",
        status: 404,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: 404,
      });
    }

    // Check if user is a party to the agreement
    const isVeterinarian = agreement.veterinarian.toString() === userId;
    const isClient = agreement.client.toString() === userId;

    if (!isVeterinarian && !isClient) {
      return res.status(403).json({
        message: "User is not a party to this agreement",
        status: 403,
      });
    }

    if (isVeterinarian) {
      agreement.signatures.veterinarianSignature = signature;
      agreement.signatures.veterinarianSignedAt = new Date();
    } else {
      agreement.signatures.clientSignature = signature;
      agreement.signatures.clientSignedAt = new Date();
    }

    // Check if both have signed
    if (agreement.signatures.veterinarianSignature && agreement.signatures.clientSignature) {
      agreement.status = "signed";
    } else if (agreement.status === "draft") {
      agreement.status = "pending_signature";
    }

    await agreement.save();

    return res.status(200).json({
      message: "Agreement signed successfully",
      status: 200,
      data: agreement,
    });
  } catch (error) {
    console.error("Sign agreement error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Record Payment
export const recordPayment = async (req, res) => {
  try {
    const { agreementId } = req.params;
    const { amount, paymentMethod, transactionId } = req.body;

    const agreement = await VeterinaryAgreement.findById(agreementId);
    if (!agreement) {
      return res.status(404).json({
        message: "Agreement not found",
        status: 404,
      });
    }

    const newPaidAmount = (agreement.paymentTerms.paidAmount || 0) + amount;

    // Add to payment history
    agreement.paymentHistory.push({
      amount,
      paymentMethod,
      paymentDate: new Date(),
      transactionId,
    });

    // Update payment status
    agreement.paymentTerms.paidAmount = newPaidAmount;

    if (newPaidAmount >= agreement.serviceCost) {
      agreement.paymentStatus = "paid";
      agreement.status = "active";
    } else if (newPaidAmount > 0) {
      agreement.paymentStatus = "partial";
    }

    await agreement.save();

    return res.status(200).json({
      message: "Payment recorded successfully",
      status: 200,
      data: agreement,
    });
  } catch (error) {
    console.error("Record payment error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Record Vaccination
export const recordVaccination = async (req, res) => {
  try {
    const { agreementId } = req.params;
    const { vaccineName, vaccineBatch, vaccinationDate, nextVaccinationDate } = req.body;

    const agreement = await VeterinaryAgreement.findById(agreementId)
      .populate("animal");

    if (!agreement) {
      return res.status(404).json({
        message: "Agreement not found",
        status: 404,
      });
    }

    // Update agreement with vaccination details
    agreement.vaccinationDetails = {
      vaccineName,
      vaccineBatch,
      vaccinationDate,
      nextVaccinationDate,
    };

    // Update animal vaccination records
    if (agreement.animal) {
      agreement.animal.health.vaccinated = true;
      agreement.animal.health.vaccinationRecords.push({
        vaccineName,
        date: vaccinationDate,
        verifiedByVet: true,
      });
      await agreement.animal.save();
    }

    agreement.status = "active";
    await agreement.save();

    return res.status(200).json({
      message: "Vaccination recorded successfully",
      status: 200,
      data: agreement,
    });
  } catch (error) {
    console.error("Record vaccination error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Generate QR Code for Agreement
export const generateQRCode = async (req, res) => {
  try {
    const { agreementId } = req.params;

    const agreement = await VeterinaryAgreement.findById(agreementId)
      .populate("veterinarian", "name email")
      .populate("client", "name email")
      .populate("animal", "name type breed");

    if (!agreement) {
      return res.status(404).json({
        message: "Agreement not found",
        status: 404,
      });
    }

    // Generate unique QR code data
    const qrCodeData = crypto.randomBytes(32).toString("hex");

    // Create QR code
    const qrCodeUrl = await QRCode.toDataURL(qrCodeData);

    // Save QR code tracking information
    const qrTracking = await QRCodeTracking.create({
      qrCodeData,
      qrCodeUrl,
      veterinaryAgreement: agreementId,
      serviceJob: agreement.serviceJob,
      serviceType: agreement.serviceType,
      serviceName: agreement.title,
      serviceDate: agreement.serviceJob ? new Date() : null,
      veterinarian: agreement.veterinarian._id,
      veterinarianName: agreement.veterinarian.name,
      veterinarianEmail: agreement.veterinarian.email,
      veterinarianLicense: agreement.veterinarianLicense,
      client: agreement.client._id,
      clientName: agreement.client.name,
      clientRole: agreement.clientRole,
      animal: agreement.animal._id,
      animalName: agreement.animal.name,
      animalType: agreement.animal.type,
      breed: agreement.animal.breed,
      serviceProof: {
        vaccinationDetails: agreement.vaccinationDetails,
        healthStatus: agreement.healthCertificate?.healthStatus,
        treatmentDetails: agreement.treatmentPlan,
        medications: agreement.medications.map((m) => m.medicationName),
      },
      isActive: true,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    });

    // Update agreement with QR code
    agreement.qrCode = {
      qrCodeData,
      qrCodeUrl,
      qrCodeGeneratedAt: new Date(),
    };
    await agreement.save();

    return res.status(200).json({
      message: "QR code generated successfully",
      status: 200,
      data: {
        qrCode: qrCodeUrl,
        qrCodeData,
        qrTracking,
      },
    });
  } catch (error) {
    console.error("Generate QR code error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Scan QR Code and Get Service Information
export const scanQRCode = async (req, res) => {
  try {
    const { qrCodeData, userId } = req.body;

    const qrTracking = await QRCodeTracking.findOne({
      qrCodeData,
      isActive: true,
    })
      .populate("veterinarian", "name email")
      .populate("client", "name email")
      .populate("animal", "name type breed");

    if (!qrTracking) {
      return res.status(404).json({
        message: "QR code not found or expired",
        status: 404,
      });
    }

    // Check expiry
    if (qrTracking.expiryDate && new Date() > qrTracking.expiryDate) {
      qrTracking.isActive = false;
      await qrTracking.save();

      return res.status(400).json({
        message: "QR code has expired",
        status: 400,
      });
    }

    // Increment scan count
    qrTracking.scanCount += 1;
    qrTracking.lastScannedAt = new Date();

    // Log scan history if userId provided
    if (userId) {
      qrTracking.scanHistory.push({
        scannedAt: new Date(),
        scannedBy: userId,
      });
    }

    await qrTracking.save();

    return res.status(200).json({
      message: "QR code scanned successfully",
      status: 200,
      data: qrTracking,
    });
  } catch (error) {
    console.error("Scan QR code error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Get Veterinarian Service History
export const getVeterinarianServiceHistory = async (req, res) => {
  try {
    const { veterinarianId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    let query = { veterinarian: veterinarianId };
    if (status) query.status = status;

    const agreements = await VeterinaryAgreement.find(query)
      .populate("client", "name email phone role")
      .populate("animal", "name type breed")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await VeterinaryAgreement.countDocuments(query);

    return res.status(200).json({
      message: "Service history retrieved successfully",
      status: 200,
      count: agreements.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: agreements,
    });
  } catch (error) {
    console.error("Get veterinarian service history error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};
