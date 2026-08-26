import User from "../../models/users/UserModel.js";
import Booking from "../../models/Bookings/bookingModel.js";

export const verifyTrustScoreService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  let score = 0;

  // 1. Base score for having a verified account
  if (user.isVerified) score += 30;

  // 2. Profile completeness
  if (user.name) score += 5;
  if (user.email) score += 5;
  if (user.phone) score += 5;
  if (user.profile_img) score += 5;
  if (user.id_proof_img) score += 5;
  if (user.shopName) score += 5;

  // 3. Transaction history
  const completedBookings = await Booking.countDocuments({
    $or: [{ customer: userId }, { farmer: userId }],
    status: "completed",
  });
  score += Math.min(completedBookings * 5, 20);

  // 4. Account age bonus
  const accountAgeDays = (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  if (accountAgeDays > 30) score += 5;
  if (accountAgeDays > 90) score += 5;
  if (accountAgeDays > 365) score += 5;

  // 5. Role-based trust
  if (user.role === "admin") score += 10;
  if (user.role === "farmer" || user.role === "veterinary") score += 5;

  // Cap at 100
  score = Math.min(score, 100);

  let level = "Needs Improvement";
  if (score >= 80) level = "Excellent Standing";
  else if (score >= 60) level = "Good Standing";
  else if (score >= 40) level = "Fair Standing";

  return { score, level, userId: user._id, name: user.name };
};
