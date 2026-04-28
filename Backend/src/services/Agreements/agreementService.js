import Agreement from "../models/Agreement.js";
import Animal from "../models/Animal.js";
import mongoose from "mongoose";

// Generate unique transaction ID
const generateTransactionId = () => {
  return "TXN-" + Date.now() + "-" + Math.floor(Math.random() * 10000);
};

// Generate agreement terms dynamically
const generateTerms = (animal, buyer, seller) => {
  return `
This Agreement is made between ${seller.name} (Seller) and ${buyer.name} (Buyer).

1. The Seller agrees to sell the animal "${animal.name}" (${animal.type}, ${animal.breed}) to the Buyer.
2. The Buyer agrees to pay ${animal.price} ${animal.currency}.
3. The animal is sold in "${animal.health.healthStatus}" condition.
4. Ownership will be transferred upon successful payment.
5. This transaction is recorded digitally and is legally binding.

Location: ${animal.location?.district || "N/A"}
Date: ${new Date().toDateString()}
`;
};


export const createAgreementService = async ({
  buyerId,
  animalId,
  paymentMethod,
  deliveryDate,
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Fetch animal
    const animal = await Animal.findById(animalId)
      .populate("owner")
      .session(session);

    if (!animal) throw new Error("Animal not found");

    if (!animal.isAvailable) throw new Error("Animal is not available");

    const seller = animal.owner;

    if (seller._id.toString() === buyerId) {
      throw new Error("Buyer cannot be the seller");
    }

    // 2. Generate agreement
    const agreement = await Agreement.create(
      [
        {
          title: `Animal Purchase Agreement - ${animal.name}`,
          description: `Agreement for ${animal.type} sale`,

          buyer: buyerId,
          seller: seller._id,

          animal: {
            animalId: animal._id,
            name: animal.name,
            type: animal.type,
            breed: animal.breed,
            age: animal.age,
            healthStatus: animal.health.healthStatus,
            weight: animal.weight,
          },

          price: animal.price,
          currency: animal.currency,

          paymentMethod,
          transactionId: generateTransactionId(),

          terms: generateTerms(animal, { name: "Buyer" }, seller),

          location: `${animal.location?.district || ""}, ${
            animal.location?.country || ""
          }`,

          deliveryDate,

          createdBy: buyerId,
        },
      ],
      { session }
    );

    // 3. Lock animal (prevent double sale)
    animal.isAvailable = false;
    await animal.save({ session });

    await session.commitTransaction();
    session.endSession();

    return agreement[0];

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};