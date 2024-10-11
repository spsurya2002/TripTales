import { Router } from "express";
import { 
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage,
 } from "../controllers/auth/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Register user with avatar and coverImage upload
router.route("/register").post(
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

// User login
router.route("/login").post(loginUser);

// User logout with JWT verification
router.route("/logout").post(verifyJWT, logoutUser);
// Forgot password route

router.route("/forgot-password").post(forgotPassword);
// Refresh access token
router.route("/refresh-token").post(refreshAccessToken);

// Change current user password (requires JWT verification)
router.route("/change-password").put(verifyJWT, changeCurrentPassword);


// Get current user data (requires JWT verification)
router.route("/get-user").get(verifyJWT, getCurrentUser);

// Update account details (requires JWT verification)
router.route("/update-account").put(verifyJWT, updateAccountDetails);

// Update avatar (requires JWT verification and avatar upload)
router.route("/update-avatar").put(verifyJWT, upload.single("avatar"), updateAvatar);

// Update cover image (requires JWT verification and coverImage upload)
router.route("/update-coverImage").put(verifyJWT, upload.single("coverImage"), updateCoverImage);

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