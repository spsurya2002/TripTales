import mongoose, { isValidObjectId } from "mongoose";
import { watchLater } from "../../models/watchLater.model.js";
import { Video } from "../../models/video.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// Add a video to watch later
const addVideoToWatchLater = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video doesn't exist");
    }

    const updatedWatchLater = await watchLater.findOneAndUpdate(
        { owner: req.user?._id },
        {
            $addToSet: { videos: videoId }
        },
        { new: true, upsert: true }
    )
    .populate('videos');
   

    if (!updatedWatchLater) {
        throw new ApiError(400, "Something went wrong while adding video to watch later");
    }

    return res.status(200).json(new ApiResponse(200, "Video added to Watch Later successfully", updatedWatchLater));
});

// Get all videos in watch later
const getWatchLaterVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user Id");
    }

    const watchLaterVideos = await watchLater.findOne({ owner: userId })
        .populate('videos')
        .lean();

    if (!watchLaterVideos) {
        throw new ApiError(404, "No Watch Later list found for this user");
    }

    return res.status(200).json(new ApiResponse(200, "Watch Later videos fetched successfully", watchLaterVideos));
});

// Remove a video from watch later
const removeVideoFromWatchLater = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id");
    }

    const updatedWatchLater = await watchLater.findOneAndUpdate(
        { owner: req.user?._id },
        {
            $pull: { videos: videoId }
        },
        { new: true }
    ).populate('videos');

    if (!updatedWatchLater) {
        throw new ApiError(400, "Something went wrong while removing video from Watch Later");
    }

    return res.status(200).json(new ApiResponse(200, "Video removed from Watch Later successfully", updatedWatchLater));
});




export {
    addVideoToWatchLater,
    getWatchLaterVideos,
    removeVideoFromWatchLater
};
