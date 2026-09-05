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

  // Receiver is the animal owner (farmer)
  const receiver = animal.owner;

  const message = await ChatMessage.create({
    animal: animalId,
    sender: userId,
    receiver,
    text: text.trim(),
  });

  const populatedMessage = await ChatMessage.findById(message._id)
    .populate("sender", "name email")
    .populate("receiver", "name email");

  return populatedMessage;
};

/**
 * getFarmerMessagesService
 * Returns all messages received by this farmer, grouped by animal + customer.
 * Each group contains: animal info, customer info, and message thread.
 */
export const getFarmerMessagesService = async (farmerId) => {
  // Find all animals owned by this farmer
  const farmerAnimals = await Animal.find({ owner: farmerId }).select("_id name type images");
  if (!farmerAnimals.length) return [];

  const animalIds = farmerAnimals.map((a) => a._id);

  // Fetch all messages in those animal threads involving the farmer
  const messages = await ChatMessage.find({
    animal: { $in: animalIds },
    $or: [{ receiver: farmerId }, { sender: farmerId }],
  })
    .populate("sender", "name email _id")
    .populate("receiver", "name email _id")
    .populate("animal", "name type images")
    .sort({ createdAt: 1 });

  // Group by animalId + customerId (the non-farmer party)
  const threads = {};
  for (const msg of messages) {
    const animalId = msg.animal?._id?.toString() || msg.animal?.toString();
    const customerId =
      msg.sender?._id?.toString() === farmerId.toString()
        ? msg.receiver?._id?.toString()
        : msg.sender?._id?.toString();

    const key = `${animalId}__${customerId}`;
    if (!threads[key]) {
      threads[key] = {
        animalId,
        animalName: msg.animal?.name || "Animal",
        animalType: msg.animal?.type || "",
        animalImage: msg.animal?.images?.[0] || null,
        customerId,
        customerName:
          msg.sender?._id?.toString() !== farmerId.toString()
            ? msg.sender?.name
            : msg.receiver?.name,
        customerEmail:
          msg.sender?._id?.toString() !== farmerId.toString()
            ? msg.sender?.email
            : msg.receiver?.email,
        messages: [],
      };
    }
    threads[key].messages.push({
      _id: msg._id,
      text: msg.text,
      senderId: msg.sender?._id?.toString(),
      senderName: msg.sender?.name,
      createdAt: msg.createdAt,
      isMine: msg.sender?._id?.toString() === farmerId.toString(),
    });
  }

  return Object.values(threads);
};

/**
 * sendReplyService
 * Farmer sends a reply to a specific customer about a specific animal.
 */
export const sendReplyService = async (farmerId, data) => {
  const { animalId, customerId, text } = data;

  if (!text || !text.trim()) throw new Error("Reply text is required");
  if (!animalId) throw new Error("animalId is required");
  if (!customerId) throw new Error("customerId is required");

  const animal = await Animal.findById(animalId);
  if (!animal) throw new Error("Animal not found");

  // Verify this farmer owns the animal
  if (animal.owner.toString() !== farmerId.toString()) {
    throw new Error("You are not the owner of this animal");
  }

  const message = await ChatMessage.create({
    animal: animalId,
    sender: farmerId,
    receiver: customerId,
    text: text.trim(),
  });

  const populated = await ChatMessage.findById(message._id)
    .populate("sender", "name email")
    .populate("receiver", "name email");

  return populated;
};
