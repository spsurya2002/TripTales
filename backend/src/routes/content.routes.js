import { Router } from "express";
//imports for album
import {
   uploadAlbum,
   updateAlbum,
   getAlbumById,
   getAllAlbums,
   deleteAlbum
} from "../controllers/content.album.controller.js";
//imports for videos
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    changeThumbnail
 } from "../controllers/content.video.controller.js";
 //imports for blogs
import {
    postBlog,
    getAllBlogs,
    getRecentBlogs,
    getBlogById,
    updateBlogByID,
    deleteBlogByID
  } from "../controllers/content.blog.controller.js";


import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(verifyJWT);


//Routes For albums
router.route("/albums")
   .post(upload.fields([{ name: 'image', maxCount: 10 }]), uploadAlbum) // Create/upload an album
   .get(getAllAlbums); // Get all albums
router.route("/albums/:albumId")
   .get(getAlbumById)  // Get album by ID
   .put(updateAlbum)    // Update an album by ID
   .delete(deleteAlbum); // Delete an album by ID


//Routes For videos
router.route("/videos")
    .post(upload.fields([
      {
          name: "video",
          maxCount: 1
      },
      {
          name: "thumbnail",
          maxCount: 1
      }
  ]), publishAVideo) // Upload a new video (single file)
    .get(getAllVideos); // Get all videos

router.route("/videos/:videoId")
    .get(getVideoById)    // Get video by ID
    .put(updateVideo)     // Update video by ID
    .delete(deleteVideo); // Delete video by ID
router.route("/videos/change-thumbnail/:videoId")
    .put(upload.single("thumbnail"), changeThumbnail);


//Routes for blog content    
router.route("/blogs")
    .post(upload.single("picture"),postBlog)       // Create a new blog
    .get(getAllBlogs);    // Get all blogs

router.route("/blogs/recent")
    .get(getRecentBlogs); // Get recent blogs

router.route("/blogs/:blogId")
    .get(getBlogById)      // Get a specific blog by ID
    .put(upload.single("image"),updateBlogByID)   // Update a blog by ID
    .delete(deleteBlogByID); // Delete a blog by ID


export default router;










// import { Router } from "express";
// import {
//    uploadAlbum,
//    updateAlbum,
//    getAlbumById,
//    getAllAlbums,
//    deleteAlbum
// } from "../controllers/content/album.controller.js"
// import {upload} from "../middlewares/multer.middleware.js"
// import { verifyJWT } from "../middlewares/auth.middleware.js";

// const router = Router();
// router.use(verifyJWT);

// router.route("/upload-album").post(
//     upload.fields([
//       { name: 'image', maxCount: 10 },
//     ]),
//     uploadAlbum )
// router.route("/update-album/:albumId").post(updateAlbum); 
// router.route("/get-album-ByID/:albumId").get(getAlbumById);  
// router.route("/get-all-albums").get(getAllAlbums);  
// router.route("/delete-album/:albumId").delete(deleteAlbum);  
// export default router 

