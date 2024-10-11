import { WatchHistory } from "../../models/library/watchHistory.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isValidObjectId } from "mongoose";

// Add a video to watch history
const addToWatchHistory = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id");
    }

    const historyEntry = await WatchHistory.create({
        videoId,
        userId: req.user._id
    });

    return res.status(201).json(new ApiResponse(201, "Video added to watch history", historyEntry));
});

// Get watch history for the logged-in user
const getWatchHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const history = await WatchHistory.find({ userId })
        .populate("videoId", "title") // Assuming you want to show video titles
        .lean();

    return res.status(200).json(new ApiResponse(200, "Watch history fetched successfully", history));
});

// Clear the watch history for the logged-in user
const clearWatchHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    await WatchHistory.deleteMany({ userId });

    return res.status(200).json(new ApiResponse(200, "Watch history cleared successfully"));
});

// Remove a particular video from the watch history
const removeFromWatchHistory = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id");
    }

    const deletedEntry = await WatchHistory.findOneAndDelete({
        videoId,
        userId: req.user._id
    });

    if (!deletedEntry) {
        throw new ApiError(404, "Video not found in watch history");
    }

    return res.status(200).json(new ApiResponse(200, "Video removed from watch history", deletedEntry));
});

export {
    addToWatchHistory,
    getWatchHistory,
    clearWatchHistory,
    removeFromWatchHistory, 
};
