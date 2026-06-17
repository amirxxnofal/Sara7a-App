import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            maxLength: 500,
        },
        receiverId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

export const messageModel = mongoose.model("Message", messageSchema);
