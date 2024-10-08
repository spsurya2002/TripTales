import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../../models/content/video.model.js"
import {User} from "../../models/auth/user.model.js"
import {ApiError} from "../../utils/ApiError.js"
import {ApiResponse} from "../../utils/ApiResponse.js"
import {asyncHandler} from "../../utils/asyncHandler.js"
import {uploadOnCloudinary,deleteFromCloudinary} from "../../utils/cloudinary.js"

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
    console.log('here')
    const { title, description} = req.body
    if(
        [title, description].some((field)=>field?.trim()==="")) {
        throw new ApiError(400,"title and description of video is required")
    }
    
    const videoLocalPath = req.files?.videoFile[0]?.path;
    if (!videoLocalPath) {
      throw new ApiError(400,"video file is required")
    }
  
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    if (!thumbnailLocalPath) {
        throw new ApiError(400,"thumbnail  is required")
    }
  
    const videoFile = await uploadOnCloudinary(videoLocalPath);
      if (!videoFile) {
      throw new ApiError(400,"failure occured at upload video on cloudinary!!")
    }
    console.log(videoFile);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail) {
        throw new ApiError(400,"failure occured at upload thumbnail on cloudinary!!")
    }
  
    const video =  await  Video.create({
      title,
      description,
      videoFile: {
        url: videoFile.url,
        public_id: videoFile.public_id
        },
      thumbnail: {
        url: thumbnail.url,
        public_id: thumbnail.public_id
        },
      owner:req.user?._id,
      duration:videoFile.duration,
    })

    const createdVideo = await Video.findById(video._id);
    if(!createdVideo){
      throw new ApiError(400,"failure occured at create video on db!!")
    }
    return res
        .status(200)
        .json(new ApiResponse(200,createdVideo,"video uploaded  successfully!!"))
})//done

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    console.log(page, limit , query, sortBy, sortType, userId);


    const data = await Video.find().limit(limit);
    if(!data){
        throw new ApiError(400 , "Somthing went worng in finding video from db!!");
    }
    return res
    .status(200)
    .json(new ApiResponse(200,data,"video found successfully!!"))

})//done

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "invalid videoId!!");
    }
    const data = await Video.findById(videoId);
    if(!data){
        throw new ApiError(400,`No video found in DB of ${videoId} id!!`)
    }
    return res
    .status(200)
    .json(new ApiResponse(200,data,"video found of this id"))

})//done

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "invalid videoId!!");
    }
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(400, "video not found!!");
    }
    const videoOwner = video.owner;
    const userId = req.user?._id;
    console.log(videoOwner,userId);
    if(!userId.equals(videoOwner)){
        throw new ApiError(400, "not a valid user to delete video!!");
    }
    const { title, description} = req.body
    if(
        [title, description].some((field)=>field?.trim()==="")) {
        throw new ApiError(400,"title and description of video is required")
    }
    const thumbnailLocalPath = req.file?.path;
    if (!thumbnailLocalPath) {
        throw new ApiError(400,"thumbnail  is required")
    }
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail) {
        throw new ApiError(400,"failure occured at upload thumbnail on cloudinary!!")
    }
    const updatedVideo = await Video.findByIdAndUpdate(videoId,
        {
            $set:{
              title,
              description,
              thumbnail: {
                url: thumbnail.url,
                public_id: thumbnail.public_id
                }
            }
          },
          {new:true}
    )

    if(!updateVideo){
        throw new ApiError(400,"failure occured at update video on db!!")
      }
      return res
          .status(200)
          .json(new ApiResponse(200,updatedVideo,"video updated  successfully!!"))
})//done

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "invalid videoId!!");
    }
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(400, "video not found!!");
    }
    const videoOwner = video.owner;
    const userId = req.user?._id;
    
    if(!userId.equals(videoOwner)){
        throw new ApiError(400, "not a valid user to delete video!!");
    }
    
    const deletedVideo = await Video.findByIdAndDelete(videoId);
    if(!deletedVideo){
        throw new ApiError(400, "something went wrong while deleting video from db!!");
    }
    const videoPublicId = video.videoFile.public_id;
    const videodeletedFromCloudinary = await deleteFromCloudinary(videoPublicId,"video");
    const thumbnailPublicId = video.thumbnail.public_id;
    const thumbnaildeletedFromCloudinary = await deleteFromCloudinary(thumbnailPublicId);
   
    return res
    .status(200)
    .json(new ApiResponse(200,{videodeletedFromCloudinary,thumbnaildeletedFromCloudinary},"video deleted successfully!!"))
})//done

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}