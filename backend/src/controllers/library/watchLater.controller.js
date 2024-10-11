// src/controllers/content/watchLater.controller.js
import { watchLater } from "../../models/library/watchLater.model.js";
import { Video } from "../../models/content/video.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isValidObjectId } from "mongoose";

// Add a video to the Watch Later list
const addToWatchLater = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    let userWatchLater = await watchLater.findOne({ owner: userId });

    if (!userWatchLater) {
        userWatchLater = new watchLater({ owner: userId, videos: [] });
    }

    // Check if the video is already in the Watch Later list
    if (userWatchLater.videos.includes(videoId)) {
        throw new ApiError(400, "Video already in Watch Later list");
    }

    userWatchLater.videos.push(videoId);
    await userWatchLater.save();

    return res.status(201).json(new ApiResponse(201, "Video added to Watch Later", userWatchLater));
});

// Get all videos in the Watch Later list for the current user
const getWatchLater = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const userWatchLater = await watchLater.findOne({ owner: userId })
        .populate("videos", "title description")
        .lean();

    if (!userWatchLater || userWatchLater.videos.length === 0) {
        throw new ApiError(404, "No videos found in Watch Later list");
    }

    return res.status(200).json(new ApiResponse(200, "Watch Later list fetched successfully", userWatchLater.videos));
});

// Remove a video from the Watch Later list
const removeFromWatchLater = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id");
    }

    const userWatchLater = await watchLater.findOne({ owner: userId });

    if (!userWatchLater || !userWatchLater.videos.includes(videoId)) {
        throw new ApiError(404, "Video not found in Watch Later list");
    }

    // Remove the video from the Watch Later list
    userWatchLater.videos = userWatchLater.videos.filter((id) => id.toString() !== videoId);
    await userWatchLater.save();

    return res.status(200).json(new ApiResponse(200, "Video removed from Watch Later", userWatchLater));
});

export {
    addToWatchLater,
    getWatchLater,
    removeFromWatchLater
};
