import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/likeAndcomment.model.js";
import { Comment } from "../models/likeAndcomment.model.js"; 
import { Album } from "../models/content.album.model.js";
import { Video } from "../models/content.video.model.js";
import { Blog } from "../models/content.blog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
//Comment controllers-->
// Add a comment to any content type (album, video, blog)
const addComment = asyncHandler(async (req, res) => {
    const { contentType, contentId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(contentId)) {
        throw new ApiError(400, `Invalid ${contentType} Id`);
    }

    const ContentModel = getContentModel(contentType);
    const contentItem = await ContentModel.findById(contentId);

    if (!contentItem) {
        throw new ApiError(404, `${contentType} doesn't exist`);
    }

    const newComment = await Comment.create({
        content,
        contentId,
        contentType,
        owner: req.user?._id,
    });

    return res.status(201).json(new ApiResponse(201, "Comment added successfully", newComment));
});

// Get all comments for any content type (album, video, blog)
const getComments = asyncHandler(async (req, res) => {
    const { contentType, contentId } = req.params;

    if (!isValidObjectId(contentId)) {
        throw new ApiError(400, `Invalid ${contentType} Id`);
    }

    const comments = await Comment.find({ contentId, contentType })
        .populate("owner", "username")
        .lean();

    if (!comments.length) {
        throw new ApiError(404, `No comments found for this ${contentType}`);
    }

    return res.status(200).json(new ApiResponse(200, "Comments fetched successfully", comments));
});

// Update a comment on any content type
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment Id");
    }

    const comment = await Comment.findOneAndUpdate(
        { _id: commentId, owner: req.user?._id },
        { content },
        { new: true }
    );

    if (!comment) {
        throw new ApiError(404, "Comment not found or you don't have permission to update this comment");
    }

    return res.status(200).json(new ApiResponse(200, "Comment updated successfully", comment));
});

// Delete a comment on any content type
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment Id");
    }

    const deletedComment = await Comment.findOneAndDelete({
        _id: commentId,
        owner: req.user?._id,
    });

    if (!deletedComment) {
        throw new ApiError(404, "Comment not found or you don't have permission to delete this comment");
    }

    return res.status(200).json(new ApiResponse(200, "Comment deleted successfully", deletedComment));
});

//Like controllers-->
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
    //comments
    addComment,
    getComments,
    updateComment,
    deleteComment,
    //likes
    addLike,
    getLikes,
    removeLike,
};
