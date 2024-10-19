import { Playlist } from "../models/library.playlist.model.js";
import { WatchHistory } from "../models/library.watchHistory.model.js";
import { watchLater } from "../models/library.watchLater.model.js";
import { Video } from "../models/content.video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValidObjectId } from "mongoose";

//Controllers for custom playlist-->

// Create a new playlist
const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        throw new ApiError(400, "Playlist name and description are required");
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id,
    });

    return res.status(201).json(new ApiResponse(201, "Playlist created successfully", playlist));
});
// Add a video to a playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { videoId } = req.params;

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist or video Id");
    }
    const video =  await Video.findById(videoId);
    if(!video){
        throw new ApiError(400, "Video does not exist!!");
    }

    const playlist = await Playlist.findOneAndUpdate(
        { _id: playlistId, owner: req.user._id },
        { $addToSet: { videos: videoId } }, // Use $addToSet to avoid duplicates
        { new: true }
    );

    if (!playlist) {
        throw new ApiError(404, "Playlist not found or you don't have permission to add video to this playlist");
    }

    return res.status(200).json(new ApiResponse(200, "Video added to playlist successfully", playlist));
});
// Get all playlists for the logged-in user
const getUserPlaylists = asyncHandler(async (req, res) => {
    const playlists = await Playlist.find({ owner: req.user._id })
        .populate("videos", "title") // Assuming you want to show video titles
        .lean();

    return res.status(200).json(new ApiResponse(200, "Playlists fetched successfully", playlists));
});

// Update a specific playlist
const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist Id");
    }

    const playlist = await Playlist.findOneAndUpdate(
        { _id: playlistId, owner: req.user._id },
        { name, description },
        { new: true }
    );

    if (!playlist) {
        throw new ApiError(404, "Playlist not found or you don't have permission to update this playlist");
    }

    return res.status(200).json(new ApiResponse(200, "Playlist updated successfully", playlist));
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist Id");
    }

    const playlist = await Playlist.findById(playlistId)
        .populate("videos", "title description") // Populating video details
        .populate("owner", "username") // Populating owner (user) details
        .lean();

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(new ApiResponse(200, "Playlist fetched successfully", playlist));
});

// Delete a specific playlist
const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist Id");
    }

    const deletedPlaylist = await Playlist.findOneAndDelete({
        _id: playlistId,
        owner: req.user._id,
    });

    if (!deletedPlaylist) {
        throw new ApiError(404, "Playlist not found or you don't have permission to delete this playlist");
    }

    return res.status(200).json(new ApiResponse(200, "Playlist deleted successfully", deletedPlaylist));
});

// Remove a video from a playlist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { videoId } = req.params;

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist or video Id");
    }

    const playlist = await Playlist.findOneAndUpdate(
        { _id: playlistId, owner: req.user._id },
        { $pull: { videos: videoId } }, // Use $pull to remove the video
        { new: true }
    );

    if (!playlist) {
        throw new ApiError(404, "Playlist not found or you don't have permission to remove video from this playlist");
    }

    return res.status(200).json(new ApiResponse(200, "Video removed from playlist successfully", playlist));
});


//Controllers for watch history-->

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

//controllers for watch later-->

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
    //custom playlist
    createPlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    updatePlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    //watch history
    addToWatchHistory,
    getWatchHistory,
    clearWatchHistory,
    removeFromWatchHistory,     
    //watch later
    addToWatchLater,
    getWatchLater,
    removeFromWatchLater 
};






// import mongoose, {isValidObjectId} from "mongoose"
// import {Playlist} from "../../models/playlist.model.js"
// import {ApiError} from "../../utils/ApiError.js"
// import {ApiResponse} from "../../utils/ApiResponse.js"
// import {asyncHandler} from "../../utils/asyncHandler.js"
// import { Video } from "../../models/video.model.js"


// const createPlaylist = asyncHandler(async (req, res) => {
//     const {name, description} = req.body

//     if(!name || !description){
//         throw new ApiError(400, "All fields are required")
//     }

//     const createdPlaylist = await Playlist.create({
//         name,
//         description,
//         owner: req.user?._id
//     })

//     if(!createdPlaylist){
//         throw new ApiError(400, "Something went wrong while creating a playlist")
//     }

//     return res.status(200)
//     .json(new ApiResponse(200, "Playlist created successfully", createdPlaylist))
// })

// const getUserPlaylists = asyncHandler(async (req, res) => {
//     const {userId} = req.params
    
