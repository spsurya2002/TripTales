import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    contentType: {
        type: String,
        enum: ['album', 'video', 'blog'],
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    },
    
});

export const Comment = mongoose.model("Comment", commentSchema);
