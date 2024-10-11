// src/models/interactions/like.model.js

import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'contentType' // This will reference either albums, videos, or blogs
    },
    contentType: {
        type: String,
        enum: ['album', 'video', 'blog'],
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Assuming you have a User model
    }
}, { timestamps: true });

export const Like = mongoose.model('Like', likeSchema);
