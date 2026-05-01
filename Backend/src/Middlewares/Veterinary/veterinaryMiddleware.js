import User from "../../models/users/UserModel.js";

export const isVeterinarian = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.veterinarianId;

    if (!userId) {
      return res.status(401).json({
        message: "User ID is required",
        status: 401,
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: 404,
      });
    }

    if (user.role !== "veterinary") {
      return res.status(403).json({
        message: "Only veterinarians can access this resource",
        status: 403,
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Veterinarian account must be verified",
        status: 403,
      });
    }

    req.veterinarian = user;
    next();
  } catch (error) {
    console.error("Veterinarian verification error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

export const isVeterinarianOrOwner = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const jobId = req.params.jobId || req.params.agreementId;

    if (!userId) {
      return res.status(401).json({
        message: "User ID is required",
        status: 401,
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: 404,
      });
    }

    // Allow veterinarians or the service owner/requester to access
    if (user.role === "veterinary" || user.role === "farmer" || user.role === "seller") {
      req.user = user;
      return next();
    }

    return res.status(403).json({
      message: "You do not have permission to access this resource",
      status: 403,
    });
  } catch (error) {
    console.error("Authorization error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};
