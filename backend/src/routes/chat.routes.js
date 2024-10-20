import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { 
    sendMessage, 
    getMessages, 
    getConversations 
   
 } from "../controllers/chat.controller.js";

 const router = Router();

 
router.route("/send").post(verifyJWT,sendMessage);
router.route("/get-messages/:otherUserId").post(verifyJWT, getMessages);
router.route("/get-conversations").post( getConversations);

export default router;