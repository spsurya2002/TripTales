import { Router } from "express";
import { 
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage,
    verifyEmail,
    checkAuth
 } from "../controllers/auth/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Register user with avatar and coverImage upload
router.route("/signup").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]), 
    registerUser
);
router.route("/check-auth").get( verifyJWT, checkAuth);
router.route("/login").post(loginUser);// User login

router.route("/logout").post(verifyJWT, logoutUser);// User logout with JWT verification

router.route("/verify-email").post( verifyEmail);//verify email

router.route("/forgot-password").post(forgotPassword);// Forgot password route
router.route("/reset-password/:token").post( resetPassword);
router.route("/refresh-token").post(refreshAccessToken);// Refresh access token

router.route("/change-password").put(verifyJWT, changeCurrentPassword);// Change current user password (requires JWT verification)

router.route("/get-user").get(verifyJWT, getCurrentUser);// Get current user data (requires JWT verification)

router.route("/update-account").put(verifyJWT, updateAccountDetails);// Update account details (requires JWT verification)

router.route("/update-avatar").put(verifyJWT, upload.single("avatar"), updateAvatar);// Update avatar (requires JWT verification and avatar upload)

router.route("/update-coverImage").put(verifyJWT, upload.single("coverImage"), updateCoverImage);// Update cover image (requires JWT verification and coverImage upload)

export default router;



































// import { Router } from "express";
// import { 
//     registerUser,
//     loginUser,
//     logoutUser,
//     refreshAccessToken,
//     changeCurrentPassword,
//     getCurrentUser,
//     updateAccountDetails,
//     updateAvatar,
//     updatecoverImage,
//  } from "../controllers/user.controller.js";
// import {upload} from "../middlewares/multer.middleware.js"
// import { verifyJWT } from "../middlewares/auth.middleware.js";
// const router = Router()

// router.route("/register").post(
//     upload.fields([
//         {
//             name:"avatar",
//             maxCount:1
//         },
//         {
//             name:"coverImage",
//             maxCount:1 
//         }
//     ]),
//     registerUser)
//     router.route("/login").post(loginUser);
//     router.route("/logout").post(verifyJWT,logoutUser);
//     router.route("/refresh-token").post(refreshAccessToken);
//     router.route("/change-password").post(verifyJWT, changeCurrentPassword);
//     router.route("/get-user").get(verifyJWT, getCurrentUser);
//     router.route("/update-account").post(verifyJWT, updateAccountDetails);
//     router.route("/update-avatar").post(verifyJWT, upload.single("avatar"), updateAvatar);
//     router.route("/update-coverImage").post( verifyJWT, upload.single("coverImage"), updatecoverImage);
// export default router