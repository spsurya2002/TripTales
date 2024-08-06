import { Router } from "express";
import {
   getResponseFromAI,
   getAllChats,
   getAllreq
} from "../controllers/aiChat.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/getResponse").post(getResponseFromAI);   
router.route("/getChats").get(getAllChats); 
router.route("/getReq").get(getAllreq);  

export default router 