//     if(!isValidObjectId(userId)){
//         throw new ApiError(400, "Invalid user Id")
//     }

//     const userPlaylist = await Playlist.aggregate([
//         {
//             $match: {
//                 owner: new mongoose.Types.ObjectId(userId)
//             }
//         },
//         {
//             $lookup: {
//                 from: "videos",
//                 localField: "videos",
//                 foreignField: "_id",
//                 as: "videos"
//             }
//         },
//         {
//             $addFields: {
//                 videoCount: {
//                     $size: "$videos"
//                 },
//                 videos: {
//                     $first: "$videos"
//                 }
//             }
//         },
//         {
//             $project: {
//                 _id: 1,
//                 name: 1,
//                 description: 1,
//                 videos: {
//                     _id: 1,
//                     thumbnail: 1,
//                 },
//                 videoCount: 1,
//                 updatedAt: 1,
//                 createdAt: 1
//             }
//         }
//     ])

//     return res.status(200)
//     .json(new ApiResponse(200, "Users playlist fetched successfully", userPlaylist))
// })

// const getPlaylistById = asyncHandler(async (req, res) => {
//     const {playlistId} = req.params
    
//     if(!isValidObjectId(playlistId)){
//         throw new ApiError(400, "Invalid playlist Id")
//     }

//     const playlist = await Playlist.findById(playlistId)

//     if(!playlist){
//         throw new ApiError(400, "Playlist doesn't exist")
//     }

//     const playlists = await Playlist.aggregate([
//         {
//             $match: {
//                 _id: new mongoose.Types.ObjectId(playlistId)
//             }
//         },
//         {
//             $lookup: {
//                 from: "videos",
//                 localField: "videos",
//                 foreignField: "_id",
//                 as: "videos"
//             }
//         },
//         {
//             $lookup: {
//                 from: "users",
//                 localField: "owner",
//                 foreignField: "_id",
//                 as: "owner"
//             }
//         },
//         {
//             $addFields: {
//                 videoCount: {
//                     $size: "$videos"
//                 },
//                 viewsCount: {
//                     $sum: "$videos.views"
//                 },
//                 owner: {
//                     $first: "$owner"
//                 }
//             }
//         },
//         {
//             $project: {
//                 _id: 1,
//                 name: 1,
//                 description: 1,
//                 owner: {
//                     username: 1,
//                     fullname: 1,
//                     avatar: 1,
//                 },
//                 videos: {
//                     _id: 1,
//                     videoFile: 1,
//                     thumbnail: 1,
//                     title: 1,
//                     description: 1,
//                     duration: 1,
//                     createdAt: 1,
//                     views: 1
//                 },
//                 videoCount: 1,
//                 viewsCount: 1,
//                 createdAt: 1,
//                 updatedAt: 1
//             }
//         }
//     ])

//     return res.status(200)
//     .json(new ApiResponse(200, "Playlist videos fetched successfully", playlists))
// })

// const addVideoToPlaylist = asyncHandler(async (req, res) => {
//     const {playlistId, videoId} = req.params

//     if(!isValidObjectId(playlistId)){
//         throw new ApiError(400, "Invalid playlist Id")
//     }

//     if(!isValidObjectId(videoId)){
//         throw new ApiError(400, "Invalid video Id")
//     }

//     const playlist = await Playlist.findById(playlistId)

//     if(!playlist){
//         throw new ApiError(400, "Playlist doesn't exist")
//     }

//     const video = await Video.findById(videoId)

//     if(!video){
//         throw new ApiError(400, "video doesn't exist")
//     }

//     if((playlist?.owner.toString()) != req.user?._id){
//         throw new ApiError(400, "only owner can add videos to a playlist")
//     }

//     const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId,
//         {
//             $addToSet: {
//                 videos: videoId
//             }
//         },
//         {new: true}    
//     )

//     if(!updatedPlaylist){
//         throw new ApiError(400, "Something went wrong while adding video to a playlist")
//     }

//     return res.status(200)
//     .json(new ApiResponse(200, "Video added to Playlist successfully", updatedPlaylist))
// })

// const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
//     const {playlistId, videoId} = req.params

//     if(!isValidObjectId(playlistId)){
//         throw new ApiError(400, "Invalid playlist Id")
//     }

//     if(!isValidObjectId(videoId)){
//         throw new ApiError(400, "Invalid video Id")
//     }

//     const playlist = await Playlist.findById(playlistId)

