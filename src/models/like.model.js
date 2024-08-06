import mongoose,{Schema} from "mongoose";

const likesSchema= new Schema({
   
    comment:{
        type:String,
        required:true,
    },
    video:{
        type:Schema.Types.ObjectId,//one to who being subscribed
        ref:"Video"
    },
    likedBy:{
        type:Schema.Types.ObjectId,//one to who being subscribed
        ref:"User"
    },
 
},{timestamps:true});

export const Like = mongoose.model("Like",likesSchema);