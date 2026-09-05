import * as chatService from "../../services/Chat/chatService.js";

export const getMessages = async (req, res) => {
  try {
    const { animalId } = req.params;
    const userId = req.user.id;

    const messages = await chatService.getMessagesService(animalId, userId);

    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;

    const message = await chatService.sendMessageService(userId, data);

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/chat/farmer-messages
 * Returns all conversations for the authenticated farmer, grouped by animal+customer.
 */
export const getFarmerMessages = async (req, res) => {
  try {
    const farmerId = req.user._id;
    const threads = await chatService.getFarmerMessagesService(farmerId);
    return res.status(200).json({
      success: true,
      count: threads.length,
      data: threads,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * POST /api/chat/reply
 * Farmer replies to a customer message about an animal.
 * Body: { animalId, customerId, text }
 */
export const sendReply = async (req, res) => {
  try {
    const farmerId = req.user._id;
    const message = await chatService.sendReplyService(farmerId, req.body);
    return res.status(201).json({
      success: true,
      message: "Reply sent successfully",
      data: message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
