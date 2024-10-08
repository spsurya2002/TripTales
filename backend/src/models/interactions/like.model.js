import mongoose,{Schema} from "mongoose";

const likesAlbumSchema= new Schema({
    album:{
        type:Schema.Types.ObjectId,//one to who being subscribed
        ref:"Album"
    },
    likedBy:{
        type:Schema.Types.ObjectId,//one to who being subscribed
        ref:"User"
    },
 
},{timestamps:true});

export const LikeAlbum = mongoose.model("LikeAlbum",likesAlbumSchema);