import { Router } from "express";
import {
    addComment,
    getComments,
    updateComment,
    deleteComment,
} from "../controllers/interactions/comment.controller.js"; 
import { 
    addLike,
    getLikes, 
    removeLike
 } from "../controllers/interactions/like.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js"; // Ensure users are authenticated
const router = Router();
router.use(verifyJWT) // Apply JWT verification to all routes


//Routes for comment
router.post("/comments/:contentType/:contentId", addComment)// Add a comment to a specific content type (album, video, blog)
     .get("/comments/:contentType/:contentId", getComments);// Get all comments for a specific content type (album, video, blog)
router.put("/comments/:commentId", updateComment)// Update a comment by ID
      .delete("/comments/:commentId", deleteComment);// Delete a comment by ID
  

//Routes for likes
router.route("/likes/:contentType/:contentId")//add a like on a specific content type
    .post(addLike);
router.route("/likes/:contentType/:contentId") // Get all likes for a specific content type
    .get(getLikes);
router.route("/likes/:contentType/:contentId")
    .delete(removeLike);          // Remove a like from a specific content type

    
export default router;
