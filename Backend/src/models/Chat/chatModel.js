import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema(
  {
    animal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animal",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

ChatMessageSchema.index({ animal: 1, createdAt: -1 });
ChatMessageSchema.index({ sender: 1, receiver: 1 });

const ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema);
export default ChatMessage;
