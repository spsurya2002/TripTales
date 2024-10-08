import mongoose, { Schema } from "mongoose";

const historySchema = new Schema({
    videos: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });

export const History = mongoose.model("History", historySchema);
