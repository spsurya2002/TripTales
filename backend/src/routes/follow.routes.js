import { Router } from "express";
import { 
    followUser, 
    unfollowUser, 
    getUserFollowers, 
    getUserFollowing } from "../controllers/follow.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.post('/:userId', verifyJWT, followUser)// Follow a user
      .delete('/:userId', verifyJWT, unfollowUser);// Unfollow a user
router.get('/:userId/followers', verifyJWT, getUserFollowers)// Get a user's followers
      .get('/:userId/following', verifyJWT, getUserFollowing);// Get the users a user is following

export default router;
