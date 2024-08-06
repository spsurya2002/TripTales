import mongoose, {Schema} from "mongoose";

const chatSchema = new Schema({
  request: { type: String, required: true }, // 'user' or 'assistant'
  response: { type: String, required: true },
  owner:{
       type:Schema.Types.ObjectId,
       ref:"User"
  },
  timestamp: { type: Date, default: Date.now }
});

export const Chat = mongoose.model("Chat",chatSchema);