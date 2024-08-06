import { Blog } from "../models/blog.model.js";
import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary,deleteFromCloudinary} from "../utils/cloudinary.js"

const postBlog = asyncHandler (async (req,res)=>{

        const {blogTitle,description} = req.body;
        if(
            [blogTitle, description].some((field)=>field?.trim()==="")) {
            throw new ApiError(400,"title and description of blog is required")
        }
        
        const imageLocalPath  = req.file?.path;
        if (!imageLocalPath) {
        throw new ApiError(400,"image  is required")
      }
      const image = await uploadOnCloudinary(imageLocalPath);
      if (!image) {
          throw new ApiError(400,"failure occured at upload image on cloudinary!!")
      }
      
        const blog =  await  Blog.create({
            blogTitle,
            description,
            image:{
                url: image.url,
                public_id: image.public_id
            },
            owner:req.user?._id
          });
          const createdBlog = await Blog.findById(blog._id);
          if (!createdBlog) {
            throw new ApiError(400, "Failure occurred while creating Blog in the database");
          }
          return res.status(201).json(
            new ApiResponse(200, createdBlog, "Blog created Successfully")
        )
    
});

const getAllBlogs = asyncHandler (async (req,res)=>{
   
    const blogs = await Blog.find().sort({ createdAt: -1 });
     if(!blogs){
        throw new ApiError(400,"No blogs found in DB!!")
     }
      return res.status(201).json(
        new ApiResponse(200, blogs, "Blogs found Successfully")
    )
 
});

const getRecentBlogs = asyncHandler (async (req,res)=>{
    
    const blogs = await Blog.find().sort({ createdAt: -1 }).limit(3);
     if(!blogs){
        throw new ApiError(400,"No blogs found in DB!!")
     }
      return res.status(201).json(
        new ApiResponse(200, blog, "Recent Blog found Successfully")
    )
 
});

const getBlogById = asyncHandler (async (req,res)=>{
    
    const { blogId } = req.params;
    if(!isValidObjectId(blogId)){
        throw new ApiError(400, "invalid blogId!!");
    }
    const blog = await Blog.findById(blogId);
     if(!blog){
        throw new ApiError(400,"No blogs found in DB of this id!!")
     }
     
      return res.status(201).json(
        new ApiResponse(200, blog, "Blog found Successfully")
    )

});

const updateBlogByID = asyncHandler (async (req,res)=>{
    
    const {blogId} = req.params;
    if(!isValidObjectId(blogId)){
        throw new ApiError(400, "invalid blogId!!");
    }
    const { blogTitle, description} = req.body;
    if(
        [blogTitle, description].some((field)=>field?.trim()==="")) {
        throw new ApiError(400,"title and description of blog is required")
    }
    const imageLocalPath  = req.file?.path;
    if (!imageLocalPath) {
    throw new ApiError(400,"image  is required")
  }
  const image = await uploadOnCloudinary(imageLocalPath);
  if (!image) {
      throw new ApiError(400,"failure occured at upload image on cloudinary!!")
  }
    const blog = await Blog.findByIdAndUpdate(blogId, { blogTitle, description, image:{
        url: image.url,
        public_id: image.public_id
    }, },{new:true});
     if(!blog){
        throw new ApiError(400,"blog can't be updated!!")
     }
      return res.status(201).json(
        new ApiResponse(200, blog, "Blog updated Successfully")
    )

})


export {
    postBlog,
    getAllBlogs,
    getRecentBlogs,
    getBlogById,
    updateBlogByID

}