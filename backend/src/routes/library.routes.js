import { Router } from "express";
//Routes for history
import {
    addToWatchHistory,
    getWatchHistory,
    clearWatchHistory,
    removeFromWatchHistory // Import the new method
} from "../controllers/library/watchHistory.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Middleware to verify JWT for authentication
router.use(verifyJWT);

// Add a video to watch history
router.route("/watchHistory/:videoId")
    .post(addToWatchHistory)
    //remove a video from watch history
    .delete(removeFromWatchHistory);

// Get watch history for the user
router.route("/watchHistory")
    .get(getWatchHistory)
   // Clear watch history for the user
    .delete(clearWatchHistory);

//routes for playlist
import {
    createPlaylist,
    getUserPlaylists,
    updatePlaylist,
    deletePlaylist,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
} from "../controllers/library/playlist.controller.js";

router.route("/playlist")
    .post(createPlaylist)
    // Get all playlists for the logged-in user
    .get(getUserPlaylists);

// Update a specific playlist
router.route("/playlist/:playlistId")
    .get(getPlaylistById)
    .put(updatePlaylist)
    .delete(deletePlaylist); // Delete a playlist

// Add a video to a playlist
router.route("/playlist/:playlistId/:videoId")
    .post(addVideoToPlaylist)
// Remove a video from a playlist
    .delete(removeVideoFromPlaylist); // Remove a video from a playlist

//Routes for watch later
import { 
    addToWatchLater, 
    getWatchLater, 
    removeFromWatchLater 
} from "../controllers/library/watchLater.controller.js";

router.route("/watchLater/:videoId")
    .post(addToWatchLater)
// Remove a video from Watch Later list
    .delete(removeFromWatchLater);
// Get all videos in Watch Later list
router.route("/watchLater")
    .get(getWatchLater);


export default router;
