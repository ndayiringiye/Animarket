import ChatMessage from "../../models/Chat/chatModel.js";
import Animal from "../../models/animals/AnimalModel.js";
import User from "../../models/users/UserModel.js";

export const getMessagesService = async (animalId, userId) => {
  // Find the animal to get the owner
  const animal = await Animal.findById(animalId);
  if (!animal) throw new Error("Animal not found");

  const messages = await ChatMessage.find({
    animal: animalId,
    $or: [
      { sender: userId, receiver: animal.owner },
      { sender: animal.owner, receiver: userId },
    ],
  })
    .populate("sender", "name email")
    .populate("receiver", "name email")
    .sort({ createdAt: 1 });

  return messages;
};

export const sendMessageService = async (userId, data) => {
  const { animalId, text } = data;

  if (!text || !text.trim()) throw new Error("Message text is required");

  const animal = await Animal.findById(animalId);
  if (!animal) throw new Error("Animal not found");

  const sender = await User.findById(userId);
  if (!sender) throw new Error("Sender not found");

  // Determine receiver - the animal owner
  const receiver = animal.owner;

  const message = await ChatMessage.create({
    animal: animalId,
    sender: userId,
    receiver,
    text: text.trim(),
  });

  // Return a simulated reply from the seller/owner
  const reply = await ChatMessage.create({
    animal: animalId,
    sender: receiver,
    receiver: userId,
    text: `Thank you for your message regarding ${animal.name}. We will get back to you shortly.`,
  });

  const populatedReply = await ChatMessage.findById(reply._id)
    .populate("sender", "name email")
    .populate("receiver", "name email");

  return populatedReply;
};
