import { Router } from "express";
import {
   uploadAlbum,
   updateAlbum,
   getAlbumById,
   getAllAlbums,
   deleteAlbum
} from "../controllers/album.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/upload-album").post(
    upload.fields([
      { name: 'image', maxCount: 10 },
    ]),
    uploadAlbum )
router.route("/update-album/:albumId").post(upload.single("thumbnail"),updateAlbum); 
router.route("/get-album-ByID/:albumId").get(getAlbumById);  
router.route("/get-all-albums").get(getAllAlbums);  
router.route("/delete-album/:albumId").post(deleteAlbum);  
export default router 