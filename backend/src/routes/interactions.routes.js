//Routes for comment
import { Router } from "express";
import {
    addComment,
    getComments,
    updateComment,
    deleteComment,
} from "../controllers/interactions/comment.controller.js"; // Adjust the path as necessary
import { verifyJWT } from "../middlewares/auth.middleware.js"; // Ensure users are authenticated

const router = Router();
router.use(verifyJWT) // Apply JWT verification to all routes

// Add a comment to a specific content type (album, video, blog)
router.post("/comments/:contentType/:contentId", addComment)
      // Get all comments for a specific content type (album, video, blog)
      .get("/comments/:contentType/:contentId", getComments);

       // Update a comment by ID
router.put("/comments/:commentId", updateComment)
       // Delete a comment by ID
      .delete("/comments/:commentId", deleteComment);
      // Remove all comments made by the authenticated user


//Routes for likes
import { 
    addLike,
    getLikes, 
    removeLike
 } from "../controllers/interactions/like.controller.js";

router.route("/likes/:contentType/:contentId")
    .post(addLike);

// Get all likes for a specific content type
router.route("/likes/:contentType/:contentId")
    .get(getLikes);

// Remove a like from a specific content type
router.route("/likes/:contentType/:contentId")
    .delete(removeLike);

    
export default router;
