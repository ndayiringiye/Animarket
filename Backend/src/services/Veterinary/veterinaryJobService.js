import VeterinaryJobPosting from "../../models/Veterinary/veterinaryJobPostingModel.js";
import VeterinarianApplication from "../../models/Veterinary/veterinarianApplicationModel.js";
import VeterinarianProfile from "../../models/Veterinary/veterinarianProfileModel.js";
import VeterinaryInnovation from "../../models/Veterinary/veterinaryInnovationModel.js";
import User from "../../models/users/UserModel.js";
import QRCode from "qrcode";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {
  uploadToCloudinary,
  uploadMultipleFiles,
} from "../upload/mediaService.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ===== JOB POSTING OPERATIONS =====

// Create curing job posting — admin only
export const createJobPosting = async (req, res) => {
  try {
    // Read authenticated user from verifyToken middleware
    const adminId   = req.user?.id || req.user?._id;
    const adminRole = req.user?.role;

    // Only admin may post curing jobs
    if (adminRole !== "admin") {
      return res.status(403).json({
        message: "Only admins can post animal curing jobs",
        status: 403,
      });
    }

    const {
      title,
      description,
      jobType,
      animal,          // ObjectId of the animal that needs curing
      animalType,      // type shortcut (cow, goat, …)
      criteria,        // { requiredCertifications, requiredTools, minExperienceWithAnimalType, urgencyLevel }
      location,
      salary,
      requiredQualifications,
      specializations,
      experienceYearsRequired,
      responsibilities,
      benefits,
      hotelId,
      applicationDeadline,
      numberOfPositions,
    } = req.body;

    // Validate required fields
    if (!title || !description || !applicationDeadline) {
      return res.status(400).json({
        message: "title, description, and applicationDeadline are required",
        status: 400,
      });
    }

    // Create job posting
    const rawJob = await VeterinaryJobPosting.create({
      title,
      description,
      jobType,
      animal:    animal    || null,
      animalType: animalType || null,
      criteria:  criteria  || {},
      location,
      salary,
      requiredQualifications,
      specializations,
      experienceYearsRequired,
      responsibilities,
      benefits,
      postedBy:     adminId,
      postedByRole: "admin",
      hotelId,
      applicationDeadline,
      numberOfPositions,
      status: "open",
    });

    // Re-fetch with animal details (owner, address, images) for the response
    const jobPosting = await VeterinaryJobPosting.findById(rawJob._id)
      .populate("postedBy", "name email phone")
      .populate({
        path: "animal",
        select: "name type breed images location owner",
        populate: { path: "owner", select: "name email phone shopName shopAddress" },
      });

    return res.status(201).json({
      message: "Animal curing job posted successfully",
      status: 201,
      data: jobPosting,
    });
  } catch (error) {
    console.error("Create job posting error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Get all job postings
export const getAllJobPostings = async (req, res) => {
  try {
    const {
      status = "open",
      specialization,
      city,
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};
    if (status) query.status = status;
    if (specialization) query.specializations = specialization;
    if (city) query["location.city"] = city;

    const jobPostings = await VeterinaryJobPosting.find(query)
      .populate("postedBy", "name email phone")
      .populate("hotelId", "hotelName")
      .populate({
        path: "animal",
        select: "name type breed images location owner",
        populate: { path: "owner", select: "name email phone shopName shopAddress" },
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await VeterinaryJobPosting.countDocuments(query);

    return res.status(200).json({
      message: "Job postings retrieved successfully",
      status: 200,
      count: jobPostings.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: jobPostings,
    });
  } catch (error) {
    console.error("Get job postings error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Get single job posting
export const getJobPosting = async (req, res) => {
  try {
    const { jobId } = req.params;

    const jobPosting = await VeterinaryJobPosting.findByIdAndUpdate(
      jobId,
      { $inc: { views: 1 } },
      { new: true },
    )
      .populate("postedBy", "name email phone")
      .populate("hotelId", "hotelName city")
      .populate("selectedApplicants", "name email")
      .populate({
        path: "animal",
        select: "name type breed images location owner",
        populate: { path: "owner", select: "name email phone shopName shopAddress" },
      });

    if (!jobPosting) {
      return res.status(404).json({
        message: "Job posting not found",
        status: 404,
      });
    }

    return res.status(200).json({
      message: "Job posting retrieved successfully",
      status: 200,
      data: jobPosting,
    });
  } catch (error) {
    console.error("Get job posting error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Update job posting (only by poster)
export const updateJobPosting = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { userId } = req.body;
    const updates = req.body;

    // Prevent updating certain fields
    delete updates.userId;
    delete updates.postedBy;
    delete updates.applicationCount;

    const jobPosting = await VeterinaryJobPosting.findById(jobId);
    if (!jobPosting) {
      return res.status(404).json({
        message: "Job posting not found",
        status: 404,
      });
    }

    // Verify ownership
    if (jobPosting.postedBy.toString() !== userId) {
      return res.status(403).json({
        message: "Unauthorized - only job poster can edit",
        status: 403,
      });
    }

    const updatedJobPosting = await VeterinaryJobPosting.findByIdAndUpdate(
      jobId,
      updates,
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      message: "Job posting updated successfully",
      status: 200,
      data: updatedJobPosting,
    });
  } catch (error) {
    console.error("Update job posting error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// ===== APPLICATION OPERATIONS =====

// Submit application
export const submitApplication = async (req, res) => {
  try {
    const { jobPostingId, applicantId, coverLetter, qualifications } = req.body;

    // Handle file uploads
    const resumeFile = req.files?.resume?.[0];
    const certificationFiles = req.files?.certifications || [];
    let resume = null;
    let certifications = [];

    // Upload resume if provided
    if (resumeFile) {
      const uploadedResume = await uploadToCloudinary(
        resumeFile,
        `animarket/veterinarians/${applicantId}/resume`,
      );
      resume = {
        url: uploadedResume.url,
        publicId: uploadedResume.public_id,
      };
    }

    // Upload certifications if provided
    if (certificationFiles.length > 0) {
      const uploadedCerts = await uploadMultipleFiles(
        certificationFiles,
        `animarket/veterinarians/${applicantId}/certifications`,
      );
      certifications = uploadedCerts.map((cert) => ({
        name: cert.original_filename || "Certificate",
        certificateUrl: cert.url,
        publicId: cert.public_id,
      }));
    }

    // Verify job posting exists
    const jobPosting = await VeterinaryJobPosting.findById(jobPostingId);
    if (!jobPosting) {
      return res.status(404).json({
        message: "Job posting not found",
        status: 404,
      });
    }

    // Check if already applied
    const existingApplication = await VeterinarianApplication.findOne({
      jobPostingId,
      applicantId,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this position",
        status: 400,
      });
    }

    // Get applicant info
    const applicant = await User.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({
        message: "Applicant not found",
        status: 404,
      });
    }

    // Create application
    const application = await VeterinarianApplication.create({
      jobPostingId,
      applicantId,
      applicantEmail: applicant.email,
      applicantPhone: applicant.phone,
      coverLetter,
      resume,
      certifications,
      qualifications,
      status: "submitted",
    });

    // Update job posting application count
    await VeterinaryJobPosting.findByIdAndUpdate(jobPostingId, {
      $inc: { applicationCount: 1 },
    });

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: applicant.email,
      subject: "🏥 Application Submitted - Veterinary Job",
      html: `
        <h2>Application Confirmed</h2>
        <p>Dear ${applicant.name},</p>
        <p><strong>Position:</strong> ${jobPosting.title}</p>
        <p>Your application has been submitted successfully.</p>
        <p>We will review your application and contact you soon if you are selected for an interview.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: "Application submitted successfully",
      status: 201,
      data: application,
    });
  } catch (error) {
    console.error("Submit application error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Get applications for job posting
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    let query = { jobPostingId: jobId };
    if (status) query.status = status;

    const applications = await VeterinarianApplication.find(query)
      .populate("applicantId", "name email phone")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ appliedDate: -1 });

    const total = await VeterinarianApplication.countDocuments(query);

    return res.status(200).json({
      message: "Applications retrieved successfully",
      status: 200,
      count: applications.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: applications,
    });
  } catch (error) {
    console.error("Get applications error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Evaluate application
export const evaluateApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { evaluationScore, evaluationNotes, selectedForRole, evaluatorId } =
      req.body;

    const application = await VeterinarianApplication.findByIdAndUpdate(
      applicationId,
      {
        evaluationScore,
        evaluationNotes,
        selectedForRole,
        evaluatedBy: evaluatorId,
        evaluationDate: new Date(),
        status: selectedForRole ? "shortlisted" : "under_review",
      },
      { new: true },
    ).populate("applicantId");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        status: 404,
      });
    }

    // Send evaluation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: application.applicantEmail,
      subject: selectedForRole
        ? "🎉 Shortlisted for Interview"
        : "📋 Application Update",
      html: `
        <h2>${selectedForRole ? "Congratulations!" : "Application Update"}</h2>
        <p>Dear ${application.applicantId.name},</p>
        <p>${
          selectedForRole
            ? "We are pleased to inform you that you have been shortlisted for this position. We will contact you soon with interview details."
            : "Thank you for your interest. We will keep your application on file."
        }</p>
        ${evaluationNotes ? `<p><strong>Notes:</strong> ${evaluationNotes}</p>` : ""}
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Application evaluated successfully",
      status: 200,
      data: application,
    });
  } catch (error) {
    console.error("Evaluate application error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Accept selected veterinarian
export const acceptSelectedVeterinarian = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { jobId } = req.body;

    const application = await VeterinarianApplication.findByIdAndUpdate(
      applicationId,
      {
        acceptanceStatus: "accepted",
        acceptanceDate: new Date(),
        status: "accepted",
      },
      { new: true },
    )
      .populate("applicantId")
      .populate("jobPostingId");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        status: 404,
      });
    }

    // Add to selected applicants in job posting
    await VeterinaryJobPosting.findByIdAndUpdate(jobId, {
      $addToSet: { selectedApplicants: application.applicantId._id },
    });

    // Send acceptance email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: application.applicantEmail,
      subject: "✅ Congratulations - Position Accepted",
      html: `
        <h2>Welcome to the Team!</h2>
        <p>Dear ${application.applicantId.name},</p>
        <p>We are delighted to offer you the position of <strong>${application.jobPostingId.title}</strong>.</p>
        <p>Please reply to this email to confirm your acceptance and discuss next steps.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Veterinarian accepted successfully",
      status: 200,
      data: application,
    });
  } catch (error) {
    console.error("Accept veterinarian error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// ===== GET JOBS BY ANIMAL (for veterinarians) =====

// Returns all curing job postings linked to a specific animal.
// Veterinarians call this to discover work they can apply for.
export const getJobsByAnimal = async (req, res) => {
  try {
    const { animalId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { animal: animalId };
    if (status) query.status = status;

    const jobs = await VeterinaryJobPosting.find(query)
      .populate("animal",   "name type breed health location")
      .populate("postedBy", "name email phone")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await VeterinaryJobPosting.countDocuments(query);

    return res.status(200).json({
      message: "Curing jobs for animal retrieved successfully",
      status: 200,
      count: jobs.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: jobs,
    });
  } catch (error) {
    console.error("Get jobs by animal error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

export { VeterinaryJobPosting, VeterinarianApplication };
