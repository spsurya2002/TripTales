import mongoose, { isValidObjectId } from "mongoose";
import { History } from "../../models/library/history.model.js";
import { Video } from "../../models/content/video.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// Add a video to history
const addVideoToHistory = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video doesn't exist");
    }

    const updatedHistory = await History.findOneAndUpdate(
        { owner: req.user?._id },
        {
            $addToSet: { videos: videoId }
        },
        { new: true, upsert: true }
    ).populate('videos');

    if (!updatedHistory) {
        throw new ApiError(400, "Something went wrong while adding video to history");
    }

    return res.status(200).json(new ApiResponse(200, "Video added to History successfully", updatedHistory));
});

// Get all videos in history
const getHistoryVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user Id");
    }

    const historyVideos = await History.findOne({ owner: userId })
        .populate('videos')
        .lean();

    if (!historyVideos) {
        throw new ApiError(404, "No history found for this user");
    }

    return res.status(200).json(new ApiResponse(200, "History videos fetched successfully", historyVideos));
});

// Remove a video from history
const removeVideoFromHistory = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id");
    }

    const updatedHistory = await History.findOneAndUpdate(
        { owner: req.user?._id },
        {
            $pull: { videos: videoId }
        },
        { new: true }
    ).populate('videos');

    if (!updatedHistory) {
        throw new ApiError(400, "Something went wrong while removing video from history");
    }

    return res.status(200).json(new ApiResponse(200, "Video removed from History successfully", updatedHistory));
});

// Delete history
const deleteHistory = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user Id");
    }

    const deletedHistory = await History.findOneAndDelete({ owner: userId });

    if (!deletedHistory) {
        throw new ApiError(400, "Something went wrong while deleting history");
    }

    return res.status(200).json(new ApiResponse(200, "History deleted successfully", deletedHistory));
});

export {
    addVideoToHistory,
    getHistoryVideos,
    removeVideoFromHistory,
    deleteHistory
};
