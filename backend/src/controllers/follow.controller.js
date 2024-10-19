import mongoose, { isValidObjectId } from "mongoose";
import { Follower } from "../models/follow.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Follow a user
const followUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user Id");
    }

    const userToFollow = await User.findById(userId);

    if (!userToFollow) {
        throw new ApiError(404, "User doesn't exist");
    }

    const existingFollow = await Follower.findOne({
        follower: req.user?._id,
        following: userId,
    });

    if (existingFollow) {
        throw new ApiError(400, "You are already following this user");
    }

    const newFollow = await Follower.create({
        follower: req.user?._id,
        following: userId,
    });

    return res.status(201).json(new ApiResponse(201, "User followed successfully", newFollow));
});

// Unfollow a user
const unfollowUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user Id");
    }

    const removedFollow = await Follower.findOneAndDelete({
        follower: req.user?._id,
        following: userId,
    });

    if (!removedFollow) {
        throw new ApiError(400, "You are not following this user");
    }

    return res.status(200).json(new ApiResponse(200, "User unfollowed successfully", removedFollow));
});

// Get followers for a user
const getUserFollowers = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user Id");
    }

    const followers = await Follower.find({ following: userId })
        .populate('follower', 'username')
        .lean();

    if (!followers.length) {
        throw new ApiError(404, "No followers found for this user");
    }

    return res.status(200).json(new ApiResponse(200, "Followers fetched successfully", followers));
});

// Get following users for a user
const getUserFollowing = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user Id");
    }

    const following = await Follower.find({ follower: userId })
        .populate('following', 'username')
        .lean();

    if (!following.length) {
        throw new ApiError(404, "No following users found for this user");
    }

    return res.status(200).json(new ApiResponse(200, "Following users fetched successfully", following));
});


export {
    followUser,
    unfollowUser,
    getUserFollowers,
    getUserFollowing,
};
