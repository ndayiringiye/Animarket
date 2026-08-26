import connectDb from "../src/config/db.js";
import Animal from "../src/models/animals/AnimalModel.js";
import User from "../src/models/users/UserModel.js";
import dotenv from "dotenv";
dotenv.config();

const animalId = process.argv[2];
if (!animalId) {
  console.error("Usage: node scripts/checkOwner.mjs <animalId>");
  process.exit(1);
}

(async () => {
  try {
    await connectDb();
    const animal = await Animal.findById(animalId).lean();
    console.log("Animal:", animal ? { _id: animal._id, name: animal.name, owner: animal.owner } : null);
    if (!animal) {
      console.error("Animal not found");
      process.exit(1);
    }
    const ownerId = animal.owner;
    if (!ownerId) {
      console.error("Owner not set on animal");
      process.exit(1);
    }
    const owner = await User.findById(ownerId).lean();
    console.log("Owner:", owner ? { _id: owner._id, name: owner.name, email: owner.email } : null);
    if (!owner) {
      console.error("Owner user not found for id", ownerId);
      process.exit(1);
    }
    console.log("Owner exists and is valid.");
    process.exit(0);
  } catch (err) {
    console.error("Error checking owner:", err);
    process.exit(1);
  }
})();
