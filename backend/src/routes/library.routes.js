import { Router } from "express";
import {
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
} from "../controllers/library.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(verifyJWT);// Middleware to verify JWT for authentication

//routes for playlist
router.route("/playlist")
    .post(createPlaylist)//create a playlist
    .get(getUserPlaylists);    // Get all playlists for the logged-in user
router.route("/playlist/:playlistId")
    .get(getPlaylistById)//get a specific playlist
    .put(updatePlaylist)// Update a specific playlist
    .delete(deletePlaylist); // Delete a specific playlist
router.route("/playlist/:playlistId/:videoId")
    .post(addVideoToPlaylist)// Add a video to a playlist
    .delete(removeVideoFromPlaylist); // Remove a video from a playlist

//routes for watch history
router.route("/watchHistory/:videoId")
    .post(addToWatchHistory)// Add a video to watch history
    .delete(removeFromWatchHistory);//remove a video from watch history
router.route("/watchHistory")
    .get(getWatchHistory)    // Get watch history for the user
    .delete(clearWatchHistory);    // Clear watch history for the user

//Routes for watch later
router.route("/watchLater/:videoId")
    .post(addToWatchLater)// add a video to Watch Later list
    .delete(removeFromWatchLater);// Remove a video from Watch Later list
router.route("/watchLater")// Get all videos in Watch Later list
    .get(getWatchLater);


export default router;
