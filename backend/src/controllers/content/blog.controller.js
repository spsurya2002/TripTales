import { Blog } from "../../models/content/blog.model.js";
import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../../models/auth/user.model.js"
import {ApiError} from "../../utils/ApiError.js"
import {ApiResponse} from "../../utils/ApiResponse.js"
import {asyncHandler} from "../../utils/asyncHandler.js"
import {uploadOnCloudinary,deleteFromCloudinary} from "../../utils/cloudinary.js"

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
        new ApiResponse(200, blogs, "Recent Blog found Successfully")
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

const updateBlogByID = asyncHandler(async (req, res) => {
    const { blogId } = req.params;
  
    // Validate blogId
    if (!isValidObjectId(blogId)) {
      throw new ApiError(400, "Invalid blogId!!");
    }
  
    const { blogTitle, description } = req.body;
  
    // Validate required fields (title and description)
    if ([blogTitle, description].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "Title and description of the blog are required");
    }
  
    // Initialize update data with blog title and description
    const updateData = {
      blogTitle,
      description,
    };
  
    // Check if image is provided in the request and upload it
    const imageLocalPath = req.file?.path;
    if (imageLocalPath) {
      const image = await uploadOnCloudinary(imageLocalPath);
      if (!image) {
        throw new ApiError(400, "Failure occurred while uploading the image to Cloudinary");
      }
  
      // Add image data to the update object if an image is provided
      updateData.image = {
        url: image.url,
        public_id: image.public_id,
      };
    }
  
    // Update the blog with the provided data
    const blog = await Blog.findByIdAndUpdate(blogId, updateData, { new: true });
  
    // Check if the blog was updated
    if (!blog) {
      throw new ApiError(400, "Blog can't be updated!!");
    }
  
    // Send success response
    return res.status(200).json(new ApiResponse(200, blog, "Blog updated successfully"));
  });
  const deleteBlogByID = asyncHandler(async (req, res) => {
    const { blogId } = req.params;
  
    // Validate blogId
    if (!isValidObjectId(blogId)) {
      throw new ApiError(400, "Invalid blogId!!");
    }
  
    // Find the blog by ID
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }
  
    // Optional: If you store images on cloud (e.g., Cloudinary), delete the image
    if (blog.image?.public_id) {
      await deleteFromCloudinary(blog.image.public_id); // Delete image from Cloudinary
    }
  
    // Delete the blog
    await Blog.deleteOne({ _id: blogId });
  
    // Send response
    return res.status(200).json(new ApiResponse(200, null, "Blog deleted successfully"));
  });
  

export {
    postBlog,
    getAllBlogs,
    getRecentBlogs,
    getBlogById,
    updateBlogByID,
    deleteBlogByID
}