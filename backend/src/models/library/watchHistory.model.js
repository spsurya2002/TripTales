// src/models/interactions/watchHistory.model.js

import mongoose from 'mongoose';

const watchHistorySchema = new mongoose.Schema({
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Video' // Assuming you have a Video model
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Assuming you have a User model
    },
    watchedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export const WatchHistory = mongoose.model('WatchHistory', watchHistorySchema);