//     if(!playlist){
//         throw new ApiError(400, "Playlist doesn't exist")
//     }

//     const video = await Video.findById(videoId)

//     if(!video){
//         throw new ApiError(400, "video doesn't exist")
//     }

//     if((playlist?.owner.toString()) != req.user?._id){
//         throw new ApiError(400, "only owner can remove videos from a playlist")
//     }

//     const deletedPlaylist = await Playlist.findByIdAndUpdate(playlistId,
//         {
//             $pull: {
//                 videos: videoId
//             }
//         },
//         {new: true}    
//     )

//     if(!deletedPlaylist){
//         throw new ApiError(400, "Something went wrong while removing video to a playlist")
//     }

//     return res.status(200)
//     .json(new ApiResponse(200, "Video removed from Playlist successfully", deletedPlaylist))
// })

// const deletePlaylist = asyncHandler(async (req, res) => {
//     const {playlistId} = req.params

//     if(!isValidObjectId(playlistId)){
//         throw new ApiError(400, "Invalid playlist Id")
//     }

//     const playlist = await Playlist.findById(playlistId)
    
//     if(!playlist){
//         throw new ApiError(400, "Playlist doesn't exist")
//     }
    
//     if(playlist?.owner.toString() != req.user?._id){
//         throw new ApiError(400, "only owner can delete playlist")
//     }

//     const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)

//     if(!deletedPlaylist){
//         throw new ApiError(400, "Something went wrong while deleting a playlist")
//     }

//     return res.status(200)
//     .json(new ApiResponse(200, "Playlist deleted successfully", deletedPlaylist))
// })

// const updatePlaylist = asyncHandler(async (req, res) => {
//     const {playlistId} = req.params
//     const {name, description} = req.body

//     if(!isValidObjectId(playlistId)){
//         throw new ApiError(400, "Invalid playlist Id")
//     }

//     if(!(name && description)){
//         throw new ApiError(400, "Provide field to be updated")
//     }
    
//     const playlist = await Playlist.findById(playlistId)
    
//     if(!playlist){
//         throw new ApiError(400, "Playlist doesn't exist")
//     }
    
//     if(playlist?.owner.toString() != req.user?._id){
//         throw new ApiError(400, "only owner can edit playlist")
//     }

//     const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId,
//         {
//             $set: {
//                 name, 
//                 description
//             }
//         },
//         {new: true}
//     )

//     if(!updatedPlaylist){
//         throw new ApiError(400, "Something went wrong while updating a playlist")
//     }

//     return res.status(200)
//     .json(new ApiResponse(200, "Playlist updated successfully", updatedPlaylist))
// })

// export {
//     createPlaylist,
//     getUserPlaylists,
//     getPlaylistById,
//     addVideoToPlaylist,
//     removeVideoFromPlaylist,
//     deletePlaylist,
//     updatePlaylist
// }



// // import mongoose, {isValidObjectId} from "mongoose"
// // import {Playlist} from "../models/playlist.model.js"
// // import {ApiError} from "../utils/ApiError.js"
// // import {ApiResponse} from "../utils/ApiResponse.js"
// // import {asyncHandler} from "../utils/asyncHandler.js"


// // const createPlaylist = asyncHandler(async (req, res) => {
// //     const {name, description} = req.body

// //     //TODO: create playlist
// // })

// // const getUserPlaylists = asyncHandler(async (req, res) => {
// //     const {userId} = req.params
// //     //TODO: get user playlists
// // })

// // const getPlaylistById = asyncHandler(async (req, res) => {
// //     const {playlistId} = req.params
// //     //TODO: get playlist by id
// // })

// // const addVideoToPlaylist = asyncHandler(async (req, res) => {
// //     const {playlistId, videoId} = req.params
// // })

// // const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
// //     const {playlistId, videoId} = req.params
// //     // TODO: remove video from playlist

// // })

// // const deletePlaylist = asyncHandler(async (req, res) => {
// //     const {playlistId} = req.params
// //     // TODO: delete playlist
// // })

// // const updatePlaylist = asyncHandler(async (req, res) => {
// //     const {playlistId} = req.params
// //     const {name, description} = req.body
// //     //TODO: update playlist
// // })

// // export {
// //     createPlaylist,
// //     getUserPlaylists,
// //     getPlaylistById,
// //     addVideoToPlaylist,
// //     removeVideoFromPlaylist,
// //     deletePlaylist,
// //     updatePlaylist
// // }

