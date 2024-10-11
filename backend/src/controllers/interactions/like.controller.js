// src/controllers/interactions/like.controller.js

import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../../models/interactions/like.model.js";
import { Album } from "../../models/content/album.model.js";
import { Video } from "../../models/content/video.model.js";
import { Blog } from "../../models/content/blog.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// Helper function to get the content model based on the type
const getContentModel = (contentType) => {
    switch (contentType) {
        case "album":
            return Album;
        case "video":
            return Video;
        case "blog":
            return Blog;
        default:
            throw new ApiError(400, "Invalid content type");
    }
};

// Add a like to any content type (album, video, blog)
const addLike = asyncHandler(async (req, res) => {
    const { contentType, contentId } = req.params;
    
    if (!isValidObjectId(contentId)) {
        throw new ApiError(400, `Invalid ${contentType} Id`);
    }

    
    const ContentModel = getContentModel(contentType);
    console.log("--->"+contentType,contentId,ContentModel);
    const contentItem = await ContentModel.findById(contentId);
    
    if (!contentItem) {
        throw new ApiError(404, `${contentType} doesn't exist`);
    }
    
    const existingLike = await Like.findOne({
        contentId,
        contentType,
        owner: req.user?._id,
    });

    if (existingLike) {
        throw new ApiError(400, "You have already liked this content");
    }

    const newLike = await Like.create({
        contentId,
        contentType,
        owner: req.user?._id,
    });

    return res.status(201).json(new ApiResponse(201, "Like added successfully", newLike));
});

// Get all likes for a specific content type
const getLikes = asyncHandler(async (req, res) => {
    const { contentType, contentId } = req.params;

    if (!isValidObjectId(contentId)) {
        throw new ApiError(400, `Invalid ${contentType} Id`);
    }

    const likes = await Like.find({ contentId, contentType }).populate("owner", "username").lean();

    return res.status(200).json(new ApiResponse(200, "Likes fetched successfully", likes));
});

// Remove a like from any content type
const removeLike = asyncHandler(async (req, res) => {
    const { contentType, contentId } = req.params;

    if (!isValidObjectId(contentId)) {
        throw new ApiError(400, `Invalid ${contentType} Id`);
    }

    const deletedLike = await Like.findOneAndDelete({
        contentId,
        contentType,
        owner: req.user?._id,
    });

    if (!deletedLike) {
        throw new ApiError(404, "Like not found or you don't have permission to remove this like");
    }

    return res.status(200).json(new ApiResponse(200, "Like removed successfully", deletedLike));
});

export {
    addLike,
    getLikes,
    removeLike,
};
