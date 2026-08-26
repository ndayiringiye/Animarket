import Interest from "../../models/Interest/interestModel.js";
import Animal from "../../models/animals/AnimalModel.js";
import User from "../../models/users/UserModel.js";

export const createInterestRequestService = async (userId, data) => {
  const { animalId, amount, termMonths, interestRate } = data;

  // Validate animal exists
  const animal = await Animal.findById(animalId);
  if (!animal) throw new Error("Animal not found");

  // Validate user exists
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Calculate estimated interest
  const rate = interestRate || 5.5;
  const estimatedInterest = amount * (rate / 100) * (termMonths / 12);

  const interest = await Interest.create({
    animal: animalId,
    customer: userId,
    amount,
    termMonths,
    interestRate: rate,
    estimatedInterest,
    status: "pending",
  });

  return interest;
};

export const getUserInterestRequestsService = async (userId) => {
  return await Interest.find({ customer: userId })
    .populate("animal", "name type breed price images")
    .sort({ createdAt: -1 });
};
