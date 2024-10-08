import mongoose,{Schema} from "mongoose";

const blogSchema = new Schema({
    blogTitle:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type: {
            url: String,
            public_id: String,
        },
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
},{timestamps:true});

export const Blog = mongoose.model("Blog",blogSchema);