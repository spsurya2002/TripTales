import mongoose, {Schema} from "mongoose";

const watchLaterSchema = new Schema({
       videos: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
}, {timestamps: true})



export const watchLater = mongoose.model("watchLater", watchLaterSchema)