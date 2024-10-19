import mongoose,{Schema} from "mongoose";

const albumSchema = new Schema({
    albumName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
      owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
  
},{timestamps:true});

export const Album = mongoose.model("Album",albumSchema);