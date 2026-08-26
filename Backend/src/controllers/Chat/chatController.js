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

    const reply = await chatService.sendMessageService(userId, data);

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: {
        sent: true,
        reply,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
