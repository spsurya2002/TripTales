import { Router } from "express";

import { 
    postBlog,
    getAllBlogs,
    getRecentBlogs,
    getBlogById,
    updateBlogByID
} from "../controllers/blog.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/post-blog").post(upload.single("image"),postBlog); 
router.route("/get-blog").get(getAllBlogs);
router.route("/get-recent-blogs").get(getRecentBlogs);
router.route("/get-blog-byID/:blogId").get(getBlogById);
router.route("/update-blog-byID/:blogId").post(upload.single("image"),updateBlogByID);

export default router