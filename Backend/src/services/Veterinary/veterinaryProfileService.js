import VeterinarianProfile from "../../models/Veterinary/veterinarianProfileModel.js";
import VeterinaryInnovation from "../../models/Veterinary/veterinaryInnovationModel.js";
import User from "../../models/users/UserModel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ===== VETERINARIAN PROFILE OPERATIONS =====

// Create veterinarian profile
export const createVeterinarianProfile = async (req, res) => {
  try {
    const {
      userId,
      licenseNumber,
      specializations,
      yearsOfExperience,
      education,
      certifications,
      languages,
      about,
      location,
      consultation,
      bankDetails,
    } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: 404,
      });
    }

    // Check if profile already exists
    const existingProfile = await VeterinarianProfile.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({
        message: "Veterinarian profile already exists for this user",
        status: 400,
      });
    }

    // Create profile
    const profile = await VeterinarianProfile.create({
      userId,
      licenseNumber,
      specializations,
      yearsOfExperience,
      education,
      certifications,
      languages,
      about,
      location,
      consultation,
      bankDetails,
      status: "active",
    });

    return res.status(201).json({
      message: "Veterinarian profile created successfully",
      status: 201,
      data: profile,
    });
  } catch (error) {
    console.error("Create veterinarian profile error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Get veterinarian profile
export const getVeterinarianProfile = async (req, res) => {
  try {
    const { vetId } = req.params;

    const profile = await VeterinarianProfile.findById(vetId).populate(
      "userId",
      "name email phone"
    );

    if (!profile) {
      return res.status(404).json({
        message: "Veterinarian profile not found",
        status: 404,
      });
    }

    return res.status(200).json({
      message: "Veterinarian profile retrieved successfully",
      status: 200,
      data: profile,
    });
  } catch (error) {
    console.error("Get veterinarian profile error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Update veterinarian profile
export const updateVeterinarianProfile = async (req, res) => {
  try {
    const { vetId } = req.params;
    const updates = req.body;

    // Prevent updating certain fields
    delete updates.userId;
    delete updates.licenseNumber;

    const profile = await VeterinarianProfile.findByIdAndUpdate(vetId, updates, {
      new: true,
      runValidators: true,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Veterinarian profile not found",
        status: 404,
      });
    }

    return res.status(200).json({
      message: "Veterinarian profile updated successfully",
      status: 200,
      data: profile,
    });
  } catch (error) {
    console.error("Update veterinarian profile error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Get top rated veterinarians
export const getTopVeterinarians = async (req, res) => {
  try {
    const { specialization, city, limit = 10 } = req.query;

    let query = { isVerified: true, status: "active" };
    if (specialization) query.specializations = specialization;
    if (city) query["location.city"] = city;

    const veterinarians = await VeterinarianProfile.find(query)
      .populate("userId", "name email phone")
      .sort({ "reputation.averageRating": -1 })
      .limit(limit * 1);

    return res.status(200).json({
      message: "Top veterinarians retrieved successfully",
      status: 200,
      count: veterinarians.length,
      data: veterinarians,
    });
  } catch (error) {
    console.error("Get top veterinarians error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// ===== INNOVATION OPERATIONS =====

// Create innovation
export const createInnovation = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      applicableAnimalTypes,
      innovatorId,
      content,
      attachments,
      caseStudies,
      tags,
    } = req.body;

    // Validate innovator
    const innovator = await User.findById(innovatorId);
    if (!innovator) {
      return res.status(404).json({
        message: "Innovator not found",
        status: 404,
      });
    }

    // Create innovation
    const innovation = await VeterinaryInnovation.create({
      title,
      description,
      category,
      applicableAnimalTypes,
      innovator: innovatorId,
      innovatorName: innovator.name,
      content,
      attachments,
      caseStudies,
      tags,
      status: "published",
    });

    return res.status(201).json({
      message: "Innovation created successfully",
      status: 201,
      data: innovation,
    });
  } catch (error) {
    console.error("Create innovation error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Get all innovations
export const getAllInnovations = async (req, res) => {
  try {
    const {
      category,
      animalType,
      featured,
      tags,
      page = 1,
      limit = 10,
    } = req.query;

    let query = { status: "published" };
    if (category) query.category = category;
    if (animalType) query.applicableAnimalTypes = animalType;
    if (featured === "true") query.featured = true;
    if (tags) query.tags = { $in: tags.split(",") };

    const innovations = await VeterinaryInnovation.find(query)
      .populate("innovator", "name email")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ featured: -1, createdAt: -1 });

    const total = await VeterinaryInnovation.countDocuments(query);

    return res.status(200).json({
      message: "Innovations retrieved successfully",
      status: 200,
      count: innovations.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: innovations,
    });
  } catch (error) {
    console.error("Get innovations error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Get single innovation
export const getInnovation = async (req, res) => {
  try {
    const { innovationId } = req.params;

    const innovation = await VeterinaryInnovation.findByIdAndUpdate(
      innovationId,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("innovator", "name email")
      .populate("relatedInnovations", "title");

    if (!innovation) {
      return res.status(404).json({
        message: "Innovation not found",
        status: 404,
      });
    }

    return res.status(200).json({
      message: "Innovation retrieved successfully",
      status: 200,
      data: innovation,
    });
  } catch (error) {
    console.error("Get innovation error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Rate innovation
export const rateInnovation = async (req, res) => {
  try {
    const { innovationId } = req.params;
    const { userId, rating, comment } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
        status: 400,
      });
    }

    const innovation = await VeterinaryInnovation.findById(innovationId);
    if (!innovation) {
      return res.status(404).json({
        message: "Innovation not found",
        status: 404,
      });
    }

    // Remove previous rating from same user if exists
    innovation.feedback = innovation.feedback.filter(
      (f) => f.userId.toString() !== userId
    );

    // Add new rating
    innovation.feedback.push({
      userId,
      rating,
      comment,
      helpful: false,
      date: new Date(),
    });

    // Recalculate average rating
    const totalRating = innovation.feedback.reduce((sum, f) => sum + f.rating, 0);
    innovation.averageRating = totalRating / innovation.feedback.length;
    innovation.totalRatings = innovation.feedback.length;

    await innovation.save();

    return res.status(200).json({
      message: "Innovation rated successfully",
      status: 200,
      data: {
        averageRating: innovation.averageRating,
        totalRatings: innovation.totalRatings,
      },
    });
  } catch (error) {
    console.error("Rate innovation error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Update innovation
export const updateInnovation = async (req, res) => {
  try {
    const { innovationId } = req.params;
    const { userId } = req.body;
    const updates = req.body;

    // Prevent updating certain fields
    delete updates.userId;
    delete updates.innovator;
    delete updates.averageRating;
    delete updates.totalRatings;

    const innovation = await VeterinaryInnovation.findById(innovationId);
    if (!innovation) {
      return res.status(404).json({
        message: "Innovation not found",
        status: 404,
      });
    }

    // Verify ownership
    if (innovation.innovator.toString() !== userId) {
      return res.status(403).json({
        message: "Unauthorized - only innovator can edit",
        status: 403,
      });
    }

    const updatedInnovation = await VeterinaryInnovation.findByIdAndUpdate(
      innovationId,
      updates,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Innovation updated successfully",
      status: 200,
      data: updatedInnovation,
    });
  } catch (error) {
    console.error("Update innovation error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

export { VeterinarianProfile, VeterinaryInnovation };