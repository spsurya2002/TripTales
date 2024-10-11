import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../../models/interactions/comment.model.js"; // Common comment model
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



export {
    addComment,
    getComments,
    updateComment,
    deleteComment,
};
