import mongoose, {isValidObjectId} from "mongoose"
import {Album} from "../models/album.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary,deleteFromCloudinary} from "../utils/cloudinary.js"

const uploadAlbum = asyncHandler(  async(req,res)=>{
    
    const { albumName, description} = req.body
    if(
        [albumName, description].some((field)=>field?.trim()==="")) {
        throw new ApiError(400,"title and description of album is required")
    }

     const imageLocalPaths = req.files?.image?.map(file => file.path);
    if (!imageLocalPaths || imageLocalPaths.length === 0) {
      throw new ApiError(400, "At least one image is required");
    }
    
    const images = await Promise.all(
        imageLocalPaths.map(async (path) => {
          const uploadedimage = await uploadOnCloudinary(path);
          if (!uploadedimage) {
            throw new ApiError(400, "Failure occurred while uploading images to Cloudinary");
          }
          return {
            url: uploadedimage.url,
            public_id: uploadedimage.public_id,
          };
        })
      );
   
      const album = await Album.create({
        albumName,
        description,
        images,
        owner: req.user?._id,
      });
      const createdAlbum = await Album.findById(album._id);
      if (!createdAlbum) {
        throw new ApiError(400, "Failure occurred while creating album in the database");
      }
    return res
        .status(200)
        .json(new ApiResponse(200,createdAlbum,"FROM ALBUM!"))
});

const updateAlbum = asyncHandler(async (req, res) => {
    const { albumId } = req.params
    //TODO: update album details like title, description
    if(!isValidObjectId(albumId)){
        throw new ApiError(400, "invalid videoId!!");
    }
    const album = await Album.findById(albumId);
    if(!album){
        throw new ApiError(400, "album not found!!");
    }
    const albumOwner = album.owner;
    const userId = req.user?._id;
    console.log(albumOwner,userId);
    if(!userId.equals(albumOwner)){
        throw new ApiError(400, "not a valid user to delete video!!");
    }
    const { albumName, description} = req.body
    if(
        [albumName, description].some((field)=>field?.trim()==="")) {
        throw new ApiError(400,"albumName and description of album is required")
    }
    
    const updatedAlbum = await Album.findByIdAndUpdate(albumId,
        {
            $set:{
              albumName,
              description,
            }
          },
          {new:true}
    )

    if(!updateAlbum){
        throw new ApiError(400,"failure occured at update album on db!!")
      }
      return res
          .status(200)
          .json(new ApiResponse(200,updateAlbum,"album updated  successfully!!"))
})//done
const getAlbumById = asyncHandler(async (req, res) => {
    const { albumId } = req.params;
    if(!isValidObjectId(albumId)){
        throw new ApiError(400, "invalid albumId!!");
    }
    const album = await Album.findById(albumId);
    if(!album){
        throw new ApiError(400,`No album found in DB of ${albumId} id!!`)
    }
    return res
    .status(200)
    .json(new ApiResponse(200,album,"album found of this id"))

})

const getAllAlbums = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    console.log(page, limit , query, sortBy, sortType, userId);


    const albums = await Album.find().limit(limit);
    if(!albums){
        throw new ApiError(400 , "Somthing went worng in finding albums from db!!");
    }
    return res
    .status(200)
    .json(new ApiResponse(200,albums,"Albums found successfully!!"))

})
const deleteAlbum = asyncHandler(async (req, res) => {
    const { albumId } = req.params
    //TODO: delete album
    if(!isValidObjectId(albumId)){
        throw new ApiError(400, "invalid albumId!!");
    }
    const album = await Album.findById(albumId);
    if(!album){
        throw new ApiError(400, "album not found!!");
    }
    const albumOwner = album.owner;
    const userId = req.user?._id;
    
    if(!userId.equals(albumOwner)){
        throw new ApiError(400, "not a valid user to delete album!!");
    }
    
    const deletedAlbum = await Album.findByIdAndDelete(albumId);
    if(!deletedAlbum){
        throw new ApiError(400, "something went wrong while deleting album from db!!");
    }
    //To delete images from cloudinary---->
    // const videoPublicId = video.videoFile.public_id;
    // const videodeletedFromCloudinary = await deleteFromCloudinary(videoPublicId,"video");
    // const thumbnailPublicId = video.thumbnail.public_id;
    // const thumbnaildeletedFromCloudinary = await deleteFromCloudinary(thumbnailPublicId);
   
    return res
    .status(200)
    .json(new ApiResponse(200,"album deleted successfully!!"))
})//done

export{
    uploadAlbum,
    updateAlbum,
    getAlbumById,
    getAllAlbums,
    deleteAlbum
}