import mongoose, { isValidObjectId } from "mongoose";
import { LikeAlbum } from "../../models/interactions/like.model.js";
import { Album } from "../../models/content/album.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// Like an album
const likeAlbum = asyncHandler(async (req, res) => {
    const { albumId } = req.params;

    if (!isValidObjectId(albumId)) {
        throw new ApiError(400, "Invalid album Id");
    }

    const album = await Album.findById(albumId);

    if (!album) {
        throw new ApiError(404, "Album doesn't exist");
    }

    const existingLike = await LikeAlbum.findOne({
        album: albumId,
        likedBy: req.user?._id
    });

    if (existingLike) {
        throw new ApiError(400, "Album is already liked");
    }

    const newLike = await LikeAlbum.create({
        album: albumId,
        likedBy: req.user?._id
    });

    return res.status(201).json(new ApiResponse(201, "Album liked successfully", newLike));
});

// Get all liked albums
const getLikedAlbums = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user Id");
    }

    const likedAlbums = await LikeAlbum.find({ likedBy: userId })
        .populate('album')
        .lean();

    if (!likedAlbums.length) {
        throw new ApiError(404, "No liked albums found for this user");
    }

    return res.status(200).json(new ApiResponse(200, "Liked albums fetched successfully", likedAlbums));
});

// Unlike an album
const unlikeAlbum = asyncHandler(async (req, res) => {
    const { albumId } = req.params;

    if (!isValidObjectId(albumId)) {
        throw new ApiError(400, "Invalid album Id");
    }

    const removedLike = await LikeAlbum.findOneAndDelete({
        album: albumId,
        likedBy: req.user?._id
    });

    if (!removedLike) {
        throw new ApiError(400, "Something went wrong while unliking the album");
    }

    return res.status(200).json(new ApiResponse(200, "Album unliked successfully", removedLike));
});

// Remove all album likes by user
const removeAllAlbumLikes = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user Id");
    }

    const removedLikes = await LikeAlbum.deleteMany({ likedBy: userId });

    if (removedLikes.deletedCount === 0) {
        throw new ApiError(400, "Something went wrong while removing all album likes");
    }

    return res.status(200).json(new ApiResponse(200, "All album likes removed successfully"));
});

export {
    likeAlbum,
    getLikedAlbums,
    unlikeAlbum,
    removeAllAlbumLikes
};
